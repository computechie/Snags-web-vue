<template>

  <base-dialog :show="isLoading"  title="Authenticating..." fixed>
    <base-spinner></base-spinner>
  </base-dialog>

  
<div style="width:100%;" @contextmenu = "showContextMenu($event)">
  <DataTable  :id="dataTable" :value="allTrips" :paginator="true" :rows="25"   dataKey="id"  stripedRows v-model:filters="filters" filterDisplay="menu" key="key" 
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            paginatorStart="CurrentPageReport"
            :rowsPerPageOptions="[25,50,100]" responsiveLayout="scroll"
            currentPageReportTemplate="Showing {first} to {last} of total {totalRecords} trips"
            :globalFilterFields="['userFullName','from','to','companyName','cargoName','comments' ]"
            selectionMode="single"
            @rowSelect="onRowSelect"
            @rowClick="onRowClick"
            
                        :loading="loading1"
            scrollable 
            :scrollHeight="tableHeight"
            >
   


              <template #header >
                    
                    <div style="display:none" class="flex justify-content-between">
                        <!-- <Button type="button" icon="pi pi-filter-slash" label="Clear" class="p-button-outlined" @click="clearFilter1()"/>  -->
                        <span class="p-input-icon-left" id="searchBox">
                            <i class="pi pi-search" />
                            <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                        </span>
                    </div>



                    <div class="row">
                      <div class="col-md-4">
                        <Button style="min-width:120px" v-tooltip.bottom="{ value: 'New trip', showDelay: 1000, hideDelay: 300 }" type="button" icon="pi pi-pencil" class="p-button-text" id="newTripButton" @click="newTrip" label="New trip"/>
                        &nbsp;
                        <Button style="min-width:120px" v-tooltip.bottom="{ value: 'Download report', showDelay: 1000, hideDelay: 300 }" type="button" icon="pi pi-download" class="p-button-text" id="downloadReport" @click="downloadReport" label="Download Report"/>
                        &nbsp;
                        <Button v-if="showInvoiceSelectedButton && userType=='ADMIN'" style="min-width:120px" v-tooltip.bottom="{ value: 'Invoice selected', showDelay: 1000, hideDelay: 300 }" type="button" icon="pi pi-check-circle" class="p-button-text" id="invoiceSelected" @click="invoiceSelected" label="Invoice selected"/>
                    
                    
                      </div>
                        
                      <div class="col-md-8 text-end">
                          <Calendar style="width:160px" v-tooltip.bottom="{ value: 'Date from', showDelay: 1000, hideDelay: 300 }" id="fromDateBox" class="dateDisplayInput" v-model="fromDate" showIcon dateFormat="dd/mm/yy" placeholder="dd/mm/yy" mask="99/99/9999" @change="changeDate('from')"/>
                          <Calendar style="width:160px" v-tooltip.bottom="{ value: 'Date to', showDelay: 1000, hideDelay: 300 }" id="toDateBox" class="dateDisplayInput" v-model="toDate" showIcon dateFormat="dd/mm/yy" placeholder="dd/mm/yy" mask="99/99/9999" @change="changeDate('to')"/>
                          <Button type="button" icon="pi pi-refresh" class="p-button-text" id="refreshButton" @click="refreshData" />
                        </div>
                    </div>

                </template>
           
           <template #empty>
                    
           </template>
           <template #loading>
                    Loading data. Please wait...
           </template>

 <Column  field="invSent" header="Invoiced"  dataType="boolean" style="max-width:100px;min-height:43px;" bodyStyle="width:120px">
        
        <template #body="{ data }">
           <div style="padding-left:16px;width:100%" class="checkbox" :data="data.id">
                <i v-if="data.invSent=='Yes'" class="pi pi-check"></i>
                <Checkbox @click="selectingForInvoice(data.id)" v-if="data.invSent=='No' && userType=='ADMIN'" v-model="checkedIDs[data.id]" :binary="true" :inputId="data.id" />
               
           </div>
          
        </template>
        <template #filter="{filterModel}">
            <Dropdown :options="['Yes','No']" v-model="filterModel.value" class="p-column-filter" :placeholder="`Invoiced`"/>
        </template>
      
    </Column>      




      <Column field="date" header="Date" dataType="date" :sortable="true" style="min-width: 10rem;min-height:43px;">
       <template #body="{ data }">
            <InputText  style="display: none;" type="text"   class="p-column-filter" :placeholder="`Date`"/>
            <span style="display: none;" class="hiddenFields" :data=data.id></span> <!-- this is only that I have something to indetify which row is clicked :) -->
            {{ data.date }}
        </template>
        
    </Column>

    <!-- <Column header="date" :sortable="true" style="min-width: 10rem">
        <template #body="{ data }">
          <div style="display:none">{{ format_date(data.date,'YYYY-MM-DD hh:mm:ss')}}></div> {{ format_date(data.date,'DD/MM/YYYY hh:mm:ss')}}
        </template>
      
    </Column> -->

    <Column field="from" header="From" :sortable="true"  bodyStyle="text-align: left" style=";min-height:43px;">
           
      <template #filter="{filterModel}">
         
          <InputText  type="text" v-model="filterModel.value" class="p-column-filter" :placeholder="`From`"/>
          

        </template>
    </Column>

    <Column field="to" header="To" :sortable="true" bodyStyle="text-align: left" style=";min-height:43px;">
    <template #filter="{filterModel}">
            <InputText  type="text" v-model="filterModel.value" class="p-column-filter" :placeholder="`To`"/>
        </template>
    </Column>

    <Column field="cargoName" header="Cargo&nbsp;Name" style="min-width: 250px;min-height:43px" :sortable="true">
        <template #filter="{filterModel}">
            <InputText  type="text" v-model="filterModel.value"  class="p-column-filter" :placeholder="`Cargo Name`"/>
        </template>

        <template #body="{ data }">
          <div style="display:inline-block;width:85%;padding-right:50px">{{data.cargoName}}
             
          </div>
          <div  style="fdisplay:inline-block;display:block;width:15%" v-if="data.files != ''"><i class="fa fa-camera"></i></div>

        </template>


    </Column>
    <Column field="companyName" header="Company" :sortable="true" bodyStyle="text-align: left"  style=";min-height:43px;">
    <template #filter="{filterModel}">
          <!--<InputText v-model="filterModel.value" :options="allCompanies" filter optionLabel="name" placeholder="Select Company"></InputText>-->
          <Dropdown v-model="filterModel.value" :options="allCompanies" filter optionLabel="name" optionValue="name" placeholder="Select Company"></Dropdown>
        </template>
    </Column>


      
      <Column field="userFullName" header="Driver" :sortable="true" :filterMatchModeOptions="matchModes"  style=";min-height:43px;">
        <template #filter="{filterModel}">
            <InputText  type="text" v-model="filterModel.value" class="p-column-filter" :placeholder="`Driver`"/>
        </template>
       
    </Column>

    <Column field="fixedCosts" header="Fixed&nbsp;Costs" :sortable="true"  style="text-align:right;min-height:43px;">
    
       <template #body="{ data }"> <!-- formatMoney(number, decPlaces, decSep, thouSep, symbol) {-->
          <div class="text-end" style="display:block;width:100%;padding-right:40px">{{ formatMoney(data.fixedCosts,2,'.',',','€') }}</div>
        </template>
    
      <template #filter="{filterModel}">
            <InputText  type="text" v-model="filterModel.value"  class="p-column-filter" :placeholder="`Fixed Costs`"/>
        </template>
    </Column> 
    
    <Column field="distance" header="Distance" :sortable="true"  style=";min-height:43px;">
    
       <template #body="{ data }">
          <div class="text-center" style="display:block;width:100%">{{ data.distance }}</div>
        </template>

      <template #filter="{filterModel}">
            <InputText  type="text" v-model="filterModel.value"  class="p-column-filter" :placeholder="`Distance`"/>
        </template>
    </Column> 
    
    <Column field="distanceCosts" header="Distance&nbsp;Costs" :sortable="true"  style="text-align:right;min-height:43px;">

      <template #body="{ data }">
          <div class="text-end" style="display:block;width:100%;padding-right:40px">{{ formatMoney(data.distanceCosts,2,'.',',','€') }} </div>
        </template>
        
    <template #filter="{filterModel}">
            <InputText  type="text" v-model="filterModel.value"  class="p-column-filter" :placeholder="`Distance Costs`"/>
        </template>
    </Column>


    <Column field="sum" header="Sum" :sortable="true" style="text-align:right;max-width:120px;min-height:43px;">
        <template #body="{ data }"  >
          <div class="text-end" style="display:block;width:100%;padding-right:40px">{{ formatMoney(data.sum,2,'.',',','€') }}</div>
        </template>
        
        <template #filter="{filterModel}">
            <InputText  type="text" v-model="filterModel.value"  class="p-column-filter" :placeholder="`Sum`"/>
        </template>
    </Column>

   <!-- <Column field="sumVAT" header="Sum&nbsp;VAT" :sortable="true" >
        <template #body="{ data }">
          <div class="text-center" style="display:block;width:100%">{{ data.sumVAT }}</div>
        </template>

        <template #filter="{filterModel}">
                <InputText  type="text" v-model="filterModel.value"  class="p-column-filter" :placeholder="`sumVAT`"/>
            </template>
        </Column>
   -->
    
  <!-- 
   <Column field="comments" header="comments" :sortable="true">
    <template #filter="{filterModel}">
            <InputText  type="text" v-model="filterModel.value"  class="p-column-filter" :placeholder="`comments`"/>
        </template>
    </Column>
 -->
 
 
    <Column  v-if="userType=='ADMIN' " style="text-align: right;display:table-cell;max-width:90px;min-height:43px;vertical-align: middle;" class="actionsColumns">
        <template #header >
          <div style="right: 20px;  position: absolute;">
            <div style="float:right">Actions</div>
          </div>
        </template>
        <template #body="{data}">
          
          <div class="actionButtonsHolderTable">
           
            <div  v-if="data.invSent=='No'" class="fa-stack fa-2x actionIcons" style="font-size:15px"  v-tooltip.bottom="{ value: 'Edit trip', showDelay: 1000, hideDelay: 300 }"  @click="editClick">
              <i class="fa-solid fa-square fa-stack-2x"></i>
              <i class="fa-stack-1x fa-solid fa-pen-to-square" style="color: white"></i>
            </div>
            
           
            <div  v-if="data.invSent=='No'" class="fa-stack fa-2x actionIcons" style="font-size:15px;color:#aa0000" v-tooltip.left="{ value: 'Delete trip', showDelay: 1000, hideDelay: 300 }" @click="deleteClick">
              <i class="fa-solid fa-square fa-stack-2x"></i>
              <i class="fa-stack-1x fa-solid fa-trash-can" style="color: white"></i>
            </div>

          </div>
        
        </template>

    </Column>


    <template #paginatorstart>
    
    </template>         
    <template #paginatorend>
      
    </template>  
    

   


