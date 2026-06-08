export const MENU_ITEMS = (tenantSlug = "") => [{
  key: 'general',
  label: 'GENERAL',
  isTitle: true
}, {
  key: 'dashboards',
  icon: 'iconamoon:home-duotone',
  label: 'Dashboards',
  children: [{
    key: 'dashboard-sales',
    label: 'Sales',
    url: `/${tenantSlug}/dashboard/sales`,
    allowedUserTypes: ['landlord', 'tenant', 'admin'],
    parentKey: 'dashboards'
  }]
}, {
  key: 'users',
  label: 'USERS',
  isTitle: true
}, {
  key: 'users',
  icon: 'iconamoon:profile-circle-duotone',
  label: 'Account',
  children: [{
    key: 'account-admin',
    label: 'Admins',
    url: `/${tenantSlug}/accounts/admin`,
    allowedUserTypes: ['landlord', 'tenant', 'admin'],
    parentKey: 'users'
  }, {
    key: 'account-roles',
    label: 'User Types',
    url: `/${tenantSlug}/accounts/user-types`,
    allowedUserTypes: ['landlord'],
    parentKey: 'users'
  }, {
    key: 'account-landlords',
    label: 'Landlords',
    url: `/${tenantSlug}/accounts/landlords`,
    allowedUserTypes: ['landlord'],
    parentKey: 'users'
  }, {
    key: 'account-tenants',
    label: 'Tenants',
    url: `/${tenantSlug}/accounts/tenants`,
    allowedUserTypes: ['landlord'],
    parentKey: 'users'
  }]
}, {
  key: 'properties',
  label: 'PROPERTIES',
  isTitle: true
}, {
  key: 'properties',
  icon: 'iconamoon:home-duotone',
  label: 'Apartments',
  children: [{
    key: 'apartment-account',
    label: 'Apartments',
    url: `/${tenantSlug}/properties/apartments`,
    allowedUserTypes: ['landlord'],
    parentKey: 'properties'
  }, {
    key: 'apartment-complaints',
    label: 'Complaints',
    url: `/${tenantSlug}/properties/complaints`,
    allowedUserTypes: ['tenant'],
    parentKey: 'properties'
  }]
}, {
  key: 'rent-manager',
  icon: 'iconamoon:home-duotone',
  label: 'Rent Manager',
  url: `/${tenantSlug}/rent-manager`,
  allowedUserTypes: ['landlord'],
}];








