<template>
  <base-dialog :show="isLoading" title="Authenticating..." fixed>
    <base-spinner></base-spinner>
  </base-dialog>

  <!-- if table is lazy load then global filter (search) in table not working so must be here ! PrimeVue bug!? -->
  <span class="p-input-icon-right" id="searchBox">
    <InputText
      v-model="searchQuery"
      placeholder="Keyword Search"
      @change="onSearch"
      @input="onSearchInput"
    />
    <i class="pi pi-search" @click="onSearch" />
  </span>
  <!-- -------------------  end    of search box      -->

  <div
    class="dataTableHolder"
    style="width: 100%"
    @contextmenu="showContextMenu($event)"
  >
    <DataTable
      :totalRecords="totalRecords"
      :id="dataTable"
      :value="allSnags"
      lazy
      :paginator="true"
      :rows="pageSize"
      :first="first"
      dataKey="id"
      stripedRows
      v-model:filters="filters"
      filterDisplay="menu"
      key="key"
      @page="onPage($event)"
      @sort="onSort($event)"
      @filter="onFilter($event)"
      @rowSelect="onRowSelect"
      @rowClick="onRowClick"
      @rowsChange="onRows($event)"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      paginatorStart="CurrentPageReport"
      :rowsPerPageOptions="rowsPerPageOptions"
      responsiveLayout="scroll"
      currentPageReportTemplate="Showing {first} to {last} of total {totalRecords} snags"
      :globalFilterFields="['code', 'title']"
      selectionMode="single"
      :loading="loading1"
      scrollable
      :scrollHeight="tableHeight"
    >
      <template #header>
        <!-- if table is lazy load then global filter (search) in table not working so it can not be here, its on top of this page! PrimeVue bug!? -->
        <!--
        <div style="display:none" class="flex justify-content-between">
          <span class="p-input-icon-left" id="searchBox">
            <i class="pi pi-search" />
            <InputText v-model="filters['global'].value" placeholder="Keyword Search"/>
          </span>
        </div>
        -->

        <div class="row">
          <div class="d-none d-xl-block col-md-4">
            <Button
              style="min-width: 120px"
              v-tooltip.bottom="{
                value: 'New Snag',
                showDelay: 1000,
                hideDelay: 300,
              }"
              type="button"
              icon="pi pi-pencil"
              class="p-button-text"
              id="newSnagButton"
              @click="newSnag"
              label="New snag"
            />
            &nbsp;
            <Button
              style="min-width: 120px"
              v-tooltip.bottom="{
                value: 'Download report',
                showDelay: 1000,
                hideDelay: 300,
              }"
              type="button"
              icon="pi pi-download"
              class="p-button-text"
              id="downloadReport"
              @click="downloadReport"
              label="Download Report"
            />
            &nbsp;
            <Button
              v-if="showInvoiceSelectedButton && userType == 'ADMIN'"
              style="min-width: 120px"
              v-tooltip.bottom="{
                value: 'Invoice selected',
                showDelay: 1000,
                hideDelay: 300,
              }"
              type="button"
              icon="pi pi-check-circle"
              class="p-button-text"
              id="invoiceSelected"
              @click="invoiceSelected"
              label="Invoice selected"
            />

            <Button
              style="min-width: 120px"
              v-tooltip.bottom="{
                value: 'Load all snags',
                showDelay: 1000,
                hideDelay: 300,
              }"
              type="button"
              icon="pi pi-pencil"
              class="p-button-text"
              id="newSnagButton"
              @click="getSnags('all')"
              label="Load all snags"
            />
            &nbsp;
          </div>

          <div class="d-block d-xl-none d-col-md-4">
            <Button
              v-tooltip.bottom="{
                value: 'New Snag',
                showDelay: 1000,
                hideDelay: 300,
              }"
              type="button"
              icon="pi pi-pencil"
              class="p-button-text"
              id="newSnagButton"
              @click="newSnag"
              label=""
            />
            &nbsp;
            <Button
              v-tooltip.bottom="{
                value: 'Download report',
                showDelay: 1000,
                hideDelay: 300,
              }"
              type="button"
              icon="pi pi-download"
              class="p-button-text"
              id="downloadReport"
              @click="downloadReport"
              label=""
            />
            &nbsp;
            <Button
              v-if="showInvoiceSelectedButton && userType == 'ADMIN'"
              style="min-width: 120px"
              v-tooltip.bottom="{
                value: 'Invoice selected',
                showDelay: 1000,
                hideDelay: 300,
              }"
              type="button"
              icon="pi pi-check-circle"
              class="p-button-text"
              id="invoiceSelected"
              @click="invoiceSelected"
              label="Invoice selected"
            />

            <Button
              v-tooltip.bottom="{
                value: 'Load all snags',
                showDelay: 1000,
                hideDelay: 300,
              }"
              type="button"
              icon="pi pi-pencil"
              class="p-button-text"
              id="newSnagButton"
              @click="getSnags('all')"
              label=""
            />
            &nbsp;
          </div>

          <div class="col-md-4 text-center">
            <!--
                        <div class="projectNameHeadline">DORMITORY DEMO PROJECT</div>
                        <div class="documentTypeHeadline">Snags</div>
                       -->
          </div>

          <div class="col-md-4 text-end">
            <Calendar
              style="width: 160px"
              v-tooltip.bottom="{
                value: 'Date from',
                showDelay: 1000,
                hideDelay: 300,
              }"
              id="fromDateBox"
              class="dateDisplayInput"
              v-model="fromDate"
              showIcon
              dateFormat="dd/mm/yy"
              placeholder="dd/mm/yy"
              mask="99/99/9999"
              @change="changeDate('from')"
            />
            <Calendar
              style="width: 160px"
              v-tooltip.bottom="{
                value: 'Date to',
                showDelay: 1000,
                hideDelay: 300,
              }"
              id="toDateBox"
              class="dateDisplayInput"
              v-model="toDate"
              showIcon
              dateFormat="dd/mm/yy"
              placeholder="dd/mm/yy"
              mask="99/99/9999"
              @change="changeDate('to')"
            />
            <Button
              type="button"
              icon="pi pi-refresh"
              class="p-button-text"
              id="refreshButton"
              @click="refreshData"
            />
          </div>
        </div>
      </template>

      <template #empty> </template>
      <template #loading> Loading data. Please wait... </template>

      <Column class="openedColumn" field="checked" header="Check All">
        <template #header>
          <Checkbox
            v-model="checkAll"
            @change="checkAllHandler($event)"
            :binary="true"
          />
        </template>
        <template #body="{ data }">
          <Checkbox v-model="data.checked" :binary="true" />
        </template>
      </Column>

      <Column
        class="openedColumn"
        field="date"
        filterField="createdBy"
        header="Opened"
        style="display: grid; min-width: 10rem; min-height: 43px"
      >
        <template #body="{ data }">
          <span class="closedByName">{{ data.createdBy }}</span>
          <span class="closedByDate">
            {{ format_date(data.created, "DD/MM/YYYY") }}
          </span>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            type="text"
            v-model="filterModel.value"
            @keydown.enter="filterCallback()"
            class="p-column-filter"
            placeholder="Enter name"
          />
          <Button
            type="button"
            class="p-button-text myClearButton"
            @click="
              filterModel.value = null;
              filterCallback();
            "
            label="Clear"
          />
        </template>
      </Column>

      <Column
        class="codeColumn"
        field="code"
        header="Code"
        bodyStyle="text-align: left"
        style="min-height: 43px"
      >
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            type="text"
            v-model="filterModel.value"
            @keydown.enter="filterCallback()"
            class="p-column-filter"
            placeholder="Search"
          />
          <Button
            type="button"
            class="p-button-text myClearButton"
            @click="
              filterModel.value = null;
              filterCallback();
            "
            label="Clear"
          />
        </template>
      </Column>
      <Column
        class="captionColumn"
        field="caption"
        header="Item"
        bodyStyle="text-align: left"
        style="text-align: left; min-height: 43px; min-width: 320px"
      >
        <template #body="{ data }">
          <div style="display: inline-block; width: 85%; padding-right: 50px">
            {{ data.caption }}
          </div>
          <div
            style="display: inline-block; display: block; width: 15%"
            v-if="data.hasPhoto != ''"
          >
            <img
              v-if="data.caption == 'Architrave'"
              src="/images/pin.png"
              style="height: 18px"
            />
            <img
              v-if="data.caption != 'Architrave'"
              src="/images/pin.png"
              style="height: 18px; visibility: hidden"
            />
            <i class="fa fa-camera"></i>
          </div>
        </template>

        <template #filter="{ filterModel, filterCallback }">
          <InputText
            type="text"
            v-model="filterModel.value"
            @keydown.enter="filterCallback()"
            class="p-column-filter"
            placeholder="Search"
          />
          <Button
            type="button"
            class="p-button-text myClearButton"
            @click="
              filterModel.value = null;
              filterCallback();
            "
            label="Clear"
          />
        </template>
      </Column>
      <Column
        class="statusColumn"
        field="status"
        header="Status"
        bodyStyle="text-align: left"
        style="min-height: 43px; max-width: 100px !important"
      >
        <template #body="{ data }">
          <div v-if="data.status == 'Open'" class="statusOpen statusBlock">
            {{ data.status }}
          </div>
          <div v-if="data.status == 'Closed'" class="statusClosed statusBlock">
            {{ data.status }}
          </div>
          <div
            v-if="data.status == 'Actioned'"
            class="statusActioned statusBlock"
          >
            {{ data.status }}
          </div>
          <div
            v-if="data.status == 'Returned'"
            class="statusReturned statusBlock"
          >
            {{ data.status }}
          </div>
        </template>

        <template #filter="{ filterModel }">
          <!--<InputText v-model="filterModel.value" :options="allCompanies" filter optionLabel="name" placeholder="Select Company"></InputText>-->
          <Dropdown
            v-model="filterModel.value"
            :options="allStatuses"
            filter
            optionLabel="name"
            optionValue="value"
            placeholder="Select Status"
          ></Dropdown>
          <Button
            type="button"
            class="p-button-text myClearButton"
            @click="
              filterModel.value = null;
              filterCallback();
            "
            label="Clear"
          />
        </template>
      </Column>

      <Column
        class="assignedToColumn"
        field="assignedTo"
        filterField="assignedTo"
        header="Action By"
        bodyStyle="text-align: left"
        style="display: grid; min-height: 43px"
      >
        <template #body="{ data }">
          <span class="closedByName">{{ data.assignedTo }}</span>
          <span class="closedByDate">
            {{ format_date(data.date, "DD/MM/YYYY") }}
          </span>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            type="text"
            v-model="filterModel.value"
            @keydown.enter="filterCallback()"
            class="p-column-filter"
            placeholder="Enter name"
          />
          <Button
            type="button"
            class="p-button-text myClearButton"
            @click="
              filterModel.value = null;
              filterCallback();
            "
            label="Clear"
          />
        </template>
      </Column>

      <Column
        class="areaColumn"
        field="area"
        header="Location"
        bodyStyle="text-align: left"
        style="min-height: 43px"
      >
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            type="text"
            v-model="filterModel.value"
            @keydown.enter="filterCallback()"
            class="p-column-filter"
            placeholder="Search"
          />
          <Button
            type="button"
            class="p-button-text myClearButton"
            @click="
              filterModel.value = null;
              filterCallback();
            "
            label="Clear"
          />
        </template>
      </Column>

      <Column
        class="workspackageColumn"
        field="worksPackage"
        header="Works Package"
        bodyStyle="text-align: left"
        style="min-height: 43px"
      >
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            type="text"
            v-model="filterModel.value"
            @keydown.enter="filterCallback()"
            class="p-column-filter"
            placeholder="Search"
          />
          <Button
            type="button"
            class="p-button-text myClearButton"
            @click="
              filterModel.value = null;
              filterCallback();
            "
            label="Clear"
          />
        </template>
      </Column>

      <Column
        class="closedByColumn"
        field="closedBy"
        filterField="closedBy"
        header="Closed By"
        bodyStyle="text-align: left"
        style="display: grid; min-height: 43px"
      >
        <template #body="{ data }">
          <span class="closedByName">{{ data.closedBy }}</span>
          <span class="closedByDate">
            {{ format_date(data.signOffDate, "DD/MM/YYYY") }}
          </span>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            type="text"
            v-model="filterModel.value"
            @keydown.enter="filterCallback()"
            class="p-column-filter"
            placeholder="Enter name"
          />
          <Button
            type="button"
            class="p-button-text myClearButton"
            @click="
              filterModel.value = null;
              filterCallback();
            "
            label="Clear"
          />
        </template>
      </Column>

      <Column
        field=""
        header=""
        bodyStyle="text-align: left"
        style="min-height: 43px"
      >
        <template #header>
          <div style="right: 20px; position: absolute">
            <div style="float: right">Actions</div>
          </div>
        </template>
        <template #body="">
          <div class="actionButtonsHolderTable">
            <div
              class="fa-stack fa-2x actionIcons"
              style="font-size: 15px"
              v-tooltip.bottom="{
                value: 'Edit Snag',
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
                value: 'Delete Snag',
                showDelay: 1000,
                hideDelay: 300,
              }"
              @click="deleteClick"
            >
              <i class="fa-solid fa-square fa-stack-2x"></i>
              <i
                class="fa-stack-1x fa-solid fa-trash-can"
                style="color: white"
              ></i>
            </div>
          </div>
        </template>
      </Column>

      <template #paginatorstart> </template>
      <template #paginatorend> </template>
    </DataTable>
  </div>

  <div v-if="!showTable" class="alert alert-danger text-center">
    Snags not found!
  </div>

  <RightSidePanel
    :panelClass="panelClass"
    :snagDetailsData="snagDetailsData"
    :activeTab="activeTab"
    :events="events"
    :visibleImagesModal="visibleImagesModal"
    :snagImages="snagImages"
    :picturesTabShow="picturesTabShow"
    :snagNotes="snagNotes"
    :openedcargoname="openedcargoname"
    :userType="userType"
    :closePanel="closePanel"
    :editClick="editClick"
    :deleteClick="deleteClick"
    :showloader="showloader"
    :onSwiper="onSwiper"
    :deletePhotoId="deletePhotoId"
    :deletePhotoModal="deletePhotoModal"
    :downloadSnagPDF="downloadSnagPDF"
    :openDialogAddPhoto="openDialogAddPhoto"
  />

  <NewSnagDialog
    :newSnagDialog="newSnagDialogState"
    :allStatuses="allStatuses"
    :closeInsertDialog="closeInsertDialog"
    :insertSnagToDatabase="InsertSnagToDatabase"
  />

  <!-- Edit Snag Dialog-->
  <Dialog
    @update:visible="handleClose"
    v-model:visible="editSnagDialog"
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
            @click="editSnag"
            label="Save changes"
          />
        </div>
      </div>
    </div>
  </Dialog>

  <!-- dialog info -->
  <Dialog
    v-model:visible="displayInfoDialog"
    modal
    :style="{ width: '25rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <template #header="">
      <h4>{{ InfoModalHeader }}</h4>
    </template>

    <span class="font-bold text-2xl block mb-2 mt-4"></span>
    <p class="mb-0">{{ InfoModalMessage }}</p>
    <div class="flex text-end gap-2 mt-4">
      <Button label="Ok" @click="closeInfo"></Button>
    </div>
  </Dialog>

  <!-- dialog confirm Delete -->
  <Dialog
    v-model:visible="displayDeleteConfirm"
    modal
    :style="{ width: '30rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <template #header="">
      <h4>Please confirm</h4>
    </template>

    <span class="font-bold text-2xl block mb-2 mt-4"></span>
    <p class="mb-0">
      Are you sure that you want to Delete Snag
      <strong>'{{ editSnagCargoName }}'</strong>?
    </p>

    <div class="row" style="margin-top: 30px">
      <div class="col-md-6 text-start">
        <Button
          class="redButton"
          label="Cancel"
          @click="displayDeleteConfirm = false"
        ></Button>
      </div>
      <div class="col-md-6 text-end">
        <Button label="Yes, delete" @click="deleteTrip"></Button>
      </div>
    </div>
  </Dialog>

  <!-- dialog confirm UNinvoice -->
  <Dialog
    v-model:visible="displayUnInvoiceConfirm"
    modal
    :style="{ width: '30rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <template #header="">
      <h4>Please confirm</h4>
    </template>

    <span class="font-bold text-2xl block mb-2 mt-4"></span>
    <p class="mb-0">
      Are you sure that you want to remove mark 'Invoiced'<br />
      for trip <strong>'{{ editSnagCargoName }}'</strong>?
    </p>

    <div class="row" style="margin-top: 30px">
      <div class="col-md-6 text-start">
        <Button
          class="redButton"
          label="Cancel"
          @click="displayInvoiceConfirm = false"
        ></Button>
      </div>
      <div class="col-md-6 text-end">
        <Button label="Yes, remove it" @click="unInvoiceThisTrip"></Button>
      </div>
    </div>
  </Dialog>

  <!-- Send Invoice Dialog-->
  <Dialog
    @update:visible="handleClose"
    v-model:visible="sendInvoiceDialog"
    modal
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <template #header> Mark this trip as Invoiced </template>

    <div class="container" id="formContainer">
      <div class="row insertFormRow align-items-center even">
        <div class="col-md-3">
          <label for="invoiceDate">Invoice Date *</label>
        </div>
        <div class="col-md-9">
          <Calendar
            hourFormat="24"
            showTime
            @change="changeDate('from')"
            style="margin-left: 0"
            id="invoiceDate"
            class="dateDisplayInput"
            v-model="invoiceDate"
            showIcon
            dateFormat="dd/mm/yy"
            placeholder="dd/mm/yy"
            mask="99/99/9999"
          />

          <InlineMessage v-if="!invoiceDateOK"
            >This field is required</InlineMessage
          >
        </div>
      </div>

      <div class="row insertFormRow align-items-center">
        <div class="col-md-6 text-left">
          <Button
            @click="sendInvoiceDialog = false"
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
              value: 'Mark as Invoiced',
              showDelay: 1000,
              hideDelay: 300,
            }"
            type="button"
            icon="pi pi-check-circle"
            class="p-button-text"
            @click="invoiceThisTrip"
            label="Mark as Invoiced"
          />
        </div>
      </div>
    </div>
  </Dialog>

  <!-- Send Multiple Invoice Dialog-->
  <Dialog
    @update:visible="handleClose"
    v-model:visible="sendMultipleInvoiceDialog"
    modal
    header="header"
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <template #header>
      <span v-if="selectedIDsForInvoicing.length == 1"
        >Mark selected trip as Invoiced</span
      >
      <span v-if="selectedIDsForInvoicing.length > 1"
        >Mark selected
        <span style="font-weight: bold"
          >{{ selectedIDsForInvoicing.length }} trips
        </span>
        as Invoiced</span
      >
    </template>

    <div class="container" id="formContainer">
      <div class="row insertFormRow align-items-center even">
        <div class="col-md-3">
          <label for="invoiceDate">Invoice Date *</label>
        </div>
        <div class="col-md-9">
          <Calendar
            hourFormat="24"
            showTime
            @change="changeDate('from')"
            style="margin-left: 0"
            id="invoiceMultipleDate"
            class="dateDisplayInput"
            v-model="invoiceDate"
            showIcon
            dateFormat="dd/mm/yy"
            placeholder="dd/mm/yy"
            mask="99/99/9999"
          />

          <InlineMessage v-if="!invoiceDateOK"
            >This field is required</InlineMessage
          >
        </div>
      </div>

      <div class="row insertFormRow align-items-center">
        <div class="col-md-6 text-left">
          <Button
            @click="sendMultipleInvoiceDialog = false"
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
              value: 'Mark as Invoiced',
              showDelay: 1000,
              hideDelay: 300,
            }"
            type="button"
            icon="pi pi-check-circle"
            class="p-button-text"
            @click="invoiceMultipleTrips"
            label="Mark as Invoiced"
          />
        </div>
      </div>
    </div>
  </Dialog>

  <!-- dialog confirm Delete Photo -->
  <Dialog
    v-model:visible="displayDeletePhotoConfirm"
    modal
    :style="{ width: '30rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <template #header="">
      <h4>Please confirm</h4>
    </template>

    <span class="font-bold text-2xl block mb-2 mt-4"></span>
    <p class="mb-0">Are you sure that you want to delete this photo?</p>

    <div class="row" style="margin-top: 30px">
      <div class="col-md-6 text-start">
        <Button
          class="redButton"
          label="Cancel"
          @click="displayDeletePhotoConfirm = false"
        ></Button>
      </div>
      <div class="col-md-6 text-end">
        <Button label="Yes, delete" @click="deletePhoto"></Button>
      </div>
    </div>
  </Dialog>

  <!-- dialog upload photo -->
  <Dialog
    v-model:visible="displayUploadModal"
    modal
    :style="{ width: '60rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <template #header="">
      <h4>Upload photo</h4>
    </template>

    <div class="row" style="margin-top: 30px">
      <div class="col">
        <FileUpload
          name="files[]"
          :customUpload="true"
          url="/api/upload"
          @uploader="customUploader($event)"
          :multiple="false"
          accept="image/*"
          :maxFileSize="10000000"
        >
          <template #empty>
            <p>Drag and drop files to here to upload.</p>
          </template>
        </FileUpload>
      </div>
    </div>
  </Dialog>

  <div
    id="div-context-menu"
    class="cls-context-menu"
    style="left: 11px; top: 13px; display: none"
  >
    <ul>
      <ul>
        <li v-if="!AllPageMarked && !AllMarked">
          <a @click="SelectAllPage('select')"
            >Select all records on current page</a
          >
        </li>
        <li v-if="!AllPageMarked && !AllMarked">
          <a @click="SelectAll('select')">Select all on all pages</a>
        </li>

        <li v-if="AllMarked || AllPageMarked">
          <a @click="SelectAll('deselect')">Deselect All </a>
        </li>
      </ul>
    </ul>
  </div>
