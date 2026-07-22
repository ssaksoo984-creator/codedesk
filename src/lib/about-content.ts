export interface AboutSlide {
  title: string;
  desc: string;
}

export const ABOUT_SLIDES: AboutSlide[] = [
  {
    title: "Precision in Every Pixel",
    desc: "Every spacing, curve, and transition is deliberate. {Code} · Desk treats design detail and code quality as the same discipline — nothing ships until it feels inevitable.",
  },
  {
    title: "Systems, Not Just Screens",
    desc: "Components are built to scale, not just to demo. Reusable, documented, and consistent — so the third feature is as clean as the first.",
  },
  {
    title: "Built to Move Fast",
    desc: "Lean stacks, fast builds, and pragmatic tooling. Ideas go from sketch to shipped product without losing craft along the way.",
  },
];

const IMAGE_COUNT = 24;

export const ABOUT_IMAGES: string[] = Array.from(
  { length: IMAGE_COUNT },
  (_, i) => `https://picsum.photos/seed/codedesk-${i + 1}/480/640`
);
