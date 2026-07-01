// Browse.jsx - Desktop-friendly catalog with filters sidebar and responsive grids for BorrowIT

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card, Badge, EmptyState } from '../components/UI';
import * as Icons from 'lucide-react';

export default function Browse() {
  const { items, loadItems, wishlist, toggleWishlist } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const urlQuery = searchParams.get('search') || '';
  const urlCategory = searchParams.get('category') || 'all';

  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [category, setCategory] = useState(urlCategory);
  const [sort, setSort] = useState('latest');
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Geolocation & Permissions Explanatory states
  const [userCoords, setUserCoords] = useState(null);
  const [permissionModal, setPermissionModal] = useState(false);

  // Filters State
  const [distance, setDistance] = useState('all');
  const [availability, setAvailability] = useState('all');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');

  // Proactively check geolocation permissions on mount
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then((status) => {
        if (status.state === 'granted') {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              setUserCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
              setSort('distance'); // default to distance sorting if active
            },
            (err) => console.log('Location fetch failed:', err)
          );
        }
      });
    }
  }, []);

  useEffect(() => {
    setSearchQuery(urlQuery);
    setCategory(urlCategory);
  }, [urlQuery, urlCategory]);

  useEffect(() => {
    const fetchFilteredList = async () => {
      setLoading(true);
      await loadItems({
        query: searchQuery,
        category: category,
        filters: { userCoords, distance, availability, priceMin, priceMax },
        sort: sort
      });
      setLoading(false);
    };

    const delayDebounceFn = setTimeout(() => {
      fetchFilteredList();
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, category, sort, distance, availability, priceMin, priceMax, userCoords]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setCategory('all');
    setSort('latest');
    setDistance('all');
    setAvailability('all');
    setPriceMin('');
    setPriceMax('');
    setSearchParams({});
    setShowFilters(false);
  };

  const handleSortChange = (val) => {
    if (val === 'distance' && !userCoords) {
      setPermissionModal(true);
    } else {
      setSort(val);
    }
  };

  const handleCategorySelect = (catId) => {
    setCategory(catId);
    setSearchParams({ category: catId, search: searchQuery });
  };

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'cameras', name: 'Cameras' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'sports', name: 'Sports' },
    { id: 'tools', name: 'Tools' },
    { id: 'home', name: 'Home' },
    { id: 'books', name: 'Books' }
  ];

  return (
    <div className="bg-[#000000] min-h-full text-white flex flex-col gap-6 select-none relative">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-white">Browse Catalog</h1>
        <p className="text-xs text-slate-500 mt-1 font-semibold">Find the perfect items listed by neighbors nearby.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Persistent Filters Sidebar (Desktop only) */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-5 bg-[#1A1A1C] border border-[#2A2A2D] rounded-2xl p-5 h-fit shadow-sm">
          <div className="flex justify-between items-center border-b border-[#2A2A2D]/40 pb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Search Filters</span>
            <button onClick={handleClearFilters} className="text-[10px] font-bold text-brand-primary hover:underline">Reset All</button>
          </div>

          {/* Search text input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Keywords</label>
            <div className="relative">
              <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#131314] border border-[#2A2A2D] focus:border-brand-primary rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Categories select list */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Categories</label>
            <div className="flex flex-col gap-1 font-sans">
              {categories.map((cat) => {
                const active = category.toLowerCase() === cat.id.toLowerCase();
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`text-left text-xs px-3 py-2 rounded-xl transition-all font-semibold ${
                      active ? 'bg-brand-primary text-black font-extrabold' : 'text-slate-400 hover:text-white hover:bg-[#131314]'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Availability */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Availability</label>
            <div className="grid grid-cols-3 gap-1 bg-[#131314] p-0.5 rounded-lg border border-[#2A2A2D]">
              {['all', 'available', 'lending'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setAvailability(opt)}
                  className={`py-1.5 px-1 rounded text-[8px] font-black uppercase tracking-wider transition-colors ${
                    availability === opt ? 'bg-brand-primary text-black' : 'text-slate-400 hover:text-slate-205'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Sort By</label>
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-[#131314] border border-[#2A2A2D] rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-brand-primary w-full font-sans cursor-pointer"
            >
              <option value="latest">Newest First</option>
              <option value="distance">Proximity (Nearest First)</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Right Column: Search input on mobile / Results Grid */}
        <div className="lg:col-span-9 flex flex-col gap-4">
          
          {/* Mobile search bar and slider icon */}
          <div className="flex lg:hidden gap-2 items-center shrink-0">
            <div className="relative flex-1">
              <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#131314] border border-[#2A2A2D] focus:border-brand-primary rounded-xl py-2.5 pl-9 pr-8 text-xs text-white placeholder-slate-500 focus:outline-none font-sans"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  <Icons.X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-xl border flex items-center justify-center transition-colors ${
                showFilters ? 'bg-brand-primary text-black border-brand-primary' : 'bg-[#131314] border-[#2A2A2D] text-white'
              }`}
            >
              <Icons.SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile categories selector (horizontal scroll) */}
          <div className="flex lg:hidden gap-2 overflow-x-auto pb-1 scrollbar-none shrink-0">
            {categories.map((cat) => {
              const active = category.toLowerCase() === cat.id.toLowerCase();
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border shrink-0 transition-all ${
                    active 
                      ? 'bg-brand-primary text-black border-brand-primary' 
                      : 'bg-[#131314] border-[#2A2A2D] text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Mobile filters drawer dropdown */}
          {showFilters && (
            <div className="lg:hidden bg-[#1A1A1C] border border-[#2A2A2D] rounded-[24px] p-4 z-20 flex flex-col gap-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-[#2A2A2D]/40 pb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Search Filters</span>
                <button onClick={handleClearFilters} className="text-[9px] font-bold text-brand-primary hover:underline">Reset All</button>
              </div>

              {/* Mobile Category select drop */}
              <div className="flex flex-col gap-1.5 font-sans">
                <label className="text-[8px] font-bold uppercase tracking-wider text-slate-500">Category</label>
                <select
                  value={category}
                  onChange={(e) => handleCategorySelect(e.target.value)}
                  className="bg-[#131314] border border-[#2A2A2D] rounded-xl px-2 py-1.5 text-[10px] text-white focus:outline-none w-full"
                >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              {/* Mobile Availability select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[8px] font-bold uppercase tracking-wider text-slate-500">Availability</label>
                <div className="grid grid-cols-3 gap-1 bg-[#131314] p-0.5 rounded-lg border border-[#2A2A2D]">
                  {['all', 'available', 'lending'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setAvailability(opt)}
                      className={`py-1 px-1.5 rounded text-[8px] font-extrabold uppercase tracking-wider transition-colors ${
                        availability === opt ? 'bg-brand-primary text-black' : 'text-slate-400'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Sort */}
              <div className="flex flex-col gap-1.5 font-sans">
                <label className="text-[8px] font-bold uppercase tracking-wider text-slate-500">Sort By</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-[#131314] border border-[#2A2A2D] rounded-xl px-2 py-1.5 text-[10px] text-white focus:outline-none w-full"
                >
                  <option value="latest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              <button
                onClick={() => setShowFilters(false)}
                className="w-full bg-brand-primary text-black font-bold py-2.5 rounded-xl text-[10px]"
              >
                Apply Filters
              </button>
            </div>
          )}

          {/* Results Grid List */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="bg-[#1A1A1C] h-60 rounded-2xl border border-[#2A2A2D] animate-pulse" />
                ))}
              </div>
            ) : items.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => {
                  const isWish = wishlist.some(w => w.id === item.id);
                  return (
                    <Card
                      key={item.id}
                      className="flex flex-col bg-[#1A1A1C] border-[#2A2A2D] p-3 rounded-2xl relative group overflow-hidden"
                    >
                      <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-black border border-[#2A2A2D]/40">
                        <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        
                        {/* Heart button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(item);
                          }}
                          className="absolute top-2.5 right-2.5 rounded-full bg-black/60 border border-[#2A2A2D] p-1.5 hover:bg-[#1A1A1C] transition-colors z-10"
                        >
                          <Icons.Heart className={`w-3.5 h-3.5 ${isWish ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                        </button>

                        {/* Distance Badge */}
                        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded border border-[#2A2A2D]/55 text-[8px] font-bold text-slate-300">
                          {item.distance}
                        </div>

                        {/* Badge Overlay */}
                        <div className="absolute left-2.5 bottom-2.5">
                          <Badge variant={item.available ? 'success' : 'neutral'} className="backdrop-blur-md bg-black/60 border-dark-border text-[8px] py-0.5 px-2 font-bold">
                            {item.available ? 'Available' : 'Lending'}
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-3 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-black text-white line-clamp-1 group-hover:text-brand-primary transition-colors">{item.title}</h4>
                          <p className="text-[10px] text-slate-500 mt-1 line-clamp-1 font-medium">{item.description}</p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3.5 border-t border-[#2A2A2D]/40 pt-2">
                          <span className="text-xs font-black text-brand-primary">₹{item.price} <span className="text-[8px] text-slate-500 font-normal">/ day</span></span>
                          <span className="flex items-center gap-0.5 text-[9px] font-bold text-white bg-[#131314] px-1.5 py-0.5 rounded border border-[#2A2A2D]/50">
                            <Icons.Star className="w-2.5 h-2.5 fill-brand-primary text-brand-primary" />
                            {item.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>

                      {/* Absolute cover link for navigability */}
                      <Link to={`/item/${item.id}`} className="absolute inset-0 opacity-0 z-0">
                        View item details
                      </Link>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon="SearchCode"
                title="No results found"
                description="We couldn't find items matching your filters."
                actionLabel="Reset Filters"
                onAction={handleClearFilters}
              />
            )}
          </div>

        </div>
      </div>

      {/* ===== RUNTIME LOCATION PERMISSION MODAL ===== */}
      {permissionModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#1A1A1C] border border-[#2A2A2D] rounded-2xl p-6 shadow-xl text-center">
            
            {/* Icon header */}
            <div className="mx-auto w-12 h-12 rounded-full bg-brand-primary/10 border border-[#2A2A2D] text-brand-primary flex items-center justify-center mb-4">
              <Icons.Navigation className="w-6 h-6 animate-pulse" />
            </div>

            {/* Explanation text */}
            <h3 className="text-base font-extrabold text-white">Enable location access?</h3>
            <p className="text-xs text-slate-400 mt-2.5 leading-relaxed font-semibold">
              BorrowIT requests your location to calculate distance to nearby items in kilometers, display proximity indicators on each item card, and sort listings by distance by default. Your location remains private.
            </p>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setPermissionModal(false);
                  setSort('latest');
                }}
                className="flex-1 bg-transparent border border-[#2A2A2D] hover:bg-slate-800/40 text-slate-300 font-bold py-3 rounded-xl text-xs transition-all active:scale-95"
              >
                Not Now
              </button>
              <button
                type="button"
                onClick={() => {
                  setPermissionModal(false);
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (pos) => {
                        setUserCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
                        setSort('distance');
                      },
                      (err) => {
                        console.error(err);
                        setSort('latest');
                      }
                    );
                  } else {
                    setSort('latest');
                  }
                }}
                className="flex-1 bg-brand-primary hover:bg-[#E05300] text-black font-extrabold py-3 rounded-xl text-xs transition-all active:scale-95 shadow-lg shadow-brand-primary/10"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
