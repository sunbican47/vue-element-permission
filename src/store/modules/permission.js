import { asyncRoutes, constantRoutes } from "@/router";
import Layout from "@/layout";
const _import = require("@/router/_import_development"); //获取组件的方法,开发环境下
// const _import = require("@/router/_import_production"); //获取组件的方法，生产环境下

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(asyncRouterMap) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (route.component) {
      if (route.component === "Layout") {
        //Layout组件特殊处理
        route.component = Layout;
      } else {
        route.component = _import(route.component);
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRoutes(route.children);
    }
    return true;
  });
  return accessedRouters;
}

const state = {
  routes: [],
  addRoutes: []
};

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes;
    state.routes = constantRoutes.concat(routes);
  }
};

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      // xiaofang
      let accessedRoutes;
      accessedRoutes = [
        {
          path: "/icon",
          component: "Layout",
          children: [
            {
              path: "index",
              component: "icons/index",
              name: "Icons",
              meta: {
                title: "专属图标",
                icon: "el-icon-s-flag",
                noCache: true
              }
            }
          ]
        },
        {
          path: "/permission",
          component: "Layout",
          redirect: "/permission/page",
          alwaysShow: true, // will always show the root menu
          name: "Permission",
          meta: {
            title: "我的专属",
            icon: "el-icon-s-grid",
            roles: ["admin", "editor"] // you can set roles in root nav
          },
          children: [
            {
              path: "page",
              component: "private-page/page",
              name: "PagePermission",
              meta: {
                title: "Page Permission",
                roles: ["admin"] // or you can only set roles in sub nav
              },
              children: [
                {
                  path: "page",
                  component: "private-page/page",
                  name: "PagePermission",
                  meta: {
                    title: "Page Permission1",
                    roles: ["admin"] // or you can only set roles in sub nav
                  }
                },
                {
                  path: "directive",
                  component: "private-page/page",
                  name: "PagePermission",
                  meta: {
                    title: "Page Permission2",
                    roles: ["admin"] // or you can only set roles in sub nav
                  }
                }
              ]
            },
            {
              path: "directive",
              component: "private-page/directive",
              name: "DirectivePermission",
              meta: {
                title: "Directive Permission"
                // if do not set roles, means: this page does not require permission
              }
            },
            {
              path: "role",
              component: "private-page/role",
              name: "RolePermission",
              meta: {
                title: "Role Permission",
                roles: ["admin"]
              }
            }
          ]
        }
      ];
      accessedRoutes = filterAsyncRoutes(accessedRoutes);
      console.warn(roles);
      console.warn(accessedRoutes);
      commit("SET_ROUTES", accessedRoutes);
      resolve(accessedRoutes);
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
