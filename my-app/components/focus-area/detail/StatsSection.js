'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../economic/StatsSection.module.css';

function StatCard({ item, wordClass, numRef }) {
  const words = (item?.label_ar || item?.label || '').split(' ');
  return (
    <div className={styles.statCard}>
      <span ref={numRef} className={styles.statNumber}>0</span>
      <span className={styles.statLabel}>
        {words.map((word, idx) => (
          <span key={idx} className={wordClass} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            {word}
            {idx < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </span>
    </div>
  );
}

export default function StatsSection({ items = /** @type {any[]} */ ([]), image = '' }) {
  const containerRef = useRef(null);
  const num1Ref = useRef(null);
  const num2Ref = useRef(null);
  const a = items[0] ?? { value: 0, suffix: '' };
  const b = items[1] ?? { value: 0, suffix: '' };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    const setNum = (ref, val, suffix) => {
      if (ref.current) ref.current.innerText = Math.floor(val).toLocaleString('en-US') + (suffix || '');
    };

    mm.add('(min-width: 768px)', () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: containerRef.current, start: 'top 80%', toggleActions: 'restart reverse restart reverse' } });
      tl.from('.animate-section-content-s3', { opacity: 0, y: 40, duration: 0.8, ease: 'power3.out' });
      tl.fromTo('.animate-stat-img-wrapper', { width: '100%', borderRadius: '0px 0px 0px 0px' }, { width: '57.8%', borderRadius: '0px 120px 0px 0px', duration: 1.2, ease: 'power2.inOut' }, '-=0.4');
      tl.fromTo('.animate-stat-card-col', { opacity: 0, x: 80 }, { opacity: 1, x: 0, duration: 1.0, ease: 'power2.out' }, '-=1.0');
      const c1 = { val: 0 };
      tl.to(c1, { val: a.value, duration: 1.2, ease: 'power2.out', onUpdate: () => setNum(num1Ref, c1.val, a.suffix) }, '-=0.8');
      tl.from('.animate-l1-word', { opacity: 0, x: 10, duration: 0.5, stagger: 0.04, ease: 'power2.out' }, '-=0.8');
      const c2 = { val: 0 };
      tl.to(c2, { val: b.value, duration: 1.5, ease: 'power2.out', onUpdate: () => setNum(num2Ref, c2.val, b.suffix) }, '-=1.0');
      tl.from('.animate-l2-word', { opacity: 0, x: 10, duration: 0.5, stagger: 0.04, ease: 'power2.out' }, '-=1.2');
    });

    mm.add('(max-width: 767px)', () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: containerRef.current, start: 'top 85%', toggleActions: 'restart reverse restart reverse' } });
      tl.from('.animate-section-content-s3', { opacity: 0, y: 40, duration: 0.8, ease: 'power3.out' });
      gsap.set('.animate-stat-img-wrapper', { width: '100%' });
      gsap.set('.animate-stat-card-col', { opacity: 1, x: 0 });
      const c1 = { val: 0 };
      tl.to(c1, { val: a.value, duration: 1.0, ease: 'power2.out', onUpdate: () => setNum(num1Ref, c1.val, a.suffix) }, '-=0.4');
      tl.from('.animate-l1-word', { opacity: 0, x: 10, duration: 0.4, stagger: 0.04, ease: 'power2.out' }, '-=0.8');
      const c2 = { val: 0 };
      tl.to(c2, { val: b.value, duration: 1.2, ease: 'power2.out', onUpdate: () => setNum(num2Ref, c2.val, b.suffix) }, '-=0.8');
      tl.from('.animate-l2-word', { opacity: 0, x: 10, duration: 0.4, stagger: 0.04, ease: 'power2.out' }, '-=0.8');
    });

    return () => mm.revert();
  }, [a.value, a.suffix, b.value, b.suffix]);

  return (
    <section ref={containerRef} className={styles.section}>
      <div className="animate-section-content-s3" style={{ width: '100%' }}>
        <div className={styles.row}>
          <div className={`${styles.cardsCol} animate-stat-card-col`}>
            <StatCard item={a} wordClass="animate-l1-word" numRef={num1Ref} />
            <StatCard item={b} wordClass="animate-l2-word" numRef={num2Ref} />
          </div>
          <div className={styles.imageCol}></div>
          <div className={`${styles.imageWrapper} animate-stat-img-wrapper`}>
            {image && (
              <Image src={image} alt="" fill sizes="(max-width: 1120px) 100vw, 681px" style={{ objectFit: 'cover' }} priority />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
