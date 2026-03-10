import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/setup',
    name: 'Setup',
    component: () => import('../views/Setup.vue')
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    children: [
      {
        path: '',
        name: 'Chat',
        component: () => import('../views/Chat.vue')
      },
      {
        path: 'reminders',
        name: 'Reminders',
        component: () => import('../views/Reminders.vue')
      },
      {
        path: 'emergency',
        name: 'Emergency',
        component: () => import('../views/Emergency.vue')
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/Profile.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userId = localStorage.getItem('userId')

  if (!userId && to.path !== '/login' && to.path !== '/register') {
    next('/login')
  } else if (userId && (to.path === '/login' || to.path === '/register')) {
    next('/')
  } else {
    next()
  }
})

export default router
