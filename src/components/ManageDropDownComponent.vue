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
        isVisible: this.isVisible,
        parent: this.parent,
        icon: this.icon,
      },
      showAddCategory: false,
    };
  },
  methods: {
    getChildCategoryInfo() {
      var info = this.database.adminGetChildCategoryInfo(
        this.userStore.userid,
        this.userStore.accessToken,
        this.id
      );
      if (info != null) {
        this.childInfo = info;
        if (info.length == 0) {
          this.isHideIcon = true;
        } else {
          this.isHideIcon = false;
        }
      } else {
        console.log("Error in DropDownListComponent! invalid category id!");
      }
    },
    removeCategory() {
      this.database.adminRemoveCategory(
        this.userStore.userid,
        this.userStore.accessToken,
        this.id
      );
      this.$emit("updateRemove");
    },
    editConfirm(info) {
      this.database.adminUpdateCategory(
        this.userStore.userid,
        this.userStore.accessToken,
        info
      );
      this.editState = false;
      this.$emit("updateRemove");
    },
    addCategory(info) {
      this.database.adminAddCategory(
        this.userStore.userid,
        this.userStore.accessToken,
        info,
        this.id
      );
      this.showAddCategory = false;
      this.getChildCategoryInfo();
    },
  },
  created() {
    this.getChildCategoryInfo();
  },
  components: { EditComponentDialog, ConfirmDialog, AddCategoryDialog },
});
</script>
