// Wishlist.jsx - Hearts bookmarks collector page for BorrowIT

import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card, Button, Badge, EmptyState } from '../components/UI';
import * as Icons from 'lucide-react';

export default function Wishlist() {
  const { wishlist, toggleWishlist } = useApp();

  return (
    <div className="flex flex-col gap-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-white">My Wishlist</h1>
        <p className="text-sm text-slate-500 mt-1">Bookmarked listings you want to borrow or check out later.</p>
      </div>

      {/* Grid of Wishlist Items */}
      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <Card key={item.id} className="flex flex-col h-full group" hoverable>
              {/* Image with heart */}
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-[#131314]">
                <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 p-3.5 flex flex-col justify-between pointer-events-none">
                  <div className="flex justify-between items-center w-full">
                    <Badge variant="info" className="backdrop-blur-md uppercase tracking-wider font-extrabold text-[9px] bg-[#0D0D0E]/85 border-[#2A2A2D]">
                      {item.category}
                    </Badge>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(item);
                      }}
                      className="pointer-events-auto rounded-full bg-[#131314]/80 border border-[#2A2A2D] backdrop-blur-md p-2 hover:bg-[#131314] hover:text-white transition-colors"
                    >
                      <Icons.Heart className="w-4 h-4 fill-red-500 text-red-500" />
                    </button>
                  </div>
                  <Badge variant={item.available ? 'success' : 'neutral'} className="backdrop-blur-md bg-[#0D0D0E]/85 border-[#2A2A2D] font-bold w-fit">
                    {item.available ? 'Available' : 'Lending'}
                  </Badge>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 flex flex-col justify-between mt-4">
                <div>
                  <h4 className="text-base font-bold text-white line-clamp-1">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Icons.MapPin className="w-3.5 h-3.5" />
                    {item.distance}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-5 pt-3.5 border-t border-[#2A2A2D]">
                  <p className="text-sm font-black text-white">₹{item.price} <span className="text-xs text-slate-500 font-normal">/ day</span></p>
                  <Link to={`/item/${item.id}`}><Button variant="outline" size="sm">Details</Button></Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="Heart"
          title="Your wishlist is empty"
          description="Click the heart icon on any listing card while browsing to save it to your wishlist page."
          actionLabel="Explore Listings"
          onAction={() => {}}
        />
      )}

    </div>
  );
}
