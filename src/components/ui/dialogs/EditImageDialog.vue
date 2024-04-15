<template>
  <Dialog
    :position="'top'"
    @update:visible="closeImageEditorDialog"
    v-model:visible="localShowImageEditor"
    modal
    :style="{ width: '80%' }"
    :pt="{ mask: { style: 'backdrop-filter: blur(2px)' } }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    class="editImageDialog"
  >
    <div class="canvasContainer">
      <canvas id="canvasEditor" width="500" height="500"></canvas>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import { drawOnImage } from "../../../utils/drawOnImage";

export default {
  props: ["showImageEditor", "editingImageSource", "closeImageEditorDialog"],
  components: {
    Dialog,
  },
  data() {
    return {
      localShowImageEditor: this.showImageEditor,
    };
  },
  watch: {
    showImageEditor(newValue) {
      this.localShowImageEditor = newValue;
    },
  },
  updated() {
    if (this.localShowImageEditor) this.init();
  },
  methods: {
    init() {
      setTimeout(() => {
        const image = new Image();
        image.src = this.editingImageSource;
        image.onload = () => {
          drawOnImage("canvasEditor", image);
        };
      }, 100);
    },
  },
};
</script>

<style>
.canvasContainer {
  display: flex;
  justify-content: center;
}
#canvasEditor {
  cursor: pointer;
}
.editImageDialog {
  height: calc(100vh - 25px);
  max-height: unset !important;
}
.editImageDialog .p-dialog-content {
  height: calc(100vh - 80px);
}
</style>
