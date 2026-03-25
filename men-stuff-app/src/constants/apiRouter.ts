export const API_ROUTES = {
  GUEST: {
    ACCOUNT: {
      GET_CUSTOMER_ACCOUNT_INFOR: '/api/guest',
    },
    CART: {
      GET_CUSTOMER_CURRENT_CART: '/api/guest/cart',
    },
    ADD_TO_CART: '/api/guest/add-to-cart',
    PAYMENT: '/api/guest/payment',
  },
  PRODUCTS: {
    GET_ALL: '/api/admin/products',
    GET_BY_ID: '/api/admin/products/:id',
    POST: '/api/admin/products',
    PUT: '/api/admin/products/:id',
    DELETE: '/api/admin/products/:id',
  },
  CATEGORIES: {
    GET_ALL: '/api/admin/category',
  },
  ORDERS: {
    GET_ALL: '/api/admin/orders',
    GET_DETAIL: (id: string) => `/api/admin/orders/${id}`,
    PATCH_STATUS: (id: string) => `/api/admin/orders/${id}`,
  },
  COLLECTIONS: {
    PUBLIC: '/api/collections',
    ADMIN: '/api/admin/collections',
    ADMIN_ITEMS: (id: string) => `/api/admin/collections/${id}/items`,
    ADMIN_ONE: (id: string) => `/api/admin/collections/${id}`,
  },
}
