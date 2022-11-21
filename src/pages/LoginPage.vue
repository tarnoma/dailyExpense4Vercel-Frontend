<template>
  <q-page padding class="flex flex-center">
    <q-card class="q-px-md q-py-md">
      <div class="flex flex-center">
        <q-icon name="account_circle" color="grey-10" size="4rem" />
      </div>
      <q-card-section>
        <q-form
          @submit.prevent="onSubmit"
          @reset="onReset"
          ref="MyLoginForm"
          class="q-gutter-md"
        >
          <div>
            <q-input
              v-model="username"
              type="text"
              lazy-rules
              :rules="[requiredValidate]"
              label="Username"
              outlined
            />
          </div>
          <div>
            <q-input
              v-model="password"
              :type="isShowPass ? 'password' : 'text'"
              lazy-rules
              :rules="[requiredValidate]"
              label="Password"
              outlined
            >
              <template #append>
                <q-icon
                  :name="isShowPass ? 'visibility_off' : 'visibility'"
                  @click="togglePassword"
                  class="cursor-pointer"
                />
              </template>
            </q-input>
          </div>
          <div>
            <q-btn
              label="Login"
              type="submit"
              color="grey-10"
              class="float-left"
            />
            <q-btn
              label="Reset"
              type="reset"
              color="grey-10"
              class="float-right"
            />
          </div>
        </q-form>
      </q-card-section>
      <br />
      <div class="text-caption full-width q-mt-sm" align="center">
        No account? <a href="/register">Register here</a>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { useStoreUser } from "stores/user";
import { emailValidate, requiredValidate } from "../utils/validation";
import { Notify } from "quasar";
import { useMockDatabase } from "src/stores/database";

export default defineComponent({
  name: "LoginPage",
  data() {
    return {
      userStore: useStoreUser(),
      database: useMockDatabase(),
      isShowPass: true,
      username: "",
      password: "",
    };
  },
  methods: {
    emailValidate,
    requiredValidate,
    togglePassword() {
      this.isShowPass = !this.isShowPass;
    },
    onReset() {
      this.username = null;
      this.password = null;
      this.isShowPass = true;
    },
    onSubmit() {
      let data = {
        username: this.username,
        password: this.password,
      };
      this.$api
        .post("/user/login", data)
        .then((res) => {
          if (res.status == 200) {
            console.log(res.data);
            this.userStore.userid = res.data.id;
            if (res.data.img) {
              this.userStore.img = this.$URL + "/file/" + res.data.img;
            }
            this.userStore.accessToken = res.data.accessToken;
            this.userStore.name = res.data.name;
            this.userStore.username = res.data.username;
            this.userStore.admin = res.data.admin ? true : false;
            console.log(res.data);
            Notify.create({
              type: "positive",
              message: "Successfully Login!",
            });
            this.$router.push("/dashboard");
          }
        })
        .catch((err) => {
          Notify.create({
            type: "negative",
            message: "Error! account inactive or wrong information!",
          });
        });
      // var res = this.database.tryLogin(this.username, this.password);
      // if (res) {
      //   this.userStore.userid = res.userid;
      //   this.userStore.img = res.img;
      //   this.userStore.accessToken = res.accessToken;
      //   this.userStore.name = res.name;
      //   this.userStore.username = res.username;
      //   this.userStore.admin = res.admin;
      //   Notify.create({
      //     type: "positive",
      //     message: "Successfully Login!",
      //   });
      //   this.$router.push("/dashboard");
      // } else {
      //   Notify.create({
      //     type: "negative",
      //     message: "Wrong username or password!",
      //   });
      // }
      this.$refs.MyLoginForm.reset();
    },
  },
  created() {
    if (this.userStore.userid) this.$router.push("/dashboard");
  },
});
</script>
