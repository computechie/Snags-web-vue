<template>
<hr class="darkLine">
 <menu-link
    atitle="Dashboard"
   
    :link="'/pages/project/CDE/' + selectedProjectKey"
    icon="fa-solid fa-chart-line"
    iconsize="17"
     :isActive="isActive"
  ></menu-link>

  <menu-link
    atitle="To Do"
    :badge="todoBadge"
    :link="'/pages/projects/CDE/todo/' + selectedProjectKey"
    icon="fa-solid fa-briefcase"
    iconsize="17"
     :isActive="isActive"
  ></menu-link>
<hr class="darkLine">
 
          <menu-link
            atitle="Files"
            :link="'/pages/projects/CDE/files/' + selectedProjectKey"
            icon="fa-regular fa-file"
            @click="setDocType('files')"
            iconsize="19"
            :isActive="isActive"
          ></menu-link>
 
          <menu-link
          atitle="Drawings submittals"
          :link="'/pages/projects/CDE/drawings/'+selectedProjectKey"
          icon="fa-regular fa-file-image"
          @click="setDocType('drawings')"
          iconsize="19" :isActive="isActive"
         ></menu-link>

         <menu-link
          atitle="Technical submittals"
          :link="'/pages/projects/CDE/technical/'+selectedProjectKey"
          icon="fa-regular fa-file-lines"
          @click="setDocType('techical')"
          iconsize="19" :isActive="isActive"
         ></menu-link>

          <menu-link
          atitle="RFI"
          :link="'/pages/projects/CDE/rfi/'+selectedProjectKey"
          icon="fa-solid fa-file-circle-question"
          @click="setDocType('rfi')"
          iconsize="19" :isActive="isActive"
         ></menu-link>

  
  
  <hr class="darkLine">
          <menu-link
          atitle="Share"
          :link="'/pages/projects/CDE/share/'+selectedProjectKey"
          icon="fa-solid fa-share-nodes"
          iconsize="17" :isActive="isActive"
         ></menu-link>

         <menu-link
          atitle="Messages"
          :messagesBadge="messagesBadge"
          :link="'/pages/projects/CDE/messages/'+selectedProjectKey"
          icon="fa-solid fa-message"
          iconsize="17" :isActive="isActive"
         ></menu-link>

         <menu-link
          atitle="Groups"
          :link="'/pages/projects/CDE/groups/'+selectedProjectKey"
          icon="fa-solid fa-people-group"
          iconsize="17" :isActive="isActive"
         ></menu-link>

          <menu-link
          atitle="Download"
          :link="'/pages/projects/CDE/download/'+selectedProjectKey"
          icon="fa-solid fa-download"
          iconsize="17" :isActive="isActive"
         ></menu-link>
</template>

<script>
//using component inside component so need import again, hm (maybe there is some better way for this?)
import SidebarmenuLink from "../ui/SidebarMenuLink.vue";


export default {
  props: ["isActive"],

  data() {
    return {
      projectKey: "",
      todoBadge:  Math.floor(Math.random() * 20),
      messagesBadge:  Math.floor(Math.random() * 20),
    };
  },

  methods:{
    setDocType(aType){
      localStorage.setItem("docType", aType);
    }
  },
  created() {
    this.selectedProjectKey = localStorage.getItem("projectKey");
  },

  //using component inside component so need import again, hm (maybe there is some better way for this?)
  components: {
    "menu-link": SidebarmenuLink,
  },
};
</script>
<style>
.darkLine{background-color:Black;margin-bottom:0.3rem;margin-top:0}
</style>
