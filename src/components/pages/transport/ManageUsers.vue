<template>

  <base-dialog :show="isLoading"  title="Authenticating..." fixed>
    <base-spinner></base-spinner>
  </base-dialog>

  <div >
  <DataTable :id="dataTable" :value="allUsers" :paginator="true" :rows="25"   dataKey="id"  stripedRows v-model:filters="filters" filterDisplay="menu" key="key" 
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            paginatorStart="CurrentPageReport"
            :rowsPerPageOptions="[25,50,100]" responsiveLayout="scroll"
            currentPageReportTemplate="Showing {first} to {last} of total {totalRecords} users"
            :globalFilterFields="['name','surname','email','type']"
            selectionMode="single"
            @rowSelect="onRowSelect"
            @rowClick="onRowClick"
            
                        :loading="isLoading"
            scrollable 
          
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
                        <Button style="min-width:120px" v-tooltip.bottom="{ value: 'Add user', showDelay: 1000, hideDelay: 300 }" type="button" icon="pi pi-pencil" class="p-button-text" id="newTripButton" @click="addUser" label="Add user"/>
                         </div>
                        
                      <div class="col-md-8 text-end">
                           <!-- something more ont right side table header-->
                        </div>
                    </div>


                   

            </template>
           
           <template #empty>
                    
           </template>
           <template #loading>
                    Loading data. Please wait...
           </template>


      <Column  field="isActive" header="Active" :sortable="true" dataType="boolean" style="max-width:100px;" bodyStyle="width:40px">
        
        <template #body="{ data }">
           <div style="padding-left:16px;width:100%">
                <i v-if="data.isActive=='Active'" class="pi pi-check"></i>
                <i v-if="data.isActive=='Not active'" class="pi pi-times"></i>
           </div>
           <span style="display: none;" class="hiddenFields" :data=data.id></span> <!-- this is only that I have something to indetify which row is clicked :) -->
        </template>
        <template #filter="{filterModel}">
            <Dropdown :options="['Active','Not active']" v-model="filterModel.value" class="p-column-filter" :placeholder="`Active&nbsp;`"/>
        </template>
      
    </Column>      

    <Column field="name" header="Name" :sortable="true" bodyStyle="text-align: left"  style="max-width:250px;">
        <template #filter="{filterModel}">
            <InputText  type="text" v-model="filterModel.value" class="p-column-filter" :placeholder="`Name`"/>
        </template>
    </Column>

    <Column field="surname" header="Surname" :sortable="true" bodyStyle="text-align: left"  style="max-width:250px;">
        <template #filter="{filterModel}">
            <InputText  type="text" v-model="filterModel.value" class="p-column-filter" :placeholder="`Surname`"/>
        </template>
    </Column>

    <Column field="email" header="Email" :sortable="true" bodyStyle="text-align: left"  style="max-width:250px;"> 
        <template #filter="{filterModel}">
            <InputText  type="text" v-model="filterModel.value" class="p-column-filter" :placeholder="`Email`"/>
        </template>
    </Column>

    <Column field="type" header="User&nbsp;Type" dataType="boolean"  :sortable="true" bodyStyle="text-align: left"  style="max-width:250px;"> 
       
        <template #filter="{filterModel}">
            <Dropdown :options="['Admin','User']" v-model="filterModel.value" class="p-column-filter" :placeholder="`Type`"/>
        </template>
    </Column>

    <Column>
    </Column>


    <Column  v-if="userType=='ADMIN'" style="text-align: right;" class="actionsColumns">
        <template #header >
          <div style="right: 20px;  position: absolute;">
            <div style="float:right">Actions</div>
          </div>
        </template>
        <template #body>
          
           
            <div class="fa-stack fa-2x actionIcons" style="font-size:15px"  v-tooltip.bottom="{ value: 'Edit user', showDelay: 1000, hideDelay: 300 }"  @click="editClick">
              <i class="fa-solid fa-square fa-stack-2x"></i>
              <i class="fa-stack-1x fa-solid fa-pen-to-square" style="color: white"></i>
            </div>
            
           
            <div class="fa-stack fa-2x actionIcons" style="font-size:15px;color:#aa0000" v-tooltip.left="{ value: 'Delete user', showDelay: 1000, hideDelay: 300 }" @click="deleteClick">
              <i class="fa-solid fa-square fa-stack-2x"></i>
              <i class="fa-stack-1x fa-solid fa-trash-can" style="color: white"></i>
            </div>
        
        </template>

    </Column>



    <template #paginatorstart>
    
    </template>         
    <template #paginatorend>
      
    </template>  
    

   


