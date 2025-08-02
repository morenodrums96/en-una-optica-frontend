import React from 'react';
import { Order } from '@/types/order';

// Importa los iconos de Heroicons
import {
  UserIcon,
  HomeIcon,
  ShoppingCartIcon,
  ClipboardDocumentListIcon,
  TruckIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

// --- Interfaces de Tipos ---
interface DetailCardProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

interface DetailItemProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

// --- Componentes ---

const DetailCard: React.FC<DetailCardProps> = ({ title, icon: Icon, children }) => (
  // El fondo de la tarjeta cambia a un gris oscuro y el borde es más claro
  <section className="bg-white rounded-2xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 py-6 px-8">
    <div className="flex items-center gap-4 mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
      {/* El fondo y el color del icono se ajustan para el modo oscuro */}
      <div className="p-2 bg-primary-50 rounded-full text-primary-600 dark:bg-primary-900 dark:text-primary-300">
        <Icon className="h-6 w-6" />
      </div>
      {/* El título se adapta al fondo oscuro */}
      <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-100">{title}</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-base text-gray-700 dark:text-gray-300">
      {children}
    </div>
  </section>
);

const DetailItem: React.FC<DetailItemProps> = ({ label, value, className = '' }) => (
  <div className={className}>
    {/* El color del label cambia a un blanco o gris claro en modo oscuro */}
    <strong className="block font-semibold text-gray-900 dark:text-gray-100 mb-1">{label}</strong>
    <span>{value}</span>
  </div>
);

// --- Componente principal ---

export default function OrderDetails({ order }: { order: Order }) {
  if (!order) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center text-gray-500 dark:text-gray-400">
        No se encontró la orden.
      </div>
    );
  }

  const {
    correo,
    cellphone,
    customerId,
    sessionId,
    shippingInfo,
    products,
    orderStatus,
    orderIsSent,
    paymentMethod,
    paymentIntentId,
    totalAmount,
    shippingData,
    guide,
    logs,
  } = order;

  return (
    // El fondo principal de la página cambia a un gris muy oscuro
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center">
          {/* Título principal con colores adaptados */}
          <h1 className="text-4xl sm:text-5xl font-extrabold text-primary-900 dark:text-primary-100 tracking-tight">
            Detalle de la Orden
          </h1>
          <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
            Información completa de la orden #{customerId}
          </p>
        </div>

        <DetailCard title="Información del Cliente" icon={UserIcon}>
          <DetailItem label="Correo" value={correo} />
          <DetailItem label="Celular" value={cellphone} />
          <DetailItem label="ID de Cliente" value={customerId} />
          <DetailItem label="ID de Sesión" value={sessionId} />
        </DetailCard>

        {shippingInfo && (
          <DetailCard title="Dirección de Envío" icon={HomeIcon}>
            <DetailItem
              label="Nombre"
              value={`${shippingInfo.name} ${shippingInfo.lastName}`}
            />
            <DetailItem
              label="Calle"
              value={`${shippingInfo.street} #${shippingInfo.externalNumber}`}
            />
            {shippingInfo.internalNumber && (
              <DetailItem label="Interior" value={shippingInfo.internalNumber} />
            )}
            <DetailItem label="Colonia" value={shippingInfo.neighborhood} />
            <DetailItem label="Código Postal" value={shippingInfo.postalCode} />
            <DetailItem
              label="Ciudad/Estado"
              value={`${shippingInfo.city}, ${shippingInfo.state}`}
            />
            {shippingInfo.aditionalReferents && (
              <DetailItem
                label="Referencias Adicionales"
                value={shippingInfo.aditionalReferents}
                className="md:col-span-2"
              />
            )}
          </DetailCard>
        )}

        {products && products.length > 0 && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 py-6 px-8">
            <div className="flex items-center gap-4 mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
              <div className="p-2 bg-primary-50 rounded-full text-primary-600 dark:bg-primary-900 dark:text-primary-300">
                <ShoppingCartIcon className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-100">
                Productos Comprados
              </h2>
            </div>
            {/* El divisor y el texto de productos se adaptan */}
            <div className="space-y-6 divide-y divide-gray-100 dark:divide-gray-700">
              {products.map((item, idx) => (
                <div key={idx} className="pt-4 first:pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-base text-gray-700 dark:text-gray-300">
                    <DetailItem
                      label="Producto"
                      value={`${item.productId?.name} (ID: ${item.productId?._id})`}
                    />
                    <DetailItem label="Cantidad" value={item.quantity} />
                    <DetailItem
                      label="Precio Unitario"
                      value={`$${item.customerPriceFrond?.toFixed(2)}`}
                    />
                    <DetailItem
                      label="Total Producto"
                      value={`$${item.totalByProduct?.toFixed(2)}`}
                    />
                  </div>
                  {item.configurableOptions && item.configurableOptions.length > 0 && (
                    <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 pl-2">
                      <strong className="block font-semibold text-primary-700 dark:text-primary-300 mb-2">
                        Opciones
                      </strong>
                      <ul className="space-y-2">
                        {item.configurableOptions.map((opt, i) => (
                          <li key={i}>
                            <span className="font-semibold text-primary-700 dark:text-primary-300">
                              {opt.groupName}:
                            </span>{' '}
                            <span className="text-gray-600 dark:text-gray-400">
                              {opt.options.map((o) => o.name).join(', ')}
                            </span>
                            {opt.options.some((o) => o.colors?.length) && (
                              <div className="mt-2 flex flex-wrap gap-3">
                                {opt.options.map((o, j) =>
                                  o.colors?.map((c, k) => (
                                    <span
                                      key={k}
                                      className="inline-flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400"
                                    >
                                      <span
                                        className="inline-block w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600"
                                        style={{ backgroundColor: c.hex }}
                                      ></span>
                                      {c.name}
                                    </span>
                                  ))
                                )}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <DetailCard title="Estado y Pago" icon={ClipboardDocumentListIcon}>
          <DetailItem label="Estatus" value={orderStatus} />
          <DetailItem label="Tipo de Envío" value={orderIsSent} />
          <DetailItem label="Método de Pago" value={paymentMethod} />
          <DetailItem label="ID de Pago" value={paymentIntentId} />
          <DetailItem
            label="Total de la Orden"
            value={`$${totalAmount?.toFixed(2)}`}
            // El texto del total se resalta en modo oscuro
            className="md:col-span-2 text-xl font-bold text-primary-600 dark:text-primary-300"
          />
        </DetailCard>

        {shippingData?.shipment && (
          <DetailCard title="Datos del Envío" icon={TruckIcon}>
            <DetailItem
              label="Proveedor"
              value={shippingData.selected_rate?.provider}
            />
            <DetailItem
              label="Servicio"
              value={shippingData.selected_rate?.service_level?.name}
            />
            <DetailItem
              label="Días Estimados"
              value={`${shippingData.selected_rate?.days} días`}
            />
            <DetailItem
              label="Costo de Envío"
              value={`$${shippingData.selected_rate?.total}`}
            />
            <DetailItem label="Número de Guía" value={guide} />
            <DetailItem
              label="Número de Rastreo"
              value={shippingData.shipment?.tracking_number}
            />
            <DetailItem
              label="Estado"
              value={shippingData.shipment?.status}
            />
            <DetailItem
              label="Entrega Estimada"
              value={shippingData.shipment?.estimated_delivery}
            />
            <DetailItem
              label="Etiqueta"
              value={
                <a
                  href={shippingData.shipment?.label_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  // El enlace también cambia de color
                  className="text-primary-600 hover:text-primary-800 font-semibold underline dark:text-primary-400 dark:hover:text-primary-200"
                >
                  Ver PDF
                </a>
              }
            />
          </DetailCard>
        )}

        {logs && logs.length > 0 && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 py-6 px-8">
            <div className="flex items-center gap-4 mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
              <div className="p-2 bg-primary-50 rounded-full text-primary-600 dark:bg-primary-900 dark:text-primary-300">
                <ClockIcon className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-100">
                Historial de la Orden
              </h2>
            </div>
            <ul className="space-y-4">
              {logs.map((log, i) => (
                <li
                  key={i}
                  // El fondo y el borde del log cambian
                  className="p-4 bg-gray-50 rounded-lg border border-gray-100 dark:bg-gray-700 dark:border-gray-600"
                >
                  <div className="flex justify-between items-start text-sm">
                    {/* El color del texto del log también se adapta */}
                    <span className="text-primary-700 font-medium dark:text-primary-200">
                      {log.action}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    {log.message || `Acción realizada por ${log.performedBy}`}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}