import React, { useState, useMemo, useEffect } from "react";
import {
  X,
  Check,
  Plus,
  Trash2,
  Package,
  User,
  CreditCard,
  DollarSign,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { z } from "zod";
import { useUsers } from "../../hooks/useUsers";
import { useProducts } from "../../hooks/useProduct";

/* ─── Schemas ───────────────────────────────────── */
const orderItemSchema = z.object({
  product_id: z.number().min(1, "Select a product"),
  product_variant_id: z.number().nullish(),
  quantity: z.number().min(1, "Qty must be at least 1"),
});

export const orderSchema = z.object({
  user_id: z.number().min(1, "Select a customer"),
  status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]),
  payment_status: z.enum(["unpaid", "paid", "refunded"]),
  shipping_fee: z.number().min(0, "Invalid shipping fee"),
  tax: z.number().min(0),
  items: z.array(orderItemSchema).min(1, "Add at least one item"),
});

type OrderErrors = z.inferFlattenedErrors<typeof orderSchema>["fieldErrors"];

/* ─── Types ─────────────────────────────────────── */
interface OrderItem {
  product_id: number;
  product_variant_id?: number | null;
  quantity: number;
  _id: number;
}

interface DraftState {
  user_id: number;
  status: string;
  payment_status: string;
  shipping_fee: number;
  tax: number;
  items: OrderItem[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: any) => void;
  isLoading?: boolean;
}

/* ─── Sub-components ────────────────────────────── */
function FieldError({ error }: { error?: string[] | string }) {
  if (!error || (Array.isArray(error) && error.length === 0)) return null;
  const msg = Array.isArray(error) ? error[0] : error;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-rose-500">
      <AlertCircle className="h-3 w-3 shrink-0" />
      {msg}
    </p>
  );
}

function SectionLabel({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      {icon && <span className="text-slate-400">{icon}</span>}
      <h3 className="whitespace-nowrap text-[11px] font-bold uppercase tracking-widest text-slate-500">
        {children}
      </h3>
      <span className="h-px flex-1 bg-slate-100" />
    </div>
  );
}

const inputCls = (err?: boolean) =>
  `w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-all focus:ring-2
  ${err
    ? "border-rose-300 bg-rose-50/40 text-rose-700 focus:border-rose-400 focus:ring-rose-100"
    : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 focus:border-slate-400 focus:ring-slate-100"
  }`;

const selectCls = (err?: boolean) =>
  `w-full appearance-none rounded-lg border px-3 py-2.5 text-sm outline-none transition-all cursor-pointer focus:ring-2
  ${err
    ? "border-rose-300 bg-rose-50/40 text-rose-700 focus:border-rose-400 focus:ring-rose-100"
    : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 focus:border-slate-400 focus:ring-slate-100"
  }`;

