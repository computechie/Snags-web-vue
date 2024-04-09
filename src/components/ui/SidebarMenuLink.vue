<template>
  <router-link v-bind:to="link" class="sidebarMenuRow" :title="atitle">
    <span class="icon-holder text-center"
      ><i v-bind:class="icon" v-bind:style="{ fontSize: iconsize + 'px' }"></i
    ></span>
    <span class="menuDesc" v-bind:class="{ active: isActive }"
      >{{ atitle }}
      <span v-if="badge" class="badge bg-primary">{{ badge }}</span>
      <span v-if="messagesBadge" class="badge bg-primary">{{
        messagesBadge
      }}</span></span
    >
  </router-link>
</template>

<script>
export default {
  props: [
    "atitle",
    "link",
    "isCentered",
    "isActive",
    "icon",
    "iconsize",
    "badge",
    "messagesBadge",
  ],
  created() {},
};
</script>

<style>
.sidebarMenuRow i {
  font-size: 21px;
}
.sidebarMenuRow {
  margin-left: 4px;
  margin-bottom: 6px !important;
  padding: 8px !important;
}
.icon-holder {
  width: 22px;
  display: inline-block;
}
</style>
