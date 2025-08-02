export interface Order {
  _id: string;
  customerId?: string;
  sessionId?: string;
  guide?: string;
  correo?: string;
  cellphone?: string;
  products: ProductItem[];
  totalAmount?: number;
  shippingInfo?: ShippingInfo;
  orderStatus: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  orderIsSent?: 'branch' | 'house' | 'usa';
  paymentMethod?: 'card' | 'oxxo' | 'paypal' | 'bank_transfer';
  paymentIntentId?: string;
  shippedDate?: string;
  estimatedDelivery?: string;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
  shippingData?: ShippingData;
  logs?: OrderLog[];
}

export interface ProductItem {
  productId: {
    _id: string;
    name: string;
    mainImage?: string;
  };
  quantity: number;
  totalByProduct?: number;
  customerPriceFrond?: number;
  configurableOptions?: ConfigurableOption[];
}

export interface ConfigurableOption {
  groupName: string;
  options: {
    name: string;
    price?: number;
    colors?: {
      name: string;
      hex: string;
    }[];
  }[];
}

export interface ShippingInfo {
  name?: string;
  lastName?: string;
  street?: string;
  externalNumber?: string;
  internalNumber?: string;
  postalCode?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  aditionalReferents?: string;
}

export interface ShippingData {
  quotation_id?: string;
  selected_rate?: {
    id: string;
    provider: string;
    service_level: {
      name: string;
      token: string;
    };
    total: string;
    days: number;
    currency: string;
  };
  shipment?: {
    id: string;
    tracking_number: string;
    status: string;
    label_url: string;
    estimated_delivery: string;
    created_at: string;
  };
}

export interface OrderLog {
  action: string;
  message: string;
  metadata?: any;
  performedBy: 'system' | 'customer' | 'admin';
  timestamp: string;
}
