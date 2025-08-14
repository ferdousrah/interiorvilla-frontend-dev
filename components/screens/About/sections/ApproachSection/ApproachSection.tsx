import React, { useLayoutEffect, useRef } from "react";
import { Card, CardContent } from "../../../../ui/card";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

// Unique gradient background tones per card
const bgColors = [
  "from-[#fff7e6] to-[#ffe9cc]",
  "from-[#e6f7ff] to-[#ccf2ff]",
  "from-[#f0f5ff] to-[#d6e4ff]",
  "from-[#f6ffed] to-[#d9f7be]"
];

const approaches = [
  {
    icon: "🔍",
    title: "Discovery & Planning",
    description:
      "We begin by understanding your needs, preferences, and lifestyle to create a tailored design plan."
  },
  {
    icon: "🎨",
    title: "Design Development",
    description:
      "Our team develops detailed designs, including material selections, layouts, and 3D visualizations."
  },
  {
    icon: "🔨",
    title: "Execution & Management",
    description:
      "We manage all aspects of the project, from sourcing materials to overseeing construction and installation."
  },
  {
    icon: "✨",
    title: "Final Touches",
    description:
      "We add the finishing touches to bring your vision to life, ensuring every detail is perfect."
  }
];

export const ApproachSection = (): JSX.Element => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const headingWrapperRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
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
              start: "top 95%",
              end: "top 70%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

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
              start: "top 95%",
              end: "top 75%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      if (cardsContainerRef.current) {
        gsap.fromTo(
          cardsContainerRef.current.children,
          {
            opacity: 0,
            y: 60,
            rotationX: -15,
            scale: 0.9
          },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            stagger: 0.15,
            scrollTrigger: {
              trigger: cardsContainerRef.current,
              start: "top 95%",
              end: "bottom 70%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (!headingRef.current || !headingWrapperRef.current) return;

    const splitText = new SplitText(headingRef.current, {
      type: "chars,words",
      charsClass: "char",
      wordsClass: "word"
    });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = headingWrapperRef.current!.getBoundingClientRect();
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

    headingWrapperRef.current.addEventListener("mousemove", handleMouseMove);
    headingWrapperRef.current.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      splitText.revert();
      headingWrapperRef.current?.removeEventListener("mousemove", handleMouseMove);
      headingWrapperRef.current?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-12 md:py-16 lg:py-20 bg-[#f7f9fb] dark:bg-[#0f1a1c]"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <div
            ref={headingWrapperRef}
            className="perspective-[1000px] cursor-default"
            style={{ transformStyle: "preserve-3d" }}
          >
            <h2
              ref={headingRef}
              className="text-3xl md:text-3xl lg:text-4xl font-semibold [font-family:'Fahkwang',Helvetica] text-[#01190c] dark:text-white mb-6"
              style={{
                transformStyle: "preserve-3d",
                transform: "translateZ(0)"
              }}
            >
              Our <span className="text-secondary">Approach</span>
            </h2>
          </div>
          <p
            ref={descriptionRef}
            className="text-base [font-family:'Fahkwang',Helvetica] text-[#626161] dark:text-[#dddddd] max-w-5xl mx-auto leading-relaxed"
          >
            At Interior Villa, we believe that your home should be a reflection
            of your unique personality and lifestyle. We are a leading interior
            design firm in Bangladesh, passionate about creating spaces that are
            not only beautiful but also functional, comfortable, and inspiring.
          </p>
        </div>

        <div
          ref={cardsContainerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {approaches.map((approach, index) => (
            <Card
              key={index}
              aria-label={`Approach step: ${approach.title}`}
              className={`group relative overflow-hidden rounded-[12px] p-6 md:p-8 h-full cursor-pointer bg-gradient-to-br ${bgColors[index % bgColors.length]} transition-all duration-500 ease-out shadow-md`}
              onMouseMove={(e) => {
                const card = e.currentTarget;
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -8;
                const rotateY = ((x - centerX) / centerX) * 8;

                gsap.to(card, {
                  duration: 0.4,
                  ease: "power2.out",
                  rotateX,
                  rotateY,
                  scale: 1.05,
                  transformPerspective: 1000,
                  transformOrigin: "center"
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  duration: 0.6,
                  rotateX: 0,
                  rotateY: 0,
                  scale: 1,
                  ease: "elastic.out(1, 0.4)"
                });
              }}
            >
              {/* Shimmer effect */}
              <div className="pointer-events-none absolute inset-0 before:absolute before:inset-0 before:content-[''] before:bg-[linear-gradient(120deg,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0.05)_50%,transparent_100%)] before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-700 before:animate-[shine_2.5s_infinite]" />

              <CardContent className="p-0 text-justify relative z-10">
                <div className="text-4xl mb-4 transition-all duration-500 group-hover:scale-110">
                  {approach.icon}
                </div>
                <h3 className="text-base md:text-1xl font-semibold [font-family:'Fahkwang',Helvetica] text-[#01190c] dark:text-white mb-4 text-left transition-all duration-500">
                  {approach.title}
                </h3>
                <p className="text-[#626161] dark:text-[#dddddd] [font-family:'Fahkwang',Helvetica] text-base md:text-base leading-relaxed transition-all duration-500">
                  {approach.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};