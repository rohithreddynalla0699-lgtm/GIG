export function getDiscountPercentage(originalPrice: number, rescuePrice: number) {
  return Math.round(((originalPrice - rescuePrice) / originalPrice) * 100);
}