</template>

<script>
import RightSidePanel from "../../ui/RightSidePanel.vue";
import NewSnagDialog from "../../ui/dialogs/NewSnagDialog.vue";

// Primevue datatable help: https://www.primefaces.org/primevue/datatable //
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import Dialog from "primevue/dialog";
import InlineMessage from "primevue/inlinemessage";
//import InputNumber from 'primevue/inputnumber';
import Dropdown from "primevue/dropdown";
import FileUpload from "primevue/fileupload";
import Checkbox from "primevue/checkbox";
import axios from "axios";
import $ from "jquery";

import { FilterMatchMode, FilterOperator } from "primevue/api"; // for filtering

import moment from "moment";

export default {
  props: ["systemId"],
  components: {
    RightSidePanel,
    NewSnagDialog,
    InputText,
    Button,
    DataTable,
    Column,
    Calendar,
    Dialog,
    InlineMessage,
    //InputNumber,
    Dropdown,
    FileUpload,
    Checkbox,
  },
  emits: ["extend-session", "showSearchbar"],

  data() {
    return {
      checkAll: false,
      ProjectRef: "61196AD9FF1A440A9267D3044E8B595E",
      showTable: true,

      first: 0,
      snagsPage: 1, // default page to load
      pageSize: 100, // default page size
      totalRecords: 0, // total records, get this from snags json
      //   rowsPerPageOptions: [{"label":"25","value":"25"},{"label":"50","value":"50"},{"label":"100","value":"100"},{"label":"250","value":"250"},{"label":"500","value":"500"}],
      rowsPerPageOptions: [25, 50, 100, 250, 500],

      searchQuery: "",
      captionFilter: "",
      codeFilter: "",
      statusFilter: "",
      worksPackageFilter: "",
      areaFilter: "",
      createdByFilter: "",
      actionByFilter: "",
      closedByFilter: "",

      captionFilterMode: "",
      codeFilterMode: "",
      statusFilterMode: "",
      worksPackageFilterMode: "",
      areaFilterMode: "",
      createdByFilterMode: "",
      actionByFilterMode: "",
      closedByFilterMode: "",

      snagDetails: [], // all snag details includin images
      snagDetailsData: [], //only details, without images

      events: [
        {
          status: "created",
          date: "2024-02-01",
          createdBy: "Ryan Bradley",
          icon: "pi pi-cog",
          color: "blue",
          notes: "",
        },
        {
          status: "Uploaded image",
          date: "2024-02-02",
          createdBy: "Ryan Bradley",
          icon: "pi pi-image",
          color: "lightblue",
          notes: "",
        },
        {
          status: "Edited",
          date: "2024-02-02",
          createdBy: "Noel Mullen",
          icon: "pi pi-pencil",
          color: "lightblue",
          notes: "Changed title",
        },
        {
          status: "Accepted",
          date: "2024-02-02",
          createdBy: "Noel Mullen",
          icon: "pi pi-check",
          color: "green",
          notes: "All looks ok",
        },
        {
          status: "Closed",
          date: "2024-02-02",
          createdBy: "Noel Mullen",
          icon: "pi pi-star",
          color: "lightgreen",
          notes: "",
        },
        {
          status: "Reopened",
          date: "2024-02-02",
          createdBy: "Ryan Bradley",
          icon: "pi pi-refresh",
          color: "blue",
          notes: "It needs to be reopened",
        },
        {
          status: "Accepted",
          date: "2024-02-02",
          createdBy: "Noel Mullen",
          icon: "pi pi-check",
          color: "green",
          notes: "All looks ok",
        },
        {
          status: "Closed",
          date: "2024-02-02",
          createdBy: "Evan Blake",
          icon: "pi pi-star",
          color: "lightgreen",
        },
      ],

      howManyTrips: "",
      AllPageMarked: false,
      AllMarked: false,
      sendMultipleInvoiceDialog: false,
      showInvoiceSelectedButton: false,
      selectedIDsForInvoicing: [],
      checkedIDs: [],
      invoiceDate: "",
      invoiceDateOK: true,
      sendInvoiceDialog: false,
      displayUnInvoiceConfirm: false,
      dataTable: "dataTable",
      downloadedReport: "",
      binaryfile: "",
      photoIdForDelete: "",
      displayDeletePhotoConfirm: false,
      uploadFIlename: "",
      displayUploadModal: false,
      allStatuses: [],
      ClickedRowId: "",
      tableHeight: "calc( 100vh - 215px)",
      displayDeleteConfirm: false,
      deletingTripName: "",
      snagNotes: "",
      newSnagDialogState: false,
      editSnagDialog: false,
      isLoading: true,
      userType: "",
      userLocale: "",
      loading1: true,
      loading2: true,
      filters1: null,
      visibleImagesModal: false,
      snagImages: [],
      picturesTabShow: false,
      activeTab: 0,
      SnagDate: "",
      tripUserEmail: "",
      tripFrom: "",
      tripTo: "",
      tripFixedCosts: "",
      tripCargoName: "",
      tripDistance: "",
      tripDistanceCosts: "",
      tripVatPercentage: "",
      tripSum: "",
      tripSumVAT: "",
      tripCompanyName: "",
      tripComments: "",
      tripCreated: "",
      tripUserFullName: "",
      openedcargoname: "",

      displayInfoDialog: false,
      InfoModalHeader: "",
      InfoModalMessage: "",

      editSnagDate: "",
      editSnagTitle: "",
      editSnagCode: "",
      editSnagCargoName: "",
      editSnagFixedCosts: "0",
      editSnagDistance: "0",
      editSnagDistanceCosts: "0",
      editSnagStatus: "",
      editSnagComments: "",

      editSnagDateOK: true,
      editSnagTitleOK: true,
      editSnagCodeOK: true,
      editSnagCargoNameOK: true,
      editSnagFixedCostsOK: true,
      editSnagDistanceOK: true,
      editSnagDistanceCostsOK: true,
      editSnagStatusOK: true,
      editSnagCommentsOK: true,
      editSnagInvoiced: "",

      panelClass: "closedPanel",
      /*   filters: {
               'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
               'code': {value: null, matchMode: FilterMatchMode.EQUALS},

              //if multiple filters is posible
               'code':{operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
               'caption': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
               'status':{operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
               'createdBy': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
               'area':{operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
               'worksPackage': {{operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
               'closedBy':{operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
               'assignedTo': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},


            },*/

      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },

        code: {
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        caption: {
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        status: {
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        createdBy: {
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        area: {
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        worksPackage: {
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        closedBy: {
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        assignedTo: {
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
      },

      matchModes: [
        { label: "Starts With", value: FilterMatchMode.STARTS_WITH },
        { label: "Contains", value: FilterMatchMode.CONTAINS },
      ],
      allSnags: [],

      fromDate: "",
      toDate: "",
    };
  },
  methods: {
    checkAllHandler() {
      // TODO: implement real endpoint action
      this.allSnags.forEach((snag) => {
        snag.checked = this.checkAll;
      });
    },

    async downloadSnagPDF() {
      const snagKey = this.snagDetails["snag"]["key"];
      const snagCode = this.snagDetails["snag"]["code"];
      const snagTitle = this.snagDetails["snag"]["caption"];
      const aFileName = snagCode + " - " + snagTitle + ".pdf";

      //const sessionId=this.$store.getters.token;
      const baseUrl = this._rootRestUrl;

      const xhr = new XMLHttpRequest();
      xhr.open(
        "GET",
        baseUrl + "/api/PDF/DownloadSnagPDF/?snagKey=" + snagKey,
        true
      );
      xhr.setRequestHeader(
        "Content-Type",
        "application/x-www-form-urlencoded; charset=UTF-8"
      );
      xhr.responseType = "blob";
      xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(this.response, aFileName);
          } else {
            const downloadLink = window.document.createElement("a");
            const contentTypeHeader = xhr.getResponseHeader("Content-Type");
            downloadLink.href = window.URL.createObjectURL(
              new Blob([this.response], { type: contentTypeHeader })
            );
            downloadLink.download = aFileName;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
          }
        }
      };
      xhr.send(null);

      /*    let formData = JSON.stringify({});
          let config = {
            headers: {
              "Content-Type": "application/json",
            },

          };

        try{
         await  axios
            .get(baseUrl + "/api/PDF/DownloadSnagPDF/?snagKey="+snagKey, formData, config)
            .then((response) => {
               this.downloadedSnagPDF = response.data;


              // var fileName = 'Report '+this.format_date(DateFrom, 'YYYY-MM-DD')+" - "+this.format_date(DateTo, 'YYYY-MM-DD');
               this.downloadPDF(this.downloadedSnagPDF, snagCode + " - "+ snagTitle +".pdf");

            })


          } catch (error) {

                if(error.response.status == 401){
                  alert("Your session is expired! Please login");
                  localStorage.clear();
                    // document.location = '/';
                }
              this.displayUnInvoiceConfirm=false;

              this.displayInfoDialog=true;
              this.InfoModalHeader='Error '+error.response.status;
              this.InfoModalMessage=error.response.data.Message;
              this.isLoading = false;

       }

          // after every request
          // this.$store.dispatch('autoLogin');  // go to AUTOLOGIN to extend "local" token valication
            this.extendTime(); // extend timeout to show expire session dialog
            // ---------------------

*/
    },

    selectingForInvoice(clickedID) {
      if (!this.checkedIDs[clickedID]) {
        this.selectedIDsForInvoicing.push(clickedID);
      } else {
        const index = this.selectedIDsForInvoicing.indexOf(clickedID);
        this.selectedIDsForInvoicing.splice(index, 1);
      }

      if (this.selectedIDsForInvoicing.length > 0) {
        this.showInvoiceSelectedButton = true;
      } else {
        this.showInvoiceSelectedButton = false;
        this.AllPageMarked = false;
      }
    },

    invoiceSelected() {
      this.invoiceDate = moment().format("DD/MM/YYYY HH:mm");

      /*var addText = '';
      if (this.selectedIDsForInvoicing.length == 1){
        addText = 'Mark selected trip as Invoiced';
      }else{
        addText = ''+this.selectedIDsForInvoicing.length+'</strong> trips as Invoiced';
      }
      this.howManyTrips = addText;*/

      this.sendMultipleInvoiceDialog = true;
    },

    reorganizePagination() {
      $(".p-paginator-current").detach().appendTo(".p-paginator-left-content");
      $(".p-paginator-rpp-options")
        .detach()
        .appendTo(".p-paginator-right-content");
    },

    moveSearchBoxToTop() {
      //default search box is inside header of the datatable, must move to the top of the page
      $("#hereMoveSearch").empty();
      $("#searchBox").detach().appendTo("#hereMoveSearch");
    },

    newSnag() {
      this.resetInputFields();

      //show dialog for insert
      this.newSnagDialogState = true;
    },
    editSnag() {
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

      /*  if(this.newSnagComments == ''){
        this.newSnagCommentsOK = false;
        AllOk = false;
      }else{this.newSnagCommentsOK = true;}*/

      if (AllOk == true) {
        this.editSnagInDatabase();
      }
    },
    async editSnagInDatabase() {
      this.panelClass = "closedPanel";
      this.isLoading = true;

      var SnagDate = this.format_date(
        moment(this.editSnagDate, "DD/MM/YYYY HH:mm"),
        "YYYY-MM-DD HH:mm:ss"
      );

      const sessionId = this.$store.getters.token;
      const baseUrl = this._rootRestUrl;

      let formData = JSON.stringify({
        key: this.ClickedRowId,
        sessionId: sessionId,
        caption: this.editSnagTitle,
        code: this.editSnagCode,
        status: this.editSnagStatus,
        userEmail: "",
        date: SnagDate,
      });

      let config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        await axios
          .put(baseUrl + "/api/Snags/EditSnag", formData, config)
          .then(() => {
            this.getSnags();
            this.getCompanies();
            this.editSnagDialog = false;

            this.displayInfoDialog = true;
            this.InfoModalHeader = "Info";
            this.InfoModalMessage = "Changes are saved";
            this.isLoading = false;
          });
      } catch (error) {
        this.editSnagDialog = false;
        this.displayInfoDialog = true;
        this.InfoModalHeader = "Error " + error.response.status;
        this.InfoModalMessage = error.response.data.Message;
        this.isLoading = false;
      }

      // after every request
      //  // this.$store.dispatch('autoLogin');  // go to AUTOLOGIN to extend "local" token valication
      this.extendTime(); // extend timeout to show expire session dialog
      // ---------------------
    },

    async InsertSnagToDatabase(snag) {
      this.panelClass = "closedPanel";
      this.isLoading = true;

      // const sessionId=this.$store.getters.token;

      const baseUrl = this._rootRestUrl;

      let formData = JSON.stringify({
        ProjectRef: this.ProjectRef,
        type: "Snag",
        key: "",
        code: snag.newSnagCode,
        caption: snag.newSnagTitle,
        status: snag.newSnagStatus,
        date: snag.newSnagDate.toString(),
      });

      let config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        await axios
          .post(baseUrl + "/api/Snags/InsertSnag", formData, config)
          .then(() => {
            this.getSnags();
            this.getCompanies();
            this.newSnagDialogState = false;
            this.displayInfoDialog = true;
            this.InfoModalHeader = "Info";
            this.InfoModalMessage = "Snag is inserted";
            this.isLoading = false;
          });
      } catch (error) {
        if (error.response.status == 401) {
          alert("Your session is expired! Please login");
          localStorage.clear();
          // document.location = '/';
        }
        this.newSnagDialogState = false;

        this.displayInfoDialog = true;
        this.InfoModalHeader = "Error " + error.response.status;
        this.InfoModalMessage = error.response.data.Message;
        this.isLoading = false;
      }

      // after every request
      // this.$store.dispatch('autoLogin');  // go to AUTOLOGIN to extend "local" token valication
      this.extendTime(); // extend timeout to show expire session dialog
      // ---------------------
    },

    closeInfo() {
      this.displayInfoDialog = false;
    },

    handleClose(shouldShow) {
      // shouldShow will always be `false`, so this is a bit redundant
      if (!shouldShow) {
        // this.resetInputFields();
      } else {
        // still open
      }
    },

    closeInsertDialog() {
      this.newSnagDialogState = false;
      this.resetInputFields();
    },

    closeEditDialog() {
      this.editSnagDialog = false;
      //this.resetInputFields();
    },

    resetInputFields() {
      //reset input and edit fields ;)
      this.editSnagDate = "";
      this.editSnagTitle = "";
      this.editSnagCode = "";
      this.editSnagCargoName = "";
      this.editSnagFixedCosts = "0";
      this.editSnagDistance = "0";
      this.editSnagDistanceCosts = "0";
      this.editSnagStatus = "";
      this.editSnagComments = "";

      this.editSnagDateOK = true;
      this.editSnagTitleOK = true;
      this.editSnagCodeOK = true;
      this.editSnagCargoNameOK = true;
      this.editSnagFixedCostsOK = true;
      this.editSnagDistanceOK = true;
      this.editSnagDistanceCostsOK = true;
      this.editSnagStatusOK = true;
      this.editSnagCommentsOK = true;
    },

    editClick() {
      //show dialog for insert
      this.editSnagDialog = true;
    },

    deleteClick() {
      // show confirmation dialog
      this.displayDeleteConfirm = true;
    },

    deletePhotoId(photoId) {
      // show confirmation dialog
      this.displayDeletePhotoConfirm = true;
      this.photoIdForDelete = photoId;
    },

    deletePhotoModal(photoId) {
      // show confirmation dialog

      this.photoIdForDelete = photoId;
      this.deletePhoto();
    },

    async deletePhoto() {
      //user already confirmed
      this.panelClass = "closedPanel";
      this.isLoading = true;

      const sessionId = this.$store.getters.token;
      const baseUrl = this._rootRestUrl;

      let formData = JSON.stringify({
        sessionId: sessionId,
        key: this.photoIdForDelete,
      });

      let config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        await axios
          .post(baseUrl + "/api/v1/Trip/DeleteTripFile", formData, config)
          .then(() => {
            this.getSnags();
            this.getCompanies();
            this.displayDeletePhotoConfirm = false;
            this.visibleImagesModal = false;
            this.displayInfoDialog = true;
            this.InfoModalHeader = "Info";
            this.InfoModalMessage = "Photo is deleted";
            this.isLoading = false;
          });
      } catch (error) {
        if (error.response.status == 401) {
          alert("Your session is expired! Please login");
          localStorage.clear();
          // document.location = '/';
        }
        this.displayDeletePhotoConfirm = false;
        this.visibleImagesModal = false;

        this.displayInfoDialog = true;
        this.InfoModalHeader = "Error " + error.response.status;
        this.InfoModalMessage = error.response.data.Message;
        this.isLoading = false;
      }

      // after every request
      // this.$store.dispatch('autoLogin');  // go to AUTOLOGIN to extend "local" token valication
      this.extendTime(); // extend timeout to show expire session dialog
      // ---------------------
    },

    async deleteTrip() {
      //user already confirmed
      this.panelClass = "closedPanel";
      this.isLoading = true;

      const sessionId = this.$store.getters.token;
      const baseUrl = this._rootRestUrl;

      let formData = JSON.stringify({
        sessionId: sessionId,
        key: this.ClickedRowId,
      });

      let config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        await axios
          .post(baseUrl + "/api/v1/Trip/DeleteTrip", formData, config)
          .then(() => {
            this.getSnags();
            this.getCompanies();
            this.displayDeleteConfirm = false;
            this.displayInfoDialog = true;
            this.InfoModalHeader = "Info";
            this.InfoModalMessage = "Trip is deleted";
            this.isLoading = false;
          });
      } catch (error) {
        if (error.response.status == 401) {
          alert("Your session is expired! Please login");
          localStorage.clear();
          // document.location = '/';
        }
        this.displayDeleteConfirm = false;

        this.displayInfoDialog = true;
        this.InfoModalHeader = "Error " + error.response.status;
        this.InfoModalMessage = error.response.data.Message;
        this.isLoading = false;
      }

      // after every request
      // this.$store.dispatch('autoLogin');  // go to AUTOLOGIN to extend "local" token valication
      this.extendTime(); // extend timeout to show expire session dialog
      // ---------------------
    },

    downloadClick() {
      // alert("Download clicked")
    },

    refreshData() {
      if (this.fromDate == null) {
        this.fromDate = "";
      }
      if (this.toDate == null) {
        this.toDate = "";
      }
      //get selected dates
      if (this.fromDate.length > 0) {
        if (this.fromDate.length != 10) {
          this.fromDate = this.format_date(this.fromDate, "DD/MM/YYYY");
        }

        if (this.toDate.length != 10) {
          this.toDate = this.format_date(this.toDate, "DD/MM/YYYY");
        }
      }

      // and go for trips
      this.getSnags();
      this.getCompanies();
    },
    onSwiper() {},

    format_date_to_full(aDate, aTime) {
      //excpected input: 14/04/2023
      var year = aDate.substring(6, 10);
      var month = aDate.substring(3, 5);
      var day = aDate.substring(0, 2);

      return year + "-" + month + "-" + day + " " + aTime;
    },

    format_date_to_full_time(aDate) {
      //excpected input: 14/04/2023 14:33
      var year = aDate.substring(6, 10);
      var month = aDate.substring(3, 5);
      var day = aDate.substring(0, 2);
      var hour = aDate.substring(11, 13);
      var min = aDate.substring(14, 16);
      var sec = "00";

      return (
        year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec
      );
    },

    format_date_to_dateTime(aDate) {
      //expected input: 2023-10-24 14:30:43
      var year = aDate.substring(0, 4);
      var month = aDate.substring(5, 7);
      var day = aDate.substring(8, 10);
      var hour = aDate.substring(11, 13);
      var min = aDate.substring(14, 16);

      //return year + '-' + month + '-' +day + " "+hour+":"+min;
      return day + "/" + month + "/" + year + " " + hour + ":" + min;
    },

    async getCompanies() {
      /*
          const sessionId=this.$store.getters.token;
          const baseUrl = this._rootRestUrl;

          let formData = JSON.stringify({ sessionId: sessionId });
          let config = {
            headers: {
              "Content-Type": "application/json",
            },

          };

         await  axios
            .get(baseUrl + "/api/v1/Company/GetCompanies/?sessionId="+sessionId+"", formData, config)
            .then((response) => {
               this.allStatuses = response.data;

               //sorting function:
                const sortArrayOfObjects = (arr, propertyName, order = 'ascending') => {
                      const sortedArr = arr.sort((a, b) => {
                        if (a[propertyName] < b[propertyName]) {
                          return -1;
                        }
                        if (a[propertyName] > b[propertyName]) {
                          return 1;
                        }
                        return 0;
                      });

                      if (order === 'descending') {
                        return sortedArr.reverse();
                      }

                      return sortedArr;
                    };
               //-- end of sorting function



               this.allStatuses = sortArrayOfObjects( this.allStatuses, "name");

             // console.table(this.allStatuses)

            })
             .catch(function (error) {
                // handle error
                if(error.response.status=='401') { //not authorized, token expires
                 localStorage.clear();
                 // document.location = '/';
              }
                console.table(error);
             });

           // after every request
            // this.$store.dispatch('autoLogin');  // go to AUTOLOGIN to extend "local" token valication
            this.extendTime(); // extend timeout to show expire session dialog
            // ---------------------

            */
    },

    extendTime() {
      this.$emit("extend-session"); // extend time when session timeout popup will be shown
    },

    async getSnags(all) {
      //get selected dates

      //save dates to local storage so it remebeer when swithing tabs:
      localStorage.setItem("fromDate", this.fromDate);
      localStorage.setItem("toDate", this.toDate);

      this.panelClass = "closedPanel";
      this.isLoading = true;

      /*   const fromDateFull = this.format_date_to_full(this.fromDate, '00:00:00');
            const toDateFull = this.format_date_to_full(this.toDate,'23:59:59');
          */

      /*
          const sessionId=this.$store.getters.token;
          const DateFrom=fromDateFull;
          const DateTo= toDateFull;
          const UserId= localStorage.getItem("userId");
          const UserType= this.userType;
         */

      const baseUrl = this._rootRestUrl;

      let config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      /*  captionFilter:'',
              codeFilter:'',
          */
      var addOnFilter = [];
      var isthisLike = false;

      if (this.captionFilter != "" && this.captionFilter != null) {
        if (this.captionFilterMode == "contains") {
          isthisLike = true;
        } else {
          isthisLike = false;
        }
        addOnFilter.push({
          name: "caption",
          value: this.captionFilter,
          isLike: isthisLike,
          isDate: false,
        });
      }

      if ((this.codeFilter != "") & (this.codeFilter != null)) {
        if (this.codeFilterMode == "contains") {
          isthisLike = true;
        } else {
          isthisLike = false;
        }
        addOnFilter.push({
          name: "code",
          value: this.codeFilter,
          isLike: isthisLike,
          isDate: false,
        });
      }

      if ((this.statusFilter != "") & (this.statusFilter != null)) {
        if (this.statusFilterMode == "contains") {
          isthisLike = true;
        } else {
          isthisLike = false;
        }
        addOnFilter.push({
          name: "status",
          value: this.statusFilter,
          isLike: isthisLike,
          isDate: false,
        });
      }

      if ((this.worksPackageFilter != "") & (this.worksPackageFilter != null)) {
        if (this.worksPackageFilterMode == "contains") {
          isthisLike = true;
        } else {
          isthisLike = false;
        }

        addOnFilter.push({
          name: "worksPackage",
          value: this.worksPackageFilter,
          isLike: isthisLike,
          isDate: false,
        });
      }

      if ((this.areaFilter != "") & (this.areaFilter != null)) {
        if (this.areaFilterMode == "contains") {
          isthisLike = true;
        } else {
          isthisLike = false;
        }
        addOnFilter.push({
          name: "area",
          value: this.areaFilter,
          isthisLike: true,
          isDate: false,
        });
      }

      if ((this.closedByFilter != "") & (this.closedByFilter != null)) {
        if (this.closedByFilterMode == "contains") {
          isthisLike = true;
        } else {
          isthisLike = false;
        }
        addOnFilter.push({
          name: "closedBy",
          value: this.closedByFilter,
          isLike: isthisLike,
          isDate: false,
        });
      }

      if ((this.actionByFilter != "") & (this.actionByFilter != null)) {
        if (this.actionByFilterMode == "contains") {
          isthisLike = true;
        } else {
          isthisLike = false;
        }
        addOnFilter.push({
          name: "assignedTo",
          value: this.actionByFilter,
          isLike: isthisLike,
          isDate: false,
        });
      }

      if ((this.createdByFilter != "") & (this.createdByFilter != null)) {
        if (this.createdByFilterMode == "contains") {
          isthisLike = true;
        } else {
          isthisLike = false;
        }
        addOnFilter.push({
          name: "createdBy",
          value: this.createdByFilter,
          isLike: isthisLike,
          isDate: false,
        });
      }

      //created date filter
      //   var from = '2023-01-01';
      //     var to = '2023-02-03';

      // from = moment(from);

      //  from = (moment(from).format('x'));
      //  to = (moment(to).format('x'));

      //  from =moment(from).format('x')*1+621355968000000000;
      //   to =moment(to).format('x')*1+621355968000000000;

      if (
        this.fromDate != undefined &&
        this.toDate != undefined &&
        this.fromDate != null &&
        this.toDate != null &&
        this.fromDate != "" &&
        this.toDate != ""
      ) {
        var from = this.fromDate;
        var to = this.toDate;

        from = moment(from).format("x") * 10000 + 621355968000000000;
        to = moment(to).format("x") * 10000 + 621355968000000000;

        addOnFilter.push({
          name: "created",
          value: from + "," + to,
          isLike: isthisLike,
          isDate: true,
        });
      }

      //    addOnFilter += ']';

      if (this.searchQuery != "") {
        addOnFilter += "&searchQuery=" + this.searchQuery;
      }

      /*     this.createdByFilter = event.filters.createdBy.matchMode;
          this.actionByFilter = event.filters.assignedTo.matchMode;
          this.closedByFilter = event.filters.closedBy.matchMode;*/

      var pageA = "";
      if (all == "all") {
        pageA = 0;
        this.pageSize = this.totalRecords;
        // this.pageSize=100;
      } else {
        pageA = +this.snagsPage;

        //    this.pageSize=100;
      }

      let formData = {
        pageSize: this.pageSize,
        pageNumber: pageA,
        searchQuery: this.searchQuery,
        filters: addOnFilter,
      };

      formData = JSON.stringify(formData);

      try {
        await axios
          .post(baseUrl + "/api/Snags/GetAllSnags/", formData, config)
          .then((response) => {
            this.allSnags = response.data.snags;
            this.totalRecords = response.data.totalRecords;

            if (this.totalRecords == 0) {
              this.showTable = false;
            } else {
              this.showTable = true;
            }

            this.isLoading = false;
            this.reorganizePagination();

            // if we don't have loookups for statuses then get it :)
            if (this.allStatuses.length == 0) {
              this.getStatuses();
            }
          });

        $("#sidebar").click();
      } catch (error) {
        if (error.response.status == 401) {
          alert("Your session is expired! Please login");
          localStorage.clear();
          // document.location = '/';
        }

        this.displayInfoDialog = true;
        this.InfoModalHeader = "Error " + error.response.status;
        this.InfoModalMessage = error.response.data.Message;
        this.isLoading = false;
      }

      // after every request
      // this.$store.dispatch('autoLogin');  // go to AUTOLOGIN to extend "local" token valication
      this.extendTime(); // extend timeout to show expire session dialog
      // ---------------------
    },

    async getStatuses() {
      const baseUrl = this._rootRestUrl;

      let formData = JSON.stringify({ category: "SNSTAT" });
      let config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        await axios
          .get(
            baseUrl + "/api/LookUps/GetStatusLookUps?category=" + "SNSTAT",
            formData,
            config
          )
          .then((response) => {
            this.allStatuses = response.data;

            var jsonString = JSON.stringify(response.data);
            jsonString = jsonString.replaceAll('"shortCode"', '"value"');
            jsonString = jsonString.replaceAll('"description"', '"name"');

            this.allStatuses = $.parseJSON(jsonString);
          });
      } catch (error) {
        if (error.response.status == 401) {
          alert("Your session is expired! Please login");
          localStorage.clear();
          // document.location = '/';
        }

        this.displayInfoDialog = true;
        this.InfoModalHeader = "Error " + error.response.status;
        this.InfoModalMessage = error.response.data.Message;
        this.isLoading = false;
      }

      // after every request
      // this.$store.dispatch('autoLogin');  // go to AUTOLOGIN to extend "local" token valication
      this.extendTime(); // extend timeout to show expire session dialog
      // ---------------------
    },

    onRowClick(event) {
      this.ClickedRowId = event.data.key; // key for update
      this.editSnagDate = this.format_date(event.data.date, "DD/MM/YYYY");
      this.editSnagTitle = event.data.caption;
      this.editSnagStatus = event.data.status;
      this.editSnagCode = event.data.code;

      // alert( event.data.id);

      $(".hiddenFields").each(function () {
        $(this).closest("tr").removeClass("highlight");
      });

      $(".hiddenFields").each(function () {
        if ($(this).attr("data") == event.data.key) {
          $(this).closest("tr").addClass("highlight");
        }
      });
    },

    onRowSelect(event) {
      if (
        event.originalEvent.target.tagName != "I" &&
        event.originalEvent.target.tagName != "SPAN"
      ) {
        //if not clicked on I element (icon ) then open panel

        $(".hiddenFields").each(function () {
          $(this).closest("tr").removeClass("highlight");
        });

        $(".hiddenFields").each(function () {
          if ($(this).attr("data") == event.data.key) {
            $(this).closest("tr").addClass("highlight");
          }
        });

        //open panel
        this.getDocumentDetails();

        if (this.snagImages.length > 0) {
          this.picturesTabShow = false;
          this.activeTab = 0;
        } else {
          this.picturesTabShow = true;
        }
      }
    },
    openDialogAddPhoto() {
      this.displayUploadModal = true;
    },

    customUploader(event) {
      var timestamp = Date.now();
      var selectedFile = event.files[0]; // for now only one file
      //  this.convertToBinary(selectedFile, selectedFile.name);
      this.uploadImage(selectedFile, timestamp + "_" + selectedFile.name);
    },

    /*     async convertToBinary(file, filename) {

            const reader = new FileReader();
            reader.readAsBinaryString(file);
            await new Promise(resolve => reader.onload = () => resolve());

            var binary = reader.result

            this.uploadImage(binary,filename);


       },*/

    async uploadImage(binary, filename) {
      //FINNALY !! it works :)
      //  alert(binary )
      //   alert(filename);
      this.isLoading = true;

      const sessionId = this.$store.getters.token;
      const baseUrl = this._rootRestUrl;
      const tripId = this.ClickedRowId;

      //   let formData = JSON.stringify({ Key: '', 'TripId':tripId, FileName:filename, SessionId: sessionId,File: binary });
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      var formData = new FormData();
      formData.append("Key", "");
      formData.append("Caption", filename);
      formData.append("SnagRef", tripId);
      formData.append("ProjectRef", this.ProjectRef);
      formData.append("SessionId", sessionId);
      formData.append("File", binary);

      try {
        await axios
          .post(baseUrl + "/api/Attachments/InsertPhoto", formData, config)
          .then(() => {
            this.displayInfoDialog = true;
            this.InfoModalHeader = "Info";
            this.InfoModalMessage = "Photo is added";
            this.isLoading = false;
            this.displayUploadModal = false;
            // console.table(response);
            this.getSnags();
          });
      } catch (error) {
        // alert(error)

        this.displayInfoDialog = true;
        this.InfoModalHeader = "Alert!";
        this.InfoModalMessage =
          "Error occured while uploading photo. Photo is not added!";
        this.isLoading = false;
        this.displayUploadModal = false;
        this.getSnags();
      }

      // after every request
      // this.$store.dispatch('autoLogin');  // go to AUTOLOGIN to extend "local" token valication
      this.extendTime(); // extend timeout to show expire session dialog
      // ---------------------
    },
    setInvoiceDateToday() {
      this.invoiceDate = moment().format("DD/MM/YYYY HH:mm");
      this.sendInvoiceDialog = true;
    },

    invoiceThisTrip() {
      var AllOk = true;

      if (this.invoiceDate == "") {
        this.invoiceDateOK = false;
        AllOk = false;
      } else {
        this.invoiceDateOK = true;
      }

      if (AllOk == true) {
        this.markAsInvoicedInDatabase();
      }
    },

    invoiceMultipleTrips() {
      var AllOk = true;

      if (this.invoiceDate == "") {
        this.invoiceDateOK = false;
        AllOk = false;
      } else {
        this.invoiceDateOK = true;
      }

      if (AllOk == true) {
        this.markAsInvoicedMultipleInDatabase();
      }
    },

    async markAsInvoicedInDatabase() {
      // this.panelClass = 'closedPanel';
      this.isLoading = true;

      var Date = this.format_date(
        moment(this.invoiceDate, "DD/MM/YYYY HH:mm"),
        "YYYY-MM-DD HH:mm:ss"
      );

      const sessionId = this.$store.getters.token;
      const baseUrl = this._rootRestUrl;

      let formData = JSON.stringify({
        tripKey: this.ClickedRowId,
        sessionId: sessionId,
        date: Date,
        isInvoiceSent: true,
      });

      let config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        await axios
          .post(baseUrl + "/api/v1/Trip/MarkInvoiceAsSent", formData, config)
          .then(() => {
            this.getSnags();
            this.getCompanies();
            this.displayInfoDialog = true;
            this.sendInvoiceDialog = false;
            this.InfoModalHeader = "Info";
            this.InfoModalMessage = "Trip is marked as invoiced";
            this.isLoading = false;

            this.checkedIDs = [];
            this.AllPageMarked = false;
          });
      } catch (error) {
        if (error.response.status == 401) {
          alert("Your session is expired! Please login");
          localStorage.clear();
          // document.location = '/';
        }
        this.sendInvoiceDialog = false;

        this.displayInfoDialog = true;
        this.InfoModalHeader = "Error " + error.response.status;
        this.InfoModalMessage = error.response.data.Message;
        this.isLoading = false;
      }

      // after every request
      // this.$store.dispatch('autoLogin');  // go to AUTOLOGIN to extend "local" token valication
      this.extendTime(); // extend timeout to show expire session dialog
      // ---------------------
    },

    async markAsInvoicedMultipleInDatabase() {
      // this.panelClass = 'closedPanel';
      this.isLoading = true;

      var Date = this.format_date(
        moment(this.invoiceDate, "DD/MM/YYYY HH:mm"),
        "YYYY-MM-DD HH:mm:ss"
      );

      const sessionId = this.$store.getters.token;
      const baseUrl = this._rootRestUrl;

      var jsonString = '{"sessionId": "' + sessionId + '",';
      jsonString += '     "invoices": [ ';

      var a = 0;
      var collectIDsToRemoveChecked = [];
      this.selectedIDsForInvoicing.forEach((aID) => {
        collectIDsToRemoveChecked.push(aID);
        a++;
        jsonString += "{";
        jsonString += '"tripKey": "' + aID + '",';
        jsonString += '"isInvoiceSent": true,';
        jsonString += '"invoiceDate": "' + Date + '"';
        jsonString += "}";
        if (a < this.selectedIDsForInvoicing.length) {
          jsonString += ",";
        }
      });

      jsonString += "  ]";
      jsonString += "  }";

      let formData = jsonString;

      let config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        await axios
          .post(baseUrl + "/api/v1/Trip/MarkInvoicesAsSent", formData, config)
          .then(() => {
            this.getSnags();
            this.getCompanies();
            this.displayInfoDialog = true;
            this.sendMultipleInvoiceDialog = false;
            this.showInvoiceSelectedButton = false;
            this.InfoModalHeader = "Info";
            this.InfoModalMessage = "Trips are marked as invoiced";
            this.isLoading = false;

            //remove checkbox
            collectIDsToRemoveChecked.forEach((aID) => {
              this.checkedIDs[aID] = false;

              //remove ID from array
              const index = this.selectedIDsForInvoicing.indexOf(aID);
              this.selectedIDsForInvoicing.splice(index, 1);
            });
          });
      } catch (error) {
        if (error.response.status == 401) {
          alert("Your session is expired! Please login");
          localStorage.clear();
          // document.location = '/';
        }
        this.sendInvoiceDialog = false;

        this.displayInfoDialog = true;
        this.InfoModalHeader = "Error " + error.response.status;
        this.InfoModalMessage = error.response.data.Message;
        this.isLoading = false;
      }

      this.AllPageMarked = false;
      this.AllMarked = false;

      // after every request
      // this.$store.dispatch('autoLogin');  // go to AUTOLOGIN to extend "local" token valication
      this.extendTime(); // extend timeout to show expire session dialog
      // ---------------------
    },

    async unInvoiceThisTrip() {
      //this.panelClass = 'closedPanel';
      this.isLoading = true;

      const sessionId = this.$store.getters.token;
      const baseUrl = this._rootRestUrl;

      let formData = JSON.stringify({
        tripKey: this.ClickedRowId,
        sessionId: sessionId,
        date: "",
        isInvoiceSent: false,
      });

      let config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        await axios
          .post(baseUrl + "/api/v1/Trip/MarkInvoiceAsSent", formData, config)
          .then(() => {
            this.getSnags();
            this.getCompanies();
            this.editSnagDialog = false;
            this.displayInfoDialog = true;
            this.displayUnInvoiceConfirm = false;
            this.InfoModalHeader = "Info";
            this.InfoModalMessage = "Trip is marked as invoiced";
            this.isLoading = false;
          });
      } catch (error) {
        if (error.response.status == 401) {
          alert("Your session is expired! Please login");
          localStorage.clear();
          // document.location = '/';
        }
        this.displayUnInvoiceConfirm = false;

        this.displayInfoDialog = true;
        this.InfoModalHeader = "Error " + error.response.status;
        this.InfoModalMessage = error.response.data.Message;
        this.isLoading = false;
      }

      // after every request
      // this.$store.dispatch('autoLogin');  // go to AUTOLOGIN to extend "local" token valication
      this.extendTime(); // extend timeout to show expire session dialog
      // ---------------------
    },

    async getDocumentDetails() {
      const baseUrl = this._rootRestUrl;

      let formData = JSON.stringify({ key: this.ClickedRowId });
      let config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      this.isLoading = true;

      try {
        await axios
          .get(
            baseUrl + "/api/Snags/GetSnagDetails/?snagKey=" + this.ClickedRowId,
            formData,
            config
          )
          .then((response) => {
            this.snagDetails = response.data;
            this.isLoading = false;
            this.fillPanelData();
          });
      } catch (error) {
        if (error.response.status == 401) {
          alert("Your session is expired! Please login");
          localStorage.clear();
          // document.location = '/';
        }

        this.displayInfoDialog = true;
        this.InfoModalHeader = "Error " + error.response.status;
        this.InfoModalMessage = error.response.data.Message;
        this.isLoading = false;
      }

      // after every request
      // this.$store.dispatch('autoLogin');  // go to AUTOLOGIN to extend "local" token valication
      this.extendTime(); // extend timeout to show expire session dialog
      // ---------------------

      this.isLoading = false;
    },

    fillPanelData() {
      this.snagDetailsData = this.snagDetails["snag"];

      //picturesTabShow

      var snagPictures = this.snagDetails["snagAttachments"];

      if (snagPictures.length > 0) {
        this.snagNotes = this.snagDetailsData["notes"];

        this.snagImages = snagPictures;

        this.picturesTabShow = true;
      } else {
        this.picturesTabShow = false;
        this.snagImages = [];
      }

      this.openPanel();
    },

    openPanel() {
      this.panelClass = "openedPanel";
    },

    closePanel() {
      this.panelClass = "closedPanel";
    },

    initFilters1() {
      this.filters1 = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        userFullName: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        from: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        to: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        companyName: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        cargoName: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        distance: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        sumVAT: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        comments: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
      };
    },

    clearFilter1() {
      this.initFilters1();
    },

    getFiles() {
      /*  $("#datatable").DataTable({
              lengthMenu: [
                [25, 50, 100, -1],
                [25, 50, 100, "All"],
              ],
              pageLength: 25,
            });*/
    },
    format_date(value, pattern) {
      if (value) {
        return moment(String(value)).format(pattern);
      }
    },
    showloader(event) {
      this.isLoading = event;
    },
    async downloadReport() {
      this.getSnags();
      this.isLoading = true;

      //get selected dates
      if (this.fromDate.length != 10) {
        this.fromDate = this.format_date(this.fromDate, "DD/MM/YYYY");
      }

      if (this.toDate.length != 10) {
        this.toDate = this.format_date(this.toDate, "DD/MM/YYYY");
      }

      const fromDateFull = this.format_date_to_full(this.fromDate, "00:00:00");
      const toDateFull = this.format_date_to_full(this.toDate, "23:59:59");

      const sessionId = this.$store.getters.token;
      const DateFrom = fromDateFull;
      const DateTo = toDateFull;

      const baseUrl = this._rootRestUrl;

      // const locale = this.userLocale;
      const locale = "EN"; //for now, locale set to EN so that CSV is comma separated

      let formData = JSON.stringify({
        sessionId: sessionId,
        DateFrom: DateFrom,
        DateTo: DateTo,
        locale: locale,
      });
      let config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        await axios
          .get(
            baseUrl +
              "/api/v1/Trip/CSV/Trips/?sessionId=" +
              sessionId +
              "&DateFrom=" +
              DateFrom +
              "&DateTo=" +
              DateTo +
              "&locale=" +
              locale,
            formData,
            config
          )
          .then((response) => {
            this.downloadedReport = response.data;

            var fileName =
              "Report " +
              this.format_date(DateFrom, "YYYY-MM-DD") +
              " - " +
              this.format_date(DateTo, "YYYY-MM-DD");
            this.downloadCSV(this.downloadedReport, fileName);
          });
      } catch (error) {
        if (error.response.status == 401) {
          alert("Your session is expired! Please login");
          localStorage.clear();
          // document.location = '/';
        }
        this.displayUnInvoiceConfirm = false;

        this.displayInfoDialog = true;
        this.InfoModalHeader = "Error " + error.response.status;
        this.InfoModalMessage = error.response.data.Message;
        this.isLoading = false;
      }

      // after every request
      // this.$store.dispatch('autoLogin');  // go to AUTOLOGIN to extend "local" token valication
      this.extendTime(); // extend timeout to show expire session dialog
      // ---------------------
    },

    correctData() {
      this.allSnags.forEach((value, index) => {
        const entries = Object.entries(value);

        entries.forEach((value2) => {
          value2.checked = false;

          if (value2[0] == "invSent") {
            var newType = "";
            if (value2[1] == true) {
              newType = "Yes";
            } else {
              newType = "No";
            }
            this.allSnags[index]["invSent"] = newType;
          }
        });
      });
    },

    downloadCSV(csvString, filename) {
      const element = document.createElement("a");

      element.setAttribute("href", `data:text/csv;charset=utf-8,${csvString}`);
      element.setAttribute("download", filename);
      element.style.display = "none";

      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      this.isLoading = false;
    },

    downloadPDF() {
      $("#downloadPDFlink").remove();

      /*	const element = document.createElement("a");

          element.setAttribute("href", `data:application/pdf;base64,${base64PDF}`);
          element.setAttribute("download", filename);
          element.style.display = "none";

          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
          this.isLoading = false; */

      /*  const aHref =  `data:application/pdf;base64,${base64PDF}`;


          $('body').append('<a id="downloadPDFlink" download="'+filename+'" href="'+aHref+'">LINK</a>');
          $('#downloadPDFlink').click();*/
    },

    formatMoney(number, decPlaces, decSep, thouSep, symbol) {
      (decPlaces = isNaN((decPlaces = Math.abs(decPlaces))) ? 2 : decPlaces),
        (decSep = typeof decSep === "undefined" ? "." : decSep);
      thouSep = typeof thouSep === "undefined" ? "," : thouSep;
      var sign = number < 0 ? "-" : "";
      var i = String(
        parseInt((number = Math.abs(Number(number) || 0).toFixed(decPlaces)))
      );
      var j = (j = i.length) > 3 ? j % 3 : 0;

      return (
        symbol +
        " " +
        sign +
        (j ? i.substr(0, j) + thouSep : "") +
        i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, "$1" + thouSep) +
        (decPlaces
          ? decSep +
            Math.abs(number - i)
              .toFixed(decPlaces)
              .slice(2)
          : "")
      );
    },

    showContextMenu: function (e) {
      //show right click menu only for admin
      if (this.userType.toUpperCase() == "ADMIN") {
        e.preventDefault();
        var menu = document.getElementById("div-context-menu");
        if (menu) {
          menu.style.left = e.pageX + "px";
          menu.style.top = e.pageY - 50 + "px";
          menu.style.display = "block";
          menu.cid = e.target.id.replace(/title-/, "");
        }
      }
    },
    hideContextMenu: function () {
      const menu = document.getElementById("div-context-menu");
      if (menu) menu.style.display = "none";
    },

    onClick: function () {
      this.hideContextMenu();
    },

    onPage(event) {
      this.pageSize = event.rows;
      this.snagsPage = event["originalEvent"]["page"] * 1 + 1;
      this.getSnags();
    },

    onSearchInput() {
      if (this.searchQuery.length == 0) {
        this.first = 0;
        this.snagsPage = 1;
        this.getSnags();
      }
    },

    onSearch() {
      if (this.searchQuery.length > 2 || this.searchQuery.length == 0) {
        this.first = 0;
        this.snagsPage = 1;
        this.getSnags();
      }
    },

    onFilter(event) {
      this.captionFilter = event.filters.caption.constraints[0].value;
      this.codeFilter = event.filters.code.constraints[0].value;
      this.statusFilter = event.filters.status.constraints[0].value;
      this.worksPackageFilter = event.filters.worksPackage.constraints[0].value;
      this.areaFilter = event.filters.area.constraints[0].value;
      this.createdByFilter = event.filters.createdBy.constraints[0].value;
      this.actionByFilter = event.filters.assignedTo.constraints[0].value;
      this.closedByFilter = event.filters.closedBy.constraints[0].value;

      if (this.filters.caption.value === null) {
        this.filters.caption.constraints[0].value = null;
        this.filters.caption.value = null;
      }

      if (this.filters.code.value === null) {
        this.filters.code.constraints[0].value = null;
        this.filters.code.value = null;
      }

      if (this.filters.status.value === null) {
        this.filters.status.constraints[0].value = null;
        this.filters.status.value = null;
      }

      if (this.filters.worksPackage.value === null) {
        this.filters.worksPackage.constraints[0].value = null;
        this.filters.worksPackage.value = null;
      }

      if (this.filters.area.value === null) {
        this.filters.area.constraints[0].value = null;
        this.filters.area.value = null;
      }

      if (this.filters.createdBy.value === null) {
        this.filters.createdBy.constraints[0].value = null;
        this.filters.createdBy.value = null;
      }

      if (this.filters.assignedTo.value === null) {
        this.filters.assignedTo.constraints[0].value = null;
        this.filters.assignedTo.value = null;
      }

      if (this.filters.closedBy.value === null) {
        this.filters.closedBy.constraints[0].value = null;
        this.filters.closedBy.value = null;
      }

      //"how" we filter
      this.captionFilterMode = event.filters.caption.constraints[0].matchMode;
      this.codeFilterMode = event.filters.code.constraints[0].matchMode;
      this.statusFilterMode = event.filters.status.constraints[0].matchMode;
      this.worksPackageFilterMode =
        event.filters.worksPackage.constraints[0].matchMode;
      this.areaFilterMode = event.filters.area.constraints[0].matchMode;
      this.createdByFilterMode =
        event.filters.createdBy.constraints[0].matchMode;
      this.actionByFilterMode =
        event.filters.assignedTo.constraints[0].matchMode;
      this.closedByFilterMode = event.filters.closedBy.constraints[0].matchMode;

      //if something filtered then filter icon should be yellow
      if (this.captionFilter != null) {
        $(".captionColumn .pi-filter-icon").addClass("yellowIcon");
      } else {
        $(".captionColumn .pi-filter-icon").removeClass("yellowIcon");
      }
      if (this.codeFilter != null) {
        $(".codeColumn .pi-filter-icon").addClass("yellowIcon");
      } else {
        $(".codeColumn .pi-filter-icon").removeClass("yellowIcon");
      }
      if (this.statusFilter != null) {
        $(".statusColumn .pi-filter-icon").addClass("yellowIcon");
      } else {
        $(".statusColumn .pi-filter-icon").removeClass("yellowIcon");
      }
      if (this.worksPackageFilter != null) {
        $(".workspackageColumn .pi-filter-icon").addClass("yellowIcon");
      } else {
        $(".workspackageColumn .pi-filter-icon").removeClass("yellowIcon");
      }
      if (this.areaFilter != null) {
        $(".areaColumn .pi-filter-icon").addClass("yellowIcon");
      } else {
        $(".areaColumn .pi-filter-icon").removeClass("yellowIcon");
      }
      if (this.createdByFilter != null) {
        $(".openedColumn .pi-filter-icon").addClass("yellowIcon");
      } else {
        $(".openedColumn .pi-filter-icon").removeClass("yellowIcon");
      }
      if (this.actionByFilter != null) {
        $(".assignedToColumn .pi-filter-icon").addClass("yellowIcon");
      } else {
        $(".assignedToColumn .pi-filter-icon").removeClass("yellowIcon");
      }
      if (this.closedByFilter != null) {
        $(".closedByColumn .pi-filter-icon").addClass("yellowIcon");
      } else {
        $(".closedByColumn .pi-filter-icon").removeClass("yellowIcon");
      }

      this.getSnags();
    },

    async SelectAllPage() {
      var whatToDo = "";

      /// collect all ID of all checkboxes:
      var collectIDsToAdd = [];
      this.selectedIDsForInvoicing = [];
      $(".p-checkbox").each(function () {
        var id = $(this).parent().attr("data");
        collectIDsToAdd.push(id);
      });
      //--------------

      if (this.AllPageMarked == false) {
        whatToDo = "mark";
        this.showInvoiceSelectedButton = true;
      } else {
        whatToDo = "unmark";
        this.showInvoiceSelectedButton = false;
      }

      if (whatToDo == "mark") {
        collectIDsToAdd.forEach((aID) => {
          this.selectedIDsForInvoicing.push(aID);
          this.checkedIDs[aID] = true;
          this.AllPageMarked = true;
        });
      } else {
        this.checkedIDs = [];
        this.AllPageMarked = false;
      }
    },

    SelectAll(whatToDo) {
      if (whatToDo == "select") {
        if (this.AllMarked == false) {
          this.showInvoiceSelectedButton = true;
        } else {
          this.showInvoiceSelectedButton = false;
        }
      } else {
        //just unselect all
        this.selectedIDsForInvoicing = [];
        this.checkedIDs = [];
        this.AllMarked = false;
        this.AllPageMarked = false;
        this.showInvoiceSelectedButton = false;
      }

      this.selectedIDsForInvoicing = [];

      if (whatToDo == "select") {
        this.AllMarked = true;
        this.allSnags.forEach((value) => {
          const entries = Object.entries(value);

          var rememberID = "";
          entries.forEach((value2) => {
            if (value2[0] == "id") {
              rememberID = value2[1];
            }

            if (value2[0] == "invSent") {
              // var newType = '';

              if (value2[1] == "No") {
                //
                this.selectedIDsForInvoicing.push(rememberID);
                this.checkedIDs[rememberID] = true;
              }
            }
          });
        });
      }

      if (this.selectedIDsForInvoicing.lenght > 0) {
        this.showInvoiceSelectedButton = true;
      }
    },
  },

  mounted() {
    //on load I must clear all filters !!
    /* this.filters.caption.value = null;
    this.filters.code.value = null;
    this.filters.status.value = null;
    this.filters.worksPackage.value = null;
    this.filters.area.value = null;
    this.filters.createdBy.value = null;
    this.filters.assignedTo.value = null;
    this.filters.closedBy.value = null;*/

    //on click anywhere close context menu
    var el = document.getElementById("app");
    el.addEventListener("click", this.onClick);

    // get dates from localstorage if exists so it remembers when changing tabs:
    // if not exists then means user just enters the application so give me this week dates

    /*    if(localStorage.getItem('fromDate')!=undefined){
            this.fromDate = localStorage.getItem('fromDate');
        }else{
            this.fromDate = moment().startOf('isoWeek').format('DD/MM/YYYY');
        }

        if(localStorage.getItem('toDate')!=undefined){
            this.toDate = localStorage.getItem('toDate');
        }else{
            this.toDate  = moment().endOf('isoWeek').format('DD/MM/YYYY');
        }*/

    //  ------ end default dates  -------- /

    this.$emit("showSearchbar", true);

    /* if (this.$store.getters.getUserType==null || this.$store.getters.getUserLocale == null){
        //we don't have usertype so user is not properly login, logout him and try again
        localStorage.clear();
        // document.location = '/';
    }*/

    this.getSnags();
    this.getCompanies();
    this.moveSearchBoxToTop();

    /*   if(this.$store.getters.getUserType != null){
        this.userType = (this.$store.getters.getUserType).toUpperCase();
      }else{
        this.userType = 'USER';
      }*/

    /*    if(this.$store.getters.getUserLocale != null){
        this.userLocale = (this.$store.getters.getUserLocale).toUpperCase();
      }else{
        this.userLocale = 'EN';
      }*/

    $("#editIconsPanel").detach().appendTo(".p-tabview-nav-content");
  },

  created() {
    this.aSystemDoc = localStorage.getItem("docType");
    this.initFilters1();
    this.loading1 = false;
  },
};
</script>

