<template>
  <q-dialog persistent>
    <q-card style="min-width: 350px">
      <q-card-section class="q-px-sm">
        <div class="row">
          <div class="on-left text-h6">
            Editing:

            {{ name }}
          </div>
          <q-toggle
            class="absolute-right"
            v-model="visible"
            color="grey-10"
            label="Visible"
            left-label
          />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-mt-sm">
        <div class="flex flex-center q-mb-sm column">
          <q-avatar size="2rem"
            ><q-icon :name="nSrc" size="2rem" v-if="nIcon" />
            <img :src="nSrc" v-else />
          </q-avatar>
          <q-toggle v-model="nIcon" color="grey-10" label="Icon" left-label />
        </div>
        <div class="row q-mb-sm">
          <q-input
            outlined
            label="Avatar Source"
            class="full-width"
            v-model="nSrc"
          />
        </div>
        <q-input label="Category Name" outlined v-model="nName" />
      </q-card-section>

      <q-card-actions class="text-primary">
        <div class="full-width">
          <q-btn flat label="Confirm" class="float-right" @click="confirmIt" />
          <q-btn flat label="Cancel" v-close-popup class="float-left" />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "EditComponentDialog",
  props: {
    id: { type: String },
    parent: { type: String },
    name: { type: String },
    icon: { type: Boolean },
    src: { type: String },
    isVisible: { type: Boolean },
  },
  data() {
    return {
      visible: this.isVisible,
      nName: this.name,
      nIcon: this.icon,
      nSrc: this.src,
    };
  },
  methods: {
    confirmIt() {
      this.$emit("confirmIt", {
        id: this.id,
        name: this.nName,
        icon: this.nIcon,
        src: this.nSrc,
        isVisible: this.visible,
      });
    },
  },
});
</script>
