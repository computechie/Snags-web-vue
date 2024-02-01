<template>
              <a v-bind:href="link" class="sidebarMenuRow" target="_blank" :title="atitle">
                        <i v-bind:class="icon"></i>
                        <span class="menuDesc" v-bind:class="{ active: isActive}">{{ atitle }}</span>
              </a>
</template>


<script>

export default {
   props:[
    'atitle',
    'link',
    'isCentered',
    'isActive',
    'icon'
  ],
}

</script>

<style>
.sidebarMenuRow i {font-size:21px}
.sidebarMenuRow {margin-bottom:6px !important;padding:8px !important}
</style>