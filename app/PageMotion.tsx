"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export function PageMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add(
        { reduceMotion: "(prefers-reduced-motion: reduce)" },
        (context) => {
          const reduceMotion = Boolean(context.conditions?.reduceMotion);
          const sections = gsap.utils.toArray<HTMLElement>("[data-motion-section]");
          const revealItems = gsap.utils.toArray<HTMLElement>("[data-reveal]");

          if (reduceMotion) {
            gsap.set(revealItems, { autoAlpha: 1, x: 0, y: 0 });
            return;
          }

          gsap.set(revealItems, { autoAlpha: 0, y: 28 });

          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const items = entry.target.querySelectorAll<HTMLElement>("[data-reveal]");
                gsap.to(items, {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.82,
                  stagger: 0.09,
                  ease: "power3.out",
                  overwrite: "auto",
                });
                observer.unobserve(entry.target);
              });
            },
            { threshold: 0.12, rootMargin: "0px 0px -10% 0px" },
          );

          sections.forEach((section) => observer.observe(section));

          gsap.utils.toArray<HTMLElement>(".system-travel-dot").forEach((dot) => {
            const rail = dot.parentElement;
            const labels = rail?.querySelectorAll<HTMLElement>("span");
            const start = () => (labels?.[0]?.offsetWidth ?? 90) + 22;
            const end = () =>
              Math.max(start() + 80, (rail?.clientWidth ?? 420) - (labels?.[1]?.offsetWidth ?? 90) - 22);

            gsap.fromTo(
              dot,
              { x: start, autoAlpha: 0.35 },
              {
                x: end,
                autoAlpha: 1,
                duration: 3.2,
                repeat: -1,
                repeatDelay: 0.18,
                repeatRefresh: true,
                ease: "none",
              },
            );
          });

          gsap.to(".source-wave i", {
            scaleY: (index) => 0.65 + (index % 5) * 0.14,
            duration: 0.72,
            stagger: { each: 0.08, from: "random" },
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            transformOrigin: "center bottom",
          });

          gsap.to(".event-sequence i", {
            scale: 1.5,
            y: -5,
            autoAlpha: 0.58,
            duration: 0.62,
            stagger: 0.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });

          gsap.to(".sync-data-path-raw, .sync-data-path-behaviour", {
            strokeDashoffset: -28,
            duration: 1.4,
            repeat: -1,
            ease: "none",
          });

          gsap.to(".sync-data-path-output", {
            strokeDashoffset: -28,
            duration: 1.05,
            repeat: -1,
            ease: "none",
          });

          gsap.to(".sync-merge-core", {
            scale: 1.14,
            boxShadow: "0 0 24px rgba(239, 195, 106, 0.36)",
            duration: 0.8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });

          gsap.to(".capture-card-1 .capture-bands i", {
            scaleY: (index) => 0.55 + (index % 4) * 0.13,
            duration: 0.75,
            stagger: { each: 0.07, from: "center" },
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            transformOrigin: "center bottom",
          });

          gsap.to(".capture-card-2 .capture-bands i", {
            scale: 1.55,
            autoAlpha: 0.48,
            duration: 0.52,
            stagger: 0.1,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });

          gsap.to(".capture-card-3 .capture-bands i", {
            y: (index) => (index % 2 === 0 ? -14 : -5),
            duration: 0.72,
            stagger: 0.08,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });

          gsap.to(".capture-card-4 .capture-bands i", {
            scaleY: (index) => 0.46 + index * 0.045,
            duration: 1.05,
            stagger: 0.08,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut",
            transformOrigin: "center bottom",
          });

          gsap.to(".capture-status-dot", {
            scale: 1.65,
            autoAlpha: 0.4,
            duration: 0.9,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });

          gsap.to(".generated-visual-image", {
            filter: "brightness(1.07) saturate(1.06)",
            duration: 5.2,
            stagger: 0.45,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });

          gsap.fromTo(
            ".generated-visual-sweep",
            { xPercent: -145, autoAlpha: 0 },
            {
              xPercent: 145,
              autoAlpha: 0.46,
              duration: 2.4,
              stagger: 0.7,
              repeat: -1,
              repeatDelay: 3.2,
              ease: "power2.inOut",
            },
          );

          gsap.fromTo(
            ".classifier-confidence i",
            { scaleX: 0 },
            {
              scaleX: (_, target) => Number(target.style.getPropertyValue("--confidence")),
              duration: 1.1,
              stagger: 0.18,
              delay: 0.35,
              ease: "power3.out",
              transformOrigin: "left center",
            },
          );

          return () => observer.disconnect();
        },
      );

      return () => media.revert();
    },
    { scope },
  );

  return <main ref={scope}>{children}</main>;
}
