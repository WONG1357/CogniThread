"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import "./ReportWheel.css";

const reports = [
  {
    label: "Executive overview",
    image: "/cognithread-report-1.png",
    pdf: "/cognithread-report-1.pdf",
    alt: "Page 1 of the CogniThread longitudinal cognitive monitoring report showing the executive overview and trend charts",
  },
  {
    label: "Trial detail",
    image: "/cognithread-report-2.png",
    pdf: "/cognithread-report-2.pdf",
    alt: "Page 2 of the CogniThread longitudinal cognitive monitoring report showing the matched trial dataset and response charts",
  },
  {
    label: "Interpretation and definitions",
    image: "/cognithread-report-3.png",
    pdf: "/cognithread-report-3.pdf",
    alt: "Page 3 of the CogniThread longitudinal cognitive monitoring report showing interpretation and metric definitions",
  },
];

const wrapIndex = (value: number) => ((value % reports.length) + reports.length) % reports.length;

export function ReportWheel() {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const positionRef = useRef(0);
  const targetRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const wheelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frameHandlerRef = useRef<((now: number) => void) | null>(null);
  const dragRef = useRef<{ y: number; start: number; id: number } | null>(null);
  const dragMovedRef = useRef(false);
  const lastFrameRef = useRef(0);
  const reducedMotionRef = useRef(false);
  const selectedRef = useRef(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const runFrame = useCallback((now: number) => {
    const deltaTime = Math.min((now - lastFrameRef.current) / 1000, 0.05);
    lastFrameRef.current = now;

    const target = targetRef.current;
    const current = positionRef.current;
    const smoothing = reducedMotionRef.current ? 1 : 220 / 1000;
    const blend = reducedMotionRef.current ? 1 : 1 - Math.exp(-deltaTime / smoothing);
    let next = current + (target - current) * blend;
    const settled = Math.abs(target - next) < 0.001;
    if (settled) next = target;
    positionRef.current = next;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      let distance = index - next;
      distance = ((distance % reports.length) + reports.length) % reports.length;
      if (distance > reports.length / 2) distance -= reports.length;

      const absoluteDistance = Math.abs(distance);
      const x = distance * 38;
      const y = distance * -22;
      const rotation = distance * 4.5;
      const scale = 1 - Math.min(absoluteDistance, 2) * 0.055;

      card.style.transform = `translate(-50%, -50%) translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) rotate(${rotation.toFixed(3)}deg) scale(${scale.toFixed(4)})`;
      card.style.opacity = String(Math.max(0.2, 1 - absoluteDistance * 0.25));
      card.style.filter = absoluteDistance > 0.45 ? `blur(${(absoluteDistance * 0.22).toFixed(2)}px)` : "none";
      card.style.zIndex = String(100 - Math.round(absoluteDistance * 10));
    });

    animationRef.current = settled
      ? null
      : requestAnimationFrame((frame) => frameHandlerRef.current?.(frame));
  }, []);

  const startAnimation = useCallback(() => {
    if (animationRef.current !== null) return;
    lastFrameRef.current = performance.now();
    animationRef.current = requestAnimationFrame((frame) => frameHandlerRef.current?.(frame));
  }, []);

  const applyTarget = useCallback(
    (value: number, snap: boolean) => {
      const nextTarget = snap ? Math.round(value) : value;
      targetRef.current = nextTarget;
      const nextIndex = wrapIndex(Math.round(nextTarget));

      if (nextIndex !== selectedRef.current) {
        selectedRef.current = nextIndex;
        setSelectedIndex(nextIndex);
      }

      startAnimation();
    },
    [startAnimation],
  );

  useEffect(() => {
    frameHandlerRef.current = runFrame;
    return () => {
      frameHandlerRef.current = null;
    };
  }, [runFrame]);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    applyTarget(targetRef.current, false);

    return () => {
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
    };
  }, [applyTarget]);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const delta = event.deltaMode === 1 ? event.deltaY * 24 : event.deltaY;
      const step = Math.max(-1, Math.min(1, delta / 180));
      applyTarget(targetRef.current + step, false);

      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = setTimeout(() => applyTarget(targetRef.current, true), 140);
    };

    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      element.removeEventListener("wheel", handleWheel);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
    };
  }, [applyTarget]);

  const handlePointerDown = useCallback((event: PointerEvent<HTMLDivElement>) => {
    dragRef.current = { y: event.clientY, start: targetRef.current, id: event.pointerId };
    dragMovedRef.current = false;
    setIsDragging(true);
  }, []);

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag) return;

      const distance = event.clientY - drag.y;
      if (!dragMovedRef.current && Math.abs(distance) > 4) {
        dragMovedRef.current = true;
        rootRef.current?.setPointerCapture(drag.id);
      }

      if (dragMovedRef.current) applyTarget(drag.start - distance / 180, false);
    },
    [applyTarget],
  );

  const handlePointerEnd = useCallback(() => {
    if (!dragRef.current) return;
    dragRef.current = null;
    setIsDragging(false);
    if (dragMovedRef.current) applyTarget(targetRef.current, true);
  }, [applyTarget]);

  const handleCardClick = useCallback(
    (index: number) => {
      if (dragMovedRef.current) return;

      const current = targetRef.current;
      const currentIndex = wrapIndex(Math.round(current));
      let distance = index - currentIndex;
      if (distance > reports.length / 2) distance -= reports.length;
      if (distance < -reports.length / 2) distance += reports.length;
      applyTarget(current + distance, true);
    },
    [applyTarget],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      let delta = 0;
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") delta = -1;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") delta = 1;
      if (!delta) return;

      event.preventDefault();
      applyTarget(Math.round(targetRef.current) + delta, true);
    },
    [applyTarget],
  );

  const selectedReport = reports[selectedIndex];

  return (
    <div
      ref={rootRef}
      className={`report-wheel${isDragging ? " report-wheel--dragging" : ""}`}
      role="listbox"
      tabIndex={0}
      aria-label="CogniThread report pages"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onKeyDown={handleKeyDown}
    >
      <div className="report-wheel-stage">
        {reports.map((report, index) => (
          <button
            key={report.pdf}
            ref={(element) => {
              cardRefs.current[index] = element;
            }}
            className={`report-wheel-card${selectedIndex === index ? " report-wheel-card--selected" : ""}`}
            type="button"
            role="option"
            aria-selected={selectedIndex === index}
            aria-label={`Show ${report.label}`}
            onClick={() => handleCardClick(index)}
          >
            <img src={report.image} alt={report.alt} />
            <span className="report-wheel-page-chip">PAGE {index + 1} / 3</span>
          </button>
        ))}
      </div>

      <div className="report-wheel-rail" aria-hidden="true">
        <span className="report-wheel-rail-label">REPORT PAGES</span>
        <i />
        <strong>{String(selectedIndex + 1).padStart(2, "0")}</strong>
        <span>{selectedReport.label}</span>
      </div>

      <div className="report-wheel-meta">
        <span>Drag or scroll to rotate</span>
        <a href={selectedReport.pdf} target="_blank" rel="noreferrer">
          Open selected PDF ↗
        </a>
      </div>
    </div>
  );
}
