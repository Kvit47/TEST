import ProductUpdateForm from "@/src/views/product/ui/product-update-form";

export default async function UpdateProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductUpdateForm initialData={id} />;
}
