<template>
  <q-dialog>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Are you sure about deleting:</div>

        <div class="text-h6">
          <q-avatar size="2rem"
            ><q-icon :name="src" size="2rem" v-if="icon" />
            <img :src="src" v-else />
          </q-avatar>

          {{ name }}
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="text-primary flex flex-center">
        <q-btn
          flat
          label="Confirm"
          class="float-right full-width"
          @click="this.$emit('confirmPlease')"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "ConfirmDialog",
  props: {
    src: { type: String },
    icon: { type: Boolean },
    name: { type: String },
  },
});
</script>
