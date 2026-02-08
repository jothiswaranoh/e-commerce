import { Link } from "react-router-dom";
import { ROUTES } from "../../config/routes.constants";
import { HOME } from "../../config/ui.config";
import { useCategories } from "../../hooks/useCategory";

export default function CategorySession() {
  const { data, isLoading } = useCategories(1, 8);
  const categories = data?.data ?? [];

  if (isLoading || categories.length === 0) return null;

  return (
    <section className="py-16 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            {HOME.sections.categories.title}
          </h2>
          <p className="text-lg text-neutral-600">
            {HOME.sections.categories.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(category => (
            <Link
              key={category.id}
              to={ROUTES.PRODUCTS}
              className="group relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
            >
              {category.image_url ? (
                <img
                  src={category.image_url}
                  alt={category.name}
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
          ))}
        </div>
      </div>
    </section>
  );
}