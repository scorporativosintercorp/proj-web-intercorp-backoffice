//import Vue from "vue";
import axios from "axios";
import {createStore} from "vuex";

export default createStore({
  state: {
    status: "",
    token: localStorage.getItem("token") || "",
    user: {},
  },
  mutations: {
    auth_request(state) {
      state.status = "loading";
    },
    auth_success(state, token, user) {
      state.status = "success";
      state.token = token;
      state.user = user;
    },
    auth_error(state) {
      state.status = "error";
    },
    logout(state) {
      state.status = "";
      state.token = "";
    },
  },
  actions: {
    login({commit}, user) {
      return new Promise((resolve, reject) => {
        commit("auth_request");
        axios({url: import.meta.env.VITE_API_URL + "auth/login", data: user, method: "POST"})
          .then((resp) => {
            const token = resp.data.accessToken;
            const user = resp.data.username;
            const userid = resp.data.id;
            localStorage.setItem("token", token);
            localStorage.setItem("username", user);
            localStorage.setItem("userid", userid);
            // Add the following line:
            // axios.defaults.headers.common['Authorization'] = token
            axios.defaults.headers.common["x-access-token"] = token;
            commit("auth_success", token, user);
            resolve(resp);
          })
          .catch((err) => {
            commit("auth_error");
            localStorage.removeItem("token");
            reject(err);
          });
      });
    },
    loginSSO({commit}, user) {
      return new Promise((resolve, reject) => {
        commit("auth_request");
        axios({url: import.meta.env.VITE_API_URL + "auth/loginSSO", data: user, method: "POST"})
          .then((resp) => {
            const token = resp.data.accessToken;
            const user = resp.data.username;
            const userid = resp.data.id;
            localStorage.setItem("token", token);
            localStorage.setItem("username", user);
            localStorage.setItem("userid", userid);
            // Add the following line:
            // axios.defaults.headers.common['Authorization'] = token
            axios.defaults.headers.common["x-access-token"] = token;
            commit("auth_success", token, user);
            resolve(resp);
          })
          .catch((err) => {
            commit("auth_error");
            localStorage.removeItem("token");
            reject(err);
          });
      });
    },
    logout({commit}) {
      return new Promise((resolve, reject) => {
        commit("logout");
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        resolve();
      });
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
    authStatus: (state) => state.status,
  },
});