</DataTable>
</div>
<!-- Edit user Dialog-->
<Dialog @update:visible="handleClose" v-model:visible="editUserDialog" modal  :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
         
         <template #header>
                <div class="row" style="width:100%">
                    <div class="col-md-7">
                       Edit user            
                    </div>
                    <div class="col-md-5">
                        <Button v-tooltip.bottom="'Change password'" icon="pi pi-lock" @click="displayPasswordChange" class="downloadImageButton" label="Change password"/>
                    </div>
                </div>
         </template> 
         
         <div class="container" id="formContainer">
         
 
          
           <div class="row insertFormRow align-items-center  even ">
             <div class="col-md-3"><label for="editUserName">Name</label></div>
             <div class="col-md-9"><InputText @input="editUserNameOK=true" id="editUserName" v-model="editUserName" />
             <InlineMessage v-if="!editUserNameOK">This field is required</InlineMessage></div>
           </div>
 
           <div class="row insertFormRow align-items-center  ">
             <div class="col-md-3"><label for="editUserSurname">Surname</label></div>
             <div class="col-md-9"><InputText @input="editUserSurnameOK=true"  id="editUserSurname" v-model="editUserSurname" />
             <InlineMessage v-if="!editUserSurnameOK">This field is required</InlineMessage></div>
           </div>
 
           <div class="row insertFormRow align-items-center  even">
             <div class="col-md-3"><label for="editUserEmail">Email</label></div>
             <div class="col-md-9"><InputText @input="editUserEmailOK=true" id="editUserEmail" v-model="editUserEmail"/>
             <InlineMessage v-if="!editUserEmailOK">This field is required</InlineMessage></div>
           </div>
 
          
           <div class="row insertFormRow align-items-center  ">
             <div class="col-md-3"><label for="editUserActiveUntil">Active until</label></div>
             <div class="col-md-9">
              
              <Calendar hourFormat="24" :value="editUserActiveUntil" v-model="editUserActiveUntil" @change="changeDate('from')" style="margin-left:0" id="editUserActiveUntil" class="dateDisplayInput"  showIcon dateFormat="dd/mm/yy" placeholder="dd/mm/yy" mask="99/99/9999"/>
             
               <InlineMessage v-if="!editUserActiveUntilOK">This field is required</InlineMessage>
             </div>
           </div>


           <div class="row insertFormRow align-items-center  even">
             <div class="col-md-3"><label for="editUserIsActive">Active</label></div>
             <div class="col-md-9">
              <!--<InputText  @input="editUserIsActiveOK=true" id="editUserIsActive" v-model="editUserIsActive" />-->
              <Dropdown v-model="editUserIsActive2" :options="activeOptions" placeholder="Please select"></Dropdown>
             <InlineMessage v-if="!editUserIsActive2OK">This field is required</InlineMessage></div>
           </div>

           <div class="row insertFormRow align-items-center  ">
             <div class="col-md-3"><label for="editUserType">User type</label></div>
             <div class="col-md-9">
             
              <Dropdown v-model="editUserType" :options="userTypeOptions" placeholder="Please select"></Dropdown>
              <InlineMessage v-if="!editUserTypeOK">This field is required</InlineMessage></div>
           </div>

           <div class="row insertFormRow align-items-center  even">
             <div class="col-md-3"><label for="editUserLanguage">Language</label></div>
             <div class="col-md-9">
             
              <Dropdown v-model="editUserLanguage" :options="newUserLanguageOptions" placeholder="Please select"></Dropdown>
              <InlineMessage v-if="!editUserLanguageOK">This field is required</InlineMessage></div>
           </div>

           
 
           <div class="row insertFormRow align-items-center  ">
             <div class="col-md-6 text-left">
               <Button @click="closeEditDialog" style="min-width:120px" v-tooltip.bottom="{ value: 'Cancel', showDelay: 1000, hideDelay: 300 }"   icon="pi pi-times-circle" type="button" class="p-button-text redButton" label="Cancel"/>
            
             </div>
             <div class="col-md-6 text-end">
               <Button style="min-width:120px" v-tooltip.bottom="{ value: 'Save changes', showDelay: 1000, hideDelay: 300 }"  type="button" icon="pi pi-pencil" class="p-button-text" @click="editUser" label="Save changes"/>
              </div>
           </div>
         
         </div>
           
 
 
       </Dialog> 


