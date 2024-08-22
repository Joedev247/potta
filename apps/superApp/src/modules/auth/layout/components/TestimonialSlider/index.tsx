import React, { useEffect, useState } from 'react';
interface Testimonial {
  text: string;
  author: string;
}
const testimonials: Testimonial[] = [
  {
    text: "The latest financial insights and analysis to keep you up to date and ahead of the curve.",
    author: "John Doe",
  },
  {
    text: "The latest financial insights and analysis to keep you up to date and ahead of the curve.",
    author: "Jane Smith",
  },
  {
    text: "The latest financial insights and analysis to keep you up to date and ahead of the curve.",
    author: "Alice Johnson",
  },
];

const TestimonialSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="relative w-full max-w-md mx-auto overflow-hidden">
        <div
          className="flex transition-transform mb-5 duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial, index) => (
            <div key={index} className="flex-shrink-0 w-full h-full p-4 text-center">
              <p className="text-xl font-medium text-white mb-2">{testimonial.text}</p>
            </div>
          ))}
        </div>
        {/* Navigation dots */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {testimonials.map((_, index) => (
            <span
              key={index}
              className={`h-2 bg-white rounded-full transition-all duration-300 cursor-pointer ${currentIndex === index ? 'w-6 bg-gray-600' : 'w-2'
                }`}
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>
      </div>
      <div className=" flex justify-center">
        <div>
          <p className='text-white text-center mt-10 text-2xl'>Waiapi Karaka</p>
          <p className='text-lg text-center text-gray-200'>Financial Officer</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSlider;
