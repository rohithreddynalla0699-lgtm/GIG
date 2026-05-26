import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

export default function PartnerDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className="bg-white border-b-2 border-[#E0E0E0] px-[5%] h-[68px] flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-[10px]">
          <div className="w-10 h-10 bg-gradient-to-br from-[#00A661] to-[#008A51] rounded-xl flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15.5 8.5L22 9.5L17 14.5L18 21L12 18L6 21L7 14.5L2 9.5L8.5 8.5L12 2Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-['Fraunces',serif] text-xl font-bold text-[#212121]">Partner Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm text-[#5A5A5A] hover:text-[#00A661]">Help</button>
          <div className="relative">
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-10 h-10 bg-[#E8F5E9] rounded-full flex items-center justify-center text-lg cursor-pointer border-2 border-[#E0E0E0] hover:border-[#00A661]"
            >
              👤
            </div>
            {showDropdown && (
              <div className="absolute right-0 top-12 bg-white border-2 border-[#E0E0E0] rounded-2xl p-2 min-w-[180px] shadow-[0_8px_24px_rgba(0,0,0,0.1)] z-[100]">
                <button
                  onClick={() => { setActiveSection('profile'); setShowDropdown(false); }}
                  className="flex items-center gap-[10px] px-[14px] py-[10px] text-sm font-medium text-[#212121] rounded-[10px] hover:bg-[#FAFAFA] w-full text-left"
                >
                  ⚙️ &nbsp;My Profile
                </button>
                <button
                  onClick={() => { setActiveSection('analytics'); setShowDropdown(false); }}
                  className="flex items-center gap-[10px] px-[14px] py-[10px] text-sm font-medium text-[#212121] rounded-[10px] hover:bg-[#FAFAFA] w-full text-left"
                >
                  📊 &nbsp;Analytics
                </button>
                <div className="h-[1px] bg-[#E0E0E0] my-1"></div>
                <Link
                  to="/"
                  className="flex items-center gap-[10px] px-[14px] py-[10px] text-sm font-medium text-[#212121] rounded-[10px] hover:bg-[#FAFAFA] w-full text-left"
                >
                  🏠 &nbsp;View website
                </Link>
                <div className="h-[1px] bg-[#E0E0E0] my-1"></div>
                <button
                  onClick={() => navigate('/partner/login')}
                  className="flex items-center gap-[10px] px-[14px] py-[10px] text-sm font-medium text-[#FF3B30] rounded-[10px] hover:bg-[#FFF0EE] w-full text-left"
                >
                  → &nbsp;Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-[240px_1fr] min-h-[calc(100vh-68px)]">
        {/* Sidebar */}
        <aside className="bg-white border-r-2 border-[#E0E0E0] py-6 sticky top-[68px] h-[calc(100vh-68px)] overflow-y-auto">
          <div className="px-5 pb-4 border-b-2 border-[#E0E0E0] mb-2">
            <div className="text-base font-bold text-[#212121] mb-[2px]">Sunrise Bakery</div>
            <span className="inline-block text-xs font-semibold text-[#00A661] bg-[#E8F5E9] px-2 py-[2px] rounded-full">Bakery</span>
            <div className="flex items-center gap-[6px] text-xs text-[#5A5A5A] mt-[6px]">
              <div className="w-[7px] h-[7px] rounded-full bg-[#00A661]"></div>
              Active & verified
            </div>
          </div>

          <div className="px-3 py-2 text-[11px] font-bold text-[#9E9E9E] uppercase tracking-wider mt-2">Main</div>
          {[
            { id: 'overview', icon: '🏠', label: 'Overview' },
            { id: 'listings', icon: '🎒', label: 'My Listings' },
            { id: 'orders', icon: '📋', label: 'Orders' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-[10px] px-4 py-[11px] text-sm font-medium rounded-[10px] mx-2 my-[2px] w-[calc(100%-16px)] text-left transition-all ${
                activeSection === item.id ? 'bg-[#E8F5E9] text-[#00A661] font-semibold' : 'text-[#5A5A5A] hover:bg-[#FAFAFA] hover:text-[#212121]'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm ${
                activeSection === item.id ? 'bg-[#00A661] brightness-[10]' : 'bg-[#F0F0F0]'
              }`}>
                {item.icon}
              </div>
              {item.label}
            </button>
          ))}

          <div className="px-3 py-2 text-[11px] font-bold text-[#9E9E9E] uppercase tracking-wider mt-2">Insights</div>
          {[
            { id: 'analytics', icon: '📊', label: 'Analytics' },
            { id: 'reviews', icon: '⭐', label: 'Reviews' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-[10px] px-4 py-[11px] text-sm font-medium rounded-[10px] mx-2 my-[2px] w-[calc(100%-16px)] text-left transition-all ${
                activeSection === item.id ? 'bg-[#E8F5E9] text-[#00A661] font-semibold' : 'text-[#5A5A5A] hover:bg-[#FAFAFA] hover:text-[#212121]'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm ${
                activeSection === item.id ? 'bg-[#00A661] brightness-[10]' : 'bg-[#F0F0F0]'
              }`}>
                {item.icon}
              </div>
              {item.label}
            </button>
          ))}

          <div className="px-3 py-2 text-[11px] font-bold text-[#9E9E9E] uppercase tracking-wider mt-2">Account</div>
          {[
            { id: 'profile', icon: '👤', label: 'My Profile' },
            { id: 'payouts', icon: '💰', label: 'Payouts' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-[10px] px-4 py-[11px] text-sm font-medium rounded-[10px] mx-2 my-[2px] w-[calc(100%-16px)] text-left transition-all ${
                activeSection === item.id ? 'bg-[#E8F5E9] text-[#00A661] font-semibold' : 'text-[#5A5A5A] hover:bg-[#FAFAFA] hover:text-[#212121]'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm ${
                activeSection === item.id ? 'bg-[#00A661] brightness-[10]' : 'bg-[#F0F0F0]'
              }`}>
                {item.icon}
              </div>
              {item.label}
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <main className="px-10 py-8 overflow-y-auto">
          {activeSection === 'overview' && (
            <div>
              <div className="mb-7">
                <h1 className="text-[28px] font-bold text-[#212121] mb-1">Welcome back, Sunrise Bakery! 👋</h1>
                <p className="text-[15px] text-[#5A5A5A]">Here's what's happening with your business today — Sunday, 6 April 2026</p>
              </div>

              <div className="grid grid-cols-6 gap-3 mb-7">
                {[
                  { label: "Today's Earnings", value: '₹1,240', trend: '↑ 3 bags sold' },
                  { label: 'This Week', value: '₹8,650', trend: '↑ 12% vs last week' },
                  { label: 'This Month', value: '₹42,300', trend: 'Best month so far' },
                  { label: 'Meals Saved', value: '287', trend: 'Total all time', green: true },
                  { label: 'CO₂ Saved (kg)', value: '718', trend: '= 3 trees planted', green: true },
                  { label: 'Your Rating', value: '4.8 ⭐', trend: '32 reviews' },
                ].map((stat, i) => (
                  <div key={i} className={`rounded-2xl p-[18px] border-2 transition-colors hover:border-[#00A661] ${
                    stat.green ? 'bg-gradient-to-br from-[#00A661] to-[#008A51] border-transparent text-white' : 'bg-white border-[#E0E0E0]'
                  }`}>
                    <div className={`text-xs mb-[6px] ${stat.green ? 'text-white/75' : 'text-[#5A5A5A]'}`}>{stat.label}</div>
                    <div className={`text-[26px] font-bold leading-none ${stat.green ? 'text-white' : 'text-[#212121]'}`}>{stat.value}</div>
                    <div className={`text-[11px] mt-1 ${stat.green ? 'text-white' : 'text-[#00A661]'}`}>{stat.trend}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-[1fr_320px] gap-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xl font-bold text-[#212121]">Active listings</div>
                    <button
                      onClick={() => setShowModal(true)}
                      className="flex items-center gap-2 bg-[#00A661] text-white px-5 py-[10px] rounded-full text-sm font-semibold hover:bg-[#008A51] shadow-[0_4px_12px_rgba(0,166,97,0.2)]"
                    >
                      <span className="text-lg">+</span> Add new bag
                    </button>
                  </div>

                  {[
                    { name: '🥐 Bakery Mix', desc: 'Fresh breads, pastries, and baked goods from today', time: '7:30 PM – 8:00 PM', price: '₹149', orig: '₹450', reserved: 2, total: 5 },
                    { name: '🍳 Breakfast Special', desc: 'Sandwiches, wraps, and breakfast items', time: '9:00 AM – 9:30 AM', price: '₹129', orig: '₹380', reserved: 3, total: 3 },
                  ].map((bag, i) => (
                    <div key={i} className="bg-white border-2 border-[#E0E0E0] rounded-2xl p-[22px] mb-3 hover:border-[#00A661] transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="text-[17px] font-bold text-[#212121] mb-1">{bag.name}</div>
                          <div className="text-[13px] text-[#5A5A5A] mb-2">{bag.desc}</div>
                          <div className="flex items-center gap-3 text-[13px] text-[#5A5A5A]">
                            <span>⏰ {bag.time}</span>
                            <span className="text-[#00A661] font-semibold">{bag.price}</span>
                            <span className="line-through">{bag.orig}</span>
                          </div>
                        </div>
                        <button className="text-xl text-[#5A5A5A]">⋮</button>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-[#5A5A5A] mb-[5px]">
                          <span>{bag.reserved} of {bag.total} reserved</span>
                          <span className={bag.reserved === bag.total ? 'text-[#00A661] font-semibold' : ''}>{bag.total - bag.reserved} left</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-[6px] bg-[#E0E0E0] rounded-full overflow-hidden">
                            <div className="h-full bg-[#00A661] rounded-full" style={{ width: `${(bag.reserved / bag.total) * 100}%` }}></div>
                          </div>
                          <div className="flex gap-2">
                            <button className="bg-[#E8F5E9] text-[#00A661] px-4 py-2 rounded-[10px] text-[13px] font-semibold hover:bg-[#C8E6C9]">Edit</button>
                            <button className="bg-[#FFE8E6] text-[#FF3B30] px-4 py-2 rounded-[10px] text-[13px] font-semibold hover:bg-[#FFD0CC]">Remove</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="bg-[#E8F5E9] border-2 border-[#C8E6C9] rounded-2xl p-5 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-[#2E7D32] mb-[2px]">Next payout</div>
                      <div className="text-[22px] font-bold text-[#00A661] leading-none">₹6,892</div>
                      <div className="text-xs text-[#2E7D32] mt-[2px]">Arriving Monday, Apr 13</div>
                    </div>
                    <div className="text-[28px]">💸</div>
                  </div>

                  <div className="bg-white border-2 border-[#E0E0E0] rounded-2xl p-[22px]">
                    <h3 className="text-base font-bold text-[#212121] mb-4">Quick actions</h3>
                    {[
                      { icon: '🎒', label: 'Add new bag', action: () => setShowModal(true) },
                      { icon: '📊', label: 'View analytics', action: () => setActiveSection('analytics') },
                      { icon: '💰', label: 'Payout history', action: () => setActiveSection('payouts') },
                      { icon: '⚙️', label: 'Edit profile', action: () => setActiveSection('profile') },
                    ].map((item, i) => (
                      <button
                        key={i}
                        onClick={item.action}
                        className="w-full bg-[#F5F5F5] text-left px-[14px] py-3 rounded-xl text-sm font-medium text-[#212121] hover:bg-[#E8F5E9] hover:text-[#00A661] flex items-center gap-[10px] transition-colors mb-2 last:mb-0"
                      >
                        {item.icon} &nbsp;{item.label}
                      </button>
                    ))}
                  </div>

                  <div className="bg-gradient-to-br from-[#FFF9E6] to-[#FFFBEF] border-2 border-[#FFE082] rounded-2xl p-[22px]">
                    <div className="flex items-center gap-2 mb-[10px]">
                      <span className="text-[22px]">💡</span>
                      <h3 className="text-[15px] font-bold text-[#212121]">Pro tip</h3>
                    </div>
                    <div className="text-[13px] text-[#5A5A5A] leading-relaxed">
                      Bags listed between 6–8 PM get 3× more reservations. Schedule your listings during peak hours for best results!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'listings' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-[26px] font-bold text-[#212121] mb-1">My Listings</h1>
                  <p className="text-sm text-[#5A5A5A]">Manage your active surprise bags</p>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 bg-[#00A661] text-white px-5 py-[10px] rounded-full text-sm font-semibold hover:bg-[#008A51] shadow-[0_4px_12px_rgba(0,166,97,0.2)]"
                >
                  <span className="text-lg">+</span> Add new bag
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {[
                  {
                    name: '🥐 Bakery Mix',
                    desc: 'Fresh breads, croissants, pastries, and baked goods from today',
                    time: '7:30 PM – 8:00 PM',
                    price: '₹149',
                    orig: '₹450',
                    reserved: 2,
                    total: 5,
                    status: 'Active',
                    allergens: 'Wheat, Dairy, Eggs',
                    category: 'Bakery'
                  },
                  {
                    name: '🍳 Breakfast Special',
                    desc: 'Sandwiches, wraps, breakfast burritos, and morning items',
                    time: '9:00 AM – 9:30 AM',
                    price: '₹129',
                    orig: '₹380',
                    reserved: 3,
                    total: 3,
                    status: 'Sold Out',
                    allergens: 'Wheat, Dairy',
                    category: 'Breakfast'
                  },
                  {
                    name: '🍱 Lunch Combo',
                    desc: 'Various lunch items including rice bowls, curries, and sides',
                    time: '2:00 PM – 2:30 PM',
                    price: '₹169',
                    orig: '₹520',
                    reserved: 4,
                    total: 8,
                    status: 'Active',
                    allergens: 'Varies',
                    category: 'Lunch'
                  },
                  {
                    name: '🧁 Sweet Treats',
                    desc: 'Cakes, muffins, cookies, brownies, and other desserts',
                    time: '6:00 PM – 6:30 PM',
                    price: '₹99',
                    orig: '₹320',
                    reserved: 0,
                    total: 4,
                    status: 'Active',
                    allergens: 'Wheat, Dairy, Eggs, Nuts',
                    category: 'Desserts'
                  },
                  {
                    name: '🍽️ Dinner Surprise',
                    desc: 'Evening meals including main dishes, breads, and accompaniments',
                    time: '8:30 PM – 9:00 PM',
                    price: '₹189',
                    orig: '₹600',
                    reserved: 5,
                    total: 10,
                    status: 'Active',
                    allergens: 'Varies',
                    category: 'Dinner'
                  }
                ].map((bag, i) => (
                  <div key={i} className={`bg-white border-2 rounded-2xl p-6 hover:border-[#00A661] transition-all ${
                    bag.status === 'Sold Out' ? 'border-[#E0E0E0] opacity-60' : 'border-[#E0E0E0]'
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="text-[20px] font-bold text-[#212121]">{bag.name}</div>
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            bag.status === 'Sold Out'
                              ? 'bg-[#FFE8E6] text-[#FF3B30]'
                              : 'bg-[#E8F5E9] text-[#00A661]'
                          }`}>
                            {bag.status}
                          </span>
                        </div>
                        <div className="text-[14px] text-[#5A5A5A] mb-3">{bag.desc}</div>
                        <div className="flex items-center gap-4 text-[13px]">
                          <div className="flex items-center gap-1 text-[#5A5A5A]">
                            <span>⏰</span>
                            <span>{bag.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[#00A661] font-bold text-base">{bag.price}</span>
                            <span className="line-through text-[#9E9E9E]">{bag.orig}</span>
                            <span className="text-xs text-white bg-[#FF3B30] px-2 py-[2px] rounded-full font-semibold">
                              {Math.round((1 - parseInt(bag.price.slice(1)) / parseInt(bag.orig.slice(1))) * 100)}% OFF
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-4 text-xs">
                          <div className="text-[#5A5A5A]">
                            <strong>Category:</strong> {bag.category}
                          </div>
                          <div className="text-[#5A5A5A]">
                            <strong>Allergens:</strong> {bag.allergens}
                          </div>
                        </div>
                      </div>
                      <button className="text-xl text-[#5A5A5A] hover:text-[#212121] w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F5F5F5]">⋮</button>
                    </div>

                    <div className="border-t-2 border-[#E0E0E0] pt-4">
                      <div className="flex justify-between text-sm text-[#5A5A5A] mb-2">
                        <span className="font-semibold">{bag.reserved} of {bag.total} reserved</span>
                        <span className={bag.reserved === bag.total ? 'text-[#FF3B30] font-semibold' : 'text-[#00A661] font-semibold'}>
                          {bag.total - bag.reserved} {bag.total - bag.reserved === 0 ? 'sold out' : 'available'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1 h-2 bg-[#E0E0E0] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              bag.reserved === bag.total ? 'bg-[#FF3B30]' : 'bg-[#00A661]'
                            }`}
                            style={{ width: `${(bag.reserved / bag.total) * 100}%` }}
                          ></div>
                        </div>
                        <div className="text-sm font-bold text-[#212121]">
                          {Math.round((bag.reserved / bag.total) * 100)}%
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-[#E8F5E9] text-[#00A661] py-[10px] rounded-xl text-sm font-semibold hover:bg-[#C8E6C9] transition-colors">
                          ✏️ Edit bag
                        </button>
                        <button className="flex-1 bg-[#F5F5F5] text-[#5A5A5A] py-[10px] rounded-xl text-sm font-semibold hover:bg-[#E0E0E0] transition-colors">
                          📊 View stats
                        </button>
                        <button className="bg-[#FFE8E6] text-[#FF3B30] px-5 py-[10px] rounded-xl text-sm font-semibold hover:bg-[#FFD0CC] transition-colors">
                          🗑️ Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-[#E8F5E9] border-2 border-[#C8E6C9] rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <div className="text-[28px]">💡</div>
                  <div>
                    <h3 className="text-base font-bold text-[#00A661] mb-2">Tips for better listings</h3>
                    <ul className="text-sm text-[#2E7D32] space-y-1">
                      <li>• List bags during peak hours (6-8 PM) for maximum visibility</li>
                      <li>• Be specific about contents to set customer expectations</li>
                      <li>• Update allergen information accurately for customer safety</li>
                      <li>• Price competitively — typically 50-70% off original value</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'orders' && (
            <div>
              <h1 className="text-[26px] font-bold text-[#212121] mb-1">Orders</h1>
              <p className="text-sm text-[#5A5A5A] mb-6">Track customer pickups and confirm codes</p>
              <div className="text-[15px] text-[#5A5A5A]">Order management interface would appear here...</div>
            </div>
          )}

          {activeSection === 'analytics' && (
            <div>
              <h1 className="text-[26px] font-bold text-[#212121] mb-1">Analytics</h1>
              <p className="text-sm text-[#5A5A5A] mb-6">Understand your performance</p>
              <div className="text-[15px] text-[#5A5A5A]">Analytics charts and graphs would appear here...</div>
            </div>
          )}

          {activeSection === 'reviews' && (
            <div>
              <h1 className="text-[26px] font-bold text-[#212121] mb-1">Customer Reviews</h1>
              <p className="text-sm text-[#5A5A5A] mb-6">What your customers are saying</p>
              <div className="text-[15px] text-[#5A5A5A]">Customer reviews would appear here...</div>
            </div>
          )}

          {activeSection === 'profile' && (
            <div>
              <h1 className="text-[26px] font-bold text-[#212121] mb-1">My Profile</h1>
              <p className="text-sm text-[#5A5A5A] mb-6">Manage your account details</p>
              <div className="text-[15px] text-[#5A5A5A]">Business profile settings would appear here...</div>
            </div>
          )}

          {activeSection === 'payouts' && (
            <div>
              <h1 className="text-[26px] font-bold text-[#212121] mb-1">Payouts</h1>
              <p className="text-sm text-[#5A5A5A] mb-6">Your weekly payment history</p>
              <div className="text-[15px] text-[#5A5A5A]">Payout history and details would appear here...</div>
            </div>
          )}
        </main>
      </div>

      {/* Add Bag Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-[28px] p-9 max-w-[600px] w-full relative shadow-[0_40px_80px_rgba(0,0,0,0.2)] animate-[popIn_0.3s_ease] max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-[18px] right-[18px] w-9 h-9 rounded-full bg-[#F5F5F5] flex items-center justify-center text-base text-[#5A5A5A] hover:bg-[#E0E0E0]"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-[#212121] mb-1">Create surprise bag</h2>
            <div className="text-sm text-[#5A5A5A] mb-6">List your surplus food and start earning</div>
            <div className="mb-[18px]">
              <label className="block text-sm font-semibold text-[#212121] mb-2">
                Bag type <span className="text-[#FF3B30]">*</span>
              </label>
              <div className="grid grid-cols-3 gap-[10px]">
                {['🥐 Bakery Mix', '🍳 Breakfast', '🍱 Lunch', '🍽️ Dinner', '🧁 Sweets', '🛒 Groceries'].map((type, i) => (
                  <button key={i} className="p-[14px_10px] border-2 border-[#E0E0E0] rounded-xl hover:border-[#00A661] text-center transition-colors">
                    <div className="text-2xl mb-1">{type.split(' ')[0]}</div>
                    <div className="text-[13px] font-semibold text-[#212121]">{type.split(' ').slice(1).join(' ')}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-[18px]">
              <label className="block text-sm font-semibold text-[#212121] mb-2">
                Description <span className="text-[#FF3B30]">*</span>
              </label>
              <textarea
                placeholder="Describe what's typically in this bag (e.g., fresh breads, pastries, baked goods)"
                className="w-full p-[14px_18px] border-2 border-[#E0E0E0] rounded-xl text-sm outline-none transition-colors focus:border-[#00A661] resize-vertical min-h-[80px]"
              ></textarea>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-transparent border-2 border-[#E0E0E0] text-[#212121] py-[14px] rounded-full text-[15px] font-semibold hover:border-[#00A661] hover:text-[#00A661]"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-[#00A661] text-white py-[14px] rounded-full text-[15px] font-semibold hover:bg-[#008A51] shadow-[0_4px_12px_rgba(0,166,97,0.2)]"
              >
                Create bag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