<!-- New user Dialog-->
<Dialog @update:visible="handleClose" v-model:visible="newUserDialog" modal  :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
         
         <template #header>
           Add user
         </template> 
         
         <div class="container" id="formContainer">
         
 
          
           <div class="row insertFormRow align-items-center  even">
             <div class="col-md-3"><label for="newUserName">Name</label></div>
             <div class="col-md-9"><InputText @input="newUserNameOK=true" id="newUserName" v-model="newUserName" />
             <InlineMessage v-if="!newUserNameOK">This field is required</InlineMessage></div>
           </div>
 
           <div class="row insertFormRow align-items-center  ">
             <div class="col-md-3"><label for="newUserSurname">Surname</label></div>
             <div class="col-md-9"><InputText @input="newUserSurnameOK=true"  id="newUserSurname" v-model="newUserSurname" />
             <InlineMessage v-if="!newUserSurnameOK">This field is required</InlineMessage></div>
           </div>
 
           <div class="row insertFormRow align-items-center  even">
             <div class="col-md-3"><label for="newUserEmail">Email</label></div>
             <div class="col-md-9">
                <InputText @input="newUserEmailOK=true" id="newUserEmail" v-model="newUserEmail" pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"/>
               

                <InlineMessage v-if="!newUserEmailOK">This field is required</InlineMessage>
                <InlineMessage v-if="!emailIsValid">Email is not valid</InlineMessage>
                
                </div>
           </div>
 
           <div class="row insertFormRow align-items-center  ">
             <div class="col-md-3"><label for="newUserPassword">Password</label></div>
             <div class="col-md-9"><InputText type="password" @input="newUserPasswordOK=true" id="newUserPassword" v-model="newUserPassword" />
             <InlineMessage v-if="!newUserPasswordOK">This field is required</InlineMessage>
             <InlineMessage v-if="!newUserPasswordsNotMatchOK">Passwords do NOT match!</InlineMessage>
            </div>
           </div>

           <div class="row insertFormRow align-items-center  even">
             <div class="col-md-3"><label for="newUserPasswordRepeat">Repeat password</label></div>
             <div class="col-md-9"><InputText type="password" @input="newUserPasswordRepeatOK=true" id="newUserPasswordRepeat" v-model="newUserPasswordRepeat" />
                <InlineMessage v-if="!newUserPasswordRepeatOK">This field is required</InlineMessage>
                <InlineMessage v-if="!newUserPasswordsNotMatchOK">Passwords do NOT match!</InlineMessage>
            </div>

           </div>
 
  
           <div class="row insertFormRow align-items-center  ">
             <div class="col-md-3"><label for="newUserActiveUntil">Active until</label></div>
             <div class="col-md-9">
              
              <Calendar hourFormat="24" :value="newUserActiveUntil" v-model="newUserActiveUntil" @change="changeDate('from')" style="margin-left:0" id="newUserActiveUntil" class="dateDisplayInput"  showIcon dateFormat="dd/mm/yy" placeholder="dd/mm/yy" mask="99/99/9999"/>
             
               <InlineMessage v-if="!newUserActiveUntilOK">This field is required</InlineMessage>
             </div>
           </div>


           <div class="row insertFormRow align-items-center  even">
             <div class="col-md-3"><label for="newUserIsActive">Active</label></div>
             <div class="col-md-9">
              <!--<InputText  @input="newUserIsActiveOK=true" id="newUserIsActive" v-model="newUserIsActive" />-->
              <Dropdown v-model="newUserIsActive" :options="activeOptions" placeholder="Please select"></Dropdown>
             <InlineMessage v-if="!newUserIsActiveOK">This field is required</InlineMessage></div>
           </div>

           <div class="row insertFormRow align-items-center  ">
             <div class="col-md-3"><label for="newUserType">User type</label></div>
             <div class="col-md-9">
              <!--<InputText  @input="newUserTypeOK=true" id="newUserType" v-model="newUserType" />-->
              <Dropdown v-model="newUserType" :options="userTypeOptions" placeholder="Please select"></Dropdown>
              <InlineMessage v-if="!newUserTypeOK">This field is required</InlineMessage></div>
           </div>

           <div class="row insertFormRow align-items-center even ">
             <div class="col-md-3"><label for="newUserLanguage">Language</label></div>
             <div class="col-md-9">
              <!--<InputText  @input="newUserTypeOK=true" id="newUserType" v-model="newUserType" />-->
              <Dropdown v-model="newUserLanguage" :options="newUserLanguageOptions" placeholder="Please select"></Dropdown>
              <InlineMessage v-if="!newUserLanguageOK">This field is required</InlineMessage></div>
           </div>

           
 
           <div class="row insertFormRow align-items-center  ">
             <div class="col-md-6 text-left">
               <Button @click="closeNewDialog" style="min-width:120px" v-tooltip.bottom="{ value: 'Cancel', showDelay: 1000, hideDelay: 300 }"   icon="pi pi-times-circle" type="button" class="p-button-text redButton" label="Cancel"/>
            
             </div>
             <div class="col-md-6 text-end">
               <Button style="min-width:120px" v-tooltip.bottom="{ value: 'Save changes', showDelay: 1000, hideDelay: 300 }"  type="button" icon="pi pi-pencil" class="p-button-text" @click="newUser" label="Add user"/>
              </div>
           </div>
         
         </div>
           
 
 
       </Dialog> 


       
 <!-- dialog info --> 
 <Dialog v-model:visible="displayInfoDialog" modal  :style="infoDialogStyle" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <template #header=""> 
        <h4> {{ InfoModalHeader }}</h4>
    </template>
  
            <span class="font-bold text-2xl block mb-2 mt-4"></span>
            <p class="mb-0">{{InfoModalMessage }}</p>
            <div class="flex text-end gap-2 mt-4">
                <Button label="Ok" @click="closeInfo"></Button>
              
            </div>          
