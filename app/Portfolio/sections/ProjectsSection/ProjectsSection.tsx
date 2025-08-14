import React, { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger, SplitText);

interface Project {
  id: number;
  category: string;
  title: string;
  description: string;
  image: string;
  year: string;
  client: string;
  area: string;
  tags: string[];
}

// Move static data outside the component to prevent re‑creation on every render
const projectsData: Project[] = [
  {
    id: 1,
    category: "Residential Interior",
    title: "Modern Family Home",
    description:
      "Contemporary living space with clean lines, natural materials, and abundant natural light creating perfect harmony.",
    image: "/a-residential-interior-image.png",
    year: "2024",
    client: "The Johnson Family",
    area: "3,500 sq ft",
    tags: ["Modern", "Family", "Sustainable"]
  },
  {
    id: 2,
    category: "Residential Interior",
    title: "Modern Family Home",
    description:
      "Contemporary living space with clean lines, natural materials, and abundant natural light creating perfect harmony.",
    image: "/a-residential-interior-image.png",
    year: "2024",
    client: "The Johnson Family",
    area: "3,500 sq ft",
    tags: ["Modern", "Family", "Sustainable"]
  },
  {
    id: 3,
    category: "Residential Interior",
    title: "Modern Family Home",
    description:
      "Contemporary living space with clean lines, natural materials, and abundant natural light creating perfect harmony.",
    image: "/a-residential-interior-image.png",
    year: "2024",
    client: "The Johnson Family",
    area: "3,500 sq ft",
    tags: ["Modern", "Family", "Sustainable"]
  },
  // … other projects unchanged
];

const filterOptions = [
  "All",
  "Residential Interior",
  "Commercial Interior",
  "Architectural Consultancy"
];

