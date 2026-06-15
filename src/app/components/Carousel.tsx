import React, { useRef, useState, useEffect, ReactNode } from 'react';

interface SimpleCarouselProps {
  children: ReactNode[];
  onSlideChange?: (index: number) => void;
  className?: string;
}

export interface SimpleCarouselRef {
  slickNext: () => void;
  slickPrev: () => void;
  slickGoTo: (index: number) => void;
}

export const SimpleCarousel = React.forwardRef<SimpleCarouselRef, SimpleCarouselProps>(
  ({ children, onSlideChange, className = '' }, ref) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    const scrollToSlide = (index: number) => {
      if (scrollRef.current) {
        const slideWidth = scrollRef.current.offsetWidth;
        scrollRef.current.scrollTo({
          left: slideWidth * index,
          behavior: 'smooth',
        });
      }
    };

    const goNext = () => {
      const nextSlide = Math.min(currentSlide + 1, children.length - 1);
      scrollToSlide(nextSlide);
    };

    const goPrev = () => {
      const prevSlide = Math.max(currentSlide - 1, 0);
      scrollToSlide(prevSlide);
    };

    const goToSlide = (index: number) => {
      scrollToSlide(index);
    };

    // Expose methods via ref
    React.useImperativeHandle(ref, () => ({
      slickNext: goNext,
      slickPrev: goPrev,
      slickGoTo: goToSlide,
    }));

    // Handle scroll events to update current slide
    useEffect(() => {
      const element = scrollRef.current;
      if (!element) return;

      const handleScroll = () => {
        const slideWidth = element.offsetWidth;
        const newSlide = Math.round(element.scrollLeft / slideWidth);
        if (newSlide !== currentSlide) {
          setCurrentSlide(newSlide);
          onSlideChange?.(newSlide);
        }
      };

      element.addEventListener('scroll', handleScroll);
      return () => element.removeEventListener('scroll', handleScroll);
    }, [currentSlide, onSlideChange]);

    return (
      <div className={`relative overflow-hidden ${className}`}>
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {children.map((child, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full snap-start"
              style={{ scrollSnapAlign: 'start' }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

SimpleCarousel.displayName = 'SimpleCarousel';
