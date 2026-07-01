// AppContext.jsx - Global Application State Provider linking BorrowIT frontend views to api.js network requester

import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [items, setItems] = useState([]);
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Authentication status on start
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true);

        // Read user session from localStorage
        const storedUser = localStorage.getItem('borrowit_user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setCurrentUser(parsedUser);
          
          // Fetch user-specific requests from Spring backend
          try {
            const userReqs = await api.fetchBorrowRequests();
            setRequests(userReqs);
          } catch (err) {
            console.error("Requests fetch error:", err);
          }
        }

        // Fetch initial items catalog
        try {
          const initialItemsList = await api.fetchItems();
          setItems(initialItemsList);
        } catch (err) {
          console.error("Items load error:", err);
        }

        // Fetch user notifications
        try {
          const initialNotifs = await api.fetchNotifications();
          setNotifications(initialNotifs);
        } catch (err) {
          console.error("Notifications load error:", err);
        }

        // Read wishlist from localStorage if exists
        const storedWishlist = localStorage.getItem('borrowit_wishlist');
        if (storedWishlist) {
          setWishlist(JSON.parse(storedWishlist));
        }

      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  // --- TOAST SERVICE ---
  const addToast = (title, message, type = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // --- AUTH WRAPPERS ---
  const login = async (email, password) => {
    try {
      const user = await api.login(email, password);
      setCurrentUser(user);
      localStorage.setItem('borrowit_user', JSON.stringify(user));
      
      const userReqs = await api.fetchBorrowRequests();
      setRequests(userReqs);
      
      addToast('Success', `Welcome back, ${user.name}!`, 'success');
      return user;
    } catch (err) {
      addToast('Error', err.message, 'error');
      throw err;
    }
  };

  const register = async (fullName, email, password) => {
    try {
      const user = await api.register(fullName, email, password);
      setCurrentUser(user);
      localStorage.setItem('borrowit_user', JSON.stringify(user));
      setRequests([]);
      addToast('Success', `Account created! Welcome, ${fullName}`, 'success');
      return user;
    } catch (err) {
      addToast('Error', err.message, 'error');
      throw err;
    }
  };

  const socialLogin = async (provider) => {
    try {
      const user = await api.socialLogin(provider);
      setCurrentUser(user);
      localStorage.setItem('borrowit_user', JSON.stringify(user));
      setRequests([]);
      addToast('Success', `Logged in successfully via ${provider}!`, 'success');
      return user;
    } catch (err) {
      addToast('Error', err.message, 'error');
      throw err;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('borrowit_user');
    localStorage.removeItem('borrowit_token');
    setRequests([]);
    addToast('Goodbye', 'You have successfully signed out.', 'info');
  };

  const editProfile = async (profileData) => {
    if (!currentUser) return;
    try {
      const updatedUser = await api.editProfile(currentUser.id, profileData.fullName, profileData.email, profileData.phoneNumber);
      setCurrentUser(updatedUser);
      localStorage.setItem('borrowit_user', JSON.stringify(updatedUser));
      addToast('Success', 'Profile updated successfully', 'success');
    } catch (err) {
      addToast('Error', err.message, 'error');
    }
  };

  // --- ITEMS WRAPPERS ---
  const loadItems = async (params) => {
    try {
      const list = await api.fetchItems(params);
      setItems(list);
      return list;
    } catch (err) {
      addToast('Error', 'Failed to load items', 'error');
    }
  };

  const createItem = async (itemData) => {
    if (!currentUser) return;
    try {
      const newItem = await api.createItem(itemData);
      await loadItems();
      addToast('Success', `Item "${itemData.title}" listed successfully!`, 'success');
      return newItem;
    } catch (err) {
      addToast('Error', err.message, 'error');
    }
  };

  const editItem = async (itemId, updatedData) => {
    try {
      const updated = await api.editItem(itemId, updatedData);
      await loadItems();
      addToast('Success', 'Item listing updated', 'success');
      return updated;
    } catch (err) {
      addToast('Error', err.message, 'error');
    }
  };

  const deleteItem = async (itemId) => {
    if (!currentUser) return;
    try {
      await api.deleteItem(itemId);
      setItems(prev => prev.filter(item => item.id !== itemId));
      addToast('Deleted', 'Item has been removed.', 'info');
    } catch (err) {
      addToast('Error', err.message, 'error');
    }
  };

  const toggleAvailability = async (itemId) => {
    try {
      const item = items.find(i => i.id === itemId);
      if (!item) return;
      
      const newVal = !item.available;
      await api.editItem(itemId, {
        title: item.title,
        description: item.description,
        price: item.price,
        category: item.category,
        location: item.location,
        deposit: item.deposit,
        condition: item.condition,
        images: item.images,
        available: newVal
      });
      await loadItems();
      addToast(
        newVal ? 'Available' : 'Unavailable', 
        `Item status set to ${newVal ? 'Available' : 'Unavailable'}.`, 
        'info'
      );
    } catch (err) {
      addToast('Error', 'Failed to toggle availability', 'error');
    }
  };

  // --- REQUESTS WRAPPERS ---
  const sendBorrowRequest = async (itemId, startDate, endDate) => {
    if (!currentUser) {
      addToast('Authentication Required', 'Please log in to borrow items.', 'error');
      return;
    }
    try {
      const newReq = await api.sendBorrowRequest(itemId, startDate, endDate);
      const userReqs = await api.fetchBorrowRequests();
      setRequests(userReqs);
      addToast('Request Sent', 'Borrow request submitted to item owner!', 'success');
      
      const notifs = await api.fetchNotifications();
      setNotifications(notifs);
      
      return newReq;
    } catch (err) {
      addToast('Error', err.message, 'error');
    }
  };

  const handleRequestStatus = async (requestId, status) => {
    try {
      let apiAction = 'approve';
      if (status === 'Declined') apiAction = 'reject';
      else if (status === 'Returned') apiAction = 'return';

      await api.handleRequestStatus(requestId, apiAction);
      
      const userReqs = await api.fetchBorrowRequests();
      setRequests(userReqs);
      
      const notifs = await api.fetchNotifications();
      setNotifications(notifs);
      
      await loadItems();
      
      let msg = '';
      if (status === 'Accepted') msg = 'Request approved! Coordinate pickup.';
      else if (status === 'Declined') msg = 'Request declined.';
      else if (status === 'Returned') msg = 'Item returned successfully!';
      
      addToast(status, msg, status === 'Accepted' ? 'success' : 'info');
    } catch (err) {
      addToast('Error', err.message, 'error');
    }
  };

  // --- WISHLIST ---
  const toggleWishlist = (item) => {
    let updated;
    const isExist = wishlist.some(i => i.id === item.id);
    if (isExist) {
      updated = wishlist.filter(i => i.id !== item.id);
      addToast('Removed', `${item.title} removed from wishlist.`, 'info');
    } else {
      updated = [...wishlist, item];
      addToast('Added', `${item.title} added to wishlist!`, 'success');
    }
    setWishlist(updated);
    localStorage.setItem('borrowit_wishlist', JSON.stringify(updated));
  };

  // --- NOTIFICATIONS WRAPPERS ---
  const markAllNotificationsAsRead = async () => {
    try {
      const list = await api.markNotificationsRead();
      setNotifications(list);
    } catch (err) {
      console.error(err);
    }
  };

  const clearAllNotifications = async () => {
    try {
      const list = await api.clearNotifications();
      setNotifications(list);
      addToast('Cleared', 'Notifications cleared.', 'info');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      items,
      requests,
      notifications,
      wishlist,
      toasts,
      loading,
      login,
      register,
      socialLogin,
      logout,
      editProfile,
      loadItems,
      createItem,
      editItem,
      deleteItem,
      toggleAvailability,
      sendBorrowRequest,
      handleRequestStatus,
      toggleWishlist,
      markAllNotificationsAsRead,
      clearAllNotifications,
      addToast,
      removeToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
export default AppContext;
