<template>
  <div>
    <q-expansion-item
      expand-separator
      :icon="src"
      :label="name"
      default-closed
      :header-inset-level="level"
      :switch-toggle-side="false"
      :hide-expand-icon="isHideIcon"
      expand-icon-toggle
      v-model="expand"
    >
      <template #header>
        <q-item clickable class="row full-width" @click="expand = !expand">
          <div class="flex flex-center">
            <q-icon :name="src" size="1.5rem" class="q-mr-sm" v-if="icon" />
            <q-avatar v-else size="1.5rem" class="q-mr-sm">
              <img :src="src"
            /></q-avatar>
            {{ name }}
            {{ isVisible ? "" : " - (Hidden)" }}
          </div>
        </q-item>
        <div class="flex flex-center q-mr-sm row">
          <q-icon
            name="add"
            size="1.5rem"
            class="cursor-pointer"
            @click="showAddCategory = !showAddCategory"
          />
        </div>
        <div class="flex flex-center q-mr-sm row">
          <q-icon
            name="edit"
            size="1.5rem"
            class="cursor-pointer"
            @click="editState = !editState"
          />
        </div>
        <div class="flex flex-center q-mr-sm row">
          <q-icon
            name="delete"
            size="1.5rem"
            class="cursor-pointer"
            @click="showConfirm = true"
          />
        </div>
      </template>
      <div v-if="childInfo">
        <ManageDropDownComponent
          v-for="item in childInfo"
          :key="item.id"
          v-bind="item"
          :level="this.level + 0.25"
          @updateRemove="getChildCategoryInfo"
        />
      </div>
    </q-expansion-item>
    <EditComponentDialog
      v-model="editState"
      v-bind="toEdit"
      @confirmIt="editConfirm"
    />
    <ConfirmDialog
      v-model="showConfirm"
      :name="this.name"
      :src="this.src"
      :icon="this.icon"
      @confirmPlease="removeCategory"
    />
    <AddCategoryDialog @addIt="addCategory" v-model="showAddCategory" />
  </div>
</template>
<script>
import { defineComponent } from "vue";
import { useMockDatabase } from "src/stores/database";
import { useStoreUser } from "src/stores/user";
import EditComponentDialog from "./EditComponentDialog.vue";
import ConfirmDialog from "./ConfirmDialog.vue";
import AddCategoryDialog from "./AddCategoryDialog.vue";

export default defineComponent({
  name: "ManageDropDownComponent",
  props: {
    id: { type: String },
    parent: { type: String },
    name: { type: String },
    icon: { type: Boolean },
    src: { type: String },
    haveChild: { type: Boolean },
    level: { type: Number },
    isVisible: { type: Boolean },
  },
  data() {
    return {
      database: useMockDatabase(),
      userStore: useStoreUser(),
      childInfo: null,
      isHideIcon: true,
      expand: false,
      editState: false,
      showConfirm: false,
      confirmDelete: false,
      toEdit: {
        id: this.id,
        name: this.name,
        src: this.src,
        isVisible: this.isVisible ? true : false,
        parent: this.parent,
        icon: this.icon ? true : false,
      },
      showAddCategory: false,
    };
  },
  methods: {
    getChildCategoryInfo() {
      const headers = {
        "access-token": this.userStore.accessToken,
      };
      this.$api
        .get(`/category/admin/child/${this.id}`, { headers })
        .then((res) => {
          this.childInfo = res.data;
          if (res.data.length == 0) {
            this.isHideIcon = true;
          } else {
            this.isHideIcon = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    removeCategory() {
      const headers = {
        "access-token": this.userStore.accessToken,
      };
      this.$api
        .delete(`/category/admin/del/${this.id}`, { headers })
        .then((res) => {
          this.$emit("updateRemove");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    editConfirm(info) {
      const headers = {
        "access-token": this.userStore.accessToken,
      };
      this.$api
        .put(`/category/admin/up/${this.id}`, info, { headers })
        .then((res) => {
          this.editState = false;
          this.$emit("updateRemove");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addCategory(info) {
      let data = {
        parent: this.id,
        ...info,
      };
      const headers = {
        "access-token": this.userStore.accessToken,
      };
      this.$api
        .post(`/category/admin/add`, data, { headers })
        .then((res) => {
          this.showAddCategory = false;
          this.getChildCategoryInfo();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    this.getChildCategoryInfo();
  },
  components: { EditComponentDialog, ConfirmDialog, AddCategoryDialog },
});
</script>
