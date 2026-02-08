import { Fragment } from "react";
import { Edit, Trash2 } from "lucide-react";

type Category = {
  id: number;
  name: string;
  slug: string;
  image_url?: string | null;
  is_active: boolean;
  parent_id: number | null;
};

type Props = {
  categories: Category[];
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
};

function buildCategoryTree(categories: Category[]) {
  const map = new Map<number | null, Category[]>();

  categories.forEach((cat) => {
    const key = cat.parent_id ?? null;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(cat);
  });

  return map;
}

export default function CategoryTable({
  categories,
  onEdit,
  onDelete,
}: Props) {
  const tree = buildCategoryTree(categories);
  const rootCategories = categories.filter(
    (cat) => cat.parent_id === null
  );

  const renderRow = (cat: Category, depth = 0) => (
    <tr key={cat.id} className="hover:bg-neutral-50">
      <td className="px-6 py-4">
        {cat.image_url ? (
          <img
            src={cat.image_url}
            alt={cat.name}
            className="w-10 h-10 object-cover rounded-lg bg-neutral-100"
          />
        ) : (
          <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-400 text-xs">
            No Image
          </div>
        )}
      </td>

      <td className="px-6 py-4 font-medium">
        <span
          className="flex items-center"
          style={{ paddingLeft: depth * 16 }}
        >
          {depth > 0 && (
            <span className="mr-1 text-neutral-400">↳</span>
          )}
          {cat.name}
        </span>
      </td>

      <td className="px-6 py-4 text-neutral-600">{cat.slug}</td>

      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            cat.is_active
              ? "bg-green-100 text-green-800"
              : "bg-neutral-100 text-neutral-800"
          }`}
        >
          {cat.is_active ? "Active" : "Inactive"}
        </span>
      </td>

      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onEdit(cat)}
            className="p-1 hover:bg-neutral-100 rounded-lg"
          >
            <Edit className="w-4 h-4 text-primary-600" />
          </button>
          <button
            onClick={() => onDelete(cat)}
            className="p-1 hover:bg-neutral-100 rounded-lg"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </td>
    </tr>
  );

  const renderTree = (cat: Category, depth = 0): JSX.Element => (
    <Fragment key={cat.id}>
      {renderRow(cat, depth)}
      {(tree.get(cat.id) || []).map((child) =>
        renderTree(child, depth + 1)
      )}
    </Fragment>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-neutral-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600">
              Image
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600">
              Slug
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-600">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {rootCategories.map((cat) => renderTree(cat))}
        </tbody>
      </table>
    </div>
  );
}