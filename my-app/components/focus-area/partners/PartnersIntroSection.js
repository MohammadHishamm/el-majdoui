'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../economic/EconomicEmpowermentSection.module.css';

export default function PartnersIntroSection() {
  const containerRef = useRef(null);

  const text = "تؤمن المؤسسة بأن الأثر التنموي المستدام لا يتحقق إلا من خلال كيانات تنفيذية قوية؛ لذا تلتزم بتمكين وتطوير جاهزية الجمعيات والمنظمات الشريكة، ورفع قدراتها التنظيمية والمالية لضمان تقديم منح ميسر ووصول الدعم لمستحقيه بأعلى كفاءة.";
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
        <h2 className={`${styles.heading} animate-title`}>شركاء التنفيذ</h2>

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
              {idx < words.length - 1 ? ' ' : ''}
            </span>
          ))}
        </p>
      </div>
      </div>
    </section>
  );
}
