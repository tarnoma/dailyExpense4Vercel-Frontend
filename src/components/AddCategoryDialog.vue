<template>
  <q-dialog persistent>
    <q-card style="min-width: 350px">
      <q-card-section class="q-mt-sm">
        <div class="flex flex-center q-mb-sm column">
          <q-avatar size="2rem"
            ><q-icon :name="src" size="2rem" v-if="icon" />
            <img :src="src" v-else />
          </q-avatar>
          <q-toggle v-model="icon" color="grey-10" label="Icon" left-label />
        </div>
        <div class="row q-mb-sm">
          <q-input
            outlined
            label="Avatar Source"
            class="full-width"
            v-model="src"
          />
        </div>
        <q-input label="Category Name" outlined v-model="name" />
      </q-card-section>

      <q-card-actions class="text-primary">
        <div class="full-width">
          <q-btn flat label="Confirm" class="float-right" @click="addIt" />
          <q-btn flat label="Cancel" v-close-popup class="float-left" />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "AddCategoryDialog",
  data() {
    return {
      name: "",
      icon: true,
      src: "",
    };
  },
  methods: {
    addIt() {
      this.$emit("addIt", {
        name: this.name,
        icon: this.icon,
        src: this.src,
      });
    },
  },
});
</script>
