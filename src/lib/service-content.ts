export interface ServiceCardData {
  index: string;
  title: string;
  tags: string[];
}

export const SERVICE_INTRO = {
  title: "Service",
  description:
    "우리는 전문적인 서비스를 제공합니다. 마이그레이션부터 프론트엔드 개발, 제품 컨설팅까지 — 아이디어가 실제로 작동하는 제품이 되기까지 전 과정을 함께합니다.",
};

export const SERVICES: ServiceCardData[] = [
  {
    index: "01",
    title: "Website Migration",
    tags: ["Web Migration", "Optimization", "Framer Rebuild"],
  },
  {
    index: "02",
    title: "Framer Templates",
    tags: ["Startup", "Agency", "SaaS"],
  },
  {
    index: "03",
    title: "Frontend Development",
    tags: ["UI Dev", "Responsive Layouts", "Web Performance"],
  },
  {
    index: "04",
    title: "Product Consulting",
    tags: ["Product Direction", "Web Strategy", "Technical Guidance"],
  },
  {
    index: "05",
    title: "Design Systems",
    tags: ["Component Library", "Design Tokens", "Documentation"],
  },
];
