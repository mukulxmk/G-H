export class Input {
  private keys = new Set<string>();
  private pressedKeys = new Set<string>();
  private releasedKeys = new Set<string>();

  private initialized = false;

  initialize() {
    if (this.initialized) return;

    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);

    this.initialized = true;
  }

  isKeyDown(key: string) {
    return this.keys.has(key.toLowerCase());
  }

  isKeyPressed(key: string) {
    return this.pressedKeys.has(key.toLowerCase());
  }

  isKeyReleased(key: string) {
    return this.releasedKeys.has(key.toLowerCase());
  }

  update() {
    this.pressedKeys.clear();
    this.releasedKeys.clear();
  }

  destroy() {
    if (!this.initialized) return;

    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);

    this.keys.clear();
    this.pressedKeys.clear();
    this.releasedKeys.clear();

    this.initialized = false;
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();

    if (!this.keys.has(key)) {
      this.pressedKeys.add(key);
    }

    this.keys.add(key);
  };

  private handleKeyUp = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();

    this.keys.delete(key);
    this.releasedKeys.add(key);
  };
}