import OrderDetailsWrapper from '@/components/OrderDetails/OrderDetailsWrapper';

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-6 max-w-8xl-mid mx-auto">
      <OrderDetailsWrapper id={params.id} />
    </div>
  );
}
