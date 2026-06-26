'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../economic/ProgramsSection.module.css';

const DIR = '/images/focus-area/masged-majdoui';

// All mosque program badges share the same translucent-white / teal style.
const badgeStyle = { backgroundColor: 'rgba(255, 255, 255, 0.95)', color: '#005761' };

const programs = [
  {
    id: 1,
    tag: 'تشييد وتطوير',
    title: 'مبادرة عِمارة',
    description: 'تعنى بالهندسة المعمارية وبناء المساجد وتجهيزها بأحدث التقنيات المستدامة لخدمة المصلين.',
    image: `${DIR}/program-1.png`,
  },
  {
    id: 2,
    tag: 'تميز مؤسسي',
    title: 'مبادرة منارة',
    description: 'تفعيل دور المسجد ليكون مركزاً علمياً وثقافياً وصحياً يخدم الحي من خلال حلقات العلم والمبادرات الاجتماعية.',
    image: `${DIR}/program-2.png`,
  },
  {
    id: 3,
    tag: 'تشييد وتطوير',
    title: 'برنامج التشغيل المستدام',
    description: 'الإشراف الدوري والتشغيل الذكي لمنظومة المياه، الطاقة، والنظافة بجميع مساجد المجدوعي لضمان استدامتها.',
    image: `${DIR}/program-3.jpg`,
  },
];

export default function MosquesProgramsSection() {
  const containerRef = useRef(null);

  const headingText = "البرامج والمبادرات الحالية";
  const headingWords = headingText.split(' ');

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
        tl.from('.animate-section-content-s4', {
          opacity: 0,
          y: 50,
          duration: 0.9,
          ease: 'power3.out',
        });

        // 2. Animate section heading
        tl.from('.animate-heading-word-s4', {
          opacity: 0,
          x: 25,
          duration: 0.8,
          stagger: 0.05,
          ease: 'power3.out',
        }, '-=0.7');

        // 3. Animate cards sliding up
        tl.from('.animate-prog-card', {
          opacity: 0,
          y: 40,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
        }, '-=0.5');

        // 4. Stagger animate title words in cards
        tl.from('.animate-card-title-word', {
          opacity: 0,
          x: 15,
          duration: 0.5,
          stagger: 0.03,
          ease: 'power2.out',
        }, '-=0.4');

        // 5. Stagger animate description words in cards
        tl.from('.animate-card-desc-word', {
          opacity: 0,
          x: 10,
          duration: 0.6,
          stagger: 0.015,
          ease: 'power2.out',
        }, '-=0.3');

      }, containerRef);

      return () => ctx.revert();
    }
  }, []);

  return (
    <section ref={containerRef} className={styles.section}>
      <div className="animate-section-content-s4" style={{ width: '100%' }}>
        {/* Section Heading */}
        <h2 className={styles.heading}>
          {headingWords.map((word, idx) => (
            <span
              key={idx}
              className="animate-heading-word-s4"
              style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
            >
              {word}
              {idx < headingWords.length - 1 ? '\xa0' : ''}
            </span>
          ))}
        </h2>

        {/* Cards Grid */}
        <div className={styles.grid}>
          {programs.map((prog) => {
            const titleWords = prog.title.split(' ');
            const descWords = prog.description.split(' ');

            return (
              <div key={prog.id} className={`${styles.card} animate-prog-card`}>
                {/* Card Image Wrapper */}
                <div className={styles.imageWrapper}>
                  <Image
                    src={prog.image}
                    alt={prog.title}
                    fill
                    sizes="(max-width: 1120px) 100vw, 355px"
                    style={{ objectFit: 'cover' }}
                  />
                  {/* Badge Tag */}
                  <span className={styles.badge} style={badgeStyle}>
                    {prog.tag}
                  </span>
                </div>

                {/* Card Content */}
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>
                    {titleWords.map((word, wIdx) => (
                      <span
                        key={wIdx}
                        className="animate-card-title-word"
                        style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
                      >
                        {word}
                        {wIdx < titleWords.length - 1 ? '\xa0' : ''}
                      </span>
                    ))}
                  </h3>
                  <p className={styles.cardDescription}>
                    {descWords.map((word, wIdx) => (
                      <span
                        key={wIdx}
                        className="animate-card-desc-word"
                        style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
                      >
                        {word}
                        {wIdx < descWords.length - 1 ? '\xa0' : ''}
                      </span>
                    ))}
                  </p>
                  <a href="#" className={styles.link}>
                    <span>اعرف أكثر عن المبادرة</span>
                    <Image
                      src={`${DIR}/program-arrow.svg`}
                      alt="Arrow icon"
                      width={16}
                      height={16}
                      className={styles.linkIcon}
                    />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
