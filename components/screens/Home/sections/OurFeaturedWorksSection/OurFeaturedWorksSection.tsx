// our featured works section
'use client'

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ChevronDown, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, SplitText);

interface Project {
  id: number;
  category: string;
  title: string;
  description: string;
  image: string;
  color: string;
  accent: string;
}

export const OurFeaturedWorksSection = (): JSX.Element => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const projects: Project[] = [
    {
      id: 1,
      category: "Residential Interior",
      title: "Luxury Home Interior",
      description: "Contemporary kitchen design with smart functionality, premium materials, and elegant aesthetics for modern living.",
      image: "/Qirat.avif",
      color: "#50852d", // Deepest green 
      accent: "#50852d"
    },
    {
      id: 2,
      category: "Residential Interior",
      title: "Luxury Kitchen Interior",
      description: "Contemporary kitchen design with smart functionality, premium materials, and elegant aesthetics for modern living.",
      image: "/Raqamyah.avif",
      color: "#599432", // Medium-deep green
      accent: "#599432"
    },
    {
      id: 3,
      category: "Commercial Interior",
      title: "Luxury Office Interior",
      description: "Contemporary kitchen design with smart functionality, premium materials, and elegant aesthetics for modern living.",
      image: "/Hoopoe Advisors.avif",
      color: "#62a337", // Medium-light green
      accent: "#62a337"
    },
    {
      id: 4,
      category: "Residential Interior",
      title: "Luxury Kitchen Interior",
      description: "Contemporary kitchen design with smart functionality, premium materials, and elegant aesthetics for modern living.",
      image: "/Tamara.avif",
      color: "#6db53e", // Lightest green
      accent: "#6db53e"
    }
  ];


  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sequential one-by-one card stacking animation 
  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    const cards = cardRefs.current.filter(card => card !== null);
    if (cards.length === 0) return;

    cards.forEach((card, index) => {
      if (!card) return;
      gsap.set(card, {
        x: 0,
        y: index === 0 ? 0 : `${80 + index * 10}vh`,
        scale: 1,
        opacity: 1,
        zIndex: 100 + index,
        transformOrigin: "center center",
        willChange: "transform",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      });
    });

    const scrollTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: () => `+=${projects.length * 400}vh`,
      pin: true,
      pinSpacing: true,
      scrub: 8,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      refreshPriority: -1,
      onUpdate: (self) => {
        const progress = self.progress;
        const totalCards = projects.length;

        const activeIndex = Math.min(Math.floor(progress * totalCards), totalCards - 1);
        if (activeIndex !== currentIndex) {
          setCurrentIndex(activeIndex);
        }

        cards.forEach((card, index) => {
          if (!card) return;

          const zStackIndex = index;
          gsap.set(card, {
            zIndex: 100 + zStackIndex,
          });

          const total = projects.length;
          const segment = 1 / total;

          const cardStart = index * segment;
          const cardEnd = (index + 1) * segment;

          let moveProgress = 0;
          if (progress >= cardStart && progress <= cardEnd) {
            moveProgress = (progress - cardStart) / segment;
          } else if (progress > cardEnd) {
            moveProgress = 1;
          }

          // Apply smooth easing for more natural movement
          const eased = moveProgress < 0.5 
            ? 2 * moveProgress * moveProgress 
            : 1 - Math.pow(-2 * moveProgress + 2, 3) / 2;

          const stackGap = 2;
          const finalY = index * stackGap;
          const startY = index === 0 ? 0 : 100;
          let yPos;
          if (index === 0 && progress <= 1 / total) {
            yPos = 0;
          } else {
            yPos = startY + eased * (finalY - startY);
          }

          gsap.set(card, {
            y: yPos + "vh",
            scale: 0.92 + eased * 0.08,
            force3D: true
          });
        });
      }
    });

    return () => {
      if (scrollTrigger) {
        scrollTrigger.kill();
      }
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === sectionRef.current) {
          trigger.kill();
        }
      });
    };
  }, []);

   useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' && currentIndex < projects.length - 1) {
        e.preventDefault();
        scrollToCard(currentIndex + 1);
      } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        e.preventDefault();
        scrollToCard(currentIndex - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  useEffect(() => {
    const images = document.querySelectorAll("img");
    const refresh = () => ScrollTrigger.refresh();
    images.forEach(img => img.addEventListener("load", refresh));
    return () => images.forEach(img => img.removeEventListener("load", refresh));
  }, []);

  const scrollToCard = (index: number) => {
    const sectionScrollHeight = projects.length * 400 * window.innerHeight / 100;
    const targetScroll = (sectionRef.current?.offsetTop ?? 0) + (index / projects.length) * sectionScrollHeight;
    gsap.to(window, {
      scrollTo: { y: targetScroll },
      duration: 2.0,
      ease: "power2.inOut"
    });
  };

  const handleViewProject = () => {
    navigate('/project-details');
  };

  const handleExploreAllProjects = () => {
    navigate('/portfolio');
  };

  return (
    <>
      {/* Our Featured Works Section - Cards Only */}
      <section 
        ref={sectionRef}
        className="w-full min-h-screen overflow-hidden relative bg-white"
        style={{ zIndex: 2 }}
      >

        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Animated gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/8 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gray-300/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
          <div className="absolute top-3/4 left-1/3 w-72 h-72 bg-gray-400/4 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '6s' }} />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-6">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                `,
                backgroundSize: '120px 120px'
              }}
            />
          </div>
          
          {/* Additional depth elements */}
          <div className="absolute inset-0">
            {/* Subtle noise texture overlay */}
            <div 
              className="w-full h-full opacity-15"
              style={{
                background: `
                  radial-gradient(circle at 20% 30%, rgba(255,255,255,0.02) 0%, transparent 50%),
                  radial-gradient(circle at 80% 70%, rgba(255,255,255,0.015) 0%, transparent 50%),
                  radial-gradient(circle at 40% 80%, rgba(255,255,255,0.018) 0%, transparent 50%)
                `
              }}
            />
          </div>
        </div>

        {/* Section Header */}
        {/* Cards Container - Fixed positioning for perfect stacking */}
        <div
          ref={containerRef}
          className="relative w-full h-screen flex items-center justify-center pt-0"
        >

          {projects.map((project, index) => (
            <div
              key={project.id}
              ref={el => cardRefs.current[index] = el}
              className="absolute flex items-center justify-center p-1 sm:p-2 md:p-4 lg:p-6"
              style={{ 
                zIndex: 100 + index,
                willChange: 'transform',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0
              }}
            >
              {/* Main Card - Centered and properly sized */}
              <div 
                className="w-full rounded-2xl sm:rounded-3xl overflow-hidden relative mx-auto cursor-pointer"
                onClick={handleViewProject}
                style={{
                  width: '90%',
                  maxWidth: windowWidth < 640 ? '100%' 
         : windowWidth < 1024 ? '600px' 
         : `${1200 + index * 40}px`,
                  height: windowWidth < 640 ? '70vh' 
         : windowWidth < 1024 ? '60vh' 
         : '80vh',
                  minHeight: windowWidth < 640 ? '500px' : '600px',
                  background: project.color,
                  transform: 'translateZ(0)',
                  willChange: 'transform'
                }}
              >
                <div className="flex flex-col lg:flex-row h-full">
                  {/* Content Section - Full width on mobile, 40% on desktop */}
                  <div className="w-full lg:w-2/5 p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-center relative z-10 flex-shrink-0">
                    {/* Category Badge */}
                    <div className="mb-3 md:mb-4">
                      <span 
                        className="inline-block px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-semibold text-green-800"
                        style={{ background: "rgba(255, 255, 255, 0.9)" }}
                      >
                        {project.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-3 md:mb-4 leading-tight"
                        style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)' }}>
                      {project.title}
                    </h2>

                    {/* Description */}
                    <p className="text-sm sm:text-base md:text-base text-white mb-4 md:mb-6 leading-relaxed"
                       style={{ textShadow: '0 1px 6px rgba(255, 255, 255, 0.2)' }}>
                      {project.description}
                    </p>

                    {/* CTA Button */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewProject();
                      }}
                      className="group inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 rounded-full text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl w-fit relative overflow-hidden"
                      style={{ background: "rgba(255, 255, 255, 0.2)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                      }}
                    >
                      {/* Button shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700 ease-out" />
                      
                      <span className="mr-2 text-xs sm:text-sm">View Project</span>
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>

                    {/* Project Number */}
                    <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 md:left-8 lg:left-10 lg:block hidden">
                      <div className="text-4xl sm:text-6xl font-bold opacity-20 text-white">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                    </div>
                  </div>

                  {/* Visual Section - Full width on mobile, 60% on desktop */}
                  <div className="w-full lg:w-3/5 relative overflow-hidden flex-1 pointer-events-none">
                    {/* Mockup Image */}
                    <div className="absolute inset-0 w-full h-full p-4 sm:p-6 md:p-8 lg:p-10">
                      <div className="w-full h-full rounded-1xl sm:rounded-2xl overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/create-an-image-for-interior-design-about-us-section.png';
                          }}
                        />
                      </div>
                    </div>


                    
                    {/* Mobile Project Number - Only visible on mobile */}
                    <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 lg:hidden">
                      <div className="text-2xl sm:text-3xl font-bold opacity-30 text-white">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Separate Explore All Projects Section - Black Background */}
      <section 
        className="w-full py-16 md:py-20 relative overflow-hidden bg-white"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Animated gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-black/8 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gray-300/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-black/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
          <div className="absolute top-3/4 left-1/3 w-72 h-72 bg-gray-400/4 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '6s' }} />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-6">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                `,
                backgroundSize: '120px 120px'
              }}
            />
          </div>
          
          {/* Additional depth elements */}
          <div className="absolute inset-0">
            {/* Subtle noise texture overlay */}
            <div 
              className="w-full h-full opacity-15"
              style={{
                background: `
                  radial-gradient(circle at 20% 30%, rgba(255,255,255,0.02) 0%, transparent 50%),
                  radial-gradient(circle at 80% 70%, rgba(255,255,255,0.015) 0%, transparent 50%),
                  radial-gradient(circle at 40% 80%, rgba(255,255,255,0.018) 0%, transparent 50%)
                `
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 text-center relative z-5">
          <div className="max-w-4xl mx-auto">
            <button 
              onClick={handleExploreAllProjects}
              className="group flex items-center gap-2 sm:gap-3 px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full text-white text-sm sm:text-base font-semibold bg-black hover:bg-gray-800 transition-all duration-500 hover:scale-105 border border-gray-700 relative z-10 mx-auto"
              style={{
                boxShadow: '0 15px 50px rgba(0, 0, 0, 0.3), 0 0 30px rgba(0, 0, 0, 0.2)',
                minWidth: '180px'
              }}
            >
              <span className="[font-family:'Fahkwang',Helvetica] font-medium">
                Explore All Projects
              </span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
};