// assets/data/menu-items2.js
// export const MENU_ITEMS = (tenantSlug = "") => [
//   {
//     key: 'general',
//     label: 'GENERAL',
//     isTitle: true
//   },
//   {
//     key: 'dashboards',
//     icon: 'iconamoon:home-duotone',
//     label: 'Dashboards',
//     allowedUserTypes: ['landlord', 'tenant', 'admin'],
//     children: [
//       {
//         key: 'dashboard-sales',
//         label: 'Sales',
//         url: `/${tenantSlug}/dashboard/sales`,
//         parentKey: 'dashboards',
//         allowedUserTypes: ['landlord', 'admin']
//       },
//       {
//         key: 'dashboard-analytics',
//         label: 'Analytics',
//         url: `/${tenantSlug}/dashboard/analytics`,
//         parentKey: 'dashboards',
//         allowedUserTypes: ['landlord', 'admin']
//       },
//       {
//         key: 'dashboard-tenant',
//         label: 'My Dashboard',
//         url: `/${tenantSlug}/dashboard/tenant`,
//         parentKey: 'dashboards',
//         allowedUserTypes: ['tenant']
//       }
//     ]
//   },
//   {
//     key: 'users',
//     label: 'USERS',
//     isTitle: true,
//     allowedUserTypes: ['landlord', 'admin']
//   },
//   {
//     key: 'users-management',
//     icon: 'iconamoon:profile-circle-duotone',
//     label: 'Account',
//     allowedUserTypes: ['landlord', 'admin'],
//     children: [
//       {
//         key: 'account-admin',
//         label: 'Admins',
//         url: `/${tenantSlug}/accounts/admin`,
//         parentKey: 'users-management',
//         allowedUserTypes: ['admin']
//       },
//       {
//         key: 'account-roles',
//         label: 'User Types',
//         url: `/${tenantSlug}/accounts/user-types`,
//         parentKey: 'users-management',
//         allowedUserTypes: ['admin']
//       },
//       {
//         key: 'account-landlords',
//         label: 'Landlords',
//         url: `/${tenantSlug}/accounts/landlords`,
//         parentKey: 'users-management',
//         allowedUserTypes: ['admin']
//       },
//       {
//         key: 'account-tenants',
//         label: 'Tenants',
//         url: `/${tenantSlug}/accounts/tenants`,
//         parentKey: 'users-management',
//         allowedUserTypes: ['landlord', 'admin']
//       }
//     ]
//   },
//   {
//     key: 'properties',
//     label: 'PROPERTIES',
//     isTitle: true,
//     allowedUserTypes: ['landlord', 'admin', 'tenant']
//   },
//   {
//     key: 'properties-management',
//     icon: 'iconamoon:home-duotone',
//     label: 'Apartments',
//     allowedUserTypes: ['landlord', 'admin', 'tenant'],
//     children: [
//       {
//         key: 'apartment-account',
//         label: 'Apartments',
//         url: `/${tenantSlug}/properties/apartments`,
//         parentKey: 'properties-management',
//         allowedUserTypes: ['landlord', 'admin']
//       },
//       {
//         key: 'apartment-view',
//         label: 'My Apartment',
//         url: `/${tenantSlug}/properties/my-apartment`,
//         parentKey: 'properties-management',
//         allowedUserTypes: ['tenant']
//       },
//       {
//         key: 'apartment-complaints',
//         label: 'Complaints',
//         url: `/${tenantSlug}/properties/complaints`,
//         parentKey: 'properties-management',
//         allowedUserTypes: ['landlord', 'admin', 'tenant']
//       },
//       {
//         key: 'apartment-units',
//         label: 'Units',
//         url: `/${tenantSlug}/properties/units`,
//         parentKey: 'properties-management',
//         allowedUserTypes: ['landlord', 'admin']
//       }
//     ]
//   },
//   {
//     key: 'financial',
//     label: 'FINANCIAL',
//     isTitle: true,
//     allowedUserTypes: ['landlord', 'admin', 'tenant']
//   },
//   {
//     key: 'rent-manager',
//     icon: 'iconamoon:coin-duotone',
//     label: 'Rent Manager',
//     url: `/${tenantSlug}/rent-manager`,
//     allowedUserTypes: ['landlord', 'admin', 'tenant']
//   },
//   {
//     key: 'rent-cycles',
//     icon: 'iconamoon:calendar-duotone',
//     label: 'Rent Cycles',
//     url: `/${tenantSlug}/rent-accounts/cycles`,
//     allowedUserTypes: ['landlord', 'admin']
//   },
//   {
//     key: 'billing',
//     icon: 'iconamoon:receipt-duotone',
//     label: 'Billing',
//     url: `/${tenantSlug}/billing`,
//     allowedUserTypes: ['tenant']
//   },
//   {
//     key: 'tenant-features',
//     label: 'TENANT FEATURES',
//     isTitle: true,
//     allowedUserTypes: ['tenant']
//   },
//   {
//     key: 'classes',
//     icon: 'iconamoon:book-duotone',
//     label: 'Classes',
//     url: `/${tenantSlug}/classes`,
//     allowedUserTypes: ['tenant']
//   },
//   {
//     key: 'community',
//     icon: 'iconamoon:users-duotone',
//     label: 'Community',
//     url: `/${tenantSlug}/community`,
//     allowedUserTypes: ['tenant']
//   },
//   {
//     key: 'maintenance',
//     icon: 'iconamoon:tool-duotone',
//     label: 'Maintenance Requests',
//     url: `/${tenantSlug}/maintenance`,
//     allowedUserTypes: ['tenant']
//   },
//   {
//     key: 'admin-features',
//     label: 'ADMINISTRATION',
//     isTitle: true,
//     allowedUserTypes: ['admin']
//   },
//   {
//     key: 'system-settings',
//     icon: 'iconamoon:settings-duotone',
//     label: 'System Settings',
//     url: `/${tenantSlug}/system-settings`,
//     allowedUserTypes: ['admin']
//   },
//   {
//     key: 'reports',
//     icon: 'iconamoon:chart-duotone',
//     label: 'Reports',
//     url: `/${tenantSlug}/reports`,
//     allowedUserTypes: ['admin']
//   }
// ];