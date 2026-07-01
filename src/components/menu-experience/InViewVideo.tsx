"use client";

import { useEffect, useRef, useState } from "react";

export default function InViewVideo({
  src,
  poster,
  className = "",
  fadeIn = false,
}: {
  src: string;
  poster?: string;
  className?: string;
  fadeIn?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let inView = false;
    const tryPlay = () => {
      if (!inView) return;
      el.play()
        .then(() => setPlaying(true))
        .catch(() => {
          el.addEventListener("canplay", tryPlay, { once: true });
        });
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) {
          if (el.preload === "none") el.preload = "auto";
          tryPlay();
        } else {
          el.pause();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);

    const onVis = () => {
      if (document.hidden) el.pause();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      className={`${className} ${fadeIn ? "transition-opacity duration-500" : ""} ${
        fadeIn && !playing ? "opacity-0" : ""
      }`}
      onError={(e) => {
        (e.currentTarget as HTMLVideoElement).style.display = "none";
      }}
    />
  );
}
