import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../config/routes.constants";
import { HOME } from "../../config/ui.config";
import { useCategories } from "../../hooks/useCategory";

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  "mens-t-shirts": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
  "mens-jeans": "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=1200&q=80",
  "mens-formals": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80",
  "mens-accessories": "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=80",
  "mens-footwear": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
  "hoodies-sweatshirts": "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1200&q=80",
  accessories: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=80",
  "mens-fashion": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80",
};

function getCategoryImage(category: { image_url?: string | null; slug: string; name: string }) {
  return (
    category.image_url ||
    CATEGORY_FALLBACK_IMAGES[category.slug] ||
    CATEGORY_FALLBACK_IMAGES[category.name.toLowerCase()] ||
    null
  );
}

export default function CategorySession() {
  // Load enough categories so View All can expand
  const { data, isLoading } = useCategories(1, 50);
  const categories = data?.data ?? [];

  const [showAll, setShowAll] = useState(false);

  if (isLoading || categories.length === 0) return null;

  const visibleCategories = showAll
    ? categories
    : categories.slice(0, 8);

  return (
    <section className="py-16 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER (Now aligned like Featured Products) */}
        <div className="mb-12">

          {/* Left Side: Title + Subtitle */}
          <div>
            <h2 className="text-4xl font-bold mb-2">
              {HOME.sections.categories.title}
            </h2>
            <p className="text-lg text-neutral-600">
              {HOME.sections.categories.subtitle}
            </p>
          </div>

        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleCategories.map(category => {
            const imageSrc = getCategoryImage(category);

            return (
            <Link
              key={category.id}
              to={`${ROUTES.PRODUCTS}?category=${category.name}`}
              className="group relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
            >
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={category.name}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              ) : (
                <div className="w-full h-full bg-neutral-300 flex items-center justify-center">
                  No Image
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

              <div className="absolute bottom-0 p-6 text-white">
                <h3 className="text-2xl font-bold">{category.name}</h3>
              </div>
            </Link>
            );
          })}
        </div>

        {categories.length > 8 && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-2 border-2 border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all font-semibold text-sm"
            >
              {showAll ? "Show Less" : "View All"}
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
