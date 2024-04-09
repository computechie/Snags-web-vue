<template>
  <Dialog
    v-model:visible="localDisplayInfoDialog"
    modal
    :style="{ width: '25rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <template #header="">
      <h4>{{ infoModalHeader }}</h4>
    </template>

    <span class="font-bold text-2xl block mb-2 mt-4"></span>
    <p class="mb-0">{{ infoModalMessage }}</p>
    <div class="flex text-end gap-2 mt-4">
      <Button label="Ok" @click="closeInfo"></Button>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import Button from "primevue/button";

export default {
  props: [
    'displayInfoDialog',
    'infoModalHeader',
    'infoModalMessage',
    'closeInfo'
  ],
  components: {
    Dialog,
    Button,
  },
  data() {
    return {
      localDisplayInfoDialog: this.displayInfoDialog,
    }
  },
  watch: {
    displayInfoDialog(newValue) {
      this.localDisplayInfoDialog = newValue;
    },
  },
}
</script>

<style></style>
