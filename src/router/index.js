import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

// 任何权限共有的路由
export const constantRoutes = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path*",
        component: () => import("@/views/redirect/index")
      }
    ]
  },
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },
  {
    path: "/",
    component: Layout,
    redirect: "/user/index",
    children: [
      {
        path: "/user/index",
        component: () => import("@/views/user/index"),
        name: "user",
        meta: { title: "用户管理", icon: "el-icon-user", affix: true }
      }
    ]
  },
  {
    path: "/role",
    component: Layout,
    children: [
      {
        path: "index",
        component: () => import("@/views/role/index"),
        name: "role",
        meta: { title: "角色管理", icon: "el-icon-s-check", affix: true }
      }
    ]
  },
  {
    path: "/permission",
    component: Layout,
    children: [
      {
        path: "index",
        component: () => import("@/views/permission/index"),
        name: "permission",
        meta: { title: "权限管理", icon: "el-icon-unlock", affix: true }
      }
    ]
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404"),
    hidden: true
  }
];

/**
 * asyncRoutes
 * 需要根据用户角色动态加载的路由
 */
export const asyncRoutes = [{ path: "*", redirect: "/404", hidden: true }];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
