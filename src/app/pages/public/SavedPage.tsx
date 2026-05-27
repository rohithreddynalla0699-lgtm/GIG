import BagCard from '../../components/customer/BagCard';
import StoreCard from '../../components/customer/StoreCard';
import EmptyState from '../../components/shared/EmptyState';
import MarketplaceHeader from '../../components/shared/MarketplaceHeader';
import PublicPageIntro from '../../components/shared/PublicPageIntro';
import Footer from '../../components/Footer';
import { bags } from '../../data/mock/bags';
import { currentCustomer } from '../../data/mock/customers';
import {
  getCustomerStoreImageOverrideForStoreId,
  getCustomerStoresWithPartnerImageOverrides,
} from '../../data/mock/stores';

export default function SavedPage() {
  const customerStores = getCustomerStoresWithPartnerImageOverrides();
  const savedStores = customerStores.filter((store) => currentCustomer.savedStoreIds.includes(store.id));
  const savedBags = bags.filter((bag) => currentCustomer.savedBagIds.includes(bag.id));

  return (
    <div className="min-h-screen">
      <MarketplaceHeader />

      <main className="px-[5%] py-10">
        <div className="mx-auto max-w-[1240px]">
          <PublicPageIntro
            eyebrow="Saved picks"
            title="Keep the best nearby options within easy reach."
            description="Save a bag or store on web, then return in the app when you are ready to reserve and pay."
          />

          {savedBags.length === 0 && savedStores.length === 0 ? (
            <EmptyState
              title="No saved stores or bags yet"
              description="Use the marketplace pages to shortlist a few reliable pickup options for later."
              actionLabel="Explore find food"
              actionTo="/find-food"
            />
          ) : (
            <div className="space-y-10">
              <section className="motion-reveal">
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <div className="eyebrow mb-2">Saved bags</div>
                    <h2 className="section-title text-[clamp(28px,3.4vw,40px)]">The listings worth coming back to.</h2>
                  </div>
                  <div className="meta-text">{savedBags.length} saved</div>
                </div>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {savedBags.map((bag) => {
                    const store = customerStores.find((candidate) => candidate.id === bag.storeId);
                    const imageUrlOverride = store ? getCustomerStoreImageOverrideForStoreId(store.id) : undefined;
                    return store ? <BagCard key={bag.id} bag={bag} store={store} imageUrlOverride={imageUrlOverride} /> : null;
                  })}
                </div>
              </section>

              <section className="motion-reveal">
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <div className="eyebrow mb-2">Saved stores</div>
                    <h2 className="section-title text-[clamp(28px,3.4vw,40px)]">The places you may want again.</h2>
                  </div>
                  <div className="meta-text">{savedStores.length} saved</div>
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                  {savedStores.map((store) => {
                    const bagCount = bags.filter((bag) => bag.storeId === store.id).length;
                    return <StoreCard key={store.id} store={store} bagCount={bagCount} />;
                  })}
                </div>
              </section>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
