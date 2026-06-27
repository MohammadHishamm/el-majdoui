'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../economic/ProgramsSection.module.css';

const LINK_ARROW = '/images/economic/Icon.svg';
const badgeStyle = { backgroundColor: 'rgba(255, 255, 255, 0.95)', color: '#005761' };

export default function ProgramsSection({ heading = '', cards = /** @type {any[]} */ ([]) }) {
  const containerRef = useRef(null);
  const headingWords = (heading || '').split(' ');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: containerRef.current, start: 'top 85%', toggleActions: 'restart reverse restart reverse' },
        });
        tl.from('.animate-section-content-s4', { opacity: 0, y: 50, duration: 0.9, ease: 'power3.out' });
        tl.from('.animate-heading-word-s4', { opacity: 0, x: 25, duration: 0.8, stagger: 0.05, ease: 'power3.out' }, '-=0.7');
        tl.from('.animate-prog-card', { opacity: 0, y: 40, duration: 0.8, stagger: 0.15, ease: 'power3.out' }, '-=0.5');
        tl.from('.animate-card-title-word', { opacity: 0, x: 15, duration: 0.5, stagger: 0.03, ease: 'power2.out' }, '-=0.4');
        tl.from('.animate-card-desc-word', { opacity: 0, x: 10, duration: 0.6, stagger: 0.015, ease: 'power2.out' }, '-=0.3');
      }, containerRef);
      return () => ctx.revert();
    }
  }, [cards.length]);

  return (
    <section ref={containerRef} className={styles.section}>
      <div className="animate-section-content-s4" style={{ width: '100%' }}>
        <h2 className={styles.heading}>
          {headingWords.map((word, idx) => (
            <span key={idx} className="animate-heading-word-s4" style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
              {word}
              {idx < headingWords.length - 1 ? ' ' : ''}
            </span>
          ))}
        </h2>

        <div className={styles.grid}>
          {cards.map((card, ci) => {
            const titleWords = (card.title || '').split(' ');
            const descWords = (card.description || '').split(' ');
            return (
              <Link key={ci} href={card.href || '#'} className={`${styles.card} animate-prog-card`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className={styles.imageWrapper}>
                  {card.image && (
                    <Image src={card.image} alt={card.title || ''} fill sizes="(max-width: 1120px) 100vw, 355px" style={{ objectFit: 'cover' }} />
                  )}
                  {card.tag && (
                    <span className={styles.badge} style={badgeStyle}>{card.tag}</span>
                  )}
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>
                    {titleWords.map((word, wIdx) => (
                      <span key={wIdx} className="animate-card-title-word" style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                        {word}
                        {wIdx < titleWords.length - 1 ? ' ' : ''}
                      </span>
                    ))}
                  </h3>
                  <p className={styles.cardDescription}>
                    {descWords.map((word, wIdx) => (
                      <span key={wIdx} className="animate-card-desc-word" style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                        {word}
                        {wIdx < descWords.length - 1 ? ' ' : ''}
                      </span>
                    ))}
                  </p>
                  <span className={styles.link}>
                    <span>اعرف أكثر عن المبادرة</span>
                    <Image src={LINK_ARROW} alt="" width={16} height={16} className={styles.linkIcon} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
