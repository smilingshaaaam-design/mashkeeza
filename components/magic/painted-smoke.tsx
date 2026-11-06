
    
  
"use client";

import React, { useEffect, useRef } from "react";

/**
 * MagicalSmoke - purple / blue / golden mixed realistic smoke
 *
 * - Asli dhuan: noise se bane naram, patchy gubaar (puffs), jo ghoomte, phailte aur ghul jaate hain
 * - Rang mix: golden, purple aur blue ek dusre mein ghul-mil jaate hain
 * - Nali se nikal kar pehle NEECHAY jaata hai, wahan twist hota hai, phir upar ribbon ban kar behta hai
 * - Haroof aur symbols jugnu ki tarah jalte bujhte aur tairte hain
 *
 * Props:
 *  originX / originY : nali ki position (canvas ke relative, 0-1)
 *  direction         : "left" (default) ya "right"
 *  spiral            : "down" (default) | "under" | "over"
 *  drift             : ribbon ki lambai (1 = normal)
 *  speed             : 1 = dheemi natural speed
 *  glyphs            : apne haroof
 *  debug             : true = nali par laal nishan
 */

const DEFAULT_GLYPHS = [
  "الرَّحْمَٰنُ", "الرَّحِيمُ", "الْمَلِكُ", "الْقُدُّوسُ", "السَّلَامُ",
  "النُّورُ", "الْهَادِي", "الْبَاقِي", "الْحَيُّ", "الْقَيُّومُ",
  "الم", "يس", "طه", "حم", "ق", "ن",
  "ا", "ب", "ج", "د", "ه", "و",
  "☉", "☽", "☿", "♀", "♂", "♃", "♄",
];

// golden + purple + blue ka mix
const SMOKE_HUES = [44, 40, 46, 275, 282, 268, 292, 215, 222, 205, 232];

const TAU = Math.PI * 2;
const rand = (a: number, b: number) => Math.random() * (b - a) + a;
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const smooth = (a: number, b: number, x: number) => {
  const v = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return v * v * (3 - 2 * v);
};

interface Props {
  originX?: number;
  originY?: number;
  glyphs?: string[];
  direction?: "left" | "right";
  spiral?: "down" | "under" | "over";
  drift?: number;
  speed?: number;
  debug?: boolean;
}

type Kind = "puff" | "wisp" | "glyph" | "spark";
type Wind = { x: number; y: number; px: number; py: number; power: number };
type Path = { x: Float32Array; y: Float32Array; nx: Float32Array; ny: Float32Array };

/* ---------- Ribbon ka rasta ---------- */
// (dx, dy) nali se, video pixels mein; dy negative = upar
const CTRL_OVER: [number, number][] = [
  [0, 0], [-45, -35], [-80, -75], [-80, -125], [-45, -165], [5, -178],
  [55, -150], [75, -105], [100, -85], [160, -85], [220, -120], [280, -165],
  [350, -190], [420, -225], [460, -250],
];
const CTRL_UNDER: [number, number][] = [
  [0, 0], [22, -40], [42, -88], [28, -135], [-20, -152], [-65, -122],
  [-62, -72], [-18, -58], [45, -68], [110, -95], [170, -112], [230, -147],
  [290, -177], [350, -202], [420, -232], [460, -250],
];
// nali se nikal kar neechay jaata hai, wahan coil banata hai, phir upar ribbon mein
const CTRL_DOWN: [number, number][] = [
  [0, 0], [-25, 30], [-60, 70], [-92, 120], [-60, 150], [-15, 128],
  [-28, 88], [-70, 45], [-95, -10], [-80, -70], [-30, -108], [30, -122],
  [100, -118], [170, -130], [240, -155], [300, -185], [360, -210],
  [420, -235], [460, -250],
];
const N = 220;

function buildPath(
  ox: number, oy: number, k: number, sgn: number, reach: number, ctrl: [number, number][]
): Path {
  const pts = ctrl.map(([dx, dy]) => [ox + sgn * dx * k * reach, oy + dy * k]);
  const P = (i: number) => pts[Math.max(0, Math.min(pts.length - 1, i))];
  const dense: number[][] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    for (let s = 0; s < 20; s++) {
      const t = s / 20, t2 = t * t, t3 = t2 * t;
      const cr = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      dense.push([cr(p0[0], p1[0], p2[0], p3[0]), cr(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  dense.push(pts[pts.length - 1]);

  const len = [0];
  for (let i = 1; i < dense.length; i++) {

