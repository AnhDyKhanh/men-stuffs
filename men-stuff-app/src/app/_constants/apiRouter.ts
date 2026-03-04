export const API_ROUTES = {
  GUEST: {
    CART: {
      GET_CUSTOMER_CURRENT_CART: '/api/guest/cart',
    },
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
}