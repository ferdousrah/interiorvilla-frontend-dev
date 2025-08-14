import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  type: 'photo' | 'video' | 'plan';
  height: number; // For masonry layout
}

export const ProjectGallerySection = (): JSX.Element => {
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("photo-gallery");
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Heading animation
    if (headingRef.current) {
      gsap.fromTo(headingRef.current,
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
            trigger: headingRef.current,
            start: "top 85%",
            end: "top 55%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Description animation
    if (descriptionRef.current) {
      gsap.fromTo(descriptionRef.current,
        {
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: descriptionRef.current,
            start: "top 85%",
            end: "top 65%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Tabs animation
    if (tabsRef.current) {
      gsap.fromTo(tabsRef.current,
        {
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: tabsRef.current,
            start: "top 85%",
            end: "top 65%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Gallery animation
    if (galleryRef.current) {
      const images = galleryRef.current.children;
      
      gsap.fromTo(images,
        {
          opacity: 0,
          y: 80,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: galleryRef.current,
            start: "top 85%",
            end: "top 55%",
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

  // Initialize Fancybox when activeTab changes
  useEffect(() => {
    // Destroy any existing Fancybox instances
    Fancybox.destroy();
    
    // Wait for DOM to update after tab change
    const timer = setTimeout(() => {
      // Initialize Fancybox with proper configuration
      Fancybox.bind(`[data-fancybox="gallery-${activeTab}"]`, {
        // Animation settings
        animated: true,
        showClass: "fancybox-fadeIn",
        hideClass: "fancybox-fadeOut",
        dragToClose: true,
        
        // Image settings
        Image: {
          zoom: true,
          fit: "cover",
          preload: 1
        },
        
        // Toolbar configuration
        Toolbar: {
          display: {
            left: [],
            middle: [],
            right: ["zoom", "slideshow", "thumbs", "download", "close"]
          }
        },
        
        // UI settings
        closeButton: true,
        wheel: "slide",
        touch: {
          vertical: true,
          momentum: true
        },
        
        // Event handlers
        on: {
          ready: (fancybox) => {
            console.log("Fancybox ready");
          }
        }
      });
    }, 200);

    return () => {
      clearTimeout(timer);
      Fancybox.destroy();
    };
  }, [activeTab]);

  const tabs = [
    { id: "photo-gallery", label: "Photos" },
    { id: "video-tour", label: "Videos" },
    { id: "floor-plan", label: "Plans" }
  ];

  // Gallery items for different tabs
  const galleryItems: { [key: string]: GalleryItem[] } = {
    "photo-gallery": [
      {
        id: 1,
        src: "/a-residential-interior-image.png",
        alt: "Living Room Design",
        type: 'photo',
        height: 400
      },
      {
        id: 2,
        src: "/create-an-image-where-a-beautiful-girl-shows-her-bedroom-interio.png",
        alt: "Bedroom Interior",
        type: 'photo',
        height: 200
      },
      {
        id: 3,
        src: "/a-office-interior-image.png",
        alt: "Office Space",
        type: 'photo',
        height: 250
      },
      {
        id: 4,
        src: "/dining-interior.png",
        alt: "Dining Area",
        type: 'photo',
        height: 200
      },
      {
        id: 5,
        src: "/rectangle-8.png",
        alt: "Modern Kitchen",
        type: 'photo',
        height: 300
      },
      {
        id: 6,
        src: "/rectangle-9.png",
        alt: "Bathroom Design",
        type: 'photo',
        height: 280
      }
    ],
    "video-tour": [
      {
        id: 7,
        src: "/a-residential-interior-image.png",
        alt: "Interior Showcase 1",
        type: 'photo',
        height: 300
      },
      {
        id: 8,
        src: "/a-office-interior-image.png",
        alt: "Interior Showcase 2",
        type: 'photo',
        height: 250
      },
      {
        id: 9,
        src: "/create-an-image-where-a-beautiful-girl-shows-her-bedroom-interio.png",
        alt: "Interior Showcase 3",
        type: 'photo',
        height: 320
      }
    ],
    "floor-plan": [
      {
        id: 10,
        src: "/dining-interior.png",
        alt: "Layout Design 1",
        type: 'photo',
        height: 350
      },
      {
        id: 11,
        src: "/rectangle-8.png",
        alt: "Layout Design 2",
        type: 'photo',
        height: 280
      },
      {
        id: 12,
        src: "/a-residential-interior-image.png",
        alt: "Floor Plan Overview",
        type: 'photo',
        height: 300
      }
    ]
  };

  const currentItems = galleryItems[activeTab] || [];

  return (
    <section 
      ref={sectionRef}
      className="py-16 md:py-24 bg-white"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 
            ref={headingRef}
            className="text-2xl md:text-3xl lg:text-4xl font-medium [font-family:'Fahkwang',Helvetica] text-[#01190c] mb-6"
          >
            Project Gallery
          </h2>
          <p 
            ref={descriptionRef}
            className="text-base [font-family:'Fahkwang',Helvetica] text-[#626161] max-w-3xl mx-auto leading-relaxed"
          >
            Explore a curated collection of captivating visuals that showcase the transformation of this space into a harmonious blend of style and functionality.
          </p>
        </div>

        {/* Tabs */}
        <div 
          ref={tabsRef}
          className="flex justify-center mb-16"
        >
          <div className="relative bg-white rounded-2xl p-2 shadow-lg border border-gray-100 inline-flex space-x-2">
            {/* Background slider for active tab */}
            <motion.div
              className="absolute top-2 bottom-2 bg-primary rounded-xl shadow-md"
              initial={false}
              animate={{
                left: `${tabs.findIndex(tab => tab.id === activeTab) * (100 / tabs.length)}%`,
                width: `${100 / tabs.length}%`
              }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              style={{
                left: `${tabs.findIndex(tab => tab.id === activeTab) * 33.33}%`,
                width: '33.33%'
              }}
            />
            
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-3 text-base [font-family:'Fahkwang',Helvetica] font-medium transition-all duration-300 rounded-xl z-10 min-w-[140px] ${
                  activeTab === tab.id 
                    ? 'text-white shadow-lg' 
                    : 'text-[#626161] hover:text-[#01190c] hover:bg-gray-50'
                }`}
                style={{
                  transform: activeTab === tab.id ? 'translateY(-1px)' : 'translateY(0)',
                  textShadow: activeTab === tab.id ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                <span className="relative z-10">{tab.label}</span>
                
                {/* Icon for each tab */}
                <div className={`inline-flex items-center ml-2 transition-all duration-300 ${
                  activeTab === tab.id ? 'text-white/80' : 'text-[#626161]'
                }`}>
                  {tab.id === 'photo-gallery' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                  {tab.id === 'video-tour' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                  {tab.id === 'floor-plan' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            ref={galleryRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {currentItems.map((item, index) => (
              <motion.div
                key={`${activeTab}-${item.id}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative group overflow-hidden cursor-pointer"
                onMouseEnter={() => setHoveredImage(item.id)}
                onMouseLeave={() => setHoveredImage(null)}
              >
                <a
                  href={item.src}
                  data-fancybox={`gallery-${activeTab}`}
                  data-caption={`${item.alt} - ${item.type}`}
                  className="block w-full h-80 cursor-pointer group"
                >
                  <div className="relative w-full h-80 overflow-hidden rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-500">
                    {/* Enhanced gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                    
                    {/* Category badge */}
                    <div className="absolute top-3 left-3 z-20">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-800 rounded-full shadow-sm">
                        {item.type === 'photo' ? 'Photo' : item.type === 'video' ? 'Video' : 'Plan'}
                      </span>
                    </div>
                    
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
                      loading="lazy"
                    />
                    
                    {/* Enhanced Zoom Icon */}
                    <div 
                      className="absolute inset-0 flex items-center justify-center transition-all duration-500 z-20"
                      style={{
                        opacity: hoveredImage === item.id ? 1 : 0,
                        transform: hoveredImage === item.id ? 'scale(1) rotate(0deg)' : 'scale(0.8) rotate(-10deg)'
                      }}
                    >
                      <div className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl border border-white/20 hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                      
                      {/* Ripple effect */}
                      <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping" style={{
                        animationDuration: '2s',
                        opacity: hoveredImage === item.id ? 0.6 : 0
                      }} />
                    </div>

                    {/* Image title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                      <h4 className="text-white font-medium text-sm [font-family:'Fahkwang',Helvetica] truncate">
                        {item.alt}
                      </h4>
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <style jsx global>{`
        /* Enhanced Fancybox Styles */
        .fancybox__container {
          --fancybox-bg: rgba(0, 0, 0, 0.95);
          --fancybox-accent-color: #75bf44;
        }

        .fancybox__backdrop {
          background: var(--fancybox-bg);
        }

        .fancybox__content {
          background: transparent;
          padding: 0;
          border-radius: 8px;
          overflow: hidden;
        }

        .fancybox__content > .fancybox__image {
          width: 100% !important;
          height: 100% !important;
          object-fit: contain !important;
          max-width: 90vw !important;
          max-height: 90vh !important;
        }

        .fancybox__slide {
          padding: 20px;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        .fancybox__toolbar {
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          border-radius: 8px;
          margin: 20px;
          padding: 8px;
        }

        .fancybox__button {
          color: white !important;
          background: rgba(255, 255, 255, 0.1) !important;
          border-radius: 50% !important;
          transition: all 0.3s ease !important;
          width: 40px !important;
          height: 40px !important;
          margin: 0 2px !important;
        }

        .fancybox__button:hover {
          background: #75bf44 !important;
          transform: scale(1.1) !important;
        }

        .fancybox__nav {
          background: rgba(0, 0, 0, 0.7) !important;
          color: white !important;
          border-radius: 50% !important;
          width: 48px !important;
          height: 48px !important;
        }

        .fancybox__nav:hover {
          background: #75bf44 !important;
        }

        .fancybox__caption {
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          margin: 20px;
          text-align: center;
        }

        /* Mobile adjustments */
        @media (max-width: 768px) {
          .fancybox__button {
            width: 35px !important;
            height: 35px !important;
          }
          
          .fancybox__nav {
            width: 40px !important;
            height: 40px !important;
          }

          .fancybox__toolbar {
            margin: 10px !important;
            padding: 6px !important;
          }
        }
      `}</style>
    </section>
  );
};