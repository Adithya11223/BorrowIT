// MyItems.jsx - Inventory listing table & action controls for BorrowIT

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button, Card, Badge, ConfirmationDialog, EmptyState } from '../components/UI';
import * as Icons from 'lucide-react';

export default function MyItems() {
  const { currentUser, items, toggleAvailability, deleteItem } = useApp();
  const [activeTab, setActiveTab] = useState('all');
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Filter user listed items
  const myListedItems = items.filter(item => item.ownerId === currentUser?.id);

  // Tab filtering
  const filteredItems = myListedItems.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return item.available;
    if (activeTab === 'lending') return !item.available; // Simplification for mock UI
    return true;
  });

  const handleDeleteTrigger = (id) => {
    setDeleteTargetId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteTargetId) {
      await deleteItem(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">My Listed Items</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your active listings, check status, and edit details.</p>
        </div>
        <Link to="/add-item">
          <Button variant="glow" icon="Plus" size="sm">
            Add New Item
          </Button>
        </Link>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-[#2A2A2D] gap-4 overflow-x-auto scrollbar-none pb-1">
        {[
          { id: 'all', label: 'All Items' },
          { id: 'active', label: 'Active / Available' },
          { id: 'lending', label: 'Lent Out / Reserved' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap relative ${
              activeTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-white'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Table view */}
      {filteredItems.length > 0 ? (
        <Card className="p-0 overflow-hidden border border-[#2A2A2D] bg-[#1A1A1C]" hoverable={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#2A2A2D] bg-[#131314] text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Item details</th>
                  <th className="py-4 px-6 text-center">Views</th>
                  <th className="py-4 px-6 text-center">Requests</th>
                  <th className="py-4 px-6 text-center">Rating</th>
                  <th className="py-4 px-6">Availability</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2D] text-xs text-slate-300">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Item title details */}
                    <td className="py-4 px-6 font-semibold text-white">
                      <div className="flex items-center gap-3">
                        <img src={item.images[0]} alt={item.title} className="w-10 h-10 rounded-lg object-cover border border-[#2A2A2D]" />
                        <div>
                          <p className="font-extrabold text-white line-clamp-1">{item.title}</p>
                          <p className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase mt-0.5">₹{item.price} / day</p>
                        </div>
                      </div>
                    </td>
                    {/* Views */}
                    <td className="py-4 px-6 text-center font-bold text-slate-500">{item.views}</td>
                    {/* Requests */}
                    <td className="py-4 px-6 text-center font-bold text-slate-500">{item.requestsCount}</td>
                    {/* Rating */}
                    <td className="py-4 px-6 text-center font-bold">
                      <span className="flex items-center justify-center gap-1">
                        <Icons.Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {item.rating.toFixed(1)}
                      </span>
                    </td>
                    {/* Toggle availability */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 select-none">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.available}
                            onChange={() => toggleAvailability(item.id)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-[#131314] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#0D0D0E]0 after:border-slate-500 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-primary" />
                        </label>
                        <Badge variant={item.available ? 'success' : 'neutral'}>
                          {item.available ? 'Active' : 'Lent Out'}
                        </Badge>
                      </div>
                    </td>
                    {/* Controls */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <Link to={`/item/${item.id}`}>
                          <button className="p-2 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800 transition-colors" title="View details">
                            <Icons.Eye className="w-4 h-4" />
                          </button>
                        </Link>
                        <button 
                          onClick={() => handleDeleteTrigger(item.id)}
                          className="p-2 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors" 
                          title="Delete Listing"
                        >
                          <Icons.Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <EmptyState
          icon="PackageOpen"
          title="No items found"
          description={
            activeTab === 'all' 
              ? "You haven't listed any items for sharing yet. Start sharing to build your trust score!" 
              : "No items match the selected tab filter."
          }
          actionLabel={activeTab === 'all' ? "List your first item" : undefined}
          onAction={activeTab === 'all' ? () => {} : undefined}
        />
      )}

      {/* Delete Verify Dialog */}
      <ConfirmationDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Item Listing?"
        description="Are you sure you want to delete this listing? This will remove the listing from public browse lists, and cannot be undone."
        confirmText="Delete Listing"
      />
    </div>
  );
}
