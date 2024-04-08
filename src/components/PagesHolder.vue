<template>

<base-dialog :show="!!error" title="Error"></base-dialog>
  <base-dialog :show="isLoading" title="Authenticating..." fixed>
    <base-spinner></base-spinner>
  </base-dialog>


  <base-dialog  :show="showCountDownDialog" fixed  >
    <div id="timerDialog"  class="text-center">
        <h5>Your session will expire soon!</h5>
        <vue3-flip-countdown :showDays="false" :showHours="false"  mainColor="#e2e2e2" secondFlipColor="#ffffff" mainFlipBackgroundColor="#147d95" secondFlipBackgroundColor='#730e27'  :deadline="deadline" @timeElapsed="sessionExpired()"/>  
        <button class="btn btn-primary" id="extendSessionButton" @click="closeTimeDialog">Keep alive</button>
    </div> 
  </base-dialog>      

    


  <top-bar
    @emitSearch="emitedSearch"
    v-bind:show-search="showSearch"
    v-bind:menu-icon="iconCloseOpen2"
    background-style="rgb(255,255,255,0.6)"
    title-color="black"
    v-bind:title-text="MainTitleText"
  ></top-bar>

  <div class="wrapper" @mouseup="endDragging()" style="position: relative">
    <div
      id="sidebar"
      v-if="showMenu"
      class="sidebar table-dark position-relative"
      :style="{
        width: `${dividerPosition}px`,
        minWidth: `${dividerPosition}px`,
      }"
    >
      <div class="sidebarTopMenu" v-if="showLeftMenu" v-bind:class="{ textcenter: isCentered }">
        <menu-link
          atitle="Snags"
          link="/pages/snags"
          icon="fa-solid fa-list"
          iconsize="21"
          :isActive="isActive"
        ></menu-link>

        <menu-link
          atitle="Dashboard"
          link="/pages/dashboard"
          icon="fa-solid fa-tachometer-alt"
          iconsize="21"
          :isActive="isActive"
        ></menu-link>
       
       
        <menu-link
          v-if="userType=='ADMIN'"
          atitle="Manage users"
          link="/pages/manageUsers"
          icon="fa-solid fa-users"
          iconsize="17"
          :isActive="isActive"
        ></menu-link>
        

        <sidebar-cde :isActive="isActive" v-if="isCDE" ></sidebar-cde>
        
  -    <img :src="_rootLoginLogo" class="sideBarAppLogo"     />


      </div>

     <!--<div class="sidebarBottomMenu" v-bind:class="{ textcenter: isCentered }">
        <menu-linkdirect
          atitle="Support"
          :link="_rootlinkToHelpFile"
          icon="fa-solid fa-circle-question"
          :isActive="isActive"
        ></menu-linkdirect>
      </div>-->


    </div>

    <div
      id="divider"
      v-if="showMenu"
      class="divider"
      :style="{ left: `${dividerPosition}px` }"
      @mousedown="startDragging()"
    ></div>

    <div
      id="content"
      class="content"
      :style="{
       
        paddingLeft: `${dividerPosition}px`,
        width: `${contentWidth}px`,
      }"
    >
      <section>
        <div class="container-fluid allContent"  :style="{ padding: `${this.padding0}` }">
          
          
          <router-view  @extend-session="showExtendPopupDialog()" ></router-view>
          
         


        </div>
      </section>
    </div>


  </div>



</template>




<script>
/*
//visual settings:
var onLoadSidebarWidth = 200;
var breakPointForSmallScreen = 750;
var minWSidebarWidth = 50;

var breakPointHideSidebarDescriptions = 150;
var maxPercentageSidebarWidth = 30;
var onLoadContentWidth = window.innerWidth - onLoadSidebarWidth;
*/
import moment from "moment";
import axios from "axios";


