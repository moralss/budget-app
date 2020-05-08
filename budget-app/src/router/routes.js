/* eslint-disable no-constant-condition */
import store from '../store'
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: {
      requiresAuth: true,
      requiresProperty: true
    },
    children: [
      {
        path: '',
        component: () => import('pages/home.vue'),
        meta: {
          toolbarHeader: 'Home'
        }
      },

      {
        path: '/dashboard/:id',
        component: () => import('pages/Dashboard.vue'),
        meta: {
          toolbarHeader: 'Dashboard'
        }
      }
    ]
  },
  {
    component: () => import('layouts/AuthLayout.vue'),
    path: '/',
    children: [{
      path: '/login',
      name: 'login',
      component: () => import('pages/auth/login.vue'),
      beforeEnter (to, from, next) {
        if (store.getters.isAuthenticated) {
          next('')
        } else {
          next()
        }
      }
    },
    // {
    //   path: '/sign-in',
    //   name: 'sign-in',
    //   component: () => import('pages/auth/sign-in.vue')
    // },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: () => import('pages/auth/sign-up.vue'),
      beforeEnter (to, from, next) {
        if (store.getters.isAuthenticated) {
          next('')
        } else {
          next()
        }
      }
    }
      //  {
      //   path: '/forgot-password',
      //   name: 'forgot-password',
      //   component: () => import('pages/auth/forgot-password.vue')
      // }, {
      //   path: '/action',
      //   name: 'action',
      //   component: () => import('pages/auth/action.vue')
      // }
    ]
  }
]
// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
