<template>
  <Dialog
    @update:visible="closeInsertDialog"
    v-model:visible="localNewSnagDialog"
    modal
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <template #header> Enter new snag </template>

    <div class="container" id="formContainer">
      <div class="row insertFormRow align-items-center even">
        <div class="col-md-3">
          <label for="newSnagDate">Required by Date *</label>
        </div>
        <div class="col-md-9">
          <Calendar
            @change="changeDate('from')"
            style="margin-left: 0"
            id="newSnagDate"
            class="dateDisplayInput"
            v-model="newSnagDate"
            showIcon
            dateFormat="dd/mm/yy"
            placeholder="dd/mm/yy"
            mask="99/99/9999"
          />

          <InlineMessage v-if="!newSnagDateOK"
            >This field is required</InlineMessage
          >
        </div>
      </div>

      <div class="row insertFormRow align-items-center">
        <div class="col-md-3"><label for="newSnagTitle">Item *</label></div>
        <div class="col-md-9">
          <InputText
            @input="newSnagTitleOK = true"
            id="newSnagTitle"
            v-model="newSnagTitle"
          />
          <InlineMessage v-if="!newSnagTitleOK"
            >This field is required</InlineMessage
          >
        </div>
      </div>

      <div class="row insertFormRow align-items-center even">
        <div class="col-md-3"><label for="newSnagCode">Code *</label></div>
        <div class="col-md-9">
          <InputText
            @input="newSnagCodeOK = true"
            id="newSnagCode"
            v-model="newSnagCode"
          />
          <InlineMessage v-if="!newSnagCodeOK"
            >This field is required</InlineMessage
          >
        </div>
      </div>

      <div class="row insertFormRow align-items-center">
        <div class="col-md-3"><label for="newSnagStatus">Status * </label></div>
        <div class="col-md-9">
          <Dropdown
            v-model="newSnagStatus"
            :options="allStatuses"
            optionLabel="name"
            placeholder="Select Status"
          ></Dropdown>

          <InlineMessage v-if="!newSnagStatusOK"
            >This field is required</InlineMessage
          >
        </div>
      </div>

      <div class="row insertFormRow align-items-center">
        <div class="col-md-6 text-left">
          <Button
            @click="closeInsertDialog"
            style="min-width: 120px"
            v-tooltip.bottom="{
              value: 'Cancel',
              showDelay: 1000,
              hideDelay: 300,
            }"
            icon="pi pi-times-circle"
            type="button"
            class="p-button-text redButton"
            label="Cancel"
          />
        </div>
        <div class="col-md-6 text-end">
          <Button
            style="min-width: 120px"
            v-tooltip.bottom="{
              value: 'Save snag',
              showDelay: 1000,
              hideDelay: 300,
            }"
            type="button"
            icon="pi pi-pencil"
            class="p-button-text"
            @click="saveSnag"
            label="Save snag"
          />
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import Calendar from "primevue/calendar";
import InlineMessage from "primevue/inlinemessage";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";

import moment from "moment";

export default {
  props: [
    "newSnagDialog",
    "allStatuses",
    "closeInsertDialog",
    "insertSnagToDatabase",
  ],
  components: {
    Dialog,
    Calendar,
    InlineMessage,
    InputText,
    Dropdown,
    Button,
  },
  data() {
    return {
      localNewSnagDialog: this.newSnagDialog,

      newSnagDate: '',
      newSnagTitle: '',
      newSnagCode: '',
      newSnagStatus: '0',

      newSnagDateOK: true,
      newSnagTitleOK: true,
      newSnagCodeOK: true,
      newSnagStatusOK: true,
    };
  },
  mounted() {
    const newDate = moment();
    this.newSnagDate = moment(String(newDate)).format("DD/MM/YYYY");
  },
  unmounted() {
    this.resetInputFields();
  },
  watch: {
    newSnagDialog(newValue) {
      this.localNewSnagDialog = newValue;
    },
  },
  methods: {
    saveSnag() {
      var AllOk = true;

      if (this.newSnagDate == "") {
        this.newSnagDateOK = false;
        AllOk = false;
      } else {
        this.newSnagDateOK = true;
      }

      if (this.newSnagTitle == "") {
        this.newSnagTitleOK = false;
        AllOk = false;
      } else {
        this.newSnagTitleOK = true;
      }

      if (this.newSnagCode == null) {
        this.newSnagCodeOK = false;
        AllOk = false;
      } else {
        this.newSnagCodeOK = true;
      }

      if (this.newSnagStatus == undefined || this.newSnagStatus == "") {
        this.newSnagStatus = "";
        AllOk = false;
        this.newSnagStatusOK = false;
      } else {
        this.newSnagStatus = this.newSnagStatus.value;
        if (this.newSnagStatus == "") {
          this.newSnagStatusOK = false;
          AllOk = false;
        } else {
          this.newSnagStatusOK = true;
        }
      }

      if (this.newSnagStatus == undefined) {
        this.newSnagStatus = "";
        AllOk = false;
        this.newSnagStatusOK = false;
      }

      if (AllOk == true) {
        const newSnagDate = moment(this.newSnagDate).format("YYYY-MM-DD HH:mm:ss");
        this.insertSnagToDatabase({
          newSnagDate,
          newSnagTitle: this.newSnagTitle,
          newSnagCode: this.newSnagCode,
          newSnagStatus: this.newSnagStatus,
        });
      }
    },
    resetInputFields() {
      this.newSnagDate = "";
      this.newSnagTitle = "";
      this.newSnagCode = "";
      this.newSnagStatus = "";

      this.newSnagDateOK = true;
      this.newSnagTitleOK = true;
      this.newSnagCodeOK = true;
      this.newSnagStatusOK = true;
    },
  }
};
</script>

<style></style>
