export interface Component {
  initialize(): void;
  update(deltaTime: number): void;
  destroy(): void;
}