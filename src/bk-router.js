import Router from "vue-router";

import store from "./store";
import Dashboard from "./views/Dashboard.vue";
import AgregarNoticia from "./views/noticias/registrar.vue";
import EditarNoticia from "./views/noticias/editar.vue";
import InformacionFinanciera from "./views/informacion-financiera/index.vue";
import Noticias from "./views/noticias/index.vue";
import AgregarInformacionFinanciera from "./views/informacion-financiera/registrar.vue";
import UIElements from "./views/UIElements.vue";
import Acceso from "./views/Acceso.vue";
import Login from "./views/login.vue";
import NotFound from "./views/NotFound.vue";

Vue.use(Router);

let router = new Router({
  // linkActiveClass: "active",
  // scrollBehavior: () => ({y: 0}),
  // mode: "hash",
  routes: [
    {
      path: "/",
      redirect: "/dashboard",
      component: Dashboard,
      meta: {
        requiresAuth: true,
      },
    },
    //children: [
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
      path: "/editar-noticia",
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
      path: "/ui-elements",
      name: "UIElements",
      component: UIElements,
      meta: {
        requiresAuth: true,
      },
    },

    //],
    //},
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
      path: "/sso/acceso",
      name: "Acceso",
      component: Acceso,
      meta: {
        requiresAuth: false,
      },
    },
  ],
});
//{path: "/:pathMatch(.*)*", redirect: "/pages/error_404", name: "not-found", component: Blank},
//{path: "/:pathMatch(.*)", redirect: "/pages/error_404", name: "bad-not-found", component: Blank},

// const router = createRouter({
//   history: createWebHistory(),
//   routes: routes,
// });

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
