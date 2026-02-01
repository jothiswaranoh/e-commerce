import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes.constants';
import { HOME } from '../../config/ui.config';
import { useCategories } from '../../hooks/useCategory';

export default function CategoriesSection() {
    const { data: categories = [], isLoading } = useCategories();

    if (isLoading) {
        return (
            <section className="py-16 bg-neutral-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

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
                    {categories.slice(0, 4).map((category: any, index: number) => (
                        <Link
                            key={category.id || index}
                            to={`${ROUTES.PRODUCTS}?category=${category.slug}`}
                            className="group relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                        >
                            <img
                                src={category.image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"}
                                alt={category.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <h3 className="text-2xl font-bold mb-1">{category.name}</h3>
                                <p className="text-sm text-white/80">{category.products_count || 0} Products</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
