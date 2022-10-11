<template>
  <q-page
    class="flex flex-center"
    style="background-image: url('homePageBackground.jpg')"
    ><h1 class="text-white asd" align="center">
      Welcome!
      <h4>To Daily Expenses Tracker</h4>
    </h1>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "IndexPage",
  data() {
    return {};
  },
});
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Pacifico&display=swap");

.asd {
  font-family: "Pacifico", "cursive";
}
</style>