</DataTable>
</div>


<div id="RightSidepanel" class="RightSidepanel" :class="panelClass">
			
		
			
        <div class="row">
          <div class="col-md-12 text-end">
            <i class="pi pi-times cursorHand closePanelButton" @click="closePanel"></i>
          </div>
        </div>

        
        <div class="row">
          <div class="col text-center">
            <h5 id="detailsHeadline">{{ tripCargoName }}</h5>
          </div>
        </div>	
        
       
          <div class="text-end" id="editIconsPanel"> 

            <div v-if="userType=='ADMIN'" class="invoiceButtonHolder">

              <Button v-if="editTripInvoiced=='Yes'" @click="displayUnInvoiceConfirm=true" label="Remove Invoiced mark" icon="pi pi-times-circle" class="invoiceButton redButton"></Button>
              <Button v-if="editTripInvoiced=='No'"  @click="setInvoiceDateToday" label="Mark as Invoiced" icon="pi pi-check-circle" class="invoiceButton"></Button>
           
            </div>

      <div class="actionButtonsHolder">

            <div  class="fa-stack fa-2x actionIcons" style="font-size:15px" v-tooltip.bottom="{ value: 'Download', showDelay: 1000, hideDelay: 300 }" @click="downloadClick">
              
                <i class="fa-solid fa-square fa-stack-2x"></i>
                <i class="fa-stack-1x fa-solid fa-download" style="color: white"></i>
           
            </div>

            <div  v-if="userType=='ADMIN' && editTripInvoiced=='No'" class="fa-stack fa-2x actionIcons" style="font-size:15px" v-tooltip.bottom="{ value: 'Edit trip', showDelay: 1000, hideDelay: 300 }" @click="editClick">
           
                <i class="fa-solid fa-square fa-stack-2x"></i>
                <i class="fa-stack-1x fa-solid fa-pen-to-square" style="color: white"></i>
             
            </div>
            
           
            <div   v-if="userType=='ADMIN' && editTripInvoiced=='No'" class="fa-stack fa-2x actionIcons" style="font-size:15px;color:#aa0000" v-tooltip.left="{ value: 'Delete trip', showDelay: 1000, hideDelay: 300 }"  @click="deleteClick">
              
                <i class="fa-solid fa-square fa-stack-2x"></i>
                <i class="fa-stack-1x fa-solid fa-trash-can" style="color: white"></i>
             
            </div>

      </div>

            
          </div>
       
            
        <div class="row" style="">
          <div class="col text-center" style="padding:19px">
           
            <TabView v-model:activeIndex="activeTab">    
              <TabPanel header="Details">

            <table class="table table-striped table-sm" id="detailsTable">
             
             <tbody>
              <tr>
                <td style="width:160px">Date</td>
                <td>{{ tripDate }}</td>
              </tr>

              <tr>
                <td>From</td>
                <td>{{ tripFrom }}</td>
              </tr>

              <tr>
                <td>To</td>
                <td>{{ tripTo }}</td>
              </tr>

              <tr>
                <td>Cargo Name</td>
                <td>{{ tripCargoName }}</td>
              </tr>
              
              <tr>
                <td>Fixed Costs</td>
                <td>{{ formatMoney(tripFixedCosts,2,'.',',','€') }}</td>
              </tr>
              <tr>
                <td>Distance</td>
                <td>{{ tripDistance }}</td>
              </tr>

              <tr>
                <td>Distance Costs</td>
                <td>{{ formatMoney(tripDistanceCosts,2,'.',',','€') }}</td>
              </tr>

              <tr>
                <td>Sum</td>
                <td>{{ formatMoney(tripSum,2,'.',',','€') }} </td>
              </tr>

              <tr>
                <td>Sum VAT</td>
                <td>{{ formatMoney(tripSumVAT,2,'.',',','€') }} </td>
              </tr>


              <tr>
                <td>Full Name</td>
                <td>{{ tripUserFullName }}</td>
              </tr>

              <tr>
                <td>Email</td>
                <td>{{ tripUserEmail }}</td>
              </tr>

             
              <tr>
                <td>Company Name</td>
                <td>{{ tripCompanyName }}</td>
              </tr>

             
              <tr>
                <td>Vat %</td>
                <td>{{ tripVatPercentage }}</td>
              </tr>

             

              <tr>
                <td>Comments</td>
                <td><textarea rows="5" v-text="tripComments" style="width:100%" readonly></textarea></td>
              </tr>
            </tbody>
            

           </table>

           <div class="row">
                <div class="col text-end" style="padding:0">
                  <Button  @click="openDialogAddPhoto" style="min-width:120px" v-tooltip.bottom="{ value: 'Add photo', showDelay: 1000, hideDelay: 300 }"  type="button" class="p-button-text addphotobutton" label="Add photo"/>
                </div>
             </div>
          
          </TabPanel>
          
          <TabPanel header="Pictures"  v-if="picturesTabShow">
              <SwiperCarousel :tripImages="tripImages" @showloader="showloader" :openedcargoname="openedcargoname" @swiper="onSwiper" @deletePhoto="deletePhotoId"  @deletePhotomodal="deletePhotoModal" :userType="userType"/>
             
             <div class="row" style="margin-top:12px">
                <div class="col text-end" style="padding:0">
                  <Button  @click="openDialogAddPhoto" style="min-width:120px" v-tooltip.bottom="{ value: 'Add photo', showDelay: 1000, hideDelay: 300 }"  type="button" class="p-button-text addphotobutton" label="Add photo"/>
                </div>
             </div>
              
          </TabPanel>


        </TabView>


          </div>
        </div>


         <!-- zoomed image Dialog-->
        <Dialog modal v-model:visible="visibleImagesModal" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
          <SwiperCarousel :tripImages="tripImages"  @deletePhotomodal="deletePhotoModal"/>
        </Dialog>
        
       
  
       
				
</div>	


 <!-- insert new trip Dialog-->
 <Dialog @update:visible="handleClose" v-model:visible="newTripDialog" modal  :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
         
        <template #header>
          Enter new trip
        </template> 
        
        <div class="container" id="formContainer">
          
          <div class="row insertFormRow align-items-center   even">
            <div class="col-md-3"><label for="newTripDate">Date *</label></div>
            <div class="col-md-9"><Calendar  hourFormat="24" showTime @change="changeDate('from')" style="margin-left:0" id="newTripDate" class="dateDisplayInput" v-model="newTripDate" showIcon dateFormat="dd/mm/yy" placeholder="dd/mm/yy" mask="99/99/9999"/>
            
              <InlineMessage v-if="!newTripDateOK">This field is required</InlineMessage>
            </div>
          </div>

          <div class="row insertFormRow align-items-center   ">
            <div class="col-md-3"><label for="newTripCompanyName">Company Name *</label></div>
            <div class="col-md-9">
             <!-- <InputText  @input="newTripCompanyNameOK=true" id="newTripCompanyName" v-model="newTripCompanyName"  size="small"/>-->

              <Dropdown v-model="newTripCompanyName" :options="allCompanies" filter optionLabel="name" placeholder="Select Company"></Dropdown>

            <InlineMessage v-if="!newTripCompanyNameOK">This field is required</InlineMessage></div>
          </div>

          <div class="row insertFormRow align-items-center   even">
            <div class="col-md-3"><label for="newTripFrom">From *</label></div>
            <div class="col-md-9"><InputText @input="newTripFromOK=true" id="newTripFrom" v-model="newTripFrom"  size="small"/>
            <InlineMessage v-if="!newTripFromOK">This field is required</InlineMessage></div>
          </div>

          <div class="row insertFormRow align-items-center   ">
            <div class="col-md-3"><label for="username">To *</label></div>
            <div class="col-md-9"><InputText @input="newTripToOK=true"  id="newTripTo" v-model="newTripTo" size="small" />
            <InlineMessage v-if="!newTripToOK">This field is required</InlineMessage></div>
          </div>

          <div class="row insertFormRow align-items-center   even">
            <div class="col-md-3"><label for="newTripCargoName">Cargo Name *</label></div>
            <div class="col-md-9"><InputText  @input="newTripCargoNameOK=true" id="newTripCargoName" v-model="newTripCargoName" size="small"/>
            <InlineMessage v-if="!newTripCargoNameOK">This field is required</InlineMessage></div>
          </div>

          <div class="row insertFormRow align-items-center   ">
            <div class="col-md-3"><label for="newTripFixedCosts">Costs *</label></div>
            <div class="col-md-9"><InputNumber   @input="newTripFixedCostsOK=true" id="newTripFixedCosts" v-model="newTripFixedCosts" size="small" />
            <InlineMessage v-if="!newTripFixedCostsOK">This field is required</InlineMessage></div>
          </div>

          <div class="row insertFormRow align-items-center   even">
            <div class="col-md-3"><label for="newTripDistance">Distance</label></div>
            <div class="col-md-9"><InputNumber  @input="newTripDistanceOK=true" id="newTripDistance" v-model="newTripDistance" size="small" />
            <InlineMessage v-if="!newTripDistanceOK">This field is required</InlineMessage></div>
          </div>
        
          <div class="row insertFormRow align-items-center   " style="display:none">
            <div class="col-md-3"><label for="newTripDistanceCosts">Distance Costs</label></div>
            <div class="col-md-9"><InputNumber  @input="newTripDistanceCostsOK=true" id="newTripDistanceCosts" v-model="newTripDistanceCosts"  size="small"/>
            <InlineMessage v-if="!newTripDistanceCostsOK">This field is required</InlineMessage></div>
          </div>

         
         

          <div class="row insertFormRow align-items-center   ">
            <div class="col-md-3"><label for="newTripComments">Comments</label></div>
            <div class="col-md-9"><textarea @input="newTripCommentsOK=true" rows="5" id="newTripComments" v-model="newTripComments" style="width:100%" ></textarea>
            <InlineMessage v-if="!newTripCommentsOK">This field is required</InlineMessage></div>
          </div>

          <div class="row insertFormRow align-items-center   ">
            <div class="col-md-6 text-left">
              <Button @click="closeInsertDialog" style="min-width:120px" v-tooltip.bottom="{ value: 'Cancel', showDelay: 1000, hideDelay: 300 }"  icon="pi pi-times-circle" type="button" class="p-button-text redButton" label="Cancel"/>
           
            </div>
            <div class="col-md-6 text-end">
              <Button style="min-width:120px" v-tooltip.bottom="{ value: 'Save trip', showDelay: 1000, hideDelay: 300 }"  type="button" icon="pi pi-pencil" class="p-button-text" @click="saveTrip" label="Save trip"/>
             </div>
          </div>
        
        </div>
          


      </Dialog> 

