import {createRouter, createWebHistory, createWebHashHistory} from "vue-router";

import store from "./store";
import Dashboard from "./views/Dashboard.vue";
import AgregarNoticia from "./views/noticias/registrar.vue";
import EditarNoticia from "./views/noticias/editar.vue";
import InformacionFinanciera from "./views/informacion-financiera/index.vue";
import AgregarInformacionFinanciera from "./views/informacion-financiera/registrar.vue";
import EditarInformacionFinanciera from "./views/informacion-financiera/editar.vue";
import Noticias from "./views/noticias/index.vue";
import UIElements from "./views/UIElements.vue";
import Acceso from "./views/Acceso.vue";
import Login from "./views/login.vue";
import Logout from "./views/logout.vue";
import NotFound from "./views/NotFound.vue";

const routes = [
  {
    path: "/",
    redirect: "/dashboard",
    component: Dashboard,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/noticias",
    name: "Noticias",
    component: Noticias,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/agregar-nueva-noticia",
    name: "AgregarNoticia",
    component: AgregarNoticia,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/editar-noticia/idnew/:idnew",
    name: "EditarNoticia",
    component: EditarNoticia,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/informacion-financiera",
    name: "InformacionFinanciera",
    component: InformacionFinanciera,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/agregar-informacion-financiera",
    name: "AgregarInformacionFinanciera",
    component: AgregarInformacionFinanciera,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/editar-informacion-financiera/idinfo/:idinfo",
    name: "EditarInformacionFinanciera",
    component: EditarInformacionFinanciera,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/ui-elements",
    name: "UIElements",
    component: UIElements,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      layout: "empty",
      requiresAuth: false,
    },
  },
  {
    path: "/logout",
    name: "Logout",
    component: Logout,
    meta: {
      layout: "empty",
      requiresAuth: false,
    },
  },
  {
    path: "/sso/acceso",
    name: "Acceso",
    component: Acceso,
    meta: {
      layout: "empty",
      requiresAuth: false,
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next();
      return;
    }
    next("/login");
  } else {
    next();
  }
});

export default router;
