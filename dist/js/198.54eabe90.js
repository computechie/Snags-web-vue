"use strict";(self["webpackChunkSnags"]=self["webpackChunkSnags"]||[]).push([[198],{3198:function(e,s,l){l.r(s),l.d(s,{default:function(){return S}});var a=l(6768),t=l(4232);const o={class:"container"},i={class:"row"},n=(0,a.Lk)("div",{class:"col-md-12 text-center gap-2 gaptop-2"},[(0,a.Lk)("h4",null,"Forgot password :(")],-1),r={class:"col-md-12 text-center gap-2"},d={class:"flex flex-column gap-2"},c=(0,a.Lk)("label",{for:"password"},"Please enter your email",-1),u=(0,a.eW)("This field is required"),g={class:"col-md-12 text-center gap-2"},p=(0,a.Lk)("div",{class:"col-md-12 text-center gap-2"},[(0,a.Lk)("p",null,[(0,a.Lk)("a",{href:"/"},"back to home page")])],-1),h=(0,a.Lk)("span",{class:"font-bold text-2xl block mb-2 mt-4"},null,-1),m={class:"mb-0"},f={class:"flex text-end mt-4"};function k(e,s,l,k,w,y){const v=(0,a.g2)("base-spinner"),b=(0,a.g2)("base-dialog"),I=(0,a.g2)("top-bar"),L=(0,a.g2)("InputText"),x=(0,a.g2)("InlineMessage"),E=(0,a.g2)("Button"),S=(0,a.g2)("Dialog");return(0,a.uX)(),(0,a.CE)(a.FK,null,[(0,a.bF)(b,{show:w.isLoading,title:"Authenticating...",fixed:""},{default:(0,a.k6)((()=>[(0,a.bF)(v)])),_:1},8,["show"]),(0,a.bF)(I,{onEmitSearch:e.emitedSearch,"show-search":e.showSearch,"menu-icon":e.iconCloseOpen2,"background-style":"rgb(255,255,255,0.6)","title-color":"black","title-text":e.MainTitleText},null,8,["onEmitSearch","show-search","menu-icon","title-text"]),(0,a.Lk)("div",o,[(0,a.Lk)("div",i,[n,(0,a.Lk)("div",r,[(0,a.Lk)("div",d,[c,(0,a.bF)(L,{onInput:y.typing,type:"text",modelValue:w.userEmail,"onUpdate:modelValue":s[0]||(s[0]=e=>w.userEmail=e),style:{"min-width":"300px"}},null,8,["onInput","modelValue"]),(0,a.Lk)("p",null,[w.userEmailOK?(0,a.Q3)("",!0):((0,a.uX)(),(0,a.Wv)(x,{key:0},{default:(0,a.k6)((()=>[u])),_:1}))])])]),(0,a.Lk)("div",g,[(0,a.Lk)("p",null,[(0,a.bF)(E,{label:"Password recovery",onClick:y.passwordRecovery},null,8,["onClick"])])]),p])]),(0,a.bF)(S,{visible:w.displayInfoDialog,"onUpdate:visible":s[2]||(s[2]=e=>w.displayInfoDialog=e),modal:"",style:(0,t.Tr)(e.infoDialogStyle),breakpoints:{"1199px":"75vw","575px":"90vw"}},{header:(0,a.k6)((()=>[(0,a.Lk)("h4",null,(0,t.v_)(e.InfoModalHeader),1)])),default:(0,a.k6)((()=>[h,(0,a.Lk)("p",m,(0,t.v_)(e.InfoModalMessage),1),(0,a.Lk)("div",f,[(0,a.bF)(E,{label:"Ok",onClick:s[1]||(s[1]=e=>w.displayInfoDialog=!1)})])])),_:1},8,["visible","style"])],64)}var w=l(2161),y=l(5171),v=l(1393),b=l(7487),I=l(8355),L={components:{InputText:w.A,Button:y.A,Dialog:b.A,InlineMessage:v.A},data(){return{userEmail:"",userEmailOK:!0,displayInfoDialog:!1,isLoading:!1}},methods:{passwordRecovery(){var e=!0;""==this.userEmail||null==this.userEmail?(this.userEmailOK=!1,e=!1):this.userEmailOK=!0,1==e&&this.sendRecoveryEmail()},typing(){this.userEmailOK=!0},async sendRecoveryEmail(){this.isLoading=!0;const e=localStorage.getItem("token"),s=localStorage.getItem("_rootRestUrl");let l=JSON.stringify({sessionId:e,email:this.userEmail}),a={headers:{"Content-Type":"application/json"}};await I.A.post(s+"/api/v1/User/SendResetPasswordEmail",l,a).then((()=>{this.InfoModalHeader="Info",this.InfoModalMessage="If your email is registered we will now send you a message with instruction how to recover your password.",this.infoDialogStyle=[{width:"40rem"}],this.displayInfoDialog=!0,this.isLoading=!1})).catch((e=>{e.response&&(this.InfoModalHeader="Info",this.InfoModalMessage="If your email is registered we will now send you a message with instruction how to recover your password.",this.infoDialogStyle=[{width:"40rem"}],this.displayInfoDialog=!0),this.isLoading=!1}))}}},x=l(1241);const E=(0,x.A)(L,[["render",k]]);var S=E}}]);
//# sourceMappingURL=198.54eabe90.js.map