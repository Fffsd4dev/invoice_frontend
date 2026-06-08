export const MENU_ITEMS = [{
  key: 'general',
  label: 'GENERAL',
  isTitle: true
}, {
  key: 'dashboards',
  icon: 'iconamoon:category-duotone',
  label: 'Dashboards',
  children: [{
    key: 'dashboard-analytics',
    label: 'Analytics',
    url: '/dashboard/analytics',
    parentKey: 'dashboards'
  },
]
},
{
  key: 'companies',
  label: 'COMPANIES',
  isTitle: true
}, {
  key: 'companies',
  icon: 'iconamoon:home-duotone',
  label: 'Companies',
  children: [{
    key: 'companies',
    label: 'Companies',
    url: '/company/list',
    parentKey: 'companies'
  }],
}, {
  key: 'invoices',
  label: 'INVOICES',
  isTitle: true
}, {
  key: 'invoices',
  icon: 'iconamoon:home-duotone',
  label: 'Invoices',
  dynamic: true,
  children: [],
}];