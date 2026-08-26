import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

type TrackPoint = readonly [progress: number, x: number, y: number];

const anchorTracks: Record<string, readonly TrackPoint[]> = {
  facade: [[0, .482, .18], [.2, .486, .18], [.4, .5, .17], [.6, .51, .15], [.8, .52, .12], [1, .53, .08]],
  slab: [[0, .84, .79], [.2, .87, .8], [.4, .89, .81], [.6, .91, .83], [.8, .93, .85], [1, .95, .87]],
  gap: [[0, .36, .74], [.2, .33, .74], [.4, .28, .72], [.6, .22, .7], [.8, .17, .66], [1, .13, .61]],
  rl: [[0, .445, .31], [.2, .43, .28], [.4, .4, .25], [.6, .36, .18], [.8, .33, .13], [1, .3, .08]],
  anchor: [[0, .65, .73], [.2, .65, .72], [.4, .66, .7], [.6, .67, .69], [.8, .68, .66], [1, .69, .63]],
};

const pointOnTrack = (track: readonly TrackPoint[], progress: number) => {
  const nextIndex = track.findIndex(([at]) => at >= progress);
  if (nextIndex <= 0) return track[0];
  if (nextIndex === -1) return track[track.length - 1];
  const previous = track[nextIndex - 1];
  const next = track[nextIndex];
  const mix = (progress - previous[0]) / Math.max(.0001, next[0] - previous[0]);
  return [progress, previous[1] + (next[1] - previous[1]) * mix, previous[2] + (next[2] - previous[2]) * mix] as const;
};

const checks = [
  { id: "00", label: "FEDERATE", title: "Bring every interface into one model.", copy: "Concrete, façade, structure and the bracket zone are reviewed in the same coordinates before the slab geometry is released.", metric: "MODEL FEDERATED", focus: "federate" },
  { id: "01", label: "CLEARANCE", title: "Prove the slab-to-curtain-wall distance.", copy: "Measure the modelled slab edge to the curtain-wall datum, then compare actual clearance against the project minimum, installation tolerance and movement allowance.", metric: "ACTUAL ≥ REQUIRED", focus: "clearance" },
  { id: "02", label: "RL + SET-OUT", title: "Check level before concrete is poured.", copy: "Verify top-of-slab RL, façade datum, bracket level and slab-edge profile. Any variance is issued while the formwork and reinforcement can still be corrected.", metric: "RL / OFFSET VERIFIED", focus: "rl" },
  { id: "03", label: "PRE-POUR HOLD", title: "Close the coordination hold-point.", copy: "Confirm no geometric clash, a clear anchor or cast-in zone, installation access and reviewed edge/reinforcement constraints—then record the responsible team’s sign-off.", metric: "COORDINATION PASS", focus: "pass" },
];

