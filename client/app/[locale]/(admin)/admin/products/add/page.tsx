import ProductAddForm from "@/src/views/product/ui/product-add-form";

export const metadata = {
  title: "Add Product | Admin",
  description: "Create a new product in the catalog",
};

export default function AddProductPage() {
  return <ProductAddForm />;
}
