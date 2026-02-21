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

  const addVariant = () => {
    setFormData((p: any) => ({
      ...p,
      variants: [
        ...(p.variants || []),
        { sku: '', price: '', stock: '' }
      ],
    }));
  };

  const updateVariant = (index: number, key: string, value: any) => {
    setFormData((p: any) => ({
      ...p,
      variants: p.variants.map((v: any, i: number) =>
        i === index ? { ...v, [key]: value } : v
      ),
    }));
  };

  const removeVariant = (index: number) => {
    setFormData((p: any) => ({
      ...p,
      variants: p.variants.filter((_: any, i: number) => i !== index),
    }));
  };

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

      {/* 🔥 VARIANTS SECTION */}
      <div className="space-y-3">
        <label className="block text-sm font-medium">
          Variants
        </label>

        {formData.variants?.map((variant: any, index: number) => (
          <div key={index} className="grid grid-cols-3 gap-2 items-end">
            <Input
              label="SKU"
              value={variant.sku}
              onChange={(e) =>
                updateVariant(index, 'sku', e.target.value)
              }
              required
            />

            <Input
              label="Price"
              type="number"
              value={variant.price}
              onChange={(e) =>
                updateVariant(index, 'price', e.target.value)
              }
              required
            />

            <div className="flex gap-2 items-end">
              <Input
                label="Stock"
                type="number"
                value={variant.stock}
                onChange={(e) =>
                  updateVariant(index, 'stock', e.target.value)
                }
                required
              />
              <button
                type="button"
                onClick={() => removeVariant(index)}
                className="text-red-600 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addVariant}
          className="text-sm text-blue-600"
        >
          + Add Variant
        </button>
      </div>

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