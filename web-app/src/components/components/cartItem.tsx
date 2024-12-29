import React from "react";
import { FaStar, FaEye, FaShoppingCart } from "react-icons/fa";

const CardItem = ({ item }) => {
  return (
    <div className="card-item shadow-md rounded-lg p-4 relative group hover:scale-105 transition-transform">
      {/* Image */}
      <div className="relative">
        <img
          src={item.src}
          alt={item.alt}
          className="rounded-lg w-full h-48 object-cover mb-4"
        />
        {/* Favorite and Eye Icons */}
        <div className="absolute top-2 right-2 flex flex-col items-center space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="bg-white rounded-full p-2 shadow hover:bg-gray-100"
            title="Add to Favorites"
          >
            <FaStar className="text-yellow-500" />
          </button>
          <button
            className="bg-white rounded-full p-2 shadow hover:bg-gray-100"
            title="Preview"
          >
            <FaEye className="text-blue-500" />
          </button>
        </div>
      </div>

      {/* Content */}
      <h3 className="font-bold text-lg mb-2">{item.name}</h3>
      <p className="text-gray-600 mb-4">{item.description}</p>

      {/* Price */}
      <div className="card-price flex items-center justify-between">
        <span className="card-price-old line-through text-gray-500">
          ${item.price.toFixed(2)}
        </span>
        <span className="card-price-new text-green-600 font-semibold">
          ${item.discountPrice.toFixed(2)}
        </span>
      </div>

      {/* Add to Cart Button */}
      <button
        className="add-to-cart-btn absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-green-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow hover:bg-green-600"
        title="Add to Cart"
      >
        <FaShoppingCart className="inline-block mr-2" /> Add to Cart
      </button>
    </div>
  );
};

export default CardItem;
