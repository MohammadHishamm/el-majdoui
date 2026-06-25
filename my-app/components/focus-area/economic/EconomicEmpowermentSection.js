'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './EconomicEmpowermentSection.module.css';

export default function EconomicEmpowermentSection() {
  const containerRef = useRef(null);
  
  const text = "تسعى المؤسسة من خلال قطاع التمكين الاقتصادي إلى نقل الفئات الأشد حاجة من دائرة الاحتياج والدعم المؤقت إلى دائرة الإنتاج والاعتماد على الذات، عبر تقديم حلول تمويلية ميسرة وبرامج تأهيلية نوعية بالتعاون مع الجمعيات الشريكة.";
  const words = text.split(' ');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            toggleActions: 'restart reverse restart reverse',
          }
        });

        // 1. Animate the overall section content wrapper (fade & slide up)
        tl.from('.animate-section-content', {
          opacity: 0,
          y: 50,
          duration: 0.9,
          ease: 'power3.out',
        });

        // 2. Animate label and heading inside the rising container
        tl.from('.animate-title', {
          opacity: 0,
          y: 15,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out',
        }, '-=0.7');

        // 3. Staggered word animation from right to left
        tl.from('.animate-word', {
          opacity: 0,
          x: 20, // Slide in from the right
          duration: 0.7,
          stagger: 0.03,
          ease: 'power3.out',
        }, '-=0.5');
      }, containerRef);

      return () => ctx.revert();
    }
  }, []);

  return (
    <section
      ref={containerRef}
      className="-mt-28 bg-white pt-28"
      data-nav-surface="light"
    >
      <div className={styles.section}>
        <div className="animate-section-content" style={{ width: '100%' }}>
        {/* مجالات التركيز — Label */}
        <p className={`${styles.label} animate-title`}>مجالات التركيز</p>

        {/* Heading — full width, right aligned */}
        <h2 className={`${styles.heading} animate-title`}>التمكين الاقتصادي للمحتاج</h2>

        {/* Divider line — #E5E7EB, full width (~1px) */}
        <hr className={styles.divider} />

        {/* Description — full width, animated word by word */}
        <p className={styles.description}>
          {words.map((word, idx) => (
            <span
              key={idx}
              className="animate-word"
              style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
            >
              {word}
              {idx < words.length - 1 ? '\u00A0' : ''}
            </span>
          ))}
        </p>
      </div>
      </div>
    </section>
  );
}
