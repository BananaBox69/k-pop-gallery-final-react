import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import Card from './Card';

const Carousel = ({ cards, activeIndex, setActiveIndex }) => {

    if (!cards || cards.length === 0) {
        return (
            <div className="relative w-full h-[460px] flex items-center justify-center">
                <p className="text-gray-500">No cards match the current filters.</p>
            </div>
        );
    }
    
    return (
        <div className="relative w-full h-[460px] pt-12"> {/* Increased top padding */}
            <Swiper
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={'auto'}
                coverflowEffect={{
                  rotate: 50,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: false,
                }}
                pagination={{ clickable: true }}
                modules={[EffectCoverflow, Pagination]}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                initialSlide={activeIndex}
                key={cards.map(c => c.docId).join('-')}
                className="w-full h-full"
            >
                {cards.map((card) => (
                    <SwiperSlide key={card.docId} style={{ width: '224px', height: '320px' }}>
                        <Card card={card} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Carousel;