<style>
@import "datatables.net-dt";
@import "primevue/resources/themes/bootstrap4-light-blue/theme.css"; /*theme*/
@import "primevue/resources/primevue.min.css   "; /*core css*/
@import "primeicons/primeicons.css   "; /*icons*/

/* ---------------------- */

.p-datatable {
  font-size: 0.9rem;
}
/*.p-datatable tbody tr:nth-child(even) {
  background: #f4f4f4;
}
.p-datatable tbody tr:nth-child(odd) {
  background: #fff;
}*/

.p-datatable tbody tr:hover {
  background: #f1f1ff !important;
  cursor: pointer;
}

.p-datatable thead tr th {
  border-bottom: 1px solid #ddd !important;
  font-size: 14px;
  padding: 6px !important;
  padding-top: 6px !important;
  padding-bottom: 6px !important;
  /*background: #fca !important;*/
}
.p-datatable tbody tr td {
  border-bottom: 1px solid #ddd !important;
  font-size: 14px;
  padding: 6px !important;
}
.p-sortable-column-icon {
  font-size: 12px;
}

.p-datatable-footer {
  padding: 2px !important;
  padding-top: 6px !important;
  padding-bottom: 6px !important;
  background: #fca !important;
}

.pi-filter-icon,
.pi-filter-slash {
  font-size: 12px;
}
.p-column-filter-menu {
  margin-left: 0;
}

