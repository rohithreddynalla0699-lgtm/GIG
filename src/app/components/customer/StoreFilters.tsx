interface StoreFiltersProps {
  query: string;
  onQueryChange: (value: string) => void;
  city: string;
  onCityChange: (value: string) => void;
  area: string;
  onAreaChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  pickup: string;
  onPickupChange: (value: string) => void;
  vegType: string;
  onVegTypeChange: (value: string) => void;
  cityOptions: string[];
  areaOptions: string[];
}

const categoryOptions = ['All', 'Bakery', 'Cafe', 'Restaurant', 'Desserts', 'Meal Box'];
const pickupOptions = ['All', 'Breakfast', 'Lunch', 'Evening', 'Late Night'];
const vegOptions = ['All', 'Veg', 'Non-veg', 'Mixed', 'Egg possible'];

const selectClass =
  'min-h-[46px] rounded-full border border-[color:var(--gig-border)] bg-white px-4 text-[14px] text-[color:var(--gig-text)] outline-none transition-colors focus:border-[color:var(--gig-green)]';

export default function StoreFilters({
  query,
  onQueryChange,
  city,
  onCityChange,
  area,
  onAreaChange,
  category,
  onCategoryChange,
  pickup,
  onPickupChange,
  vegType,
  onVegTypeChange,
  cityOptions,
  areaOptions,
}: StoreFiltersProps) {
  return (
    <div className="surface-card rounded-[28px] p-4 md:p-5">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row">
        <div className="flex-1">
          <label className="operational-label mb-2 block">Search</label>
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Store, area, cuisine, or pincode"
            className="min-h-[52px] w-full rounded-full border border-[color:var(--gig-border)] bg-white px-5 text-[15px] text-[color:var(--gig-text)] outline-none transition-colors placeholder:text-[color:var(--gig-text-soft)] focus:border-[color:var(--gig-green)]"
          />
        </div>
        <div className="grid flex-1 grid-cols-2 gap-3 md:grid-cols-4">
          <div>
            <label className="operational-label mb-2 block">City</label>
            <select value={city} onChange={(e) => onCityChange(e.target.value)} className={`${selectClass} w-full`}>
              <option value="All">All cities</option>
              {cityOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="operational-label mb-2 block">Area</label>
            <select value={area} onChange={(e) => onAreaChange(e.target.value)} className={`${selectClass} w-full`}>
              <option value="All">All areas</option>
              {areaOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="operational-label mb-2 block">Pickup</label>
            <select value={pickup} onChange={(e) => onPickupChange(e.target.value)} className={`${selectClass} w-full`}>
              {pickupOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="operational-label mb-2 block">Type</label>
            <select value={vegType} onChange={(e) => onVegTypeChange(e.target.value)} className={`${selectClass} w-full`}>
              {vegOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categoryOptions.map((option) => {
          const selected = category === option;
          return (
            <button
              key={option}
              onClick={() => onCategoryChange(option)}
              className={`min-h-[40px] rounded-full px-4 text-[13px] font-medium transition-colors ${
                selected
                  ? 'bg-[rgba(11,122,77,0.08)] text-[color:var(--gig-green-deep)]'
                  : 'bg-[rgba(32,38,28,0.05)] text-[color:var(--gig-text-muted)] hover:bg-[rgba(32,38,28,0.08)]'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