<!-- Edit trip Dialog-->
<Dialog @update:visible="handleClose" v-model:visible="editTripDialog" modal  :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
         
         <template #header>
           Edit trip
         </template> 
         
         <div class="container" id="formContainer">
           
           <div class="row insertFormRow align-items-center   even">
             <div class="col-md-3"><label for="editTripDate">Date</label></div>
             <div class="col-md-9">
              
              <Calendar hourFormat="24" :value="editTripDate" v-model="editTripDate" showTime @change="changeDate('from')" style="margin-left:0" id="editTripDate" class="dateDisplayInput"  showIcon dateFormat="dd/mm/yy" placeholder="dd/mm/yy" mask="99/99/9999 00:00:00"/>
             
               <InlineMessage v-if="!editTripDateOK">This field is required</InlineMessage>
             </div>
           </div>
 
           <div class="row insertFormRow align-items-center   ">
             <div class="col-md-3"><label for="editTripCompanyName">Company Name *</label></div>
             <div class="col-md-9">
              <!--<InputText  @input="editTripCompanyNameOK=true" id="editTripCompanyName" v-model="editTripCompanyName"  size="small"/>-->
              <Dropdown v-model="editTripCompanyName" :options="allCompanies" filter optionLabel="name" :placeholder="editTripCompanyName"></Dropdown>
             <InlineMessage v-if="!editTripCompanyNameOK">This field is required</InlineMessage></div>
           </div>


           <div class="row insertFormRow align-items-center   even">
             <div class="col-md-3"><label for="editTripFrom">From *</label></div>
             <div class="col-md-9"><InputText @input="editTripFromOK=true" id="editTripFrom" v-model="editTripFrom"  size="small"/>
             <InlineMessage v-if="!editTripFromOK">This field is required</InlineMessage></div>
           </div>
 
           <div class="row insertFormRow align-items-center   ">
             <div class="col-md-3"><label for="username">To *</label></div>
             <div class="col-md-9"><InputText @input="editTripToOK=true"  id="editTripTo" v-model="editTripTo" size="small" />
             <InlineMessage v-if="!editTripToOK">This field is required</InlineMessage></div>
           </div>
 
           <div class="row insertFormRow align-items-center   even">
             <div class="col-md-3"><label for="editTripCargoName">Cargo Name *</label></div>
             <div class="col-md-9"><InputText  @input="editTripCargoNameOK=true" id="editTripCargoName" v-model="editTripCargoName" size="small"/>
             <InlineMessage v-if="!editTripCargoNameOK">This field is required</InlineMessage></div>
           </div>
 
           <div class="row insertFormRow align-items-center   ">
             <div class="col-md-3"><label for="editTripFixedCosts">Costs *</label></div>
             <div class="col-md-9"><InputNumber   @input="editTripFixedCostsOK=true" id="editTripFixedCosts" v-model="editTripFixedCosts" size="small" />
             <InlineMessage v-if="!editTripFixedCostsOK">This field is required</InlineMessage></div>
           </div>
 
           <div class="row insertFormRow align-items-center   even">
             <div class="col-md-3"><label for="editTripDistance">Distance</label></div>
             <div class="col-md-9"><InputNumber  @input="editTripDistanceOK=true" id="editTripDistance" v-model="editTripDistance" size="small" />
             <InlineMessage v-if="!editTripDistanceOK">This field is required</InlineMessage></div>
           </div>
         
           <div class="row insertFormRow align-items-center   " style="display:none">
             <div class="col-md-3"><label for="editTripDistanceCosts">Distance Costs</label></div>
             <div class="col-md-9"><InputNumber  @input="editTripDistanceCostsOK=true" id="editTripDistanceCosts" v-model="editTripDistanceCosts"  size="small"/>
             <InlineMessage v-if="!editTripDistanceCostsOK">This field is required</InlineMessage></div>
           </div>
 
          
          
 
           <div class="row insertFormRow align-items-center   ">
             <div class="col-md-3"><label for="editTripComments">Comments</label></div>
             <div class="col-md-9"><textarea @input="editTripCommentsOK=true" rows="5" id="editTripComments" v-model="editTripComments" style="width:100%" ></textarea>
             <InlineMessage v-if="!editTripCommentsOK">This field is required</InlineMessage></div>
           </div>
 
           <div class="row insertFormRow align-items-center   ">
             <div class="col-md-6 text-left">
               <Button @click="closeEditDialog" style="min-width:120px" v-tooltip.bottom="{ value: 'Cancel', showDelay: 1000, hideDelay: 300 }"   icon="pi pi-times-circle" type="button" class="p-button-text redButton" label="Cancel"/>
            
             </div>
             <div class="col-md-6 text-end">
               <Button style="min-width:120px" v-tooltip.bottom="{ value: 'Save changes', showDelay: 1000, hideDelay: 300 }"  type="button" icon="pi pi-pencil" class="p-button-text" @click="editTrip" label="Save changes"/>
              </div>
           </div>
         
         </div>
           
 
 
       </Dialog> 


 <!-- dialog info --> 
 <Dialog v-model:visible="displayInfoDialog" modal  :style="{ width: '20rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <template #header=""> 
        <h4> {{ InfoModalHeader }}</h4>
    </template>
  
            <span class="font-bold text-2xl block mb-2 mt-4"></span>
            <p class="mb-0">{{InfoModalMessage }}</p>
            <div class="flex text-end gap-2 mt-4">
                <Button label="Ok" @click="closeInfo"></Button>
              
            </div>          
</Dialog>

 <!-- dialog confirm Delete --> 
 <Dialog v-model:visible="displayDeleteConfirm" modal  :style="{ width: '30rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <template #header=""> 
        <h4> Please confirm</h4>
    </template>
  
            <span class="font-bold text-2xl block mb-2 mt-4"></span>
            <p class="mb-0">Are you sure that you want to delete trip <strong>'{{ editTripCargoName }}'</strong>?</p>
          
          <div class="row" style="margin-top:30px">
              <div class="col-md-6 text-start">
                  <Button class="redButton" label="Cancel" @click="displayDeleteConfirm=false"></Button>
              </div>
              <div class="col-md-6 text-end">
                  <Button label="Yes, delete" @click="deleteTrip"></Button>
            </div>   
          </div>
          
</Dialog>



<!-- dialog confirm UNinvoice --> 
<Dialog v-model:visible="displayUnInvoiceConfirm" modal  :style="{ width: '30rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <template #header=""> 
        <h4> Please confirm</h4>
    </template>
  
            <span class="font-bold text-2xl block mb-2 mt-4"></span>
            <p class="mb-0">Are you sure that you want to remove mark 'Invoiced'<br> for trip <strong>'{{ editTripCargoName }}'</strong>?</p>
          
          <div class="row" style="margin-top:30px">
              <div class="col-md-6 text-start">
                  <Button class="redButton" label="Cancel" @click="displayInvoiceConfirm=false"></Button>
              </div>
              <div class="col-md-6 text-end">
                  <Button label="Yes, remove it" @click="unInvoiceThisTrip"></Button>
            </div>   
          </div>
          
</Dialog>


<!-- Send Invoice Dialog-->
<Dialog @update:visible="handleClose" v-model:visible="sendInvoiceDialog" modal  :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
         
         <template #header>
           Mark this trip as Invoiced
         </template> 
         
         <div class="container" id="formContainer">
           
           <div class="row insertFormRow align-items-center   even">
             <div class="col-md-3"><label for="invoiceDate">Invoice Date *</label></div>
             <div class="col-md-9"><Calendar  hourFormat="24" showTime @change="changeDate('from')" style="margin-left:0" id="invoiceDate" class="dateDisplayInput" v-model="invoiceDate" showIcon dateFormat="dd/mm/yy" placeholder="dd/mm/yy" mask="99/99/9999"/>
             
               <InlineMessage v-if="!invoiceDateOK">This field is required</InlineMessage>
             </div>
           </div>
 
          
 
 
 
           <div class="row insertFormRow align-items-center   ">
             <div class="col-md-6 text-left">
               <Button @click="sendInvoiceDialog=false" style="min-width:120px" v-tooltip.bottom="{ value: 'Cancel', showDelay: 1000, hideDelay: 300 }"   icon="pi pi-times-circle" type="button" class="p-button-text redButton" label="Cancel"/>
            
             </div>
             <div class="col-md-6 text-end">
               <Button style="min-width:120px" v-tooltip.bottom="{ value: 'Mark as Invoiced', showDelay: 1000, hideDelay: 300 }"  type="button" icon="pi pi-check-circle" class="p-button-text" @click="invoiceThisTrip" label="Mark as Invoiced"/>
              </div>
           </div>
         
         </div>
           
 
 
       </Dialog> 

<!-- Send Multiple Invoice Dialog-->
<Dialog @update:visible="handleClose" v-model:visible="sendMultipleInvoiceDialog" modal header="header" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
         
         <template #header>

            <span v-if="selectedIDsForInvoicing.length == 1">Mark selected trip as Invoiced</span>
            <span v-if="selectedIDsForInvoicing.length > 1">Mark selected <span style="font-weight:bold">{{ selectedIDsForInvoicing.length }} trips </span> as Invoiced</span>
          
         </template> 


         
         <div class="container" id="formContainer">
           
           <div class="row insertFormRow align-items-center   even">
             <div class="col-md-3"><label for="invoiceDate">Invoice Date *</label></div>
             <div class="col-md-9"><Calendar  hourFormat="24" showTime @change="changeDate('from')" style="margin-left:0" id="invoiceMultipleDate" class="dateDisplayInput" v-model="invoiceDate" showIcon dateFormat="dd/mm/yy" placeholder="dd/mm/yy" mask="99/99/9999"/>
             
               <InlineMessage v-if="!invoiceDateOK">This field is required</InlineMessage>
             </div>
           </div>
 
          
 
 
 
           <div class="row insertFormRow align-items-center   ">
             <div class="col-md-6 text-left">
               <Button @click="sendMultipleInvoiceDialog=false" style="min-width:120px" v-tooltip.bottom="{ value: 'Cancel', showDelay: 1000, hideDelay: 300 }"   icon="pi pi-times-circle" type="button" class="p-button-text redButton" label="Cancel"/>
            
             </div>
             <div class="col-md-6 text-end">
               <Button style="min-width:120px" v-tooltip.bottom="{ value: 'Mark as Invoiced', showDelay: 1000, hideDelay: 300 }"  type="button" icon="pi pi-check-circle" class="p-button-text" @click="invoiceMultipleTrips" label="Mark as Invoiced"/>
              </div>
           </div>
         
         </div>
           
 
 
       </Dialog> 



 <!-- dialog confirm Delete Photo --> 
 <Dialog v-model:visible="displayDeletePhotoConfirm" modal  :style="{ width: '30rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <template #header=""> 
        <h4> Please confirm</h4>
    </template>
  
            <span class="font-bold text-2xl block mb-2 mt-4"></span>
            <p class="mb-0">Are you sure that you want to delete this photo?</p>
          
          <div class="row" style="margin-top:30px">
              <div class="col-md-6 text-start">
                  <Button class="redButton" label="Cancel" @click="displayDeletePhotoConfirm=false"></Button>
              </div>
              <div class="col-md-6 text-end">
                  <Button label="Yes, delete" @click="deletePhoto"></Button>
            </div>   
          </div>
           
