<template>
  <base-dialog :show="isLoading" title="Authenticating..." fixed>
    <base-spinner></base-spinner>
  </base-dialog>

  <top-bar
    @emitSearch="emitedSearch"
    v-bind:show-search="showSearch"
    v-bind:menu-icon="iconCloseOpen2"
    background-style="rgb(255,255,255,0.6)"
    title-color="black"
    v-bind:title-text="MainTitleText"
  ></top-bar>

  <div class="container">
    <div class="row">
      <div class="col-md-12 text-center gap-2 gaptop-2">
        <h4>Reset password</h4>
      </div>

      <div class="col-md-12 text-center gap-2">
        <div class="flex flex-column gap-2">
          <label for="password">Enter new password</label>
          <InputText
            type="password"
            @input="typing"
            v-model="newPassword"
            style="min-width: 300px"
          />

          <p>
            <InlineMessage v-if="!newPasswordOK"
              >This field is required</InlineMessage
            >
            <InlineMessage v-if="!passwordsMatchOK"
              >Passwords do NOT match!</InlineMessage
            >
          </p>
        </div>
      </div>

      <div class="col-md-12 text-center gap-2">
        <div class="flex flex-column gap-2">
          <label for="password">Repeat password</label>
          <InputText
            type="password"
            @input="typing"
            v-model="newPasswordRepeat"
            style="min-width: 300px"
          />

          <p>
            <InlineMessage v-if="!newPasswordRepeatOK"
              >This field is required</InlineMessage
            >
            <InlineMessage v-if="!passwordsMatchOK"
              >Passwords do NOT match!</InlineMessage
            >
          </p>
        </div>
      </div>
      <div class="col-md-12 text-center gap-2">
        <p><Button label="Set new password" @click="changePassword" /></p>
      </div>

      <div class="col-md-12 text-center gap-2">
        <p><a href="/">back to home page</a></p>
      </div>
    </div>
  </div>

  <!-- dialog info -->
  <Dialog
    v-model:visible="displayInfoDialog"
    modal
    :style="infoDialogStyle"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <template #header="">
      <h4>{{ InfoModalHeader }}</h4>
    </template>

    <span class="font-bold text-2xl block mb-2 mt-4"></span>
    <p class="mb-0">{{ InfoModalMessage }}</p>
    <div class="flex text-end mt-4">
      <Button label="Ok" @click="messageClose"></Button>
    </div>
  </Dialog>
</template>

<script>
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import InlineMessage from "primevue/inlinemessage";
import Dialog from "primevue/dialog";

import axios from "axios";

import jssha256 from "js-sha256";

export default {
  props: ["resetKey"],
  components: {
    // DataTable,
    // Column,
    InputText,
    //Checkbox,
    Button,
    Dialog,
    InlineMessage,
    //  Calendar,
    //InputNumber,
    //TabView,
    //TabPanel,
    //   Dropdown
  },

  data() {
    return {
      isLoading: false,
      displayInfoDialog: false,
      newPasswordOK: true,
      newPasswordRepeatOK: true,
      passwordsMatchOK: true,
      newPassword: "",
      newPasswordRepeat: "",
      passwordChangedOk: false,
    };
  },

  methods: {
    typing() {
      this.newPasswordOK = true;
      this.newPasswordRepeatOK = true;
      this.passwordsMatchOK = true;
    },
    messageClose() {
      this.displayInfoDialog = false;
      if (this.passwordChangedOk) {
        this.$router.replace("/");
      }
    },

    changePassword() {
      var AllOk = true;

      if (this.newPassword == "") {
        this.newPasswordOK = false;
        AllOk = false;
      } else {
        this.newPasswordOK = true;
      }

      if (this.newPasswordRepeat == "") {
        this.newPasswordRepeatOK = false;
        AllOk = false;
      } else {
        this.newPasswordRepeatOK = true;
      }

      if (this.newPassword != "" && this.newPasswordRepeat != "") {
        if (this.newPassword != this.newPasswordRepeat) {
          this.passwordsMatchOK = false;
          AllOk = false;
        }
      }

      if (AllOk == true) {
        if (this.checkPasswordSecurity(this.newPassword) == true) {
          this.changePasswordinDatabase();
        } else {
          const ErrorMessage =
            "The password must contain one lower case, one upper case, one number and one symbol, and be at least made of 8 symbols!";

          this.InfoModalHeader = "Error!";
          this.InfoModalMessage = ErrorMessage;
          this.infoDialogStyle = [{ width: "40rem" }];
          this.displayInfoDialog = true;
        }
      }
    },

    checkPasswordSecurity(password) {
      // at leats 8 chars long, one Uppercase letter, one Lowercase letter, one Number, one Special chars:
      var pattern =
        /^.*(?=.{8,20})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&!-_/*.,:;"'<>]).*$/;

      if (!pattern.test(password)) {
        return false;
      } else {
        return true;
      }
    },

    async changePasswordinDatabase() {
      this.isLoading = true;

      var encodedPassword = jssha256(this.newPassword); // sha256

      // const sessionId='';
      const baseUrl = localStorage.getItem("_rootRestUrl");

      let formData = JSON.stringify({
        code: this.resetKey,
        password: encodedPassword,
      });

      let config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      await axios
        .post(baseUrl + "/api/v1/User/ResetPassword/", formData, config)
        .then(() => {
          this.InfoModalHeader = "Info";
          this.InfoModalMessage =
            "Password is changed. You can now login to app using your new password";
          this.infoDialogStyle = [{ width: "40rem" }];
          this.displayInfoDialog = true;
          this.passwordChangedOk = true;
          this.isLoading = false;
        })

        .catch((error) => {
          console.table(error);
          if (error.response) {
            this.InfoModalHeader = "Error!";
            this.InfoModalMessage = error.response.data;
            this.infoDialogStyle = [{ width: "40rem" }];
            this.displayInfoDialog = true;
          }

          this.isLoading = false;
        });
    },
  },

  mounted() {},
};
</script>

<style>
@import "datatables.net-dt";
@import "primevue/resources/themes/bootstrap4-light-blue/theme.css"; /*theme*/
@import "primevue/resources/primevue.min.css   "; /*core css*/
@import "primeicons/primeicons.css   "; /*icons*/

label {
  display: block;
  font-size: 14px;
}
.gap-2 {
  margin-bottom: 1rem;
}
.gaptop-2 {
  margin-top: 1rem;
}

.p-dialog {
  max-height: 200px !important;
}
.p-dialog-content {
  padding: 1rem 1rem 0 1rem !important;
}
</style>