export const ProjectsSection = (): JSX.Element => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const headingWrapperRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [activeFilter, setActiveFilter] = useState("All");
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const navigate = useNavigate();

  // Compute filtered projects on demand
  const filteredProjects = useMemo(() => {
    return activeFilter === "All"
      ? projectsData
      : projectsData.filter((project) => project.category === activeFilter);
  }, [activeFilter]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Residential Interior":
        return "#75BF44";
      case "Commercial Interior":
        return "#EE5428";
      case "Architectural Consultancy":
        return "#4F46E5";
      default:
        return "#75BF44";
    }
  };

  // Main heading hover animation
  useEffect(() => {
    if (!headingRef.current) return;
    const splitText = new SplitText(headingRef.current, {
      type: "chars,words",
      charsClass: "char",
      wordsClass: "word"
    });

    const handleMouseMove = (e: MouseEvent) => {
      if (!headingWrapperRef.current) return;
      const rect = headingWrapperRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      gsap.to(splitText.chars, {
        duration: 0.5,
        y: (i) => (y - 0.5) * 15 * Math.sin((i + 1) * 0.5),
        x: (i) => (x - 0.5) * 15 * Math.cos((i + 1) * 0.5),
        rotationY: (x - 0.5) * 20,
        rotationX: (y - 0.5) * -20,
        ease: "power2.out",
        stagger: {
          amount: 0.3,
          from: "center"
        }
      });
    };

    const handleMouseLeave = () => {
      gsap.to(splitText.chars, {
        duration: 1,
        y: 0,
        x: 0,
        rotationY: 0,
        rotationX: 0,
        ease: "elastic.out(1, 0.3)",
        stagger: {
          amount: 0.3,
          from: "center"
        }
      });
    };

    // Attach listeners
    const wrapper = headingWrapperRef.current;
    wrapper?.addEventListener("mousemove", handleMouseMove);
    wrapper?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      // Cleanup: remove listeners using the same function references:contentReference[oaicite:1]{index=1}
      wrapper?.removeEventListener("mousemove", handleMouseMove);
      wrapper?.removeEventListener("mouseleave", handleMouseLeave);
      splitText.revert();
    };
  }, []);

  // Scroll-triggered animations
  useEffect(() => {
    if (!sectionRef.current) return;

    // Heading animation
    if (headingRef.current) {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
            end: "top 55%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Filters animation
    if (filtersRef.current) {
      const filterButtons = filtersRef.current.children;

      gsap.fromTo(
        filterButtons,
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: filtersRef.current,
            start: "top 85%",
            end: "top 65%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Grid animation
    if (gridRef.current) {
      const projectCards = gridRef.current.children;

      gsap.fromTo(
        projectCards,
        { opacity: 0, y: 80, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            end: "top 55%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Cleanup scroll triggers on unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleProjectClick = (projectId: number) => {
    navigate("/project-details");
  };

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-20 bg-white -mt-48 relative z-10"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div
            ref={headingWrapperRef}
            className="perspective-[1000px] cursor-default"
            style={{ transformStyle: "preserve-3d" }}
          >
            <h2
              ref={headingRef}
              className="text-2xl md:text-3xl lg:text-4xl font-medium [font-family:'Fahkwang',Helvetica] text-[#01190c] mb-8"
              style={{
                transformStyle: "preserve-3d",
                transform: "translateZ(0)"
              }}
            >
              Our{" "}
              <span
                className="text-secondary"                
              >
                Portfolio
              </span>
            </h2>
          </div>

          <p className="text-base [font-family:'Fahkwang',Helvetica] text-[#626161] leading-relaxed max-w-3xl mx-auto mb-12">
            Explore our diverse collection of interior design projects that showcase our commitment
            to excellence, creativity, and client satisfaction.
          </p>

          {/* Filter Buttons */}
          <div ref={filtersRef} className="flex flex-wrap justify-center gap-4 mb-12">
            {filterOptions.map((filter, index) => (
              <button
                key={index}
                onClick={() => handleFilterChange(filter)}
                className={`px-6 py-3 rounded-full text-sm font-medium [font-family:'Fahkwang',Helvetica] transition-all duration-300 hover:scale-105 ${
                  activeFilter === filter
                    ? "bg-primary text-white shadow-lg"
                    : "bg-gray-100 text-[#626161] hover:bg-gray-200 hover:text-[#01190c]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer"
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
                onClick={() => handleProjectClick(project.id)}
              >
                <div className="relative overflow-hidden rounded-3xl aspect-[4/3] transition-all duration-500 ease-out hover:scale-105 hover:shadow-2xl">
                  {/* Project Image */}
                  <img
                    src={project.image}
                    alt={`${project.title} image`}
                    className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      // Fallback to a generic placeholder if your custom image fails to load
                      target.src = "/create-an-image-for-interior-design-about-us-section.png";
                    }}
                  />

                  {/* Hover Overlay */}
                  {/* Hover Overlay */}
                    <div
                      className="absolute inset-0 bg-black/60 transition-all duration-500 ease-out flex flex-col justify-end p-6"
                      style={{
                        opacity: hoveredProject === project.id ? 1 : 0,
                        transform: hoveredProject === project.id ? "translateY(0)" : "translateY(20px)"
                      }}
                    >
                    {/* Category Pill - Top Left Corner */}
                    <div className="absolute top-6 left-6">
                      <span
                        className="px-3 py-1.5 rounded-full text-xs font-semibold text-white [font-family:'Fahkwang',Helvetica] backdrop-blur-md border border-white/20"
                        style={{ backgroundColor: getCategoryColor(project.category) }}
                      >
                        {project.category}
                      </span>
                    </div>

                    {/* Project Title - Bottom with Transparent Background */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      {/* Semi‑transparent black bar behind the title */}
                      {/* Project Title - Bottom with Background */}
                      <div className="absolute bottom-0 left-0 right-0">
                        <div 
                          className="bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-12"
                          style={{
                            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)'
                          }}
                        >
                          <h3 className="text-xl md:text-2xl font-bold text-white [font-family:'Fahkwang',Helvetica] leading-tight">
                            {project.title}
                          </h3>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-medium [font-family:'Fahkwang',Helvetica] text-[#01190c] mb-2">
              No projects found
            </h3>
            <p className="text-[#626161] [font-family:'Fahkwang',Helvetica]">
              Try selecting a different category filter
            </p>
          </div>
        )}

        {/* Project Count */}
        <div className="text-center mt-12">
          <p className="text-sm text-[#626161] [font-family:'Fahkwang',Helvetica]">
            Showing {filteredProjects.length} of {projectsData.length} projects
          </p>
        </div>
      </div>

      <style jsx global>{`
        /* Enhanced hover effects */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Glassmorphism effects */
        .backdrop-blur-md {
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        /* Smooth transitions for all elements */
        * {
          transition-property: transform, opacity, background-color, border-color, color, box-shadow;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Enhanced focus states */
        button:focus-visible {
          outline: 2px solid #75bf44;
          outline-offset: 2px;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
          background: #75bf44;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #68ab3c;
        }
      `}</style>
    </section>
  );
};