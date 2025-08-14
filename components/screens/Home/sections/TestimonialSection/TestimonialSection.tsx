import { ArrowLeft, ArrowRight, PlayIcon } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "../../../../ui/card";
import useEmblaCarousel from 'embla-carousel-react';
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export const TestimonialSection = (): JSX.Element => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    breakpoints: {
      '(min-width: 1024px)': { slidesToScroll: 3 },
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(max-width: 767px)': { slidesToScroll: 1 }
    }
  });

  // Refs for parallax effects
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const headingWrapperRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  const backgroundElementsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Destroy any existing Fancybox instances
    Fancybox.destroy();
    
    // Initialize Fancybox with proper video configuration
    Fancybox.bind("[data-fancybox='testimonial-videos']", {
      // Video-specific options
      Html: {
        video: {
          autoplay: true,
          ratio: 16/9
        }
      },
      
      // UI options
      animated: true,
      showClass: "fancybox-fadeIn",
      hideClass: "fancybox-fadeOut",
      dragToClose: false,
      
      // Toolbar configuration
      Toolbar: {
        display: {
          left: [],
          middle: [],
          right: ["close"]
        }
      },
      
      // Custom templates
      template: {
        closeButton: '<button data-fancybox-close class="fancybox__button fancybox__button--close" title="Close"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button>',
        main: '<div class="fancybox__container" role="dialog" aria-modal="true" aria-label="{{MODAL}}" tabindex="-1"><div class="fancybox__backdrop"></div><div class="fancybox__carousel"><div class="fancybox__viewport"></div></div></div>'
      },
      
      // Event handlers
      on: {
        init: (fancybox) => {
          console.log("Fancybox initialized");
        },
        
        reveal: (fancybox, slide) => {
          console.log("Slide revealed:", slide);
          
          // Handle video autoplay
          if (slide.type === 'html' || slide.type === 'iframe') {
            const content = slide.$content;
            if (content) {
              const video = content.querySelector('video');
              const iframe = content.querySelector('iframe');
              
              if (video) {
                video.play().catch(e => console.log("Video autoplay failed:", e));
              } else if (iframe) {
                // For iframe videos, try to trigger autoplay
                try {
                  iframe.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                } catch (e) {
                  console.log("Iframe autoplay failed:", e);
                }
              }
            }
          }
        },
        
        destroy: (fancybox, slide) => {
          console.log("Slide destroyed:", slide);
          
          // Pause video when closing
          if (slide && slide.$content) {
            const video = slide.$content.querySelector('video');
            const iframe = slide.$content.querySelector('iframe');
            
            if (video) {
              video.pause();
            } else if (iframe) {
              try {
                iframe.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
              } catch (e) {
                console.log("Iframe pause failed:", e);
              }
            }
          }
        }
      }
    });

    return () => {
      Fancybox.destroy();
    };
  }, []);

  // Add hover animation for main heading
  useEffect(() => {
    if (!headingRef.current) return;

    // Split text into characters
    const splitText = new SplitText(headingRef.current, { 
      type: "chars,words",
      charsClass: "char",
      wordsClass: "word"
    });

    // Add hover animation
    if (headingWrapperRef.current) {
      headingWrapperRef.current.addEventListener('mousemove', (e) => {
        const rect = headingWrapperRef.current!.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        gsap.to(splitText.chars, {
          duration: 0.5,
          y: (i, target) => (y - 0.5) * 15 * Math.sin((i + 1) * 0.5),
          x: (i, target) => (x - 0.5) * 15 * Math.cos((i + 1) * 0.5),
          rotationY: (x - 0.5) * 20,
          rotationX: (y - 0.5) * -20,
          ease: "power2.out",
          stagger: {
            amount: 0.3,
            from: "center"
          }
        });
      });

      headingWrapperRef.current.addEventListener('mouseleave', () => {
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
      });
    }

    // Cleanup function
    return () => {
      splitText.revert();
      if (headingWrapperRef.current) {
        headingWrapperRef.current.removeEventListener('mousemove', () => {});
        headingWrapperRef.current.removeEventListener('mouseleave', () => {});
      }
    };
  }, []);

  // Parallax and animation effects
  useEffect(() => {
    if (!sectionRef.current) return;

    // Split text animation for heading
    if (headingRef.current) {
      const splitText = new SplitText(headingRef.current, { 
        type: "words,chars",
        charsClass: "char",
        wordsClass: "word"
      });

      // Set initial state to be visible
      gsap.set(splitText.chars, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        transformOrigin: "50% 50%"
      });

      // Create a subtle reveal animation
      gsap.fromTo(splitText.chars,
        {
          opacity: 0.2,
          y: 30,
          scale: 0.9,
          rotationY: -15
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationY: 0,
          duration: 1,
          stagger: {
            amount: 0.6,
            from: "start"
          },
          ease: "power3.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 90%",
            end: "top 60%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Parallax effect for heading
      gsap.to(headingRef.current, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
          invalidateOnRefresh: true
        }
      });
    }

    // Description animation and parallax
    if (descriptionRef.current) {
      gsap.fromTo(descriptionRef.current,
        {
          opacity: 0,
          y: 40,
          filter: "blur(8px)"
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: descriptionRef.current,
            start: "top 85%",
            end: "top 65%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Subtle parallax for description
      gsap.to(descriptionRef.current, {
        yPercent: -5,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
          invalidateOnRefresh: true
        }
      });
    }

    // Carousel container animation and parallax
    if (carouselContainerRef.current) {
      gsap.fromTo(carouselContainerRef.current,
        {
          opacity: 0,
          y: 60,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: carouselContainerRef.current,
            start: "top 85%",
            end: "top 55%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Parallax effect for carousel
      gsap.to(carouselContainerRef.current, {
        yPercent: -3,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.3,
          invalidateOnRefresh: true
        }
      });
    }

    // Navigation buttons animation
    if (navigationRef.current) {
      const navButtons = navigationRef.current.querySelectorAll('button');
      
      gsap.fromTo(navButtons,
        {
          opacity: 0,
          scale: 0.8,
          x: (i) => i === 0 ? -30 : 30
        },
        {
          opacity: 1,
          scale: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: carouselContainerRef.current,
            start: "top 80%",
            end: "top 60%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Parallax for navigation
      gsap.to(navButtons, {
        yPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.4,
          invalidateOnRefresh: true
        }
      });
    }

    // Background elements parallax
    if (backgroundElementsRef.current) {
      gsap.to(backgroundElementsRef.current, {
        yPercent: -15,
        rotation: 90,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
          invalidateOnRefresh: true
        }
      });
    }

    // Individual card hover animations with 3D effects
    const cards = carouselContainerRef.current?.querySelectorAll('[data-card]');
    cards?.forEach((card, index) => {
      const cardElement = card as HTMLElement;
      
      // Staggered entrance animation
      gsap.fromTo(cardElement,
        {
          opacity: 0,
          y: 80,
          rotationX: -20,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          scale: 1,
          duration: 1.2,
          delay: index * 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardElement,
            start: "top 90%",
            end: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Individual parallax for each card
      gsap.to(cardElement, {
        yPercent: -2 - (index * 1.5),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.2 + (index * 0.1),
          invalidateOnRefresh: true
        }
      });
    });

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const testimonials = [
    {
      id: 1,
      title: "Modern Home Transformation",
      description: "See how we transformed this couple's living space into a modern sanctuary",
      image: "/create-an-image-that-a-couple-represent-their-home-interior.png",
      alt: "Couple home interior",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    },
    {
      id: 2,
      title: "Corporate Office Redesign",
      description: "A complete office makeover that boosted productivity and employee satisfaction",
      image: "/create-an-image-a-corporate-officer-represent-his-office-interio.png",
      alt: "Corporate office interior",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
    },
    {
      id: 3,
      title: "Luxury Bedroom Suite",
      description: "Creating a peaceful retreat with elegant design and premium materials",
      image: "/create-an-image-where-a-beautiful-girl-shows-her-bedroom-interio.png",
      alt: "Bedroom interior",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
    },
    {
      id: 4,
      title: "Contemporary Living Room",
      description: "Blending comfort with style in this stunning living space transformation",
      image: "/create-an-image-that-a-couple-represent-their-home-interior.png",
      alt: "Modern living room",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    },
    {
      id: 5,
      title: "Gourmet Kitchen Design",
      description: "A chef's dream kitchen with cutting-edge appliances and beautiful finishes",
      image: "/create-an-image-a-corporate-officer-represent-his-office-interio.png",
      alt: "Kitchen design",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
    },
    {
      id: 6,
      title: "Spa-Inspired Bathroom",
      description: "Transforming a simple bathroom into a luxurious spa-like retreat",
      image: "/create-an-image-where-a-beautiful-girl-shows-her-bedroom-interio.png",
      alt: "Bathroom interior",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
    }
  ];

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  // Handle video click
  const handleVideoClick = (e: React.MouseEvent, videoUrl: string, title: string) => {
    e.preventDefault();
    
    // Create video element for Fancybox
    const videoHtml = `
      <video 
        controls 
        autoplay 
        style="width: 100%; height: 100%; max-width: 1200px; max-height: 675px;"
        poster=""
      >
        <source src="${videoUrl}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    `;

    // Open Fancybox with video content
    Fancybox.show([{
      src: videoHtml,
      type: 'html',
      caption: title
    }], {
      animated: true,
      showClass: "fancybox-fadeIn",
      hideClass: "fancybox-fadeOut"
    });
  };

  return (
    <section 
  ref={sectionRef}
  className="w-full flex items-start justify-center relative overflow-hidden bg-white pt-20 pb-16 md:pt-25 md:pb-20"
  style={{
    transformStyle: 'preserve-3d',
    perspective: '1000px',
    zIndex: 1
  }}
>

      {/* Background decorative elements */}
      <div 
        ref={backgroundElementsRef}
        className="absolute inset-0 pointer-events-none will-change-transform"
        style={{
          transformOrigin: 'center center',
          backfaceVisibility: 'hidden',
          transform: 'translate3d(0, 0, 0)'
        }}
      >
        <div className="absolute top-20 left-10 w-8 h-8 bg-primary rounded-full opacity-8 animate-pulse" />
        <div className="absolute top-1/3 right-20 w-6 h-6 bg-secondary rounded-full opacity-12 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/4 w-10 h-10 bg-primary rounded-full opacity-6 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-2/3 right-1/3 w-4 h-4 bg-secondary rounded-full opacity-10 animate-pulse" style={{ animationDelay: '3s' }} />
        
        {/* Geometric shapes */}
        <div className="absolute top-40 right-10 w-16 h-16 border-2 border-primary opacity-5 rotate-45" />
        <div className="absolute bottom-40 left-16 w-20 h-20 border border-secondary opacity-8 rounded-full" />
        <div className="absolute top-1/2 left-10 w-12 h-12 border-2 border-primary opacity-6" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10 w-full" style={{ maxWidth: "1219px" }}>
        {/* Section Header - Styled like other sections */}
        <div className="text-center mb-16">
          

          <div 
            ref={headingWrapperRef}
            className="perspective-[1000px] cursor-default"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <h2 
              ref={headingRef}
              className="[font-family:'Fahkwang',Helvetica] font-medium text-[40px] text-center tracking-[0] leading-[62px] mb-6 md:mb-2"
              style={{ 
                transformStyle: 'preserve-3d',
                transform: 'translateZ(0)',
              }}
            >
              <span className="text-[#0d1529]">Client </span>
              <span className="text-secondary">Stories</span>
            </h2>
          </div>
          
          <p 
              
              className="text-lg text-[#626161] max-w-4xl mx-auto leading-relaxed [font-family:'Fahkwang',Helvetica] will-change-transform px-8"
              style={{
                transformOrigin: 'center center',
                backfaceVisibility: 'hidden',
                transform: 'translate3d(0, 0, 0)',
                
              }}
            >
            We create spaces that inspire and reflect your unique lifestyle
          </p>
        </div>

        <div 
          ref={carouselContainerRef}
          className="relative will-change-transform"
          style={{
            transformOrigin: 'center center',
            backfaceVisibility: 'hidden',
            transform: 'translate3d(0, 0, 0)'
          }}
        >
          <div ref={navigationRef}>
            <button
              onClick={scrollPrev}
              className="absolute left-0 md:left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white flex items-center justify-center shadow-xl cursor-pointer hover:bg-gray-50 transition-all duration-300 hover:scale-110 will-change-transform border-2 border-primary/20"
              style={{
                transformOrigin: 'center center',
                backfaceVisibility: 'hidden',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
              }}
            >
              <ArrowLeft className="w-6 h-6 md:w-7 md:h-7 text-primary" />
            </button>
            
            <button
              onClick={scrollNext}
              className="absolute right-0 md:right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white flex items-center justify-center shadow-xl cursor-pointer hover:bg-gray-50 transition-all duration-300 hover:scale-110 will-change-transform border-2 border-primary/20"
              style={{
                transformOrigin: 'center center',
                backfaceVisibility: 'hidden',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
              }}
            >
              <ArrowRight className="w-6 h-6 md:w-7 md:h-7 text-primary" />
            </button>
          </div>

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6 md:gap-8">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  data-card
                  className="relative flex-[0_0_280px] md:flex-[0_0_320px] lg:flex-[0_0_360px] transition-all duration-500 ease-in-out will-change-transform"
                  onMouseEnter={() => setHoveredCard(testimonial.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    transform: hoveredCard === testimonial.id ? 'scale(1.05) translateY(-8px)' : 'scale(1) translateY(0)',
                    zIndex: hoveredCard === testimonial.id ? 10 : 1,
                    transformOrigin: 'center center',
                    backfaceVisibility: 'hidden',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <Card
                    className="h-[400px] w-full rounded-2xl md:rounded-3xl overflow-hidden border-2 border-solid border-primary/30 relative cursor-pointer"
                    style={{ 
                      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)), url(${testimonial.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      boxShadow: hoveredCard === testimonial.id 
                        ? '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 30px rgba(117, 191, 68, 0.3)'
                        : '0 8px 32px rgba(0, 0, 0, 0.12)',
                      transformOrigin: 'center center',
                      backfaceVisibility: 'hidden',
                      transformStyle: 'preserve-3d'
                    }}
                    onClick={(e) => handleVideoClick(e, testimonial.video, testimonial.title)}
                  >
                    <CardContent className="flex items-center justify-center h-full p-0 relative">
                      {/* Enhanced overlay gradient */}
                      <div 
                        className="absolute inset-0 transition-opacity duration-500"
                        style={{
                          background: hoveredCard === testimonial.id 
                            ? 'linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(117, 191, 68, 0.3) 100%)'
                            : 'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.4) 100%)',
                          opacity: 1
                        }}
                      />
                      
                      {/* Enhanced play button */}
                      <div
                        className={`w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full border-3 border-solid border-white shadow-2xl flex items-center justify-center transition-all duration-500 relative z-10 group ${
                          hoveredCard === testimonial.id 
                            ? 'bg-white scale-110 transform-gpu' 
                            : 'bg-white/20 backdrop-blur-sm'
                        }`}
                        style={{
                          transform: hoveredCard === testimonial.id 
                            ? 'scale(1.2) rotateY(10deg)' 
                            : 'scale(1) rotateY(0deg)',
                          boxShadow: hoveredCard === testimonial.id 
                            ? '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(255, 255, 255, 0.6)'
                            : '0 8px 25px rgba(0, 0, 0, 0.3)',
                          borderWidth: '3px'
                        }}
                      >
                        <PlayIcon 
                          className={`w-7 h-7 md:w-9 md:h-9 lg:w-11 lg:h-11 transition-all duration-500 ${
                            hoveredCard === testimonial.id ? 'text-primary' : 'text-white'
                          }`}
                          style={{
                            transform: hoveredCard === testimonial.id ? 'translateX(3px)' : 'translateX(2px)'
                          }}
                        />
                        
                        {/* Pulse effect */}
                        <div 
                          className="absolute inset-0 rounded-full border-2 border-white animate-ping"
                          style={{
                            opacity: hoveredCard === testimonial.id ? 0.6 : 0,
                            animationDuration: '2s'
                          }}
                        />
                      </div>

                      {/* Video title overlay */}
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <h3 className="text-lg md:text-xl font-semibold [font-family:'Fahkwang',Helvetica] mb-2">
                          {testimonial.title}
                        </h3>
                        <p className="text-sm md:text-base text-white/90 [font-family:'Fahkwang',Helvetica]">
                          {testimonial.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* Enhanced Fancybox Styles */
        .fancybox__container {
          --fancybox-bg: rgba(0, 0, 0, 0.85);
          --fancybox-accent-color: #75BF44;
        }

        .fancybox__backdrop {
          background: var(--fancybox-bg);
          backdrop-filter: blur(5px);
        }

        .fancybox__content {
          padding: 0;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          overflow: hidden;
          max-width: 90vw;
          max-height: 90vh;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
        }

        .fancybox__content video {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 8px;
          filter: brightness(1.1) contrast(1.05);
          background: #000;
        }

        .fancybox__toolbar {
          background: transparent;
          padding: 20px;
        }

        .fancybox__button {
          color: white !important;
          background: rgba(255, 255, 255, 0.15) !important;
          border-radius: 50% !important;
          width: 44px !important;
          height: 44px !important;
          padding: 10px !important;
          margin: 0 5px !important;
          transition: all 0.3s ease !important;
          backdrop-filter: blur(10px) !important;
          border: 2px solid rgba(255, 255, 255, 0.2) !important;
        }

        .fancybox__button:hover {
          background: rgba(117, 191, 68, 0.8) !important;
          transform: scale(1.1) !important;
          border-color: rgba(117, 191, 68, 0.8) !important;
        }

        .fancybox__button--close {
          top: 20px !important;
          right: 20px !important;
        }

        .fancybox-fadeIn {
          animation: fancybox-fadeIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .fancybox-fadeOut {
          animation: fancybox-fadeOut 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        @keyframes fancybox-fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes fancybox-fadeOut {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
        }

        /* Mobile responsive adjustments */
        @media (max-width: 768px) {
          .fancybox__button {
            width: 36px !important;
            height: 36px !important;
            padding: 8px !important;
            margin: 0 3px !important;
          }
          
          .fancybox__content {
            max-width: 95vw;
            max-height: 85vh;
          }
          
          .fancybox__toolbar {
            padding: 15px;
          }
        }

        /* Ensure video controls are visible */
        .fancybox__content video::-webkit-media-controls {
          display: flex !important;
        }

        .fancybox__content video::-webkit-media-controls-panel {
          background: rgba(0, 0, 0, 0.7) !important;
        }

        /* Fix video brightness and contrast */
        .fancybox__content video::-webkit-media-controls-timeline {
          background: rgba(255, 255, 255, 0.3) !important;
        }

        .fancybox__content video::-webkit-media-controls-current-time-display,
        .fancybox__content video::-webkit-media-controls-time-remaining-display {
          color: white !important;
        }

        /* Ensure proper video rendering */
        .fancybox__slide {
          background: transparent !important;
        }

        .fancybox__content > video {
          background-color: #000 !important;
          filter: brightness(1.15) contrast(1.1) saturate(1.05) !important;
        }
      `}</style>
    </section>
  );
};