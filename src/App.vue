<template>
           
            <section>
               <div class="container-fluid"  :style="{padding: `${this.padding0}`}">
                  <router-view></router-view>
               </div>
            </section>

</template>

<script>
/*
//visual settings:
var onLoadSidebarWidth = 200;
var breakPointForSmallScreen = 750;
var minWSidebarWidth = 38;

var breakPointHideSidebarDescriptions = 150;
var maxPercentageSidebarWidth = 30;
var onLoadContentWidth = window.innerWidth - onLoadSidebarWidth;
*/


export default {
  
  data() {
    return {
       defaultLoginBackground: 'images/login-background.jpg', 
       mainAppTitle : 'Transport',
       whenSessionExpired:"tomorrow",

      showMenu:false,

       //ini settings
      linkToHelpFile : '',

      // for visual settings:
      
      padding0:'0px',
      dividerPosition: 200, //px default width of the left sidebar!
      contentWidth: (window.innerWidth - 200), //px width of the main content
      isActive: true,       //in start visible sidebar icon descriptions
      isCentered: false,     //sidebar icons on left at page load
      iconCloseOpen: '&times;',
    };
  },

  methods: {
    /// ------------------------------
    /// resizable left sidebar!
    handleDragging(e) {
      
      const percentage = (e.pageX / window.innerWidth) * 100;

      if ( (e.pageX+1) > 38 && percentage <= 30) {
        //only resizable if width of the left sidebar is in this percentage range
        this.dividerPosition = (percentage / 100) * window.innerWidth;
        this.contentWidth = window.innerWidth - this.dividerPosition;
      }
      
      // on small screens hide sidebar menu descriptions
      if (e.pageX < 150) {
        this.isActive = false;
        this.iconCloseOpen='&#9776;'
        this.isCentered=true;
      } else {
        this.isActive = true;
        this.iconCloseOpen='&times;'
        this.isCentered=false;
      }
      // -------------------
    },
    startDragging() {
        document.addEventListener("mousemove", this.handleDragging);
    },
    endDragging() {
      document.removeEventListener("mousemove", this.handleDragging);
    },

   
    displayMenuToggle(){
     
       this.showMenu = true;
       //this.getDimensions() ;

       this.padding0='12px';
       this.dividerPosition= 200; //px default width of the left sidebar!
       this.contentWidth= (window.innerWidth - 200); //px width of the main content
    },
    setToFullScreenWidth(){
     
      this.contentWidth = window.innerWidth // login page has full screen width without sidebar
      this.padding0 = '0px';
    },

    getDimensions() {
      //on window resize
    
      if (window.innerWidth > 750) {
        this.dividerPosition = 200;
        this.contentWidth = window.innerWidth - this.dividerPosition;
        this.isActive = true;
        this.iconCloseOpen= '&times;'
        this.isCentered=false;
       
      } else {
       
        this.dividerPosition = 38;
        this.isActive = false;
        this.iconCloseOpen='&#9776;'
        this.isCentered=true;
      }
     
    },
    sidebarColapse() {
      
      this.isActive = !this.isActive;
      this.isCentered= !this.isActive;
      
      if (this.dividerPosition > 38) {
        this.dividerPosition = 38;
        this.contentWidth = window.innerWidth - this.dividerPosition;
        this.iconCloseOpen='&#9776;'
      } else {
        this.dividerPosition = 200;
        this.contentWidth = window.innerWidth - this.dividerPosition;
        this.iconCloseOpen= '&times;'
    
      }
    },

    manualLogout(){
       this.$store.dispatch('logout');
       this.showMenu = false;
       this.$router.replace('/');
    }
    
    // ----------- end resizable left menu -------
  },

  mounted() {
    
    window.addEventListener("resize", this.getDimensions);

     
  },
  unmounted() {
    window.removeEventListener("resize", this.getDimensions);
  },

  created() {
  
    //check if user is loggen in
    this.$store.dispatch('autoLogin');

    
    
    //on create (on load)
    // this.projects = projectsObject; // parsed json

    //hidden sidebar on load if small screen
    if (window.innerWidth < 750) {
      this.dividerPosition = 38;
    }

    if (window.innerWidth < 750) {
      this.isActive = false;
      this.iconCloseOpen='&#9776;';
      this.isCentered=true;
    }else{
      this.isActive = true;
      this.iconCloseOpen='&times;';
      this.isCentered=false;
    }
  },
  computed:{
    isLoggedIn(){

      return this.$store.getters.isAuthenticated;
    },
     userFullname(){
      return this.$store.getters.getUserFullName;
    },
    didAutoLogout(){
      return this.$store.getters.didAutoLogout;
    }
  },

  watch: {
    didAutoLogout(curValue, oldValue){
        if(curValue && curValue !== oldValue){
           this.showMenu = false;
           this.$router.replace('/');
        }
    }
  }



};
</script>