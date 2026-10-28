// CC0 sprites from OpenGameArt (credits in public/sprites/CREDITS.txt), cut into one strip per animation.
export type Anim = "idle" | "run" | "attack" | "hurt";
type Sheet = { w: number; h: number; scale: number; frames: Record<Anim, number>; ms: Record<Anim, number> };

const SHEETS: Record<"sword" | "samurai", Sheet> = {
  sword: { w: 64, h: 64, scale: 1.7, frames: { idle: 2, run: 8, attack: 6, hurt: 3 }, ms: { idle: 900, run: 650, attack: 420, hurt: 300 } },
  samurai: { w: 40, h: 29, scale: 3.2, frames: { idle: 4, run: 6, attack: 8, hurt: 4 }, ms: { idle: 700, run: 600, attack: 560, hurt: 400 } },
};

export type Fighter = { name: string; char: keyof typeof SHEETS; tint?: string };

export const HEROES: Fighter[] = [
  { name: "Swordsman", char: "sword" },
  { name: "Azure Blade", char: "sword", tint: "hue-rotate(185deg) saturate(1.4)" },
  { name: "Ronin", char: "samurai" },
  { name: "Jade Ronin", char: "samurai", tint: "hue-rotate(80deg) saturate(1.5)" },
];
export const VILLAINS: Fighter[] = [
  { name: "Shadow Swordsman", char: "sword", tint: "brightness(0.45) contrast(1.4) saturate(0.6)" },
  { name: "Crimson Samurai", char: "samurai", tint: "hue-rotate(-50deg) saturate(2.4) brightness(0.85)" },
  { name: "Ghost Ronin", char: "samurai", tint: "grayscale(1) brightness(1.5) opacity(0.8)" },
  { name: "Blood Blade", char: "sword", tint: "hue-rotate(-30deg) saturate(3) brightness(0.7)" },
];

export function AnimSprite({ who, anim, loop = true }: { who: Fighter; anim: Anim; loop?: boolean }) {
  const s = SHEETS[who.char];
  const n = s.frames[anim];
  const w = Math.round(s.w * s.scale);
  const h = Math.round(s.h * s.scale);
  return (
    <span
      key={anim}
      className="block sprite-play"
      style={{
        width: w,
        height: h,
        backgroundImage: `url(/sprites/${who.char}-${anim}.png)`,
        backgroundSize: `${w * n}px ${h}px`,
        imageRendering: "pixelated",
        filter: who.tint,
        ["--end" as string]: `-${w * n}px`,
        animation: `sprite-play ${s.ms[anim]}ms steps(${n}) ${loop ? "infinite" : "1 forwards"}`,
      }}
    />
  );
}
