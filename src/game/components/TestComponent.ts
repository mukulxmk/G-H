import { Component } from "@/src/engine/entity/Component";

export class TestComponent implements Component {
  initialize() {
    console.log("component INITIALIZED");
  }

  update(deltaTime: number) {
// console.log("test compoennt UDPDATE")
  }

  destroy() {
    console.log("component DESTROYED");
  }
}