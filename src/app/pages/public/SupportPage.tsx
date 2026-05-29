import { Link } from 'react-router';
import MarketplaceHeader from '../../components/shared/MarketplaceHeader';
import PublicPageIntro from '../../components/shared/PublicPageIntro';
import Footer from '../../components/Footer';
import { supportCategories, supportContact } from '../../data/mock/support';

export default function SupportPage() {
  return (
    <div className="min-h-screen">
      <MarketplaceHeader />

      <main className="px-[5%] py-10">
        <div className="mx-auto max-w-[1180px]">
          <PublicPageIntro
            eyebrow="Customer support"
            title="Guidance for pickups, cancellations, and bag questions"
            description="Start with the most common answers here. If you need live reservation help, pickup updates, or issue support, continue in the app."
          />

          <section className="motion-reveal mb-8 grid gap-4 md:grid-cols-3">
            {[
              ['Pickup support', 'Short windows, clear handoff guidance'],
              ['Cancellation guidance', 'What to expect if an order changes before pickup'],
              ['App-first help', 'Live order support continues in the app'],
            ].map(([title, copy]) => (
              <div key={title} className="surface-quiet rounded-[24px] p-5">
                <div className="operational-label mb-2 text-[color:var(--gig-green-deep)]">{title}</div>
                <div className="text-[15px] font-medium leading-[1.7] text-[color:var(--gig-text)]">{copy}</div>
              </div>
            ))}
          </section>

          <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              {supportCategories.map((category) => (
                <section key={category.id} className="surface-card rounded-[28px] p-6 md:p-7">
                  <div className="mb-5">
                    <div className="eyebrow mb-2">{category.title}</div>
                    <p className="body-regular">{category.description}</p>
                  </div>

                  <div className="space-y-5">
                    {category.topics.map((topic) => (
                      <div key={topic.id} className="rounded-[22px] bg-[rgba(32,38,28,0.04)] p-5">
                        <h3 className="mb-2 text-[22px] font-semibold tracking-[-0.04em] text-[color:var(--gig-text)]">
                          {topic.title}
                        </h3>
                        <p className="mb-4 text-[14px] leading-[1.75] text-[color:var(--gig-text-muted)]">
                          {topic.description}
                        </p>
                        <div className="space-y-2">
                          {topic.guidance.map((item) => (
                            <div key={item} className="text-[14px] leading-[1.7] text-[color:var(--gig-text-muted)]">
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <aside className="space-y-6">
              <section className="surface-subtle rounded-[28px] p-6 md:p-7">
                <div className="eyebrow mb-2">Contact support</div>
                <h2 className="text-[28px] font-semibold tracking-[-0.05em] text-[color:var(--gig-text)]">Need help with a live reservation?</h2>
                <p className="body-regular mt-3">
                  Use the app for the fastest support path, especially for cancellation status, pickup delays, and store messaging.
                </p>
                <div className="mt-5 space-y-3 text-[14px] leading-[1.7] text-[color:var(--gig-text-muted)]">
                  <div>Email: <a className="font-semibold text-[color:var(--gig-green-deep)]" href={`mailto:${supportContact.email}`}>{supportContact.email}</a></div>
                  <div>Phone: <a className="font-semibold text-[color:var(--gig-green-deep)]" href={`tel:${supportContact.phone.replace(/\s+/g, '')}`}>{supportContact.phone}</a></div>
                  <div>Hours: {supportContact.hours}</div>
                </div>
                <a href={`mailto:${supportContact.email}`} className="btn-primary mt-6 inline-flex justify-center">
                  Email support
                </a>
              </section>

              <section className="surface-card rounded-[28px] p-6">
                <div className="operational-label mb-3 text-[color:var(--gig-green-deep)]">Pickup-first reminder</div>
                <div className="space-y-3 text-[14px] leading-[1.7] text-[color:var(--gig-text-muted)]">
                  <p>Always check the pickup slot before you leave for the store.</p>
                  <p>Use dietary and allergen notes to decide before continuing in the app.</p>
                  <p>If an order changes at the last minute, the app will show the latest support path.</p>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
