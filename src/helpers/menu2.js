// helpers/menu2.js
import { useParams } from 'react-router-dom';
import { useAuthContext } from '@/context/useAuthContext';
import { MENU_ITEMS } from '@/assets/data/menu-items2';

export const getMenuItems = () => {
  const { tenantSlug } = useParams();
  const { user } = useAuthContext(); // Get user from auth context
  
  // If MENU_ITEMS is a function, call it with tenantSlug and userType
  if (typeof MENU_ITEMS === "function") {
    const allMenuItems = MENU_ITEMS(tenantSlug || "");
    return filterMenuByUserType(allMenuItems, user?.userType);
  }
  
  // Otherwise, filter the static array
  const arrayResult = Array.isArray(MENU_ITEMS) ? MENU_ITEMS : [];
  return filterMenuByUserType(arrayResult, user?.userType);
};

// Filter menu items based on user type
const filterMenuByUserType = (menuItems, userType) => {
  if (!userType) return menuItems;
  
  return menuItems.filter(item => {
    // Keep title items and items without restrictions
    if (item.isTitle || !item.allowedUserTypes) return true;
    
    // Check if user type is allowed
    return item.allowedUserTypes.includes(userType);
  }).map(item => {
    // Recursively filter children
    if (item.children) {
      return {
        ...item,
        children: item.children.filter(child => 
          !child.allowedUserTypes || child.allowedUserTypes.includes(userType)
        )
      };
    }
    return item;
  }).filter(item => {
    // Remove parent items that have no children after filtering
    if (item.children && item.children.length === 0) {
      return false;
    }
    return true;
  });
};

export const findAllParent = (menuItems, menuItem) => {
  let parents = [];
  const parent = findMenuItem(menuItems, menuItem.parentKey);
  if (parent) {
    parents.push(parent.key);
    if (parent.parentKey) {
      parents = [...parents, ...findAllParent(menuItems, parent)];
    }
  }
  return parents;
};

export const getMenuItemFromURL = (items, url) => {
  if (items instanceof Array) {
    for (const item of items) {
      const foundItem = getMenuItemFromURL(item, url);
      if (foundItem) {
        return foundItem;
      }
    }
  } else {
    if (items.url == url) return items;
    if (items.children != null) {
      for (const item of items.children) {
        if (item.url == url) return item;
      }
    }
  }
};

export const findMenuItem = (menuItems, menuItemKey) => {
  if (menuItems && menuItemKey) {
    for (const item of menuItems) {
      if (item.key === menuItemKey) {
        return item;
      }
      const found = findMenuItem(item.children, menuItemKey);
      if (found) return found;
    }
  }
  return null;
};