</Dialog>

 <!-- dialog confirm Delete user --> 
 <Dialog v-model:visible="displayDeleteConfirm" modal  :style="{ width: '30rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <template #header=""> 
        <h4> Please confirm</h4>
    </template>
  
            <span class="font-bold text-2xl block mb-2 mt-4"></span>
            <p class="mb-0">Are you sure that you want to delete user <strong>'{{ editUserName }} {{ editUserSurname }}' </strong>?</p>
          
          <div class="row" style="margin-top:30px">
              <div class="col-md-6 text-start">
                  <Button class="redButton" label="Cancel" @click="displayDeleteConfirm=false"></Button>
              </div>
              <div class="col-md-6 text-end">
                  <Button label="Yes, delete" @click="deleteUser"></Button>
            </div>   
          </div>
           
</Dialog>

<!-- dialog new password--> 
<Dialog v-model:visible="newPasswordDialogVisible" modal  :style="{ width: '40rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <template #header=""> 
        <h4> Please Enter new password</h4>
    </template>
  
            <div class="row insertFormRow align-items-center  ">
             <div class="col-md-3"><label for="editUserPassword">Password</label></div>
             <div class="col-md-9"><InputText type="password" @input="newUserPasswordOK=true;editUserPasswordsNotMatchOK=true" id="editUserPassword" v-model="editUserPassword" />
             <InlineMessage v-if="!editUserPasswordOK">This field is required</InlineMessage>
             <InlineMessage v-if="!editUserPasswordsNotMatchOK">Passwords do NOT match!</InlineMessage>
            </div>
           </div>

           <div class="row insertFormRow align-items-center  even">
             <div class="col-md-3"><label for="editUserPasswordRepeat">Repeat password</label></div>
             <div class="col-md-9"><InputText type="password" @input="newUserPasswordRepeatOK=true;editUserPasswordsNotMatchOK=true" id="editUserPasswordRepeat" v-model="editUserPasswordRepeat" />
                <InlineMessage v-if="!editUserPasswordRepeatOK">This field is required</InlineMessage>
                <InlineMessage v-if="!editUserPasswordsNotMatchOK">Passwords do NOT match!</InlineMessage>
            </div>

           </div>
           
           <div class="row" style="margin-top:30px">
              <div class="col-md-6 text-start">
                  <Button class="redButton" label="Cancel" @click="newPasswordDialogVisible=false"></Button>
              </div>
              <div class="col-md-6 text-end">
                  <Button label="Change password" @click="changePassword"></Button>
            </div>   
          </div>

           
</Dialog>



</template>


<script>
// Primevue datatable help: https://www.primefaces.org/primevue/datatable //

import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from 'primevue/inputtext';
//import Checkbox from 'primevue/checkbox';

import Calendar from 'primevue/calendar';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InlineMessage from 'primevue/inlinemessage';
//import InputNumber from 'primevue/inputnumber';
//import TabView from 'primevue/tabview';
//import TabPanel from 'primevue/tabpanel';
import Dropdown from 'primevue/dropdown';

import axios from "axios";
import $ from "jquery";

// import jssha256 from "js-sha256";


import {FilterMatchMode,FilterOperator} from 'primevue/api';         // for filtering
import moment from "moment";


