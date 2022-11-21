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
    >
      <template #header>
        <q-item
          clickable
          class="row full-width"
          @click="callToRef(this.id, this.name, this.icon, this.src)"
        >
          <div class="flex flex-center">
            <q-icon :name="src" size="1.5rem" class="q-mr-sm" v-if="icon" />
            <q-avatar v-else size="1.5rem" class="q-mr-sm">
              <img :src="src"
            /></q-avatar>
            {{ name }}
          </div>
        </q-item>
      </template>
      <div v-if="childInfo">
        <DropDownListComponent
          v-for="item in childInfo"
          :key="item.id"
          v-bind="item"
          :level="this.level + 0.25"
          @t="callToRef"
        />
      </div>
    </q-expansion-item>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import { useMockDatabase } from "src/stores/database";
import { useStoreUser } from "src/stores/user";

export default defineComponent({
  name: "DropDownListComponent",
  props: {
    id: { type: String },
    parent: { type: String },
    name: { type: String },
    icon: { type: Boolean },
    src: { type: String },
    level: { type: Number },
  },
  data() {
    return {
      database: useMockDatabase(),
      userStore: useStoreUser(),
      childInfo: null,
      isHideIcon: true,
    };
  },
  methods: {
    getChildCategoryInfo() {
      const headers = {
        "access-token": this.userStore.accessToken,
      };
      this.$api
        .get(`/category/child/${this.id}`, { headers })
        .then((res) => {
          if (res.data != null) {
            this.childInfo = res.data;
            if (res.data.length == 0) {
              this.isHideIcon = true;
            } else {
              this.isHideIcon = false;
            }
          }
        })
        .catch((err) => {
          console.log(err);
          this.showErrDialog(err);
        });
    },
    callToRef(id, names, icon, src) {
      this.$emit("t", id, names, icon, src);
    },
  },
  async created() {
    await this.getChildCategoryInfo();
  },
});
</script>
