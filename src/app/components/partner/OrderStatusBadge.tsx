import type { OrderStatus } from '../../types/order';
import { getOrderStatusClasses, getOrderStatusLabel } from '../../lib/status';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-[7px] text-[12px] font-semibold ${getOrderStatusClasses(status)}`}>
      {getOrderStatusLabel(status)}
    </span>
  );
}
