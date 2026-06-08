import clsx from 'clsx';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { Collapse } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/context/useAuthContext';
import axios from "axios";
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { findAllParent, findMenuItem, getMenuItemFromURL } from '@/helpers/menu';

const MenuItemWithChildren = ({
  item,
  className,
  linkClassName,
  subMenuClassName,
  activeMenuItems,
  toggleMenu
}) => {
  const [open, setOpen] = useState(activeMenuItems.includes(item.key));

  useEffect(() => {
    setOpen(activeMenuItems.includes(item.key));
  }, [activeMenuItems, item]);

  const toggleMenuItem = e => {
    e.preventDefault();
    const status = !open;
    setOpen(status);
    if (toggleMenu) toggleMenu(item, status);
    return false;
  };

  const getActiveClass = useCallback(item => {
    return activeMenuItems?.includes(item.key) ? 'active' : '';
  }, [activeMenuItems]);

  return (
    <li className={className}>
      <div
        onClick={toggleMenuItem}
        aria-expanded={open}
        role="button"
        className={clsx(linkClassName)}
      >
        {item.icon && (
          <span className="nav-icon">
            <IconifyIcon icon={item.icon} />
          </span>
        )}
        <span className="nav-text">{item.label}</span>

        {!item.badge ? (
          <IconifyIcon icon="bx:chevron-down" className="menu-arrow" />
        ) : (
          <span className={`badge badge-pill text-end bg-${item.badge.variant}`}>
            {item.badge.text}
          </span>
        )}
      </div>

      <Collapse in={open}>
        <div>
          <ul className={clsx(subMenuClassName)}>
            {(item.children || []).map((child, idx) => (
              <Fragment key={child.key + idx}>
                {child.children ? (
                  <MenuItemWithChildren
                    item={child}
                    linkClassName={clsx('nav-link', getActiveClass(child))}
                    activeMenuItems={activeMenuItems}
                    className="sub-nav-item"
                    subMenuClassName="nav sub-navbar-nav"
                    toggleMenu={toggleMenu}
                  />
                ) : (
                  <MenuItem
                    item={child}
                    className="sub-nav-item"
                    linkClassName={clsx(
                      'sub-nav-link',
                      getActiveClass(child)
                    )}
                  />
                )}
              </Fragment>
            ))}
          </ul>
        </div>
      </Collapse>
    </li>
  );
};

const MenuItem = ({ item, className, linkClassName }) => {
  return (
    <li className={className}>
      <MenuItemLink item={item} className={linkClassName} />
    </li>
  );
};

const MenuItemLink = ({ item, className }) => {
  return (
    <Link
      to={item.url ?? ''}
      target={item.target}
      className={clsx(className, {
        disabled: item.isDisabled
      })}
    >
      {item.icon && (
        <span className="nav-icon">
          <IconifyIcon icon={item.icon} />
        </span>
      )}

      <span className="nav-text">{item.label}</span>

      {item.badge && (
        <span
          className={`badge badge-pill text-end bg-${item.badge.variant}`}
        >
          {item.badge.text}
        </span>
      )}
    </Link>
  );
};

const AppMenu = ({ menuItems }) => {
  const { pathname } = useLocation();

  const [activeMenuItems, setActiveMenuItems] = useState([]);
  const [finalMenuItems, setFinalMenuItems] = useState(menuItems);
  const { isAuthenticated, user } = useAuthContext();

  // 🔥 LOAD COMPANIES DYNAMICALLY
  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/company/list`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      console.log(res);

      const companies = res.data.data;

      console.log(companies);
      console.log(user.token);

      const dynamicChildren = companies.map((company) => ({
        key: `company-${company.id}`,
        label: company.company_name,
        url: `/company/invoice/${company.id}/list`,
        parentKey: "companies",
      }));

      const updatedMenu = menuItems.map((item) =>
        item.key === "invoices"
          ? { ...item, children: dynamicChildren }
          : item
      );

      setFinalMenuItems(updatedMenu);
    } catch (error) {
      console.error("Error loading companies: ", error);
    }
  };

  const toggleMenu = (menuItem, show) => {
    if (show)
      setActiveMenuItems([menuItem.key, ...findAllParent(finalMenuItems, menuItem)]);
  };

  const getActiveClass = useCallback(
    (item) => {
      return activeMenuItems?.includes(item.key) ? 'active' : '';
    },
    [activeMenuItems]
  );

  const activeMenu = useCallback(() => {
    const trimmedURL = pathname?.replaceAll('', '');
    const matchingMenuItem = getMenuItemFromURL(finalMenuItems, trimmedURL);

    if (matchingMenuItem) {
      const activeMt = findMenuItem(finalMenuItems, matchingMenuItem.key);

      if (activeMt) {
        setActiveMenuItems([
          activeMt.key,
          ...findAllParent(finalMenuItems, activeMt)
        ]);
      }
    }
  }, [pathname, finalMenuItems]);

  useEffect(() => {
    if (finalMenuItems && finalMenuItems.length > 0) activeMenu();
  }, [activeMenu, finalMenuItems]);

  return (
    <ul className="navbar-nav">
      {(finalMenuItems || []).map((item, idx) => (
        <Fragment key={item.key + idx}>
          {item.isTitle ? (
            <li className="menu-title">{item.label}</li>
          ) : (
            <>
              {item.children ? (
                <MenuItemWithChildren
                  item={item}
                  toggleMenu={toggleMenu}
                  className="nav-item"
                  linkClassName={clsx(
                    'nav-link',
                    getActiveClass(item)
                  )}
                  subMenuClassName="nav sub-navbar-nav"
                  activeMenuItems={activeMenuItems}
                />
              ) : (
                <MenuItem
                  item={item}
                  linkClassName={clsx(
                    'nav-link',
                    getActiveClass(item)
                  )}
                  className="nav-item"
                />
              )}
            </>
          )}
        </Fragment>
      ))}
    </ul>
  );
};

export default AppMenu;
