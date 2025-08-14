import React, { useEffect, useRef, useState } from "react";
import { CustomCursor } from "../../components/ui/cursor";
import { FooterSection } from "../../components/screens/Home/sections/FooterSection/FooterSection";
import {
  HeroSection,
  ProjectInfoSection,
  BeforeAfterSection,
  ProjectGallerySection,
  CTASection
} from "./sections";

const ProjectDetails = (): JSX.Element => {
  return (
    <main className="flex flex-col w-full items-start relative bg-white overflow-x-hidden min-h-screen">
      {/* Custom Cursor */}
      <CustomCursor className="custom-cursor" />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content Container */}
      <article className="w-full">
        {/* Before & After Section */}
        <BeforeAfterSection />
        
        {/* Project Gallery Section */}
        <ProjectGallerySection />
        
        {/* Project Information Section */}
        <ProjectInfoSection />      
        
        
        {/* CTA Section */}
        <CTASection />
      </article>
      
      {/* Footer */}
      <FooterSection />
    </main>
  );
};

export default ProjectDetails;