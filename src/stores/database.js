import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

export const useMockDatabase = defineStore("database", {
  state: () => ({
    countUser: useStorage("countUser", 10),
    countCategory: useStorage("countCategory", 10),
    countRecord: useStorage("countRecord", 25),
    users: useStorage("users", [
      {
        id: "1",
        username: "pooh",
        password: "pooh123",
        name: "Phubadee",
        active: true,
        img: "https://media.newyorker.com/photos/59095bb86552fa0be682d9d0/master/w_2560%2Cc_limit/Monkey-Selfie.jpg",
        accessToken: "testestnotoken",
        admin: true,
        email: "test@test.com",
      },
    ]),
    category: useStorage("category", [
      {
        id: "1",
        parent: "",
        name: "Travel",
        icon: true,
        src: "flight",
        isVisible: true,
      },
      {
        id: "2",
        parent: "1",
        name: "Car",
        icon: true,
        src: "directions_bus",
        isVisible: true,
      },
      {
        id: "3",
        parent: "1",
        name: "Boat",
        icon: true,
        src: "sailing",
        isVisible: true,
      },
      {
        id: "4",
        parent: "2",
        name: "Bus",
        icon: true,
        src: "local_shipping",
        isVisible: true,
      },
      {
        id: "5",
        parent: "",
        name: "Eating",
        icon: true,
        src: "restaurant",
        isVisible: true,
      },
      {
        id: "6",
        parent: "5",
        name: "Foods",
        icon: true,
        src: "lunch_dining",
        isVisible: true,
      },
      {
        id: "7",
        parent: "5",
        name: "Drinks",
        icon: true,
        src: "nightlife",
        isVisible: true,
      },
    ]),
    spentRecords: useStorage("spentRecords", [
      {
        id: "0",
        userId: "1",
        categoryId: "1",
        spent: "123.22",
        date: "9/27/2022",
      },
      {
        id: "1",
        userId: "1",
        categoryId: "2",
        spent: "99.55",
        date: "9/28/2022",
      },
      {
        id: "2",
        userId: "1",
        categoryId: "2",
        spent: "1231.22",
        date: "9/29/2022",
      },
      {
        id: "3",
        userId: "1",
        categoryId: "3",
        spent: "99.55",
        date: "9/30/2022",
      },
      {
        id: "4",
        userId: "1",
        categoryId: "4",
        spent: "123.22",
        date: "10/1/2022",
      },
      {
        id: "5",
        userId: "1",
        categoryId: "5",
        spent: "99.55",
        date: "10/1/2022",
      },
      {
        id: "6",
        userId: "1",
        categoryId: "1",
        spent: "123.22",
        date: "10/1/2022",
      },
      {
        id: "7",
        userId: "1",
        categoryId: "2",
        spent: "99.55",
        date: "10/1/2022",
      },
    ]),
  }),

  getters: {
    getUsers(state) {
      return state.users;
    },
    getExpenses(state) {
      return state.spentRecords;
    },
    getCategory(state) {
      return state.category;
    },
    getCounterUser(state) {
      return state.countUser;
    },
    getCounterCategory(state) {
      return state.countCategory;
    },
    getCounterRecord(state) {
      return state.countRecord;
    },
  },
  actions: {
    tryLogin(username, password) {
      var res = this.getUsers.find(
        (user) => user.username == username && user.active == true
      );
      if (res == null) return null;
      if (res.password == password) {
        return {
          userid: res.id,
          username: res.username,
          accessToken: res.accessToken,
          img: res.img,
          admin: res.admin,
          name: res.name,
        };
      }
      return null;
    },
    checkUsername(username) {
      var res = this.getUsers.find((user) => user.username == username);
      if (res == null) return true;
      else return false;
    },
    registerUser(name, email, username, password, img) {
      if (this.checkUsername(username)) {
        this.users.push({
          id: `${this.getCounterUser + 1}`,
          username: username,
          password: password,
          email: email,
          active: true,
          admin: false,
          accessToken: "testtestnotoken",
          name: name,
          img: img,
          active: true,
        });
        this.countUser++;
        return this.tryLogin(username, password);
      }
      return null;
    },
    checkValidUser(userid, accessToken) {
      var a = this.getUsers.find(
        (user) => (user.id == userid) != null && user.accessToken == accessToken
      );
      if (a != null) return true;
      else return false;
    },
    checkAdminUser(userid, accessToken) {
      var a = this.getUsers.find(
        (user) =>
          (user.id == userid) != null &&
          user.accessToken == accessToken &&
          user.admin == true
      );
      if (a != null) return true;
      else return false;
    },
    getMyExpeneses(userid, accessToken) {
      if (this.checkValidUser(userid, accessToken)) {
        return this.getExpenses.filter((item) => item.userId == userid);
      } else {
        return null;
      }
    },
    getCategoryName(userid, accessToken, categoryId) {
      if (this.checkValidUser(userid, accessToken)) {
        var a = this.getCategory.find(
          (item) => item.id == categoryId && item.isVisible == true
        );
        if (a != null) return a.name;
        else return null;
      } else {
        return null;
      }
    },
    getChildCategoryInfo(userid, accessToken, categoryId) {
      if (this.checkValidUser(userid, accessToken)) {
        var a = this.getCategory.filter(
          (item) => item.parent == categoryId && item.isVisible == true
        );
        if (a != null) return a;
        else return null;
      } else {
        return null;
      }
    },
    getBaseCategory(userid, accessToken) {
      if (this.checkValidUser(userid, accessToken)) {
        return this.getCategory.filter(
          (item) => item.parent == "" && item.isVisible == true
        );
      } else {
        return null;
      }
    },
    addExpense(userid, accessToken, categoryId, amountSpent) {
      if (this.checkValidUser(userid, accessToken)) {
        var today = new Date();
        this.spentRecords.push({
          id: this.getCounterRecord + 1,
          userId: userid,
          categoryId: categoryId,
          spent: amountSpent,
          date: today.toLocaleDateString(),
        });
        this.countRecord++;
      }
    },
    adminGetUsers(userid, accessToken) {
      if (this.checkAdminUser(userid, accessToken)) {
        return this.getUsers;
      }
    },
    adminSetStatus(userid, accessToken, targetId, status) {
      if (this.checkAdminUser(userid, accessToken)) {
        this.getUsers.forEach((item, index) => {
          if (item.id == targetId) {
            this.users[index].active = status;
          }
        });
      }
    },
    adminRemoveCategory(userid, accessToken, categoryId) {
      if (this.checkAdminUser(userid, accessToken)) {
        this.category = this.getCategory.filter(
          (item) => item.id != categoryId
        );
        var findChild = this.getCategory.filter(
          (item) => item.parent == categoryId
        );
        for (const i in findChild) {
          this.adminRemoveCategory(userid, accessToken, findChild[i].id);
        }
      }
    },
    adminGetBaseCategory(userid, accessToken) {
      if (this.checkAdminUser(userid, accessToken)) {
        return this.getCategory.filter((item) => item.parent == "");
      } else {
        return null;
      }
    },
    adminGetChildCategoryInfo(userid, accessToken, categoryId) {
      if (this.checkAdminUser(userid, accessToken)) {
        var a = this.getCategory.filter((item) => item.parent == categoryId);
        if (a != null) return a;
        else return null;
      } else {
        return null;
      }
    },
    adminUpdateCategory(userid, accessToken, info) {
      if (this.checkAdminUser(userid, accessToken)) {
        this.getCategory.forEach((item, index) => {
          if (item.id == info.id) {
            this.category[index].isVisible = info.isVisible;
            this.category[index].name = info.name;
            this.category[index].icon = info.icon;
            this.category[index].src = info.src;
          }
        });
      }
    },
    adminAddCategory(userid, accessToken, info, parent) {
      if (this.checkAdminUser(userid, accessToken)) {
        this.category.push({
          id: this.getCounterCategory + 1,
          parent: parent,
          name: info.name,
          icon: info.icon,
          src: info.src,
          isVisible: true,
        });
        this.countCategory++;
      }
    },
    setCategory() {
      this.category = [
        {
          id: "1",
          parent: "",
          name: "Travel",
          icon: true,
          src: "flight",
          isVisible: true,
        },
        {
          id: "2",
          parent: "1",
          name: "Car",
          icon: true,
          src: "directions_bus",
          isVisible: true,
        },
        {
          id: "3",
          parent: "1",
          name: "Boat",
          icon: true,
          src: "sailing",
          isVisible: true,
        },
        {
          id: "4",
          parent: "2",
          name: "Bus",
          icon: true,
          src: "local_shipping",
          isVisible: true,
        },
        {
          id: "5",
          parent: "",
          name: "Eating",
          icon: true,
          src: "restaurant",
          isVisible: true,
        },
        {
          id: "6",
          parent: "5",
          name: "Foods",
          icon: true,
          src: "lunch_dining",
          isVisible: true,
        },
        {
          id: "7",
          parent: "5",
          name: "Drinks",
          icon: true,
          src: "nightlife",
          isVisible: true,
        },
      ];
    },
  },
});