.p-column-filter-menu-button {
  margin-left: 0.1rem;
}
.p-column-filter-menu-button-active {
  width: 24px;
  height: 24px;
}

/* ---------------------- */

.p-progressbar {
  height: 0.5rem;
  background-color: #d8dadc;
}
.p-progressbar .p-progressbar-value {
  background-color: #607d8b;
}

.p-datepicker {
  min-width: 25rem;
}

.p-datepicker td {
  font-weight: 400;
}

.p-datatable.p-datatable-customers .p-datatable-header {
  padding: 1rem;
  text-align: left;
  font-size: 1.5rem;
}

.p-datatable.p-datatable-customers .p-paginator {
  padding: 1rem;
}

.p-datatable.p-datatable-customers .p-datatable-thead > tr > th {
  text-align: left;
}

.p-datatable.p-datatable-customers .p-datatable-tbody > tr > td {
  cursor: auto;
  border-bottom: none !important;
}

.p-datatable.p-datatable-customers .p-dropdown-label:not(.p-placeholder) {
  text-transform: uppercase;
}

.p-button {
  background: rgb(142, 53, 46) !important;
  border-color: rgb(142, 53, 46) !important;
}
.p-button:hover {
  background: #263a4f !important;
  border-color: #263a4f !important;
}
.p-button.p-button-outlined {
  color: white;
}
.p-button.p-button-outlined:enabled:hover {
  color: white;
  background: #263a4f !important;
  border-color: #263a4f !important;
}

