import { ProductPageWithCart } from '@/src/views/card/ui/product-page-with-cart';

interface ProductPageRouteProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function ProductPageRoute({ params }: ProductPageRouteProps) {
  const { id } = await params;
  return <ProductPageWithCart productId={id} />;
}
