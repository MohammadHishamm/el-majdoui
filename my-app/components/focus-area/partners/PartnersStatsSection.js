'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../economic/StatsSection.module.css';

export default function PartnersStatsSection() {
  const containerRef = useRef(null);
  const num1Ref = useRef(null);
  const num2Ref = useRef(null);

  const label1Text = "جمعية شريكة تم تمكينها وتطويرها";
  const label1Words = label1Text.split(' ');

  const label2Text = "أدلة ونماذج عمل مؤسسية منشورة";
  const label2Words = label2Text.split(' ');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();

      // Desktop animation (smooth morphing full-width image on entry)
      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'restart reverse restart reverse',
          }
        });

        // 1. Overall section content wrapper entrance
        tl.from('.animate-section-content-s3', {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: 'power3.out',
        });

        // 2. Morph image wrapper from full row width (100%) to grid width (57.8%)
        tl.fromTo('.animate-stat-img-wrapper',
          {
            width: '100%',
            borderRadius: '0px 0px 0px 0px',
          },
          {
            width: '57.8%',
            borderRadius: '0px 120px 0px 0px',
            duration: 1.2,
            ease: 'power2.inOut',
          },
          '-=0.4'
        );

        // 3. Reveal the cards column from the right
        tl.fromTo('.animate-stat-card-col',
          {
            opacity: 0,
            x: 80,
          },
          {
            opacity: 1,
            x: 0,
            duration: 1.0,
            ease: 'power2.out',
          },
          '-=1.0' // overlaps with image shrinking
        );

        // 4. Count up animation for number 1 (11)
        const count1Obj = { val: 0 };
        tl.to(count1Obj, {
          val: 11,
          duration: 1.2,
          ease: 'power2.out',
          onUpdate: () => {
            if (num1Ref.current) {
              num1Ref.current.innerText = Math.floor(count1Obj.val).toString();
            }
          }
        }, '-=0.8');

        // 5. Staggered label words for card 1
        tl.from('.animate-l1-word', {
          opacity: 0,
          x: 10,
          duration: 0.5,
          stagger: 0.04,
          ease: 'power2.out',
        }, '-=0.8');

        // 6. Count up animation for number 2 (3)
        const count2Obj = { val: 0 };
        tl.to(count2Obj, {
          val: 3,
          duration: 1.5,
          ease: 'power2.out',
          onUpdate: () => {
            if (num2Ref.current) {
              num2Ref.current.innerText = Math.floor(count2Obj.val).toLocaleString('en-US');
            }
          }
        }, '-=1.0');

        // 7. Staggered label words for card 2
        tl.from('.animate-l2-word', {
          opacity: 0,
          x: 10,
          duration: 0.5,
          stagger: 0.04,
          ease: 'power2.out',
        }, '-=1.2');
      });

      // Mobile animation (standard slide-up, stacked layout)
      mm.add("(max-width: 767px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            toggleActions: 'restart reverse restart reverse',
          }
        });

        // 1. Overall content wrapper fade/slide up
        tl.from('.animate-section-content-s3', {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: 'power3.out',
        });

        // Ensure static values are set in case desktop overrides occurred
        gsap.set('.animate-stat-img-wrapper', { width: '100%' });
        gsap.set('.animate-stat-card-col', { opacity: 1, x: 0 });

        // 2. Count up animation for number 1 (11)
        const count1Obj = { val: 0 };
        tl.to(count1Obj, {
          val: 11,
          duration: 1.0,
          ease: 'power2.out',
          onUpdate: () => {
            if (num1Ref.current) {
              num1Ref.current.innerText = Math.floor(count1Obj.val).toString();
            }
          }
        }, '-=0.4');

        // 3. Staggered label words for card 1
        tl.from('.animate-l1-word', {
          opacity: 0,
          x: 10,
          duration: 0.4,
          stagger: 0.04,
          ease: 'power2.out',
        }, '-=0.8');

        // 4. Count up animation for number 2 (3)
        const count2Obj = { val: 0 };
        tl.to(count2Obj, {
          val: 3,
          duration: 1.2,
          ease: 'power2.out',
          onUpdate: () => {
            if (num2Ref.current) {
              num2Ref.current.innerText = Math.floor(count2Obj.val).toLocaleString('en-US');
            }
          }
        }, '-=0.8');

        // 5. Staggered label words for card 2
        tl.from('.animate-l2-word', {
          opacity: 0,
          x: 10,
          duration: 0.4,
          stagger: 0.04,
          ease: 'power2.out',
        }, '-=0.8');
      });

      return () => mm.revert();
    }
  }, []);

  return (
    <section ref={containerRef} className={styles.section}>
      <div className="animate-section-content-s3" style={{ width: '100%' }}>
        <div className={styles.row}>

          {/* RIGHT — stat cards */}
          <div className={`${styles.cardsCol} animate-stat-card-col`}>

            {/* Card 1: 11 جمعية شريكة تم تمكينها وتطويرها */}
            <div className={styles.statCard}>
              <span ref={num1Ref} className={styles.statNumber}>0</span>
              <span className={styles.statLabel}>
                {label1Words.map((word, idx) => (
                  <span
                    key={idx}
                    className="animate-l1-word"
                    style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
                  >
                    {word}
                    {idx < label1Words.length - 1 ? ' ' : ''}
                  </span>
                ))}
              </span>
            </div>

            {/* Card 2: 3 أدلة ونماذج عمل مؤسسية منشورة */}
            <div className={styles.statCard}>
              <span ref={num2Ref} className={styles.statNumber}>0</span>
              <span className={styles.statLabel}>
                {label2Words.map((word, idx) => (
                  <span
                    key={idx}
                    className="animate-l2-word"
                    style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
                  >
                    {word}
                    {idx < label2Words.length - 1 ? ' ' : ''}
                  </span>
                ))}
              </span>
            </div>

          </div>

          {/* LEFT — layout placeholder (keeps space for the image) */}
          <div className={styles.imageCol}></div>

          {/* Actual image wrapper which is absolute in desktop */}
          <div className={`${styles.imageWrapper} animate-stat-img-wrapper`}>
            <Image
              src="/images/focus-area/partners/section-2.png"
              alt="شركاء التنفيذ"
              fill
              sizes="(max-width: 1120px) 100vw, 681px"
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>

        </div>
      </div>
    </section>
  );
}
