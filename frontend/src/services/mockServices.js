// mockServices.js - Frontend mocked API layer for BorrowIT

import {
  initialUsers,
  initialItems,
  initialRequests,
  initialReviews,
  initialNotifications,
  initialChats
} from './mockData';

// Helper to simulate network latency
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Keep local state in-memory so modifications persist during current session
let dbUsers = { ...initialUsers };
let dbItems = [...initialItems];
let dbRequests = [...initialRequests];
let dbReviews = [...initialReviews];
let dbNotifications = [...initialNotifications];
let dbChats = { ...initialChats };

export const mockServices = {
  // --- AUTH SERVICES ---
  login: async (email, password) => {
    await delay(800);
    // Standard mock verification
    const foundUser = Object.values(dbUsers).find(u => u.email === email);
    if (!foundUser) {
      throw new Error('User not found. Please sign up to create a new account.');
    }
    // Any password works for mock, but let's do a simple check
    if (password.length < 4) {
      throw new Error('Password must be at least 4 characters');
    }
    return { ...foundUser };
  },

  register: async (fullName, email, password) => {
    await delay(1000);
    const exists = Object.values(dbUsers).some(u => u.email === email);
    if (exists) {
      throw new Error('User with this email already exists');
    }
    const newId = `user-${Date.now()}`;
    const newUser = {
      id: newId,
      name: fullName,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${fullName}`,
      location: 'Bangalore, Karnataka',
      distance: '0 km',
      memberSince: 'Jun 2026',
      listingsCount: 0,
      borrowedCount: 0,
      lentCount: 0,
      trustScore: 5.0,
      bio: `Hello! I am ${fullName}. Excited to join BorrowIT!`,
      email: email,
      phone: '',
      verified: { email: true, phone: false, identity: false }
    };
    dbUsers[newId] = newUser;
    return newUser;
  },

  socialAuth: async (provider) => {
    await delay(1000);
    // TODO: Connect to backend social auth endpoint (e.g. POST /api/auth/social) passing the OAuth credentials/token.
    // Example:
    // const response = await fetch('/api/auth/social', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ provider, token: 'OAUTH_TOKEN_HERE' })
    // });
    // if (!response.ok) throw new Error('Social auth failed');
    // return await response.json();

    const newId = `user-social-${Date.now()}`;
    const newUser = {
      id: newId,
      name: `${provider} User`,
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${provider}_${Date.now()}`,
      location: 'Bangalore, Karnataka',
      distance: '0 km',
      memberSince: 'Jul 2026',
      listingsCount: 0,
      borrowedCount: 0,
      lentCount: 0,
      trustScore: 5.0,
      bio: `Hello! I am logged in using ${provider} Sign-In.`,
      email: `${provider.toLowerCase()}.user@example.com`,
      phone: '',
      verified: { email: true, phone: false, identity: false }
    };
    dbUsers[newId] = newUser;
    return newUser;
  },

  resetPassword: async (email) => {
    await delay(600);
    const exists = Object.values(dbUsers).some(u => u.email === email);
    if (!exists) {
      throw new Error('Email address not registered');
    }
    return true;
  },

  // --- ITEM SERVICES ---
  fetchItems: async ({ query = '', category = 'all', filters = {}, sort = 'latest' } = {}) => {
    await delay(600);
    let items = dbItems.map(item => {
      const owner = dbUsers[item.ownerId] || { name: 'Unknown', avatar: '', trustScore: 0 };
      return { ...item, owner };
    });

    // Apply category filter
    if (category && category !== 'all') {
      items = items.filter(item => item.category === category);
    }

    // Apply search query
    if (query) {
      const q = query.toLowerCase();
      items = items.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.description.toLowerCase().includes(q)
      );
    }

    // Apply location/distance filter (calculated via Haversine if coords available)
    if (filters.userCoords) {
      const calculateDistance = (lat1, lon1, lat2, lon2) => {
        if (!lat1 || !lon1 || !lat2 || !lon2) return null;
        const R = 6371; // Earth radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
      };

      items = items.map(item => {
        const dist = calculateDistance(filters.userCoords.latitude, filters.userCoords.longitude, item.latitude || 12.9716, item.longitude || 77.5946);
        return {
          ...item,
          distance: dist !== null ? `${dist.toFixed(1)} km away` : item.distance,
          distanceVal: dist !== null ? dist : parseFloat(item.distance) || 999
        };
      });

      if (filters.distance && filters.distance !== 'all') {
        const maxDistance = parseFloat(filters.distance);
        items = items.filter(item => (item.distanceVal || 999) <= maxDistance);
      }
    } else {
      if (filters.distance && filters.distance !== 'all') {
        const maxDistance = parseFloat(filters.distance);
        items = items.filter(item => {
          const dist = parseFloat(item.distance) || 0.5;
          return dist <= maxDistance;
        });
      }
    }

    // Apply availability filter
    if (filters.availability && filters.availability !== 'all') {
      const showAvailable = filters.availability === 'available';
      items = items.filter(item => item.available === showAvailable);
    }

    // Apply price filter
    if (filters.priceMin) {
      items = items.filter(item => item.price >= parseFloat(filters.priceMin));
    }
    if (filters.priceMax) {
      items = items.filter(item => item.price <= parseFloat(filters.priceMax));
    }

    // Sorting
    if (sort === 'distance') {
      items.sort((a, b) => {
        const distA = a.distanceVal !== undefined ? a.distanceVal : parseFloat(a.distance) || 999;
        const distB = b.distanceVal !== undefined ? b.distanceVal : parseFloat(b.distance) || 999;
        return distA - distB;
      });
    } else if (sort === 'latest') {
      items.reverse();
    } else if (sort === 'price-low') {
      items.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      items.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      items.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'distance') {
      items.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    }

    return items;
  },

  fetchItemById: async (id) => {
    await delay(400);
    const item = dbItems.find(i => i.id === id);
    if (!item) throw new Error('Item not found');
    const owner = dbUsers[item.ownerId];
    return { ...item, owner };
  },

  createItem: async (itemData, ownerId) => {
    await delay(800);
    const newItem = {
      id: `item-${Date.now()}`,
      ...itemData,
      ownerId,
      available: true,
      views: 0,
      requestsCount: 0,
      rating: 5.0,
      distance: '1.5 km', // Mock location close by
      images: itemData.images && itemData.images.length > 0 
        ? itemData.images 
        : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'] // Placeholder smartwatch
    };
    dbItems.push(newItem);
    if (dbUsers[ownerId]) {
      dbUsers[ownerId].listingsCount += 1;
    }
    return newItem;
  },

  editItem: async (itemId, updatedFields) => {
    await delay(600);
    dbItems = dbItems.map(item => {
      if (item.id === itemId) {
        return { ...item, ...updatedFields };
      }
      return item;
    });
    return dbItems.find(item => item.id === itemId);
  },

  deleteItem: async (itemId, ownerId) => {
    await delay(500);
    dbItems = dbItems.filter(item => item.id !== itemId);
    if (dbUsers[ownerId] && dbUsers[ownerId].listingsCount > 0) {
      dbUsers[ownerId].listingsCount -= 1;
    }
    return true;
  },

  toggleAvailability: async (itemId) => {
    await delay(300);
    let updatedVal = false;
    dbItems = dbItems.map(item => {
      if (item.id === itemId) {
        updatedVal = !item.available;
        return { ...item, available: updatedVal };
      }
      return item;
    });
    return updatedVal;
  },

  // --- BORROW REQUEST SERVICES ---
  fetchRequests: async (userId) => {
    await delay(500);
    // Returns requests relevant to this user (incoming & outgoing)
    return dbRequests.map(req => {
      const item = dbItems.find(i => i.id === req.itemId);
      const borrower = dbUsers[req.borrowerId];
      const owner = dbUsers[req.ownerId];
      return {
        ...req,
        item,
        borrower,
        owner
      };
    });
  },

  createRequest: async ({ itemId, startDate, endDate, totalPrice, borrowerId }) => {
    await delay(800);
    const item = dbItems.find(i => i.id === itemId);
    if (!item) throw new Error('Item not found');
    const owner = dbUsers[item.ownerId];
    const borrower = dbUsers[borrowerId];

    const newRequest = {
      id: `req-${Date.now()}`,
      itemId,
      itemName: item.title,
      itemImage: item.images[0],
      borrowerId,
      borrowerName: borrower.name,
      borrowerAvatar: borrower.avatar,
      ownerId: item.ownerId,
      ownerName: owner.name,
      startDate,
      endDate,
      totalPrice,
      status: 'Pending',
      requestedDate: new Date().toISOString().split('T')[0],
      type: 'outgoing'
    };

    dbRequests.push(newRequest);

    // Push notification to owner
    const newNotif = {
      id: `notif-${Date.now()}`,
      title: 'Borrow Request Received',
      message: `${borrower.name} requested to borrow your ${item.title}.`,
      time: 'Just now',
      type: 'borrow',
      read: false
    };
    dbNotifications.unshift(newNotif);

    return newRequest;
  },

  updateRequestStatus: async (requestId, status) => {
    await delay(600);
    let targetReq = null;
    dbRequests = dbRequests.map(req => {
      if (req.id === requestId) {
        targetReq = { ...req, status };
        // If request is accepted, make the item unavailable
        if (status === 'Accepted') {
          dbItems = dbItems.map(item => {
            if (item.id === req.itemId) {
              return { ...item, available: false };
            }
            return item;
          });
        } else if (status === 'Returned' || status === 'Declined') {
          dbItems = dbItems.map(item => {
            if (item.id === req.itemId) {
              return { ...item, available: true };
            }
            return item;
          });
        }
        return targetReq;
      }
      return req;
    });

    if (!targetReq) throw new Error('Request not found');

    // Send notifications to borrower
    const notifTitle = status === 'Accepted' ? 'Request Accepted' : status === 'Declined' ? 'Request Declined' : 'Return Completed';
    const notifMessage = status === 'Accepted' 
      ? `Your request for ${targetReq.itemName} has been accepted.` 
      : status === 'Declined' 
        ? `Your request for ${targetReq.itemName} was declined.` 
        : `Your return of ${targetReq.itemName} was successfully checked.`;
        
    dbNotifications.unshift({
      id: `notif-${Date.now()}`,
      title: notifTitle,
      message: notifMessage,
      time: 'Just now',
      type: status === 'Accepted' ? 'lend' : 'system',
      read: false
    });

    return targetReq;
  },

  // --- USER PROFILE SERVICES ---
  fetchProfile: async (userId) => {
    await delay(400);
    const user = dbUsers[userId];
    if (!user) throw new Error('User profile not found');
    return { ...user };
  },

  editProfile: async (userId, profileFields) => {
    await delay(800);
    if (!dbUsers[userId]) throw new Error('User not found');
    dbUsers[userId] = { ...dbUsers[userId], ...profileFields };
    return { ...dbUsers[userId] };
  },

  // --- REVIEW SERVICES ---
  fetchReviews: async (userId) => {
    await delay(400);
    return dbReviews.filter(r => r.userReviewedId === userId);
  },

  addReview: async ({ itemId, reviewerName, reviewerAvatar, rating, comment, userReviewedId }) => {
    await delay(600);
    const newReview = {
      id: `rev-${Date.now()}`,
      itemId,
      reviewerName,
      reviewerAvatar,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
      userReviewedId
    };
    dbReviews.push(newReview);

    // Update target user trust score
    const userReviews = dbReviews.filter(r => r.userReviewedId === userReviewedId);
    const average = userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length;
    if (dbUsers[userReviewedId]) {
      dbUsers[userReviewedId].trustScore = parseFloat(average.toFixed(1));
    }

    return newReview;
  },

  // --- MESSAGE SERVICES ---
  fetchChatContacts: async (currentUserId) => {
    await delay(300);
    if (!currentUserId) return [];
    
    // Find all chat keys that include currentUserId
    const relevantKeys = Object.keys(dbChats).filter(key => 
      key.split('_').includes(currentUserId)
    );

    return relevantKeys.map(key => {
      const parts = key.split('_');
      const contactId = parts.find(id => id !== currentUserId);
      const contact = dbUsers[contactId] || { name: 'User', avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${contactId}` };
      const chatMessages = dbChats[key];
      const lastMsg = chatMessages[chatMessages.length - 1];
      
      return {
        contactId,
        name: contact.name,
        avatar: contact.avatar,
        lastMessage: lastMsg ? lastMsg.text : '',
        time: lastMsg ? lastMsg.time : '',
        unread: lastMsg ? (lastMsg.senderId !== currentUserId && lastMsg.status !== 'read') : false
      };
    });
  },

  fetchMessages: async (contactId, currentUserId) => {
    await delay(300);
    if (!contactId || !currentUserId) return [];
    const chatKey = [contactId, currentUserId].sort().join('_');
    const history = dbChats[chatKey] || [];
    
    // Mark incoming messages as read when fetched
    dbChats[chatKey] = history.map(msg => {
      if (msg.senderId !== currentUserId && msg.status !== 'read') {
        return { ...msg, status: 'read' };
      }
      return msg;
    });

    return dbChats[chatKey];
  },

  sendMessage: async (contactId, senderId, text, onAutoReply) => {
    await delay(200);
    const chatKey = [contactId, senderId].sort().join('_');
    const newMsg = {
      id: `m-${Date.now()}`,
      senderId,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    if (!dbChats[chatKey]) {
      dbChats[chatKey] = [];
    }
    dbChats[chatKey].push(newMsg);

    // Simulate network delivery to mark it 'delivered' after 600ms
    setTimeout(() => {
      if (dbChats[chatKey]) {
        dbChats[chatKey] = dbChats[chatKey].map(m => 
          m.id === newMsg.id ? { ...m, status: 'delivered' } : m
        );
      }
    }, 600);

    // Trigger auto reply bot ONLY if the recipient user doesn't actually exist (e.g. system bot)
    const isRealUser = dbUsers[contactId] !== undefined;
    if (!isRealUser) {
      setTimeout(() => {
        const autoReplyMsg = {
          id: `m-bot-${Date.now()}`,
          senderId: contactId,
          text: `Hi! I'm a neighborhood helper bot. Thanks for reaching out about this! I will notify the owner.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'delivered'
        };
        dbChats[chatKey].push(autoReplyMsg);
        if (onAutoReply) onAutoReply(autoReplyMsg);
      }, 2000);
    }

    return newMsg;
  },

  // --- NOTIFICATION SERVICES ---
  fetchNotifications: async () => {
    await delay(300);
    return [...dbNotifications];
  },

  markNotificationsRead: async () => {
    dbNotifications = dbNotifications.map(n => ({ ...n, read: true }));
    return [...dbNotifications];
  },

  clearNotifications: async () => {
    dbNotifications = [];
    return [];
  }
};
