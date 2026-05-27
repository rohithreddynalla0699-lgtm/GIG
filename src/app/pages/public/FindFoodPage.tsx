import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import BagCard from '../../components/customer/BagCard';
import EmptyState from '../../components/shared/EmptyState';
import MarketplaceHeader from '../../components/shared/MarketplaceHeader';
import Footer from '../../components/Footer';
import { bags } from '../../data/mock/bags';
import { getCustomerStoresWithPartnerImageOverrides } from '../../data/mock/stores';

type LocationReference = {
  label: string;
  city: string;
  area: string;
  pincode: string;
  latitude: number;
  longitude: number;
};

const MOCK_CURRENT_LOCATION: LocationReference = {
  label: 'Indiranagar',
  city: 'Bengaluru',
  area: 'Indiranagar',
  pincode: '560038',
  latitude: 12.9784,
  longitude: 77.6408,
};

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function getDistanceKm(
  from: Pick<LocationReference, 'latitude' | 'longitude'>,
  to: Pick<LocationReference, 'latitude' | 'longitude'>
) {
  const earthRadiusKm = 6371;
  const latitudeDelta = toRadians(to.latitude - from.latitude);
  const longitudeDelta = toRadians(to.longitude - from.longitude);
  const fromLatitude = toRadians(from.latitude);
  const toLatitude = toRadians(to.latitude);

  const haversine =
    Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
    Math.cos(fromLatitude) * Math.cos(toLatitude) * Math.sin(longitudeDelta / 2) * Math.sin(longitudeDelta / 2);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

export default function FindFoodPage() {
  const reduceMotion = useReducedMotion();
  const [query, setQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState(MOCK_CURRENT_LOCATION.pincode);
  const [city, setCity] = useState(MOCK_CURRENT_LOCATION.city);
  const [radiusKm, setRadiusKm] = useState(3);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const customerStores = useMemo(() => getCustomerStoresWithPartnerImageOverrides(), []);

  const cityOptions = ['All', ...new Set(customerStores.map((store) => store.city))];
  const categoryOptions = ['All', ...new Set(customerStores.map((store) => store.category))];
  const normalizedQuery = query.trim().toLowerCase();
  const normalizedLocationQuery = locationQuery.trim().toLowerCase();

  const locationSuggestions = useMemo(
    () =>
      Array.from(
        new Set(
          customerStores.flatMap((store) => [
            store.pincode,
            store.area,
            `${store.area}, ${store.city}`,
            `${store.name}, ${store.pincode}`,
          ])
        )
      ),
    [customerStores]
  );

  const selectedReference = useMemo(() => {
    // Later: replace this mock current location with browser geolocation or a saved pickup location.
    const fallback = MOCK_CURRENT_LOCATION;
    const candidates = customerStores.filter((store) => city === 'All' || store.city === city);

    if (normalizedLocationQuery.length === 0) {
      return fallback;
    }

    const exactPincodeMatch = candidates.find((store) => store.pincode === normalizedLocationQuery);
    if (exactPincodeMatch) {
      return {
        label: exactPincodeMatch.area,
        city: exactPincodeMatch.city,
        area: exactPincodeMatch.area,
        pincode: exactPincodeMatch.pincode,
        latitude: exactPincodeMatch.latitude,
        longitude: exactPincodeMatch.longitude,
      };
    }

    const textMatch = candidates.find((store) =>
      [store.area, store.city, `${store.area}, ${store.city}`, store.pincode].some((value) =>
        value.toLowerCase().includes(normalizedLocationQuery)
      )
    );

    if (textMatch) {
      return {
        label: textMatch.area,
        city: textMatch.city,
        area: textMatch.area,
        pincode: textMatch.pincode,
        latitude: textMatch.latitude,
        longitude: textMatch.longitude,
      };
    }

    return city === 'All' || fallback.city === city
      ? fallback
      : {
          label: candidates[0]?.area ?? fallback.area,
          city: candidates[0]?.city ?? fallback.city,
          area: candidates[0]?.area ?? fallback.area,
          pincode: candidates[0]?.pincode ?? fallback.pincode,
          latitude: candidates[0]?.latitude ?? fallback.latitude,
          longitude: candidates[0]?.longitude ?? fallback.longitude,
        };
  }, [city, customerStores, normalizedLocationQuery]);

  const visibleListings = useMemo(() => {
    // Later: move radius filtering server-side when Supabase geo queries are available.
    return bags
      .map((bag) => {
        const store = customerStores.find((candidate) => candidate.id === bag.storeId);
        if (!store || bag.quantityLeft < 1 || bag.status === 'sold_out') return null;

        const distanceKm = getDistanceKm(selectedReference, {
          latitude: store.latitude,
          longitude: store.longitude,
        });

        const matchesQuery =
          normalizedQuery.length === 0 ||
          [store.name, store.city, store.area, store.pincode, bag.title, store.category]
            .join(' ')
            .toLowerCase()
            .includes(normalizedQuery);

        const matchesCity = city === 'All' || store.city === city;
        const matchesRadius = distanceKm <= radiusKm;
        const matchesCategory = selectedCategory === 'All' || store.category === selectedCategory;

        return matchesQuery && matchesCity && matchesRadius && matchesCategory ? { bag, store, distanceKm } : null;
      })
      .filter((listing): listing is NonNullable<typeof listing> => Boolean(listing))
      .sort((first, second) => first.distanceKm - second.distanceKm);
  }, [city, customerStores, normalizedQuery, radiusKm, selectedCategory, selectedReference]);

  const totalBags = visibleListings.reduce((sum, listing) => sum + listing.bag.quantityLeft, 0);
  const liveStatus = `${totalBags} bags within ${radiusKm.toFixed(radiusKm % 1 === 0 ? 0 : 1)} km`;
  const nearbyLabel =
    selectedReference.area === selectedReference.city
      ? selectedReference.city
      : `${selectedReference.area}, ${selectedReference.city}`;
  const visibleOutlets = new Set(visibleListings.map((listing) => listing.store.id)).size;
  const handleUseCurrentLocation = () => {
    setLocationQuery(MOCK_CURRENT_LOCATION.pincode);
    setCity(MOCK_CURRENT_LOCATION.city);
    setRadiusKm(3);
  };

  const closeFilters = () => setFiltersOpen(false);

  return (
    <div className="min-h-screen">
      <MarketplaceHeader navTheme="adaptive" />

      <main className="pt-[82px] md:pt-[90px]">
        <section
          data-nav-theme="light"
          className="bg-[linear-gradient(180deg,rgba(250,247,240,0.78)_0%,rgba(250,247,240,0.46)_58%,rgba(250,247,240,0)_100%)] px-[5%] pb-6 pt-3 md:pb-8 md:pt-2"
        >
          <div className="mx-auto max-w-[1240px]">
            <div
              data-nav-theme="dark"
              className="motion-reveal overflow-hidden rounded-[30px] bg-[linear-gradient(135deg,#0b1714_0%,#113127_46%,#183e33_100%)] px-5 py-4 text-white shadow-[var(--gig-shadow-lg)] md:px-7 md:py-[18px]"
            >
              <div className="mb-3 flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/62">
                <span>{liveStatus}</span>
                <span className="h-1 w-1 rounded-full bg-[rgba(192,246,221,0.8)]" />
                <span>{selectedReference.pincode}</span>
              </div>

              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_208px] lg:items-start">
                <div>
                  <h1 className="max-w-[11ch] font-['Fraunces',serif] text-[clamp(1.82rem,3.45vw,3.05rem)] font-semibold leading-[0.99] tracking-[-0.055em] text-white">
                    Find food worth picking up today.
                  </h1>
                  <p className="mt-2 max-w-[48ch] text-[14px] leading-[1.7] text-white/74 md:text-[14.5px]">
                    Nearby rescue bags from local food businesses, ready for same-day pickup.
                  </p>
                </div>

                <div className="rounded-[22px] border border-white/10 bg-white/[0.05] px-4 py-3 lg:justify-self-end">
                  <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/54">Nearby now</div>
                  <div className="space-y-2 text-[13px] text-white/74">
                    <div className="flex items-center justify-between gap-3">
                      <span>Live bags</span>
                      <span className="font-semibold text-white">{totalBags}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span>Outlets</span>
                      <span className="font-semibold text-white">{visibleOutlets}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span>Pickup</span>
                      <span className="font-semibold text-white">Today</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setFiltersOpen(true)}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 text-[14px] font-medium text-white/84 transition-colors hover:bg-white/[0.12]"
                >
                  <span>📍</span>
                  <span>{selectedReference.area}, {selectedReference.city}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFiltersOpen(true)}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 text-[14px] font-medium text-white/84 transition-colors hover:bg-white/[0.12]"
                >
                  <span>Radius · {radiusKm.toFixed(radiusKm % 1 === 0 ? 0 : 1)} km</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFiltersOpen(true)}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 text-[14px] font-medium text-white/84 transition-colors hover:bg-white/[0.12]"
                >
                  <span>Search nearby bags</span>
                </button>
              </div>

              <div className="mt-4 hidden flex-wrap gap-2 md:flex">
                {categoryOptions.map((category) => {
                  const isActive = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`inline-flex min-h-[38px] items-center rounded-full px-3.5 text-[13px] font-medium transition-colors ${
                        isActive
                          ? 'bg-[rgba(255,253,248,0.94)] text-[color:var(--gig-text)]'
                          : 'border border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/[0.08]'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="text-[13px] text-[color:var(--gig-text-muted)]">Showing nearby bags around {nearbyLabel}</div>
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="inline-flex min-h-[40px] items-center rounded-full border border-[color:var(--gig-border)] bg-[rgba(255,253,248,0.9)] px-4 text-[13px] font-medium text-[color:var(--gig-text)] shadow-[var(--gig-shadow-xs)] transition-colors hover:border-[rgba(11,122,77,0.16)] hover:text-[color:var(--gig-green-deep)] md:hidden"
              >
                Refine search
              </button>
            </div>

            <AnimatePresence>
              {filtersOpen ? (
                <>
                  <motion.div
                    className="fixed inset-0 z-40 bg-[rgba(9,26,23,0.34)] backdrop-blur-[6px] md:hidden"
                    initial={reduceMotion ? undefined : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                    onClick={closeFilters}
                  />

                  <motion.div
                    className="marketplace-filter-shell relative z-30 mt-4 hidden rounded-[28px] p-4 md:block"
                    initial={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <div className="operational-label mb-1">Refine nearby discovery</div>
                        <div className="text-[15px] text-[color:var(--gig-text-muted)]">Pickup-first rescue bags near your selected area.</div>
                      </div>
                      <button
                        type="button"
                        onClick={closeFilters}
                        className="inline-flex min-h-[38px] items-center rounded-full border border-[color:var(--gig-border)] px-3 text-[13px] font-medium text-[color:var(--gig-text-muted)] transition-colors hover:text-[color:var(--gig-green-deep)]"
                      >
                        Close
                      </button>
                    </div>

                    <div className="grid gap-3 md:grid-cols-[1.05fr_0.95fr_200px]">
                      <label className="marketplace-control">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[color:var(--gig-text-soft)]">
                          <path d="M11 5a6 6 0 1 0 0 12a6 6 0 0 0 0-12Zm8 14l-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                        <input
                          value={query}
                          onChange={(event) => setQuery(event.target.value)}
                          placeholder="Search merchant, neighbourhood, or ZIP"
                          className="focus:outline-none"
                        />
                      </label>

                      <label className="marketplace-control">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[color:var(--gig-text-soft)]">
                          <path d="M12 21s6-4.35 6-10a6 6 0 1 0-12 0c0 5.65 6 10 6 10Z" stroke="currentColor" strokeWidth="1.8" />
                          <circle cx="12" cy="11" r="2.4" stroke="currentColor" strokeWidth="1.8" />
                        </svg>
                        <input
                          list="find-food-location-suggestions"
                          value={locationQuery}
                          onChange={(event) => setLocationQuery(event.target.value)}
                          placeholder="Current ZIP or area"
                          className="focus:outline-none"
                        />
                      </label>

                      <label className="marketplace-control">
                        <select value={city} onChange={(event) => setCity(event.target.value)} className="focus:outline-none">
                          {cityOptions.map((option) => (
                            <option key={option} value={option}>
                              {option === 'All' ? 'All cities' : option}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                      <div className="marketplace-range-panel rounded-[18px] px-4 py-3">
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[color:var(--gig-text-muted)]">
                            Radius {radiusKm.toFixed(radiusKm % 1 === 0 ? 0 : 1)} km
                          </div>
                        </div>
                        <input
                          type="range"
                          min={2}
                          max={10}
                          step={0.1}
                          value={radiusKm}
                          onChange={(event) => setRadiusKm(Number(event.target.value))}
                          className="marketplace-range"
                        />
                      </div>

                      <button type="button" onClick={handleUseCurrentLocation} className="btn-secondary justify-center whitespace-nowrap">
                        Use current location
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {categoryOptions.map((category) => {
                        const isActive = selectedCategory === category;
                        return (
                          <button
                            key={category}
                            type="button"
                            onClick={() => setSelectedCategory(category)}
                            className={`inline-flex min-h-[38px] items-center rounded-full px-3.5 text-[13px] font-medium transition-colors ${
                              isActive
                                ? 'bg-[rgba(11,122,77,0.1)] text-[color:var(--gig-green-deep)]'
                                : 'border border-[color:var(--gig-border)] bg-white/70 text-[color:var(--gig-text-muted)] hover:text-[color:var(--gig-text)]'
                            }`}
                          >
                            {category}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>

                  <motion.div
                    className="fixed inset-x-0 bottom-0 z-50 rounded-t-[30px] border-t border-[rgba(255,255,255,0.08)] bg-[rgba(255,253,248,0.98)] px-[5%] pb-6 pt-4 shadow-[0_-24px_48px_rgba(9,26,23,0.18)] md:hidden"
                    initial={reduceMotion ? undefined : { y: '100%' }}
                    animate={{ y: 0 }}
                    exit={reduceMotion ? undefined : { y: '100%' }}
                    transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="mx-auto max-w-[520px]">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                          <div className="operational-label mb-1">Refine nearby discovery</div>
                          <div className="text-[15px] text-[color:var(--gig-text-muted)]">Search, radius, and location for nearby bags.</div>
                        </div>
                        <button
                          type="button"
                          onClick={closeFilters}
                          className="inline-flex min-h-[40px] items-center rounded-full border border-[color:var(--gig-border)] px-3 text-[13px] font-medium text-[color:var(--gig-text-muted)]"
                        >
                          Close
                        </button>
                      </div>

                      <div className="space-y-3">
                        <label className="marketplace-control">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[color:var(--gig-text-soft)]">
                            <path d="M11 5a6 6 0 1 0 0 12a6 6 0 0 0 0-12Zm8 14l-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                          </svg>
                          <input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search merchant, neighbourhood, or ZIP"
                            className="focus:outline-none"
                          />
                        </label>

                        <label className="marketplace-control">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[color:var(--gig-text-soft)]">
                            <path d="M12 21s6-4.35 6-10a6 6 0 1 0-12 0c0 5.65 6 10 6 10Z" stroke="currentColor" strokeWidth="1.8" />
                            <circle cx="12" cy="11" r="2.4" stroke="currentColor" strokeWidth="1.8" />
                          </svg>
                          <input
                            list="find-food-location-suggestions"
                            value={locationQuery}
                            onChange={(event) => setLocationQuery(event.target.value)}
                            placeholder="Current ZIP or area"
                            className="focus:outline-none"
                          />
                        </label>

                        <label className="marketplace-control">
                          <select value={city} onChange={(event) => setCity(event.target.value)} className="focus:outline-none">
                            {cityOptions.map((option) => (
                              <option key={option} value={option}>
                                {option === 'All' ? 'All cities' : option}
                              </option>
                            ))}
                          </select>
                        </label>

                        <div className="marketplace-range-panel rounded-[18px] px-4 py-3">
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[color:var(--gig-text-muted)]">
                              Radius {radiusKm.toFixed(radiusKm % 1 === 0 ? 0 : 1)} km
                            </div>
                          </div>
                          <input
                            type="range"
                            min={2}
                            max={10}
                            step={0.1}
                            value={radiusKm}
                            onChange={(event) => setRadiusKm(Number(event.target.value))}
                            className="marketplace-range"
                          />
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {categoryOptions.map((category) => {
                            const isActive = selectedCategory === category;
                            return (
                              <button
                                key={category}
                                type="button"
                                onClick={() => setSelectedCategory(category)}
                                className={`inline-flex min-h-[38px] items-center rounded-full px-3.5 text-[13px] font-medium transition-colors ${
                                  isActive
                                    ? 'bg-[rgba(11,122,77,0.1)] text-[color:var(--gig-green-deep)]'
                                    : 'border border-[color:var(--gig-border)] bg-white/70 text-[color:var(--gig-text-muted)]'
                                }`}
                              >
                                {category}
                              </button>
                            );
                          })}
                        </div>

                        <div className="flex gap-3 pt-1">
                          <button type="button" onClick={handleUseCurrentLocation} className="btn-secondary flex-1 justify-center">
                            Use current location
                          </button>
                          <button type="button" onClick={closeFilters} className="btn-primary flex-1 justify-center">
                            Show results
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </>
              ) : null}
            </AnimatePresence>

            <datalist id="find-food-location-suggestions">
              {locationSuggestions.map((option) => (
                <option key={option} value={option} />
              ))}
            </datalist>
          </div>
        </section>

        <section data-nav-theme="light" className="px-[5%] pb-14 pt-0 md:pt-1">
          <div className="mx-auto max-w-[1240px]">
            {visibleListings.length === 0 ? (
              <EmptyState
                title="No rescue bags nearby right now"
                description="Try increasing your radius."
                actionLabel="Show all nearby bags"
                actionTo="/find-food"
              />
            ) : (
              <section className="motion-reveal">
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <div className="eyebrow mb-2">Nearby now</div>
                    <h2 className="section-title text-[clamp(1.9rem,3.4vw,2.75rem)]">Rescue bags around {selectedReference.area}.</h2>
                    <p className="mt-2 max-w-[46ch] text-[14px] leading-[1.7] text-[color:var(--gig-text-muted)]">
                      A tighter edit of nearby listings worth checking before the pickup window closes.
                    </p>
                  </div>
                  <div className="hidden text-[14px] text-[color:var(--gig-text-muted)] md:block">{visibleListings.length} listings</div>
                </div>

                <div className={`grid auto-rows-fr gap-5 ${visibleListings.length === 1 ? 'max-w-[560px]' : 'md:grid-cols-2 xl:grid-cols-3'}`}>
                  {visibleListings.map(({ bag, store, distanceKm }, index) => (
                    <BagCard
                      key={bag.id}
                      bag={bag}
                      store={store}
                      distanceKm={distanceKm}
                      delay={index * 0.06}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
