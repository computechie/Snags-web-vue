<template>
  <div id="RightSidepanel" class="RightSidepanel" :class="panelClass">
    <div class="row">
      <div class="col-md-12 text-end">
        <i
          class="pi pi-times cursorHand closePanelButton"
          @click="closePanel"
        ></i>
      </div>
    </div>

    <div class="row">
      <div class="col text-center">
        <h5 class="detailsHeadlineCode">{{ snagDetailsData.code }}</h5>
        <h5 class="detailsHeadline">{{ snagDetailsData.caption }}</h5>
      </div>
    </div>
    <div class="row">
      <div class="col text-center">
        <div :class="'statusBlock status' + snagDetailsData.status">
          {{ snagDetailsData.status }}
        </div>
      </div>
    </div>

    <div class="text-end" id="editIconsPanel">
      <div class="actionButtonsHolder">
        <div
          class="fa-stack fa-2x actionIcons"
          style="font-size: 15px"
          v-tooltip.bottom="{
            value: 'Edit snag',
            showDelay: 1000,
            hideDelay: 300,
          }"
          @click="editClick"
        >
          <i class="fa-solid fa-square fa-stack-2x"></i>
          <i
            class="fa-stack-1x fa-solid fa-pen-to-square"
            style="color: white"
          ></i>
        </div>

        <div
          class="fa-stack fa-2x actionIcons"
          style="font-size: 15px; color: #aa0000"
          v-tooltip.left="{
            value: 'Delete snag',
            showDelay: 1000,
            hideDelay: 300,
          }"
          @click="deleteClick"
        >
          <i class="fa-solid fa-square fa-stack-2x"></i>
          <i class="fa-stack-1x fa-solid fa-trash-can" style="color: white"></i>
        </div>
      </div>
    </div>

    <div class="row" style="">
      <div class="col text-center" style="padding: 19px">
        <TabView v-model:activeIndex="localActiveTab">
          <TabPanel header="Details">
            <div class="row" style="margin-bottom: 10px">
              <div class="col text-start" style="padding: 0">
                <Button
                  v-tooltip.bottom="{
                    value: 'Download PDF',
                    showDelay: 1000,
                    hideDelay: 300,
                  }"
                  type="button"
                  icon="pi pi-file-pdf"
                  class="p-button-text donwloadPDFbutton"
                  @click="downloadSnagPDF"
                  label="Download PDF"
                />
              </div>
            </div>

            <table class="table table-striped table-sm" id="detailsTable">
              <tbody>
                <tr>
                  <td style="width: 160px">Date Opened:</td>
                  <td>{{ snagDetailsData.date }}</td>
                </tr>
                <tr>
                  <td style="width: 160px">Action by:</td>
                  <td>{{ snagDetailsData.assignedTo }}</td>
                </tr>

                <tr>
                  <td>Location:</td>
                  <td>{{ snagDetailsData.area }}</td>
                </tr>

                <tr>
                  <td>Works Package:</td>
                  <td>{{ snagDetailsData.worksPackage }}</td>
                </tr>

                <tr>
                  <td>Owner:</td>
                  <td>{{ snagDetailsData.createdBy }}</td>
                </tr>

                <tr>
                  <td>Closed by:</td>
                  <td>{{ snagDetailsData.closedBy }}</td>
                </tr>

                <tr>
                  <td>Notes:</td>
                  <td>
                    <textarea
                      rows="5"
                      v-text="snagDetailsData.notes"
                      style="width: 100%"
                      readonly
                    ></textarea>
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="row">
              <div class="col-md-6 text-left" style="padding: 0"></div>

              <div class="col-md-6 text-end" style="padding: 0">
                <Button
                  @click="openDialogAddPhoto"
                  style="min-width: 120px"
                  v-tooltip.bottom="{
                    value: 'Add photo',
                    showDelay: 1000,
                    hideDelay: 300,
                  }"
                  type="button"
                  class="p-button-text addphotobutton"
                  label="Add photo"
                />
              </div>
            </div>
          </TabPanel>

          <TabPanel
            :header="'Pictures (' + snagImages.length + ')'"
            v-if="picturesTabShow"
          >
            <SwiperCarousel
              :notes="snagNotes"
              :tripImages="snagImages"
              @showloader="showloader"
              :openedcargoname="openedcargoname"
              @swiper="onSwiper"
              @deletePhoto="deletePhotoId"
              @deletePhotomodal="deletePhotoModal"
              :userType="userType"
            />

            <div class="row" style="margin-top: 12px">
              <div class="col text-end" style="padding: 0">
                <Button
                  @click="openDialogAddPhoto"
                  style="min-width: 120px"
                  v-tooltip.bottom="{
                    value: 'Add photo',
                    showDelay: 1000,
                    hideDelay: 300,
                  }"
                  type="button"
                  class="p-button-text addphotobutton"
                  label="Add photo"
                />
              </div>
            </div>
          </TabPanel>

          <TabPanel header="Drawing">
            <img src="/images/pindrawing.jpg" />
          </TabPanel>
        </TabView>
      </div>
    </div>

    <div class="historyHolder">
      <div class="row">
        <div class="col-md-12">
          <Timeline :value="events" align="alternate">
            <template #marker="slotProps">
              <span
                class="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1"
                :style="{ backgroundColor: slotProps.item.color }"
              >
                <i :class="slotProps.item.icon"></i>
              </span>
            </template>

            <template #content="slotProps">
              <div class="mt-3">
                <div class="historyStatus">{{ slotProps.item.status }}</div>
                <div class="historyDate">{{ slotProps.item.date }}</div>
                <div class="historyName">{{ slotProps.item.createdBy }}</div>
                <div class="historyNotes">
                  <textarea class="textAreaComments">Comments</textarea>
                </div>
              </div>
            </template>
          </Timeline>
        </div>
      </div>
    </div>
    <!-- zoomed image Dialog-->
    <Dialog
      modal
      v-model:visible="localVisibleImagesModal"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <SwiperCarousel
        :snagImages="snagImages"
        @deletePhotomodal="deletePhotoModal"
      />
    </Dialog>
  </div>
</template>

<script>
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Timeline from "primevue/timeline";
import Button from "primevue/button";
import Dialog from "primevue/dialog";

export default {
  props: [
    "panelClass",
    "snagDetailsData",
    "activeTab",
    "events",
    "visibleImagesModal",
    "closedPanel",
    "snagImages",
    "deletePhotoModal",
    "picturesTabShow",
    "downloadSnagPDF",
    "openDialogAddPhoto",
  ],
  components: {
    TabView,
    TabPanel,
    Timeline,
    Button,
    Dialog,
  },
  data() {
    return {
      localActiveTab: this.activeTab,
      localVisibleImagesModal: this.visibleImagesModal,
    };
  },
};
</script>

<style>
.RightSidepanel {
  height: 100%;
  width: 0;
  max-width: 100%;
  position: fixed;
  z-index: 1;
  top: 0;
  right: 0px;
  background-color: #f5f5f5;
  overflow-x: hidden;
  padding-top: 15px;
  padding-right: 0px;
  padding-left: 0px;
  transition: 0.5s;
  box-shadow: 0px 20px 7px #cccccc;
  z-index: 11;
  position: absolute;
  display: block;
}
.RightSidepanel .closebtn {
  z-index: 1000;
  position: absolute;
  top: 0;
  right: 35px;
  font-size: 36px;
  margin-left: 50px;
  color: #343434;
  text-decoration: none;
}
.RightSidepanel .row {
  margin: 0;
}
</style>
