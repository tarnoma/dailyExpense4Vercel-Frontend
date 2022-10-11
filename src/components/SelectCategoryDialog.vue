<template>
  <q-dialog persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Please select your category</div>
      </q-card-section>

      <q-card-section class="q-pt-none"
        ><DropDownListComponent
          v-for="item in this.baseCategoryInfo"
          :key="item.id"
          v-bind="item"
          :level="0"
          @t="selectCategory"
        />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { defineComponent } from "vue";
import { useMockDatabase } from "src/stores/database";
import { useStoreUser } from "src/stores/user";
import DropDownListComponent from "./DropDownListComponent.vue";
export default defineComponent({
  name: "SelectCategoryDialog",
  props: {},
  data() {
    return {
      database: useMockDatabase(),
      userStore: useStoreUser(),
      baseCategoryInfo: null,
    };
  },
  methods: {
    getBaseCat() {
      this.baseCategoryInfo = this.database.getBaseCategory(
        this.userStore.userid,
        this.userStore.accessToken
      );
    },
    selectCategory(id, name, icon, src) {
      this.$emit("select", id, name, icon, src);
    },
  },
  created() {
    this.getBaseCat();
  },
  components: { DropDownListComponent },
});
</script>
