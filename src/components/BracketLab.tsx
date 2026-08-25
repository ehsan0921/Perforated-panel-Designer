import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

const stages = [
  { id: "01", label: "ANCHOR", title: "Lock the datum.", copy: "Slotted anchors absorb construction tolerance while a governed set-out keeps the bracket inside its structural zone.", metric: "±20 mm" },
  { id: "02", label: "TRANSFER", title: "Direct the load.", copy: "Every plate, bolt and weld is coordinated as one load path—from curtain wall mullion to slab edge.", metric: "1 PATH" },
  { id: "03", label: "VERIFY", title: "Close the interface.", copy: "Model geometry, metadata and issue ownership converge before fabrication information is released.", metric: "LOD 350" },
];

export function BracketLab() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const move = (event: ReactPointerEvent<HTMLElement>) => {
    const box = ref.current?.getBoundingClientRect();
    if (!box) return;
    ref.current.style.setProperty("--bx", (((event.clientX - box.left) / box.width) - 0.5).toFixed(3));
    ref.current.style.setProperty("--by", (((event.clientY - box.top) / box.height) - 0.5).toFixed(3));
  };
  const reset = () => { ref.current?.style.setProperty("--bx", "0"); ref.current?.style.setProperty("--by", "0"); };

  return <section ref={ref} className="bracket-lab" onPointerMove={move} onPointerLeave={reset} aria-labelledby="bracket-title">
    <div className="bracket-grid" aria-hidden />
    <div className="bracket-visual" aria-hidden>
      <div className="bracket-halo" />
      <div className="bracket-image-wrap"><video src="/j-bracket-motion.mp4" poster="/j-bracket-motion-poster.jpg" autoPlay loop muted playsInline preload="metadata" tabIndex={-1} /><img src="/facade-bracket-steel-clash.png" alt="" /></div>
      <span className="bracket-reticle bracket-reticle-a">A</span><span className="bracket-reticle bracket-reticle-b">B</span><span className="bracket-reticle bracket-reticle-c">C</span>
      <div className="bracket-scan" />
    </div>
    <div className="bracket-copy">
      <div className="bracket-kicker"><span>02 / CONNECTION INTELLIGENCE</span><span>LIVE MODEL STUDY</span></div>
      <p className="bracket-overline">MOVE YOUR CURSOR TO INSPECT</p>
      <h2 id="bracket-title">A small connection.<br /><em>A complete system.</em></h2>
      <div className="bracket-stage-copy" key={active}><span>{stages[active].label} / {stages[active].id}</span><h3>{stages[active].title}</h3><p>{stages[active].copy}</p><strong>{stages[active].metric}</strong></div>
      <div className="bracket-tabs" role="tablist" aria-label="Connection stages">
        {stages.map((stage, index) => <button key={stage.id} type="button" role="tab" aria-selected={active === index} className={active === index ? "is-active" : ""} onClick={() => setActive(index)}><span>{stage.id}</span>{stage.label}</button>)}
      </div>
    </div>
    <div className="bracket-coordinate" aria-hidden><span>X 1240.50</span><span>Y 0864.20</span><span>Z +03.450</span></div>
  </section>;
}
