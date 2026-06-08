export const MENU_ITEMS = (tenantSlug = "") => [{
    key: 'dashboard-finance',
    icon: 'iconamoon:home-duotone',
    label: 'Dashboard',
    url: `/${tenantSlug}/dashboard/finance`,
    allowedUserTypes: ['landlord', 'tenant', 'admin'],
    parentKey: 'dashboards'
  },{
  key: 'users',
  icon: 'iconamoon:profile-circle-duotone',
  label: 'Accounts',
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
    key: 'apartment-account',
    icon: 'iconamoon:home-duotone',
    label: 'Apartments',
    url: `/${tenantSlug}/properties/apartments`,
    allowedUserTypes: ['landlord'],
    parentKey: 'properties'
  }, {
    key: 'apartment-complaints',
    icon: 'iconamoon:home-duotone',
    label: 'Complaints',
    url: `/${tenantSlug}/properties/complaints`,
    allowedUserTypes: ['tenant']
  }, {
    key: 'tenant-complaints',
    icon: 'iconamoon:home-duotone',
    label: 'Tenants Complaints',
    url: `/${tenantSlug}/properties/tenant-complaints`,
    allowedUserTypes: ['landlord']
  }, 
  , {
    key: 'add-documents',
    icon: 'iconamoon:home-duotone',
    label: 'Add Documents',
    url: `/${tenantSlug}/landlordforms/createtemplate`,
    allowedUserTypes: ['landlord'],
    parentKey: 'properties'
  }, {
    key: 'maintenance-complaints',
    icon: 'iconamoon:home-duotone',
    label: 'Maintenance Complaints',
    url: `/${tenantSlug}/properties/maintenance-complaints`,
    allowedUserTypes: ['tenant']
  }, {
  key: 'rent-manager',
  icon: 'iconamoon:home-duotone',
  label: 'Rent Manager',
  url: `/${tenantSlug}/rent-manager`,
  allowedUserTypes: ['landlord']
}];





// export const MENU_ITEMS = (tenantSlug = "") => [{
//   key: 'general',
//   label: 'GENERAL',
//   isTitle: true
// }, {
//   key: 'dashboards',
//   icon: 'iconamoon:home-duotone',
//   label: 'Dashboards',
//   children: [{
//     key: 'dashboard-sales',
//     label: 'Sales',
//     url: `/${tenantSlug}/dashboard/sales`,
//     allowedUserTypes: ['landlord', 'tenant', 'admin'],
//     parentKey: 'dashboards'
//   }]
// }, {
//   key: 'users',
//   label: 'USERS',
//   isTitle: true
// }, {
//   key: 'users',
//   icon: 'iconamoon:profile-circle-duotone',
//   label: 'Account',
//   children: [{
//     key: 'account-admin',
//     label: 'Admins',
//     url: `/${tenantSlug}/accounts/admin`,
//     allowedUserTypes: ['landlord', 'tenant', 'admin'],
//     parentKey: 'users'
//   }, {
//     key: 'account-roles',
//     label: 'User Types',
//     url: `/${tenantSlug}/accounts/user-types`,
//     allowedUserTypes: ['landlord'],
//     parentKey: 'users'
//   }, {
//     key: 'account-landlords',
//     label: 'Landlords',
//     url: `/${tenantSlug}/accounts/landlords`,
//     allowedUserTypes: ['landlord'],
//     parentKey: 'users'
//   }, {
//     key: 'account-tenants',
//     label: 'Tenants',
//     url: `/${tenantSlug}/accounts/tenants`,
//     allowedUserTypes: ['landlord'],
//     parentKey: 'users'
//   }]
// }, {
//   key: 'properties',
//   label: 'PROPERTIES',
//   isTitle: true
// }, {
//   key: 'properties',
//   icon: 'iconamoon:home-duotone',
//   label: 'Apartments',
//   children: [{
//     key: 'apartment-account',
//     label: 'Apartments',
//     url: `/${tenantSlug}/properties/apartments`,
//     allowedUserTypes: ['landlord'],
//     parentKey: 'properties'
//   }, {
//     key: 'apartment-complaints',
//     label: 'Complaints',
//     url: `/${tenantSlug}/properties/complaints`,
//     allowedUserTypes: ['tenant'],
//     parentKey: 'properties'
//   }]
// }, {
//   key: 'rent-manager',
//   icon: 'iconamoon:home-duotone',
//   label: 'Rent Manager',
//   url: `/${tenantSlug}/rent-manager`,
//   allowedUserTypes: ['landlord'],
// }];





