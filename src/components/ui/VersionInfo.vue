<template>
   <div class="alignBootmLeftAtPage align-middle text-center">
    Version: {{ _rootVersion }}
  </div>
</template>

<style>
.alignBootmLeftAtPage {
/*  position: absolute;
  bottom: 40px;
  left: 20px;
  width: 200px;*/
  padding:6px;

  color: #aaa;
 background: rgba(255, 255, 255, 0.05);
  /* border-radius: 16px;*/
   box-shadow: 0 4px 20px rgba(0,0, 0, 0.5);
  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.07);
}

</style>