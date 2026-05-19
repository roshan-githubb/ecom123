'use client';

import { HttpTypes } from '@medusajs/types';
import { HierarchicalCategoryMenu } from '@/components/molecules/HierarchicalCategoryMenu';
import { CloseIcon, HamburgerMenuIcon } from '@/icons';
import { useState, useEffect } from 'react';

export const MobileNavbar = ({
  hierarchicalCategories,
}: {
  hierarchicalCategories: HttpTypes.StoreProductCategory[];
}) => {
  const [openMenu, setOpenMenu] = useState(false);

  const closeMenuHandler = () => {
    setOpenMenu(false);
  };

  // Prevent background scrolling when menu is open
  useEffect(() => {
    if (openMenu) {
      // Disable scrolling
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      // Re-enable scrolling
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [openMenu]);

  return (
    <div className='lg:hidden'>
      <div onClick={() => setOpenMenu(true)}>
        <HamburgerMenuIcon color='white' />
      </div>
      {openMenu && (
        <div className='fixed w-full h-full bg-white p-2 top-0 left-0 z-20 overflow-y-auto'>
          <div className='flex justify-end mr-4'>
            <div onClick={() => closeMenuHandler()}>
              <CloseIcon size={20} color="black" />
            </div>
          </div>
          <div className='mt-4'>
            <HierarchicalCategoryMenu
              categories={hierarchicalCategories}
              onClose={closeMenuHandler}
            />
          </div>
        </div>
      )}
    </div>
  );
};
