'use client';

import { HttpTypes } from '@medusajs/types';
import {
  CategoryNavbar,
  // HeaderCategoryNavbar,
} from '@/components/molecules';
import { CloseIcon, HamburgerMenuIcon } from '@/icons';
import { useState, useEffect } from 'react';

export const MobileNavbar = ({
  childrenCategories,
  parentCategories,
}: {
  childrenCategories: HttpTypes.StoreProductCategory[];
  parentCategories: HttpTypes.StoreProductCategory[];
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
        <div className='fixed w-full h-full bg-primary p-2 top-0 left-0 z-20 overflow-y-auto'>
          <div className='flex justify-end mr-4'>
            <div onClick={() => closeMenuHandler()}>
              <CloseIcon size={20} />
            </div>
          </div>
          <div className='border mt-4 rounded-sm'>
            {/* <HeaderCategoryNavbar
              onClose={closeMenuHandler}
              categories={parentCategories}
            /> */}
            <div className='border-t pt-2'>
              <CategoryNavbar
                onClose={closeMenuHandler}
                categories={childrenCategories}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
