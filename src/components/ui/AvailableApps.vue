<template>
  <!--  @click="parent.setProjectType('CDE')" -->

  <div
    @click="setProjectType(appShortcode, disabled)"
    class="card mb-3 appCards"
    :class="{ disabled: disabled }"
    :style="
      'height:calc(100% - 16px);background-color:' +
      backgroundColor +
      ';color:' +
      textColor +
      ' !important'
    "
  >
    <div class="card-header">{{ appName }}</div>
    <div class="card-body">
      <h5 class="card-title">{{ appSubTitle }}</h5>
      <p class="card-text">{{ appDescription }}</p>
      <!--  <router-link  @click="setProjectType(appShortcode)" :to="'/pages/project/'+ appShortcode +'/'+selectedProjectKey" class="btn btn-primary text-white ">Open app</router-link  >-->
    </div>
  </div>
</template>

<script>
export default {
  props: [
    "appName",
    "appShortcode",
    "appColor",
    "appSubTitle",
    "applink",
    "appDescription",
    "disabled",
    "selectedProjectKey",
    "backgroundColor",
    "textColor",
  ],

  data() {
    return {
      isDis: false,
      randomNumber: null,
      radnomColor: "",
    };
  },
  methods: {
    setProjectType(type, disabled) {
      //alert(disabled)
      this.$parent.setProjectType(type, disabled);
    },
  },
};
</script>

<style>
.appCards {
  cursor: pointer;
  border-radius: 0.5rem;
  padding: 0.06rem;
}
.appCards:hover {
  top: 1px;
  left: 1px;
  box-shadow: 4px 4px 12px #888888;
}
.appCards.disabled {
  background-color: #ccc !important;
  border-color: #999 !important;
  color: #999 !important;
}
.appCards.disabled:hover {
  top: 0px;
  left: 0px;
  box-shadow: none;
  background-color: #ccc !important;
}
</style>
