import React, { useEffect, useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export const TeamSection = (): JSX.Element => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const headingWrapperRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  // Outer and inner containers for the team carousel
  const teamGridRef = useRef<HTMLDivElement>(null);
  const teamWrapperRef = useRef<HTMLDivElement>(null);

  // Hold the GSAP animation for pausing/resuming
  const autoScrollAnim = useRef<gsap.core.Tween | null>(null);

  /* ---------------------- Scroll-triggered animations ---------------------- */
  useEffect(() => {
    if (!sectionRef.current) return;

    // Heading animation on scroll
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
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Description animation on scroll
    if (descriptionRef.current) {
      gsap.fromTo(
        descriptionRef.current,
        { opacity: 0, y: 30, filter: "blur(5px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: descriptionRef.current,
            start: "top 85%",
            end: "top 65%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Card entrance animation on scroll
    if (teamGridRef.current) {
      const cards = teamGridRef.current.querySelectorAll(".team-card");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 80, rotationY: -20, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          rotationY: 0,
          scale: 1,
          duration: 1.2,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: teamGridRef.current,
            start: "top 85%",
            end: "top 55%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  /* ------------------------ Hover animation for heading ------------------------ */
  useEffect(() => {
    const headingEl = headingRef.current;
    const wrapperEl = headingWrapperRef.current;
    if (!headingEl || !wrapperEl) return;

    const splitText = new SplitText(headingEl, {
      type: "chars,words",
      charsClass: "char",
      wordsClass: "word",
    });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = wrapperEl.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      gsap.to(splitText.chars, {
        duration: 0.5,
        y: (i) => (y - 0.5) * 15 * Math.sin((i + 1) * 0.5),
        x: (i) => (x - 0.5) * 15 * Math.cos((i + 1) * 0.5),
        rotationY: (x - 0.5) * 20,
        rotationX: (y - 0.5) * -20,
        ease: "power2.out",
        stagger: { amount: 0.3, from: "center" },
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
        stagger: { amount: 0.3, from: "center" },
      });
    };

    wrapperEl.addEventListener("mousemove", handleMouseMove);
    wrapperEl.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      splitText.revert();
      wrapperEl.removeEventListener("mousemove", handleMouseMove);
      wrapperEl.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  /* ----------------------------- Team members data ----------------------------- */
  const teamMembers = [
    {
      name: "Md Ashikur Rahman",
      position: "Founder & CEO",
      membership: "",
      image: "/team/ashikur-rahman.jpeg",
    },
    {
      name: "Nashiba Shahariar",
      position: "Head of Business",
      membership: "",
      image: "/team/nashiba.jpeg",
    },
    {
      name: "Omar Ferdous",
      position: "Senior architect",
      membership: "Associate AF-094",
      image: "/team/omar.jpeg",
    },
    {
      name: "Kamruzzaman Setu",
      position: "Junior architect",
      membership: "Associate AS-674",
      image: "/team/kamruzzaman.jpeg",
    },
  ];

  // Duplicate members for seamless loop
  const extendedTeamMembers = [...teamMembers, ...teamMembers];

  /* --------------------- Infinite scroll animation on desktop --------------------- */
  useLayoutEffect(() => {
    const wrapper = teamWrapperRef.current;
    if (!wrapper) return;

    const isDesktop =
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 768px)").matches;
    if (!isDesktop) return;

    let animation: gsap.core.Tween | null = null;

    const startLoop = () => {
      gsap.set(wrapper, { x: 0 });
      const loopWidth = wrapper.scrollWidth / 2;
      animation = gsap.to(wrapper, {
        x: -loopWidth,
        ease: "none",
        duration: 20,
        repeat: -1,
      });
      autoScrollAnim.current = animation;
    };

    startLoop();

    const onResize = () => {
      if (animation) {
        animation.kill();
        startLoop();
      }
    };
    window.addEventListener("resize", onResize);

    return () => {
      if (animation) animation.kill();
      autoScrollAnim.current = null;
      window.removeEventListener("resize", onResize);
    };
  }, [teamMembers.length]);

  return (
    <section
      ref={sectionRef}
      className="py-12 md:py-16 lg:py-20 bg-[#f7f9fb]"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Heading & description */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <div
            ref={headingWrapperRef}
            className="perspective-[1000px] cursor-default"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.h2
              ref={headingRef}
              className="text-2xl md:text-3xl lg:text-4xl font-semibold [font-family:'Fahkwang',Helvetica] text-[#01190c] mb-6"
              style={{ transformStyle: "preserve-3d", transform: "translateZ(0)" }}
            >
              Meet Our{" "}
              <span
                className="text-secondary"                
              >
                Team
              </span>
            </motion.h2>
          </div>
          <motion.p
            ref={descriptionRef}
            className="text-lg [font-family:'Fahkwang',Helvetica] text-[#626161] max-w-4xl mx-auto leading-relaxed"
          >
            Our team of talented professionals brings together diverse
            expertise and creative vision to deliver exceptional results.
          </motion.p>
        </div>

        {/* Carousel container */}
        <div
          ref={teamGridRef}
          className="overflow-x-auto md:overflow-hidden"
        >
          {/* Sliding wrapper */}
          <div
            ref={teamWrapperRef}
            className="flex flex-nowrap gap-8 md:gap-12 snap-x snap-mandatory md:snap-none"
          >
            {extendedTeamMembers.map((member, index) => {
              const hideOnMobile = index >= teamMembers.length;
              // Add shadow on hover and transition
              const itemClasses = `${hideOnMobile ? "hidden md:block" : ""
                } team-card snap-center shrink-0 text-center bg-white rounded-[10px] p-6 hover:shadow-lg transition-shadow duration-300`;
              return (
                <div
                  key={index}
                  className={itemClasses}
                  onMouseEnter={() => {
                    // Pause the auto-scroll when hovering over a card
                    autoScrollAnim.current?.pause();
                  }}
                  onMouseLeave={() => {
                    // Resume auto-scroll when leaving the card
                    autoScrollAnim.current?.play();
                  }}
                >
                  <div className="relative mb-8 group">
                    <div className="w-48 h-48 md:w-56 md:h-56 mx-auto bg-gray-200 rounded-3xl overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute inset-0 bg-primary/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <h3 className="text-xl md:text-1xl font-semibold [font-family:'Fahkwang',Helvetica] text-[#01190c] mb-2">
                    {member.name}
                  </h3>
                  <p className="text-[#626161] [font-family:'Fahkwang',Helvetica] text-base md:text-lg mb-1">
                    {member.position}
                  </p>
                  <p className="text-[#626161] [font-family:'Fahkwang',Helvetica] text-sm md:text-sm mb-3">
                    {member.membership}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
