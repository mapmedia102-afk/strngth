'use client';
import { useEffect } from 'react';
import { ALL_EXERCISES, MUSCLE_IMAGES, BADGE_IMAGES } from '@/lib/strngth/exercises';

// Module-level storage keeps Image objects alive for the full session.
// Once an HTMLImageElement has loaded its src, the browser keeps the decoded
// bitmap in memory. Any <img> that later uses the same URL skips decode
// entirely and paints instantly — even after React unmounts/remounts the page.
const _seen = new Set<string>();
const _refs: HTMLImageElement[] = [];

const SPLIT_IMAGES = [
  '/strngth/splits/abs.png',
  '/strngth/splits/back.png',
  '/strngth/splits/biceps.png',
  '/strngth/splits/calves.png',
  '/strngth/splits/chest.png',
  '/strngth/splits/forearms.png',
  '/strngth/splits/hamstrings.png',
  '/strngth/splits/quads.png',
  '/strngth/splits/shoulders.png',
];

function preload(src: string) {
  if (!src || _seen.has(src)) return;
  _seen.add(src);
  const img = new window.Image();
  img.src = src;
  _refs.push(img);
}

export default function ImagePreloader() {
  useEffect(() => {
    const run = () => {
      // Always-used small sets — preload first
      Object.values(MUSCLE_IMAGES).forEach(src => preload(src!));
      Object.values(BADGE_IMAGES).forEach(src => preload(src!));
      SPLIT_IMAGES.forEach(preload);

      // Exercise images: dark + light variant for each
      ALL_EXERCISES.forEach(ex => {
        if (!ex.image) return;
        preload(ex.image);
        preload(ex.image.replace(/(-v2)?\.png$/, (_, v2) => `-light${v2 ?? ''}.png`));
      });
    };

    if ('requestIdleCallback' in window) {
      (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => void })
        .requestIdleCallback(run, { timeout: 4000 });
    } else {
      const t = setTimeout(run, 800);
      return () => clearTimeout(t);
    }
  }, []);

  return null;
}
