<template>
  <q-card flat bordered>
    <q-card-section>
      <div class="float-left text-bold">Category List</div>
      <div class="float-right flex flex-center text-bold">
        Add category
        <q-icon
          name="add"
          size="1.5rem"
          class="q-ml-sm cursor-pointer"
          @click="showAddCategory = !showAddCategory"
        />
      </div>
    </q-card-section>
    <q-separator class="q-mt-md" />
    <q-card-section>
      <ManageDropDownComponent
        v-for="item in this.baseCategoryInfo"
        :key="item.id"
        v-bind="item"
        :level="0"
        @updateRemove="getBaseCat"
      />
    </q-card-section>
  </q-card>
  <AddCategoryDialog v-model="showAddCategory" @addIt="addCategory" />
</template>
<script>
import { useMockDatabase } from "src/stores/database";
import { useStoreUser } from "src/stores/user";
import { defineComponent, nextTick } from "vue";
import ManageDropDownComponent from "./ManageDropDownComponent.vue";
import AddCategoryDialog from "./AddCategoryDialog.vue";

export default defineComponent({
  name: "ManageCategoryComponent",
  data() {
    return {
      database: useMockDatabase(),
      userStore: useStoreUser(),
      baseCategoryInfo: null,
      showAddCategory: false,
    };
  },
  components: { ManageDropDownComponent, AddCategoryDialog },
  methods: {
    getBaseCat() {
      this.baseCategoryInfo = this.database.adminGetBaseCategory(
        this.userStore.userid,
        this.userStore.accessToken
      );
    },
    addCategory(info) {
      this.database.adminAddCategory(
        this.userStore.userid,
        this.userStore.accessToken,
        info,
        ""
      );
      this.getBaseCat();
      this.showAddCategory = false;
    },
  },
  created() {
    this.getBaseCat();
  },
});
</script>
