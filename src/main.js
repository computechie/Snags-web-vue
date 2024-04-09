import { createApp, defineAsyncComponent } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import axios from "axios";
import App from "./App.vue";
import mitt from "mitt";

import PrimeVue from "primevue/config";

const emitter = mitt();

// static pages allways loaded
import LoginPage from "./components/LoginPage.vue";

//async pages, loaded only when needed! not in advance
const PagesHolder = () => import("./components/PagesHolder.vue");

//--Transport pages
const PageSnags = () => import("./components/pages/snags/PageSnags.vue");
const ManageUsers = () => import("./components/pages/snags/ManageUsers.vue");

//--Password recovery pages
const ResetPassword = () => import("./components/pages/ResetPassword.vue");
const ForgotPassword = () => import("./components/pages/ForgotPassword.vue");

//includable parts of the page
import TopBar from "./components/include/TopBar.vue";
import SidebarCDE from "./components/include/SidebarCDE.vue";

/// some UI
import BaseDialog from "./components/ui/BaseDialog.vue";
import BaseSpinner from "./components/ui/BaseSpinner.vue";
import SearchHolder from "./components/ui/SearchHolder.vue";
import SidebarmenuLink from "./components/ui/SidebarMenuLink.vue";
import SidebarMenuLinkDirect from "./components/ui/SidebarMenuLinkDirect.vue";
import Multiselect from "@vueform/multiselect"; //multi select userguide: https://github.com/vueform/multiselect
import Tooltip from "primevue/tooltip";
import SwiperCarouselVue from "./components/ui/SwiperCarousel.vue";
import VueImageZoomer from "vue-image-zoomer"; // https://github.com/samjonesigd/vue-image-zoomer
import "vue-image-zoomer/dist/style.css";
import Countdown from "vue3-flip-countdown";

// block of code sometimes loaded
const ContactInfo = defineAsyncComponent(() =>
  import("./components/ui/ContactInfo.vue")
);
const VersionInfo = defineAsyncComponent(() =>
  import("./components/ui/VersionInfo.vue")
);

const router = createRouter({
  scrollBehavior() {
    // always scroll to top
    /* console.log(to);
    console.log(from);
    console.log(savedPosition)*/
    return { top: 0 };
  },

  history: createWebHistory(""),
  routes: [
    // { path: "/", component: LoginPage, meta: { requiresUnAuth: true } },
    { path: "/", component: PageSnags, redirect: "/pages/snags" },

    {
      path: "/resetPassword/:resetKey",
      component: ResetPassword,
      name: "ResetPassword",
      props: true,
      meta: { requiresAuth: false },
    },

    {
      path: "/forgotPassword",
      component: ForgotPassword,
      name: "ForgotPassword",

      meta: { requiresAuth: false },
    },

    {
      path: "/pages",
      component: PagesHolder,
      redirect: "/",

      children: [
        // PAGES
        {
          path: "/pages/snags",
          component: PageSnags,
          name: "PageSnags",
          meta: { requiresAuth: false }, // CHANGE TO TRUE !!!!!!!!!!!!!!!!!!!!!!!!!!!
        },
        {
          path: "/pages/dashboard",
          component: PageDashboard,
          name: "PageDashboard",
          meta: { requiresAuth: false }, // CHANGE TO TRUE !!!!!!!!!!!!!!!!!!!!!!!!!!!
        },
        {
          path: "/pages/manageUsers",
          component: ManageUsers,
          name: "manageUsers",
          meta: { requiresAuth: true },
        },

        //-- end pages
      ],
    },
  ],
});

router.beforeEach(function (to, from, next) {
  if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
    next("/");
  } else {
    store.dispatch("autoLogin");
    // next();
  }

  if (to.meta.requiresUnAuth && store.getters.isAuthenticated) {
    next("/pages/trips");
  } else {
    store.dispatch("autoLogin");
    next();
  }
});

const app = createApp(App);
import store from "./store/index.js";
import PageDashboard from "./components/pages/Dashboard/PageDashboard.vue";

app.config.globalProperties.emitter = emitter;

//global variables
app.config.globalProperties._rootVersion = process.env.VUE_APP_VERSION; // get From package.json
//-- more variables loaded from /settings.json

axios.get("/settings.json").then((resp) => {
  var settings = resp.data;
  var obj = settings[0];

  Object.keys(obj).forEach(function (key) {
    var value = obj[key];

    //global variables read from /settings.json file!!
    if (key == "RestUrl") {
      app.config.globalProperties._rootRestUrl = value;
      localStorage.setItem("_rootRestUrl", value);
    }

    if (key == "AppTitle") {
      app.config.globalProperties._rootAppTitle = value;
    }
    if (key == "DefaultProjectCard") {
      app.config.globalProperties._rootDefaultProjectCard = value;
    }
    if (key == "LoginBackground") {
      app.config.globalProperties._rootLoginBackground = value;
    }
    if (key == "LoginLogo") {
      app.config.globalProperties._rootLoginLogo = value;
    }
    if (key == "LoginLogoWhite") {
      app.config.globalProperties._rootLoginLogoWhite = value;
    }
    if (key == "LinkToHelpFile") {
      app.config.globalProperties._rootlinkToHelpFile = value;
    }
    if (key == "LinkToUpdateHistory") {
      app.config.globalProperties._rootLinkToUpdateHistory = value;
    }
  });

  app.config.globalProperties._whenSessionExpire = "";
  app.config.globalProperties._rememberMe = "ggg";

  app.use(router);
  app.use(store);
  app.use(PrimeVue);
  app.use(VueImageZoomer);
  app.use(Countdown);

  app.component("top-bar", TopBar);
  app.component("sidebar-cde", SidebarCDE);

  app.component("login-page", LoginPage);

  app.component("version-info", VersionInfo);
  app.component("contact-info", ContactInfo);
  app.component("search-holder", SearchHolder);
  app.component("base-spinner", BaseSpinner);
  app.component("base-dialog", BaseDialog);
  app.component("menu-link", SidebarmenuLink);
  app.component("menu-linkdirect", SidebarMenuLinkDirect);
  app.component("v-select", Multiselect);
  app.component("SwiperCarousel", SwiperCarouselVue);

  app.directive("tooltip", Tooltip);

  app.mount("#app");
});

// -------------------