#searchBox {
  width: 80%;
}
#searchBox .p-inputtext {
  width: 100%;
}

.p-datatable-header #searchBox {
  display: none;
}
.dateDisplayInput {
  height: 34px;
  margin-left: 6px;
}

.p-datatable .p-sortable-column .p-sortable-column-icon {
  color: white;
}
.p-datatable
  .p-sortable-column:not(.p-highlight):hover
  .p-sortable-column-icon {
  color: white;
}
.p-datatable .p-sortable-column.p-highlight:hover .p-sortable-column-icon {
  color: white;
}
.p-button.p-button-text,
.p-button.p-button-text:enabled:hover {
  color: white;
}
.p-datatable .p-sortable-column.p-highlight .p-sortable-column-icon {
  color: white;
}

#refreshButton {
  margin-left: 6px;
  height: 34px;
}
#newSnagButton,
#downloadReport,
#invoiceSelected,
.donwloadPDFbutton {
  margin-left: 0;
  height: 34px;
}
.p-datatable .p-datatable-header {
  background: none;
  border: none;
}

.p-datatable .p-datatable-tbody > tr > td {
  text-align: left;
  border: 1px solid #dee2e6;
  border-width: 0 0 0 0;
  padding: 1rem 1rem;
}
.p-datatable-header {
  padding-left: 0 !important;
  padding-right: 0 !important;
  padding-top: 7px !important;
}
.p-paginator-current {
  border: 0 !important;
  color: #333 !important;
  font-size: 0.9rem;
}
.p-paginator-bottom {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.actionsColumns {
  display: table-cell !important;
  text-align: right !important ;
  width: 50px !important;
}
th.actionsColumns {
  display: flex !important;
}

/*.p-column-header-content{display:block}*/

.p-paginator .p-paginator-pages .p-paginator-page.p-highlight {
  background: rgb(142, 53, 46);
  border-color: rgb(142, 53, 46);
  color: #ffffff;
}

.p-paginator .p-paginator-pages .p-paginator-page {
  background-color: #ffffff;
  border: 1px solid #dee2e6;
  color: #333;
  min-width: 2.357rem;
  height: 2.357rem;
  margin: 0 0 0 -1px;
  transition: box-shadow 0.15s;
  border-radius: 0;
}

.p-disabled {
  color: #ccc !important;
}

.closedPanel {
  width: 0px;
}
.openedPanel {
  width: 750px;
}

.cursorHand {
  cursor: pointer;
}
.closePanelButton {
  margin-right: 20px;
}

#detailsTable {
  font-size: 0.9rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}
