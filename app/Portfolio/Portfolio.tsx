import React from "react";
import { CustomCursor } from "../../components/ui/cursor";
import { FooterSection } from "../../components/screens/Home/sections/FooterSection/FooterSection";
import {
  HeroSection,
  ProjectsSection,
  CTASection
} from "./sections/index";

const Portfolio = (): JSX.Element => {
  return (
    <main className="flex flex-col w-full items-start relative bg-white overflow-x-hidden min-h-screen">
      {/* Custom Cursor */}
      <CustomCursor className="custom-cursor" />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content Container */}
      <section className="w-full">
        {/* Projects Section with Filtering */}
        <ProjectsSection />
        
        {/* CTA Section */}
        <CTASection />
      </section>
      
      {/* Footer */}
      <FooterSection />
    </main>
  );
};

export default Portfolio;