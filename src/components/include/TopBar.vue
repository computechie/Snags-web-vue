<template>
  <div
    class="topLoginBar"
    as="as"
    :style="{ background: `${backgroundStyle}` }"
  >
    <div class="container-fluid" style="position: relative">
      <div class="row align-items-center topLoginBarRow">
        <div class="col-9 col-md-4" v-if="this.$store.getters.isAuthenticated">
          <!-- <img :src="_rootLoginLogoWhite" class="imf-fluid" /> -->
          <img :src="_rootLoginLogo" class="imf-fluid" />
        </div>

        <div
          class="col-9 col-md-4"
          v-if="!this.$store.getters.isAuthenticated"
          style="padding-left: 0"
        >
          <button
            type="button"
            class="sidebarCollapseBtn"
            v-on:click="openCloseMenu()"
            v-html="menuIcon"
          ></button>
          <!-- <img
            :src="_rootLoginLogo"
            style="margin-bottom:8px;margin-left: 13px; max-width: calc(100% - 70px)"
          />-->

          <div class="projectTitle">
            <div class="projectNameHeadline">DORMITORY DEMO PROJECT</div>
            <div class="documentTypeHeadline">Snags</div>
          </div>
        </div>

        <div
          v-if="this.$store.getters.isAuthenticated"
          class="d-none d-md-block col-md-4 text-center"
        >
          <span
            v-if="!showSearch"
            id="mainAppTitle"
            :style="{ color: `${titleColor}` }"
            >{{ titleText }}</span
          >
        </div>

        <div
          v-if="!this.$store.getters.isAuthenticated"
          class="col-md-4 text-center"
        >
          <span
            v-if="!showSearch"
            id="mainAppTitle"
            :style="{ color: `${titleColor}` }"
            >{{ titleText }}</span
          >
          <div id="hereMoveSearch">s</div>
          <div id="hereMoveMainProjectTitle"></div>
        </div>

        <!-- if user not logged in -->
        <div
          class="col-3 col-md-4 text-end"
          v-if="this.$store.getters.isAuthenticated"
        >
          <a
            href="javascript:;"
            class="signInHref"
            data-bs-toggle="modal"
            data-bs-target="#loginModal"
          >
            <span class="">
              Sign in
              <i class="fa-solid fa-user" style="margin-left: 6px"></i>
            </span>
            <!-- <span class="d-block d-sm-none">
               <i class="fa-solid fa-bars"></i
            ></span>-->
          </a>
        </div>

        <!-- if user  logged in -->
        <div
          class="col-md-4 text-end"
          v-if="!this.$store.getters.isAuthenticated"
        >
          <div style="">
            <div class="text-in-circle-icon">
              <p
                class="text-center"
                @click="clickOnHelp"
                title="Read help file"
              >
                ?
              </p>
            </div>

            <div class="text-in-circle">
              <div class="dropdown topUserDropdownMenu">
                <p
                  class="text-center dropdown-toggle"
                  data-bs-toggle="dropdown"
                  title="User setting"
                >
                  {{ userInitials() }}
                </p>

                <div
                  class="dropdown-menu w300 dropdown-menu-right"
                  aria-labelledby="dropdownMenuLink"
                >
                  <div
                    class="row align-items-center"
                    style="margin: 0 !important"
                  >
                    <div class="col-2 text-center">
                      <div class="big-box">
                        <div class="text-in-circle">
                          <p class="text-center">{{ userInitials() }}</p>
                        </div>
                      </div>
                    </div>
                    <div class="col-10">
                      <div class="row">
                        <div class="col-12">
                          <strong>Firstname Lastname</strong>
                        </div>
                        <div class="col-12">
                          <!--- <a
                            class="mOver small"
                            href="/identity"
                            target="_blank"
                            >Manage your DFM account</a
                          >
                         -->
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr />
                  <a
                    class="dropdown-item"
                    href="#"
                    target="_blank"
                    @click="changepasswordClick"
                    ><i class="fa-solid fa-lock blueIcons"></i> Change
                    password</a
                  >
                  <hr />
                  <a class="dropdown-item" href="" @click="signoutClick"
                    ><i
                      class="fa-solid fa-arrow-right-from-bracket blueIcons"
                    ></i>
                    Sign out</a
                  >
                  <hr />
                  <a
                    class="dropdown-item"
                    :href="_rootLinkToUpdateHistory"
                    target="_blank"
                    ><i class="icon-book blueIcons"></i> Update history</a
                  >

                  <a
                    class="dropdown-item"
                    data-bs-toggle="modal"
                    data-bs-target="#aboutModal"
                    href=""
                    target="_blank"
                    ><i class="icon-info blueIcons"></i> About</a
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- About Modal -->
  <div
    class="modal fade"
    id="aboutModal"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="loginModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="loginModalLabel">About</h5>
          <button
            type="button"
            id="closeaboutModal"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>
            Application: <strong>{{ _rootAppTitle }}</strong>
          </p>
          <p>
            Version: <strong>{{ _rootVersion }}</strong>
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Change Password Dialog-->
  <Dialog
    @update:visible="handleClose"
    v-model:visible="changePasswordDialog"
    modal
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <template #header> Change Password </template>

    <div class="container" id="formContainer">
      <div class="row insertFormRow align-items-center">
        <div class="col-md-3">
          <label for="currentPasswordInput">Current Password *</label>
        </div>
        <div class="col-md-9">
          <InputText
            @input="currentPasswordOK = true"
            id="currentPasswordInput"
            v-model="currentPasswordInput"
          />
          <InlineMessage v-if="!currentPasswordOK"
            >This field is required</InlineMessage
          >
        </div>
      </div>

      <div class="row insertFormRow align-items-center">
        <div class="col-md-3">
          <label for="newPasswordInput">New Password *</label>
        </div>
        <div class="col-md-9">
          <InputText
            @input="newPasswordOK = true"
            id="newPasswordInput"
            v-model="newPasswordInput"
          />
          <InlineMessage v-if="!newPasswordOK"
            >This field is required</InlineMessage
          >
        </div>
      </div>
    </div>

    <div class="row insertFormRow align-items-center">
      <div class="col-md-6 text-left">
        <Button
          @click="closeChangePasswordDialog"
          style="min-width: 120px"
          v-tooltip.bottom="{
            value: 'Cancel',
            showDelay: 1000,
            hideDelay: 300,
          }"
          icon="pi pi-times-circle"
          type="button"
          class="p-button-text redButton"
          >Cancel</Button
        >
      </div>
      <div class="col-md-6 text-end">
        <Button
          style="min-width: 120px"
          v-tooltip.bottom="{
            value: 'Update Password',
            showDelay: 1000,
            hideDelay: 300,
          }"
          type="button"
          icon="pi pi-pencil"
          class="p-button-text"
          @click="updatePassword"
          >Update</Button
        >
      </div>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import InlineMessage from "primevue/inlinemessage";

