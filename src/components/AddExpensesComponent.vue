<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card style="min-width: 330px" class="q-mb-md" flat bordered>
      <q-card-section horizontal>
        <q-card-section class="row full-width">
          <div class="text-h6">Expenses {{ number }}</div>
        </q-card-section>
        <q-btn
          icon="remove"
          size="1"
          label="Remove"
          flat
          class="absolute-right q-mb-sm"
          @click="this.$emit('sub')"
          v-if="number > 1"
        />
      </q-card-section>
      <q-separator />
      <q-card-section class="column flex flex-center">
        <q-input
          outlined
          label="Select Category"
          v-model="displayCategory"
          readonly
          class="full-width q-mb-md cursor-pointer"
          @click="showCategory = !showCategory"
        >
          <template #prepend v-if="displayCategory">
            <q-icon
              :name="this.selectedCategory.src"
              size="1.5rem"
              v-if="this.selectedCategory.icon"
              color="grey-10"
            />
            <q-avatar size="1.5rem" v-else>
              <img :src="this.selectedCategory.src" />
            </q-avatar>
          </template>
        </q-input>
        <q-input
          v-model="moneySpent"
          label="Money spent"
          outlined
          class="full-width"
          type="number"
        />
      </q-card-section>
      <q-separator />
      <q-card-section class="">
        <q-btn
          icon="add"
          size="1"
          label="Add more"
          flat
          class="float-right q-mb-sm"
          @click="this.$emit('addmore')"
        />
      </q-card-section>
    </q-card>
    <SelectCategoryDialog v-model="showCategory" @select="catSelect" />
  </div>
</template>
<script>
import { defineComponent } from "vue";
import SelectCategoryDialog from "./SelectCategoryDialog.vue";
import { useMockDatabase } from "src/stores/database";
import { useStoreUser } from "src/stores/user";

export default defineComponent({
  name: "AddExpensesComponent",
  props: {
    number: { type: Number },
  },
  data() {
    return {
      selectedCategory: {
        id: 0,
        name: "",
        icon: true,
        src: "",
      },
      displayCategory: "",
      showCategory: false,
      moneySpent: "",
      database: useMockDatabase(),
      userStore: useStoreUser(),
    };
  },
  methods: {
    catSelect(id, name, icon, src) {
      this.showCategory = false;
      this.displayCategory = name;
      this.selectedCategory = {
        id: id,
        name: name,
        icon: icon,
        src: src,
      };
    },
    confirmAdd() {
      if (this.moneySpent.trim() != "" && this.displayCategory.trim() != "") {
        this.database.addExpense(
          this.userStore.userid,
          this.userStore.accessToken,
          this.selectedCategory.id,
          this.moneySpent
        );
      }
    },
  },
  components: { SelectCategoryDialog },
  watch: {
    moneySpent() {
      this.$emit("upTotal");
    },
  },
});
</script>
