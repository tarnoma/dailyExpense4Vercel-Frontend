<template>
  <q-page padding>
    <q-tabs
      v-model="tab"
      flat
      active-color="white"
      indicator-color="white"
      class="rounded-borders bg-grey-10 text-white"
      align="justify"
      narrow-indicator
    >
      <q-tab name="users" label="Manage Users" />
      <q-tab name="category" label="Manage Categories" />
    </q-tabs>
    <q-separator />
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="users">
        <ManageUserComponent />
      </q-tab-panel>

      <q-tab-panel name="category">
        <ManageCategoryComponent ref="managecategory" />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>
<script>
import { useStoreUser } from "src/stores/user";
import { defineComponent } from "vue";
import ManageUserComponent from "src/components/ManageUserComponent.vue";
import ManageCategoryComponent from "src/components/ManageCategoryComponent.vue";
export default defineComponent({
  name: "ManagementPage",
  data() {
    return {
      userStore: useStoreUser(),
      tab: "users",
    };
  },
  created() {
    if (!this.userStore.userid || !this.userStore.admin) this.$router.push("/");
  },
  components: { ManageUserComponent, ManageCategoryComponent },
});
</script>
