<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-grey-10 text-white flex">
        <q-btn icon="menu" flat @click="drawerOpen = !drawerOpen" />
        <q-item clickable href="/">
          <q-icon name="table_chart" size="2rem" />
          <q-toolbar-title> Daily Exprense Tracker </q-toolbar-title>
        </q-item>
        <q-toolbar-title />
        <div v-if="userStore.userid" class="row">
          <q-item>
            <q-avatar size="2.5rem">
              <img :src="userStore.img" v-if="userStore.img" />
              <q-icon name="account_circle" size="2.5rem" v-else />
            </q-avatar>
            <q-btn
              color="white"
              class="bg-grey-10 q-ml-sm"
              flat
              @click="logout"
              rounded
            >
              <q-icon name="logout"
            /></q-btn>
          </q-item>
        </div>
        <div v-else class="row">
          <q-item clickalbe href="/login">
            <q-icon name="account_circle" size="2.5rem" />
          </q-item>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawerOpen" :width="200" :breakpoint="400">
      <div style="padding: 5px" align="center">
        <div v-if="userStore.userid" class="flex flex-center column">
          <q-avatar size="4rem" class="q-mb-sm">
            <img :src="userStore.img" v-if="userStore.img" />
            <q-icon name="account_circle" size="4rem" v-else />
          </q-avatar>
          <div class="q-mb-sm">
            {{ userStore.name }}
          </div>
          <q-btn
            label="Logout"
            color="white"
            class="bg-grey-10 q-mb-sm"
            @click="logout"
          />
        </div>
        <div v-else class="flex flex-center column">
          <q-icon name="account_circle" size="4rem" />
          Guest
        </div>
      </div>

      <q-separator />
      <q-scroll-area
        style="height: calc(100% - 200px); border-right: 1px solid #ddd"
      >
        <q-list padding>
          <q-item clickable v-ripple href="/">
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>

            <q-item-section> Home </q-item-section>
          </q-item>
          <div v-if="userStore.userid">
            <q-item clickable v-ripple href="/dashboard">
              <q-item-section avatar>
                <q-icon name="dashboard" />
              </q-item-section>

              <q-item-section> Dashboard </q-item-section>
            </q-item>

            <q-item clickable v-ripple href="/list">
              <q-item-section avatar>
                <q-icon name="list" />
              </q-item-section>

              <q-item-section> List My Expenses </q-item-section>
            </q-item>
            <q-item clickable v-ripple href="/expenses">
              <q-item-section avatar>
                <q-icon name="dashboard_customize" />
              </q-item-section>

              <q-item-section> Add Expenses </q-item-section>
            </q-item>

            <q-item
              clickable
              v-ripple
              href="/management"
              v-if="userStore.admin"
            >
              <q-item-section avatar>
                <q-icon name="manage_accounts" />
              </q-item-section>

              <q-item-section> Manage System </q-item-section>
            </q-item>
          </div>
          <div v-else>
            <q-item clickable v-ripple href="/login">
              <q-item-section avatar>
                <q-icon name="login" />
              </q-item-section>

              <q-item-section> Login </q-item-section>
            </q-item>

            <q-item clickable v-ripple href="/register">
              <q-item-section avatar>
                <q-icon name="person_add" />
              </q-item-section>

              <q-item-section> Register </q-item-section>
            </q-item>
          </div>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useStoreUser } from "stores/user";
import { Notify } from "quasar";
import { useMockDatabase } from "src/stores/database";

export default defineComponent({
  name: "MainLayout",
  setup() {
    return {};
  },
  data() {
    return {
      drawerOpen: true,
      imgBackGroundIcon: "iconBackground.jpg",
      userStore: useStoreUser(),
      database: useMockDatabase(),
      test: false,
    };
  },
  methods: {
    logout() {
      this.userStore.reset();
      this.$router.push("/");
      Notify.create({
        type: "info",
        message: "Logout successfully!",
      });
    },
  },
});
</script>
