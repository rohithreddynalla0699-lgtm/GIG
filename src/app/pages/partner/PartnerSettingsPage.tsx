import { useState } from 'react';
import SettingsSection from '../../components/partner/SettingsSection';
import SectionCard from '../../components/shared/SectionCard';
import { partnerSettings } from '../../data/mock/settings';

export default function PartnerSettingsPage() {
  const [businessName, setBusinessName] = useState(partnerSettings.businessName);
  const [contactPerson, setContactPerson] = useState(partnerSettings.contactPerson);
  const [contactEmail, setContactEmail] = useState(partnerSettings.contactEmail);
  const [contactPhone, setContactPhone] = useState(partnerSettings.contactPhone);
  const [pickupRules, setPickupRules] = useState(partnerSettings.outlets[0]?.pickupRules ?? '');
  const [weeklySummary, setWeeklySummary] = useState(partnerSettings.notificationPreferences.weeklySummary);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSave = () => {
    setSaveMessage('Settings were saved on this screen. No backend changes were made.');
  };

  return (
    <div className="space-y-7 md:space-y-8">
      <section className="surface-card p-6 md:p-7">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-[60rem]">
            <div className="editorial-eyebrow mb-3">Settings</div>
            <h1 className="page-title max-w-[13ch]">Keep business details and pickup operations aligned across outlets.</h1>
            <p className="body-large mt-3 max-w-[64ch]">
              This route should feel like a clear account tool. Update only what teams need to keep listings, pickups, and support contact details accurate.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#1E2F24] px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-[#17241c]"
          >
            Save changes
          </button>
        </div>
      </section>

      <SectionCard
        title="Account settings"
        description="Review business records, pickup rules, and support details before new listings go live."
      >
        {saveMessage && (
          <div className="mb-5 rounded-[18px] bg-[#EEF6EC] px-4 py-3 text-[14px] text-[#33503C]">
            {saveMessage}
          </div>
        )}

        <div className="space-y-5">
          <SettingsSection title="Business profile" description="Primary business details used across the partner console.">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="block">
                <span className="operational-label mb-2 block">Business name</span>
                <input
                  value={businessName}
                  onChange={(event) => setBusinessName(event.target.value)}
                  className="w-full rounded-[18px] border border-[rgba(30,47,36,0.12)] bg-white px-4 py-3 text-[15px] outline-none transition focus:border-[rgba(30,47,36,0.32)]"
                />
              </label>
              <label className="block">
                <span className="operational-label mb-2 block">Legal entity</span>
                <input
                  value={partnerSettings.legalEntityName}
                  readOnly
                  className="w-full rounded-[18px] border border-[rgba(30,47,36,0.1)] bg-[#F7F6F0] px-4 py-3 text-[15px] text-[#5A5A5A]"
                />
              </label>
              <label className="block">
                <span className="operational-label mb-2 block">Contact person</span>
                <input
                  value={contactPerson}
                  onChange={(event) => setContactPerson(event.target.value)}
                  className="w-full rounded-[18px] border border-[rgba(30,47,36,0.12)] bg-white px-4 py-3 text-[15px] outline-none transition focus:border-[rgba(30,47,36,0.32)]"
                />
              </label>
              <label className="block">
                <span className="operational-label mb-2 block">Business type</span>
                <input
                  value={partnerSettings.businessType}
                  readOnly
                  className="w-full rounded-[18px] border border-[rgba(30,47,36,0.1)] bg-[#F7F6F0] px-4 py-3 text-[15px] text-[#5A5A5A]"
                />
              </label>
            </div>
          </SettingsSection>

          <SettingsSection title="Outlet details" description="Pickup-facing outlet records used by store staff and order operations.">
            <div className="space-y-3">
              {partnerSettings.outlets.map((outlet) => (
                <div key={outlet.outletId} className="rounded-[20px] bg-[rgba(255,255,255,0.74)] px-4 py-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="text-[16px] font-semibold text-[#1E1E1E]">{outlet.outletName}</div>
                      <div className="metadata-caption mt-1">{outlet.addressLine}</div>
                      <div className="metadata-caption mt-1">{outlet.area}, {outlet.city}</div>
                    </div>
                    <div className="text-[13px] text-[#56665A]">{outlet.operatingHours}</div>
                  </div>
                </div>
              ))}
            </div>
          </SettingsSection>

          <SettingsSection title="Pickup rules" description="Collection handover instructions shown across operations workflows.">
            <textarea
              value={pickupRules}
              onChange={(event) => setPickupRules(event.target.value)}
              rows={4}
              className="w-full rounded-[18px] border border-[rgba(30,47,36,0.12)] bg-white px-4 py-3 text-[15px] outline-none transition focus:border-[rgba(30,47,36,0.32)]"
            />
          </SettingsSection>

          <SettingsSection title="Notification preferences" description="Keep only the operational updates that matter in this account view.">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label className="flex items-center justify-between rounded-[18px] bg-[rgba(255,255,255,0.74)] px-4 py-4 text-[14px] text-[#1E1E1E]">
                <span>Pickup reminders</span>
                <input type="checkbox" checked={partnerSettings.notificationPreferences.pickupReminders} readOnly className="h-4 w-4 accent-[#1E2F24]" />
              </label>
              <label className="flex items-center justify-between rounded-[18px] bg-[rgba(255,255,255,0.74)] px-4 py-4 text-[14px] text-[#1E1E1E]">
                <span>Order alerts</span>
                <input type="checkbox" checked={partnerSettings.notificationPreferences.orderAlerts} readOnly className="h-4 w-4 accent-[#1E2F24]" />
              </label>
              <label className="flex items-center justify-between rounded-[18px] bg-[rgba(255,255,255,0.74)] px-4 py-4 text-[14px] text-[#1E1E1E]">
                <span>Payout updates</span>
                <input type="checkbox" checked={partnerSettings.notificationPreferences.payoutUpdates} readOnly className="h-4 w-4 accent-[#1E2F24]" />
              </label>
              <label className="flex items-center justify-between rounded-[18px] bg-[rgba(255,255,255,0.74)] px-4 py-4 text-[14px] text-[#1E1E1E]">
                <span>Weekly summary</span>
                <input
                  type="checkbox"
                  checked={weeklySummary}
                  onChange={(event) => setWeeklySummary(event.target.checked)}
                  className="h-4 w-4 accent-[#1E2F24]"
                />
              </label>
            </div>
          </SettingsSection>

          <SettingsSection title="Food safety and contact details" description="Keep compliance references and support contact points ready for follow-up.">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-[20px] bg-[rgba(255,255,255,0.74)] px-4 py-4 text-[14px] text-[#56665A]">
                <div className="operational-label mb-2">Primary support</div>
                <div className="text-[#1E1E1E] font-semibold">{partnerSettings.foodSafetyContact.supportName}</div>
                <div className="mt-2">{contactEmail}</div>
                <div>{contactPhone}</div>
              </div>
              <div className="rounded-[20px] bg-[rgba(255,255,255,0.74)] px-4 py-4 text-[14px] text-[#56665A]">
                <div className="operational-label mb-2">Compliance references</div>
                <div>FSSAI: {partnerSettings.foodSafetyContact.fssaiNumber}</div>
                <div className="mt-1">GST: {partnerSettings.foodSafetyContact.gstNumber}</div>
              </div>
            </div>
          </SettingsSection>
        </div>
      </SectionCard>
    </div>
  );
}