export default {
  props: ["emitSearch"],
  components: {
    
   
  },
  data() {
    return {
      showLeftMenu:true,
      countdownSize:'width:20rem',
      deadline:'2023-12-25 00:00:00',
      timerExtend:'',
      showCountDownDialog:false,
      isLoading:false,
      error:false,
      TopBackgroundStyle: "",
      showSearch: false,
      MainTitleText: "", //this._rootAppTitle,
      showMenu: true,
    
      userType: '',
      //what app is it (for differnet links in left sidebar menu)
      isCDE: false,
      isQMS: false,
      isSafetyfile: false,

      // for visual settings:
      padding0: "12px",
      menuMinSize: 0,
      breakPointHideSidebarDescriptions: 120, // when to hide menu description and show only icon
      dividerPosition: 210, //px default width of the left sidebar!
      contentWidth: window.innerWidth, //px width of the main content
      isActive: true, //in start visible sidebar icon descriptions
      isCentered: false, //sidebar icons on left at page load
      iconCloseOpen: "&#9776;",
      iconCloseOpen2: "&#9776;",
      timeout:'',
    };
  },

  methods: {
    /// ------------------------------
    /// resizable left sidebar!
    handleDragging(e) {
      const percentage = (e.pageX / window.innerWidth) * 100;

      if (localStorage.getItem("dividerPosition")) {
        this.dividerPosition = localStorage.getItem("dividerPosition");
      }

      if (e.pageX + 1 > this.menuMinSize && percentage <= 30) {
        //only resizable if width of the left sidebar is in this percentage range
        this.dividerPosition = (percentage / 100) * window.innerWidth;
      }
      this.contentWidth = window.innerWidth;

      // on small screens hide sidebar menu descriptions
      if (e.pageX < this.breakPointHideSidebarDescriptions) {
        this.isActive = false;
        this.iconCloseOpen = "&#9776;";
        //    this.isCentered = true;
      } else {
        this.isActive = true;
        this.iconCloseOpen = "&#9776;";
        this.isCentered = false;
      }
      this.emitter.emit("newDimensions", this.dividerPosition);

      localStorage.setItem("dividerPosition", this.dividerPosition);

        if( this.dividerPosition < 50){
          this.showLeftMenu=false;
        }else{
          this.showLeftMenu=true;
        }


      // -------------------
    },
    startDragging() {
      document.addEventListener("mousemove", this.handleDragging);
    },
    endDragging() {
      document.removeEventListener("mousemove", this.handleDragging);
    },

    setToFullScreenWidth() {
      this.contentWidth = window.innerWidth;

      // read if we have position set
      var isSideBarOpen = localStorage.getItem("isSideBarOpen");

      if (localStorage.getItem("dividerPosition")) {
        this.dividerPosition = localStorage.getItem("dividerPosition");
      } else {
        localStorage.setItem("dividerPosition", 200);
        this.dividerPosition = 200;
      }

      if (localStorage.getItem("isSideBarOpen")) {
        //there is something in local storage for open/close menu
        if (isSideBarOpen === "true") {
          this.iconCloseOpen = "&#9776;";
          this.isActive = false;
          this.sidebarColapseOnLoad();
        } else {
          this.iconCloseOpen = "&times;";
          this.isActive = false;
          this.sidebarColapseOnLoad();
        }
      } else {
        //empty localstorage fro menu open
        if (this.iconCloseOpen === "&#9776;") {
          localStorage.setItem("isSideBarOpen", true);

          this.sidebarColapseOnLoad();
        } else {
          localStorage.setItem("isSideBarOpen", false);

          this.sidebarColapseOnLoad();
        }
      }

      if( this.dividerPosition < 50){
          this.showLeftMenu=false;
        }else{
          this.showLeftMenu=true;
        }

       // alert(this.dividerPosition)
    },

    getDimensions() {
      //on window resize

      if (window.innerWidth > 442) {
        this.dividerPosition = 200;
        this.contentWidth = window.innerWidth;
        this.isActive = true;
        this.iconCloseOpen = "&times;";
        this.isCentered = false;
       
      } else {
        this.dividerPosition = this.menuMinSize;
        this.isActive = false;
        this.iconCloseOpen = "&#9776;";
      
      
        //  this.isCentered = true;
      }

      if (window.innerWidth < 500) {
        this.dividerPosition = this.menuMinSize;
        this.contentWidth = window.innerWidth;
        this.isActive = false;
        this.iconCloseOpen = "&#9776;";
        //   this.isCentered = true;
      }
    },
    sidebarColapse() {
      if (this.iconCloseOpen === "&#9776;") {
        //we want to open it

        if (localStorage.getItem("dividerPosition")) {
          this.dividerPosition = localStorage.getItem("dividerPosition");
        } else {
          this.dividerPosition = 200;
        }

        if (this.dividerPosition < 200) {
          this.dividerPosition = 200;
        }

        this.contentWidth = window.innerWidth;
        this.isActive = true;
        this.isCentered = false;
        this.iconCloseOpen = "&times;";
        localStorage.setItem("isSideBarOpen", true);
        
          this.showLeftMenu=true;
       
      } else {
        //we wnat to close it
        this.dividerPosition = this.menuMinSize;
        this.contentWidth = window.innerWidth;
        this.isActive = false;
        //     this.isCentered = true;
        this.iconCloseOpen = "&#9776;";
        localStorage.setItem("isSideBarOpen", false);

         this.showLeftMenu=false;
      }
       
       
      this.emitter.emit("newDimensions", this.dividerPosition);

       localStorage.setItem("dividerPosition", this.dividerPosition);
    },

    sidebarColapseOnLoad() {
      if (this.iconCloseOpen === "&#9776;") {
        //we want to open it

        if (localStorage.getItem("dividerPosition")) {
          this.dividerPosition = localStorage.getItem("dividerPosition");
        } else {
          this.dividerPosition = 200;
        }

        /*if( this.dividerPosition < 200){
          this.dividerPosition = 200;
        }*/

        this.contentWidth = window.innerWidth;
        this.isActive = true;
        this.isCentered = false;
        this.iconCloseOpen = "&times;";
        localStorage.setItem("isSideBarOpen", true);
      } else {
        //we wnat to close it
        this.dividerPosition = this.menuMinSize;
        this.contentWidth = window.innerWidth;
        this.isActive = false;
        //  this.isCentered = true;
        this.iconCloseOpen = "&#9776;";
        localStorage.setItem("isSideBarOpen", false);
      }

      if (this.dividerPosition < this.breakPointHideSidebarDescriptions) {
        this.isActive = false;
        this.iconCloseOpen = "&#9776;";
        //     this.isCentered = true;
      }
    },

    // ----------- end resizable left menu -------
    manualLogout() {
      this.$store.dispatch("logout");
      this.showMenu = false;
      this.$router.replace("/");
    },

    showSeachbar(what) {
      this.showSearch = what;
    },

    appType(what) {
     this.isCDE = false;
     this.isQMS = false;
     this.isSafetyfile = false;
    
    if (what == "CDE") {
        this.isCDE = true;
      }
      if (what == "QMS") {
        this.isQMS = true;
      }
      if (what == "SafetyFile") {
        this.isSafetyfile = true;
      }
    },

    showExtendPopupDialog(){

      // Countdown component:
      // https://github.com/coskuncay/vue3-flip-countdown

      const SESSIONTIMEOUT = 15; //minutes
      
      const SHOWWARNING = SESSIONTIMEOUT - 1; // 1 minute before expiry

      //first read when session expire
        var expiresIn = localStorage.getItem("expiresIn");
        const NowTime = moment();
        //const DeadLine = (NowTime*1) + (expiresIn*1);   // server session expiration
        const LocalDeadLine =  (NowTime*1) + (1000*60*SESSIONTIMEOUT);  // time to countdown
     
        this.deadline = (moment(LocalDeadLine).format('YYYY-MM-DD HH:mm:ss'));// local session expiration (formated)

        this._whenSessionExpire = this.LocalDeadLine;

        // When to show estend session dialog? 
        expiresIn = ((1000*60)*SHOWWARNING); 
       // expiresIn = 5000; // for test: 5 seconds until popup show
        
   
          clearTimeout(this.timeout);

          this.timeout = setTimeout(() => {
            this.showCountDownDialog = true;
            }, expiresIn);
      
     
    },

   
      async  extendSessionInDatabase(){ 



          const sessionId=this.$store.getters.token;
          const baseUrl = localStorage.getItem("_rootRestUrl");

          let formData = JSON.stringify({ sessionId: sessionId });
          let config = {
            headers: {
              "Content-Type": "application/json",
            },

          };
   
          await  axios
        
            .put(baseUrl + "/api/v1/Auth/ExtendSession/", formData, config)
            .then(() => {
              this.showExtendPopupDialog()
          
            })           
            .catch(function (error) {
                // handle error
                if(error.response.status=='401') { //not authorized, token expires
                localStorage.clear();
                document.location = '/';
              }
                console.table(error);
            });
            
          // after every request 
         //   this.$store.dispatch('autoLogin');  // go to AUTOLOGIN to extend "local" token valication
            this.showExtendPopupDialog(); // extend timeout to show expire session dialog
            // ---------------------
         

    },

    sessionExpired(){
      
       this.$store.dispatch('logout');
    //   document.location = '/';
       
     },

     closeTimeDialog(){
      this.showCountDownDialog=false;
      this.extendSessionInDatabase();

     },

    emitedSearch() {},
  },
 // emits: ["emitSearch"],

  mounted() {

       //what app, dieffent sidebar manu links
   // this.userType = (this.$store.getters.getUserType).toUpperCase();
   
    window.addEventListener("resize", this.getDimensions);

    this.showExtendPopupDialog();

  },
  unmounted() {
    window.removeEventListener("resize", this.getDimensions);
  },

  created() {
  
    const appType =  localStorage.getItem("appType");
    if(appType=='CDE'){
      this.isCDE = true;
    }


    this.setToFullScreenWidth();

    //if user is no loged in then redirect to login page:
    if (!this.$store.getters.isAuthenticated) {
      this.$router.replace("/");
    }

    //check if user is loggen in
  //  this.$store.dispatch("autoLogin");

    //on create (on load)
    // this.projects = projectsObject; // parsed json

    //hidden sidebar on load if small screen
    if (window.innerWidth < 750) {
      // this.dividerPosition = this.menuMinSize;
    }

    /*if (window.innerWidth < 750) {
      this.isActive = false;
      this.iconCloseOpen = "&#9776;";
      this.isCentered = true;
    } else {
      this.isActive = true;
      this.iconCloseOpen = "&times;";
      this.isCentered = false;
    }*/
  },
};
</script>

