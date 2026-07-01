// BorrowRequests.jsx - Incoming & outgoing borrow/lend requests panel for BorrowIT

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button, Card, Badge, EmptyState, Avatar } from '../components/UI';
import * as Icons from 'lucide-react';
import { motion } from 'framer-motion';

export default function BorrowRequests() {
  const { currentUser, requests, handleRequestStatus } = useApp();
  const [activeTab, setActiveTab] = useState('received');

  // Filter requests
  const incomingRequests = requests.filter(r => r.ownerId === currentUser?.id);
  const outgoingRequests = requests.filter(r => r.borrowerId === currentUser?.id);

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Accepted': return 'success';
      case 'Pending': return 'warning';
      case 'Declined': return 'error';
      case 'Returned': return 'info';
      default: return 'neutral';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-white">Borrow & Lending Requests</h1>
        <p className="text-sm text-slate-500 mt-1">Manage incoming lending requests and monitor status of your borrow requests.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#2A2A2D] gap-4 overflow-x-auto scrollbar-none pb-1">
        <button
          onClick={() => setActiveTab('received')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap relative ${
            activeTab === 'received' ? 'text-white' : 'text-slate-500 hover:text-white'
          }`}
        >
          Lending Requests (Received)
          <span className="ml-1.5 text-[10px] bg-[#1A1A1C] px-1.5 py-0.5 rounded-full text-slate-500 border border-[#2A2A2D]">
            {incomingRequests.filter(r => r.status === 'Pending').length}
          </span>
          {activeTab === 'received' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap relative ${
            activeTab === 'sent' ? 'text-white' : 'text-slate-500 hover:text-white'
          }`}
        >
          Borrow Requests (Sent)
          {activeTab === 'sent' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
          )}
        </button>
      </div>

      {/* Requests Stream */}
      {activeTab === 'received' ? (
        incomingRequests.length > 0 ? (
          <div className="flex flex-col gap-4">
            {incomingRequests.map((req) => (
              <Card key={req.id} className="p-5 bg-[#1A1A1C] border-[#2A2A2D] shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5" hoverable={false}>
                {/* Left: Item image, borrower details */}
                <div className="flex gap-4 items-start">
                  <img src={req.itemImage || req.item?.images[0]} alt={req.itemName} className="w-12 h-12 rounded-lg object-cover border border-[#2A2A2D] shrink-0" />
                  <div>
                    <h3 className="text-sm font-extrabold text-white">{req.itemName}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Requested by: <span className="text-white font-bold">{req.borrowerName}</span>
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1.5 font-semibold">
                      <Icons.Calendar className="w-3.5 h-3.5" />
                      {req.startDate} to {req.endDate}
                    </p>
                  </div>
                </div>

                {/* Right: Price, status, actions */}
                <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-start w-full sm:w-auto gap-3.5">
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-slate-500 font-semibold tracking-wide uppercase">Income</p>
                    <p className="text-sm font-black text-brand-primary">₹{req.totalPrice}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={getStatusVariant(req.status)} className="capitalize font-bold">
                      {req.status}
                    </Badge>

                    {req.status === 'Pending' && (
                      <div className="flex gap-2">
                        <Button
                          variant="glow"
                          size="sm"
                          className="py-1 px-3 text-xs"
                          onClick={() => handleRequestStatus(req.id, 'Accepted')}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          className="py-1 px-3 text-xs"
                          onClick={() => handleRequestStatus(req.id, 'Declined')}
                        >
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="Inbox"
            title="No lending requests"
            description="You have not received any requests from community members to borrow your items yet. Available listings will show up here."
          />
        )
      ) : (
        outgoingRequests.length > 0 ? (
          <div className="flex flex-col gap-4">
            {outgoingRequests.map((req) => (
              <Card key={req.id} className="p-5 bg-[#1A1A1C] border-[#2A2A2D] shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5" hoverable={false}>
                {/* Left: Item image, owner details */}
                <div className="flex gap-4 items-start">
                  <img src={req.itemImage || req.item?.images[0]} alt={req.itemName} className="w-12 h-12 rounded-lg object-cover border border-[#2A2A2D] shrink-0" />
                  <div>
                    <h3 className="text-sm font-extrabold text-white">{req.itemName}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Owner: <span className="text-white font-bold">{req.ownerName}</span>
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1.5 font-semibold">
                      <Icons.Calendar className="w-3.5 h-3.5" />
                      {req.startDate} to {req.endDate}
                    </p>
                  </div>
                </div>

                {/* Right: Cost, status, returns */}
                <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-start w-full sm:w-auto gap-3.5">
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-slate-500 font-semibold tracking-wide uppercase">Cost</p>
                    <p className="text-sm font-black text-white">₹{req.totalPrice}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={getStatusVariant(req.status)} className="capitalize font-bold">
                      {req.status}
                    </Badge>

                    {req.status === 'Accepted' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="py-1 px-3 text-xs border-brand-primary/20 text-brand-primary hover:bg-brand-primary/10"
                        onClick={() => handleRequestStatus(req.id, 'Returned')}
                      >
                        Return Item
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="ShoppingBag"
            title="No borrow requests"
            description="You have not requested to borrow any items yet. Search our catalog to send requests."
            actionLabel="Browse Catalog"
            onAction={() => {}}
          />
        )
      )}

    </div>
  );
}
