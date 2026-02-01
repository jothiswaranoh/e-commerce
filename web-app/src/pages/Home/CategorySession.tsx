import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes.constants';
import { HOME } from '../../config/ui.config';
import { useCategories } from '../../hooks/useCategory';

import { Category } from '../../api/category';





export default function CategoriesSection() {
  const { data: categoriesData, isLoading } = useCategories();
  const categories = Array.isArray(categoriesData) ? categoriesData : [];

  return (
    <section className="py-16 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-neutral-900 mb-4">
            {HOME.sections.categories.title}
          </h2>
          <p className="text-lg text-neutral-600">
            {HOME.sections.categories.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category: Category, index: number) => (
            <Link
              key={index}
              to={ROUTES.PRODUCTS}
              className="group relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(category.name)}&background=random&size=256`}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-1">{category.name}</h3>
                {/* <p className="text-sm text-white/80">{category.count}</p> */}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