<style>
@import "primevue/resources/themes/bootstrap4-light-blue/theme.css"; /*theme*/
@import "primevue/resources/primevue.min.css   "; /*core css*/
@import "primeicons/primeicons.css   "; /*icons*/


a.router-link-active {
  background: #730e27;
  color: white !important;
}
a.router-link-active:hover {
  background: #730e27;
  color: white !important;
}

.sidebar {
  position: fixed !important;
}
.divider {
  position: fixed !important;
}

.sidebar {
  background: #f0f0f0;
  font-size: 0.92rem;
  min-width: 32px;
  position: fixed;
  height: calc(100vh - 65px);
}
.sidebarBottomMenu,
.sidebarTopMenu {
  position: absolute;
  left: 3px;
  width: calc(100% - 6px);
  height:calc(100vh - 120px)
}
a.router-link-active,
a.router-link-active:hover {
  background: #730e27;
  color: #fff !important;
}
.divider,
.sidebar {
  position: fixed !important;
}

.sidebarMenuRow i {
  width: 21px;
}
.sidebarMenuRow {
  display: block;
  margin-bottom: 3px;
}
.sidebar {
  background: #f0f0f0;
  font-size: 0.92rem;
  min-width: 32px;
  position: fixed;
  height: calc(100vh - 65px);
}
.sidebar a {
  color: #444;
  text-decoration: none;
}
.sideBarIcon {
  font-size: 1rem;
}
.sidebarTopMenu {
  top: 69px;
}
.sidebarBottomMenu,
.sidebarTopMenu {
  position: absolute;
  left: 3px;
  width: calc(100% - 6px);
}
.sidebarBottomMenu {
  bottom: 10px;
}
.sidebarBottomMenu i,
.sidebarTopMenu i {
  margin-left: 1px;
}
.sidebarMenuRow {
  padding: 0px;
  width: 100%;
  padding-left: 6px;
  padding-right: 6px;
  height:44px;
  width: calc(100% - 8px)
}
.sidebarMenuRow:hover {
  background-color: #c2c2c2;
  vertical-align: middle;
}
.menuDesc {
  margin-left: 12px;
}
#mainProjectTitle{color:black}
#mainProjectTitle h3{font-size:19px;margin-bottom:5px !important}
#mainProjectTitle h5{font-size:14px}

.p-datatable thead tr th{
  background: #730e27 !important;
  color: white !important;
}

.p-column-filter-menu-button{color:white !important}

#timerDialog{
  border:1px solid #DDD;
  background:#dadada;
  box-shadow: 1px 3px 3px #333;
  padding:10px;
  border-radius: 8px;
 
}

#extendSessionButton{
  margin:12px;
}
.backdrop{backdrop-filter: blur(2px);background-color:rgba(255, 255, 255, 0.0) !important}

.sideBarAppLogo{margin-bottom:8px;margin-left: 13px; max-width: calc(100% - 70px);min-width:150px;position:absolute;bottom:25px}

.allContent{background:white;z-index:99;position:relative;overflow: hidden; }
.topLoginBar{z-index:100;position:absolute;top:0px}
</style>


