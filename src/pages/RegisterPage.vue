<template>
  <q-page padding class="flex flex-center">
    <q-card class="q-px-md q-py-md">
      <div class="flex flex-center" v-if="isShowAvatar">
        <q-avatar size="6rem" class="q-mb-sm">
          <img :src="imgAvatar" />
        </q-avatar>
      </div>
      <div class="flex flex-center" v-else>
        <q-icon name="account_circle" color="grey-10" size="6rem" />
      </div>
      <q-card-section>
        <q-form
          @submit.prevent="onSubmit"
          @reset="onReset"
          ref="MyRegisterForm"
          class="q-gutter-md"
        >
          <div>
            <q-input
              v-model="nickname"
              type="text"
              lazy-rules
              :rules="[requiredValidate]"
              label="Nick Name"
              outlined
            />
          </div>
          <div>
            <q-input
              v-model="email"
              type="text"
              lazy-rules
              :rules="[emailValidate, requiredValidate]"
              label="Email"
              outlined
            />
          </div>
          <div>
            <q-input
              v-model="username"
              type="text"
              lazy-rules
              :rules="[requiredValidate]"
              label="Username"
              outlined
            />
            <text-caption
              style="font-size: 0.9em"
              v-if="usernameCaption.show"
              :class="[
                usernameCaption.isValid ? 'text-positive' : 'text-negative',
              ]"
            >
              <q-icon :name="usernameCaption.icon" size="1.5em" />
              {{ usernameCaption.msg }}
            </text-caption>
          </div>
          <div>
            <q-input
              v-model="password"
              :type="isShowPass ? 'password' : 'text'"
              lazy-rules
              :rules="[
                (val) => (val && val.length >= 6) || 'Must be at least 6 chars',
              ]"
              label="Password"
              outlined
            >
              <template #append>
                <q-icon
                  :name="isShowPass ? 'visibility_off' : 'visibility'"
                  @click="isShowPass = !isShowPass"
                  class="cursor-pointer"
                />
              </template>
            </q-input>
          </div>
          <div>
            <q-file
              outlined
              v-model="upload_avatar"
              label="Your Avatar"
              accept=".jpg, .jpeg, .png"
              max-file-size="1048576"
              @rejected="onReject"
              @update:model-value="uploadPic()"
            >
              <template #append>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          </div>
          <div>
            <q-btn
              label="Register"
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
  name: "RegisterPage",
  data() {
    return {
      userStore: useStoreUser(),
      database: useMockDatabase(),
      isShowPass: true,
      username: "",
      password: "",
      email: "",
      nickname: "",
      upload_avatar: null,
      isShowAvatar: false,
      imgAvatar: "",
      usernameCaption: {
        msg: null,
        icon: null,
        show: false,
        isValid: false,
      },
    };
  },
  methods: {
    emailValidate,
    requiredValidate,
    onReset() {
      this.username = "";
      this.password = "";
      this.email = "";
      this.upload_avatar = null;
      this.nickname = "";
      this.isShowPass = true;
      this.isShowAvatar = false;
      this.imgAvatar = "";
    },
    onReject(rejectedEntires) {
      let msg;
      if (rejectedEntires[0].failedPropValidation == "accept")
        msg = "Only Image (jpg, jpeg, png) are allowed!";
      else if (rejectedEntires[0].failedPropValidation == "max-file-size")
        msg = "File size cannot be larger than 1MB.";
      Notify.create({
        type: "negative",
        message: msg,
      });
    },
    onSubmit() {
      if (this.upload_avatar) {
        const formData = new FormData();
        formData.append("singlefile", this.upload_avatar);
        this.$api
          .post("/file/upload", formData)
          .then((response) => {
            if (response.status == 200) {
              this.subSubmit(response.data.uploadFileName);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.subSubmit("");
      }
    },
    subSubmit(filename) {
      let data = {
        username: this.username,
        password: this.password,
        name: this.nickname,
        img: filename,
        email: this.email,
      };
      this.$api
        .post("/user/signup", data)
        .then((res) => {
          if (res.status == 200) {
            this.userStore.userid = res.data.id;
            this.userStore.accessToken = res.data.accessToken;
            this.userStore.name = res.data.name;
            this.userStore.username = res.data.username;
            this.userStore.admin = res.data.admin ? true : false;
            if (res.data.img) {
              this.userStore.img = this.$URL + "/file/" + res.data.img;
            } else {
              this.userStore.img = "default-avatar.png";
            }
            this.$router.push("/");
            Notify.create({
              type: "positive",
              message: "Successfully Registered!",
            });
          }
        })
        .catch((err) => {
          Notify.create({
            type: "negative",
            message: "Can't register! There some error!",
          });
        });
      this.$refs.MyRegisterForm.reset();
    },
    uploadPic() {
      this.isShowAvatar = true;
      this.imgAvatar = URL.createObjectURL(this.upload_avatar);
    },
    resetCaption() {
      this.usernameCaption.show = false;
      this.usernameCaption.isValid = false;
      this.usernameCaption.icon = null;
      this.usernameCaption.msg = null;
    },
  },
  watch: {
    username() {
      if (this.username) {
        // if (this.database.checkUsername(this.username)) {
        //   this.usernameCaption.show = true;
        //   this.usernameCaption.isValid = true;
        //   this.usernameCaption.icon = "account_circle";
        //   this.usernameCaption.msg = "Username is available!";
        // } else {
        //   this.usernameCaption.show = true;
        //   this.usernameCaption.isValid = false;
        //   this.usernameCaption.icon = "no_accounts";
        //   this.usernameCaption.msg = "Username is unavailable!";
        // }
        this.$api
          .get(`/user/check/${this.username}`)
          .then((res) => {
            if (res.data.valid) {
              this.usernameCaption.show = true;
              this.usernameCaption.isValid = true;
              this.usernameCaption.icon = "account_circle";
              this.usernameCaption.msg = "Username is available!";
            } else {
              this.usernameCaption.show = true;
              this.usernameCaption.isValid = false;
              this.usernameCaption.icon = "no_accounts";
              this.usernameCaption.msg = "Username is unavailable!";
            }
          })
          .catch((err) => {});
      } else {
        this.resetCaption();
      }
    },
  },
  created() {
    if (this.userStore.userid) this.$router.push("/dashboard");
  },
});
</script>
