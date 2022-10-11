<template>
  <q-card
    class="my-card q-mb-sm row q-px-sm q-py-sm q-ml-sm"
    flat
    bordered
    style="min-width: 200px"
  >
    <div class="text-overline col q-mr-sm text-bold" align="center">
      {{ title }}
      <slot name="addmore" />
      <q-separator />
      <div :class="color" class="text-subtitle q-mr-sm text-bold">
        <q-icon name="attach_money" />
        {{ spent }}
      </div>
    </div>
  </q-card>
</template>
<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "DashboardCardComponent",
  props: {
    title: { type: String },
    spent: { type: String },
    color: { type: String },
  },
  data() {
    return {};
  },
});
</script>
