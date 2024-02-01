<template>
  <base-dialog :show="!!error" title="Error"></base-dialog>
  <base-dialog :show="isLoading" title="Authenticating..." fixed>
    <base-spinner></base-spinner>
  </base-dialog>

  <top-bar
    v-bind:show-search="showSearch"
   
    title-color="white"
    v-bind:title-text="MainTitleText"
  ></top-bar>

  <div
    class="containerfluid loginPageBackground"
    :style="{ backgroundImage: `url(${_rootLoginBackground})` }"
  >
    <div class="container-fluid versionInfoHolder">
      <div class="row gy-3 justify-content-between">
        <div class="col-12 col-sm-5 col-lg-4 col-xl-3 order-2 order-sm-1">
          <version-info></version-info>
        </div>
        <div
          class="
            col-12 col-sm-5 col-lg-4 col-xl-3
            order-1 order-sm-2
            text-center
          "
        >
          <contact-info></contact-info>
        </div>
      </div>
    </div>
  </div>

  <!-- Login Modal -->
  <div
    class="modal fade"
    id="loginModal"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="loginModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="loginModalLabel">User sign in</h5>
          <button
            type="button"
            id="closeLoginModal"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label for="Inputusername" class="form-label">Username</label>
              <input
                type="username"
                v-model="username"
                @keyup="usernameKeyDown"
                class="form-control"
                id="Inputusername"
                aria-describedby="usernameHelp"
               
              />
              <div v-if="showUsernameAlert" class="alert alert-danger alert-sm">
                {{ usernameMessage }}
              </div>
            </div>
            <div class="mb-3">
              <label for="InputPassword" class="form-label">Password</label>
              <input
                type="password"
                v-model="password"
                @keyup="passwordKeyDown"
                class="form-control"
                id="InputPassword"
               
              />
              <div v-if="showPasswordAlert" class="alert alert-danger alert-sm">
                {{ passwordMessage }}
              </div>
            </div>
            <div class="mb-3 form-check">
             <!-- <input type="checkbox" class="form-check-input" id="Check1" />-->
              <Checkbox inputId="Check1" v-model="rememberMeCheckBox" :binary="true" />
              <label class="form-check-label" for="Check1" >Remember me</label>


            </div>
            <button type="submit" class="btn btn-primary">Login</button>
          </form>
        </div>
        <div class="modal-footer">
          <a href="/forgotPassword">Forgot password?</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import Checkbox from 'primevue/checkbox';
import CryptoJS from 'crypto-js';

export default {
  components: {
      Checkbox
  },
  data() {
    return {
      cryptKey : 'SDJFBOUdD45465fWQFGfZ3EdsVP4Idf9dfUBGdfUsBEDSFsUBG',
      showSearch: false,
      MainTitleText: this._rootAppTitle,
      TopBackgroundStyle: "blue",

      settings: [],

      //login:
      username: "",
      password: "",
      showUsernameAlert: false,
      showPasswordAlert: false,
      formIsValid: true,
      isLoading: false,
      error: null,
      rememberMe:'',
      rememberMeCheckBox:false,

      //testing;
      token: "",
    };
  },

  methods: {
    usernameKeyDown() {
      this.showUsernameAlert = false;
      if (this.username.length == 0) {
        this.showUsernameAlert = true;
        this.formIsValid = false;
        this.usernameMessage = "Please enter username";
      }
    },

    passwordKeyDown() {
      this.showPasswordAlert = false;
    },

    closeModal(id) {
      document.getElementById(id).click();
    },

    async submitForm() {
      this.showUsernameAlert = false;
      this.showPasswordAlert = false;
      this.formIsValid = true;
      this.usernameMessage = "";
      this.passwordMessage = "";

      if (this.username === "") {
        this.showUsernameAlert = true;
        this.formIsValid = false;
        this.usernameMessage = "Please enter username";
      }

      if (this.password.length < 4) {
        this.showPasswordAlert = true;
        this.formIsValid = false;
        this.passwordMessage = "Password is too short";
      }

      if (this.password === "") {
        this.showPasswordAlert = true;
        this.formIsValid = false;
        this.passwordMessage = "Please enter password";
      }

      if (!this.formIsValid) {
        return;
      }

      this.isLoading = true;
      this.closeModal("closeLoginModal"); //close login modal after submit;

      try {
        await this.$store.dispatch("login", {
          username: this.username,
          password: this.password,
        });

   
        if(this.rememberMeCheckBox == true){
          this._rememberMe = this.username;
          localStorage.setItem('rememberMe',this.username);
          localStorage.setItem('rememberMePass',CryptoJS.AES.encrypt(this.password, this.cryptKey).toString());
          
         }else{
          this._rememberMe = '';
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('rememberMePass');
       
        }



        this.isLoading = false;
        this.closeModal("closeLoginModal");
        this.$router.replace("/pages/trips/");
      
    
    } catch (e) {

        this.closeModal("closeLoginModal"); //close login modal after submit;
        this.error = e.message || "Failed to authenticate.";

        alert(this.error);

        this.error = null;

        this.isLoading = false;
      }

      this.isLoading = false;
    },
  },

  emits: ["set-fullscreenwidth"],

  mounted() {

    //set some important variables
    localStorage.setItem("_rootRestUrl",this._rootRestUrl); // this._rootRestUrl come from settings.in read in main.js

    this.showSearch = false;

    //if user is logged in then go to project list!
    if (this.$store.getters.isAuthenticated) {
      this.$router.replace("/pages/projectList");
    }

    this.$emit("set-fullscreenwidth");
   
    if(localStorage.getItem('rememberMe')!=null){
      this._rememberMe = localStorage.getItem('rememberMe');
      this.rememberMeCheckBox = true;
      this.username = this._rememberMe;

    }else{
      this._rememberMe = '';
      this.rememberMeCheckBox = false;
     /* this.username = '';
        this.password = '';*/
    }

    if(localStorage.getItem('rememberMePass')!=null){  
    
          const decrypted = CryptoJS.AES.decrypt(localStorage.getItem('rememberMePass'), this.cryptKey)
          const originalPassword =  decrypted.toString(CryptoJS.enc.Utf8);
        
          this.password = originalPassword;

    }

if(this.username=='null'){
  this.username = '';  
}


    if(this.rememberMeCheckBox) {
        $('#Check1').attr('checked','checked');
    }   else{
        $('#Check1').removeAttr('checked');
    }
   
   

  },
};
</script>


<style>
@import "primevue/resources/themes/bootstrap4-light-blue/theme.css"; /*theme*/
@import "primevue/resources/primevue.min.css   "; /*core css*/
@import "primeicons/primeicons.css   "; /*icons*/

/* LOGIN PAGE */
.loginPageBackground {
  height: 100vh;
  background-size: cover;
  background-position: center;
}
.topLoginBar {
  background-color: rgb(0, 0, 0, 0.1);
  min-height: 55px;
}
#mainAppTitle {
  font-size: 1.23rem;
  font-weight: 700;
}
.signInHref {
  color: #787878;
}

.loginPageBackground {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}

.versionInfoHolder {
  position: absolute;
  bottom: 80px;
}

@media (min-width: 600px) {
  .versionInfoHolder {
    position: absolute;
    bottom: 20px;
  }
}



.form-check {
     padding-left:0 !important ;
  
}
.p-checkbox{margin-right:7px}

/* -------------------------*/
</style>