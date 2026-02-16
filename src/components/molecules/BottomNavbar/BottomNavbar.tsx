'use client';

import { usePathname } from 'next/navigation';
import { HomeIcon, CartIcon, ProfileIcon, LogoutIcon } from '@/icons';
import LocalizedLink from '@/components/molecules/LocalizedLink/LocalizedLink';
import { useMemo, useCallback, useRef, useState } from 'react';
import { useFlutterBridge } from '@/hooks/useFlutterBridge';
import { useCartStore } from '@/store/useCartStore';

interface NavItem {
  href: string;
  icon: React.ComponentType<{ color?: string; size?: number }>;
  label: string;
  isExternal?: boolean;
}

const RecommendedIcon = ({ color, size }: { color?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
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
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const cartItemCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const isActive = useCallback((href: string) => {
    if (href === '/') {
      return pathname === '/' || pathname.match(/^\/[a-z]{2}$/);
    }
    return pathname.includes(href);
  }, [pathname]);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isNavigating) {
      e.preventDefault();
      return;
    }
    
    setIsNavigating(true);

    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }
    
    navigationTimeoutRef.current = setTimeout(() => {
      setIsNavigating(false);
    }, 1000);
  }, [isNavigating]);

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
      <div className="flex justify-around items-center h-14 px-2">
        {navItemsWithState.map((item) => {
          const Icon = item.icon;
          const isCartIcon = item.label === 'Cart';

          if (item.isExternal) {
            return (
              <button
                key={item.label}
                onClick={handleExit}
                disabled={isNavigating}
                className="flex flex-col items-center justify-center flex-1 h-full active:scale-95 transition-transform touch-manipulation disabled:opacity-50 disabled:pointer-events-none"
                aria-label={item.label}
              >
                <Icon color={item.iconColor} size={24} />
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
              onClick={handleNavClick}
              className={`flex flex-col items-center justify-center flex-1 h-full active:scale-95 transition-transform touch-manipulation relative ${
                isNavigating ? 'pointer-events-none opacity-50' : ''
              }`}
              aria-label={item.label}
            >
              <div className="relative">
                <Icon color={item.iconColor} size={24} />
                {isCartIcon && cartItemCount > 0 && (
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
    </nav>
  );
};
