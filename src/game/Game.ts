import { Engine } from "../engine/core/Engine";
import { TestScene } from "./scenes/TestScene";
import { TestWorld2 } from "./worlds/TestWorld2";
import { HomeWorld } from "./worlds/home/HomeWorld";
import { GameScene } from "./scenes/GameScene";
import { TestWorld } from "./worlds/TestWorld";
import { testWorldState } from "./worlds/TestWorldState";
import { testWorldDefinition } from "./worlds/TestWorldDefinition";

export class Game {
    private initialized = false;
    private engine: Engine | null = null;

    constructor(engine: Engine) {
        this.engine = engine;
    }
    
    initialize(){
        if(this.initialized) return;
console.log(this.engine);

        const world = new TestWorld()
        const scene = new GameScene(world);

        this.engine?.setScene(scene);
        
        this.initialized = true;
    }

    update(deltaTime: number) {
        if(!this.initialized) return;
    }

    destroy(){
        if(this.initialized = false) return;
        this.initialized = false;
    }
}