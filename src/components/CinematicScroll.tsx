import { useEffect, useRef, useState } from "react";

const beats = [
  { at: "00 / BIM FRAMEWORK", title: "Establish the rules.", copy: "Grids, levels, coordinates and model ownership create one dependable frame before detail begins." },
  { at: "01 / PRIMARY STRUCTURE", title: "Resolve the slab edge.", copy: "Structure, edge geometry and embeds define the physical zone available to every façade connection." },
  { at: "02 / FACADE INTERFACE", title: "Coordinate the bracket.", copy: "Fixings, adjustment, tolerances and access are tested where the curtain wall meets the building." },
  { at: "03 / DELIVERY", title: "Release with confidence.", copy: "The coordinated envelope becomes sequenced, traceable and ready for fabrication and site installation." },
];

export function CinematicScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const frameRef = useRef(0);
  const [videoReady, setVideoReady] = useState(false);
  const [activeBeat, setActiveBeat] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;
    const measure = () => {
      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, section.offsetHeight - window.innerHeight);
      targetRef.current = Math.min(1, Math.max(0, -rect.top / travel));
    };
    const render = () => {
      const delta = targetRef.current - currentRef.current;
      currentRef.current += delta * 0.16;
      if (Math.abs(delta) < 0.0005) currentRef.current = targetRef.current;
      const progress = currentRef.current;
      const nextBeat = Math.min(beats.length - 1, Math.floor(progress * beats.length));
      section.style.setProperty("--cinema-progress", progress.toFixed(4));
      section.dataset.beat = String(nextBeat);
      setActiveBeat((value) => value === nextBeat ? value : nextBeat);
      if (video.readyState >= 1 && Number.isFinite(video.duration) && video.duration > 0) {
        const targetTime = progress * Math.max(0, video.duration - 0.04);
        if (Math.abs(video.currentTime - targetTime) > 0.025 && !video.seeking) video.currentTime = targetTime;
      }
      if (Math.abs(targetRef.current - currentRef.current) > 0.0005) frameRef.current = requestAnimationFrame(render);
    };
    const update = () => { measure(); cancelAnimationFrame(frameRef.current); frameRef.current = requestAnimationFrame(render); };
    const ready = () => { video.pause(); setVideoReady(true); update(); };
    video.addEventListener("loadedmetadata", ready);
    video.addEventListener("canplay", ready);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    video.load();
    update();
    return () => {
      cancelAnimationFrame(frameRef.current);
      video.removeEventListener("loadedmetadata", ready);
      video.removeEventListener("canplay", ready);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const jumpTo = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const top = window.scrollY + section.getBoundingClientRect().top;
    const travel = Math.max(1, section.offsetHeight - window.innerHeight);
    window.scrollTo({ top: top + travel * (index / (beats.length - 1)), behavior: "smooth" });
  };

  return <section className="cinema-scroll" ref={sectionRef} aria-label="Scroll-controlled façade delivery film">
    <div className="cinema-sticky">
      <div className={`cinema-frames ${videoReady ? "is-video-ready" : ""}`} aria-hidden><img className="cinema-frame cinema-frame-a" src="/atlassian-bim-wireframe.webp" alt="" /><video ref={videoRef} className="cinema-video" src="/cinema-atlassian-scrub.mp4" poster="/atlassian-bim-wireframe.webp" muted playsInline preload="auto" tabIndex={-1} /><div className="cinema-grid" /></div>
      <div className="cinema-topline"><span>ATLASSIAN CENTRAL / DIGITAL DELIVERY</span><span>SCROLL CONTROLS THE FILM</span></div>
      <div className="cinema-beats">{beats.map((beat, index) => <article key={beat.at} className="cinema-beat" data-index={index}><span>{beat.at}</span><h2>{beat.title}</h2><p>{beat.copy}</p></article>)}</div>
      <nav className="cinema-chapters" aria-label="Jump to BIM film chapter">{beats.map((beat, index) => <button type="button" className={activeBeat === index ? "is-active" : ""} onClick={() => jumpTo(index)} aria-label={`Jump to ${beat.at}`} key={beat.at}><i /><span>{String(index + 1).padStart(2, "0")}</span></button>)}</nav>
      <div className="cinema-progress"><i /><span>{videoReady ? "SCROLL TO SCRUB" : "LOADING FILM"}</span></div>
    </div>
  </section>;
}