#detailsTable td {
  text-align: left;
}

.p-tabview .p-tabview-panels {
  background-color: unset;
  border-left: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-top: none !important;
}

.p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
  border: 1px solid #ccc;
}

.p-tabview .p-tabview-nav li {
  margin-right: 3px;
}

.p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
  border: 1px solid #ccc;
  top: 1px;
}
.p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
  background: #f5f5f5;
}

.p-tabview .p-tabview-nav li .p-tabview-nav-link:not(.p-disabled):focus {
  box-shadow: none;
}

.p-datatable .p-datatable-tbody > tr:focus {
  outline: none;
}

#editIconsPanel {
  top: 0px;
  position: absolute;
  right: 0px;
}
.actionIcons {
  cursor: pointer;
}

.swiperSlideHolder img {
  cursor: zoom-in;
}

.highlight td {
  background: #ccf;
}

.insertFormRow .p-inputtext {
  padding: 3px;
}
.insertFormRow {
  padding: 6px;
}
.insertFormRow {
  background: #fff;
}
.insertFormRow.even {
  background: #f3f3f3;
}

.p-dialog-content {
  height: unset;
  overflow-y: auto;
}
.redButton {
  background-color: red !important;
  border: red !important;
}
.redButton:hover {
  background-color: darkred !important;
}
#formContainer {
  font-size: 0.9rem !important;
}

