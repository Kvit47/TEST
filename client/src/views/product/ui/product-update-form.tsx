"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Plus,
  Trash2,
  Loader2,
  AlertTriangle,
  Package,
  ImageIcon,
  Tag,
  Layers,
  ChevronLeft,
  DollarSign,
  Hash,
  Palette,
  Ruler,
  BarChart2,
  Upload,
} from "lucide-react";

import CloudinaryUploadWidget from "@/src/widgets/cloudinary/cloudinary-upload-widget";

import { productSchema, ProductSchema } from "@/src/entities/product/model/product.schema";
import { useProductStore } from "@/src/entities/product/model/product.store";
import { useCategoryStore } from "@/src/entities/categories/model/categories.store";
import { useSubcategoryStore } from "@/src/entities/subcategories/model/subcategories.store";
import subcategoriesAPI from "@/src/entities/subcategories/service/subcategories.api";

type Lang = "az" | "en" | "ru";

const LANG_LABELS: Record<Lang, string> = { az: "AZ", en: "EN", ru: "RU" };
const CURRENCIES = ["AZN"];

export default function ProductUpdateForm({ initialData }: { initialData: string }) {
  const router = useRouter();
  const [activeLang, setActiveLang] = useState<Lang>("en");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  const {
    updateProduct,
    isLoading,
    fetchProductById,
    selectedProduct,
    clearSelectedProduct,
  } = useProductStore();

  const { categories, fetchCategories } = useCategoryStore();

  const { subcategories, fetchSubcategories } = useSubcategoryStore();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: { az: "", en: "", ru: "" },
      description: { az: "", en: "", ru: "" },
      price: 0,
      quantity: 0,
      currency: "AZN",
      image: "",
      images: [],
      variants: [],
      preOrder: false,
      subcategoryId: "",
    },
  });

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({ control, name: "images" });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({ control, name: "variants" });

  const watchedImage = useWatch({ control, name: "image" });
  const watchedPrice = useWatch({ control, name: "price" });
  const watchedCurrency = useWatch({ control, name: "currency" });
  const watchedQuantity = useWatch({ control, name: "quantity" });
  const watchedNameEn = useWatch({ control, name: "name.en" });

  const additionalWidgetRef = useRef<{ open: () => void; close: () => void } | null>(null);

  const openAdditionalUpload = () => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      alert("Cloudinary configuration is missing. Please check your .env file.");
      return;
    }
    if (!window.cloudinary) {
      alert("Cloudinary widget is still loading. Please try again in a moment.");
      return;
    }
    if (!additionalWidgetRef.current) {
      additionalWidgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName,
          uploadPreset,
          sources: ["local", "url", "camera"],
          multiple: true,
          maxFileSize: 10000000,
          clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
          maxImageWidth: 2000,
          maxImageHeight: 2000,
          folder: "products",
          tags: ["product"],
        },
        (error, result) => {
          if (!error && result.event === "success" && result.info?.secure_url) {
            appendImage({ url: result.info.secure_url });
          }
        }
      );
    }
    additionalWidgetRef.current.open();
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Re-fetch product whenever the id changes (different product clicked)
  useEffect(() => {
    if (initialData) {
      clearSelectedProduct();
      fetchProductById(initialData);
    }
  }, [initialData, fetchProductById, clearSelectedProduct]);

  // Once product is loaded, populate the form and resolve its parent category
  useEffect(() => {
    if (!selectedProduct) return;

    reset({
      name: selectedProduct.name,
      description: selectedProduct.description,
      price: selectedProduct.price,
      quantity: selectedProduct.quantity,
      currency: selectedProduct.currency ?? "AZN",
      image: selectedProduct.image ?? "",
      images: (selectedProduct.images ?? []).map((url) => ({ url })),
      variants: selectedProduct.variants ?? [],
      preOrder: selectedProduct.preOrder ?? false,
      subcategoryId: selectedProduct.subcategoryId,
    });

    if (selectedProduct.subcategoryId) {
      subcategoriesAPI
        .getSubcategoryById(selectedProduct.subcategoryId)
        .then((sub: { categoryId?: string }) => {
          if (sub?.categoryId) {
            setSelectedCategoryId(sub.categoryId);
          }
        })
        .catch(() => {/* category dropdown will remain empty */});
    }
  }, [selectedProduct, reset]);

  useEffect(() => {
    if (selectedCategoryId) {
      fetchSubcategories(selectedCategoryId);
    }
  }, [selectedCategoryId, fetchSubcategories]);

  const onSubmit = async (data: ProductSchema) => {
    try {
      const payload = {
        ...data,
        images: data.images?.map((img) => img.url) ?? [],
      };
      await updateProduct(initialData, payload);
      toast.success("Product updated successfully!");
      router.push("/admin/products");
    } catch {
      toast.error("Failed to update product. Please try again.");
    }
  };

  const hasNameError = errors.name?.az || errors.name?.en || errors.name?.ru;
  const hasDescError =
    errors.description?.az || errors.description?.en || errors.description?.ru;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <div className="w-px h-5 bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-900 flex items-center justify-center">
                <Package className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-base font-semibold text-gray-900 leading-tight">
                  Update Product
                </h1>
                <p className="text-xs text-gray-400">
                  Fill in the details below to update a product
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              form="product-form"
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Update Product
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Form body */}
      <form
        id="product-form"
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-6xl mx-auto px-6 py-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Info Card */}
            <div className="bg-white border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-500" />
                <h2 className="text-sm font-semibold text-gray-900">
                  Product Information
                </h2>
              </div>

              <div className="p-6 space-y-5">
                {/* Language Tabs */}
                <div className="flex items-center gap-1 bg-gray-100 p-1 w-fit">
                  {(["az", "en", "ru"] as Lang[]).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setActiveLang(lang)}
                      className={`px-4 py-1.5 text-xs font-semibold transition-all ${
                        activeLang === lang
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {LANG_LABELS[lang]}
                      {lang === "az" && (errors.name?.az || errors.description?.az) && (
                        <span className="ml-1 inline-block w-1.5 h-1.5 bg-red-500 rounded-full align-middle" />
                      )}
                      {lang === "en" && (errors.name?.en || errors.description?.en) && (
                        <span className="ml-1 inline-block w-1.5 h-1.5 bg-red-500 rounded-full align-middle" />
                      )}
                      {lang === "ru" && (errors.name?.ru || errors.description?.ru) && (
                        <span className="ml-1 inline-block w-1.5 h-1.5 bg-red-500 rounded-full align-middle" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Product Name{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  {(["az", "en", "ru"] as Lang[]).map((lang) => (
                    <div key={lang} className={activeLang === lang ? "block" : "hidden"}>
                      <input
                        {...register(`name.${lang}`)}
                        placeholder={`Product name in ${LANG_LABELS[lang]}...`}
                        className={`w-full px-4 py-3 border text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                          errors.name?.[lang]
                            ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                            : "border-gray-300 focus:border-gray-900 focus:ring-gray-900/10"
                        }`}
                      />
                      {errors.name?.[lang] && (
                        <p className="flex items-center gap-1 mt-1.5 text-xs text-red-600">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {errors.name[lang]?.message}
                        </p>
                      )}
                    </div>
                  ))}
                  {hasNameError && !errors.name?.[activeLang] && (
                    <p className="text-xs text-amber-600 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Some language fields are missing
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Description <span className="text-red-500">*</span>
                  </label>
                  {(["az", "en", "ru"] as Lang[]).map((lang) => (
                    <div key={lang} className={activeLang === lang ? "block" : "hidden"}>
                      <textarea
                        {...register(`description.${lang}`)}
                        rows={4}
                        placeholder={`Product description in ${LANG_LABELS[lang]}...`}
                        className={`w-full px-4 py-3 border text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all resize-none ${
                          errors.description?.[lang]
                            ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                            : "border-gray-300 focus:border-gray-900 focus:ring-gray-900/10"
                        }`}
                      />
                      {errors.description?.[lang] && (
                        <p className="flex items-center gap-1 mt-1.5 text-xs text-red-600">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {errors.description[lang]?.message}
                        </p>
                      )}
                    </div>
                  ))}
                  {hasDescError && !errors.description?.[activeLang] && (
                    <p className="text-xs text-amber-600 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Some language fields are missing
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="bg-white border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <h2 className="text-sm font-semibold text-gray-900">
                  Pricing &amp; Inventory
                </h2>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Price */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        {...register("price", { valueAsNumber: true })}
                        placeholder="0.00"
                        className={`w-full pl-9 pr-4 py-3 border text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                          errors.price
                            ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                            : "border-gray-300 focus:border-gray-900 focus:ring-gray-900/10"
                        }`}
                      />
                    </div>
                    {errors.price && (
                      <p className="flex items-center gap-1 text-xs text-red-600">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {errors.price.message}
                      </p>
                    )}
                  </div>

                  {/* Currency */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Currency
                    </label>
                    <select
                      {...register("currency")}
                      className="w-full px-4 py-3 border border-gray-300 bg-white text-sm text-gray-900 focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-all appearance-none cursor-pointer"
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="number"
                        min="0"
                        {...register("quantity", { valueAsNumber: true })}
                        placeholder="0"
                        className={`w-full pl-9 pr-4 py-3 border text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                          errors.quantity
                            ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                            : "border-gray-300 focus:border-gray-900 focus:ring-gray-900/10"
                        }`}
                      />
                    </div>
                    {errors.quantity && (
                      <p className="flex items-center gap-1 text-xs text-red-600">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {errors.quantity.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Pre-order toggle */}
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative mt-0.5">
                      <input
                        type="checkbox"
                        {...register("preOrder")}
                        className="peer sr-only"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-checked:bg-gray-900 transition-colors" />
                      <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white transition-transform peer-checked:translate-x-4 shadow-sm" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                        Pre-order
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Show a &ldquo;pre-order&rdquo; badge on the product card
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Variants */}
            <div className="bg-white border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-gray-500" />
                  <h2 className="text-sm font-semibold text-gray-900">
                    Variants
                  </h2>
                  {variantFields.length > 0 && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 font-medium">
                      {variantFields.length}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    appendVariant({ color: "", size: "", stock: 0 })
                  }
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-900 border border-gray-300 px-3 py-1.5 hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Variant
                </button>
              </div>

              <div className="p-6">
                {variantFields.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-200 py-10 text-center">
                    <Layers className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No variants added yet</p>
                    <p className="text-xs text-gray-300 mt-1">
                      Click &ldquo;Add Variant&rdquo; to add color/size options
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 px-1">
                      {["Color", "Size", "Stock"].map((h) => (
                        <p key={h} className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                          {h === "Color" && <Palette className="w-3 h-3" />}
                          {h === "Size" && <Ruler className="w-3 h-3" />}
                          {h === "Stock" && <BarChart2 className="w-3 h-3" />}
                          {h}
                        </p>
                      ))}
                      <span />
                    </div>

                    {variantFields.map((field, idx) => (
                      <div
                        key={field.id}
                        className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-start"
                      >
                        <div>
                          <input
                            {...register(`variants.${idx}.color`)}
                            placeholder="e.g. Black"
                            className={`w-full px-3 py-2.5 border text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                              errors.variants?.[idx]?.color
                                ? "border-red-300 focus:ring-red-100"
                                : "border-gray-300 focus:border-gray-900 focus:ring-gray-900/10"
                            }`}
                          />
                          {errors.variants?.[idx]?.color && (
                            <p className="text-xs text-red-600 mt-1">
                              {errors.variants[idx]?.color?.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <input
                            {...register(`variants.${idx}.size`)}
                            placeholder="e.g. L"
                            className={`w-full px-3 py-2.5 border text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                              errors.variants?.[idx]?.size
                                ? "border-red-300 focus:ring-red-100"
                                : "border-gray-300 focus:border-gray-900 focus:ring-gray-900/10"
                            }`}
                          />
                          {errors.variants?.[idx]?.size && (
                            <p className="text-xs text-red-600 mt-1">
                              {errors.variants[idx]?.size?.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <input
                            type="number"
                            min="0"
                            {...register(`variants.${idx}.stock`, { valueAsNumber: true })}
                            placeholder="0"
                            className={`w-full px-3 py-2.5 border text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                              errors.variants?.[idx]?.stock
                                ? "border-red-300 focus:ring-red-100"
                                : "border-gray-300 focus:border-gray-900 focus:ring-gray-900/10"
                            }`}
                          />
                          {errors.variants?.[idx]?.stock && (
                            <p className="text-xs text-red-600 mt-1">
                              {errors.variants[idx]?.stock?.message}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeVariant(idx)}
                          className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all mt-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="space-y-6">
            {/* Category & Subcategory */}
            <div className="bg-white border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-500" />
                <h2 className="text-sm font-semibold text-gray-900">
                  Organization
                </h2>
              </div>

              <div className="p-6 space-y-4">
                {/* Category */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Category
                  </label>
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-sm text-gray-900 focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select category...</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name?.en || cat.name?.az || "Unnamed"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subcategory */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Subcategory <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("subcategoryId")}
                    disabled={!selectedCategoryId}
                    className={`w-full px-4 py-3 border bg-white text-sm focus:outline-none focus:ring-2 transition-all appearance-none ${
                      !selectedCategoryId
                        ? "text-gray-400 cursor-not-allowed bg-gray-50 border-gray-200"
                        : errors.subcategoryId
                        ? "border-red-300 text-gray-900 focus:border-red-400 focus:ring-red-100 cursor-pointer"
                        : "border-gray-300 text-gray-900 focus:border-gray-900 focus:ring-gray-900/10 cursor-pointer"
                    }`}
                  >
                    <option value="">
                      {selectedCategoryId
                        ? "Select subcategory..."
                        : "Select a category first"}
                    </option>
                    {subcategories.map((sub) => (
                      <option key={sub._id} value={sub._id}>
                        {sub.name?.en || sub.name?.az || "Unnamed"}
                      </option>
                    ))}
                  </select>
                  {errors.subcategoryId && (
                    <p className="flex items-center gap-1 text-xs text-red-600">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {errors.subcategoryId.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Main Image */}
            <div className="bg-white border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-gray-500" />
                <h2 className="text-sm font-semibold text-gray-900">Media</h2>
              </div>

              <div className="p-6 space-y-5">
                {/* Main image — Cloudinary upload widget (supports local file & URL) */}
                <CloudinaryUploadWidget
                  key={selectedProduct?._id || "new"}
                  label="Main Image"
                  onUpload={(url) => setValue("image", url, { shouldValidate: true })}
                  currentImage={watchedImage}
                  error={errors.image?.message}
                />

                {/* Additional images */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Additional Images
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={openAdditionalUpload}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Upload
                      </button>
                      <button
                        type="button"
                        onClick={() => appendImage({ url: "" })}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add URL
                      </button>
                    </div>
                  </div>

                  {imageFields.length === 0 ? (
                    <p className="text-xs text-gray-400 py-2 text-center border border-dashed border-gray-200">
                      No additional images
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {imageFields.map((field, idx) => (
                        <div key={field.id} className="flex items-center gap-2">
                          <input
                            {...register(`images.${idx}.url`)}
                            placeholder="https://..."
                            className={`flex-1 px-3 py-2 border text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                              errors.images?.[idx]?.url
                                ? "border-red-300 focus:ring-red-100"
                                : "border-gray-300 focus:border-gray-900 focus:ring-gray-900/10"
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="p-2 text-gray-400 hover:text-red-500 border border-transparent hover:border-red-200 hover:bg-red-50 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Summary card */}
            <div className="bg-gray-900 text-white p-5 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                Summary
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Name (EN)</span>
                  <span className="font-medium truncate max-w-[140px] text-right">
                    {watchedNameEn || (
                      <span className="text-gray-600 italic">—</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Price</span>
                  <span className="font-medium">
                    {watchedPrice > 0
                      ? `${watchedPrice} ${watchedCurrency || "AZN"}`
                      : <span className="text-gray-600 italic">—</span>}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Quantity</span>
                  <span className="font-medium">
                    {watchedQuantity ?? (
                      <span className="text-gray-600 italic">—</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Variants</span>
                  <span className="font-medium">{variantFields.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Extra Images</span>
                  <span className="font-medium">{imageFields.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
