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
        <h4>Forgot password :(</h4>
      </div>

      <div class="col-md-12 text-center gap-2">
        <div class="flex flex-column gap-2">
          <label for="password">Please enter your email</label>
          <InputText
            @input="typing"
            type="text"
            v-model="userEmail"
            style="min-width: 300px"
          />
          <p>
            <InlineMessage v-if="!userEmailOK"
              >This field is required</InlineMessage
            >
          </p>
        </div>
      </div>

      <div class="col-md-12 text-center gap-2">
        <p><Button label="Password recovery" @click="passwordRecovery" /></p>
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
      <Button label="Ok" @click="displayInfoDialog = false"></Button>
    </div>
  </Dialog>
</template>

<script>
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import InlineMessage from "primevue/inlinemessage";
import Dialog from "primevue/dialog";

import axios from "axios";

export default {
  // props: ["systemId"],
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
      userEmail: "",
      userEmailOK: true,
      displayInfoDialog: false,
      isLoading: false,
    };
  },
  methods: {
    passwordRecovery() {
      var AllOk = true;

      if (this.userEmail == "" || this.userEmail == null) {
        this.userEmailOK = false;
        AllOk = false;
      } else {
        this.userEmailOK = true;
      }

      if (AllOk == true) {
        this.sendRecoveryEmail();
      }
    },
    typing() {
      this.userEmailOK = true;
    },
    async sendRecoveryEmail() {
      this.isLoading = true;

      const sessionId = localStorage.getItem("token");
      // const sessionId='';
      const baseUrl = localStorage.getItem("_rootRestUrl");

      let formData = JSON.stringify({
        sessionId: sessionId,
        email: this.userEmail,
      });

      let config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      await axios
        .post(baseUrl + "/api/v1/User/SendResetPasswordEmail", formData, config)
        .then(() => {
          this.InfoModalHeader = "Info";
          this.InfoModalMessage =
            "If your email is registered we will now send you a message with instruction how to recover your password.";
          this.infoDialogStyle = [{ width: "40rem" }];
          this.displayInfoDialog = true;

          this.isLoading = false;
        })

        .catch((error) => {
          if (error.response) {
            this.InfoModalHeader = "Info";
            this.InfoModalMessage =
              "If your email is registered we will now send you a message with instruction how to recover your password.";
            this.infoDialogStyle = [{ width: "40rem" }];
            this.displayInfoDialog = true;
          }

          this.isLoading = false;
        });
    },
  },
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
  max-height: 200px;
}
</style>