.p-inline-message.p-inline-message-error {
  padding: 4px;
  margin-left: 4px;
}

.p-datepicker table td {
  padding: 1px;
}

.p-datepicker table td > span {
  width: 1.6rem;
  height: 1.6rem;
}
.p-datepicker {
  width: 300px !important;
  box-shadow: 0px 6px 12px #ddd !important;
}
.p-dropdown-panel {
  max-width: 400px !important;
  box-shadow: 0px 6px 12px #ddd !important;
}
.p-dropdown-panel .p-dropdown-header {
  padding: 0.4rem;
}
.p-dropdown-panel .p-dropdown-items .p-dropdown-item {
  padding: 0.1rem 0.7rem;
}
.p-dropdown-filter {
  padding: 3px;
}
.p-dropdown,
.p-inputtext {
  width: 230px;
}

.addphotobutton {
  margin-left: 0;
  height: 34px;
}

.p-fileupload-filename {
  width: 100% !important;
}
.p-paginator-rpp-options {
  width: 100px;
}
.p-button-label {
  text-align: left;
}

.invoiceButtonHolder {
  display: inline-block;
  margin-right: 140px;
  position: relative;
}
.invoiceButton {
  padding: 3px;
  margin-top: 4px;
}

.p-column-filter-menu-button:focus {
  outline: 0 none;
  outline-offset: 0;
  box-shadow: 0 0 5px 0.01rem rgba(255, 255, 200, 0.9);
}

