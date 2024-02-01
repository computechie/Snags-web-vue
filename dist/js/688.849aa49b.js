"use strict";(self["webpackChunktransport"]=self["webpackChunktransport"]||[]).push([[688],{7688:function(i,e,t){t.r(e),t.d(e,{default:function(){return m}});var s=t(3396),o=t(7139);const n={id:"timerDialog",class:"text-center"},d=(0,s._)("h5",null,"Your session will expire soon!",-1);function r(i,e,t,r,a,h){const l=(0,s.up)("base-dialog"),c=(0,s.up)("base-spinner"),p=(0,s.up)("vue3-flip-countdown"),g=(0,s.up)("top-bar"),u=(0,s.up)("menu-link"),m=(0,s.up)("sidebar-cde"),v=(0,s.up)("router-view");return(0,s.wg)(),(0,s.iD)(s.HY,null,[(0,s.Wm)(l,{show:!!a.error,title:"Error"},null,8,["show"]),(0,s.Wm)(l,{show:a.isLoading,title:"Authenticating...",fixed:""},{default:(0,s.w5)((()=>[(0,s.Wm)(c)])),_:1},8,["show"]),(0,s.Wm)(l,{show:a.showCountDownDialog,fixed:"",style:{width:"20rem"}},{default:(0,s.w5)((()=>[(0,s._)("div",n,[d,(0,s.Wm)(p,{showDays:!1,showHours:!1,mainColor:"#e2e2e2",secondFlipColor:"#ffffff",mainFlipBackgroundColor:"#147d95",secondFlipBackgroundColor:"#138BA7",deadline:a.deadline,onTimeElapsed:e[0]||(e[0]=i=>h.sessionExpired())},null,8,["deadline"]),(0,s._)("button",{class:"btn btn-primary",id:"extendSessionButton",onClick:e[1]||(e[1]=(...i)=>h.closeTimeDialog&&h.closeTimeDialog(...i))},"Keep alive")])])),_:1},8,["show"]),(0,s.Wm)(g,{onEmitSearch:h.emitedSearch,"show-search":a.showSearch,"menu-icon":a.iconCloseOpen2,"background-style":"rgb(255,255,255,0.6)","title-color":"black","title-text":a.MainTitleText},null,8,["onEmitSearch","show-search","menu-icon","title-text"]),(0,s._)("div",{class:"wrapper",onMouseup:e[4]||(e[4]=i=>h.endDragging()),style:{position:"relative"}},[a.showMenu?((0,s.wg)(),(0,s.iD)("div",{key:0,id:"sidebar",class:"sidebar table-dark position-relative",style:(0,o.j5)({width:`${a.dividerPosition}px`,minWidth:`${a.dividerPosition}px`})},[(0,s._)("div",{class:(0,o.C_)(["sidebarTopMenu",{textcenter:a.isCentered}])},[(0,s.Wm)(u,{atitle:"Trips list",link:"/pages/trips",icon:"fa-solid fa-list",iconsize:"21",isActive:a.isActive},null,8,["isActive"]),"ADMIN"==a.userType?((0,s.wg)(),(0,s.j4)(u,{key:0,atitle:"Manage users",link:"/pages/manageUsers",icon:"fa-solid fa-users",iconsize:"17",isActive:a.isActive},null,8,["isActive"])):(0,s.kq)("",!0),a.isCDE?((0,s.wg)(),(0,s.j4)(m,{key:1,isActive:a.isActive},null,8,["isActive"])):(0,s.kq)("",!0)],2)],4)):(0,s.kq)("",!0),a.showMenu?((0,s.wg)(),(0,s.iD)("div",{key:1,id:"divider",class:"divider",style:(0,o.j5)({left:`${a.dividerPosition}px`}),onMousedown:e[2]||(e[2]=i=>h.startDragging())},null,36)):(0,s.kq)("",!0),(0,s._)("div",{id:"content",class:"content",style:(0,o.j5)({paddingLeft:`${a.dividerPosition}px`,width:`${a.contentWidth}px`})},[(0,s._)("section",null,[(0,s._)("div",{class:"container-fluid",style:(0,o.j5)({padding:`${this.padding0}`})},[(0,s.Wm)(v,{onExtendSession:e[3]||(e[3]=i=>h.showExtendPopupDialog())})],4)])],4)],32)],64)}var a=t(6797),h=t.n(a),l=t(6265),c=t.n(l),p={props:["emitSearch"],components:{},data(){return{deadline:"2023-12-25 00:00:00",timerExtend:"",showCountDownDialog:!1,isLoading:!1,error:!1,TopBackgroundStyle:"",showSearch:!1,MainTitleText:"",showMenu:!0,userType:"",isCDE:!1,isQMS:!1,isSafetyfile:!1,padding0:"12px",menuMinSize:50,breakPointHideSidebarDescriptions:198,dividerPosition:210,contentWidth:window.innerWidth,isActive:!0,isCentered:!1,iconCloseOpen:"&#9776;",iconCloseOpen2:"&#9776;",timeout:""}},methods:{handleDragging(i){const e=i.pageX/window.innerWidth*100;localStorage.getItem("dividerPosition")&&(this.dividerPosition=localStorage.getItem("dividerPosition")),i.pageX+1>this.menuMinSize&&e<=30&&(this.dividerPosition=e/100*window.innerWidth),this.contentWidth=window.innerWidth,i.pageX<this.breakPointHideSidebarDescriptions?(this.isActive=!1,this.iconCloseOpen="&#9776;"):(this.isActive=!0,this.iconCloseOpen="&#9776;",this.isCentered=!1),this.emitter.emit("newDimensions",this.dividerPosition),localStorage.setItem("dividerPosition",this.dividerPosition)},startDragging(){document.addEventListener("mousemove",this.handleDragging)},endDragging(){document.removeEventListener("mousemove",this.handleDragging)},setToFullScreenWidth(){this.contentWidth=window.innerWidth;var i=localStorage.getItem("isSideBarOpen");localStorage.getItem("dividerPosition")?this.dividerPosition=localStorage.getItem("dividerPosition"):(localStorage.setItem("dividerPosition",200),this.dividerPosition=200),localStorage.getItem("isSideBarOpen")?"true"===i?(this.iconCloseOpen="&#9776;",this.isActive=!1,this.sidebarColapseOnLoad()):(this.iconCloseOpen="&times;",this.isActive=!1,this.sidebarColapseOnLoad()):"&#9776;"===this.iconCloseOpen?(localStorage.setItem("isSideBarOpen",!0),this.sidebarColapseOnLoad()):(localStorage.setItem("isSideBarOpen",!1),this.sidebarColapseOnLoad())},getDimensions(){window.innerWidth>442?(this.dividerPosition=200,this.contentWidth=window.innerWidth,this.isActive=!0,this.iconCloseOpen="&times;",this.isCentered=!1):(this.dividerPosition=this.menuMinSize,this.isActive=!1,this.iconCloseOpen="&#9776;"),window.innerWidth<500&&(this.dividerPosition=this.menuMinSize,this.contentWidth=window.innerWidth,this.isActive=!1,this.iconCloseOpen="&#9776;")},sidebarColapse(){"&#9776;"===this.iconCloseOpen?(localStorage.getItem("dividerPosition")?this.dividerPosition=localStorage.getItem("dividerPosition"):this.dividerPosition=200,this.dividerPosition<200&&(this.dividerPosition=200),this.contentWidth=window.innerWidth,this.isActive=!0,this.isCentered=!1,this.iconCloseOpen="&times;",localStorage.setItem("isSideBarOpen",!0)):(this.dividerPosition=this.menuMinSize,this.contentWidth=window.innerWidth,this.isActive=!1,this.iconCloseOpen="&#9776;",localStorage.setItem("isSideBarOpen",!1)),this.emitter.emit("newDimensions",this.dividerPosition),localStorage.setItem("dividerPosition",this.dividerPosition)},sidebarColapseOnLoad(){"&#9776;"===this.iconCloseOpen?(localStorage.getItem("dividerPosition")?this.dividerPosition=localStorage.getItem("dividerPosition"):this.dividerPosition=200,this.contentWidth=window.innerWidth,this.isActive=!0,this.isCentered=!1,this.iconCloseOpen="&times;",localStorage.setItem("isSideBarOpen",!0)):(this.dividerPosition=this.menuMinSize,this.contentWidth=window.innerWidth,this.isActive=!1,this.iconCloseOpen="&#9776;",localStorage.setItem("isSideBarOpen",!1)),this.dividerPosition<this.breakPointHideSidebarDescriptions&&(this.isActive=!1,this.iconCloseOpen="&#9776;")},manualLogout(){this.$store.dispatch("logout"),this.showMenu=!1,this.$router.replace("/")},showSeachbar(i){this.showSearch=i},appType(i){this.isCDE=!1,this.isQMS=!1,this.isSafetyfile=!1,"CDE"==i&&(this.isCDE=!0),"QMS"==i&&(this.isQMS=!0),"SafetyFile"==i&&(this.isSafetyfile=!0)},showExtendPopupDialog(){const i=15,e=i-1;var t=localStorage.getItem("expiresIn");const s=h()(),o=1*s+6e4*i;this.deadline=h()(o).format("YYYY-MM-DD HH:mm:ss"),this._whenSessionExpire=this.LocalDeadLine,t=6e4*e,clearTimeout(this.timeout),this.timeout=setTimeout((()=>{this.showCountDownDialog=!0}),t)},async extendSessionInDatabase(){const i=this.$store.getters.token,e=localStorage.getItem("_rootRestUrl");let t=JSON.stringify({sessionId:i}),s={headers:{"Content-Type":"application/json"}};await c().put(e+"/api/v1/Auth/ExtendSession/",t,s).then((()=>{this.showExtendPopupDialog()})).catch((function(i){"401"==i.response.status&&(localStorage.clear(),document.location="/"),console.table(i)})),this.$store.dispatch("autoLogin"),this.showExtendPopupDialog()},sessionExpired(){this.$store.dispatch("logout"),document.location="/"},closeTimeDialog(){this.showCountDownDialog=!1,this.extendSessionInDatabase()},emitedSearch(){}},mounted(){this.userType=this.$store.getters.getUserType.toUpperCase(),window.addEventListener("resize",this.getDimensions),this.showExtendPopupDialog()},unmounted(){window.removeEventListener("resize",this.getDimensions)},created(){const i=localStorage.getItem("appType");"CDE"==i&&(this.isCDE=!0),this.setToFullScreenWidth(),this.$store.getters.isAuthenticated||this.$router.replace("/"),this.$store.dispatch("autoLogin"),window.innerWidth}},g=t(89);const u=(0,g.Z)(p,[["render",r]]);var m=u}}]);
//# sourceMappingURL=688.849aa49b.js.map