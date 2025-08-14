import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const ProjectInfoSection = (): JSX.Element => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const infoGridRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Title animation
    if (titleRef.current) {
      gsap.fromTo(titleRef.current,
        {
          opacity: 0,
          y: 50
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 85%",
            end: "top 55%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Info grid animation
    if (infoGridRef.current) {
      const items = infoGridRef.current.children;
      
      gsap.fromTo(items,
        {
          opacity: 0,
          y: 40
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: infoGridRef.current,
            start: "top 85%",
            end: "top 65%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Services animation
    if (servicesRef.current) {
      gsap.fromTo(servicesRef.current,
        {
          opacity: 0,
          y: 40
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: servicesRef.current,
            start: "top 85%",
            end: "top 65%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-8 md:py-12 bg-white -mt-8 relative z-10"
    >
      <div className="container mx-auto px-4 max-w-6xl">
       

        {/* Project Information Grid */}
        <div 
          ref={infoGridRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 mb-16"
        >
          {/* Year */}
          <div className="text-center md:text-left">
            <h3 className="text-base font-semibold [font-family:'Fahkwang',Helvetica] text-[#01190c] mb-4 uppercase tracking-wider">
              Year
            </h3>
            <p className="text-base [font-family:'Fahkwang',Helvetica] text-[#626161]">
              2024
            </p>
          </div>

          {/* Square Footage */}
          <div className="text-center md:text-left">
            <h3 className="text-base font-semibold [font-family:'Fahkwang',Helvetica] text-[#01190c] mb-4 uppercase tracking-wider">
              Square Footage
            </h3>
            <p className="text-base [font-family:'Fahkwang',Helvetica] text-[#626161]">
              3,500 sq ft
            </p>
          </div>

          {/* Location */}
          <div className="text-center md:text-left">
            <h3 className="text-base font-semibold [font-family:'Fahkwang',Helvetica] text-[#01190c] mb-4 uppercase tracking-wider">
              Location
            </h3>
            <p className="text-base [font-family:'Fahkwang',Helvetica] text-[#626161]">
              Riverside Boulevard, Dhaka
            </p>
          </div>
        </div>

        {/* Services Section */}
        <div ref={servicesRef}>
          <h3 className="text-2xl font-semibold [font-family:'Fahkwang',Helvetica] text-[#01190c] mb-8 uppercase tracking-wider">
            Services
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Interior Design */}
            <div>
              <h4 className="text-lg font-medium [font-family:'Fahkwang',Helvetica] text-[#01190c] mb-3">
                Interior Design
              </h4>
              <ul className="space-y-2">
                <li className="text-base [font-family:'Fahkwang',Helvetica] text-[#626161]">Space Planning</li>
                <li className="text-base [font-family:'Fahkwang',Helvetica] text-[#626161]">Furniture Selection</li>
                <li className="text-base [font-family:'Fahkwang',Helvetica] text-[#626161]">Color Consultation</li>
              </ul>
            </div>

            {/* Project Management */}
            <div>
              <h4 className="text-lg font-medium [font-family:'Fahkwang',Helvetica] text-[#01190c] mb-3">
                Project Management
              </h4>
              <ul className="space-y-2">
                <li className="text-base [font-family:'Fahkwang',Helvetica] text-[#626161]">Timeline Coordination</li>
                <li className="text-base [font-family:'Fahkwang',Helvetica] text-[#626161]">Vendor Management</li>
                <li className="text-base [font-family:'Fahkwang',Helvetica] text-[#626161]">Quality Control</li>
              </ul>
            </div>

            {/* Custom Solutions */}
            <div>
              <h4 className="text-lg font-medium [font-family:'Fahkwang',Helvetica] text-[#01190c] mb-3">
                Custom Solutions
              </h4>
              <ul className="space-y-2">
                <li className="text-base [font-family:'Fahkwang',Helvetica] text-[#626161]">Built-in Storage</li>
                <li className="text-base [font-family:'Fahkwang',Helvetica] text-[#626161]">Lighting Design</li>
                <li className="text-base [font-family:'Fahkwang',Helvetica] text-[#626161]">Material Selection</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};