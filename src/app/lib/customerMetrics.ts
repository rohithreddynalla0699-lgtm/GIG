import { getBagByIdIncludingInactive } from '../data/mock/bags';
import { getMockOrders } from '../data/mock/orders';

export function getCustomerOrderMetrics(customerId: string) {
  const orders = getMockOrders();
  const customerOrders = orders.filter((order) => order.customerId === customerId);
  const upcoming = customerOrders.filter((order) => ['new_reserved', 'ready_for_pickup'].includes(order.status));
  const completed = customerOrders.filter((order) => order.status === 'collected');
  const history = customerOrders.filter((order) => !['new_reserved', 'ready_for_pickup'].includes(order.status));
  const totalSaved = completed.reduce((sum, order) => {
    const bag = getBagByIdIncludingInactive(order.bagId);
    return bag ? sum + Math.max(bag.originalPrice - order.amountPaid, 0) : sum;
  }, 0);

  return {
    customerOrders,
    upcoming,
    history,
    completed,
    completedCount: completed.length,
    totalSaved,
  };
}
