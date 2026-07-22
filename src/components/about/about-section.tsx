import { ThemeSection } from "@/components/site-header/theme-section";
import { SphereGallery } from "./sphere-gallery";

export function AboutSection() {
  return (
    <ThemeSection theme="light" id="about" snap>
      <SphereGallery />
    </ThemeSection>
  );
}
