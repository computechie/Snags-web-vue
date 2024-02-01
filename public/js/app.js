var projectsJson = `

[

{"STATUSDESC":"Project is Active","KEY":"1D2F4F34794D4F6BB4712417264C9A6C!DFM12345654321","IMG":"",
"CONTRACTOR":"DFM Systems","ACTIVE":"True","PROJECTKEY":"1D2F4F34794D4F6BB4712417264C9A6C","REVISION":"",
"VALIDUNTIL":"2099-06-08 00:00:00","DFMONLINENUMBER":"DFM12345654321","PUBLISHDATE":"2020-11-24 00:00:00",
"NO":"12345654321","TITLE":"DFM Dormitory Demo"},

{"STATUSDESC":"Project is Active","KEY":"F4A8D690758748149726C1AF78ECB798!DFM445377A","IMG":"","CONTRACTOR":
"State Street","ACTIVE":"True","PROJECTKEY":"F4A8D690758748149726C1AF78ECB798","REVISION":"9",
"VALIDUNTIL":"2023-01-01 00:00:00","DFMONLINENUMBER":"DFM445377A","PUBLISHDATE":"2021-03-16 00:00:00",
"NO":"445377A","TITLE":"State Street Ireland Merged Projects"},

{"STATUSDESC":"Project is Active","KEY":"B928A87EAA694DA586CBD7FEF10A0A53!DFM445412","IMG":
"DFM445412\/Images\/445412.jpg?t=09\/09\/2019 23:27:56","CONTRACTOR":"Walls Construction",
"ACTIVE":"True","PROJECTKEY":"B928A87EAA694DA586CBD7FEF10A0A53","REVISION":"44",
"VALIDUNTIL":"2024-01-01 00:00:00","DFMONLINENUMBER":"DFM445412","PUBLISHDATE":
"2020-02-24 00:00:00","NO":"445412","TITLE":"Central Bank of Ireland - New HQ"},

{"STATUSDESC":"Project is offline","KEY":"C4B10F8506644CA4A0233C0CC4134AA5!DFM445454",
"IMG":"","CONTRACTOR":"Jones Engineering Group","ACTIVE":"False",
"PROJECTKEY":"C4B10F8506644CA4A0233C0CC4134AA5","REVISION":"2","VALIDUNTIL":
"2018-01-31 00:00:00","DFMONLINENUMBER":"DFM445454","PUBLISHDATE":
"2016-08-24 00:00:00","NO":"445454","TITLE":"AerCap - Mechanical"}

]

`;

var projectsObject = JSON.parse(projectsJson);

//visual settings:
var onLoadSidebarWidth = 200;
var breakPointForSmallScreen = 750;
var minWSidebarWidth = 38;
//var minSidebarWidthDragging = 38
var breakPointHideSidebarDescriptions = 150;
var maxPercentageSidebarWidth = 30;
var onLoadContentWidth = window.innerWidth - onLoadSidebarWidth;



const app = Vue.createApp({
  data() {
    return {
      projects: [], // get projects from json
     
      //ini settings
      linkToHelpFile : 'https://safetyfile.onlinedfm.com/Help/UserguideV2.0.1.84.pdf',

      // for visual settings:
      dividerPosition: onLoadSidebarWidth, //px default width of the left sidebar!
      contentWidth: onLoadContentWidth, //px width of the main content
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

      if ( (e.pageX+1) > minWSidebarWidth && percentage <= maxPercentageSidebarWidth) {
        //only resizable if width of the left sidebar is in this percentage range
        this.dividerPosition = (percentage / 100) * window.innerWidth;
        this.contentWidth = window.innerWidth - this.dividerPosition;
      }
      
      // on small screens hide sidebar menu descriptions
      if (e.pageX < breakPointHideSidebarDescriptions) {
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

    hideSidebarDesc(){
      alert("s")
    },


    getDimensions() {
      //on window resize

      if (window.innerWidth > breakPointForSmallScreen) {
        this.dividerPosition = onLoadSidebarWidth;
        this.contentWidth = window.innerWidth - this.dividerPosition;
        this.isActive = true;
        this.iconCloseOpen= '&times;'
        this.isCentered=false;
       
      } else {
       
        this.dividerPosition = minWSidebarWidth;
        this.isActive = false;
        this.iconCloseOpen='&#9776;'
        this.isCentered=true;
      }
     
    },
    sidebarColapse() {
      
      this.isActive = !this.isActive;
      this.isCentered= !this.isActive;
      
      if (this.dividerPosition > minWSidebarWidth) {
        this.dividerPosition = minWSidebarWidth;
        this.contentWidth = window.innerWidth - this.dividerPosition;
        this.iconCloseOpen='&#9776;'
      } else {
        this.dividerPosition = onLoadSidebarWidth;
        this.contentWidth = window.innerWidth - this.dividerPosition;
        this.iconCloseOpen= '&times;'
    
      }
    },
    
    // ----------- end resizable left menu -------
  },

  mounted() {
    
    window.addEventListener("resize", this.getDimensions);
  },
  unmounted() {
    window.removeEventListener("resize", this.getDimensions);
  },

  created() {
  
    //on create (on load)
    this.projects = projectsObject; // parsed json

    //hidden sidebar on load if small screen
    if (window.innerWidth < breakPointForSmallScreen) {
      this.dividerPosition = minWSidebarWidth;
    }

    if (window.innerWidth < breakPointForSmallScreen) {
      this.isActive = false;
      this.iconCloseOpen='&#9776;';
      this.isCentered=true;
    }else{
      this.isActive = true;
      this.iconCloseOpen='&times;';
      this.isCentered=false;
    }
  },
});

app.mount("#app");
