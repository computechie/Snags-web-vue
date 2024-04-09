<template>
    <Dialog
    @update:visible="closeEditDialog"
    v-model:visible="localEditSnagDialog"
    modal
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <template #header> Edit Snag </template>

    <div class="container" id="formContainer">
      <div class="row insertFormRow align-items-center even">
        <div class="col-md-3">
          <label for="editSnagDate">Required by Date *</label>
        </div>
        <div class="col-md-9">
          <Calendar
            :value="editSnagDate"
            v-model="editSnagDate"
            @change="changeDate('from')"
            style="margin-left: 0"
            id="editSnagDate"
            class="dateDisplayInput"
            showIcon
            dateFormat="dd/mm/yy"
            placeholder="dd/mm/yy"
            mask="99/99/9999"
          />

          <InlineMessage v-if="!editSnagDateOK"
            >This field is required</InlineMessage
          >
        </div>
      </div>

      <div class="row insertFormRow align-items-center">
        <div class="col-md-3"><label for="editSnagTitle">Item *</label></div>
        <div class="col-md-9">
          <InputText
            @input="editSnagTitleOK = true"
            id="editSnagTitle"
            v-model="editSnagTitle"
          />
          <InlineMessage v-if="!editSnagTitleOK"
            >This field is required</InlineMessage
          >
        </div>
      </div>

      <div class="row insertFormRow align-items-center even">
        <div class="col-md-3"><label for="editSnagStatus">Status *</label></div>
        <div class="col-md-9">
          <!--<InputText  @input="editSnagStatusOK=true" id="editSnagStatus" v-model="editSnagStatus" />-->
          <Dropdown
            v-model="editSnagStatus"
            :options="allStatuses"
            optionLabel="name"
            :placeholder="editSnagStatus"
          ></Dropdown>
          <InlineMessage v-if="!editSnagStatusOK"
            >This field is required</InlineMessage
          >
        </div>
      </div>

      <div class="row insertFormRow align-items-center">
        <div class="col-md-3"><label for="username">Code *</label></div>
        <div class="col-md-9">
          <InputText
            @input="editSnagCodeOK = true"
            id="editSnagCode"
            v-model="editSnagCode"
          />
          <InlineMessage v-if="!editSnagCodeOK"
            >This field is required</InlineMessage
          >
        </div>
      </div>

      <div class="row insertFormRow align-items-center">
        <div class="col-md-6 text-left">
          <Button
            @click="closeEditDialog"
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
              value: 'Save changes',
              showDelay: 1000,
              hideDelay: 300,
            }"
            type="button"
            icon="pi pi-pencil"
            class="p-button-text"
            @click="saveChanges"
            label="Save changes"
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
    "snagData",
    "editSnagDialog",
    "allStatuses",
    "closeEditDialog",
    "editSnagInDatabase"
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
      localEditSnagDialog: this.editSnagDialog,

      editSnagDate: '',
      editSnagTitle: '',
      editSnagCode: '',
      editSnagStatus: '0',

      editSnagDateOK: true,
      editSnagTitleOK: true,
      editSnagCodeOK: true,
      editSnagStatusOK: true,
    }
  },
  watch: {
    editSnagDialog(newValue) {
      this.localEditSnagDialog = newValue;
    },
    snagData(newValue) {
      this.editSnagDate = moment(String(newValue.date)).format("DD/MM/YYYY");//newValue.editSnagDate;
      this.editSnagTitle = newValue.caption;
      this.editSnagCode = newValue.code;
      this.editSnagStatus = newValue.status;
    },
  },
  methods: {
    saveChanges() {
      var AllOk = true;

      if (this.editSnagDate == "") {
        this.editSnagDateOK = false;
        AllOk = false;
      } else {
        this.editSnagDateOK = true;
      }

      if (this.editSnagTitle == "") {
        this.editSnagTitleOK = false;
        AllOk = false;
      } else {
        this.editSnagTitleOK = true;
      }

      if (this.editSnagCode == "") {
        this.editSnagCodeOK = false;
        AllOk = false;
      } else {
        this.editSnagCodeOK = true;
      }

      if (this.editSnagStatus.name) {
        this.editSnagStatus = this.editSnagStatus.value;
      }

      if (this.editSnagStatus == "") {
        this.editSnagStatusOK = false;
        AllOk = false;
      } else {
        this.editSnagStatusOK = true;
      }

      if (AllOk == true) {
        const editSnagDate = moment(this.editSnagDate).format("YYYY-MM-DD HH:mm:ss");
        this.editSnagInDatabase({
          editSnagDate,
          editSnagTitle: this.editSnagTitle,
          editSnagCode: this.editSnagCode,
          editSnagStatus: this.editSnagStatus,
        });
      }
    },
    resetInputFields() {
      this.editSnagDate = '';
      this.editSnagTitle = '';
      this.editSnagCode = '';
      this.editSnagStatus = '0';

      this.editSnagDateOK = true;
      this.editSnagTitleOK = true;
      this.editSnagCodeOK = true;
      this.editSnagStatusOK = true;
    },
  }
}
</script>

<style>
</style>