export default {
    props: ["systemId"],
    components: {
        DataTable,
        Column,
        InputText,
        //Checkbox,
        Button,
        Dialog,
        InlineMessage,
        Calendar,
        //InputNumber,
        //TabView,
        //TabPanel,
        Dropdown
        
    
  },

  emits:['extend-session'],
  
  data() {
        return {
            newPasswordDialogVisible:false,
            editUserPasswordsNotMatchOK:true,
            emailIsValid:true,
            displayDeleteConfirm:false,
            displayInfoDialog:false,
            InfoModalHeader:'',
            InfoModalMessage:'',
            infoDialogStyle:[{ width: '20rem' }],

            dataTable:'dataTable',
            editUserDialog:false,
            newUserDialog:false,
            userType : '',

            activeOptions: ["Yes", "No"],
            userTypeOptions:["Admin","User"],
            newUserLanguageOptions:["Lietuvių","English"],

            isLoading:false,
            tableHeight:'calc( 100vh - 215px)',
            allUsers:[],

            newUserName:'',
            newUserSurname:'',
            newUserEmail:'',
            newUserPassword:'',
            newUserPasswordRepeat:'',
            newUserIsActive:'',
            newUserLanguage:'',
            newUserActiveUntil:'',
            newUserType:'',
            
            newUserNameOK:true,
            newUserSurnameOK:true,
            newUserEmailOK:true,
            newUserPasswordOK:true,
            newUserPasswordRepeatOK:true,
            newUserIsActiveOK:true,
            newUserLanguageOK:true,
            newUserActiveUntilOK:true,
            newUserTypeOK:true,
            newUserPasswordsNotMatchOK:true,
            
            editUserName:'',
            editUserSurname:'',
            editUserEmail:'',
            editUserPassword:'',
            editUserPasswordRepeat:'',
            editUserIsActive:'',
            editUserIsActive2:'',
            editUserLanguage:'',
            editUserActiveUntil:'',
            editUserType:'',

            editUserNameOK:true,
            editUserSurnameOK:true,
            editUserEmailOK:true,
            editUserPasswordOK:true,
            editUserPasswordRepeatOK:true,
            editUserIsActiveOK:true,
            editUserIsActive2OK:true,
            editUserLanguageOK:true,
            editUserActiveUntilOK:true,
            editUserTypeOK:true,
            ediUserPasswordsNotMatchOK:true,
           
            filters: {
               'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
               'name':{operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]}, 
               'surname': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]}, 
               'email': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
               'isActive': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STRING}]},
               'type':     {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STRING}]},
              
            },
            matchModes: [
                    {label: 'Starts With', value: FilterMatchMode.STARTS_WITH},
                    {label: 'Contains', value: FilterMatchMode.CONTAINS},
                  
             ],
        }
    },
    mounted() {
        this.userType = (this.$store.getters.getUserType).toUpperCase();
        this.getAllUsers();
        this.moveSearchBoxToTop();
    },
    methods: {
      extendTime(){
          this.$emit('extend-session'); // extend time when session timeout popup will be shown
       
       },

        closeNewDialog(){
           this.newUserDialog=false;
        },
        closeEditDialog(){
           this. editUserDialog=false; 
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

     reorganizePagination(){
      $(".p-paginator-current").detach().appendTo('.p-paginator-left-content');
      $(".p-paginator-rpp-options").detach().appendTo('.p-paginator-right-content');
    },
    
    moveSearchBoxToTop(){
        //default search box is inside header of the datatable, must move to the top of the page
        $('#hereMoveSearch').empty();
        $("#searchBox").detach().appendTo('#hereMoveSearch');
    },
    displayPasswordChange(){

        this.newPasswordDialogVisible=true;
        this.resetErrors();
    },

    addUser(){
        this.resetInputFields();
       
        //show dialog for insert
        this.newUserDialog = true;
       
    },

    newUser(){
          this.resetErrors();

            var AllOk = true;

            if(this.newUserActiveUntil == ''){
            this.newUserActiveUntilOK = false;
            AllOk = false;
            }else{this.newUserActiveUntilOK = true;}
           
             if(this.newUserName == ''){
            this.newUserNameOK = false;
            AllOk = false;
            }else{this.newUserNameOK = true;}

            if(this.newUserSurname == ''){
            this.newUserSurnameOK = false;
            AllOk = false;
            }else{this.newUserSurnameOK = true;}

            if(this.newUserEmail == ''){
            this.newUserEmailOK = false;
            AllOk = false;
            }else{
                
               //more email cheking
               if(!this.isEmailVaid(this.newUserEmail)){
                    this.emailIsValid=false;
                    AllOk = false;
               }else{
                 this.newUserEmailOK = true;
               }
                
            
            }

           

            if(this.newUserPassword == ''){
            this.newUserPasswordOK = false;
            AllOk = false;
            }else{this.newUserPasswordOK = true;}

            if(this.newUserPasswordRepeat == ''){
            this.newUserPasswordRepeatOK = false;
            AllOk = false;
            }else{this.newUserPasswordRepeatOK = true;}

            if(this.newUserIsActive== ''){
            this.newUserIsActiveOK = false;
            AllOk = false;
            }else{this.newUserIsActiveOK = true;}

            if(this.newUserType == ''){
            this.newUserTypeOK = false;
            AllOk = false;
            }else{this.newUserTypeOK = true;}

            if(this.newUserLanguage == ''){
            this.newUserLanguageOK = false;
            AllOk = false;
            }else{this.newUserLanguageOK = true;}

            if(this.newUserPassword != '' &&  this.newUserPasswordRepeat != ''){
                if(this.newUserPassword != this.newUserPasswordRepeat){
                        this.newUserPasswordsNotMatchOK=false;
                 AllOk = false;
                }
            }
                    

            if(AllOk == true){
               this.insertUserToDatabase();
            }
    
        
     },
    async insertUserToDatabase(){
         this.isLoading = true;  
          

         const toDateFull =  this.format_date(moment(this.newUserActiveUntil,'DD/MM/YYYY HH:mm'),'YYYY-MM-DD');
       
         var type='';
         if( this.newUserType=='Admin'){
            type=0;
         }else{
            type=1;
         }

         var language='';
         if      ( this.newUserLanguage=='Lietuvių'){    language="LT";
         }else if( this.newUserLanguage=='English') {    language='EN';
         }

         var active='';
         if      ( this.newUserIsActive=='Yes'){    active=true;
         }else if( this.newUserIsActive=='No') {    active=false;
         }


           const sessionId=this.$store.getters.token;
           const baseUrl = localStorage.getItem("_rootRestUrl");
        
           let formData = JSON.stringify({"sessionId": sessionId,"usersToInsert": [ { "name": this.newUserName, "surname":  this.newUserSurname, "email":  this.newUserEmail, "password": this.newUserPassword, "language": language, "activeUntil":toDateFull, "isActive": active,"type":type}]});
       


            let config = {
              headers: {
                "Content-Type": "application/json",
            }};
  
            
            await axios
              .post(baseUrl + "/api/v1/User/Register",formData, config )
              .then(() => {
                                
                this.getAllUsers();
                            
                this.newUserDialog=false;           
                this.InfoModalHeader='Info';
                this.InfoModalMessage='User is added';
                this.infoDialogStyle=[{ width: '20rem' }];
                this.displayInfoDialog= true;

                this.isLoading = false; 
            })
              
              .catch((error) => {
            
                    if(error.response){
                        this.InfoModalHeader='Error!';
                        this.InfoModalMessage=error.response.data;
                        this.infoDialogStyle=[{ width: '40rem' }];
                        this.displayInfoDialog= true;
                       
                        console.warn(error.response.data); 
                    }   
                   
                    this.isLoading = false;   
                   
             });
             
             
             // after every request 
             this.$store.dispatch('autoLogin');  // go to AUTOLOGIN to extend "local" token valication
            this.extendTime(); // extend timeout to show expire session dialog
            // ---------------------
 
     },

     editUser(){
     
        this.resetErrors();

                var AllOk = true;

              
                if(this.editUserActiveUntil == '' || this.editUserActiveUntil == null){
                this.editUserActiveUntilOK = false;
                AllOk = false;
                }else{this.editUserActiveUntilOK = true;}

                if(this.editUserName == ''){
                this.editUserNameOK = false;
                AllOk = false;
                }else{this.editUserNameOK = true;}

                if(this.editUserSurname == ''){
                this.editUserSurnameOK = false;
                AllOk = false;
                }else{this.editUserSurnameOK = true;}

                if(this.editUserEmail == ''){
                this.editUserEmailOK = false;
                AllOk = false;
                }else{
                    //more email cheking
                        if(!this.isEmailVaid(this.editUserEmail)){
                                this.emailIsValid=false;
                                AllOk = false;
                        }else{
                            this.editUserEmailOK = true;
                        }
                
                 }

                if(this.editUserIsActive2== ''){
                this.editUserIsActive2OK = false;
                AllOk = false;
                }else{this.editUserIsActive2OK = true;}

                if(this.editUserType == ''){
                this.editUserTypeOK = false;
                AllOk = false;
                }else{this.editUserTypeOK = true;}

                if(this.editUserLanguage == ''){
                this.editUserLanguageOK = false;
                AllOk = false;
                }else{this.editUserLanguageOK = true;}

                if(this.editUserPassword != '' &&  this.editUserPasswordRepeat != ''){
                    if(this.editUserPassword != this.editUserPasswordRepeat){
                            this.editUserPasswordsNotMatchOK=false;
                    AllOk = false;
                    }
                }


           if(AllOk == true){
               this.UpdateUserInDatabase();
            }

     },

     async   UpdateUserInDatabase(){
            this.isLoading = true; 
           
            //check and convert date
            const activeUntilDate = this.format_date(moment(this.editUserActiveUntil,'DD/MM/YYYY'),'YYYY-MM-DD');
                            
           var type='';
            if( this.editUserType=='Admin'){
                type=0;
            }else{
                type=1;
            }
  
           var language='';
            if      ( this.editUserLanguage=='Lietuvių'){    language="LT";
            }else if( this.editUserLanguage=='English') {    language='EN';
            }
    
           var active='';
            if      ( this.editUserIsActive2=='Yes'){    active=true;
            }else if( this.editUserIsActive2=='No') {    active=false;
            }
  
  
             const sessionId=this.$store.getters.token;
             const baseUrl = localStorage.getItem("_rootRestUrl");
          
             let formData = JSON.stringify({"sessionId": sessionId, "user": { "userKey":this.ClickedRowId,"name": this.editUserName, "surname":  this.editUserSurname, "email":  this.editUserEmail, "language": language, "activeUntil":activeUntilDate, "isActive": active,"type":type}});
         
  
  
              let config = {
                headers: {
                  "Content-Type": "application/json",
              }};
    
              
              await axios
                .post(baseUrl + "/api/v1/User/EditUser",formData, config )
                .then(() => {
                                  
                  this.getAllUsers();
                              
                  this.editUserDialog=false;           
                  this.InfoModalHeader='Info';
                  this.InfoModalMessage='Changes are saved';
                  this.infoDialogStyle=[{ width: '20rem' }];
                  this.displayInfoDialog= true;
  
                  this.isLoading = false; 
              })
                
                .catch((error) => {
              
                      if(error.response){
                          this.InfoModalHeader='Error!';
                          this.InfoModalMessage=error.response.data;
                          this.infoDialogStyle=[{ width: '40rem' }];
                          this.displayInfoDialog= true;
                         
                          console.warn(error.response.data); 
                      }   
                     
                      this.isLoading = false;   
                     
               });
                
              // after every request 
              this.$store.dispatch('autoLogin');  // go to AUTOLOGIN to extend "local" token valication
            this.extendTime(); // extend timeout to show expire session dialog
            // ---------------------

        },

        deleteClick(){
            this.displayDeleteConfirm=true;
        },

    async    deleteUser(){
            //user already confirmed
           
         this.isLoading = true;  
           
         const sessionId=this.$store.getters.token;
         const baseUrl = localStorage.getItem("_rootRestUrl");
      
         let formData = JSON.stringify({sessionId:sessionId,email: this.editUserEmail});
     
          let config = {
            headers: {
              "Content-Type": "application/json",
          }};

          
         await  axios
            .post(baseUrl + "/api/v1/User/DeleteUser",formData, config )
            .then(() => {
                                
               this.getAllUsers();
              
               this.displayDeleteConfirm = false;
               this.displayInfoDialog= true;
               this.InfoModalHeader='Info';
               this.InfoModalMessage='User is deleted';
               this.isLoading = false; 
           })
            
           .catch((error) => {
            this.displayDeleteConfirm = false;
              if(error.response){
                  this.InfoModalHeader='Error!';
                  this.InfoModalMessage=error.response.data;
                  this.infoDialogStyle=[{ width: '40rem' }];
                  this.displayInfoDialog= true;
                 
                  console.warn(error.response.data); 
              }   
             
              this.isLoading = false;   
             
       });
        
           
              // after every request 
              this.$store.dispatch('autoLogin');  // go to AUTOLOGIN to extend "local" token valication
            this.extendTime(); // extend timeout to show expire session dialog
            // ---------------------



        },


     format_date_to_full(aDate,aTime){
   
        //excpected input: 14/04/2023
        var year = aDate.substring(6, 10);
        var month = aDate.substring(3, 5);
        var day = aDate.substring(0, 2);

        return year + '-' + month + '-' +day + " "+aTime;
        

        },


     resetErrors(){
        
           this.emailIsValid=true;
          this.newUserNameOK=true;
          this.newUserSurnameOK=true;
          this.newUserEmailOK=true;
          this.newUserPasswordOK=true;
          this.newUserIsActiveOK=true;
          this.newUserLanguageOK=true;
          this.newUserActiveUntilsOK=true;
          this.newUserTypeOK=true;
          this.newUserPasswordsNotMatchOK=true;

          this.editUserNameOK=true;
          this.editUserSurnameOK=true;
          this.editUserEmailOK=true;
          this.editUserPasswordOK=true;
          this.editUserIsActiveOK=true;
          this.editUserLanguageOK=true;
          this.editUserActiveUntilsOK=true;
          this.editUserTypeOK=true;
          this.ediUserPasswordsNotMatchOK=true;

          this.editUserPasswordsNotMatchOK=true;
        
     },

    resetInputFields(){
         //reset input and edit fields ;)
          this.newUserName='';
          this.newUserSurname='';
          this.newUserEmail='';
          this.newUserPassword='';
          this.newUserIsActive='';
          this.newUserLanguage='';
          this.newUserActiveUntil='';
          this.newUserType='';
          
        
          
          this.editUserName='';
          this.editUserSurname='';
          this.editUserEmail='';
          this.editUserPassword='';
          this.editUserIsActive='';
         
          this.editUserLanguage='';
          this.editUserActiveUntil='';
          this.editUserType='';

          this.editUserNameOK=true;
          this.editUserSurnameOK=true;
          this.editUserEmailOK=true;
          this.editUserPasswordOK=true;
          this.editUserIsActiveOK=true;
          this.editUserLanguageOK=true;
          this.editUserActiveUntilsOK=true;
          this.editUserTypeOK=true;
          this.ediUserPasswordsNotMatchOK=true;
       
        },
        editClick(){
        //show dialog for insert
        this.editUserDialog = true;
        },

    onRowClick(event) {
        
        // alert( event.data.id);
            this.ClickedRowId = event.data.id; // key for update
          
            this.editUserName = event.data.name;
            this.editUserSurname = event.data.surname;
            this.editUserEmail = event.data.email;
            this.editUserType = event.data.type;
            this.editUserLanguage = event.data.language;
            this.editUserIsActive = event.data.isActive;
            this.editUserIsActive2 = event.data.isActive2;
            this.editUserActiveUntil =  event.data.activeUntil;
           
  
          
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
            //here open panel, but for manage users don't need to open panel
            console.log(event)
        },

     async   getAllUsers(){
          this.isLoading = true; 

     

          const sessionId=this.$store.getters.token;
          const baseUrl = localStorage.getItem("_rootRestUrl");
          
          let formData = JSON.stringify({ sessionId: sessionId });
          let config = {
            headers: {
              "Content-Type": "application/json",
            },

          };

        await   axios
            .get(baseUrl + "/api/v1/User/Users/?sessionId="+sessionId+"", formData, config)
            .then((response) => {
               this.allUsers = response.data;
             
               this.correctData(); // correct some true/false and 1/0 tu values needed for dataTable to be sortable and filtered correctly
             
               this.reorganizePagination();
               this.isLoading = false; 
            })           
             .catch(function (error) {
                // handle error
               
          if(error.response){
                if(error.response.status=='401') { //not authorized, token expires
                //hm, I don't know why this three next lines not work :( so I made it "manual logout"
             
               // this.isLoading = false;  
               // this.$store.dispatch("logout");
               // this.$router.replace("/");

                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                localStorage.removeItem("userFullname");
                localStorage.removeItem("userType");
                localStorage.removeItem("tokenExpiration");
                localStorage.removeItem("expiresIn");
               

                document.location = '/';

               
                }
         
            }




            console.table(error)

           

             });


             // after every request 
             this.$store.dispatch('autoLogin');  // go to AUTOLOGIN to extend "local" token valication
            this.extendTime(); // extend timeout to show expire session dialog
            // ---------------------

             this.isLoading = false; 

        },
        format_date(value, pattern) {
            if (value) {
                return moment(String(value)).format(pattern);
            }
            },

       closeInfo(){
        this.displayInfoDialog=false;
        },

        changePassword(){
          this.resetErrors();
               var AllOk = true;

                if(this.editUserPassword == ''){
                this.editUserPasswordOK = false;
                AllOk = false;
                }else{this.editUserPasswordOK = true;}

                if(this.editUserPasswordRepeat == ''){
                this.editUserPasswordRepeatOK = false;
                AllOk = false;
                }else{this.editUserPasswordRepeatOK = true;}

                if(this.editUserPassword != '' &&  this.editUserPasswordRepeat != ''){
                    if(this.editUserPassword != this.editUserPasswordRepeat){
                             this.editUserPasswordsNotMatchOK=false;
                             AllOk = false;
                             alert(  this.editUserPasswordsNotMatchOK)
                    }

                   
                }
                        

                if(AllOk == true){
                    this.updateUserPasswordInDatabase();
                }



        },
       async updateUserPasswordInDatabase(){
            this.isLoading = true; 
           
            const sessionId=this.$store.getters.token;
            const baseUrl = localStorage.getItem("_rootRestUrl");

           // const encodedPassword = jssha256(this.editUserPassword);  // sha256
              const encodedPassword = this.editUserPassword;            // without sh256 ! for now if admin change password
         
            let formData = JSON.stringify({"sessionId":sessionId, "email":  this.editUserEmail,"password":encodedPassword});
        
  
             let config = {
               headers: {
                 "Content-Type": "application/json",
             }};
   
             
             await axios
               .post(baseUrl + "/api/v1/User/ChangePassword",formData, config )
               .then(() => {
                                 
                 this.getAllUsers();
                             
                 this.editUserDialog=false;   
                 this.newPasswordDialogVisible=false;          
                 this.InfoModalHeader='Info';
                 this.InfoModalMessage='Password is changed';
                 this.infoDialogStyle=[{ width: '20rem' }];
                 this.displayInfoDialog= true;
 
                 this.isLoading = false; 
             })
               
               .catch((error) => {
             
                     if(error.response){
                         this.InfoModalHeader='Error!';
                         this.InfoModalMessage=error.response.data;
                         this.infoDialogStyle=[{ width: '40rem' }];
                         this.displayInfoDialog= true;
                        
                         console.warn(error.response.data); 
                     }   
                    
                     this.isLoading = false;   
                    
              });
            // after every request 
            this.$store.dispatch('autoLogin');  // go to AUTOLOGIN to extend "local" token valication
            this.extendTime(); // extend timeout to show expire session dialog
            // ---------------------


        },


        isEmailVaid(email) {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return emailRegex.test(email);
        },

       
        correctData(){

            this.allUsers.forEach((value,index) => {
                  
               
                  const entries = Object.entries(value);

                   entries.forEach((value2) => {
                        
                        if(value2[0]=='type'){
                            var newType = '';
                            if(value2[1]==0){
                                newType="Admin";
                            }else{
                                newType="User";
                            }
                            this.allUsers[index]['type']=newType;
                        }
                       
                        if(value2[0]=='isActive'){
                            var newActive = '';
                            var newActive2 = '';
                            if(value2[1]==true){
                                newActive="Active";
                                newActive2="Yes"
                            }else{
                                newActive="Not active";
                                newActive2="No"
                            }
                            this.allUsers[index]['isActive']=newActive;
                            this.allUsers[index]['isActive2']=newActive2;
                        }
                        //newUserLanguageOptions:["Lietuvių","English"],

                        if(value2[0]=='language'){
                            var newLanguage = '';
                            if(value2[1]=='LT'){
                                newLanguage="Lietuvių";
                            }else if(value2[1]=='EN'){
                                newLanguage="English";
                            }
                            this.allUsers[index]['language']=newLanguage;
                          }

                          if(value2[0]=='activeUntil'){
                            var newdate = this.format_date(value2[1], 'DD/MM/YYYY')
                           
                            this.allUsers[index]['activeUntil']=newdate;
                           
                          }

                         
                   });


                });

        }


    },


}



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
#newTripButton{margin-left:0;height:34px;}
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

.pi-check{color:green}
.pi-times{color:red}

.p-button.p-button-danger.p-button-text, .p-buttonset.p-button-danger > .p-button.p-button-text, .p-splitbutton.p-button-danger > .p-button.p-button-text{color:#eee !important}

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

</style>