</Dialog>


<!-- dialog upload photo --> 
<Dialog v-model:visible="displayUploadModal" modal  :style="{ width: '60rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <template #header=""> 
        <h4> Upload photo</h4>
    </template>
  
         <div class="row" style="margin-top:30px">
              <div class="col">
               
                <FileUpload name="files[]" :customUpload="true" url="/api/upload" @uploader="customUploader($event)" :multiple="false" accept="image/*" :maxFileSize="10000000">
                  <template #empty>
                      <p>Drag and drop files to here to upload.</p>
                  </template>
                </FileUpload>

              </div>
              
        </div>   
         
          
      
           
</Dialog>

<div id="div-context-menu"  class="cls-context-menu" style="left: 11px; top: 13px; display: none">
       <ul>
        
          <ul>
            <li v-if="!AllPageMarked && !AllMarked"><a @click="SelectAllPage('select')">Select all records on current page</a></li>
            <li v-if="!AllPageMarked && !AllMarked"><a @click="SelectAll('select')" >Select all on all pages</a></li>
           
            <li v-if="AllMarked || AllPageMarked"><a @click="SelectAll('deselect')" >Deselect All </a></li>

          </ul>
       
       </ul>
     </div>


</template>

<script>
// Primevue datatable help: https://www.primefaces.org/primevue/datatable //

import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import Dialog from 'primevue/dialog';
import InlineMessage from 'primevue/inlinemessage';
import InputNumber from 'primevue/inputnumber';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Dropdown from 'primevue/dropdown';
import FileUpload from 'primevue/fileupload';
import Checkbox from 'primevue/checkbox';

import axios from "axios";
import $ from "jquery";

import {FilterMatchMode,FilterOperator} from 'primevue/api';         // for filtering

import moment from "moment";




