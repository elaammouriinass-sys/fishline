"use client";

import React, { useEffect, useRef } from "react";

export default function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Particle bubbles
    const bubbles: Array<{ x: number; y: number; radius: number; speed: number; opacity: number }> = [];
    for (let i = 0; i < 35; i++) {
      bubbles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.5 + 1,
        speed: Math.random() * 0.6 + 0.3,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    let step = 0;

    const render = () => {
      step += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle luminous wave ribbons
      for (let j = 0; j < 3; j++) {
        ctx.beginPath();
        const yOffset = height * 0.75 + j * 40;
        ctx.moveTo(0, yOffset);

        for (let x = 0; x <= width; x += 30) {
          const y = yOffset + Math.sin(x * 0.003 + step + j * 1.5) * 22 + Math.cos(x * 0.001 - step) * 12;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, yOffset - 30, 0, height);
        if (j === 0) {
          grad.addColorStop(0, "rgba(2, 132, 199, 0.08)");
          grad.addColorStop(1, "rgba(3, 23, 38, 0.4)");
        } else if (j === 1) {
          grad.addColorStop(0, "rgba(45, 169, 228, 0.06)");
          grad.addColorStop(1, "rgba(3, 23, 38, 0.6)");
        } else {
          grad.addColorStop(0, "rgba(12, 74, 110, 0.12)");
          grad.addColorStop(1, "rgba(3, 23, 38, 0.9)");
        }
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Draw rising bubbles
      bubbles.forEach((b) => {
        b.y -= b.speed;
        if (b.y < -10) {
          b.y = height + 10;
          b.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${b.opacity})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-70"
    />
  );
}
