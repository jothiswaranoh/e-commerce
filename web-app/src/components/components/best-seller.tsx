import React from "react";
import CardItem from "./cartItem";

// Image data array
const imageData = [
  {
    src: "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=300&dpr=2&q=80",
    alt: "React Rendezvous",
    name: "React Rendezvous",
    description: "A meetup for React enthusiasts to discuss and share ideas.",
    price: 30.0,
    discountPrice: 25.0,
  },
  {
    src: "https://images.unsplash.com/photo-1490300472339-79e4adc6be4a?w=300&dpr=2&q=80",
    alt: "Stateful Symphony",
    name: "Stateful Symphony",
    description: "An exploration of managing state effectively in applications.",
    price: 60.0,
    discountPrice: 55.0,
  },
  {
    src: "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=300&dpr=2&q=80",
    alt: "React Rendezvous",
    name: "React Rendezvous",
    description: "A meetup for React enthusiasts to discuss and share ideas.",
    price: 30.0,
    discountPrice: 25.0,
  },
  {
    src: "https://images.unsplash.com/photo-1468817814611-b7edf94b5d60?w=300&dpr=2&q=80",
    alt: "Async Awakenings",
    name: "Async Awakenings",
    description: "Dive deep into asynchronous programming techniques.",
    price: 40.0,
    discountPrice: 35.0,
  },
  {
    src: "https://images.unsplash.com/photo-1528143358888-6d3c7f67bd5d?w=300&dpr=2&q=80",
    alt: "The Art of Reusability",
    name: "The Art of Reusability",
    description: "Master the principles of reusable components in development.",
    price: 50.0,
    discountPrice: 45.0,
  },

  {
    src: "https://images.unsplash.com/photo-1468817814611-b7edf94b5d60?w=300&dpr=2&q=80",
    alt: "Async Awakenings",
    name: "Async Awakenings",
    description: "Dive deep into asynchronous programming techniques.",
    price: 40.0,
    discountPrice: 35.0,
  },
  {
    src: "https://images.unsplash.com/photo-1528143358888-6d3c7f67bd5d?w=300&dpr=2&q=80",
    alt: "The Art of Reusability",
    name: "The Art of Reusability",
    description: "Master the principles of reusable components in development.",
    price: 50.0,
    discountPrice: 45.0,
  },
  {
    src: "https://images.unsplash.com/photo-1490300472339-79e4adc6be4a?w=300&dpr=2&q=80",
    alt: "Stateful Symphony",
    name: "Stateful Symphony",
    description: "An exploration of managing state effectively in applications.",
    price: 60.0,
    discountPrice: 55.0,
  },
  {
    src: "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=300&dpr=2&q=80",
    alt: "React Rendezvous",
    name: "React Rendezvous",
    description: "A meetup for React enthusiasts to discuss and share ideas.",
    price: 30.0,
    discountPrice: 25.0,
  },

  {
    src: "https://images.unsplash.com/photo-1490300472339-79e4adc6be4a?w=300&dpr=2&q=80",
    alt: "Stateful Symphony",
    name: "Stateful Symphony",
    description: "An exploration of managing state effectively in applications.",
    price: 60.0,
    discountPrice: 55.0,
  },
  {
    src: "https://images.unsplash.com/photo-1468817814611-b7edf94b5d60?w=300&dpr=2&q=80",
    alt: "Async Awakenings",
    name: "Async Awakenings",
    description: "Dive deep into asynchronous programming techniques.",
    price: 40.0,
    discountPrice: 35.0,
  },
  {
    src: "https://images.unsplash.com/photo-1528143358888-6d3c7f67bd5d?w=300&dpr=2&q=80",
    alt: "The Art of Reusability",
    name: "The Art of Reusability",
    description: "Master the principles of reusable components in development.",
    price: 50.0,
    discountPrice: 45.0,
  },
];



// BestSeller Component
const BestSeller = () => {
  return (
    <div className="best-seller-container p-8">
      <h1 className="text-2xl font-bold mb-6">Best Seller</h1>
      <div className="card-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {imageData.map((item, index) => (
          <CardItem key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
