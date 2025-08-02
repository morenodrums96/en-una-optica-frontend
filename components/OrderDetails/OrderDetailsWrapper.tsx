'use client';

import { useEffect, useState } from 'react';
import { getOrderById } from '@/lib/orderApis/orderApis';
import OrderDetails from './OrderDetails';
import { Order } from '@/types/order';

export default function OrderDetailsWrapper({ id }: { id: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (err) {
        setError('No se pudo cargar la orden.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <p className="text-primary-500">Cargando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!order) return null;

  return <OrderDetails order={order} />;
}
