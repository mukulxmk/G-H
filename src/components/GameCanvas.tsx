"use client";

import { useEffect, useRef, useState } from "react";
import { Engine } from "@/src/engine/core/Engine";
import type { EngineStatus } from "@/src/engine/types";
import { TestScene } from "../game/scenes/TestScene";
import { TestWorld } from "../game/worlds/TestWorld";

export default function GameCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<Engine | null>(null);

  const [status, setStatus] = useState<EngineStatus>("idle");

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;

    if (!container || !canvas) return;

    const engine = new Engine(canvas);
    engineRef.current = engine;

    engine.initialize();

    engine.setScene(new TestScene(new TestWorld()));

    const resize = () => {
      const { width, height } =
        container.getBoundingClientRect();

      engine.resize(width, height);
    };

    // Set initial size
    resize();

    // Watch the actual game container
    const resizeObserver = new ResizeObserver(() => {
      resize();
    });

    resizeObserver.observe(container);

    engine.start();
    setStatus(engine.getStatus());

    return () => {
      resizeObserver.disconnect();
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  const pause = () => {
    engineRef.current?.pause();

    if (engineRef.current) {
      setStatus(engineRef.current.getStatus());
    }
  };

  const resume = () => {
    engineRef.current?.resume();

    if (engineRef.current) {
      setStatus(engineRef.current.getStatus());
    }
  };

  const stop = () => {
    engineRef.current?.stop();

    if (engineRef.current) {
      setStatus(engineRef.current.getStatus());
    }
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
          bottom: 20,
          right: 20,
          color: "white",
          zIndex: 10,
        }}
      >
        Status: {status}
      </div>
    </div>
  );
}