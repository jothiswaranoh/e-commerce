import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Category } from '../../api/category';

interface Props {
    initialData?: Category;
    onSubmit: (data: any) => void;
    submitText: string;
    isLoading?: boolean;
}

export default function CategoryForm({
    initialData,
    onSubmit,
    submitText,
    isLoading,
}: Props) {
    const [form, setForm] = useState({
        name: initialData?.name || '',
        slug: initialData?.slug || '',
        is_active: initialData?.is_active ?? true,
        sort_order: initialData?.sort_order ?? 0,
        image: initialData?.image || '',
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit(form);
            }}
            className="space-y-4"
        >
            <Input
                label="Image URL"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
            />

            <Input
                label="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
            />

            <Input
                label="Slug"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                required
            />

            <Input
                label="Sort Order"
                type="number"
                value={form.sort_order}
                onChange={(e) =>
                    setForm({ ...form, sort_order: Number(e.target.value) })
                }
            />

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="is_active"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                    Active Status
                </label>
            </div>



            <div className="flex gap-3 pt-4">
                <Button type="submit" fullWidth isLoading={isLoading}>
                    {submitText}
                </Button>
            </div>
        </form>
    );
}
