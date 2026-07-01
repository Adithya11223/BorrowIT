// UI.jsx - Premium Shared UI library for BorrowIT (with Framer Motion & Lucide Icons)

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';

// --- BUTTON COMPONENT ---
export const Button = ({
  children,
  variant = 'primary', // primary, secondary, outline, danger, ghost, glow
  size = 'md', // sm, md, lg
  className = '',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  ...props
}) => {
  const baseStyle = "relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-brand-glow/50 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-95";
  
  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs font-semibold",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base"
  };

  const variantStyles = {
    primary: "bg-brand-primary hover:bg-[#E05300] text-black shadow-lg shadow-brand-primary/20",
    secondary: "bg-[#1A1A1C] hover:bg-[#2A2A2D] text-white border border-[#2A2A2D]",
    outline: "bg-transparent text-white border border-brand-primary hover:bg-brand-primary hover:text-black",
    danger: "bg-[#EA580C] hover:bg-[#C2410C] text-white shadow-lg shadow-brand-primary/20",
    ghost: "bg-transparent text-slate-500 hover:text-white hover:bg-[#1A1A1C]",
    glow: "bg-brand-primary hover:bg-[#E05300] text-black hover:shadow-lg hover:shadow-brand-primary/15"
  };

  const IconComponent = icon ? Icons[icon] : null;

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!loading && IconComponent && iconPosition === 'left' && (
        <IconComponent className={`w-4 h-4 mr-2 ${size === 'lg' ? 'w-5 h-5' : ''}`} />
      )}
      <span>{children}</span>
      {!loading && IconComponent && iconPosition === 'right' && (
        <IconComponent className={`w-4 h-4 ml-2 ${size === 'lg' ? 'w-5 h-5' : ''}`} />
      )}
    </button>
  );
};

// --- INPUT & PASSWORD INPUT ---
export const Input = ({
  label,
  error,
  icon,
  className = '',
  wrapperClassName = '',
  ...props
}) => {
  const IconComponent = icon ? Icons[icon] : null;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${wrapperClassName}`}>
      {label && <label className="text-xs font-semibold text-slate-500 tracking-wide uppercase">{label}</label>}
      <div className="relative">
        {IconComponent && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
            <IconComponent className="w-4 h-4" />
          </div>
        )}
        <input
          className={`w-full rounded-xl bg-[#1A1A1C] border ${error ? 'border-red-500/80 focus:ring-red-500/30' : 'border-[#2A2A2D] focus:border-brand-primary focus:ring-brand-primary/10'} py-2.5 px-4 ${IconComponent ? 'pl-11' : ''} text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-red-400 font-medium pl-1">{error}</span>}
    </div>
  );
};

export const PasswordInput = ({ label, error, ...props }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative w-full">
      <Input
        label={label}
        error={error}
        type={show ? 'text' : 'password'}
        icon="Lock"
        className="pr-12"
        {...props}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-4 bottom-3 text-slate-500 hover:text-slate-300 transition-colors"
      >
        {show ? <Icons.EyeOff className="w-4 h-4" /> : <Icons.Eye className="w-4 h-4" />}
      </button>
    </div>
  );
};

// --- CARD COMPONENT ---
export const Card = ({ children, className = '', hoverable = true, glow = false, ...props }) => {
  return (
    <div
      className={`glass rounded-2xl p-5 border border-[#2A2A2D] ${hoverable ? 'hover:border-brand-primary/40 hover:shadow-2xl hover:shadow-black hover:-translate-y-0.5' : ''} ${glow ? 'glass-glow border-brand-primary/25' : ''} transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// --- STATUS BADGE ---
export const Badge = ({ children, variant = 'info', className = '' }) => {
  const styles = {
    success: "bg-brand-primary/100/10 text-brand-primary border-brand-primary/20",
    error: "bg-red-500/10 text-red-400 border-red-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    info: "bg-brand-primary/10 text-brand-primary border-brand-primary/20",
    neutral: "bg-slate-800 text-slate-500 border-slate-700"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

// --- AVATAR ---
export const Avatar = ({ src, alt = "Avatar", size = "md", verified = false, className = '' }) => {
  const sizeStyles = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-11 h-11",
    lg: "w-16 h-16",
    xl: "w-24 h-24"
  };

  return (
    <div className={`relative inline-block select-none ${className}`}>
      <img
        src={src || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
        alt={alt}
        className={`${sizeStyles[size]} rounded-full object-cover border border-slate-700`}
        onError={(e) => {
          e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${alt}`;
        }}
      />
      {verified && (
        <span className="absolute bottom-0 right-0 bg-brand-primary border border-dark-bg text-black rounded-full p-0.5 flex items-center justify-center translate-x-1/10 translate-y-1/10">
          <Icons.Check className="w-2.5 h-2.5 stroke-[3]" />
        </span>
      )}
    </div>
  );
};

