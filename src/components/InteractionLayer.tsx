import { useEffect, useRef } from "react";

export function InteractionLayer() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let ringX = targetX;
    let ringY = targetY;
    const render = () => {
      ringX += (targetX - ringX) * 0.14;
      ringY += (targetY - ringY) * 0.14;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      frame = requestAnimationFrame(render);
    };
    const move = (event: PointerEvent) => { targetX = event.clientX; targetY = event.clientY; };
    const over = (event: PointerEvent) => document.documentElement.classList.toggle("cursor-is-active", !!(event.target as HTMLElement).closest("a, button, [data-cursor]"));
    const leave = () => document.documentElement.classList.add("cursor-is-away");
    const enter = () => document.documentElement.classList.remove("cursor-is-away");
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
    };
  }, []);

  return <div className="cursor-system" aria-hidden><div ref={ringRef} className="cursor-ring" /><div ref={dotRef} className="cursor-dot" /></div>;
}
