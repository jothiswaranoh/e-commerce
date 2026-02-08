import Select from 'react-select';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

interface Props {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: () => void;
  submitText: string;
  isLoading?: boolean;
  categoryOptions: { value: number; label: string }[];
}

export default function ProductForm({
  formData,
  setFormData,
  onSubmit,
  submitText,
  isLoading,
  categoryOptions,
}: Props) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-4"
    >
      <Input
        label="Product Name"
        value={formData.name}
        onChange={(e) =>
          setFormData((p: any) => ({ ...p, name: e.target.value }))
        }
        required
      />

      <Input
        label="Slug"
        value={formData.slug}
        onChange={(e) =>
          setFormData((p: any) => ({ ...p, slug: e.target.value }))
        }
      />

      <Select
        options={categoryOptions}
        placeholder="Category"
        value={categoryOptions.find(
          (c) => String(c.value) === String(formData.category_id)
        )}
        onChange={(opt) =>
          setFormData((p: any) => ({
            ...p,
            category_id: String(opt?.value || ''),
          }))
        }
      />

      <Input
        label="Price"
        type="number"
        value={formData.price}
        onChange={(e) =>
          setFormData((p: any) => ({ ...p, price: e.target.value }))
        }
        required
      />

      <Input
        label="Stock"
        type="number"
        value={formData.stock}
        onChange={(e) =>
          setFormData((p: any) => ({ ...p, stock: e.target.value }))
        }
        required
      />

      <textarea
        className="w-full border rounded px-3 py-2"
        rows={3}
        placeholder="Description"
        value={formData.description}
        onChange={(e) =>
          setFormData((p: any) => ({ ...p, description: e.target.value }))
        }
      />

      {/* 🔥 MULTIPLE IMAGES */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Product Images
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) =>
            setFormData((p: any) => ({
              ...p,
              images: Array.from(e.target.files || []),
            }))
          }
        />
        {formData.images?.length > 0 && (
          <p className="text-sm text-neutral-600 mt-1">
            {formData.images.length} image(s) selected
          </p>
        )}
      </div>

      <Button type="submit" fullWidth isLoading={isLoading}>
        {submitText}
      </Button>
    </form>
  );
}