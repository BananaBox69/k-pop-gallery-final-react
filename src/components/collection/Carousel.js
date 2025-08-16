import React, { useState, useEffect } from 'react';
import { motion, useAnimate } from 'framer-motion';
import Card from './Card';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

const CARD_WIDTH = 224; // width of a single card
const CARD_MARGIN = 32; // space between cards
const CARD_TOTAL_WIDTH = CARD_WIDTH + CARD_MARGIN;

const Carousel = ({ cards, basket, onSlideChange }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  // useAnimate provides a ref (`scope`) and an `animate` function
  const [scope, animate] = useAnimate();

  // This effect runs whenever the active card changes.
  // It tells the carousel track to animate to the correct position.
  useEffect(() => {
    onSlideChange(cards[activeIndex] || null);

    // Animate the element with the `scope` ref
    animate(scope.current, {
      x: -activeIndex * CARD_TOTAL_WIDTH,
    }, {
      type: 'spring',
      stiffness: 300,
      damping: 40
    });
  }, [activeIndex, cards, onSlideChange, animate, scope]);

  // This handles cases where the card list changes (e.g., due to filtering).
  useEffect(() => {
    if (activeIndex >= cards.length && cards.length > 0) {
      setActiveIndex(cards.length - 1);
    } else if (cards.length > 0 && !cards[activeIndex]) {
      // If the list is not empty but the active index is invalid, reset to 0
      setActiveIndex(0);
    }
  }, [cards, activeIndex]);


  const goToPrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev < cards.length - 1 ? prev + 1 : prev));
  };
  
  const handleDragEnd = (event, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (Math.abs(offset) > CARD_WIDTH / 2 || Math.abs(velocity) > 500) {
      if (offset < 0 || velocity < 0) {
        goToNext();
      } else {
        goToPrev();
      }
    } else {
      // Snap back to the current slide if not dragged far enough
      animate(scope.current, { x: -activeIndex * CARD_TOTAL_WIDTH }, { type: 'spring', stiffness: 500, damping: 50 });
    }
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
        ref={scope} // Attach the scope ref here
        className="carousel-track"
        drag="x"
        dragConstraints={{
          left: -(cards.length - 1) * CARD_TOTAL_WIDTH,
          right: 0,
        }}
        onDragEnd={handleDragEnd}
      >
        {cards.map((card) => (
          <div className="carousel-item" key={card.docId}>
            <Card card={card} basket={basket} />
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

export default Carousel