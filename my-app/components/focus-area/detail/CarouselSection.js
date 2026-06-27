'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../economic/TargetGroupsSection.module.css';

const LEFT_ARROW = '/images/economic/LeftArrow.svg';
const RIGHT_ARROW = '/images/economic/RightArrow.svg';
const AUTOPLAY_MS = 5000;
const SLIDE_OFFSET = 72;

function getSlideLayer(container, index) {
  return container?.querySelector(`[data-slide-index="${index}"]`) ?? null;
}

export default function CarouselSection({ heading = '', slides = /** @type {any[]} */ ([]) }) {
  const sectionRef = useRef(null);
  const rightImgRef = useRef(null);
  const leftImgRef = useRef(null);
  const centerTextRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const activeIndexRef = useRef(0);

  const headingWords = (heading || '').split(' ');
  const count = slides.length;

  const goToSlide = useCallback((newIndex) => {
    if (isAnimatingRef.current || count === 0) return;
    if (newIndex < 0 || newIndex >= count) return;
    const prevIndex = activeIndexRef.current;
    if (newIndex === prevIndex) return;
    isAnimatingRef.current = true;
    const direction = newIndex > prevIndex ? 1 : -1;
    const prevRight = getSlideLayer(rightImgRef.current, prevIndex);
    const prevLeft = getSlideLayer(leftImgRef.current, prevIndex);
    const nextRight = getSlideLayer(rightImgRef.current, newIndex);
    const nextLeft = getSlideLayer(leftImgRef.current, newIndex);
    gsap.set([nextRight, nextLeft], { x: direction * SLIDE_OFFSET, opacity: 0 });
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set([prevRight, prevLeft], { x: 0, opacity: 0 });
        isAnimatingRef.current = false;
      },
    });
    tl.to([prevRight, prevLeft].filter(Boolean), { x: direction * -SLIDE_OFFSET, opacity: 0, duration: 0.42, ease: 'power2.inOut' }, 0);
    tl.to(centerTextRef.current, { opacity: 0, y: direction * -10, duration: 0.32, ease: 'power2.inOut' }, 0);
    tl.call(() => {
      activeIndexRef.current = newIndex;
      setActiveIndex(newIndex);
    });
    tl.to([nextRight, nextLeft].filter(Boolean), { x: 0, opacity: 1, duration: 0.48, ease: 'power2.inOut' });
    tl.to(centerTextRef.current, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.inOut' }, '<0.06');
  }, [count]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      const entranceTl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top 85%', toggleActions: 'play none none none' },
      });
      entranceTl.from('.animate-heading-word-s2', { opacity: 0, x: 25, duration: 0.8, stagger: 0.04, ease: 'power3.out' });
      entranceTl.from('.animate-carousel-s2', { opacity: 0, y: 50, duration: 0.8, ease: 'power3.out' }, '-=0.5');
    }, section);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (paused || count === 0) return;
    const id = setTimeout(() => {
      goToSlide((activeIndexRef.current + 1) % count);
    }, AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [activeIndex, paused, goToSlide, count]);

  const handleNext = useCallback(() => goToSlide((activeIndexRef.current + 1) % count), [goToSlide, count]);
  const handlePrev = useCallback(() => goToSlide((activeIndexRef.current - 1 + count) % count), [goToSlide, count]);

  if (count === 0) return null;
  const currentSlide = slides[Math.min(activeIndex, count - 1)];

  return (
    <section ref={sectionRef} className={styles.section} data-nav-surface="light">
      <div className={styles.stickyViewport}>
        <h2 className={styles.heading}>
          {headingWords.map((word, idx) => (
            <span key={idx} className="animate-heading-word-s2" style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
              {word}
              {idx < headingWords.length - 1 ? ' ' : ''}
            </span>
          ))}
        </h2>

        <div className={`${styles.carousel} animate-carousel-s2`} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div ref={rightImgRef} className={styles.sideImage}>
            {slides.map((slide, idx) => (
              <div key={idx} data-slide-index={idx} className={`${styles.slideLayer} ${idx === 0 ? styles.slideLayerActive : ''}`}>
                {slide.imageRight && (
                  <Image src={slide.imageRight} alt="" fill sizes="(max-width: 768px) 100vw, 359px" style={{ objectFit: 'cover' }} priority={idx === 0} />
                )}
              </div>
            ))}
          </div>

          <div className={styles.centerCard}>
            <button className={styles.arrowButton} onClick={handlePrev} aria-label="السابق">
              <Image className={styles.arrowDesktop} src={LEFT_ARROW} alt="" width={50} height={50} />
              <Image className={styles.arrowMobile} src={RIGHT_ARROW} alt="" width={50} height={50} />
            </button>

            <div className={styles.centerContent} ref={centerTextRef}>
              <span className={styles.centerText}>{currentSlide.label}</span>
              <div className={styles.dots}>
                {slides.map((_, idx) => (
                  <button key={idx} className={`${styles.dot} ${idx === activeIndex ? styles.dotActive : ''}`} onClick={() => goToSlide(idx)} aria-label={`الانتقال إلى الشريحة ${idx + 1}`} />
                ))}
              </div>
            </div>

            <button className={styles.arrowButton} onClick={handleNext} aria-label="التالي">
              <Image className={styles.arrowDesktop} src={RIGHT_ARROW} alt="" width={50} height={50} />
              <Image className={styles.arrowMobile} src={LEFT_ARROW} alt="" width={50} height={50} />
            </button>
          </div>

          <div ref={leftImgRef} className={styles.sideImageLeft}>
            {slides.map((slide, idx) => (
              <div key={idx} data-slide-index={idx} className={`${styles.slideLayer} ${idx === 0 ? styles.slideLayerActive : ''}`}>
                {slide.imageLeft && (
                  <Image src={slide.imageLeft} alt="" fill sizes="(max-width: 768px) 100vw, 359px" style={{ objectFit: 'cover' }} priority={idx === 0} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
