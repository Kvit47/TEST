"use client"
import CollectionSection from "@/src/views/home/ui/collection";
import ProductsSection from "@/src/views/home/ui/products";
import Shopify from "@/src/views/home/ui/shopify";
import Hero from "@/src/widgets/hero/hero";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

export default function Home() {
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const collectionSectionRef = useRef<HTMLDivElement>(null);
  const shopifySectionRef = useRef<HTMLDivElement>(null);


  useGSAP(() => {
    if (!heroSectionRef.current || !collectionSectionRef.current || !shopifySectionRef.current) return;
    const heroSection = heroSectionRef.current;
    const collectionSection = collectionSectionRef.current;
    const shopifySection = shopifySectionRef.current;

    const runAnimation = () => {
      gsap.to(heroSection, {
        yPercent: 120,
        rotate: -10,
        scale: 0.8,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: {
          trigger: heroSection,
          start: "top top",
          end: "+=500",
          scrub: 1.5,
        }
      })

      gsap.fromTo(
        collectionSection,
        {
          y: 200,
          rotate: 8,
          opacity: 0,
          transformOrigin: "left center",
        },
        {
          y: 0,
          rotate: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: collectionSection,
            start: "top 100%",
            end: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(shopifySection, { opacity: 0 }, {
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: shopifySection,
          start: "top 90%",
          end: "top 40%",
          scrub: 1,
        }
      })


    }

    runAnimation();

  }, [])

  return (

    <main>
      <section ref={heroSectionRef} className="relative overflow-hidden w-full h-screen z-0">
        <Hero />
      </section>
      <section ref={collectionSectionRef} className="relative w-full min-h-[120vh]">
        <CollectionSection />
      </section>
      <section ref={shopifySectionRef} className="relative w-full">
        <Shopify />
      </section>
      <section className="relative w-full min-h-[500px]">
        <ProductsSection />
      </section>
      
    </main>
  );
}
