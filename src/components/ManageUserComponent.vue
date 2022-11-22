<template>
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
        <q-td key="avatar" :props="props">
          <q-avatar size="3rem">
            <q-img
              v-if="props.row.avatar"
              :src="`${this.$URL}/file/${props.row.avatar}`"
            />
            <q-icon name="account_circle" v-else size="3rem" />
          </q-avatar>
        </q-td>
        <q-td key="id" :props="props">
          {{ props.row.id }}
        </q-td>
        <q-td key="name" :props="props">
          {{ props.row.name }}
        </q-td>
        <q-td key="email" :props="props">
          {{ props.row.email }}
        </q-td>
        <q-td key="username" :props="props">
          {{ props.row.username }}
        </q-td>
        <q-td key="active" :props="props">
          <q-toggle
            v-model="props.row.active"
            @update:model-value="setUserStatus(props.row.id, props.row.active)"
            color="grey-10"
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>
<script>
const columns = [
  {
    name: "avatar",
    label: "Avatar",
    align: "center",
    field: "avatar",
  },
  {
    name: "id",
    label: "Id",
    align: "center",
    field: "id",
  },
  {
    name: "name",
    align: "center",
    label: "Nickname",
    field: "name",
  },
  { name: "email", label: "Email", align: "center", field: "email" },
  { name: "username", label: "Username", align: "center", field: "username" },
  { name: "active", label: "Active", align: "center", field: "active" },
];

import { useMockDatabase } from "src/stores/database";
import { useStoreUser } from "src/stores/user";
import { defineComponent } from "vue";
export default defineComponent({
  name: "ManageUserComponent",
  data() {
    return {
      columns,
      database: useMockDatabase(),
      userStore: useStoreUser(),
      allUserInfo: null,
      rows: [],
    };
  },
  methods: {
    getUsers() {
      const headers = {
        "access-token": this.userStore.accessToken,
      };
      this.$api
        .get(`/user/admin`, { headers })
        .then((res) => {
          if (res.data != null) {
            this.allUserInfo = res.data;
            this.parseUsersToRow();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    parseUsersToRow() {
      for (const i in this.allUserInfo) {
        let user = this.allUserInfo[i];
        this.rows.push({
          avatar: user.img,
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          active: user.active ? true : false,
        });
      }
    },
    setUserStatus(id, stat) {
      const headers = {
        "access-token": this.userStore.accessToken,
      };
      this.$api
        .put(`/user/admin/${id}`, { active: stat }, { headers })
        .then((res) => {
          if (res.status == 401) {
            this.userStore.reset();
            this.$router.push("/login");
          }
        })
        .catch((err) => {
          console.log(err);
          this.showErrDialog(err);
        });
    },
  },
  async created() {
    await this.getUsers();
  },
});
</script>
