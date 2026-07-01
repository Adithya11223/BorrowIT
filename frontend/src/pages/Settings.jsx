// Settings.jsx - Profile manager & configuration page for BorrowIT

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button, Card, Input } from '../components/UI';
import * as Icons from 'lucide-react';

export default function Settings() {
  const { currentUser, editProfile } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [location, setLocation] = useState(currentUser?.location || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      setLoading(true);
      await editProfile({
        name,
        bio,
        location,
        phone,
        avatar
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-white">Account Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage public profile attributes and contact details.</p>
      </div>

      <Card className="p-6 bg-[#1A1A1C] border-[#2A2A2D]/80 shadow-sm" hoverable={false}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-xl">
          
          <Input
            label="Full Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon="User"
            required
          />

          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Biography</label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell neighbors a bit about yourself, hobbies, or what type of gear you own..."
              className="w-full bg-[#131314] border border-[#2A2A2D] focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none transition-all duration-200 resize-none font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              icon="MapPin"
            />

            <Input
              label="Phone Number"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              icon="Phone"
              placeholder="+91 99999 88888"
            />
          </div>

          <Input
            label="Avatar Image URL (Mock Upload)"
            type="text"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            icon="Image"
            placeholder="https://images.unsplash.com/photo-..."
          />

          <div className="border-t border-[#2A2A2D] pt-5 mt-2 flex justify-end">
            <Button
              type="submit"
              variant="glow"
              loading={loading}
              icon="Save"
            >
              Save Profile Changes
            </Button>
          </div>

        </form>
      </Card>
      
    </div>
  );
}
