<template>
  <q-page padding align="center">
    <div class="text-h3 q-mb-xl">Add Your Exprenses</div>
    <div class="flex flex-center column">
      <AddExpensesComponent
        v-for="i in numAdd"
        :key="i"
        :number="i"
        @addmore="addMoreComp"
        @sub="deleteComp"
        :ref="`expanel${i}`"
        @upTotal="calculateTotalSpent"
      />
    </div>
    <div class="text-h5 q-mb-xl">Total spent: {{ total }}</div>
    <q-btn
      label="Confirm"
      style="width: 250px"
      color="grey-10"
      @click="confirmAdd"
    />
  </q-page>
</template>
<script>
import { defineComponent } from "vue";
import AddExpensesComponent from "src/components/AddExpensesComponent.vue";
import { Notify } from "quasar";
import { useStoreUser } from "src/stores/user";

export default defineComponent({
  name: "ExpenesesPage",
  components: { AddExpensesComponent },
  data() {
    return {
      numAdd: 1,
      total: 0,
      userStore: useStoreUser(),
    };
  },
  methods: {
    addMoreComp() {
      this.numAdd++;
    },
    deleteComp() {
      this.numAdd--;
    },
    confirmAdd() {
      for (var i = 1; i <= this.numAdd; i++) {
        this.$refs[`expanel${i}`][0].confirmAdd();
      }
      Notify.create({
        type: "info",
        message: `Added ${this.numAdd} expenses.`,
      });
      this.$router.push("/dashboard");
    },
    calculateTotalSpent() {
      var stotal = 0;
      for (var i = 1; i <= this.numAdd; i++) {
        if (this.$refs[`expanel${i}`][0].moneySpent)
          stotal += parseFloat(this.$refs[`expanel${i}`][0].moneySpent);
      }
      this.total = stotal;
    },
  },
  created() {
    if (!this.userStore.userid) this.$router.push("/login");
  },
});
</script>
