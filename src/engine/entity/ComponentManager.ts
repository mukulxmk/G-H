import { Component } from "./Component";

export class ComponentManager {
  private readonly components = new Set<Component>();

  add(component: Component) {
    if (this.components.has(component)) return;

    this.components.add(component);
    component.initialize();
  }

  remove(component: Component) {
    if (!this.components.has(component)) return;

    component.destroy();
    this.components.delete(component);
  }

  update(deltaTime: number) {
    for (const component of this.components) {
      component.update(deltaTime);
    }
  }

  destroy() {
    for (const component of this.components) {
      component.destroy();
    }

    this.components.clear();
  }
}