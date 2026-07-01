// Profile.jsx - Public user profile page with verified status badges and reviews center for BorrowIT

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { mockServices } from '../services/mockServices';
import { Card, Button, Avatar, Rating, Badge, Loader, Input } from '../components/UI';
import * as Icons from 'lucide-react';

export default function Profile() {
  const { id } = useParams();
  const { currentUser, items, toggleWishlist, wishlist } = useApp();
  
  // Decide which profile ID to fetch
  const profileId = id || currentUser?.id || 'user-rahul';

  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');

  // Review Form States
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    const getProfileData = async () => {
      try {
        setLoading(true);
        const profile = await mockServices.fetchProfile(profileId);
        setUser(profile);
        
        const feedback = await mockServices.fetchReviews(profileId);
        setReviews(feedback);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getProfileData();
  }, [profileId]);

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <Icons.AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white">Profile Not Found</h2>
        <p className="text-slate-500 mt-2">The user you are looking for does not exist.</p>
      </div>
    );
  }

  // Filter listings by this user
  const userItems = items.filter(item => item.ownerId === user.id);
  const isSelf = currentUser && currentUser.id === user.id;

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!currentUser) return;

    try {
      setReviewLoading(true);
      const added = await mockServices.addReview({
        itemId: 'item-1', // Mock general item association
        reviewerName: currentUser.name,
        reviewerAvatar: currentUser.avatar,
        rating: newRating,
        comment: newComment,
        userReviewedId: user.id
      });
      setReviews(prev => [added, ...prev]);
      
      // Update local profile trust rating dynamically
      const updatedProfile = await mockServices.fetchProfile(user.id);
      setUser(updatedProfile);

      setNewComment('');
      setNewRating(5);
    } catch (err) {
      console.error(err);
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Profile Card Header */}
      <Card className="p-6 md:p-8 bg-[#1A1A1C] border-[#2A2A2D]/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8" hoverable={false}>
        <div className="flex flex-col sm:flex-row gap-5 items-center text-center sm:text-left">
          <Avatar src={user.avatar} alt={user.name} size="xl" verified={user.verified?.identity} />
          
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-2xl font-black text-white">{user.name}</h1>
              {user.verified?.identity && (
                <Badge variant="success" className="font-extrabold text-[10px] w-fit mx-auto sm:mx-0">Verified ID</Badge>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center justify-center sm:justify-start gap-1 font-semibold">
              <Icons.MapPin className="w-3.5 h-3.5" />
              {user.location} {user.distance ? `(${user.distance})` : ''}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Member since {user.memberSince}</p>

            <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
              <Rating rating={user.trustScore} size={3.5} readonly />
              <span className="text-xs text-white font-extrabold">{user.trustScore.toFixed(1)}</span>
              <span className="text-xs text-slate-500 font-semibold">({reviews.length} reviews)</span>
            </div>
          </div>
        </div>

        {/* Stats Panel */}
        <div className="grid grid-cols-3 gap-4 border-t sm:border-t-0 md:border-l border-[#2A2A2D] pt-5 md:pt-0 md:pl-8 w-full md:w-auto text-center">
          <div>
            <p className="text-xl font-black text-white">{user.listingsCount || userItems.length}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mt-0.5">Listed</p>
          </div>
          <div>
            <p className="text-xl font-black text-white">{user.borrowedCount || 0}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mt-0.5">Borrowed</p>
          </div>
          <div>
            <p className="text-xl font-black text-white">{user.lentCount || 0}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mt-0.5">Lent</p>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex border-b border-[#2A2A2D] gap-6 overflow-x-auto scrollbar-none pb-1 mb-6">
        {[
          { id: 'about', label: 'About & Verification' },
          { id: 'listings', label: `Listings (${userItems.length})` },
          { id: 'reviews', label: `Reviews (${reviews.length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap relative ${
              activeTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div>
        {/* About & Verification */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 flex flex-col gap-5">
              <Card className="p-6 bg-[#1A1A1C] border-[#2A2A2D]/80 shadow-sm" hoverable={false}>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">About Me</h3>
                <p className="text-sm text-slate-300 leading-relaxed font-sans">
                  {user.bio || "No biography provided yet. Sharing is caring!"}
                </p>
              </Card>
            </div>

            <div className="lg:col-span-4">
              <Card className="p-6 bg-[#1A1A1C] border-[#2A2A2D]/80 shadow-sm flex flex-col gap-4" hoverable={false}>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-1">Verification</h3>
                
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#131314]/30 border border-[#2A2A2D] text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-2">
                    <Icons.Mail className="w-4 h-4 text-slate-500" />
                    Email Verified
                  </span>
                  <Icons.CheckCircle2 className={`w-4 h-4 ${user.verified?.email ? 'text-brand-primary' : 'text-slate-500'}`} />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#131314]/30 border border-[#2A2A2D] text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-2">
                    <Icons.Phone className="w-4 h-4 text-slate-500" />
                    Phone Verified
                  </span>
                  <Icons.CheckCircle2 className={`w-4 h-4 ${user.verified?.phone ? 'text-brand-primary' : 'text-slate-500'}`} />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#131314]/30 border border-[#2A2A2D] text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-2">
                    <Icons.CreditCard className="w-4 h-4 text-slate-500" />
                    Identity Verified
                  </span>
                  <Icons.CheckCircle2 className={`w-4 h-4 ${user.verified?.identity ? 'text-brand-primary' : 'text-slate-500'}`} />
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Listings Sub-Grid */}
        {activeTab === 'listings' && (
          userItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {userItems.map((item) => {
                const isWish = wishlist.some(w => w.id === item.id);
                return (
                  <Card key={item.id} className="flex flex-col h-full group" hoverable>
                    <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-[#131314]">
                      <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 p-3.5 flex flex-col justify-between pointer-events-none">
                        <div className="flex justify-between items-center w-full">
                          <Badge variant="info" className="backdrop-blur-md uppercase tracking-wider font-extrabold text-[9px] bg-[#0D0D0E]/85 border-[#2A2A2D]">
                            {item.category}
                          </Badge>
                          <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(item); }}
                            className="pointer-events-auto rounded-full bg-[#131314]/80 border border-[#2A2A2D] backdrop-blur-md p-2 hover:bg-[#131314] hover:text-white transition-colors"
                          >
                            <Icons.Heart className={`w-4 h-4 ${isWish ? 'fill-red-500 text-red-500' : 'text-slate-500'}`} />
                          </button>
                        </div>
                        <Badge variant={item.available ? 'success' : 'neutral'} className="backdrop-blur-md bg-[#0D0D0E]/85 border-[#2A2A2D] font-bold w-fit">
                          {item.available ? 'Available' : 'Lending'}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-between mt-4">
                      <div>
                        <h4 className="text-base font-bold text-white line-clamp-1">{item.title}</h4>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Icons.MapPin className="w-3 h-3" />{item.distance}</p>
                      </div>
                      <div className="flex items-center justify-between mt-5 pt-3.5 border-t border-[#2A2A2D]">
                        <p className="text-sm font-black text-white">₹{item.price} <span className="text-xs text-slate-500 font-normal">/ day</span></p>
                        <Link to={`/item/${item.id}`}><Button variant="outline" size="sm">Details</Button></Link>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <EmptyState icon="FolderHeart" title="No Listings" description="This user hasn't listed any items for sharing yet." />
          )
        )}

        {/* Reviews Center */}
        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Reviews list */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <Card key={rev.id} className="p-5 bg-[#1A1A1C] border-[#2A2A2D]/80 shadow-sm flex flex-col gap-3" hoverable={false}>
                    <div className="flex items-center justify-between border-b border-[#2A2A2D] pb-3">
                      <div className="flex items-center gap-3">
                        <Avatar src={rev.reviewerAvatar} alt={rev.reviewerName} size="sm" />
                        <div>
                          <h4 className="text-xs font-bold text-white">{rev.reviewerName}</h4>
                          <span className="text-[10px] text-slate-500 font-semibold">{rev.date}</span>
                        </div>
                      </div>
                      <Rating rating={rev.rating} size={3.5} readonly />
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-sans">{rev.comment}</p>
                  </Card>
                ))
              ) : (
                <EmptyState icon="Star" title="No Reviews Yet" description="Be the first to leave a feedback review for this member." />
              )}
            </div>

            {/* Leave a review box */}
            {!isSelf && currentUser && (
              <div className="lg:col-span-4">
                <Card className="p-5 bg-[#1A1A1C] border-[#2A2A2D]/80 shadow-sm flex flex-col gap-4 sticky top-24" hoverable={false}>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Leave a Review</h3>
                  
                  <form onSubmit={handleAddReview} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Trust rating</label>
                      <Rating rating={newRating} size={5} readonly={false} onChange={setNewRating} />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Review Message</label>
                      <textarea
                        rows={4}
                        placeholder="Write your experience sharing items with this community member..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full bg-[#131314] border border-[#2A2A2D] rounded-xl py-2 px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                        required
                      />
                    </div>

                    <Button type="submit" variant="primary" size="sm" className="w-full" loading={reviewLoading}>
                      Submit Feedback
                    </Button>
                  </form>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