.p-datatable .p-sortable-column:focus {
  box-shadow: unset;
  outline: 0 none;
}

.p-column-filter-menu-button.p-column-filter-menu-button-active,
.p-column-filter-menu-button.p-column-filter-menu-button-active:hover {
  background: #d2d2d2;
  color: #000 !important;
}

/*.p-column-filter-menu-button {
  background: #eee;
  color: #000 !important;
}

.p-column-filter-menu-button:hover {
  background: #ddd !important;
  color: #000 !important;
}*/

.p-button-label {
  padding-bottom: 3px;
}

.actionButtonsHolder {
  display: inline-block;
  top: -3px;
  position: relative;
  right: 0;
  padding-bottom: 3px;
}

.cls-context-menu {
  display: none;
  position: absolute;
}
.cls-context-menu ul,
#context-menu li {
  list-style: none;
  margin: 0;
  padding: 0;
  background: white;
}
.cls-context-menu {
  z-index: 900;
  background: white;
  border: solid 1px #ccc;
  box-shadow: 1px 3px 10px #ccc;
  padding: 4px;
}
.cls-context-menu li {
  border-bottom: solid 1px #ccc;
  display: block;
  /*padding:5px 12px;*/
  text-decoration: none;
  color: #444;
  cursor: pointer;
}

.cls-context-menu li a {
  padding: 5px 12px;
  display: block;
}

.cls-context-menu li:hover {
  background: rgb(142, 53, 46) !important;
  color: #fff;
}
.cls-context-menu li:last-child {
  border: none;
}

.context-menu-icon {
  top: 1px;
  position: relative;
  margin-right: 2px;
}
.cls-context-menu-item {
  cursor: pointer;
  display: block;
  padding: 20px;
  background: #ececec;
}

.p-button.p-button-danger.p-button-text,
.p-buttonset.p-button-danger > .p-button.p-button-text,
.p-splitbutton.p-button-danger > .p-button.p-button-text {
  color: white !important;
}

.actionButtonsHolderTable {
  display: flex;
  justify-content: right;
  width: 100%;
  height: 100%;
}
.actionButtonsHolderTable div {
  align-self: center;
}

/*    .p-datatable thead tr th.p-filter-column{background:#FFF !important}*/

.closedByName,
.closedByDate {
  display: block;
  width: 100%;
}
.closedByDate {
  font-size: 80%;
  color: #999;
}

.historyStatus {
  font-size: 90%;
  color: #000;
  font-weight: bold;
}
.historyDate {
  font-size: 80%;
  color: #999;
}
.historyName {
  font-size: 80%;
  color: #000;
}
.border-circle {
  border-radius: 50% !important;
}

.shadow-1 {
  box-shadow: 0 3px 5px #00000005, 0 0 2px #0000000d, 0 1px 4px #00000014 !important;
}
.h-2rem {
  height: 2rem !important;
}
.w-2rem {
  width: 2rem !important;
}
.flex {
  display: flex !important;
}

.statusOpen {
  background: lightblue;
}
.statusClosed {
  background: green;
}
.statusActioned {
  background: blue;
}
.statusReturned {
  background: orange;
}

.statusBlock {
  display: block;
  width: 100%;
  padding: 4px;
  color: white;
  border-radius: 5px;
  font-size: 80%;
}

.detailsHeadlineCode {
  color: #777 !important;
  font-size: 90%;
  display: block;
}
.detailsHeadline {
  color: #000;
  font-size: 120%;
  display: block;
}

.textAreaComments {
  width: 250px;
  font-size: 75%;
  border: 1px solid #ddd;
  background: #fafafa;
}

/*<ul id="pv_id_25_list" class="p-dropdown-items" role="listbox">
  <li id="pv_id_25_0" class="p-dropdown-item" role="option" aria-label="Starts with" aria-selected="false" aria-disabled="false" aria-setsize="6" aria-posinset="1">Starts with</li>
  <li id="pv_id_25_1" class="p-dropdown-item p-highlight" role="option" aria-label="Contains" aria-selected="true" aria-disabled="false" aria-setsize="6" aria-posinset="2">Contains</li>
  <li id="pv_id_25_2" class="p-dropdown-item" role="option" aria-label="Not contains" aria-selected="false" aria-disabled="false" aria-setsize="6" aria-posinset="3">Not contains</li>
  <li id="pv_id_25_3" class="p-dropdown-item" role="option" aria-label="Ends with" aria-selected="false" aria-disabled="false" aria-setsize="6" aria-posinset="4">Ends with</li>
  <li id="pv_id_25_4" class="p-dropdown-item" role="option" aria-label="Equals" aria-selected="false" aria-disabled="false" aria-setsize="6" aria-posinset="5">Equals</li>
  <li id="pv_id_25_5" class="p-dropdown-item" role="option" aria-label="Not equals" aria-selected="false" aria-disabled="false" aria-setsize="6" aria-posinset="6">Not equals</li>
  <!---->
</ul>*/

.p-dropdown-item[aria-label="Starts with"] {
  display: none;
}
/*.p-dropdown-item[aria-label="Contains"]{display:none}*/
.p-dropdown-item[aria-label="Not contains"] {
  display: none;
}
.p-dropdown-item[aria-label="Ends with"] {
  display: none;
}
.p-dropdown-item[aria-label="Not equals"] {
  display: none;
}

.dataTableHolder {
  overflow: hidden;
}

.projectNameHeadline {
  font-weight: bold;
  color: black;
}
.documentTypeHeadline {
  font-size: 80%;
  color: #888;
}

.yellowIcon {
  color: yellow;
}
.myClearButton {
  position: absolute;
  bottom: 20px;
  left: 20px;
  width: 58px !important;
  z-index: 9;
  background: red !important;
  border: red;
}
</style>
