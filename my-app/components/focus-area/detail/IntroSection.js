'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../economic/EconomicEmpowermentSection.module.css';

const MOSQUES_LOGO = {
  light: '/images/identity/masaged-majdoui-icon-light.svg',
  dark: '/images/identity/masaged-majdoui-icon-dark.svg',
};

export default function IntroSection({ title = '', intro = '', slug = '' }) {
  const containerRef = useRef(null);
  const words = (intro || '').split(' ');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            toggleActions: 'restart reverse restart reverse',
          },
        });
        tl.from('.animate-section-content', { opacity: 0, y: 50, duration: 0.9, ease: 'power3.out' });
        tl.from('.animate-title', { opacity: 0, y: 15, duration: 0.7, stagger: 0.15, ease: 'power3.out' }, '-=0.7');
        tl.from('.animate-word', { opacity: 0, x: 20, duration: 0.7, stagger: 0.03, ease: 'power3.out' }, '-=0.5');
      }, containerRef);
      return () => ctx.revert();
    }
  }, [intro]);

  return (
    <section ref={containerRef} className={`-mt-28 bg-surface ${slug === 'mosques' ? 'pt-24' : 'pt-28'}`} data-nav-surface="light">
      <div className={`${styles.section} ${slug === 'mosques' ? styles.sectionMosques : ''}`}>
        <div className="animate-section-content" style={{ width: '100%' }}>
          <p className={`${styles.label} animate-title`}>مجالات التركيز</p>
          {slug === 'mosques' ? (
            <div className={`${styles.mosquesLogo} animate-title`}>
              <Image
                src={MOSQUES_LOGO.light}
                alt={title}
                width={380}
                height={222}
                priority
                className={`${styles.mosquesLogoImg} block dark:hidden`}
              />
              <Image
                src={MOSQUES_LOGO.dark}
                alt={title}
                width={380}
                height={222}
                priority
                className={`${styles.mosquesLogoImg} hidden dark:block`}
              />
            </div>
          ) : (
            <h2 className={`${styles.heading} animate-title`}>{title}</h2>
          )}
          <hr className={styles.divider} />
          <p className={styles.description}>
            {words.map((word, idx) => (
              <span key={idx} className="animate-word" style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
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
