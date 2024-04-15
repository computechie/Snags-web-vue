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
      <canvas
        id="canvasEditor"
        width="500"
        height="500"
        :style="{
          cursor:
            activeTool === 'rectangle'
              ? 'move'
              : activeTool === 'pencil'
              ? 'pointer'
              : 'text',
        }"
      ></canvas>
    </div>

    <div class="row text-center">
      <div class="mt-4">
        <Button
          id="pencilButton"
          v-tooltip.bottom="'Draw Free Line'"
          style="margin-right: 30px"
          @click="() => (activeTool = 'pencil')"
          :disabled="activeTool === 'pencil'"
        >
          <i class="fa-solid fa-paintbrush"></i>
        </Button>
        <Button
          id="rectangleButton"
          v-tooltip.bottom="'Draw Rectangle'"
          style="margin-right: 30px"
          @click="() => (activeTool = 'rectangle')"
          :disabled="activeTool === 'rectangle'"
        >
          <i class="fa-regular fa-square"></i>
        </Button>
        <Button
          id="textButton"
          v-tooltip.bottom="'Write text'"
          style="margin-right: 30px"
          @click="() => (activeTool = 'text')"
          :disabled="activeTool === 'text'"
        >
          <i class="fa-solid fa-font"></i>
        </Button>
      </div>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { drawOnImage } from "../../../utils/drawOnImage";

export default {
  props: ["showImageEditor", "editingImageSource", "closeImageEditorDialog"],
  components: {
    Dialog,
    Button,
  },
  data() {
    return {
      localShowImageEditor: this.showImageEditor,
      activeTool: "pencil",
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
  width: 100%;
  height: calc(100vh - 25px);
  max-height: unset !important;
}
.editImageDialog .p-dialog-content {
  height: calc(100vh - 80px);
}
</style>
