import AdminHeader from "@/src/views/admin/ui/admin-header";
import ProductsManager from "@/src/views/admin/ui/admin-products";

export default function AdminProductsPage() {
  return (
    <div>
      <AdminHeader title="Products" />
      <ProductsManager />
    </div>
  );
}