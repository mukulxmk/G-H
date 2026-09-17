import type { WorldDefinition } from "./WorldDefiniton";
import type {
  WorldElementState,
  WorldState,
} from "./WorldState";
import type { WorldElement } from "./elements/WorldElement";

export class WorldRuntime {
  private readonly elementStates = new Map<
    string,
    WorldElementState
  >();

  private readonly elementsById = new Map<
    string,
    WorldElement
  >();

  constructor(
    private readonly definition: WorldDefinition,
    state: WorldState
  ) {
    if (state.worldId !== definition.id) {
      throw new Error(
        `World state "${state.worldId}" does not match ` +
        `world definition "${definition.id}".`
      );
    }

    for (const element of definition.elements) {
      if (this.elementsById.has(element.id)) {
        throw new Error(
          `Duplicate world element id "${element.id}".`
        );
      }

      this.elementsById.set(element.id, element);
    }

    for (const elementState of state.elements) {
      if (!this.elementsById.has(elementState.elementId)) {
        throw new Error(
          `World state references unknown element ` +
          `"${elementState.elementId}".`
        );
      }

      this.elementStates.set(
        elementState.elementId,
        elementState
      );
    }
  }

  getDefinition() {
    return this.definition;
  }

  getElementState(elementId: string) {
    return this.elementStates.get(elementId);
  }

  getElement(elementId: string) {
    return this.elementsById.get(elementId);
  }

  isElementActive(element: WorldElement) {
    const state = this.elementStates.get(element.id);

    if (!state) {
      return true;
    }

    if (state.destroyed) {
      return false;
    }

    if (state.active === false) {
      return false;
    }

    return true;
  }

  getResolvedElement(elementId: string) {
    const visited = new Set<string>();

    let currentId = elementId;

    while (true) {
      if (visited.has(currentId)) {
        throw new Error(
          `Circular world element replacement detected: ` +
          `"${currentId}".`
        );
      }

      visited.add(currentId);

      const element = this.elementsById.get(currentId);

      if (!element) {
        throw new Error(
          `World element "${currentId}" does not exist.`
        );
      }

      const state = this.elementStates.get(currentId);

      if (!state?.replacementId) {
        return element;
      }

      currentId = state.replacementId;
    }
  }

  getActiveElements() {
    const replacementTargets = new Set<string>();

    for (const state of this.elementStates.values()) {
      if (state.replacementId) {
        replacementTargets.add(state.replacementId);
      }
    }

    const resolvedElements = new Map<
      string,
      WorldElement
    >();

    for (const element of this.definition.elements) {
      if(element.replacementOnly) {
        continue;
      }
    
      if (replacementTargets.has(element.id)) {
        continue;
      }

      if (!this.isElementActive(element)) {
        continue;
      }

      const resolvedElement =
        this.getResolvedElement(element.id);

      resolvedElements.set(
        resolvedElement.id,
        resolvedElement
      );
    }

    return [...resolvedElements.values()].sort(
      (a, b) => a.zIndex - b.zIndex
    );
  }

  setElementState(state: WorldElementState) {
    if (!this.elementsById.has(state.elementId)) {
      throw new Error(
        `Cannot update unknown world element ` +
        `"${state.elementId}".`
      );
    }

    if (state.replacementId) {
      if (
        !this.elementsById.has(state.replacementId)
      ) {
        throw new Error(
          `Cannot replace "${state.elementId}" with ` +
          `unknown element "${state.replacementId}".`
        );
      }

      if (state.elementId === state.replacementId) {
        throw new Error(
          `World element "${state.elementId}" ` +
          `cannot replace itself.`
        );
      }

      this.validateReplacementChain(
        state.elementId,
        state.replacementId
      );
    }

    this.elementStates.set(
      state.elementId,
      state
    );
  }

  replaceElement(
    elementId: string,
    replacementId: string
  ) {
    this.setElementState({
      elementId,
      active: true,
      destroyed: false,
      replacementId,
    });
  }

  destroyElement(elementId: string) {
    this.setElementState({
      elementId,
      destroyed: true,
      active: false,
    });
  }

  restoreElement(elementId: string) {
    this.setElementState({
      elementId,
      destroyed: false,
      active: true,
    });
  }

  clearReplacement(elementId: string) {
    const existingState =
      this.elementStates.get(elementId);

    if (!existingState) {
      return;
    }

    this.elementStates.set(elementId, {
      ...existingState,
      replacementId: undefined,
    });
  }

  getState(): WorldState {
    return {
      worldId: this.definition.id,

      elements: [...this.elementStates.values()].map(
        (state) => ({
          ...state,
        })
      ),
    };
  }

  private validateReplacementChain(
    elementId: string,
    replacementId: string
  ) {
    const visited = new Set<string>();

    let currentId = replacementId;

    while (true) {
      if (visited.has(currentId)) {
        throw new Error(
          `Circular world element replacement detected.`
        );
      }

      visited.add(currentId);

      if (currentId === elementId) {
        throw new Error(
          `Replacement would create a circular reference ` +
          `for "${elementId}".`
        );
      }

      const state =
        this.elementStates.get(currentId);

      if (!state?.replacementId) {
        return;
      }

      currentId = state.replacementId;
    }
  }
}