/* ─── Component ─────────────────────────────────── */
export default function AddOrderModal({ isOpen, onClose, onSave, isLoading }: Props) {
  const { data: usersData } = useUsers(1, 100);
  const { data: productsData } = useProducts(1, 100);

  const users: any[] = usersData?.data ?? [];
  const products: any[] = productsData?.data ?? [];

  const [draft, setDraft] = useState<DraftState>({
    user_id: 0,
    status: "delivered",
    payment_status: "unpaid",
    shipping_fee: 50,
    tax: 0,
    items: [],
  });

  const [errors, setErrors] = useState<OrderErrors>({});
  const [itemCounter, setItemCounter] = useState(0);

  /* ── Reset on open ── */
  useEffect(() => {
    if (isOpen) {
      setDraft({
        user_id: 0,
        status: "delivered",
        payment_status: "paid",
        shipping_fee: 50,
        tax: 0,
        items: [],
      });
      setErrors({});
      setItemCounter(0);
    }
  }, [isOpen]);

  const hasErrors = Object.keys(errors).length > 0;

  /* ── Draft updater ── */
  const handleSet = (key: keyof DraftState, val: any) => {
    setDraft((p) => ({ ...p, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  /* ── Items ── */
  const addItem = () => {
    setDraft((p) => ({
      ...p,
      items: [
        ...p.items,
        { product_id: 0, product_variant_id: null, quantity: 1, _id: itemCounter },
      ],
    }));
    setItemCounter((c) => c + 1);
  };

  const removeItem = (idx: number) => {
    setDraft((p) => {
      const next = [...p.items];
      next.splice(idx, 1);
      return { ...p, items: next };
    });
  };

  const updateItem = (idx: number, key: string, val: any) => {
    setDraft((p) => {
      const next = [...p.items];
      (next[idx] as any)[key] = val;
      if (key === "product_id") next[idx].product_variant_id = null;
      return { ...p, items: next };
    });
  };

  /* ── Totals ── */
  const subtotal = useMemo(() => {
    return draft.items.reduce((sum, item) => {
      const prod = products.find((p) => p.id === item.product_id);
      if (!prod) return sum;
      let price = Number(prod.base_price ?? 0);
      if (item.product_variant_id) {
        const variant = prod.variants?.find((v: any) => v.id === item.product_variant_id);
        if (variant?.price) price = Number(variant.price);
      }
      return sum + price * item.quantity;
    }, 0);
  }, [draft.items, products]);

  const taxAmount = subtotal * 0.18;
  const total = subtotal + taxAmount + draft.shipping_fee;

  /* ── Save ── */
  const handleSave = () => {
    const result = orderSchema.safeParse({ ...draft, tax: Math.round(taxAmount) });
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }
    onSave({
      order: {
        user_id: draft.user_id,
        status: draft.status,
        payment_status: draft.payment_status,
        tax: Math.round(taxAmount),
        shipping_fee: draft.shipping_fee,
      },
      items: draft.items.map((i) => ({
        product_id: i.product_id,
        product_variant_id: i.product_variant_id || 0,
        quantity: i.quantity,
      })),
    });
  };

  if (!isOpen) return null;

  /* ─── Render ─────────────────────────────────── */
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
      style={{ backgroundColor: "rgba(15,15,25,0.55)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200"
        style={{ height: "min(88vh, 820px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ══ HEADER ══ */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900">
              <Package className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Admin &rsaquo; Orders
              </p>
              <h2 className="text-base font-semibold text-slate-900">Create new order</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasErrors && (
              <span className="flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-600">
                <AlertCircle className="h-3 w-3" /> Fix errors
              </span>
            )}
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <X className="h-3.5 w-3.5" /> Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Check className="h-3.5 w-3.5" />
              {isLoading ? "Saving…" : "Create order"}
            </button>
          </div>
        </div>

        {/* ══ BODY ══ */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-8">

            {/* ── Customer ── */}
            <section>
              <SectionLabel icon={<User className="h-3.5 w-3.5" />}>Customer</SectionLabel>
              <div className="relative">
                <select
                  value={draft.user_id}
                  onChange={(e) => handleSet("user_id", Number(e.target.value))}
                  className={selectCls(!!errors.user_id)}
                >
                  <option value={0}>Select a customer…</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email_address})
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
              <FieldError error={errors.user_id} />
            </section>

            {/* ── Products ── */}
            <section>
              <SectionLabel icon={<Package className="h-3.5 w-3.5" />}>
                Products
              </SectionLabel>

              <div className="space-y-2">
                {draft.items.length === 0 && (
                  <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 py-8 text-center">
                    <Package className="mb-2 h-7 w-7 text-slate-200" />
                    <p className="text-sm font-medium text-slate-400">No items yet</p>
                    <p className="mt-0.5 text-xs text-slate-300">Click "Add item" below</p>
                  </div>
                )}

                {draft.items.map((item, idx) => {
                  const selectedProduct = products.find((p) => p.id === item.product_id);
                  const variants: any[] = selectedProduct?.variants ?? [];
                  const itemErr = (errors.items as any)?.[idx];

                  return (
                    <div
                      key={item._id}
                      className="flex flex-wrap items-start gap-2 rounded-xl border border-slate-200 bg-white p-3"
                    >
                      {/* Product select */}
                      <div className="relative min-w-0 flex-1" style={{ minWidth: 160 }}>
                        <select
                          value={item.product_id}
                          onChange={(e) => updateItem(idx, "product_id", Number(e.target.value))}
                          className={selectCls(!!itemErr?.product_id)}
                        >
                          <option value={0}>Select product…</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                        <FieldError error={itemErr?.product_id} />
                      </div>

                      {/* Variant select */}
                      {variants.length > 0 && (
                        <div className="relative w-44 shrink-0">
                          <select
                            value={item.product_variant_id ?? 0}
                            onChange={(e) =>
                              updateItem(idx, "product_variant_id", Number(e.target.value) || null)
                            }
                            className={selectCls()}
                          >
                            <option value={0}>Variant (optional)</option>
                            {variants.map((v) => (
                              <option key={v.id} value={v.id}>
                                {v.sku}
                                {v.attribute_values
                                  ? ` — ${Object.values(v.attribute_values).join(", ")}`
                                  : ""}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                        </div>
                      )}

                      {/* Quantity */}
                      <div className="w-20 shrink-0">
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => updateItem(idx, "quantity", Number(e.target.value))}
                          className={inputCls(!!itemErr?.quantity)}
                          placeholder="Qty"
                        />
                        <FieldError error={itemErr?.quantity} />
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(idx)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}

                <button
                  onClick={addItem}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-3 text-sm font-medium text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
                >
                  <Plus className="h-4 w-4" /> Add item
                </button>
                <FieldError error={errors.items as any} />
              </div>
            </section>

            {/* ── Status + Summary ── */}
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">

              {/* Status block */}
              <div>
                <SectionLabel icon={<CreditCard className="h-3.5 w-3.5" />}>
                  Order status
                </SectionLabel>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Payment status
                    </label>
                    <div className="relative">
                      <select
                        value={draft.payment_status}
                        onChange={(e) => handleSet("payment_status", e.target.value)}
                        className={selectCls(!!errors.payment_status)}
                      >
                        <option value="unpaid">Unpaid</option>
                        <option value="paid">Paid</option>
                        <option value="refunded">Refunded</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                    </div>
                    <FieldError error={errors.payment_status} />
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Fulfillment status
                    </label>
                    <div className="relative">
                      <select
                        value={draft.status}
                        onChange={(e) => handleSet("status", e.target.value)}
                        className={selectCls(!!errors.status)}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                    </div>
                    <FieldError error={errors.status} />
                  </div>
                </div>
              </div>

              {/* Summary block */}
              <div>
                <SectionLabel icon={<DollarSign className="h-3.5 w-3.5" />}>
                  Summary
                </SectionLabel>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="space-y-2.5 text-sm">
                    {/* Subtotal */}
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span className="font-semibold text-slate-900">
                        ₹{subtotal.toFixed(2)}
                      </span>
                    </div>

                    {/* Shipping */}
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Shipping fee</span>
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400">₹</span>
                        <input
                          type="number"
                          min={0}
                          value={draft.shipping_fee}
                          onChange={(e) => handleSet("shipping_fee", Number(e.target.value))}
                          className="w-20 rounded-lg border border-slate-200 px-2 py-1 text-right text-sm font-semibold text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                        />
                      </div>
                    </div>
                    <FieldError error={errors.shipping_fee} />

                    {/* Tax */}
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Tax (18%)</span>
                      <span className="font-semibold text-slate-900">
                        ₹{taxAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-sm font-bold text-slate-900">Total</span>
                    <span className="text-xl font-bold text-slate-900">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}