export default {
  props: ["systemId"],
  components: {
    InputText,Button,
    DataTable,
    Column,
    Calendar,
    Dialog,
    TabView,
    TabPanel,
    InlineMessage,
    InputNumber,
    Dropdown,
    FileUpload,
    Checkbox
  },
 emits:['extend-session','showSearchbar'],

  data() {
    return {
      howManyTrips:'',
      AllPageMarked:false,
      AllMarked:false,
      sendMultipleInvoiceDialog:false,
      showInvoiceSelectedButton:false,
      selectedIDsForInvoicing:[],
      checkedIDs:[],
      invoiceDate:'',
      invoiceDateOK:true,
      sendInvoiceDialog:false,
      displayUnInvoiceConfirm:false,
      dataTable:'dataTable',
      downloadedReport:'',
      binaryfile:'',
      photoIdForDelete:'',
      displayDeletePhotoConfirm:false,
      uploadFIlename:'',
      displayUploadModal:false,
      allCompanies:[],
      ClickedRowId:'',
      tableHeight:'calc( 100vh - 215px)',
      displayDeleteConfirm:false,
      deletingTripName:'',
         newTripDialog:false,
         editTripDialog:false,
          isLoading: true,
          userType : '',
          userLocale:'',
          loading1: true,
          loading2: true,
          filters1: null,
          visibleImagesModal:false,
          tripImages: [],
          picturesTabShow:false,
          activeTab:0,
          tripDate: '',
          tripUserEmail: '',
          tripFrom: '',
          tripTo: '',
          tripFixedCosts: '',
          tripCargoName: '',
          tripDistance: '',
          tripDistanceCosts: '',
          tripVatPercentage: '',
          tripSum: '',
          tripSumVAT: '',
          tripCompanyName: '',
          tripComments: '',
          tripCreated: '',
          tripUserFullName: '',
          openedcargoname :'',

          displayInfoDialog:false,
          InfoModalHeader:'',
          InfoModalMessage:'',

          newTripDate:'',
          newTripFrom:'',
          newTripTo:'',
          newTripCargoName:'',
          newTripFixedCosts:'0',
          newTripDistance:'0',
          newTripDistanceCosts:'0',
          newTripCompanyName:'',
          newTripComments:'',

          newTripDateOK:true,
          newTripFromOK:true,
          newTripToOK:true,
          newTripCargoNameOK:true,
          newTripFixedCostsOK:true,
          newTripDistanceOK:true,
          newTripDistanceCostsOK:true,
          newTripCompanyNameOK:true,
          newTripCommentsOK:true,

          editTripDate:'',
          editTripFrom:'',
          editTripTo:'',
          editTripCargoName:'',
          editTripFixedCosts:'0',
          editTripDistance:'0',
          editTripDistanceCosts:'0',
          editTripCompanyName:'',
          editTripComments:'',

          editTripDateOK:true,
          editTripFromOK:true,
          editTripToOK:true,
          editTripCargoNameOK:true,
          editTripFixedCostsOK:true,
          editTripDistanceOK:true,
          editTripDistanceCostsOK:true,
          editTripCompanyNameOK:true,
          editTripCommentsOK:true,
                    editTripInvoiced:'',

          panelClass:'closedPanel',
          filters: {
               'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
               'userFullName':{operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]}, 
               'from': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]}, 
               'to': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]}, 
               'companyName': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]}, 
               'cargoName': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]}, 
               'distance': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
               'sumVAT': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
               'comments': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
               'date': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
               'fixedCosts': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
               'distanceCosts': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
               'sum': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
               'invSent': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STRING}]},
            },

      aSystemDoc: "",
    matchModes: [
        {label: 'Starts With', value: FilterMatchMode.STARTS_WITH},
        {label: 'Contains', value: FilterMatchMode.CONTAINS},
    ],
      allTrips: [],

      fromDate:'',
      toDate:''
    };
  },
  methods: {

    selectingForInvoice(clickedID){
     
           
        if(!this.checkedIDs[clickedID]){
                this.selectedIDsForInvoicing.push(clickedID);
        }else{
          
          const index = this.selectedIDsForInvoicing.indexOf(clickedID);
          this.selectedIDsForInvoicing.splice(index, 1);     
        
        }

      
        if( this.selectedIDsForInvoicing.length > 0){
            this.showInvoiceSelectedButton=true;
        }else{
            this.showInvoiceSelectedButton=false;
            this.AllPageMarked = false;
        }

      
                 
                  
              

    },

     invoiceSelected(){
      this.invoiceDate =  moment().format('DD/MM/YYYY HH:mm');

     /*var addText = '';
      if (this.selectedIDsForInvoicing.length == 1){
        addText = 'Mark selected trip as Invoiced';
      }else{
        addText = ''+this.selectedIDsForInvoicing.length+'</strong> trips as Invoiced';
      }
      this.howManyTrips = addText;*/

       this.sendMultipleInvoiceDialog = true;
     },
      
   

    reorganizePagination(){
      $(".p-paginator-current").detach().appendTo('.p-paginator-left-content');
      $(".p-paginator-rpp-options").detach().appendTo('.p-paginator-right-content');
    },
    
    moveSearchBoxToTop(){
        //default search box is inside header of the datatable, must move to the top of the page
        $('#hereMoveSearch').empty();
        $("#searchBox").detach().appendTo('#hereMoveSearch');
    },

    newTrip(){
      this.resetInputFields();
      this.newTripDate = this.format_date(moment(),'DD/MM/YYYY HH:mm');
      
     
      //show dialog for insert
      this.newTripDialog = true
      
    },
    editTrip(){

      
       var AllOk = true;

     
      if(this.editTripDate == ''){
        this.editTripDateOK = false;
        AllOk = false;
      }else{this.editTripDateOK = true;}

      if(this.editTripFrom == ''){
        this.editTripFromOK = false;
        AllOk = false;
      }else{this.editTripFromOK = true;}

      if(this.editTripTo == ''){
        this.editTripToOK = false;
        AllOk = false;
      }else{this.editTripToOK = true;}

      if(this.editTripCargoName == ''){
        this.editTripCargoNameOK = false;
        AllOk = false;
      }else{this.editTripCargoNameOK = true;}

      if(this.editTripFixedCosts== null){
        this.editTripFixedCostsOK = false;
        AllOk = false;
      }else{this.editTripFixedCostsOK = true;}

      if(this.editTripDistance == null){
        this.editTripDistance='0'
     }

      if(this.editTripDistanceCosts == null){
        this.editTripDistanceCostsOK = false;
        AllOk = false;
      }else{this.editTripDistanceCostsOK = true;}

      
      if(this.editTripCompanyName.name){
          this.editTripCompanyName = this.editTripCompanyName.name;
      }
     
      if(this.editTripCompanyName == ''){
        this.editTripCompanyNameOK = false;
        AllOk = false;
      }else{this.editTripCompanyNameOK = true;}

    /*  if(this.newTripComments == ''){
        this.newTripCommentsOK = false;
        AllOk = false;
      }else{this.newTripCommentsOK = true;}*/


      if(AllOk == true){
             this.editTripInDatabase();
      }

    },
    editTripInDatabase(){
     
         this.panelClass = 'closedPanel';   
         this.isLoading = true;  
         
        
          var TripDate = this.format_date(moment(this.editTripDate,'DD/MM/YYYY HH:mm'),'YYYY-MM-DD HH:mm:ss');

        
         
          const sessionId=this.$store.getters.token;
          const baseUrl = localStorage.getItem("_rootRestUrl");
                  
          let formData = JSON.stringify({key:this.ClickedRowId,sessionId:sessionId,from:this.editTripFrom,to:this.editTripTo,fixedCosts:this.editTripFixedCosts,userEmail:'',date:TripDate,cargoName:this.editTripCargoName,distance:this.editTripDistance,distanceCosts:this.editTripDistanceCosts,companyName:this.editTripCompanyName,comments:this.editTripComments  });
       
          let config = {
            headers: {
              "Content-Type": "application/json",
            }};
         

           axios
            .post(baseUrl + "/api/v1/Trip/ModifyTrip_V2",formData, config )
            .then(() => {
                                
               this.getTrips();
               this.getCompanies();
               this.editTripDialog=false;

               this.displayInfoDialog= true;
               this.InfoModalHeader='Info';
               this.InfoModalMessage='Changes are saved';
               this.isLoading = false; 
           })
            
             .catch(function (error) {
              // handle error
                           
                console.table(error);
                this.editTripDialog=false;
                this.displayInfoDialog=true;
                this.InfoModalHeader='Error!';
                this.InfoModalMessage='An error occured while saving changes!';
                this.isLoading = false; 
            
              });
          
          // after every request 
          this.$store.dispatch('autoLogin');  // go to AUTOLOGIN to extend "local" token valication
            this.extendTime(); // extend timeout to show expire session dialog
            // ---------------------

    },


    saveTrip(){
      
       var AllOk = true;

      if(this.newTripDate == ''){
        this.newTripDateOK = false;
        AllOk = false;
      }else{this.newTripDateOK = true;}

      if(this.newTripFrom == ''){
        this.newTripFromOK = false;
        AllOk = false;
      }else{this.newTripFromOK = true;}

      if(this.newTripTo == ''){
        this.newTripToOK = false;
        AllOk = false;
      }else{this.newTripToOK = true;}

      if(this.newTripCargoName == ''){
        this.newTripCargoNameOK = false;
        AllOk = false;
      }else{this.newTripCargoNameOK = true;}

      if(this.newTripFixedCosts== null){
        this.newTripFixedCostsOK = false;
        AllOk = false;
      }else{this.newTripFixedCostsOK = true;}

      if(this.newtTripDistance == null){
        this.newTripDistance='0'
     }

      if(this.newTripDistanceCosts == null){
        this.newTripDistanceCostsOK = false;
        AllOk = false;
      }else{this.newTripDistanceCostsOK = true;}

    
      if(this.newTripCompanyName == undefined || this.newTripCompanyName==''){
       
        this.newTripCompanyName = '';
        AllOk = false;
        this.newTripCompanyNameOK = false;
    }else{
        this.newTripCompanyName= this.newTripCompanyName.name;
        if(this.newTripCompanyName == ''){
          this.newTripCompanyNameOK = false;
          AllOk = false;
        }else{this.newTripCompanyNameOK = true;}
    }

    /*  if(this.newTripComments == ''){
        this.newTripCommentsOK = false;
        AllOk = false;
      }else{this.newTripCommentsOK = true;}*/


      if(AllOk == true){
          this.insertTripToDatabase();
      }

    },
async      insertTripToDatabase(){
        this.panelClass = 'closedPanel';   
        this.isLoading = true;  
         
        const sessionId=this.$store.getters.token;
       
        //date and time from NOW()
        var TripDate = this.format_date(moment(this.newTripDate,'DD/MM/YYYY HH:mm'),'YYYY-MM-DD HH:mm:ss');
        
        const baseUrl = localStorage.getItem("_rootRestUrl");
              
        let formData = JSON.stringify({sessionId:sessionId,tripsToInsert:[{key:'',from:this.newTripFrom,to:this.newTripTo,fixedCosts:this.newTripFixedCosts,userEmail:'',date:TripDate,cargoName:this.newTripCargoName,distance:this.newTripDistance,distanceCosts:this.newTripDistanceCosts,companyName:this.newTripCompanyName,comments:this.newTripComments}] });
 
        let config = {
            headers: {
              "Content-Type": "application/json",
        }};

          
      await   axios
            .post(baseUrl + "/api/v1/Trip/CreateTrips_V2",formData, config )
            .then(() => {
                                
               this.getTrips();
               this.getCompanies();
               this.newTripDialog=false;
               this.displayInfoDialog= true;
               this.InfoModalHeader='Info';
               this.InfoModalMessage='Trip is added';
               this.isLoading = false; 
           })
            
             .catch(function (error) {
              // handle error
                 
              if(error.response.status=='401') { //not authorized, token expires
                 localStorage.clear();
                 document.location = '/';
              }

                console.table(error);
                this.newTripDialog=false;
                this.displayInfoDialog=true;
                this.InfoModalHeader='Error!';
                this.InfoModalMessage='An error occured while saving trip!';
                this.isLoading = false; 
            
              });

            // after every request 
            this.$store.dispatch('autoLogin');  // go to AUTOLOGIN to extend "local" token valication
            this.extendTime(); // extend timeout to show expire session dialog
            // ---------------------

   },

    closeInfo(){
      this.displayInfoDialog=false;
    },


    handleClose(shouldShow) {
      
      // shouldShow will always be `false`, so this is a bit redundant
      if(!shouldShow){
       // this.resetInputFields();
      }
      else {
        // still open 
      }
    },

    closeInsertDialog(){
      this.newTripDialog=false;
      this.resetInputFields();
    },

    closeEditDialog(){
      this.editTripDialog=false;
      this.resetInputFields();
    },

    resetInputFields(){
         //reset input and edit fields ;)
          this.newTripDate='';
          this.newTripFrom='';
          this.newTripTo='';
          this.newTripCargoName='';
          this.newTripFixedCosts='0';
          this.newTripDistance='0';
          this.newTripDistanceCosts='0';
          this.newTripCompanyName='';
          this.newTripComments='';

          this.newTripDateOK=true;
          this.newTripFromOK=true;
          this.newTripToOK=true;
          this.newTripCargoNameOK=true;
          this.newTripFixedCostsOK=true;
          this.newTripDistanceOK=true;
          this.newTripDistanceCostsOK=true;
          this.newTripCompanyNameOK=true;
          this.newTripCommentsOK=true;

          this.editTripDate='';
          this.editTripFrom='';
          this.editTripTo='';
          this.editTripCargoName='';
          this.editTripFixedCosts='0';
          this.editTripDistance='0';
          this.editTripDistanceCosts='0';
          this.editTripCompanyName='';
          this.editTripComments='';

          this.editTripDateOK=true;
          this.editTripFromOK=true;
          this.editTripToOK=true;
          this.editTripCargoNameOK=true;
          this.editTripFixedCostsOK=true;
          this.editTripDistanceOK=true;
          this.editTripDistanceCostsOK=true;
          this.editTripCompanyNameOK=true;
          this.editTripCommentsOK=true;

 },
   
    editClick(){
      
      //show dialog for insert
      this.editTripDialog = true;

    },

    deleteClick(){
       // show confirmation dialog
        this.displayDeleteConfirm=true;

    },

    deletePhotoId(photoId){
         // show confirmation dialog
        this.displayDeletePhotoConfirm=true;
        this.photoIdForDelete = photoId;
    },

    deletePhotoModal(photoId){
         // show confirmation dialog
  
        this.photoIdForDelete = photoId;
        this.deletePhoto();
    },

  async  deletePhoto(){
        //user already confirmed
         this.panelClass = 'closedPanel';   
         this.isLoading = true;  
           
         const sessionId=this.$store.getters.token;
         const baseUrl = localStorage.getItem("_rootRestUrl");
      
         let formData = JSON.stringify({sessionId:sessionId,key:this.photoIdForDelete});
     
          let config = {
            headers: {
              "Content-Type": "application/json",
          }};

          
          await  axios
            .post(baseUrl + "/api/v1/Trip/DeleteTripFile",formData, config )
            .then(() => {
                                
               this.getTrips();
               this.getCompanies();
               this.displayDeletePhotoConfirm = false;
               this.visibleImagesModal = false;
               this.displayInfoDialog= true;
               this.InfoModalHeader='Info';
               this.InfoModalMessage='Photo is deleted';
               this.isLoading = false; 
           })
            
             .catch(function (error) {
              // handle error
              if(error.response.status=='401') { //not authorized, token expires
                 localStorage.clear();
                 document.location = '/';
              }

                console.table(error); // full error message inb console
                this.displayDeleteConfirm = false;
                this.displayDeletePhotoConfirm=true;
                this.visibleImagesModal = false;
                this.InfoModalHeader='Error!';
                this.InfoModalMessage='An error occured while deleting photo!';
                this.isLoading = false; 
            
              });
            
            // after every request 
            this.$store.dispatch('autoLogin');  // go to AUTOLOGIN to extend "local" token valication
            this.extendTime(); // extend timeout to show expire session dialog
            // ---------------------
    },

  async  deleteTrip(){
      //user already confirmed
         this.panelClass = 'closedPanel';   
         this.isLoading = true;  
           
         const sessionId=this.$store.getters.token;
         const baseUrl = localStorage.getItem("_rootRestUrl");
      
         let formData = JSON.stringify({sessionId:sessionId,key:this.ClickedRowId});
     
          let config = {
            headers: {
              "Content-Type": "application/json",
          }};

          
        await   axios
            .post(baseUrl + "/api/v1/Trip/DeleteTrip",formData, config )
            .then(() => {
                                
               this.getTrips();
               this.getCompanies();
               this.displayDeleteConfirm = false;
               this.displayInfoDialog= true;
               this.InfoModalHeader='Info';
               this.InfoModalMessage='Trip is deleted';
               this.isLoading = false; 
           })
            
             .catch(function (error) {

              if(error.response.status=='401') { //not authorized, token expires
                 localStorage.clear();
                 document.location = '/';
              }
              // handle error
                console.table(error); // full error message inb console
                this.displayDeleteConfirm = false;
                this.displayInfoDialog=true;
                this.InfoModalHeader='Error!';
                this.InfoModalMessage='An error occured while deleting trip!';
                this.isLoading = false; 
            
              });
            // after every request 
            this.$store.dispatch('autoLogin');  // go to AUTOLOGIN to extend "local" token valication
            this.extendTime(); // extend timeout to show expire session dialog
            // ---------------------
    
    },


    downloadClick(){
      alert("Download clicked")
    } ,

     refreshData(){
      
        //get selected dates
        if (this.fromDate.length!=10){
            this.fromDate = this.format_date(this.fromDate,'DD/MM/YYYY');
        }

        if (this.toDate.length!=10){
            this.toDate = this.format_date(this.toDate,'DD/MM/YYYY');
        }
     
      // and go for trips
      this.getTrips();
      this.getCompanies();
    },
    
          
    format_date_to_full(aDate,aTime){
   
        //excpected input: 14/04/2023
       var year = aDate.substring(6, 10);
       var month = aDate.substring(3, 5);
       var day = aDate.substring(0, 2);

        return year + '-' + month + '-' +day + " "+aTime;
      

    },

    format_date_to_full_time(aDate){
   
   //excpected input: 14/04/2023 14:33
  var year = aDate.substring(6, 10);
  var month = aDate.substring(3, 5);
  var day = aDate.substring(0, 2);
  var hour = aDate.substring(11, 13);
  var min = aDate.substring(14, 16);
  var sec = '00';

   return year + '-' + month + '-' +day + ' '+hour+':'+min+':'+sec;
 

},

    format_date_to_dateTime(aDate){
   
    //expected input: 2023-10-24 14:30:43
    var year = aDate.substring(0, 4);
    var month = aDate.substring(5, 7);
    var day = aDate.substring(8, 10);
    var hour = aDate.substring(11, 13);
    var min = aDate.substring(14, 16);

    //return year + '-' + month + '-' +day + " "+hour+":"+min;
    return day + '/' + month + '/' +year + " "+hour+":"+min;

},


  async  getCompanies(){

          const sessionId=this.$store.getters.token;
          const baseUrl = localStorage.getItem("_rootRestUrl");
          
          let formData = JSON.stringify({ sessionId: sessionId });
          let config = {
            headers: {
              "Content-Type": "application/json",
            },

          };

         await  axios
            .get(baseUrl + "/api/v1/Company/GetCompanies/?sessionId="+sessionId+"", formData, config)
            .then((response) => {
               this.allCompanies = response.data;
               
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

               
               
               this.allCompanies = sortArrayOfObjects( this.allCompanies, "name");
            
             // console.table(this.allCompanies)
                        
            })           
             .catch(function (error) {
                // handle error
                if(error.response.status=='401') { //not authorized, token expires
                 localStorage.clear();
                 document.location = '/';
              }
                console.table(error);
             });
            
           // after every request 
            this.$store.dispatch('autoLogin');  // go to AUTOLOGIN to extend "local" token valication
            this.extendTime(); // extend timeout to show expire session dialog
            // ---------------------
    },

    extendTime(){
      this.$emit('extend-session'); // extend time when session timeout popup will be shown
    },

    async getTrips(){
     
 //get selected dates

        if (this.fromDate.length!=10){
            this.fromDate = this.format_date(this.fromDate,'DD/MM/YYYY');
        }

        if (this.toDate.length!=10){
            this.toDate = this.format_date(this.toDate,'DD/MM/YYYY');
        }


          //save dates to local storage so it remebeer when swithing tabs:
          localStorage.setItem('fromDate',this.fromDate);
          localStorage.setItem('toDate',this.toDate);

         this.panelClass = 'closedPanel';   
         this.isLoading = true;  
         
          const fromDateFull = this.format_date_to_full(this.fromDate, '00:00:00');
          const toDateFull = this.format_date_to_full(this.toDate,'23:59:59');

          const sessionId=this.$store.getters.token;
          const DateFrom=fromDateFull;
          const DateTo= toDateFull;
          const UserId= localStorage.getItem("userId");
          const UserType= this.userType;
        
          const baseUrl = localStorage.getItem("_rootRestUrl");
          
          let formData = JSON.stringify({ sessionId: sessionId, DateFrom:DateFrom, DateTo:DateTo, UserId:UserId , UserType:UserType });
          let config = {
            headers: {
              "Content-Type": "application/json",
            },

          };

           await axios
            .get(baseUrl + "/api/v1/Trip/GetTrips_WEB/?sessionId="+sessionId+"&DateFrom="+DateFrom+"&DateTo="+DateTo+"&UserId="+UserId+"&UserType="+UserType+"", formData, config)
            .then((response) => {
              
                        
              this.allTrips = response.data;

              this.correctData(); // for correct invoiced to "yes/no"

              this.isLoading = false;  
              this.reorganizePagination();
              
              
           })
            
             .catch(function (error) {
              // handle error
           

              if(error.response.status=='401') { //not authorized, token expires
                 localStorage.clear();
                 document.location = '/';
              }
            
              
            });
            
            // after every request 
            this.$store.dispatch('autoLogin');  // go to AUTOLOGIN to extend "local" token valication
            this.extendTime(); // extend timeout to show expire session dialog
            // ---------------------

      },
      onRowClick(event) {
        
      // alert( event.data.id);
          this.ClickedRowId = event.data.id; // key for update
          this.editTripDate = this.format_date_to_dateTime(event.data.date);
          this.editTripFrom = event.data.from;
          this.editTripTo = event.data.to;
          this.editTripCargoName = event.data.cargoName;
          this.editTripFixedCosts = event.data.fixedCosts;
          this.editTripDistance = event.data.distance;
          this.editTripDistanceCosts = event.data.distanceCosts;
          this.editTripCompanyName = event.data.companyName;
          this.editTripComments = event.data.comments;
          this.editTripInvoiced = event.data.invSent;

        
          $('.hiddenFields').each(function() {
            
            $(this).closest('tr').removeClass('highlight');
           });
          
          $('.hiddenFields').each(function() {
           
            if($(this).attr('data')==event.data.id){
              $(this).closest('tr').addClass('highlight');
             }
          
          });

      },
   
      onRowSelect(event) {


        if(event.originalEvent.target.tagName != 'I' && event.originalEvent.target.tagName !='SPAN'){
          //if not clicked on I element (icon ) then open panel
         
        
          $('.hiddenFields').each(function() {
            
            $(this).closest('tr').removeClass('highlight');
           });
          
          $('.hiddenFields').each(function() {
           
            if($(this).attr('data')==event.data.id){
              $(this).closest('tr').addClass('highlight');
             }
          
          });

            //fill data for panel:
        
        this.tripDate= event.data.date;
        this.tripUserEmail= event.data.userEmail;
        this.tripFrom= event.data.from;
        this.tripTo= event.data.to;
        this.tripFixedCosts= event.data.fixedCosts;
        this.tripCargoName= event.data.cargoName;
        this.tripDistance= event.data.distance;
        this.tripDistanceCosts= event.data.distanceCosts;
        this.tripVatPercentage= event.data.vatPercentage;
        this.tripSum= event.data.sum;
        this.tripSumVAT= event.data.sumVAT;
        this.tripCompanyName= event.data.companyName;
        this.tripComments= event.data.comments;
        this.tripCreated= event.data.created;
        this.tripUserFullName= event.data.userFullName;

        this.tripImages = event.data.files;
              //console.log( this.allTrips)

         this.openedcargoname = event.data.cargoName;

        //open panel      
        this.getDocumentDetails();

               
        if(this.tripImages==''){
            this.picturesTabShow= false;  
            this.activeTab=0;  
         } else{
           this.picturesTabShow= true;    
        }

        }
      },
      openDialogAddPhoto(){
        this.displayUploadModal = true;
      },

      customUploader(event){
          var timestamp = Date.now();
          var selectedFile = event.files[0]  ; // for now only one file
        //  this.convertToBinary(selectedFile, selectedFile.name);   
         this.uploadImage(selectedFile,timestamp+'_'+selectedFile.name);  
          
      },

  /*     async convertToBinary(file, filename) {
         
            const reader = new FileReader();
            reader.readAsBinaryString(file);
            await new Promise(resolve => reader.onload = () => resolve());
            
            var binary = reader.result
           
            this.uploadImage(binary,filename);
          
            
       },*/


       async uploadImage(binary,filename){
          //FINNALY !! it works :)
           //  alert(binary )
          //   alert(filename);
            this.isLoading = true; 
             
            const sessionId=this.$store.getters.token;
            const baseUrl = localStorage.getItem("_rootRestUrl");
            const tripId =this.ClickedRowId;
          



         //   let formData = JSON.stringify({ Key: '', 'TripId':tripId, FileName:filename, SessionId: sessionId,File: binary });
            let config = {
              headers: {
                "Content-Type": "multipart/form-data",
              },

            };

            var formData = new FormData();
            formData.append("Key", "");
            formData.append("TripId", tripId);
            formData.append("FileName", filename);
            formData.append("SessionId", sessionId);
            formData.append("File", binary);


          await axios
            .post(baseUrl + "/api/v1/Trip/UploadTripFile/", formData, config)
            .then(() => {
              
             
              this.displayInfoDialog= true;
              this.InfoModalHeader='Info';
              this.InfoModalMessage='Photo is added';
              this.isLoading = false; 
              this.displayUploadModal = false;
              // console.table(response);
              this.getTrips();
           
            })           
             .catch(function (error) {

              if(error.response.status=='401') { //not authorized, token expires
                 localStorage.clear();
                 document.location = '/';
              }

                // handle error
              this.displayInfoDialog= true;
              this.InfoModalHeader='Alert!';
              this.InfoModalMessage='Error occured while uploading photo. Photo is not added!';
              this.isLoading = false; 
              this.displayUploadModal = false;
              console.table(error);
              this.getTrips();
             });

           // after every request 
           this.$store.dispatch('autoLogin');  // go to AUTOLOGIN to extend "local" token valication
            this.extendTime(); // extend timeout to show expire session dialog
            // ---------------------


       },
       setInvoiceDateToday(){
         this.invoiceDate =  moment().format('DD/MM/YYYY HH:mm');
         this.sendInvoiceDialog=true;
       },

       invoiceThisTrip(){

        var AllOk = true;

          if(this.invoiceDate == ''){
            this.invoiceDateOK = false;
            AllOk = false;
          }else{this.invoiceDateOK = true;}

          if(AllOk == true){
              this.markAsInvoicedInDatabase();
          }

       },


       invoiceMultipleTrips(){

       

        var AllOk = true;

          if(this.invoiceDate == ''){
            this.invoiceDateOK = false;
            AllOk = false;
          }else{this.invoiceDateOK = true;}

          if(AllOk == true){
              this.markAsInvoicedMultipleInDatabase();
          }

        },



    async  markAsInvoicedInDatabase(){
         // this.panelClass = 'closedPanel';   
          this.isLoading = true;  
         
          var Date = this.format_date(moment(this.invoiceDate,'DD/MM/YYYY HH:mm'),'YYYY-MM-DD HH:mm:ss');

          const sessionId=this.$store.getters.token;
          const baseUrl = localStorage.getItem("_rootRestUrl");
                  
          let formData = JSON.stringify({tripKey:this.ClickedRowId,sessionId:sessionId,date:Date,isInvoiceSent:true});
       
          let config = {
            headers: {
              "Content-Type": "application/json",
            }};
         

         await  axios
            .post(baseUrl + "/api/v1/Trip/MarkInvoiceAsSent",formData, config )
            .then(() => {
                                
               this.getTrips();
               this.getCompanies();
               this.displayInfoDialog= true;
               this.sendInvoiceDialog=false;
               this.InfoModalHeader='Info';
               this.InfoModalMessage='Trip is marked as invoiced';
               this.isLoading = false; 

               this.checkedIDs = [];
               this.AllPageMarked = false;
           })
            
             .catch(function (error) {
              // handle error
              if(error.response.status=='401') { //not authorized, token expires
                 localStorage.clear();
                 document.location = '/';
              }

                console.table(error);

                this.sendInvoiceDialog=false;
                   this.InfoModalHeader='Error!';
                   this.InfoModalMessage=error.response.data;
                   this.infoDialogStyle=[{ width: '40rem' }];
                   this.displayInfoDialog= true;
                this.isLoading = false; 
              });
            
            // after every request 
            this.$store.dispatch('autoLogin');  // go to AUTOLOGIN to extend "local" token valication
            this.extendTime(); // extend timeout to show expire session dialog
            // ---------------------
        
       },


    async   markAsInvoicedMultipleInDatabase(){

         // this.panelClass = 'closedPanel';   
         this.isLoading = true;  
         
         var Date = this.format_date(moment(this.invoiceDate,'DD/MM/YYYY HH:mm'),'YYYY-MM-DD HH:mm:ss');

         const sessionId=this.$store.getters.token;
         const baseUrl = localStorage.getItem("_rootRestUrl");
                 
        
   
              
          var jsonString='{"sessionId": "'+sessionId+'",';
             jsonString+='     "invoices": [ ';
               
             var a=0;
             var collectIDsToRemoveChecked = [];
             this.selectedIDsForInvoicing.forEach((aID) => {
              collectIDsToRemoveChecked.push(aID);
              a++
              jsonString+='{';
                jsonString+='"tripKey": "'+aID+'",';
                jsonString+='"isInvoiceSent": true,';
                jsonString+='"invoiceDate": "'+Date+'"';
              jsonString+='}';
              if(a<this.selectedIDsForInvoicing.length){
                jsonString+=',';
              }

            });    
              

             jsonString+='  ]';
           jsonString+='  }';

       

        let formData = jsonString;


         let config = {
           headers: {
             "Content-Type": "application/json",
           }};
        

      await  axios
           .post(baseUrl + "/api/v1/Trip/MarkInvoicesAsSent",formData, config )
           .then(() => {
                               
              this.getTrips();
              this.getCompanies();
              this.displayInfoDialog= true;
              this.sendMultipleInvoiceDialog=false;
              this.showInvoiceSelectedButton=false;
              this.InfoModalHeader='Info';
              this.InfoModalMessage='Trips are marked as invoiced';
              this.isLoading = false; 

              //remove checkbox
              collectIDsToRemoveChecked.forEach((aID) => { 
               this.checkedIDs[aID]=false;
           
              //remove ID from array
              const index = this.selectedIDsForInvoicing.indexOf(aID);
              this.selectedIDsForInvoicing.splice(index, 1);     
               
              });

             

            


          })
           
            .catch(function (error) {
             // handle error
                          
               console.table(error);

               this.sendInvoiceDialog=false;
                  this.InfoModalHeader='Error!';
                  this.InfoModalMessage=error.response.data;
                  this.infoDialogStyle=[{ width: '40rem' }];
                  this.displayInfoDialog= true;
                  this.isLoading = false; 
             });
          
            this.AllPageMarked=false;
            this.AllMarked=false;

          // after every request 
          this.$store.dispatch('autoLogin');  // go to AUTOLOGIN to extend "local" token valication
            this.extendTime(); // extend timeout to show expire session dialog
            // ---------------------

       },


      async unInvoiceThisTrip(){
          
        //this.panelClass = 'closedPanel';   
          this.isLoading = true;  
                          
          const sessionId=this.$store.getters.token;
          const baseUrl = localStorage.getItem("_rootRestUrl");
                  
          let formData = JSON.stringify({tripKey:this.ClickedRowId,sessionId:sessionId,date:'',isInvoiceSent:false});
       
          let config = {
            headers: {
              "Content-Type": "application/json",
            }};
         

          await axios
            .post(baseUrl + "/api/v1/Trip/MarkInvoiceAsSent",formData, config )
            .then(() => {
                                
               this.getTrips();
               this.getCompanies();
               this.editTripDialog=false;
               this.displayInfoDialog= true;
               this.displayUnInvoiceConfirm=false;
               this.InfoModalHeader='Info';
               this.InfoModalMessage='Trip is marked as invoiced';
               this.isLoading = false; 
           })
            
             .catch(function (error) {
              // handle error
                 
              if(error.response.status=='401') { //not authorized, token expires
                 localStorage.clear();
                 document.location = '/';
              }

                console.table(error);

                this.displayUnInvoiceConfirm=false;
                   this.InfoModalHeader='Error!';
                   this.InfoModalMessage=error.response.data;
                   this.infoDialogStyle=[{ width: '40rem' }];
                   this.displayInfoDialog= true;
                this.isLoading = false; 
              });

           // after every request 
           this.$store.dispatch('autoLogin');  // go to AUTOLOGIN to extend "local" token valication
            this.extendTime(); // extend timeout to show expire session dialog
            // ---------------------

       },
        
          
      getDocumentDetails( ){
          //load from api them
          this.openPanel();
         
       },

      openPanel(){
        this.panelClass = 'openedPanel';
      },

      closePanel(){
        this.panelClass = 'closedPanel';
      },

    
      initFilters1() {
            this.filters1 = {
               'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
               'userFullName':{operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]}, 
               'from': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]}, 
               'to': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]}, 
               'companyName': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]}, 
               'cargoName': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]}, 
               'distance': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
               'sumVAT': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
               'comments': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]}
               
            }
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
    showloader(event){
        this.isLoading = event;
       
    },
   async downloadReport(){
     
         this.getTrips();
         this.isLoading = true;  
         

        //get selected dates
        if (this.fromDate.length!=10){
            this.fromDate = this.format_date(this.fromDate,'DD/MM/YYYY');
        }

        if (this.toDate.length!=10){
            this.toDate = this.format_date(this.toDate,'DD/MM/YYYY');
        }

         const fromDateFull = this.format_date_to_full(this.fromDate, '00:00:00');
         const toDateFull = this.format_date_to_full(this.toDate,'23:59:59');

         const sessionId=this.$store.getters.token;
         const DateFrom=fromDateFull;
         const DateTo= toDateFull;
  
         const baseUrl = localStorage.getItem("_rootRestUrl");
        
        
        // const locale = this.userLocale;
           const locale = 'EN'; //for now, locale set to EN so that CSV is comma separated
     
      

        let formData = JSON.stringify({ sessionId: sessionId, DateFrom:DateFrom , DateTo:DateTo , locale:locale});
          let config = {
            headers: {
              "Content-Type": "application/json",
            },

          };

         await  axios
            .get(baseUrl + "/api/v1/Trip/CSV/Trips/?sessionId="+sessionId+"&DateFrom="+DateFrom+"&DateTo="+DateTo+"&locale="+locale, formData, config)
            .then((response) => {
               this.downloadedReport = response.data;
               

               var fileName = 'Report '+this.format_date(DateFrom, 'YYYY-MM-DD')+" - "+this.format_date(DateTo, 'YYYY-MM-DD');
               this.downloadCSV(this.downloadedReport, fileName);
              
            })           
             .catch(function (error) {
                // handle error
                this.isLoading = false; 
                
                if(error.response.status=='401') { //not authorized, token expires
                 localStorage.clear();
                 document.location = '/';
              }


             });

          // after every request 
          this.$store.dispatch('autoLogin');  // go to AUTOLOGIN to extend "local" token valication
            this.extendTime(); // extend timeout to show expire session dialog
            // ---------------------


    },

    

    correctData(){

        this.allTrips.forEach((value,index) => {



        const entries = Object.entries(value);

        entries.forEach((value2) => {
              
              if(value2[0]=='invSent'){
                  var newType = '';
                  if(value2[1]==true){
                      newType="Yes";
                  }else{
                      newType="No";
                  }
                  this.allTrips[index]['invSent']=newType;
              }
            
          



              
        });


        });

     },

    downloadCSV(csvString,filename){
          
          const element = document.createElement("a");

          element.setAttribute("href", `data:text/csv;charset=utf-8,${csvString}`);
          element.setAttribute("download", filename);
          element.style.display = "none";

          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
          this.isLoading = false; 
    },

    formatMoney(number, decPlaces, decSep, thouSep, symbol) {
        decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
        decSep = typeof decSep === "undefined" ? "." : decSep;
        thouSep = typeof thouSep === "undefined" ? "," : thouSep;
        var sign = number < 0 ? "-" : "";
        var i = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(decPlaces)));
        var j = (j = i.length) > 3 ? j % 3 : 0;

        return symbol + " " + sign +
            (j ? i.substr(0, j) + thouSep : "") +
            i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, "$1" + thouSep) +
            (decPlaces ? decSep + Math.abs(number - i).toFixed(decPlaces).slice(2) : "");
    },


    showContextMenu: function (e) {
       
          //show right click menu only for admin
          if(this.userType.toUpperCase()=='ADMIN'){
            
              e.preventDefault();
              var menu = document.getElementById("div-context-menu");
              menu.style.left = e.pageX + 'px'
              menu.style.top = (e.pageY - 50) + 'px'
              menu.style.display = 'block'
              menu.cid = e.target.id.replace(/title-/,"")
            
          }  

        }
        , hideContextMenu: function () {
           document.getElementById("div-context-menu").style.display = "none"
        },

        onClick: function () {
         this.hideContextMenu();
        },

       async SelectAllPage(){
          var whatToDo = '';
         
         /// collect all ID of all checkboxes:
                var collectIDsToAdd = [];
                this.selectedIDsForInvoicing = [];
                $('.p-checkbox').each(function() {
                  var id=$(this).parent().attr('data');
                   collectIDsToAdd.push(id);
                   
                 });
            //--------------

          if(this.AllPageMarked == false){
               whatToDo = 'mark';
               this.showInvoiceSelectedButton=true;
          }else{
               whatToDo = 'unmark';
               this.showInvoiceSelectedButton=false;
          }


           if(whatToDo=='mark'){ 
                collectIDsToAdd.forEach((aID) => { 
                this.selectedIDsForInvoicing.push(aID);
                this.checkedIDs[aID]=true;
                this.AllPageMarked = true;
            });
           }else{
             this.checkedIDs = [];
             this.AllPageMarked = false;
           }

          

        },

        SelectAll(whatToDo){
       
                  
          if(whatToDo=='select'){
            if(this.AllMarked == false){
               this.showInvoiceSelectedButton=true;
             
            }else{
                 this.showInvoiceSelectedButton=false;
           }
            }else{
              //just unselect all
              this.selectedIDsForInvoicing = [];
              this.checkedIDs = [];
              this.AllMarked = false;
              this.AllPageMarked = false;
              this.showInvoiceSelectedButton=false;
            }

            
            this.selectedIDsForInvoicing = [];
             
            

              if(whatToDo=='select'){ 
                  this.AllMarked = true;
                  this.allTrips.forEach((value) => {

                    const entries = Object.entries(value);

                    var  rememberID= '';
                    entries.forEach((value2) => {
                        
                        if(value2[0]=='id'){
                          rememberID = value2[1];
                        }
                      
                        if(value2[0]=='invSent'){
                            // var newType = '';
                           
                            if(value2[1]=='No'){
                                //
                                  this.selectedIDsForInvoicing.push(rememberID);
                                  this.checkedIDs[rememberID]=true;
                              }
                            
                          }
                        
                          
                      });


                    });

             }

              if(this.selectedIDsForInvoicing.lenght>0){
                this.showInvoiceSelectedButton=true;
              }
                        
        },

  },
  
  mounted() {

  
    //on click anywhere close context menu 
    var el=document.getElementById('app');
    el.addEventListener('click', this.onClick);


    // get dates from localstorage if exists so it remembers when changing tabs:
    // if not exists then means user just enters the application so give me this week dates

        if(localStorage.getItem('fromDate')!=undefined){
            this.fromDate = localStorage.getItem('fromDate');
        }else{
            this.fromDate = moment().startOf('isoWeek').format('DD/MM/YYYY');
        }
      
        if(localStorage.getItem('toDate')!=undefined){
            this.toDate = localStorage.getItem('toDate');
        }else{
            this.toDate  = moment().endOf('isoWeek').format('DD/MM/YYYY');
        }
    
     //  ------ end default dates  -------- / 
       


     this.$emit("showSearchbar", true);

    if (this.$store.getters.getUserType==null || this.$store.getters.getUserLocale == null){
        //we don't have usertype so user is not properly login, logout him and try again
        localStorage.clear();
        document.location = '/';
    }
    
     this.getTrips();
     this.getCompanies();
     this.moveSearchBoxToTop();


      if(this.$store.getters.getUserType != null){
        this.userType = (this.$store.getters.getUserType).toUpperCase();
      }else{
        this.userType = 'USER';
      }

      if(this.$store.getters.getUserLocale != null){
        this.userLocale = (this.$store.getters.getUserLocale).toUpperCase();
      }else{
        this.userLocale = 'EN';
      }


     
     $("#editIconsPanel").detach().appendTo('.p-tabview-nav-content');
     
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


.pi-filter-icon, .pi-filter-slash {
  font-size:12px
  }
  .p-column-filter-menu{margin-left:0}

  .p-column-filter-menu-button{margin-left:0.1rem;}
.p-column-filter-menu-button-active{width:24px;height:24px}
/* ---------------------- */


        .p-progressbar {
            height: .5rem;
            background-color: #D8DADC;
        }
        .p-progressbar .p-progressbar-value {
            background-color: #607D8B;
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
            border-bottom:none !important;
        }

        .p-datatable.p-datatable-customers .p-dropdown-label:not(.p-placeholder) {
            text-transform: uppercase;
        }

        .p-button{background:#138BA7 !important;border-color: #138BA7 !important;}
        .p-button:hover{background:#263a4f !important;border-color: #263a4f !important;}
        .p-button.p-button-outlined{color:white;}
        .p-button.p-button-outlined:enabled:hover{color:white;background:#263a4f !important;border-color: #263a4f !important;}        
       
 
#searchBox{width:80%}
#searchBox .p-inputtext{width:100%}

.p-datatable-header #searchBox{display:none}
.dateDisplayInput{height:34px;margin-left:6px}

.p-datatable .p-sortable-column .p-sortable-column-icon{color:white}
.p-datatable .p-sortable-column:not(.p-highlight):hover .p-sortable-column-icon{color:white}
.p-datatable .p-sortable-column.p-highlight:hover .p-sortable-column-icon{color:white}
.p-button.p-button-text, .p-button.p-button-text:enabled:hover{color:white}
.p-datatable .p-sortable-column.p-highlight .p-sortable-column-icon{color:white}

#refreshButton{margin-left:6px;height:34px;}
#newTripButton, #downloadReport, #invoiceSelected{margin-left:0;height:34px;}
.p-datatable .p-datatable-header {background: none;border:none}

.p-datatable .p-datatable-tbody > tr > td {
  text-align: left;
  border: 1px solid #dee2e6;
  border-width: 0 0 0 0;
  padding: 1rem 1rem;
}
.p-datatable-header{padding-left:0 !important;padding-right:0 !important;padding-top:7px !important}
.p-paginator-current{border:0 !important;color:#333 !important;font-size: 0.9rem;}
.p-paginator-bottom{padding-left:0 !important;padding-right:0 !important}

.actionsColumns{display:table-cell !important;text-align: right !important ;width:50px !important}
th.actionsColumns{display:flex !important}

/*.p-column-header-content{display:block}*/

.p-paginator .p-paginator-pages .p-paginator-page.p-highlight {
  background: #138BA7;
  border-color: #138BA7;
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

.p-disabled{color:#ccc !important;}



.RightSidepanel {
height:100%; 
width:0;
max-width:100%;
position: fixed; 
z-index: 1; 
top: 0;
right: 0px;
background-color: #f5f5f5; 
overflow-x: hidden; 
padding-top: 15px; 
padding-right:0px;
padding-left:0px;
transition: 0.5s;
box-shadow: 0px 20px 7px #cccccc;
z-index:11;
}
.RightSidepanel .closebtn {
z-index:1000;
position: absolute;
top: 0;
right: 35px;
font-size: 36px;
margin-left: 50px;
color:#343434;
text-decoration:none;
}
.closedPanel{width:0px}
.openedPanel{width:750px}

.cursorHand {cursor:pointer}
.closePanelButton{margin-right:20px}

#detailsTable {font-size:0.9rem;font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";}
#detailsTable td {text-align: left;}

.p-tabview .p-tabview-panels{
  background-color: unset;
  border-left:1px solid #ccc;
  border-bottom:1px solid #ccc;
  border-right:1px solid #ccc;
  border-top:none !important;
}

.p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {border:1px solid #ccc}

.p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
  border: 1px solid #ccc;
  top: 1px;
}
.p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
  background: #f5f5f5;
}

.p-tabview .p-tabview-nav li .p-tabview-nav-link:not(.p-disabled):focus {box-shadow: none;}

.p-datatable .p-datatable-tbody > tr:focus {
  outline: none;
 
}

#editIconsPanel{
  top: 0px;
  position: absolute;
  right: 0px;
}
.actionIcons{cursor: pointer;}
.RightSidepanel .row {margin:0}

.swiperSlideHolder img {cursor: zoom-in;}

.highlight td {background:#ccf}


.insertFormRow .p-inputtext{padding:3px}
.insertFormRow {padding:6px;}
.insertFormRow {background:#fff}
.insertFormRow.even {background:#f3f3f3}

.p-dialog-content{height:unset;overflow-y: auto;}
.redButton{background-color:darkred !important}
.redButton:hover{background-color:rgb(82, 15, 15) !important}
#formContainer{font-size:0.9rem !important;}

.p-inline-message.p-inline-message-error {padding:4px;margin-left:4px;}

.p-datepicker table td {
  padding: 1px;
}

.p-datepicker table td > span {width:1.6rem;height:1.6rem}
.p-datepicker {width:300px !important;box-shadow: 0px 6px 12px #ddd  !important}
.p-dropdown-panel{max-width:400px !important;box-shadow: 0px 6px 12px #ddd  !important}
.p-dropdown-panel .p-dropdown-header{padding:0.4rem;}
.p-dropdown-panel .p-dropdown-items .p-dropdown-item{padding:0.1rem 0.7rem;}
.p-dropdown-filter{padding:3px}
.p-dropdown,.p-inputtext{width:230px}

.addphotobutton{margin-left: 0;  height: 34px;}

.p-fileupload-filename{width:100% !important}
.p-paginator-rpp-options{width:100px}
.p-button-label{text-align:left;}

.invoiceButtonHolder{
  display: inline-block;
  margin-right: 140px;
  position: relative;
  
}
.invoiceButton{
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

.p-column-filter-menu-button.p-column-filter-menu-button-active, .p-column-filter-menu-button.p-column-filter-menu-button-active:hover {
  background: #69ce74;
  color: #ffffff;
}

.p-button-label{padding-bottom:3px}

.actionButtonsHolder{
  display: inline-block;
  top: -3px;
  position: relative;
  right: 0;
  padding-bottom: 3px;
}

.cls-context-menu {
           display:none;
           position:absolute;
        }
        .cls-context-menu ul, #context-menu li {
            list-style:none;
            margin:0; padding:0;
            background:white;
        }       .cls-context-menu {z-index:900;background:white; border:solid 1px #CCC;box-shadow: 1px 3px 10px #CCC;  padding: 4px;}
        .cls-context-menu li {
           border-bottom:solid 1px #CCC;
           display:block;
           /*padding:5px 12px;*/
           text-decoration:none;
           color:#444;
           cursor:pointer;
        }

        .cls-context-menu li a {padding:5px 12px;display:block;}

        .cls-context-menu li:hover{
            background: #138BA7 !important;
            color: #FFF;
        }
        .cls-context-menu li:last-child { border:none; }

        .context-menu-icon {
          top: 1px;
          position: relative;
          margin-right: 2px;
        }
        .cls-context-menu-item {
          cursor: pointer;
          display:block;
          padding:20px;
          background:#ECECEC;
        }

        .p-button.p-button-danger.p-button-text, .p-buttonset.p-button-danger > .p-button.p-button-text, .p-splitbutton.p-button-danger > .p-button.p-button-text  {color:white !important;}


        .actionButtonsHolderTable{
          display: flex;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
       .actionButtonsHolderTable div {
        align-self: center;
          

          
        }
      

</style>


