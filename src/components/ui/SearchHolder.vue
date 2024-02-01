<template>
  <teleport :to="WhereMoveSearch" :disabled="disabledTeleport">
    <div class="search-holder" id="search-holder">
      <form @submit.prevent="searchEmit()">
        <div class="input-group">
          <input
            @keyup="searchTyping"
            v-model="searchValue"
            type="text"
            class="form-control"
            placeholder="Search"
            aria-label="RSearch"
            aria-describedby="basic-addon2"
          />
          <button type="submit" class="input-group-text" id="basic-addon2">
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </form>
    </div>
  </teleport>
</template>


<script>
export default {
  props: ["emitSearch"],

  data() {
    return {
      searchValue: "",
      WhereMoveSearch: "#hereMoveSearch", //using teleport to move search at top of the page,
      disabledTeleport: true,
    };
  },
  methods: {
    searchEmit() {
      this.$emit("emitSearch", this.searchValue);
    },

    getDimensions() {
       
      //small screens don't teleport search bar at the top
        if (window.innerWidth <= 768) {
            this.disabledTeleport = true;
        }else{
            this.disabledTeleport = false; 
            this.WhereMoveSearch = '#hereMoveSearch';
        }
      //-----------------------------------

    },
    searchTyping(){
        this.$parent.projectSearch(this.searchValue);
         
    }
  },
  emits: ["emitSearch"],

   created() {
     this.getDimensions()
     
  },    
  mounted() {
    window.addEventListener("resize", this.getDimensions);
  },
  unmounted() {
    window.removeEventListener("resize", this.getDimensions);
  },
};
</script>

<style>
.search-holder {
  display: inline-block;
  color: black;
  width: 100%;
  max-width: 680px;
}
.input-group-text {
  background: #730e27;
  color: white;
  border-color: #730e27;
}
</style>