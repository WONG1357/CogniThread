"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type EegRendererOptions = {
  color: string;
  amplitude: number;
  reducedMotion: boolean;
};

function createEegRenderer(
  canvas: HTMLCanvasElement,
  { color, amplitude, reducedMotion }: EegRendererOptions,
) {
  const context = canvas.getContext("2d");
  if (!context) return () => {};

  let animationFrame = 0;
  let lastFrame = 0;
  let width = 0;
  let height = 0;
  let phase = Math.random() * 10;
  let previousSample = 0;
  let transientSpike = 0;
  let samples: number[] = [];

  const nextSample = () => {
    phase += 0.09 + Math.random() * 0.045;

    if (Math.random() < 0.014) {
      transientSpike += (Math.random() - 0.5) * 3.8;
    }
    transientSpike *= 0.68;

    const irregularNoise = (Math.random() - 0.5) * 1.9;
    const mixedRhythm =
      Math.sin(phase * 1.9) * 0.2 + Math.sin(phase * 0.47) * 0.13;
    const target = irregularNoise + mixedRhythm + transientSpike;

    previousSample = previousSample * 0.34 + target * 0.66;
    return previousSample;
  };

  const draw = () => {
    context.clearRect(0, 0, width, height);

    context.beginPath();
    context.strokeStyle = "rgba(239, 195, 106, 0.12)";
    context.lineWidth = 1;
    context.moveTo(0, height / 2);
    context.lineTo(width, height / 2);
    context.stroke();

    context.beginPath();
    samples.forEach((sample, index) => {
      const x = (index / Math.max(1, samples.length - 1)) * width;
      const y = height / 2 + Math.max(-height * 0.44, Math.min(height * 0.44, sample * amplitude));
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    context.strokeStyle = color;
    context.lineWidth = 1.35;
    context.lineJoin = "round";
    context.lineCap = "round";
    context.shadowColor = color;
    context.shadowBlur = 4;
    context.stroke();
    context.shadowBlur = 0;
  };

  const resize = () => {
    const bounds = canvas.getBoundingClientRect();
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    samples = Array.from(
      { length: Math.max(96, Math.ceil(width / 2)) },
      nextSample,
    );
    draw();
  };

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();

  const tick = (timestamp: number) => {
    if (timestamp - lastFrame >= 32) {
      samples.shift();
      samples.push(nextSample());
      draw();
      lastFrame = timestamp;
    }
    animationFrame = window.requestAnimationFrame(tick);
  };

  if (!reducedMotion) {
    animationFrame = window.requestAnimationFrame(tick);
  }

  return () => {
    window.cancelAnimationFrame(animationFrame);
    observer.disconnect();
  };
}

export function HeroSignalAnimation() {
  const container = useRef<HTMLDivElement>(null);
  const channelOne = useRef<HTMLCanvasElement>(null);
  const channelTwo = useRef<HTMLCanvasElement>(null);
  const synchronizedChannel = useRef<HTMLCanvasElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(useGSAP);
      const media = gsap.matchMedia();

      media.add(
        {
          isDesktop: "(min-width: 761px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isDesktop, reduceMotion } = context.conditions as {
            isDesktop: boolean;
            reduceMotion: boolean;
          };

          const renderers = [
            channelOne.current
              ? createEegRenderer(channelOne.current, {
                  color: "#efc36a",
                  amplitude: 10,
                  reducedMotion: reduceMotion,
                })
              : null,
            channelTwo.current
              ? createEegRenderer(channelTwo.current, {
                  color: "#f2a65a",
                  amplitude: 9,
                  reducedMotion: reduceMotion,
                })
              : null,
            synchronizedChannel.current
              ? createEegRenderer(synchronizedChannel.current, {
                  color: "#efc36a",
                  amplitude: 7,
                  reducedMotion: reduceMotion,
                })
              : null,
          ].filter((stop): stop is () => void => Boolean(stop));

          if (reduceMotion) {
            gsap.set(".signal-stage__piece", {
              autoAlpha: 1,
              x: 0,
              y: 0,
              scale: 1,
            });
            gsap.set(".emission-wave", { autoAlpha: 0 });
            return () => renderers.forEach((stop) => stop());
          }

          gsap.from(".signal-stage__piece", {
            autoAlpha: 0,
            y: 22,
            duration: 0.9,
            stagger: 0.1,
            ease: "power3.out",
          });

          gsap.to(".headband-orbit", {
            y: isDesktop ? -9 : -5,
            duration: 3.4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });

          const emissionWaves = Array.from(
            container.current?.querySelectorAll<HTMLElement>(".emission-wave") ?? [],
          );
          emissionWaves.forEach((wave, index) => {
            gsap.fromTo(
              wave,
              { scale: 0.62, autoAlpha: 0.48 },
              {
                scale: 1.55,
                autoAlpha: 0,
                duration: 2.35,
                delay: index * 0.78,
                repeat: -1,
                repeatDelay: 0.04,
                ease: "power1.out",
              },
            );
          });

          gsap.fromTo(
            ".behaviour-step-runner, .behaviour-step-gap",
            { x: -108 },
            {
              x: 412,
              duration: 2.6,
              repeat: -1,
              ease: "none",
              immediateRender: false,
            },
          );

          gsap.to(".sync-core", {
            scale: 1.14,
            duration: 0.78,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });

          gsap.to(".live-dot", {
            scale: 1.7,
            autoAlpha: 0.38,
            duration: 0.9,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });

          gsap.to(".event-card", {
            x: isDesktop ? -9 : -5,
            y: -4,
            duration: 2.1,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });

          return () => renderers.forEach((stop) => stop());
        },
      );

      return () => media.revert();
    },
    { scope: container },
  );

  return (
    <div
      className="signal-stage"
      ref={container}
      aria-label="Animated raw EEG and behavioural signals synchronizing into one timeline"
    >
      <div className="stage-label signal-stage__piece">
        <span><i className="live-dot" /> Session stream</span>
        <span>09:42:18</span>
      </div>

      <div className="headband-orbit signal-stage__piece">
        <span className="emission-wave emission-wave-one" />
        <span className="emission-wave emission-wave-two" />
        <span className="emission-wave emission-wave-three" />
        <img
          className="headband-photo"
          src="/senzeband-headband.png"
          alt="SenzeBand wearable EEG headband"
        />
      </div>

      <div className="sync-flow signal-stage__piece" aria-hidden="true">
        <div className="sync-lane sync-lane-eeg">
          <span className="lane-label">EEG RAW</span>
          <canvas className="sync-eeg-canvas" ref={synchronizedChannel} />
        </div>
        <div className="sync-lane sync-lane-behaviour">
          <span className="lane-label">BEHAVIOUR EVENT</span>
          <svg
            className="behaviour-step-trace"
            viewBox="0 0 520 32"
            preserveAspectRatio="none"
            focusable="false"
          >
            <defs>
              <mask id="behaviour-step-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="520" height="32">
                <rect width="520" height="32" fill="white" />
                <rect className="behaviour-step-gap" x="18" y="23" width="64" height="6" fill="black" />
              </mask>
            </defs>
            <path className="behaviour-step-baseline" d="M0 26H520" mask="url(#behaviour-step-mask)" />
            <g className="behaviour-step-runner">
              <path className="behaviour-moving-step" d="M0 26H18V8H82V26H108" />
            </g>
          </svg>
        </div>
        <div className="sync-core"><span>SYNC</span></div>
      </div>

      <div className="wave-panel signal-stage__piece">
        <div className="raw-channel">
          <div className="wave-label"><span>CH 01</span><strong>RAW EEG</strong></div>
          <canvas className="eeg-canvas" ref={channelOne} />
        </div>
        <div className="raw-channel">
          <div className="wave-label"><span>CH 02</span><strong>RAW EEG</strong></div>
          <canvas className="eeg-canvas" ref={channelTwo} />
        </div>
      </div>

      <div className="event-card signal-stage__piece">
        <span>Behaviour event</span>
        <strong>Correct response</strong>
        <em>Aligned · +02.4 s</em>
      </div>
    </div>
  );
}