// --- TABS COMPONENT ---
export const Tabs = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div className={`flex border-b border-[#2A2A2D] gap-6 overflow-x-auto scrollbar-none ${className}`}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`relative pb-3 text-sm font-semibold tracking-wide transition-colors duration-200 focus:outline-none whitespace-nowrap ${
            activeTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-primary to-brand-cyan"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
};

// --- MODAL ---
export const Modal = ({ isOpen, onClose, title, children, className = '' }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className={`relative w-full max-w-lg overflow-hidden rounded-2xl glass-premium p-6 border border-[#2A2A2D] z-10 ${className}`}
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold tracking-tight text-white">{title}</h3>
              <button
                onClick={onClose}
                className="text-slate-500 hover:text-white p-1 rounded-lg hover:bg-[#131314] transition-colors"
              >
                <Icons.X className="w-5 h-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- DRAWER (SLIDE PANELS) ---
export const Drawer = ({ isOpen, onClose, title, children, side = 'right' }) => {
  const directions = {
    right: { x: '100%' },
    left: { x: '-100%' }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className={`fixed inset-y-0 ${side === 'right' ? 'right-0' : 'left-0'} flex max-w-full`}>
            {/* Slide Drawer */}
            <motion.div
              initial={directions[side]}
              animate={{ x: 0 }}
              exit={directions[side]}
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.35 }}
              className="w-screen max-w-md glass-premium p-6 border-l border-[#2A2A2D] flex flex-col h-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <button
                  onClick={onClose}
                  className="text-slate-500 hover:text-white p-1.5 rounded-lg hover:bg-[#131314] transition-colors"
                >
                  <Icons.X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto pr-1">
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- RATING STARS ---
export const Rating = ({ rating = 5, size = 4, readonly = true, onChange }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, idx) => {
        const starValue = idx + 1;
        const isActive = hoverRating ? starValue <= hoverRating : starValue <= rating;
        return (
          <button
            key={idx}
            disabled={readonly}
            type="button"
            onClick={() => onChange && onChange(starValue)}
            onMouseEnter={() => !readonly && setHoverRating(starValue)}
            onMouseLeave={() => !readonly && setHoverRating(0)}
            className={`${readonly ? 'cursor-default' : 'cursor-pointer'} transition-transform active:scale-125 focus:outline-none`}
          >
            <Icons.Star
              className={`w-${size} h-${size} ${
                isActive 
                  ? 'fill-amber-400 text-amber-400 filter drop-shadow-[0_0_2px_rgba(251,191,36,0.3)]' 
                  : 'text-slate-300'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

// --- LOADER & SKELETONS ---
export const Loader = ({ size = 'md' }) => {
  const sizes = {
    sm: "w-5 h-5 border-2",
    md: "w-9 h-9 border-3",
    lg: "w-14 h-14 border-4"
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className={`animate-spin rounded-full border-t-brand-primary border-r-brand-cyan border-b-transparent border-l-transparent ${sizes[size]}`} />
    </div>
  );
};

export const Skeleton = ({ className = '' }) => {
  return <div className={`shimmer rounded-xl ${className}`} />;
};

export const CardSkeleton = () => {
  return (
    <div className="glass rounded-2xl p-5 border border-[#2A2A2D]/80 flex flex-col gap-4">
      <Skeleton className="h-44 w-full" />
      <Skeleton className="h-6 w-3/4" />
      <div className="flex justify-between items-center mt-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-8 w-1/4" />
      </div>
    </div>
  );
};

// --- EMPTY STATE ---
export const EmptyState = ({ icon = "FolderOpen", title = "No data found", description = "Try adjusting your search filters or check back later.", actionLabel, onAction }) => {
  const Icon = Icons[icon] || Icons.FolderOpen;

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-[#2A2A2D] bg-[#161618]/50">
      <div className="bg-[#1A1A1C] rounded-full p-4 mb-4 border border-[#2A2A2D]">
        <Icon className="w-8 h-8 text-brand-primary" />
      </div>
      <h4 className="text-base font-bold text-white mb-1">{title}</h4>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && (
        <Button variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

// --- CONFIRMATION DIALOG ---
export const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title = "Are you sure?", description = "This action cannot be undone.", confirmText = "Confirm", cancelText = "Cancel" }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed">{description}</p>
      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>
          {cancelText}
        </Button>
        <Button variant="danger" onClick={() => { onConfirm(); onClose(); }}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};

// --- DROPDOWN MENU ---
export const Dropdown = ({ trigger, options = [], className = '' }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop click wrapper */}
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 5 }}
              transition={{ duration: 0.15 }}
              className={`absolute right-0 mt-2 w-48 rounded-xl glass border border-[#2A2A2D] shadow-xl z-40 py-1.5 focus:outline-none ${className}`}
            >
              {options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    opt.onClick && opt.onClick();
                    setOpen(false);
                  }}
                  className={`flex w-full items-center px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors text-left font-medium ${opt.className || ''}`}
                >
                  {opt.icon && (
                    <span className="mr-2.5 text-slate-500">
                      {React.createElement(Icons[opt.icon] || Icons.HelpCircle, { className: 'w-4 h-4' })}
                    </span>
                  )}
                  {opt.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- FLOATING TOASTS ---
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-3 w-full max-w-sm">
      <AnimatePresence>
        {toasts.map(toast => {
          const typeIcons = {
            success: 'CheckCircle2',
            error: 'AlertTriangle',
            info: 'Info',
            lend: 'ArrowUpRight',
            borrow: 'ArrowDownLeft'
          };
          const typeColors = {
            success: 'text-brand-primary border-brand-primary/25',
            error: 'text-[#EA580C] border-[#EA580C]/25',
            info: 'text-white border-slate-800',
            lend: 'text-brand-primary border-brand-primary/25',
            borrow: 'text-white border-slate-800'
          };
          
          const IconComponent = Icons[typeIcons[toast.type] || 'Info'];

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className={`flex items-start gap-3 rounded-2xl glass-premium p-4 border ${typeColors[toast.type] || 'border-[#2A2A2D]'} shadow-2xl w-full relative`}
            >
              <div className="mt-0.5">
                <IconComponent className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h5 className="text-sm font-bold text-white">{toast.title}</h5>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-500 hover:text-white p-0.5 rounded transition-colors"
              >
                <Icons.X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
