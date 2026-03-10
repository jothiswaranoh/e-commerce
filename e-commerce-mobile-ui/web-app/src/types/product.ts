export interface ProductAttribute {
    id?: number | string;
    key: string;
    value: string;
    _destroy?: boolean;
}

export interface ProductVariant {
    id?: number | string;
    name: string;
    sku: string;
    price: number;
    stock: number;
    _destroy?: boolean;
}

export interface Product {
    id: number | string;
    name: string;
    price:number;
    slug: string;
    description?: string;
    status: 'active' | 'inactive' | 'archived';
    org_id?: number | string;
    category_id: number | string;
    category?: {
        id: number | string;
        name: string;
    };
    variants: ProductVariant[];
    product_attributes: ProductAttribute[];
    images?: string[];
}

export interface ProductFormData extends Omit<Product, 'id' | 'variants' | 'product_attributes' | 'category'> {
    id?: number | string;
    variants_attributes?: ProductVariant[];
    product_attributes_attributes?: ProductAttribute[];
    remove_image?: boolean;
}
