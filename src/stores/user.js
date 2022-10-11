import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

export const useStoreUser = defineStore("user", {
  state: () => ({
    userid: useStorage("userid", ""),
    username: useStorage("username", ""),
    name: useStorage("name", ""),
    accessToken: useStorage("accessToken", ""),
    img: useStorage("img", ""),
    admin: useStorage("admin", false),
  }),

  getters: {
    // doubleCount(state) {
    //   return state.counter * 2;
    // },
    getUserId(state) {
      return state.userid;
    },
    getUsername(state) {
      return state.username;
    },
    getName(state) {
      return state.name;
    },
    getAccessToken(state) {
      return state.accessToken;
    },
    getImg(state) {
      return state.img;
    },
    getAdmin(state) {
      return state.admin;
    },
  },

  actions: {
    reset() {
      this.userid = "";
      this.username = "";
      this.accessToken = "";
      this.img = "";
      this.name = "";
      this.admin = false;
    },
  },
});
