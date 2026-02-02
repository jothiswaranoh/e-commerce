import { Edit, Trash2 } from 'lucide-react';
import { Category } from '../../api/category';

interface Props {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
}

export default function CategoryTable({ categories, onEdit, onDelete }: Props) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-neutral-50 border-b">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600">Image</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600">Slug</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600">Products</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-600">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {categories.map((cat) => (
                        <tr key={cat.id} className="hover:bg-neutral-50">
                            <td className="px-6 py-4">
                                {cat.image ? (
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="w-10 h-10 object-cover rounded-lg bg-neutral-100"
                                    />
                                ) : (
                                    <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-400">
                                        <div className="w-4 h-4" />
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4 font-medium">{cat.name}</td>
                            <td className="px-6 py-4 text-neutral-600">{cat.slug}</td>
                            <td className="px-6 py-4 text-neutral-600">{cat.count || 0}</td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cat.is_active
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-neutral-100 text-neutral-800'
                                    }`}>
                                    {cat.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => onEdit(cat)}
                                        className="p-1 hover:bg-neutral-100 rounded-lg transition-colors"
                                    >
                                        <Edit className="w-4 h-4 text-primary-600" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(cat)}
                                        className="p-1 hover:bg-neutral-100 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
