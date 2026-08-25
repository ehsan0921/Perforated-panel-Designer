import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

const stages = [
  { id: "01", label: "SLAB FIXING", title: "Anchor to the slab edge.", copy: "The horizontal base plate is fixed to the concrete with two anchors. Elongated slots provide in-and-out tolerance before the anchors are tightened to the engineered setting.", metric: "2 SLOTTED ANCHORS", focus: "base" },
  { id: "02", label: "MULLION FIXING", title: "Connect the curtain wall.", copy: "The vertical return plate bolts to the aluminium mullion. The compact J form keeps the interface close to the façade line while preserving installation access.", metric: "BOLTED INTERFACE", focus: "mullion" },
  { id: "03", label: "ADJUSTMENT", title: "Set level, line and plumb.", copy: "Top and side adjustment screws provide controlled fine tuning during installation. Final load path, capacity and locking requirements remain subject to the project engineer’s bracket design.", metric: "3-AXIS SET-OUT", focus: "adjust" },
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
  const select = (index: number) => setActive(index);

  return <section ref={ref} className="bracket-lab bracket-v2" data-focus={stages[active].focus} onPointerMove={move} onPointerLeave={reset} aria-labelledby="bracket-title">
    <div className="bracket-grid" aria-hidden />
    <div className="bracket-visual">
      <div className="bracket-halo" aria-hidden />
      <div className="bracket-image-wrap"><img src="/facade-j-bracket-assembly-v2.webp" alt="Galvanized façade J-bracket connecting an aluminium curtain-wall mullion to a concrete slab edge" /></div>
      <button className="bracket-hotspot hotspot-base" type="button" onClick={() => select(0)} aria-label="Inspect slotted slab anchors"><i /><span>SLOTTED SLAB ANCHORS</span></button>
      <button className="bracket-hotspot hotspot-mullion" type="button" onClick={() => select(1)} aria-label="Inspect mullion fixing"><i /><span>MULLION FIXING PLATE</span></button>
      <button className="bracket-hotspot hotspot-adjust" type="button" onClick={() => select(2)} aria-label="Inspect adjustment screws"><i /><span>ADJUSTMENT SCREWS</span></button>
      <div className="bracket-scan" aria-hidden />
    </div>
    <div className="bracket-copy">
      <div className="bracket-kicker"><span>CONNECTION STUDY / J‑BRACKET</span><span>CLICK THE FIXINGS</span></div>
      <p className="bracket-overline">FACADE TOLERANCE, MADE VISIBLE</p>
      <h2 id="bracket-title">A small connection.<br /><em>Three controlled interfaces.</em></h2>
      <div className="bracket-stage-copy" key={active}><span>{stages[active].label} / {stages[active].id}</span><h3>{stages[active].title}</h3><p>{stages[active].copy}</p><strong>{stages[active].metric}</strong></div>
      <div className="bracket-tabs" role="tablist" aria-label="J-bracket interfaces">{stages.map((stage, index) => <button key={stage.id} type="button" role="tab" aria-selected={active === index} className={active === index ? "is-active" : ""} onClick={() => select(index)}><span>{stage.id}</span>{stage.label}</button>)}</div>
    </div>
    <div className="bracket-coordinate" aria-hidden><span>MULLION</span><span>J‑BRACKET</span><span>SLAB EDGE</span></div>
  </section>;
}
