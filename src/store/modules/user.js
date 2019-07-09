import { login, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import router, { resetRouter } from "@/router";

const state = {
  token: getToken(),
  name: "",
  avatar: "",
  introduction: "",
  roles: []
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  }
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      // login({ username: username.trim(), password: password })
      //   .then(response => {
      //     alert("正确");
      //     // const { data } = response
      //     // xiaofang
      //     let data = {
      //       token: "admin-token"
      //     };
      //     alert(data.token);
      //     commit("SET_TOKEN", data.token);
      //     setToken(data.token);
      //     resolve();
      //   })
      //   .catch(error => {
      //     alert("错误");
      //     reject(error);
      //   });

      let data = {
        token: "admin-token"
      };
      commit("SET_TOKEN", data.token);
      setToken(data.token);
      resolve();
    });
  },

  //获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      //对接后台API，前端可以根据后台数据进行测试
      // getInfo(state.token)
      //   .then(response => {
      //     // const { data } = response;
      //     const data = {
      //       roles: ["admin"],
      //       introduction: "I am a super administrator",
      //       avatar:
      //         "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
      //       name: "Super Admin"
      //     };
      //     const { roles, name, avatar, introduction } = data;
      //     commit("SET_ROLES", roles);
      //     commit("SET_NAME", name);
      //     commit("SET_AVATAR", avatar);
      //     commit("SET_INTRODUCTION", introduction);
      //     resolve({ roles: ["admin"] });
      //   })
      //   .catch(error => {
      //     reject(error);
      //   });
      //前端自己写数据进行测试
      const data = {
        roles: ["admin"],
        introduction: "I am a super administrator",
        avatar:
          "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
        name: "Super Admin"
      };
      const { roles, name, avatar, introduction } = data;
      commit("SET_ROLES", roles);
      resolve({ roles: ["admin"] });
    });
  },

  //用户注销
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      //   logout(state.token)
      //     .then(() => {
      //       commit("SET_TOKEN", "");
      //       commit("SET_ROLES", []);
      //       removeToken();
      //       resetRouter();
      //       resolve();
      //     })
      //     .catch(error => {
      //       reject(error);
      //     });
      commit("SET_TOKEN", "");
      commit("SET_ROLES", []);
      removeToken();
      resetRouter();
      resolve();
    });
  },

  //删除token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit("SET_TOKEN", "");
      commit("SET_ROLES", []);
      removeToken();
      resolve();
    });
  },

  //动态更换角色权限
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + "-token";
      commit("SET_TOKEN", token);
      setToken(token);
      const { roles } = await dispatch("getInfo");
      resetRouter();

      // 根据角色生成可访问路由映射
      const accessRoutes = await dispatch("permission/generateRoutes", roles, {
        root: true
      });
      console.warn("动态加载路由");
      console.warn(accessRoutes);
      // dynamically add accessible routes
      router.addRoutes(accessRoutes);
      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
