'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './TargetGroupsSection.module.css';

const slides = [
  {
    id: 1,
    text: 'الأسر المنتجة',
    color: '#80A5E0',
    rightImage: '/images/economic/Rectangle 4.png',
    leftImage: '/images/economic/Rectangle 3.png',
  },
  {
    id: 2,
    text: 'الشباب الباحثون عن التأهيل والتدريب',
    color: '#2BB5B8',
    rightImage: '/images/economic/Rectangle 1s.png',
    leftImage: '/images/economic/Rectangle 2s.png',
  },
  {
    id: 3,
    text: 'الأفراد المتعثرين',
    color: '#005761',
    rightImage: '/images/economic/Rectangle 4s.png',
    leftImage: '/images/economic/Rectangle 3s.png',
  },
];

const AUTOPLAY_MS = 5000;
const SLIDE_OFFSET = 72;

function getSlideLayer(container, index) {
  return container?.querySelector(`[data-slide-index="${index}"]`) ?? null;
}

export default function TargetGroupsSection() {
  const sectionRef = useRef(null);
  const rightImgRef = useRef(null);
  const leftImgRef = useRef(null);
  const centerTextRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const activeIndexRef = useRef(0);

  const headingText = "الفئات المستهدفة في هذا القطاع";
  const headingWords = headingText.split(' ');

  const goToSlide = useCallback((newIndex) => {
    if (isAnimatingRef.current) return;
    if (newIndex < 0 || newIndex >= slides.length) return;

    const prevIndex = activeIndexRef.current;
    if (newIndex === prevIndex) return;

    isAnimatingRef.current = true;
    const direction = newIndex > prevIndex ? 1 : -1;

    const prevRight = getSlideLayer(rightImgRef.current, prevIndex);
    const prevLeft = getSlideLayer(leftImgRef.current, prevIndex);
    const nextRight = getSlideLayer(rightImgRef.current, newIndex);
    const nextLeft = getSlideLayer(leftImgRef.current, newIndex);

    gsap.set([nextRight, nextLeft], {
      x: direction * SLIDE_OFFSET,
      opacity: 0,
    });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set([prevRight, prevLeft], { x: 0, opacity: 0 });
        isAnimatingRef.current = false;
      },
    });

    tl.to([prevRight, prevLeft].filter(Boolean), {
      x: direction * -SLIDE_OFFSET,
      opacity: 0,
      duration: 0.42,
      ease: 'power2.inOut',
    }, 0);

    tl.to(centerTextRef.current, {
      opacity: 0,
      y: direction * -10,
      duration: 0.32,
      ease: 'power2.inOut',
    }, 0);

    tl.call(() => {
      activeIndexRef.current = newIndex;
      setActiveIndex(newIndex);
    });

    tl.to([nextRight, nextLeft].filter(Boolean), {
      x: 0,
      opacity: 1,
      duration: 0.48,
      ease: 'power2.inOut',
    });

    tl.to(centerTextRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.inOut',
    }, '<0.06');
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });

      entranceTl.from('.animate-heading-word-s2', {
        opacity: 0,
        x: 25,
        duration: 0.8,
        stagger: 0.04,
        ease: 'power3.out',
      });

      entranceTl.from('.animate-carousel-s2', {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.5');
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => {
      goToSlide((activeIndexRef.current + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [activeIndex, paused, goToSlide]);

  const handleNext = useCallback(() => {
    goToSlide((activeIndexRef.current + 1) % slides.length);
  }, [goToSlide]);

  const handlePrev = useCallback(() => {
    goToSlide((activeIndexRef.current - 1 + slides.length) % slides.length);
  }, [goToSlide]);

  const currentSlide = slides[activeIndex];

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      data-nav-surface="light"
    >
      <div className={styles.stickyViewport}>

        <h2 className={styles.heading}>
          {headingWords.map((word, idx) => (
            <span
              key={idx}
              className="animate-heading-word-s2"
              style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
            >
              {word}
              {idx < headingWords.length - 1 ? '\u00A0' : ''}
            </span>
          ))}
        </h2>

        <div
          className={`${styles.carousel} animate-carousel-s2`}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >

          <div ref={rightImgRef} className={styles.sideImage}>
            {slides.map((slide, idx) => (
              <div
                key={slide.id}
                data-slide-index={idx}
                className={`${styles.slideLayer} ${idx === 0 ? styles.slideLayerActive : ''}`}
              >
                <Image
                  src={slide.rightImage}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 359px"
                  style={{ objectFit: 'cover' }}
                  priority={idx === 0}
                />
              </div>
            ))}
          </div>

          <div className={styles.centerCard}>
            <button
              className={styles.arrowButton}
              onClick={handlePrev}
              aria-label="السابق"
            >
              <Image
                className={styles.arrowDesktop}
                src="/images/economic/LeftArrow.svg"
                alt=""
                width={50}
                height={50}
              />
              <Image
                className={styles.arrowMobile}
                src="/images/economic/RightArrow.svg"
                alt=""
                width={50}
                height={50}
              />
            </button>

            <div className={styles.centerContent} ref={centerTextRef}>
              <span className={styles.centerText}>
                {currentSlide.text}
              </span>

              <div className={styles.dots}>
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    className={`${styles.dot} ${idx === activeIndex ? styles.dotActive : ''}`}
                    onClick={() => goToSlide(idx)}
                    aria-label={`الانتقال إلى الشريحة ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            <button
              className={styles.arrowButton}
              onClick={handleNext}
              aria-label="التالي"
            >
              <Image
                className={styles.arrowDesktop}
                src="/images/economic/RightArrow.svg"
                alt=""
                width={50}
                height={50}
              />
              <Image
                className={styles.arrowMobile}
                src="/images/economic/LeftArrow.svg"
                alt=""
                width={50}
                height={50}
              />
            </button>
          </div>

          <div ref={leftImgRef} className={styles.sideImageLeft}>
            {slides.map((slide, idx) => (
              <div
                key={slide.id}
                data-slide-index={idx}
                className={`${styles.slideLayer} ${idx === 0 ? styles.slideLayerActive : ''}`}
              >
                <Image
                  src={slide.leftImage}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 359px"
                  style={{ objectFit: 'cover' }}
                  priority={idx === 0}
                />
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
