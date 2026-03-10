import { useState } from "react";
import Button from "../ui/Button";
import { ImagePlus, X, ChevronDown, Package } from "lucide-react";

interface Category {
    id: number;
    name: string;
}

interface ProductVariant {
    id?: number;
    sku: string;
    price: number;
    stock: number;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    description?: string;
    category_id: number;
    status: string;
    variants?: ProductVariant[];
    images?: string[];
}

interface Props {
    initialData?: Product;
    categories: Category[];
    onSubmit: (payload: any) => void;
    submitText: string;
    isLoading?: boolean;
}

type FormData = {
    name: string;
    slug: string;
    category_id: string;
    description: string;
    price: string;
    stock: string;
    status: "active" | "inactive" | "archived";
};

type FormErrors = {
    [K in keyof FormData]?: string;
};

export default function ProductForm({
    initialData,
    categories,
    onSubmit,
    submitText,
    isLoading = false,
}: Props) {
    const [form, setForm] = useState<FormData>({
        name: initialData?.name || "",
        slug: initialData?.slug || "",
        category_id: String(initialData?.category_id || ""),
        description: initialData?.description || "",
        price: String(initialData?.variants?.[0]?.price || ""),
        stock: String(initialData?.variants?.[0]?.stock || ""),
        status: (initialData?.status as any) || "active",
    });

    const [newImages, setNewImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>(
        initialData?.images || []
    );
    const [errors, setErrors] = useState<FormErrors>({});
    const [dragOver, setDragOver] = useState(false);

    /* ----------------------------------------
       Auto-slug from name
    ---------------------------------------- */
    const handleNameChange = (value: string) => {
        handleChange("name", value);
        if (!initialData) {
            handleChange(
                "slug",
                value
                    .toLowerCase()
                    .trim()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-]/g, "")
            );
        }
    };

    /* ----------------------------------------
       Validation
    ---------------------------------------- */
    const validate = () => {
        const nextErrors: FormErrors = {};

        if (!form.name.trim()) nextErrors.name = "Name is required";
        if (!form.slug.trim()) nextErrors.slug = "Slug is required";
        if (!form.category_id) nextErrors.category_id = "Category is required";
        if (!form.price || Number(form.price) <= 0)
            nextErrors.price = "Valid price required";
        if (!form.stock || Number(form.stock) < 0)
            nextErrors.stock = "Valid stock required";

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    /* ----------------------------------------
       Handlers
    ---------------------------------------- */
    const handleChange = <K extends keyof FormData>(
        key: K,
        value: FormData[K]
    ) => setForm((prev) => ({ ...prev, [key]: value }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const payload: any = {
            name: form.name,
            slug: form.slug,
            category_id: Number(form.category_id),
            description: form.description,
            status: form.status,
            images: newImages,
        };

        // Handle variants
        if (initialData?.variants && initialData.variants.length > 0) {
            // Update existing variant
            payload.variants_attributes = initialData.variants.map((v) => ({
                id: v.id,
                sku: v.sku,
                price: Number(form.price),
                stock: Number(form.stock),
            }));
        } else {
            // Create new variant
            payload.variants_attributes = [
                {
                    sku: `${form.name.slice(0, 3).toUpperCase()}-${Date.now()}`,
                    price: Number(form.price),
                    stock: Number(form.stock),
                },
            ];
        }

        onSubmit(payload);
    };

    /* ----------------------------------------
       Image handling
    ---------------------------------------- */
    const processFiles = (files: FileList | null) => {
        if (!files) return;
        const fileArray = Array.from(files).filter((f) =>
            f.type.startsWith("image/")
        );
        setNewImages((prev) => [...prev, ...fileArray]);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        processFiles(e.target.files);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        processFiles(e.dataTransfer.files);
    };

    const removeNewImage = (index: number) => {
        setNewImages((prev) => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index: number) => {
        setExistingImages((prev) => prev.filter((_, i) => i !== index));
    };

    /* ----------------------------------------
       Render
    ---------------------------------------- */
    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <Field label="Product Name" required error={errors.name}>
                <input
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Smartphone XYZ"
                    className={inputClass(!!errors.name)}
                />
            </Field>

            {/* Slug */}
            <Field
                label="Slug"
                required
                error={errors.slug}
                hint="URL-friendly identifier"
            >
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                        /
                    </span>
                    <input
                        value={form.slug}
                        onChange={(e) => handleChange("slug", e.target.value)}
                        placeholder="smartphone-xyz"
                        className={`${inputClass(!!errors.slug)} pl-6 font-mono`}
                    />
                </div>
            </Field>

            {/* Category */}
            <Field label="Category" required error={errors.category_id}>
                <div className="relative">
                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                        value={form.category_id}
                        onChange={(e) => handleChange("category_id", e.target.value)}
                        className={`${inputClass(
                            !!errors.category_id
                        )} appearance-none pr-8 pl-10 cursor-pointer`}
                    >
                        <option value="">Select category</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </Field>

            {/* Description */}
            <Field label="Description">
                <textarea
                    value={form.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Product description..."
                    rows={3}
                    className={`${inputClass(false)} resize-none`}
                />
            </Field>

            {/* Price & Stock */}
            <div className="grid grid-cols-2 gap-4">
                <Field label="Price" required error={errors.price}>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                            ₹
                        </span>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={form.price}
                            onChange={(e) => handleChange("price", e.target.value)}
                            className={`${inputClass(!!errors.price)} pl-8`}
                        />
                    </div>
                </Field>

                <Field label="Stock" required error={errors.stock}>
                    <input
                        type="number"
                        min="0"
                        value={form.stock}
                        onChange={(e) => handleChange("stock", e.target.value)}
                        className={inputClass(!!errors.stock)}
                    />
                </Field>
            </div>

            {/* Status */}
            <Field label="Status" required>
                <div className="relative">
                    <select
                        value={form.status}
                        onChange={(e) =>
                            handleChange("status", e.target.value as FormData["status"])
                        }
                        className={`${inputClass(false)} appearance-none pr-8 cursor-pointer`}
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="archived">Archived</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </Field>

            {/* Images */}
            <Field label="Product Images" hint="Upload multiple images">
                <div className="space-y-3">
                    {/* Existing images */}
                    {existingImages.length > 0 && (
                        <div className="grid grid-cols-4 gap-3">
                            {existingImages.map((url, idx) => (
                                <div key={idx} className="relative group">
                                    <img
                                        src={url}
                                        alt={`Product ${idx + 1}`}
                                        className="w-full h-24 object-cover rounded-xl border border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(idx)}
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:border-red-200"
                                    >
                                        <X className="w-3 h-3 text-gray-500 hover:text-red-500" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* New images preview */}
                    {newImages.length > 0 && (
                        <div className="grid grid-cols-4 gap-3">
                            {newImages.map((file, idx) => (
                                <div key={idx} className="relative group">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`New ${idx + 1}`}
                                        className="w-full h-24 object-cover rounded-xl border border-indigo-200 ring-2 ring-indigo-100"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeNewImage(idx)}
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:border-red-200"
                                    >
                                        <X className="w-3 h-3 text-gray-500 hover:text-red-500" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Upload zone */}
                    <label
                        onDragOver={(e) => {
                            e.preventDefault();
                            setDragOver(true);
                        }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        className={`flex flex-col items-center justify-center gap-2 h-28 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${dragOver
                            ? "border-indigo-400 bg-indigo-50"
                            : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100"
                            }`}
                    >
                        <ImagePlus className="w-5 h-5 text-gray-400" />
                        <span className="text-xs text-gray-400">
                            Drop images or{" "}
                            <span className="text-indigo-500 font-medium">browse</span>
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </label>
                </div>
            </Field>

            {/* Submit */}
            <div className="pt-1">
                <Button type="submit" fullWidth isLoading={isLoading}>
                    {submitText}
                </Button>
            </div>
        </form>
    );
}

/* ----------------------------------------
   Field wrapper
---------------------------------------- */
function Field({
    label,
    children,
    required,
    error,
    hint,
}: {
    label: string;
    children: React.ReactNode;
    required?: boolean;
    error?: string;
    hint?: string;
}) {
    return (
        <div className="space-y-1.5">
            <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                {label}
                {required && <span className="text-indigo-500">*</span>}
            </label>
            {children}
            {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        </div>
    );
}

/* ----------------------------------------
   Shared input class
---------------------------------------- */
function inputClass(hasError: boolean) {
    return [
        "w-full h-10 px-3 rounded-xl text-sm text-gray-800 bg-white",
        "border transition-colors outline-none",
        "placeholder:text-gray-300",
        hasError
            ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
            : "border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100",
    ].join(" ");
}