export default {
  props: [
    "backgroundStyle",
    "titleColor",
    "titleText",
    "menuIcon",
    "showSearch",
    "emitSearch",
  ],

  components: {
    Dialog,
    InputText,
    Button,
    InlineMessage,
  },

  data() {
    return {
      changePasswordDialog: false,
      currentPasswordInput: "",
      newPasswordInput: "",
      currentPasswordOK: true,
      newPasswordOK: true,
    };
  },
  mounted() {},
  methods: {
    updatePassword() {
      alert("TODO: implement update password");
    },
    closeChangePasswordDialog() {
      this.changePasswordDialog = false;
    },
    handleClose() {
      this.changePasswordDialog = false;
    },
    userInitials() {
      //const fullName = this.$store.getters.getUserFullName;
      const fullName = "Firstname Lastname";
      return fullName
        .match(/(\b\S)?/g)
        .join("")
        .match(/(^\S|\S$)?/g)
        .join("")
        .toUpperCase();
    },
    clickOnHelp() {
      window.open(this._rootlinkToHelpFile, "_blank");
    },
    changepasswordClick(e) {
      e.preventDefault();
      this.changePasswordDialog = true;
    },
    signoutClick() {
      this.$store.dispatch("logout");
    },
    openCloseMenu() {
      this.$parent.sidebarColapse();
    },
  },

  emits: ["showSearchbar", "emitSearch"],
};
</script>

<style>
.text-in-circle {
  position: relative;
  display: inline-block;
  background: rgb(142, 53, 46);
  border-radius: 50%;
  width: 29px;
  height: 29px;
  color: white;
  padding-top: 3px;
  padding-left: 0px;
}
.text-in-circle p {
  cursor: pointer;
}

.text-in-circle-icon {
  position: relative;
  display: inline-block;
  border: 1px solid #138ba7;
  border-radius: 50%;
  width: 29px;
  height: 29px;
  /*color:white;*/
  padding-top: 3px;
  padding-left: 1px;
  font-weight: bold;
  cursor: pointer;
  margin-right: 7px;
  color: black;
}

.w300 {
  width: 300px;
}

.dropdown-menu {
  top: 10px !important;
  background: rgb(255, 255, 255);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  /*  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);*/
}
.iconAsLink {
  text-decoration: none !important;
  font-size: 27px;
}
.topUserDropdownMenu .dropdown-menu a i {
  margin-right: 10px;
}
.dropdown-toggle::after {
  content: none !important;
}

.mOver:hover {
  color: #995555;
}

.topLoginBar {
  color: white;

  /* border-radius: 16px;*/
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.signInHref {
  color: white !important;
}
.signInHref:hover {
  color: #ddd !important;
}
.sidebarCollapseBtn {
  width: 50px;
  font-size: 26px;
  margin-left: 2px;
}
#hereMoveSearch {
  padding-left: 90px;
  padding-right: 10px;
}

a:link {
  color: black !important;
}
a.signInHref {
  color: white !important;
}
.blueIcons {
  color: rgb(142, 53, 46);
}

.projectTitle {
  display: inline-block;
}
.sidebarCollapseBtn {
  display: inline-block;
  position: relative;
  top: -5px;
}
</style>
