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
                        <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600">Slug</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-600">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {categories.map((cat) => (
                        <tr key={cat.id} className="hover:bg-neutral-50">
                            <td className="px-6 py-4 font-medium">{cat.name}</td>
                            <td className="px-6 py-4 text-neutral-600">{cat.slug}</td>
                            <td className="px-6 py-4">
                                {cat.is_active ? 'Active' : 'Inactive'}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => onEdit(cat)}>
                                        <Edit className="w-4 h-4 text-primary-600" />
                                    </button>
                                    <button onClick={() => onDelete(cat)}>
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
