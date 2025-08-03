import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Card from './Card';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

const CARD_WIDTH = 224; // width of a single card
const CARD_MARGIN = 32; // space between cards
const CARD_TOTAL_WIDTH = CARD_WIDTH + CARD_MARGIN;

const Carousel = ({ cards, onSlideChange }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const controls = useAnimation();

  // This effect runs whenever the active card changes.
  // It tells the carousel track to animate to the correct position.
  useEffect(() => {
    onSlideChange(cards[activeIndex] || null);
    controls.start({
      x: -activeIndex * CARD_TOTAL_WIDTH,
      transition: { type: 'spring', stiffness: 300, damping: 40 },
    });
  }, [activeIndex, cards, onSlideChange, controls]);

  // This handles cases where the card list changes (e.g., due to filtering).
  // It prevents the carousel from being stuck on an index that no longer exists.
  useEffect(() => {
    if (activeIndex >= cards.length && cards.length > 0) {
      setActiveIndex(cards.length - 1);
    }
  }, [cards, activeIndex]);


  const goToPrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev < cards.length - 1 ? prev + 1 : prev));
  };

  if (!cards || cards.length === 0) {
    return (
      <div className="relative w-full h-[460px] flex items-center justify-center">
        <p className="text-gray-500">No cards match the current filters.</p>
      </div>
    );
  }

  return (
    <div className="carousel-wrapper">
      <motion.div
        className="carousel-track"
        animate={controls}
        // This allows dragging the carousel
        drag="x"
        dragConstraints={{
          left: -(cards.length - 1) * CARD_TOTAL_WIDTH,
          right: 0,
        }}
        onDragEnd={(event, info) => {
            const dragDistance = info.offset.x;
            const velocity = info.velocity.x;

            // A quick drag will trigger a slide change
            if (Math.abs(velocity) > 200) {
                if (velocity < 0) {
                    goToNext();
                } else {
                    goToPrev();
                }
            } else { // Otherwise, snap based on distance
                const newIndex = Math.round(Math.abs(dragDistance) / CARD_TOTAL_WIDTH);
                if (dragDistance < -CARD_TOTAL_WIDTH / 2) {
                    setActiveIndex(Math.min(activeIndex + newIndex, cards.length - 1));
                } else if (dragDistance > CARD_TOTAL_WIDTH / 2) {
                    setActiveIndex(Math.max(activeIndex - newIndex, 0));
                } else {
                    // If not dragged far enough, snap back
                     controls.start({ x: -activeIndex * CARD_TOTAL_WIDTH });
                }
            }
        }}
      >
        {cards.map((card) => (
          <div className="carousel-item" key={card.docId}>
            <Card card={card} />
          </div>
        ))}
      </motion.div>

      {/* Navigation Buttons */}
      <button
        onClick={goToPrev}
        disabled={activeIndex === 0}
        className="carousel-button prev"
      >
        <FaAngleLeft />
      </button>
      <button
        onClick={goToNext}
        disabled={activeIndex === cards.length - 1}
        className="carousel-button next"
      >
        <FaAngleRight />
      </button>
    </div>
  );
};

export default Carousel;