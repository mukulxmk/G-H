"use client";

import { useEffect, useRef, useState } from "react";

import { Engine } from "@/src/engine/core/Engine";
import type { EngineStatus } from "@/src/engine/types";
import { DebugStats } from "@/src/utils/DebugStats";

import { TestScene } from "../game/scenes/TestScene";
import { TestWorld } from "../game/worlds/TestWorld";
import { TestWorld2 } from "../game/worlds/TestWorld2";
import { SecondTestWorld } from "../game/worlds/TestWorld1";
import { Game } from "../game/Game";
import { testWorldDefinition } from "../game/worlds/TestWorldDefinition";
import { testWorldState } from "../game/worlds/TestWorldState";

export default function GameCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<Engine | null>(null);

  const [status, setStatus] = useState<EngineStatus>("idle");
  const [fps, setFps] = useState(0);
  const [delta, setDelta] = useState("0.00 ms");
  const [elapsed, setElapsed] = useState("00:00.000");

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const engine = new Engine(canvas);

    const game = new Game(engine)
    // 3. Register Game's update with Engine
    engine.setApplicationUpdate(
      (deltaTime) => game.update(deltaTime)
    );

    // 4. Initialize both
    game.initialize();
    engineRef.current = engine;
    engine.initialize();

    // const handleKeyDown = (event: KeyboardEvent) => {
    //   if (event.key === "1") {
    //     engine.setScene(
    //       new TestScene(
    //         new TestWorld(
    //           engine.getInput(),
    //           engine.getCamera()
    //         )
    //       )
    //     );
    //   }

    //   if (event.key === "2") {
    //     engine.setScene(
    //       new TestScene(
    //         new TestWorld2(
    //           engine.getInput(),
    //           engine.getCamera()
    //         )
    //       )
    //     );
    //   }

    //   if (event.key === "3") {
    //     engine.setScene(
    //       new TestScene(
    //         new SecondTestWorld()
    //       )
    //     );
    //   }
    // };

    // window.addEventListener(
    //   "keydown",
    //   handleKeyDown
    // );

    // engine.setScene(
    //   new TestScene(
    //     new TestWorld(
    //       engine.getInput(),
    //       engine.getCamera()
    //     )
    //   )
    // );

    const resize = () => {
      const { width, height } =
        container.getBoundingClientRect();

      engine.resize(width, height);
    };
    resize();
    const resizeObserver =
      new ResizeObserver(() => {
        resize();
      });
    resizeObserver.observe(container);

    engine.start();

    setStatus(engine.getStatus());
    const statsInterval = window.setInterval(() => {
      setFps(DebugStats.fps());
      setDelta(DebugStats.delta());
      setElapsed((DebugStats.elapsed("mm:ss.SSS")).toString());
    }, 100);

    return () => {
      // window.removeEventListener(
      //   "keydown",
      //   handleKeyDown
      // );
      window.clearInterval(statsInterval);
      resizeObserver.disconnect();
      game.destroy();
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  const pause = () => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.pause();
    setStatus(engine.getStatus());
  };

  const resume = () => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.resume();
    setStatus(engine.getStatus());
  };

  const stop = () => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.stop();
    setStatus(engine.getStatus());
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          display: "flex",
          gap: 10,
          zIndex: 10,
        }}
      >
        <button
          onClick={pause}
          className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
        >
          Pause
        </button>

        <button
          onClick={resume}
          className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
        >
          Resume
        </button>

        <button
          onClick={stop}
          className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
        >
          Stop
        </button>
      </div>

      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 10,

          padding: "12px 16px",

          background: "rgba(0, 0, 0, 0.75)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 8,

          color: "#ffffff",

          fontFamily: "monospace",
          fontSize: 13,

          lineHeight: 1.6,

          minWidth: 170,

          pointerEvents: "none",
        }}
      >
        <div>
          <strong>ENGINE DEBUG</strong>
        </div>

        <div>
          Status: {status}
        </div>

        <div>
          FPS: {fps}
        </div>

        <div>
          Delta: {delta}
        </div>

        <div>
          Elapsed: {elapsed}
        </div>
      </div>
    </div>
  );
}