export function BracketLab() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef(0);
  const [active, setActive] = useState(0);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const video = videoRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      section.style.setProperty("--bracket-progress", progress.toFixed(4));
      const imageWrap = imageWrapRef.current;
      if (imageWrap && imageWrap.clientWidth > 0 && imageWrap.clientHeight > 0) {
        const sourceWidth = video?.videoWidth || 2560;
        const sourceHeight = video?.videoHeight || 1440;
        const frameWidth = imageWrap.clientWidth;
        const frameHeight = imageWrap.clientHeight;
        const scale = Math.max(frameWidth / sourceWidth, frameHeight / sourceHeight);
        const renderedWidth = sourceWidth * scale;
        const renderedHeight = sourceHeight * scale;
        Object.entries(anchorTracks).forEach(([name, track]) => {
          const [, x, y] = pointOnTrack(track, progress);
          const mappedX = ((x * renderedWidth - (renderedWidth - frameWidth) / 2) / frameWidth) * 100;
          const mappedY = ((y * renderedHeight - (renderedHeight - frameHeight) / 2) / frameHeight) * 100;
          imageWrap.style.setProperty(`--${name}-x`, `${Math.min(96, Math.max(4, mappedX)).toFixed(2)}%`);
          imageWrap.style.setProperty(`--${name}-y`, `${Math.min(94, Math.max(6, mappedY)).toFixed(2)}%`);
        });
      }
      setActive(Math.min(checks.length - 1, Math.floor(progress * checks.length)));
      if (video && !reducedMotion.matches && Number.isFinite(video.duration) && video.duration > 0 && !video.seeking) {
        const targetTime = progress * Math.max(0, video.duration - 0.04);
        if (Math.abs(video.currentTime - targetTime) > 0.025) video.currentTime = targetTime;
      }
    };
    const onScroll = () => { cancelAnimationFrame(frameRef.current); frameRef.current = requestAnimationFrame(update); };
    const onVideoReady = () => { setVideoReady(true); update(); };
    update();
    video?.addEventListener("loadedmetadata", onVideoReady);
    video?.addEventListener("canplay", onVideoReady, { once: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frameRef.current);
      video?.removeEventListener("loadedmetadata", onVideoReady);
      video?.removeEventListener("canplay", onVideoReady);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const move = (event: ReactPointerEvent<HTMLDivElement>) => {
    const box = stageRef.current?.getBoundingClientRect();
    if (!box || !sectionRef.current) return;
    sectionRef.current.style.setProperty("--bx", (((event.clientX - box.left) / box.width) - 0.5).toFixed(3));
    sectionRef.current.style.setProperty("--by", (((event.clientY - box.top) / box.height) - 0.5).toFixed(3));
  };
  const reset = () => { sectionRef.current?.style.setProperty("--bx", "0"); sectionRef.current?.style.setProperty("--by", "0"); };
  const jumpTo = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const top = window.scrollY + section.getBoundingClientRect().top;
    const travel = Math.max(1, section.offsetHeight - window.innerHeight);
    window.scrollTo({ top: top + travel * (index / (checks.length - 1)), behavior: "smooth" });
  };

  return <section ref={sectionRef} className="bracket-scroll" aria-label="Scroll-controlled pre-pour façade bracket coordination check">
    <div className="bracket-sticky">
      <div ref={stageRef} className="bracket-lab bracket-v3" data-focus={checks[active].focus} data-phase={active} onPointerMove={move} onPointerLeave={reset} aria-labelledby="bracket-title">
        <div className="bracket-grid" aria-hidden />
        <div className="bracket-visual">
          <div className="bracket-halo" aria-hidden />
          <div ref={imageWrapRef} className={`bracket-image-wrap${videoReady ? " is-video-ready" : ""}`}>
            <img src="/facade-j-bracket-higgsfield-v3.webp" alt="Galvanized façade J-bracket coordinated between an aluminium curtain-wall mullion and concrete slab edge" />
            <video ref={videoRef} src="/facade-j-bracket-higgsfield-2k-v4.mp4" poster="/facade-j-bracket-higgsfield-v3.webp" muted playsInline preload="auto" tabIndex={-1} aria-hidden />
            <div className="tracked-callouts" aria-hidden>
              <span className="tracked-callout callout-facade"><i /><span><b>01 / BIM DATUM</b><strong>Façade line check</strong><small>Grid, set-out + offset aligned</small><em>TRACKING</em></span></span>
              <span className="tracked-callout callout-slab"><i /><span><b>02 / MODEL EDGE</b><strong>Slab edge check</strong><small>Profile + projection verified</small><em>ALIGNED</em></span></span>
              <span className="tracked-callout callout-gap is-amber"><i /><span><b>03 / CLEARANCE</b><strong>Façade-to-slab gap</strong><small>Actual gap ≥ required gap</small><em>PASS</em></span></span>
              <span className="tracked-callout callout-rl"><i /><span><b>04 / LEVEL</b><strong>Bracket RL check</strong><small>RL matched to façade datum</small><em>VERIFIED</em></span></span>
              <span className="tracked-callout callout-anchor is-amber"><i /><span><b>05 / ANCHORS</b><strong>Bolt distance check</strong><small>Centres, edge distance + access</small><em>PASS</em></span></span>
            </div>
          </div>
          <div className="check-slab-plane" aria-hidden><span>TOP OF SLAB / RL DATUM</span></div>
          <div className="check-facade-datum" aria-hidden><span>CURTAIN WALL DATUM</span></div>
          <div className="check-clearance" aria-hidden><i /><b /><span>MODELLED CLEARANCE<br /><strong>ACTUAL ≥ REQUIRED</strong></span></div>
          <div className="check-anchor-zone" aria-hidden><span>ANCHOR / CAST-IN<br />EXCLUSION ZONE</span></div>
          <div className="check-rl" aria-hidden><i /><span>Δ RL CHECKED</span></div>
          <div className="check-pass" aria-hidden><i>✓</i><span>PRE-POUR BIM CHECK</span><strong>COORDINATION PASS</strong><small>SUBJECT TO PROJECT TEAM SIGN-OFF</small></div>
          <div className="bracket-scan" aria-hidden />
        </div>
        <div className="bracket-copy">
          <div className="bracket-kicker"><span>PRE-POUR BIM HOLD-POINT</span><span>SCROLL TO RUN CHECK</span></div>
          <p className="bracket-overline">FACADE BRACKET / SLAB EDGE COORDINATION</p>
          <h2 id="bracket-title">Check it in BIM.<br /><em>Correct it before concrete.</em></h2>
          <div className="bracket-stage-copy" key={active}><span>{checks[active].label} / {checks[active].id}</span><h3>{checks[active].title}</h3><p>{checks[active].copy}</p><strong>{checks[active].metric}</strong></div>
          <div className="bracket-tabs" role="tablist" aria-label="Pre-pour BIM checks">{checks.map((check, index) => <button key={check.id} type="button" role="tab" aria-selected={active === index} className={active === index ? "is-active" : ""} onClick={() => jumpTo(index)}><span>{check.id}</span>{check.label}</button>)}</div>
          <p className="bracket-disclaimer">Geometric coordination does not replace structural design, anchor verification or formal project approval.</p>
        </div>
        <div className="bracket-coordinate" aria-hidden><span>CONCRETE</span><span>TOLERANCE ZONE</span><span>CURTAIN WALL</span></div>
        <div className="bracket-scroll-progress" aria-hidden><i /><span>{String(active + 1).padStart(2, "0")} / 04</span></div>
      </div>
    </div>
  </section>;
}
