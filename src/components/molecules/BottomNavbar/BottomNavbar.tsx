'use client';

import { usePathname } from 'next/navigation';
import { HomeIcon, CartIcon, ProfileIcon, LogoutIcon } from '@/icons';
import LocalizedLink from '@/components/molecules/LocalizedLink/LocalizedLink';
import { useMemo, useCallback, useState, useEffect } from 'react';
import { useFlutterBridge } from '@/hooks/useFlutterBridge';
import { useCartStore } from '@/store/useCartStore';

interface NavItem {
  href: string;
  icon: React.ComponentType<{ color?: string; size?: number; className?: string }>;
  label: string;
  isExternal?: boolean;
}

const RecommendedIcon = ({ color, size, className }: { color?: string; size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      fill={color}
    />
  </svg>
);

const NAV_ITEMS: NavItem[] = [
  {
    href: '/',
    icon: HomeIcon,
    label: 'Home',
  },
  {
    href: '/recommended',
    icon: RecommendedIcon,
    label: 'For You',
  },
  {
    href: '/check',
    icon: CartIcon,
    label: 'Cart',
  },
  {
    href: '/profile',
    icon: ProfileIcon,
    label: 'Profile',
  },
  {
    href: '#',
    icon: LogoutIcon,
    label: 'Exit',
    isExternal: true,
  },
];

export const BottomNavbar = () => {
  const pathname = usePathname();
  const { exitWebView } = useFlutterBridge();
  const cartItems = useCartStore((state) => state.items);
  const [isNavigating, setIsNavigating] = useState(false);
  const [clickedItem, setClickedItem] = useState<string | null>(null);
  
  // Reset navigation state only when pathname changes (navigation completed)
  useEffect(() => {
    setIsNavigating(false);
    setClickedItem(null);
  }, [pathname]);
  
  const cartItemCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const isActive = useCallback((href: string) => {
    if (href === '/') {
      return pathname === '/' || pathname.match(/^\/[a-z]{2}$/);
    }
    return pathname.includes(href);
  }, [pathname]);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string, label: string) => {
    if (isNavigating) {
      e.preventDefault();
      return;
    }
    
    if (isActive(href)) {
      return;
    }
    
    setIsNavigating(true);
    setClickedItem(label);
  }, [isNavigating, isActive]);

  const handleExit = useCallback(() => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    exitWebView();
    
    // Reset after a short delay
    setTimeout(() => {
      setIsNavigating(false);
    }, 500);
  }, [exitWebView, isNavigating]);

  const navItemsWithState = useMemo(() => 
    NAV_ITEMS.map((item) => ({
      ...item,
      active: isActive(item.href),
      iconColor: isActive(item.href) ? '#FFFFFF' : '#B3B3B3',
    })),
    [isActive]
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#3949AB] z-[60] lg:hidden shadow-lg">

      {isNavigating && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/30 overflow-hidden">
          <div className="h-full bg-white animate-[loading_1s_ease-in-out_infinite]" 
               style={{
                 animation: 'loading 1s ease-in-out infinite',
                 width: '40%',
                 transformOrigin: 'left'
               }} 
          />
        </div>
      )}
      
      <div className="flex justify-around items-center h-14 px-2">
        {navItemsWithState.map((item) => {
          const Icon = item.icon;
          const isCartIcon = item.label === 'Cart';
          const isLoading = isNavigating && clickedItem === item.label;

          if (item.isExternal) {
            return (
              <button
                key={item.label}
                onClick={handleExit}
                disabled={isNavigating}
                className="flex flex-col items-center justify-center flex-1 h-full active:scale-95 transition-transform touch-manipulation disabled:opacity-50 disabled:pointer-events-none relative"
                aria-label={item.label}
              >
                <div className="relative">
                  <Icon color={item.iconColor} size={24} />
                </div>
                <span
                  className="text-xs mt-1 font-medium"
                  style={{ color: item.iconColor }}
                >
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <LocalizedLink
              key={item.label}
              href={item.href}
              prefetch={true}
              onClick={(e) => handleNavClick(e, item.href, item.label)}
              className={`flex flex-col items-center justify-center flex-1 h-full active:scale-95 transition-all touch-manipulation relative ${
                isNavigating ? 'pointer-events-none' : ''
              } ${isLoading ? 'opacity-70' : ''}`}
              aria-label={item.label}
            >
              <div className="relative">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}
                <Icon color={item.iconColor} size={24} className={isLoading ? 'opacity-0' : ''} />
                {isCartIcon && cartItemCount > 0 && !isLoading && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </div>
              <span
                className="text-xs mt-1 font-medium"
                style={{ color: item.iconColor }}
              >
                {item.label}
              </span>
            </LocalizedLink>
          );
        })}
      </div>
      
      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(0); }
          50% { transform: translateX(150%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </nav>
  );
};
