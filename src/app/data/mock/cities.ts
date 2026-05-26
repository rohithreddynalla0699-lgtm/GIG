export interface CitySeed {
  city: string;
  areas: { name: string; pincodes: string[] }[];
}

export const citySeeds: CitySeed[] = [
  {
    city: 'Hyderabad',
    areas: [
      { name: 'Hitech City', pincodes: ['500081'] },
      { name: 'Madhapur', pincodes: ['500081', '500033'] },
      { name: 'Jubilee Hills', pincodes: ['500033'] },
    ],
  },
  {
    city: 'Bengaluru',
    areas: [
      { name: 'Indiranagar', pincodes: ['560038'] },
      { name: 'Koramangala', pincodes: ['560034'] },
    ],
  },
  {
    city: 'Pune',
    areas: [{ name: 'Hinjewadi', pincodes: ['411057'] }],
  },
  {
    city: 'Mumbai',
    areas: [{ name: 'Bandra', pincodes: ['400050'] }],
  },
];
