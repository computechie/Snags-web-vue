<template>
  <span class="fa-stack fa-2x" style="left: -10px">
    <i
      class="fa-solid fa-square fa-stack-2x"
      :style="'color: ' + downIconcolor"
    ></i>
    <i class="fa-stack-1x" :class="downIcon" style="color: white"></i>
  </span>
  <h4 style="margin-top: 10px">{{ downTitle }}</h4>
  <p class="small1">
    {{ downDesc }}
  </p>
  <button class="btn btn-primary">Download</button>
</template>

<script>
export default {
  props: ["downIcon", "downTitle", "downDesc", "downLink", "downIconcolor"],

  data() {
    return {};
  },
  methods: {},
};
</script>

<style>
.small1 {
  font-size: 0.9rem;
}
</style>
