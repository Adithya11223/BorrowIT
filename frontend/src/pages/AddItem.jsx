// AddItem.jsx - Multi-step listing creator page with Cam/Upload & Geolocation support for BorrowIT

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button, Card, Input } from '../components/UI';
import { categories } from '../services/mockData';
import * as Icons from 'lucide-react';

export default function AddItem() {
  const { createItem, editItem, items, addToast } = useApp();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const [currentStep, setCurrentStep] = useState(1);

  // Form Fields State
  const [formData, setFormData] = useState({
    title: '',
    category: 'electronics',
    description: '',
    condition: 'Good',
    location: 'Bangalore, Karnataka',
    latitude: 12.9716, // Default Bangalore
    longitude: 77.5946,
    price: '',
    deposit: '',
    images: []
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Load existing listing data if in edit mode
  useEffect(() => {
    if (isEditMode && items.length > 0) {
      const itemToEdit = items.find(item => String(item.id) === String(id));
      if (itemToEdit) {
        setFormData({
          title: itemToEdit.title || '',
          category: itemToEdit.category || 'electronics',
          description: itemToEdit.description || '',
          condition: itemToEdit.condition || 'Good',
          location: itemToEdit.location || 'Bangalore, Karnataka',
          latitude: itemToEdit.latitude || 12.9716,
          longitude: itemToEdit.longitude || 77.5946,
          price: itemToEdit.price || '',
          deposit: itemToEdit.deposit || '',
          images: itemToEdit.images || []
        });
      }
    }
  }, [id, isEditMode, items]);

  // Permission Explanations State
  const [permissionModal, setPermissionModal] = useState(null); // 'camera' | 'location' | 'photos'
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  const steps = [
    { num: 1, name: 'Basic Info', icon: 'FileText' },
    { num: 2, name: 'Specification', icon: 'Sliders' },
    { num: 3, name: 'Pricing & T&C', icon: 'DollarSign' },
    { num: 4, name: 'Images & Publish', icon: 'UploadCloud' }
  ];

  const handleFieldChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateStep = () => {
    let temp = {};
    if (currentStep === 1) {
      if (!formData.title.trim()) temp.title = 'Item Title is required';
      if (!formData.description.trim()) temp.description = 'Description is required';
      else if (formData.description.length < 15) temp.description = 'Provide a slightly longer description (min 15 characters)';
    } else if (currentStep === 3) {
      if (!formData.price || parseFloat(formData.price) <= 0) temp.price = 'Provide a valid daily rate';
    } else if (currentStep === 4) {
      if (formData.images.length === 0) {
        temp.images = 'Please upload or capture at least one image of your item';
        addToast('Image Required', 'You must add at least one image before publishing.', 'error');
      }
    }
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handlePublish = async (e) => {
    if (e) e.preventDefault();
    if (!validateStep()) return;
    
    try {
      setLoading(true);
      const itemData = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        price: parseFloat(formData.price),
        deposit: formData.deposit ? parseFloat(formData.deposit) : 0,
        condition: formData.condition,
        location: formData.location,
        latitude: formData.latitude,
        longitude: formData.longitude,
        specifications: {
          Condition: formData.condition,
          Deposit: formData.deposit ? `₹${formData.deposit}` : 'No Security Deposit Required',
          Location: formData.location
        },
        images: formData.images
      };

      if (isEditMode) {
        await editItem(id, itemData);
      } else {
        await createItem(itemData);
      }
      navigate('/my-items');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- GEOLOCATION / LOCATION PERMISSION ---
  const handleDetectLocation = () => {
    setPermissionModal('location');
  };

  const requestLocationSystemPermission = () => {
    setPermissionModal(null);
    if (!navigator.geolocation) {
      addToast('Error', 'Geolocation is not supported by your browser.', 'error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Mock translate coordinates to actual neighborhoods
        const neighborhoods = [
          'Koramangala, Bangalore', 'Indiranagar, Bangalore', 'Whitefield, Bangalore', 
          'Gachibowli, Hyderabad', 'Jubilee Hills, Hyderabad', 'Madhapur, Hyderabad'
        ];
        const randomNeighborhood = neighborhoods[Math.floor(Math.random() * neighborhoods.length)];
        
        setFormData(prev => ({
          ...prev,
          location: randomNeighborhood,
          latitude,
          longitude
        }));
        addToast('Location Detected', `Found neighborhood: ${randomNeighborhood}`, 'success');
      },
      (error) => {
        console.error(error);
        addToast('Permission Denied', 'Could not access location. Please enter manually or check settings.', 'error');
      }
    );
  };

  // --- FILE UPLOAD / PHOTOS PERMISSION ---
  const handleTriggerUpload = () => {
    setPermissionModal('photos');
  };

  const proceedWithFileUpload = () => {
    setPermissionModal(null);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setLoading(true);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const compressedList = [];

    for (let file of files) {
      if (!validTypes.includes(file.type)) {
        addToast('Invalid Format', `File "${file.name}" is not supported. Use JPG, PNG or WEBP.`, 'error');
        continue;
      }
      try {
        const compressedData = await compressImage(file);
        compressedList.push(compressedData);
      } catch (err) {
        console.error(err);
      }
    }

    if (compressedList.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...compressedList]
      }));
      if (errors.images) setErrors(prev => ({ ...prev, images: '' }));
      addToast('Upload Success', `Imported ${compressedList.length} image(s).`, 'success');
    }
    setLoading(false);
  };

  // --- CAMERA CAPTURE PERMISSION ---
  const handleOpenCamera = () => {
    setPermissionModal('camera');
  };

  const startCameraStream = async () => {
    setPermissionModal(null);
    setCameraActive(true);
    setCameraError('');

    setTimeout(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error(err);
        setCameraError('Camera permission was denied or hardware not found. Enable it in your browser settings to capture photos.');
        addToast('Camera Blocked', 'Access denied by browser. You can retry or upload file.', 'error');
      }
    }, 100);
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, dataUrl]
      }));
      if (errors.images) setErrors(prev => ({ ...prev, images: '' }));
      addToast('Photo Captured', 'Image appended to previews.', 'success');
      handleCloseCamera();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setCameraActive(false);
    setCameraError('');
  };

  // --- REORDER AND DELETE ---
  const handleDeleteImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== index)
    }));
  };

  const handleMoveImage = (index, direction) => {
    const newImages = [...formData.images];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= newImages.length) return;
    
    // Swap
    const temp = newImages[index];
    newImages[index] = newImages[targetIdx];
    newImages[targetIdx] = temp;

    setFormData(prev => ({ ...prev, images: newImages }));
  };

  useEffect(() => {
    return () => {
      // Stop webcam stream on unmount
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex flex-col gap-6 relative select-none">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-white">
          {isEditMode ? 'Edit Item Listing' : 'List a New Item'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {isEditMode ? 'Update your listing details and specifications.' : 'Lend your idle assets to verified members in your area.'}
        </p>
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-4 gap-2 bg-[#1A1A1C] border-[#2A2A2D]/80 shadow-sm p-2.5 rounded-2xl border border-[#2A2A2D] overflow-x-auto scrollbar-none">
        {steps.map((st) => {
          const StepIcon = Icons[st.icon] || Icons.HelpCircle;
          const active = currentStep === st.num;
          const done = currentStep > st.num;
          return (
            <div
              key={st.num}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap justify-center md:justify-start ${
                active 
                  ? 'bg-brand-primary text-black shadow-lg shadow-brand-primary/20' 
                  : done 
                    ? 'text-brand-primary bg-brand-primary/5 border border-brand-primary/10' 
                    : 'text-slate-500 bg-transparent'
              }`}
            >
              {done ? <Icons.CheckCircle2 className="w-4 h-4" /> : <StepIcon className="w-4 h-4" />}
              <span className="hidden md:inline">{st.name}</span>
            </div>
          );
        })}
      </div>

      {/* Form Content Cards */}
      <Card className="p-6 bg-[#1A1A1C] border-[#2A2A2D]/80 shadow-sm" hoverable={false}>
        
        {/* STEP 1: Basic Info */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-5">
            <Input
              label="Item Title"
              placeholder="e.g. Sony a6400 Mirrorless Camera"
              value={formData.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              error={errors.title}
            />

            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</label>
              <select
                value={formData.category}
                onChange={(e) => handleFieldChange('category', e.target.value)}
                className="bg-[#131314] border border-[#2A2A2D] focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none transition-all cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Description</label>
              <textarea
                placeholder="Mention what's included (charger, case, lenses), how to handle the item, and policies regarding damages..."
                value={formData.description}
                rows={5}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                className={`w-full bg-[#131314] border ${errors.description ? 'border-red-500/80 focus:ring-red-500/20' : 'border-[#2A2A2D] focus:border-brand-primary focus:ring-brand-primary/20'} rounded-xl py-2.5 px-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 transition-all font-sans resize-none`}
              />
              {errors.description && <span className="text-xs text-red-500 font-medium">{errors.description}</span>}
            </div>
          </div>
        )}

        {/* STEP 2: Condition & Specs */}
        {currentStep === 2 && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Item Condition</label>
              <select
                value={formData.condition}
                onChange={(e) => handleFieldChange('condition', e.target.value)}
                className="bg-[#131314] border border-[#2A2A2D] focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none transition-all cursor-pointer"
              >
                <option value="New">New (Unopened box)</option>
                <option value="Like New">Like New (Practically no signs of wear)</option>
                <option value="Good">Good (Minor wear, fully functional)</option>
                <option value="Fair">Fair (Noticeable scratches, functional)</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <Input
                label="Verified Location (Neighborhood/City)"
                placeholder="e.g. Indiranagar, Bangalore"
                value={formData.location}
                onChange={(e) => handleFieldChange('location', e.target.value)}
                icon="MapPin"
              />
              <button
                type="button"
                onClick={handleDetectLocation}
                className="self-end text-xs font-bold text-brand-primary hover:underline flex items-center gap-1 mt-1 transition-all"
              >
                <Icons.Navigation className="w-3.5 h-3.5" />
                Detect My Location
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Pricing & Deposit */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Daily Rate (₹ / day)"
                type="number"
                placeholder="e.g. 500"
                value={formData.price}
                onChange={(e) => handleFieldChange('price', e.target.value)}
                error={errors.price}
                icon="DollarSign"
              />

              <Input
                label="Security Deposit (Optional)"
                type="number"
                placeholder="e.g. 3000 (Leave empty for none)"
                value={formData.deposit}
                onChange={(e) => handleFieldChange('deposit', e.target.value)}
                icon="Shield"
              />
            </div>
            
            <div className="p-3 bg-brand-primary/5 border border-brand-primary/10 rounded-xl flex items-start gap-3 mt-4">
              <Icons.ShieldAlert className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                Lenders are covered by the **BorrowIT Trust Assurance**. In the rare event of severe damage or late returns, we help mediate security deposits and issue warnings to policy violators.
              </p>
            </div>
          </div>
        )}

        {/* STEP 4: Images & Publish */}
        {currentStep === 4 && (
          <div className="flex flex-col gap-6 items-center">
            
            {/* Interactive Selector Board */}
            <div className="border border-dashed border-[#2A2A2D] bg-[#131314]/10 rounded-2xl w-full max-w-lg p-6 flex flex-col items-center">
              <div className="bg-[#131314]/60 rounded-xl p-3 border border-[#2A2A2D] text-slate-500 mb-3">
                <Icons.UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-white mb-1">Add Images to your Listing</p>
              <p className="text-[9.5px] text-slate-500">Add at least 1 image. Drag/reorder thumbnails to set cover image.</p>
              
              <div className="flex gap-4 mt-5">
                <button
                  type="button"
                  onClick={handleTriggerUpload}
                  className="bg-[#131314] hover:bg-[#1C1C1E] border border-[#2A2A2D] text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <Icons.Image className="w-4 h-4 text-brand-primary" />
                  Upload Images
                </button>
                <button
                  type="button"
                  onClick={handleOpenCamera}
                  className="bg-[#131314] hover:bg-[#1C1C1E] border border-[#2A2A2D] text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <Icons.Camera className="w-4 h-4 text-brand-primary" />
                  Use Camera
                </button>
              </div>

              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Camera Overlay Mode */}
            {cameraActive && (
              <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md bg-[#131314] border border-[#2A2A2D] rounded-2xl overflow-hidden flex flex-col relative">
                  <div className="p-4 border-b border-[#2A2A2D] flex justify-between items-center bg-[#1A1A1C]">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Icons.Camera className="w-4 h-4 text-brand-primary animate-pulse" />
                      Take Photo
                    </h3>
                    <button onClick={handleCloseCamera} className="text-slate-500 hover:text-white">
                      <Icons.X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="relative aspect-video bg-black flex items-center justify-center">
                    {cameraError ? (
                      <p className="text-xs text-red-400 text-center px-6 leading-relaxed font-semibold">{cameraError}</p>
                    ) : (
                      <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
                    )}
                  </div>

                  <div className="p-5 border-t border-[#2A2A2D] flex justify-center gap-4 bg-[#1A1A1C]">
                    <button
                      type="button"
                      onClick={handleCloseCamera}
                      className="bg-transparent border border-[#2A2A2D] hover:bg-slate-800/40 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs transition-all"
                    >
                      Cancel
                    </button>
                    {!cameraError && (
                      <button
                        type="button"
                        onClick={handleCapturePhoto}
                        className="bg-brand-primary hover:bg-[#E05300] text-black font-extrabold px-6 py-2.5 rounded-xl text-xs transition-all shadow-lg"
                      >
                        Capture
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Previews List */}
            {formData.images.length > 0 && (
              <div className="w-full max-w-lg mt-2">
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider mb-2 text-left">Selected Images ({formData.images.length})</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-[#2A2A2D] bg-[#131314]">
                      <img src={img} alt="preview" className="w-full h-full object-cover" />
                      
                      {/* Badge Cover */}
                      {idx === 0 && (
                        <span className="absolute top-1.5 left-1.5 bg-brand-primary text-black text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                          Cover
                        </span>
                      )}

                      {/* Action overlays */}
                      <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(idx)}
                          className="self-end w-6 h-6 rounded bg-red-600/90 text-white flex items-center justify-center hover:bg-red-700 active:scale-90"
                        >
                          <Icons.Trash2 className="w-3.5 h-3.5" />
                        </button>
                        
                        <div className="flex justify-between items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveImage(idx, -1)}
                            disabled={idx === 0}
                            className="flex-1 h-5 rounded bg-black/70 text-white flex items-center justify-center hover:bg-black/90 disabled:opacity-30 disabled:hover:bg-black/70"
                          >
                            <Icons.ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveImage(idx, 1)}
                            disabled={idx === formData.images.length - 1}
                            className="flex-1 h-5 rounded bg-black/70 text-white flex items-center justify-center hover:bg-black/90 disabled:opacity-30 disabled:hover:bg-black/70"
                          >
                            <Icons.ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {errors.images && (
              <span className="text-xs text-red-500 font-bold block mt-1">{errors.images}</span>
            )}

            {/* Quick Preview Card */}
            <div className="border border-[#2A2A2D] bg-slate-950/45 p-4 rounded-xl max-w-sm w-full text-left mt-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Publish Preview</p>
              <div className="aspect-[1.6] w-full rounded-lg overflow-hidden border border-[#2A2A2D] mb-3 bg-[#131314]">
                {formData.images.length > 0 ? (
                  <img src={formData.images[0]} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-650">
                    <Icons.Image className="w-8 h-8" />
                  </div>
                )}
              </div>
              <h4 className="text-sm font-extrabold text-white">{formData.title || 'Untitled Listing'}</h4>
              <p className="text-xs text-brand-primary font-bold mt-1">₹{formData.price || '0'} / day</p>
              <p className="text-[10px] text-slate-500 mt-1 font-semibold">
                Deposit: <span className="text-white">{formData.deposit ? `₹${formData.deposit}` : 'No Security Deposit Required'}</span>
              </p>
            </div>
          </div>
        )}

        {/* Form controls */}
        <div className="flex justify-between mt-8 border-t border-[#2A2A2D] pt-5">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1 || loading}
            icon="ChevronLeft"
          >
            Back
          </Button>

          {currentStep === 4 ? (
            <Button
              type="button"
              variant="glow"
              onClick={handlePublish}
              loading={loading}
              icon="Check"
            >
              {isEditMode ? 'Save Changes' : 'Publish Item'}
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              onClick={handleNext}
              icon="ChevronRight"
              iconPosition="right"
            >
              Next Step
            </Button>
          )}
        </div>

      </Card>

      {/* ===== RUNTIME PERMISSION EXPLANATION MODALS ===== */}
      {permissionModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#1A1A1C] border border-[#2A2A2D] rounded-2xl p-6 shadow-xl text-center">
            
            {/* Icon header */}
            <div className="mx-auto w-12 h-12 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary flex items-center justify-center mb-4">
              {permissionModal === 'camera' && <Icons.Camera className="w-6 h-6 animate-pulse" />}
              {permissionModal === 'location' && <Icons.Navigation className="w-6 h-6 animate-pulse" />}
              {permissionModal === 'photos' && <Icons.Image className="w-6 h-6 animate-pulse" />}
            </div>

            {/* Explanation text */}
            <h3 className="text-base font-extrabold text-white capitalize">Enable {permissionModal} access?</h3>
            <p className="text-xs text-slate-400 mt-2.5 leading-relaxed font-semibold">
              {permissionModal === 'camera' && 'BorrowIT needs camera access to capture a high-quality photo of your item. This helps borrowers verify the current item condition.'}
              {permissionModal === 'location' && 'BorrowIT uses location data to compute distances to nearby items, display proximity metrics, and sort listings by distance.'}
              {permissionModal === 'photos' && 'BorrowIT needs library access to browse and select image files of your item from your photo roll.'}
            </p>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setPermissionModal(null)}
                className="flex-1 bg-transparent border border-[#2A2A2D] hover:bg-slate-800/40 text-slate-300 font-bold py-3 rounded-xl text-xs transition-all active:scale-95"
              >
                Not Now
              </button>
              <button
                type="button"
                onClick={
                  permissionModal === 'camera' ? startCameraStream : 
                  permissionModal === 'location' ? requestLocationSystemPermission : 
                  proceedWithFileUpload
                }
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
