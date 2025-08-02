'use client';

import React, { useEffect, useState } from 'react';
import { FaFileInvoice, FaSpinner } from 'react-icons/fa';
import { getAllOrders } from '@/lib/orderApis/orderApis';
import { Order } from '@/types/order';

export default function OrderListPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data);
      } catch (err) {
        setError('No se pudieron cargar las órdenes. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Función para renderizar el estado del pedido con colores
  const renderStatus = (status: string) => {
    let colorClass = '';
    let statusText = '';
    switch (status) {
      case 'paid':
        colorClass = 'bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-200';
        statusText = 'Pagado';
        break;
      case 'pending':
        colorClass = 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-200';
        statusText = 'Pendiente';
        break;
      case 'shipped':
        colorClass = 'bg-primary-200 text-primary-950 dark:bg-primary-800 dark:text-primary-100';
        statusText = 'Enviado';
        break;
      default:
        colorClass = 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
        statusText = 'Desconocido';
    }
    return (
      <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${colorClass}`}>
        {statusText}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-primary-500 dark:text-primary-300">
        <FaSpinner className="animate-spin text-4xl mb-4" />
        <p className="text-lg">Cargando órdenes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-danger-500 text-center dark:text-danger-300">
        <p className="text-xl">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500 dark:text-gray-400">
        <h2 className="text-2xl font-bold mb-2">No hay órdenes para mostrar</h2>
        <p>Aún no se ha realizado ninguna compra.</p>
      </div>
    );
  }

  return (
    <div className="max-w-8xl-mid mx-auto p-6 bg-white rounded-xl shadow-lg dark:bg-gray-800 dark:text-white dark:shadow-none">
      <div className="flex items-center justify-between mb-6 border-b pb-4 border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-primary-900 dark:text-primary-100">
          <FaFileInvoice className="text-primary-500 dark:text-primary-400" />
          Listado de Órdenes
        </h1>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          {/* Se han agregado clases dark: a cada elemento para que los estilos cambien en el modo oscuro. */}
          <thead className="bg-primary-50 dark:bg-primary-950">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider dark:text-primary-300">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider dark:text-primary-300">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider dark:text-primary-300">Dirección de Envío</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider dark:text-primary-300">Productos</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider dark:text-primary-300">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider dark:text-primary-300">Pago</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider dark:text-primary-300">Estatus</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider dark:text-primary-300">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-primary-50 transition-colors duration-200 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                  {new Date(order.createdAt ?? order.date ?? '').toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  {order.shippingInfo?.name} {order.shippingInfo?.lastName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <p>{order.shippingInfo?.street} #{order.shippingInfo?.externalNumber}</p>
                  <p className="text-xs">{order.shippingInfo?.city}, {order.shippingInfo?.state}, {order.shippingInfo?.postalCode}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  <ul className="list-inside list-disc space-y-1">
                    {order.products.map((p, idx) => (
                      <li key={idx}>
                        <div className="font-medium text-gray-800 dark:text-gray-200">{p.productId?.name} x{p.quantity}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {p.configurableOptions?.map(opt => `${opt.groupName}: ${opt.options.map(o => o.name).join(', ')}`).join(' / ')}
                        </div>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary-700 dark:text-primary-300">
                  ${order.totalAmount?.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize dark:text-gray-200">
                  {order.paymentMethod}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {renderStatus(order.orderStatus)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <a
                    href={`/admin/orders/${order._id}`}
                    className="text-primary-600 hover:underline text-sm font-medium dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    Ver detalle
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}