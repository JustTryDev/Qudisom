import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const carouselSlides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1571495592447-575b18b35666?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkaW8lMjBwbHVzaCUyMHRveSUyMHByb2R1Y3R8ZW58MXx8fHwxNzY1NzU4NTY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tagline: "특별한 감성을 담은 인형",
    description: "하나하나 정성스럽게 만든 핸드메이드 인형을 만나보세요"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1761028146227-ba8c94c82538?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGRvbGwlMjBzdHVkaW8lMjBwaG90b2dyYXBoeXxlbnwxfHx8fDE3NjU3NTg1Njh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tagline: "다양한 컬렉션",
    description: "취향에 맞는 캐릭터와 스타일을 선택하세요"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1764519568365-5d0ad8b685d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwc3R1ZmZlZCUyMGFuaW1hbCUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NjU3NTg1Njl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tagline: "소중한 순간을 함께",
    description: "특별한 날을 더욱 의미있게 만들어줄 완벽한 선물"
  }
];

export function SignupCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#1a2867] via-[#2a3a77] to-[#fab803] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          {/* Updated gradient for center text */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40 z-10" />
          <img
            src={carouselSlides[currentSlide].image}
            alt={carouselSlides[currentSlide].tagline}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Updated container for center alignment */}
      <div className="relative z-20 flex flex-col items-center justify-center p-12 text-white w-full">
        <div className="text-center max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-4xl mb-4 text-white">
                {carouselSlides[currentSlide].tagline}
              </h2>
              <p className="text-xl text-white/90">
                {carouselSlides[currentSlide].description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Progress Indicators - now centered */}
          <div className="flex gap-2 justify-center">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className="h-1 w-16 bg-white/30 rounded-full overflow-hidden transition-all hover:bg-white/50"
              >
                <motion.div
                  className="h-full bg-white"
                  initial={{ width: '0%' }}
                  animate={{
                    width: currentSlide === index ? '100%' : '0%'
                  }}
                  transition={{
                    duration: currentSlide === index ? 5 : 0,
                    ease: 'linear'
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}