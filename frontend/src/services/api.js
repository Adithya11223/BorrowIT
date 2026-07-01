// api.js - Production connection service layer mapping frontend requests to Spring Boot / PostgreSQL endpoints

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:1026/api';

const getHeaders = () => {
  const token = localStorage.getItem('borrowit_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // --- AUTH ENDPOINTS ---
  login: async (email, password) => {
    const res = await fetch(`${BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Invalid credentials' }));
      throw new Error(err.message || 'Login failed');
    }
    const data = await res.json();
    localStorage.setItem('borrowit_token', data.token);
    return {
      id: data.user.id,
      name: data.user.fullName,
      email: data.user.email,
      phone: data.user.phoneNumber,
      trustScore: data.user.trustScore / 10.0,
      verified: data.user.verified,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${data.user.id}`
    };
  },

  register: async (fullName, email, password, phoneNumber = "9999999999") => {
    const res = await fetch(`${BASE_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password, phoneNumber })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Registration failed' }));
      throw new Error(err.message || 'Registration failed');
    }
    return api.login(email, password);
  },

  socialLogin: async (provider) => {
    const email = `${provider.toLowerCase()}.user@example.com`;
    const fullName = `${provider} User`;
    const phoneNumber = "9999999999";
    const password = "social_password_123";
    try {
      return await api.login(email, password);
    } catch {
      return await api.register(fullName, email, password, phoneNumber);
    }
  },

  editProfile: async (userId, fullName, email, phoneNumber) => {
    const res = await fetch(`${BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ fullName, email, phoneNumber })
    });
    if (!res.ok) throw new Error('Failed to update profile');
    const data = await res.json();
    return {
      id: data.id,
      name: data.fullName,
      email: data.email,
      phone: data.phoneNumber,
      trustScore: data.trustScore / 10.0,
      verified: data.verified,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${data.id}`
    };
  },

  getUser: async (userId) => {
    const res = await fetch(`${BASE_URL}/users/${userId}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('User not found');
    return res.json();
  },

  // --- ITEM ENDPOINTS ---
  fetchItems: async ({ query, category, filters, sort } = {}) => {
    let url = `${BASE_URL}/items`;
    if (query) {
      url = `${BASE_URL}/items/search?keyword=${encodeURIComponent(query)}`;
    } else if (category && category !== 'all') {
      url = `${BASE_URL}/items/filter?category=${encodeURIComponent(category)}`;
    }

    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch items');
    let list = await res.json();

    let items = list.map(item => ({
      id: item.id,
      title: item.itemName,
      description: item.description,
      price: item.pricePerDay,
      deposit: item.deposit,
      category: item.category,
      location: item.location,
      available: item.available,
      condition: item.itemCondition || 'Good',
      latitude: item.latitude || 12.9716,
      longitude: item.longitude || 77.5946,
      images: item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
      ownerId: item.ownerId,
      ownerName: item.ownerName,
      owner: item.owner ? {
        id: item.owner.id,
        name: item.owner.fullName,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${item.owner.id}`,
        trustScore: item.owner.trustScore / 10.0
      } : {
        id: item.ownerId,
        name: item.ownerName,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${item.ownerId}`,
        trustScore: 4.5
      },
      rating: 4.8,
      reviewsCount: 12
    }));

    if (filters && filters.userCoords) {
      const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // km
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
        const dist = calculateDistance(filters.userCoords.latitude, filters.userCoords.longitude, item.latitude, item.longitude);
        return {
          ...item,
          distance: `${dist.toFixed(1)} km away`,
          distanceVal: dist
        };
      });

      if (filters.distance && filters.distance !== 'all') {
        const maxDist = parseFloat(filters.distance);
        items = items.filter(item => item.distanceVal <= maxDist);
      }
    } else {
      items = items.map(item => ({
        ...item,
        distance: '0.8 km away',
        distanceVal: 0.8
      }));
    }

    if (filters && filters.availability && filters.availability !== 'all') {
      const showAvail = filters.availability === 'available';
      items = items.filter(item => item.available === showAvail);
    }

    if (sort === 'price-low') {
      items.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      items.sort((a, b) => b.price - a.price);
    } else if (sort === 'distance') {
      items.sort((a, b) => a.distanceVal - b.distanceVal);
    }

    return items;
  },

  createItem: async (itemData) => {
    const body = {
      itemName: itemData.title,
      description: itemData.description,
      pricePerDay: itemData.price,
      category: itemData.category,
      location: itemData.location,
      deposit: itemData.deposit ? parseFloat(itemData.deposit) : 0.0,
      itemCondition: itemData.condition,
      latitude: itemData.latitude || 12.9716,
      longitude: itemData.longitude || 77.5946,
      imageUrls: itemData.images
    };

    const res = await fetch(`${BASE_URL}/items`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('Failed to create item listing');
    return res.json();
  },

  editItem: async (itemId, itemData) => {
    const body = {
      itemName: itemData.title,
      description: itemData.description,
      pricePerDay: itemData.price,
      category: itemData.category,
      location: itemData.location,
      deposit: itemData.deposit ? parseFloat(itemData.deposit) : 0.0,
      itemCondition: itemData.condition,
      latitude: itemData.latitude || 12.9716,
      longitude: itemData.longitude || 77.5946,
      imageUrls: itemData.images
    };
    const res = await fetch(`${BASE_URL}/items/${itemId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('Failed to update item');
    return res.json();
  },

  deleteItem: async (itemId) => {
    const res = await fetch(`${BASE_URL}/items/${itemId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete item');
  },

  // --- BORROW REQUEST ENDPOINTS ---
  sendBorrowRequest: async (itemId, startDate, endDate) => {
    const body = {
      itemId,
      borrowDate: startDate,
      returnDate: endDate
    };
    const res = await fetch(`${BASE_URL}/borrow`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Borrow request failed' }));
      throw new Error(err.message || 'Borrow request failed');
    }
    return res.json();
  },

  fetchBorrowRequests: async () => {
    const sentRes = await fetch(`${BASE_URL}/borrow/my`, { headers: getHeaders() });
    const receivedRes = await fetch(`${BASE_URL}/borrow/received`, { headers: getHeaders() });
    
    if (!sentRes.ok || !receivedRes.ok) throw new Error('Failed to load borrow requests');
    
    const sent = await sentRes.json();
    const received = await receivedRes.json();

    const mapRequest = (req, type) => ({
      id: req.requestId,
      itemId: req.itemId,
      itemName: req.itemName,
      borrowerName: req.borrowerName,
      ownerName: req.ownerName,
      startDate: req.borrowDate,
      endDate: req.returnDate,
      status: req.status,
      type
    });

    return [
      ...sent.map(r => mapRequest(r, 'sent')),
      ...received.map(r => mapRequest(r, 'received'))
    ];
  },

  handleRequestStatus: async (requestId, action) => {
    const res = await fetch(`${BASE_URL}/borrow/${requestId}/${action}`, {
      method: 'PUT',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error(`Failed to ${action} request`);
    return res.json();
  },

  // --- CHAT ENDPOINTS ---
  fetchChatContacts: async () => {
    const res = await fetch(`${BASE_URL}/chats/contacts`, { headers: getHeaders() });
    if (!res.ok) return [];
    return res.json();
  },

  fetchMessages: async (contactId) => {
    const res = await fetch(`${BASE_URL}/chats/history?contactId=${contactId}`, { headers: getHeaders() });
    if (!res.ok) return [];
    const list = await res.json();
    return list.map(msg => ({
      id: msg.id,
      senderId: msg.sender.id,
      text: msg.content,
      time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: msg.status
    }));
  },

  sendMessage: async (contactId, text) => {
    const res = await fetch(`${BASE_URL}/chats/send`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ recipientId: contactId, content: text })
    });
    if (!res.ok) throw new Error('Failed to send message');
    const msg = await res.json();
    return {
      id: msg.id,
      senderId: msg.sender.id,
      text: msg.content,
      time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: msg.status
    };
  },

  // --- NOTIFICATION ENDPOINTS ---
  fetchNotifications: async () => {
    const res = await fetch(`${BASE_URL}/notifications`, { headers: getHeaders() });
    if (!res.ok) return [];
    const list = await res.json();
    return list.map(n => ({
      id: n.id,
      title: n.title,
      message: n.message,
      time: new Date(n.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      read: n.read
    }));
  },

  markNotificationsRead: async () => {
    const res = await fetch(`${BASE_URL}/notifications/read`, { method: 'PUT', headers: getHeaders() });
    if (!res.ok) return [];
    const list = await res.json();
    return list.map(n => ({
      id: n.id,
      title: n.title,
      message: n.message,
      time: new Date(n.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      read: n.read
    }));
  },

  clearNotifications: async () => {
    await fetch(`${BASE_URL}/notifications`, { method: 'DELETE', headers: getHeaders() });
    return [];
  }
};
