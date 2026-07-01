import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';
import { mockServices } from '../services/mockServices';

const AppContext = createContext();

const isNetworkError = (err) => {
  return err && err.message && (
    err.message.toLowerCase().includes('failed to fetch') || 
    err.message.toLowerCase().includes('networkerror') || 
    err.message.toLowerCase().includes('cors') ||
    err.message.toLowerCase().includes('typeerror')
  );
};

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
            if (isNetworkError(err)) {
              console.log("Loading mock requests");
              const userReqs = await mockServices.fetchBorrowRequests();
              setRequests(userReqs);
            }
          }
        }

        // Fetch initial items catalog
        try {
          const initialItemsList = await api.fetchItems();
          setItems(initialItemsList);
        } catch (err) {
          console.error("Items load error:", err);
          if (isNetworkError(err)) {
            console.log("Loading mock items catalog");
            const initialItemsList = await mockServices.fetchItems();
            setItems(initialItemsList);
          }
        }

        // Fetch user notifications
        try {
          const initialNotifs = await api.fetchNotifications();
          setNotifications(initialNotifs);
        } catch (err) {
          console.error("Notifications load error:", err);
          if (isNetworkError(err)) {
            console.log("Loading mock notifications");
            const initialNotifs = await mockServices.fetchNotifications();
            setNotifications(initialNotifs);
          }
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
      if (isNetworkError(err)) {
        console.warn("Backend down, falling back to mock login");
        const user = await mockServices.login(email, password);
        setCurrentUser(user);
        localStorage.setItem('borrowit_user', JSON.stringify(user));
        
        const userReqs = await mockServices.fetchBorrowRequests();
        setRequests(userReqs);
        
        addToast('Demo Mode', `Logged in locally as ${user.name}`, 'success');
        return user;
      }
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
      if (isNetworkError(err)) {
        console.warn("Backend down, falling back to mock registration");
        const user = await mockServices.register(fullName, email, password);
        setCurrentUser(user);
        localStorage.setItem('borrowit_user', JSON.stringify(user));
        setRequests([]);
        addToast('Demo Mode', `Account created locally for ${fullName}!`, 'success');
        return user;
      }
      addToast('Error', err.message, 'error');
      throw err;
    }
  };

  const completeSignupSession = async (token, user) => {
    localStorage.setItem('borrowit_token', token);
    const mappedUser = {
      ...user,
      name: user.fullName
    };
    setCurrentUser(mappedUser);
    localStorage.setItem('borrowit_user', JSON.stringify(mappedUser));
    try {
      const userReqs = await api.fetchBorrowRequests();
      setRequests(userReqs);
    } catch {
      setRequests([]);
    }
    addToast('Success', `Account created! Welcome, ${mappedUser.name}`, 'success');
    return mappedUser;
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
      console.warn("Backend down, falling back to mock social login");
      const user = await mockServices.socialAuth(provider);
      setCurrentUser(user);
      localStorage.setItem('borrowit_user', JSON.stringify(user));
      setRequests([]);
      addToast('Demo Mode', `Signed in locally via ${provider}!`, 'success');
      return user;
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
      if (isNetworkError(err)) {
        console.warn("Backend down, updating profile locally");
        const updatedUser = {
          ...currentUser,
          name: profileData.fullName,
          email: profileData.email,
          phone: profileData.phoneNumber
        };
        setCurrentUser(updatedUser);
        localStorage.setItem('borrowit_user', JSON.stringify(updatedUser));
        addToast('Success (Demo Mode)', 'Profile updated locally', 'success');
        return;
      }
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
      if (isNetworkError(err)) {
        console.warn("Backend down, loading mock items");
        const list = await mockServices.fetchItems(params);
        setItems(list);
        return list;
      }
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
      if (isNetworkError(err)) {
        console.warn("Backend down, creating item locally");
        const newItem = await mockServices.createItem(itemData);
        newItem.ownerId = currentUser.id;
        newItem.ownerName = currentUser.name;
        newItem.owner = {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          trustScore: currentUser.trustScore
        };
        setItems(prev => [newItem, ...prev]);
        addToast('Success (Demo Mode)', `Item "${itemData.title}" listed locally!`, 'success');
        return newItem;
      }
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
      if (isNetworkError(err)) {
        console.warn("Backend down, editing item locally");
        const updated = await mockServices.editItem(itemId, updatedData);
        setItems(prev => prev.map(item => item.id === itemId ? { ...item, ...updatedData } : item));
        addToast('Success (Demo Mode)', 'Item listing updated locally', 'success');
        return updated;
      }
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
      if (isNetworkError(err)) {
        console.warn("Backend down, deleting item locally");
        await mockServices.deleteItem(itemId);
        setItems(prev => prev.filter(item => item.id !== itemId));
        addToast('Deleted (Demo Mode)', 'Item has been removed locally.', 'info');
        return;
      }
      addToast('Error', err.message, 'error');
    }
  };

  const toggleAvailability = async (itemId) => {
    try {
      const item = items.find(i => i.id === itemId);
      if (!item) return;
      
      const newVal = !item.available;
      try {
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
      } catch (err) {
        if (!isNetworkError(err)) throw err;
        console.warn("Backend down, toggling availability locally");
        await mockServices.editItem(itemId, { available: newVal });
      }
      
      setItems(prev => prev.map(i => i.id === itemId ? { ...i, available: newVal } : i));
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
      if (isNetworkError(err)) {
        console.warn("Backend down, submitting request locally");
        const newReq = await mockServices.sendBorrowRequest(itemId, startDate, endDate);
        const item = items.find(i => i.id === itemId);
        const mappedReq = {
          id: newReq.id,
          itemId: itemId,
          itemName: item ? item.title : 'Item',
          borrowerName: currentUser.name,
          ownerName: item ? item.ownerName : 'Owner',
          startDate: startDate,
          endDate: endDate,
          status: 'PENDING',
          type: 'sent'
        };
        setRequests(prev => [mappedReq, ...prev]);
        addToast('Request Sent (Demo Mode)', 'Borrow request submitted locally!', 'success');
        return mappedReq;
      }
      addToast('Error', err.message, 'error');
    }
  };

  const handleRequestStatus = async (requestId, status) => {
    try {
      let apiAction = 'approve';
      if (status === 'Declined') apiAction = 'reject';
      else if (status === 'Returned') apiAction = 'return';

      try {
        await api.handleRequestStatus(requestId, apiAction);
        const userReqs = await api.fetchBorrowRequests();
        setRequests(userReqs);
        const notifs = await api.fetchNotifications();
        setNotifications(notifs);
        await loadItems();
      } catch (err) {
        if (!isNetworkError(err)) throw err;
        console.warn("Backend down, handling request status locally");
        await mockServices.handleRequestStatus(requestId, apiAction);
        setRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: status.toUpperCase() } : req));
      }
      
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
      if (isNetworkError(err)) {
        console.warn("Backend down, marking notifications read locally");
        const list = await mockServices.markNotificationsRead();
        setNotifications(list);
        return;
      }
      console.error(err);
    }
  };

  const clearAllNotifications = async () => {
    try {
      const list = await api.clearNotifications();
      setNotifications(list);
      addToast('Cleared', 'Notifications cleared.', 'info');
    } catch (err) {
      if (isNetworkError(err)) {
        console.warn("Backend down, clearing notifications locally");
        const list = await mockServices.clearNotifications();
        setNotifications(list);
        addToast('Cleared (Demo Mode)', 'Notifications cleared locally.', 'info');
        return;
      }
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
      completeSignupSession,
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
