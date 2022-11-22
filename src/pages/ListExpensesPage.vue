<template>
  <q-page padding>
    <q-table
      :columns="this.columns"
      :rows="rows"
      flat
      bordered
      rows-per-page-options="0"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            <div class="text-bold">{{ col.label }}</div>
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="icon" :props="props">
            <q-avatar size="1.5rem">
              <q-icon
                v-if="props.row.category.icon"
                :name="props.row.category.src"
                size="1.5rem"
              />
              <q-img v-else :src="props.row.category.src" />
            </q-avatar>
          </q-td>
          <q-td key="category" :props="props">
            {{ props.row.category.name }}
          </q-td>
          <q-td key="date" :props="props">
            {{ props.row.date }}
          </q-td>
          <q-td key="spent" :props="props">
            {{ props.row.spent }}
          </q-td>

          <q-td key="action" :props="props">
            <q-icon
              name="delete"
              size="1.5rem"
              class="cursor-pointer"
              @click="
                this.setToRemove(
                  `Spending ${props.row.spent} on ${props.row.category.name}`,
                  props.row.category.src,
                  props.row.category.icon,
                  props.row.category.id
                )
              "
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <ConfirmDialog
      v-model="this.toDel.showConfirm"
      :name="this.toDel.name"
      :src="this.toDel.src"
      :icon="this.toDel.icon"
      @confirmPlease="this.removeRecord"
    />
  </q-page>
</template>

<script>
const columns = [
  {
    name: "icon",
    align: "center",
    label: "Icon",
    field: "icon",
  },
  {
    name: "category",
    align: "center",
    label: "Category",
    field: "category",
  },
  {
    name: "date",
    label: "Date",
    align: "center",
    field: "date",
  },
  {
    name: "spent",
    label: "Spent",
    align: "center",
    field: "spent",
  },

  { name: "action", label: "Action", align: "center", field: "action" },
];

import { defineComponent } from "vue";
import { useStoreUser } from "src/stores/user";
import ConfirmDialog from "../components/ConfirmDialog.vue";

export default defineComponent({
  name: "ListExpesesPage",
  components: { ConfirmDialog },
  data() {
    return {
      columns,
      rows: [],
      userStore: useStoreUser(),
      allRecords: null,
      toDel: {
        showConfirm: false,
        name: "",
        src: "",
        icon: true,
        id: null,
      },
    };
  },
  methods: {
    setToRemove(name, src, icon, id) {
      this.toDel.name = name;
      this.toDel.src = src;
      this.toDel.icon = icon;
      this.toDel.id = id;
      this.toDel.showConfirm = true;
    },
    removeRecord() {
      const headers = {
        "access-token": this.userStore.accessToken,
      };
      this.$api
        .delete(`/record/del/${this.toDel.id}`, { headers })
        .then((res) => {
          if (res.status == 200) {
            this.toDel.showConfirm = false;
            this.getAllRecord();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getAllRecord() {
      const headers = {
        "access-token": this.userStore.accessToken,
      };
      this.$api
        .get(`/record/andcat`, { headers })
        .then((res) => {
          if (res.data != null) {
            this.allRecords = res.data;
            this.rows = [];
            this.parseToRow();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    parseToRow() {
      for (const i in this.allRecords) {
        let rec = this.allRecords[i];
        this.rows.push({
          date: rec.date,
          spent: rec.spent,
          category: {
            icon: rec.icon,
            src: rec.src,
            name: rec.name,
            id: rec.id,
          },
        });
      }
    },
  },
  created() {
    this.getAllRecord();
  },
});
</script>
