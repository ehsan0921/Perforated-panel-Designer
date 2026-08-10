import { useEffect, useRef, useState } from "react";

const beats = [
  { at: "00 / BIM FRAMEWORK", title: "Model the intent.", copy: "A controlled wireframe establishes grids, levels, geometry ownership and a reliable shared coordinate system." },
  { at: "01 / STRUCTURE", title: "Coordinate the slabs.", copy: "Floor plates, columns and edge conditions are resolved first—setting the interfaces every facade assembly depends on." },
  { at: "02 / INTERFACES", title: "Own every connection.", copy: "Brackets, embeds, steelwork and tolerances are assigned, reviewed and closed before they become site problems." },
  { at: "03 / FACADE DELIVERY", title: "Build the envelope.", copy: "Panels and glazing move from coordinated BIM information into sequenced, fabrication-ready facade delivery." },
];

export function CinematicScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;
    let frame = 0;
    let progress = 0;
    let visible = false;
    const syncVideo = () => {
      if (!visible || video.readyState < 1 || !Number.isFinite(video.duration) || video.duration <= 0) return;
      const target = progress * Math.max(0, video.duration - 0.05);
      if (Math.abs(video.currentTime - target) > 0.04) {
        try { video.currentTime = target; } catch { /* not seekable yet */ }
      }
    };
    const update = () => {
      const rect = section.getBoundingClientRect();
      const distance = Math.max(1, section.offsetHeight - window.innerHeight);
      progress = Math.min(1, Math.max(0, -rect.top / distance));
      section.style.setProperty("--cinema-progress", progress.toFixed(4));
      section.dataset.beat = String(Math.min(beats.length - 1, Math.floor(progress * beats.length)));
      syncVideo();
    };
    const onScroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    const onReady = () => { video.pause(); setVideoReady(true); update(); };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) update();
    }, { rootMargin: "100% 0px 100% 0px" });
    observer.observe(section);
    video.addEventListener("loadedmetadata", onReady);
    video.addEventListener("canplay", onReady);
    video.load();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); video.removeEventListener("loadedmetadata", onReady); video.removeEventListener("canplay", onReady); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);
  return <section className="cinema-scroll" ref={sectionRef} aria-label="Facade delivery story">
    <div className="cinema-sticky">
      <div className={`cinema-frames ${videoReady ? "is-video-ready" : ""}`} aria-hidden><img className="cinema-frame cinema-frame-a" src="/atlassian-bim-wireframe.webp" alt="" /><video ref={videoRef} className="cinema-video" src="/cinema-atlassian-scroll.mp4" poster="/atlassian-bim-wireframe.webp" muted playsInline preload="auto" tabIndex={-1} /><div className="cinema-grid" /></div>
      <div className="cinema-topline"><span>ATLASSIAN CENTRAL / SYDNEY</span><span>BIM → STRUCTURE → FACADE</span></div>
      <div className="cinema-beats">{beats.map((beat, index) => <article key={beat.at} className="cinema-beat" data-index={index}><span>{beat.at}</span><h2>{beat.title}</h2><p>{beat.copy}</p></article>)}</div>
      <div className="cinema-progress"><i /><span>SCROLL TO DIRECT</span></div>
    </div>
  </section>;
}
