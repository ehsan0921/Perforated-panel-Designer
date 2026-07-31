import { useEffect, useRef } from "react";

const beats = [
  { at: "00", title: "See the whole system.", copy: "Scroll through the layers that turn ambitious facade geometry into coordinated, buildable information." },
  { at: "01", title: "Expose the interfaces.", copy: "Structure, brackets, panels and tolerances are read as one connected delivery problem." },
  { at: "02", title: "Resolve before site.", copy: "Decisions become visible, owned and traceable long before they become expensive." },
];

export function CinematicScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let frame = 0;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const distance = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / distance));
      section.style.setProperty("--cinema-progress", progress.toFixed(4));
      section.dataset.beat = String(Math.min(2, Math.floor(progress * 3)));
      const video = videoRef.current;
      if (video?.duration && Number.isFinite(video.duration)) video.currentTime = progress * Math.max(0, video.duration - 0.04);
    };
    const onScroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);
  return <section className="cinema-scroll" ref={sectionRef} aria-label="Facade delivery story">
    <div className="cinema-sticky">
      <div className="cinema-frames" aria-hidden><img className="cinema-frame cinema-frame-a" src="/bim-exploded-hero.png" alt="" /><img className="cinema-frame cinema-frame-b" src="/facade-bracket-steel-clash.png" alt="" /><video ref={videoRef} className="cinema-video" src="/cinema-facade-scroll.mp4" poster="/bim-exploded-hero.png" muted playsInline preload="auto" tabIndex={-1} /><div className="cinema-grid" /></div>
      <div className="cinema-topline"><span>SCROLL FILM / 001</span><span>FACADE DELIVERY</span></div>
      <div className="cinema-beats">{beats.map((beat, index) => <article key={beat.at} className="cinema-beat" data-index={index}><span>{beat.at}</span><h2>{beat.title}</h2><p>{beat.copy}</p></article>)}</div>
      <div className="cinema-progress"><i /><span>SCROLL TO DIRECT</span></div>
    </div>
  </section>;
}
