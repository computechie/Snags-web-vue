<template>
   
   <swiper
    :modules="modules"
    :thumbs="{ swiper: thumbsSwiper }"
      :slides-per-view="2"
      :space-between="30"
      navigation
      :pagination="{ clickable: true }"
      @swiper="onSwiper"
     
    >
      <swiper-slide class="swiperSlideHolder" v-for="(tripImage,index) in tripImages" v-bind:key="tripImage.key" >
         <img @click="zoomImages(tripImage.key, index)" :src="baseUrl+methodName+parameter+tripImage.key+'&t='+timestamp" class="swiperImagesSide">
         <div class="deleteImageButton">
            <Button v-if="userType=='ADMIN'" @click="sendBackIdForDelete(tripImage.key)" v-tooltip.left="'Delete photo'" icon="fa-stack-1x fa-solid fa-trash-can" label="" severity="danger" class="deleteImageButton"></Button>
         </div>
      </swiper-slide>
         
    </swiper>

   
    <Dialog   :position="'top'"  
              v-model:visible="visibleImagesModal" 
              modal
              :style="{ width: '80%' } "  
              :pt="{mask: {style: 'backdrop-filter: blur(2px)' }  }"  
              :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
              class="zoomImageDialog"
              >
              

         <template #header>
          
              <div class="row" style="width:100%">
                <div class="col-md-12  text-center">
                   <h5>{{ openedcargoname }} </h5>                
                    
                </div>
              
               
              </div>
             
             
          
        </template>

    
       <!-- One image-->
       <!-- <div :class="'zoomedImageHolder'" >
            <img :src="zoomedImageSource" :class="'zoomedImageClass'+ rotationClass">
        </div>-->

       <!-- or carousel again-->
       <div :class="'zoomedImageHolder'" >
            <swiper
            :modules="modules"
            :thumbs="{ swiper: thumbsSwiper }"
            :slides-per-view="1"
            :space-between="10"
            navigation
            :pagination="{ clickable: true }"
            @swiper="onSwiper1"
            @slideChangeTransitionEnd="onSlideChange"
           
            ref="swiperTop"
          >
            <swiper-slide  class="swiperSlideHolder" v-for="(tripImage,index) in tripImages" v-bind:key="tripImage.key">
             
              <img  :src="baseUrl+methodName+parameter+tripImage.key+'&t='+timestamp" :id="tripImage.key" :index="index">
           
              
             <div class="row justify-content-center">
              <div class="col-md-6 text-center">
                <div class="snagNotes">{{ notes }}</div>
                
              </div>
             </div>
            

             </swiper-slide>
             
           

          </swiper>
          <div class="row">
            <div class="col-md-4 text-start">
              </div>
            <div class="col-md-4 text-center">
             <!-- <a  v-tooltip.top="{ value: 'Rotate photo', showDelay: 1000, hideDelay: 300 }" href="javascript:"  @click="rotateZoomedImage(zoomedImageId)" style="font-size:30px" ><i class="pi pi-undo rotateIcon"></i></a>
             --> 
              <Button v-tooltip.bottom="'Rotate image'" icon="pi pi-undo rotateIcon" @click="rotateZoomedImage(zoomedImageId)"  class="downloadImageButton" style="margin-right:30px"/>
              <Button v-tooltip.bottom="'Download photo'" icon="pi pi-download" @click="downloadImage(zoomedImageId)" class="downloadImageButton"/>
            </div>
            <div class="col-md-4 text-end">
              
              <Button v-if="userType=='ADMIN'" @click="photoIdForDelete=zoomedImageId;displayDeletePhotoConfirm=true" v-tooltip.top="{ value: 'Delete photo', showDelay: 1000, hideDelay: 300 }" icon="pi pi-trash" class="deletePhotoButton" label="Delete photo"></Button>
             
            </div>
         </div>
          
  </div>  
      <!-- ------------------------------ -->


       <template #footer>
         
       
       </template>

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
                  <Button label="Yes, delete" @click="deletePhoto(photoIdForDelete)"></Button>
            </div>   
          </div>
           
</Dialog>



  </template>
  <script>
  

  // import Swiper core and required components
  import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
  import Button from 'primevue/button';
  import { Thumbs } from 'swiper/modules';

  // Import Swiper Vue.js components
  import { Swiper, SwiperSlide } from "swiper/vue";
  
  import 'swiper/css';
  import 'swiper/css/navigation';
  import 'swiper/css/scrollbar';
  import Dialog from 'primevue/dialog';
 // import Image from 'primevue/image';

  
 import axios from "axios";
  import $ from "jquery";


   // Import Swiper styles
  export default {
    props:['notes','tripImages','openedcargoname','userType'],
    components: {
      Swiper,
      SwiperSlide,
      Dialog,
      Button
    
    },
    emits:['showloader', 'swiper', 'deletePhoto', 'deletePhotomodal'],
    setup() {
      const onSwiper = () => {
       // console.log(swiper);
       
       
      };

          
      return {
        onSwiper,SwiperSlide,Thumbs,
       
        modules: [Navigation, Pagination, Scrollbar, A11y],
      };
    },

    data() {
      return {
        SnagNotes:this.notes,
        thumbsSwiper:'',
        timestamp : Date.now(),
        swiper:'',
        defaultSlideTo : 0,
        displayDeletePhotoConfirm:false,
        zoomedImageId: '',
        photoIdForDelete:'',
        visibleImagesModal: false,
        baseUrl : localStorage.getItem("_rootRestUrl"),
        methodName : '/api/Attachments/ViewPhoto',
        methodNameDownload: '/api/Attachments/DownloadPhoto',
        parameter : '?photoKey=',
        zoomedImageSource : '',
        zoomedImageClass : 'zoomedImage',
        rotationClass:'',
        rotate:0,
      
      }
    },

    methods: {
      onSwiper1(swiper) {
        this.swiper = swiper
        this.swiper.slideTo(this.defaultSlideTo);
        

    },

    downloadImage(){
    
      this.$emit('showloader',true);
   
         /* var downloadURL = this.baseUrl+this.methodName+this.parameter+this.zoomedImageId+'&='+this.timestamp;
          const link = document.createElement('a');
          link.href = downloadURL;
          link.download = 'download';
          link.target = '_blank';
          link.click();
          URL.revokeObjectURL(link.href)*/

         const index=$('#'+this.zoomedImageId).attr('index');
         const filename = this.tripImages[index]['caption'];

         var downloadURL = this.baseUrl+this.methodNameDownload+this.parameter+this.zoomedImageId+'&='+this.timestamp;

          axios.get(downloadURL, { responseType: 'blob' })
          .then(response => {
            const blob = new Blob([response.data], { type: 'image/jpeg' })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.id= Date.now();
            link.download = filename;
            link.click();
            URL.revokeObjectURL(link.href);

            this.$emit('showloader',false);

          }).catch(console.error)

        

    },
    
      
      zoomImages(imageKey, index){
          
       


            var imageId = this.tripImages[index];
            this.zoomedImageId=imageId['key'];

            this.zoomedImageSource = this.baseUrl+this.methodName+this.parameter+imageKey;
            this.rotate = 0;
            this.zoomedImageClass = 'zoomedImage';
            this.visibleImagesModal = true;
            this.rotationClass = '';
            
           // alert(index)

            this.defaultSlideTo = index;
            this.loading = false;
          },

     async rotateZoomedImage(imageId){

            this.$emit('showloader',true);

                         
              var newPhotoUrlRequest = this.baseUrl+this.methodName+this.parameter+imageId +'&rotate=true&t='+this.timestamp;
              const sessionId=localStorage.getItem("token");
            
             

             let formData = JSON.stringify({ sessionId: sessionId });
                let config = {
                  headers: {
                    "Content-Type": "application/json",
                  },

                };
              
               // this.timestamp = Date.now();

              await axios
                .get(newPhotoUrlRequest, formData, config)
                .then(() => {
                  this.timestamp = Date.now();
                //   var newPhotoUrl = this.baseUrl+this.methodName+this.parameter+imageId +'&t='+this.timestamp;
                
                 //  $('#'+imageId).attr('src',newPhotoUrl)
                
                 setTimeout(() =>  this.$emit('showloader',false), 375);
                 
                })           
                .catch(function (error) {
                    // handle error
                    console.table(error);
                 //   this.$emit('showloader',false);
                });

               
               
             
          },

          sendBackIdForDelete(imageId){
              this.displayDeletePhotoConfirm = true;
              this.photoIdForDelete=imageId;
             
              this.$emit('delete-photo',imageId);
          },

          sendBackIdForDeleteModal(imageId){
              this.displayDeletePhotoConfirm = true;
              this.photoIdForDelete=imageId;
           
          },
          deletePhoto(photoId){
            
            this.$emit('delete-photomodal',photoId);
            this.visibleImagesModal = false;
            this.displayDeletePhotoConfirm = false;
          },
         

          onSlideChange() {
            var imageId = $('.zoomedImageHolder .swiper .swiper-wrapper .swiper-slide-active img').attr('id')
            this.zoomedImageId=imageId;
           
          },
    },
  mounted(){
   // alert(this.tripImages)
    
  },
 
  };
  </script>

  <style>
.swiperSlideHolder img{width:100%}

.p-dialog-mask {backdrop-filter: blur(2px)}

.zoomedImage{width:100%}
.rotateIcon{
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}

.rotate90{
  -webkit-transform:rotate(90deg);
  -moz-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  -o-transform: rotate(900deg);
  transform: rotate(90deg);
}
.rotate180{
  -webkit-transform:rotate(180deg);
  -moz-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  transform: rotate(180deg);
}
.rotate270{
  -webkit-transform:rotate(270deg);
  -moz-transform: rotate(270deg);
  -ms-transform: rotate(270deg);
  -o-transform: rotate(270deg);
  transform: rotate(270deg);
}



/*.zoomedImageHolder{height:calc(100vh - 120px);width:100%;background-size: contain; background-repeat:no-repeat;background-position: center;}*/
.zoomedImageHolder{height:100%;width:100%;}
.zoomedImageHolder img {
  display: block;
  max-width:100%;
  max-height:calc(100% - 50px);
  width: auto;
  height: auto;
  margin:auto;
}
.zoomedImageHolder .swiper, .zoomedImageHolder .swiper-wrapper, .zoomedImageHolder .swiper-wrapper{
  max-height:calc(100% - 30px);
}
.zoomedImageHolder .swiper, .zoomedImageHolder .swiper-wrapper{
  height:calc(100vh - 30px);
}


.p-dialog .p-dialog-footer{padding-top:5px !important;padding-bottom:5px !important}
.p-dialog .p-dialog-header{padding-top:5px !important;padding-bottom:5px !important}

.p-dialog-content{height:calc(100vh - 100px);padding-top: 10pxL;overflow-y: hidden;}

.deleteImageButton .p-button{
  background:  rgb(170, 0, 0) !important;
  border: rgb(170, 0, 0) !important;
  position:absolute;
  top:3px;
  right:3px;
  padding:1px !important;
}
.deleteImageButton .p-button:hover{
  background:  rgb(120, 0, 0) !important;
  border: rgb(120, 0, 0) !important;
 
}

.p-button.deletePhotoButton{
  background:  rgb(170, 0, 0) !important;
  border: rgb(170, 0, 0) !important;
  padding:5px !important;
}
.p-button.deletePhotoButton:hover{
  background:  rgb(120, 0, 0) !important;
  border: rgb(120, 0, 0) !important;
}

.p-tabview .p-tabview-panels{padding:10px !important}

.zoomImageDialog{height:calc(100vh - 25px;);max-height: unset !important;}
.zoomImageDialog .p-dialog-content {height: calc(100vh - 80px);}

.downloadImageButton{
 /* position: absolute !important;
  right: 75px !important;*/
  padding: 2px !important;
}

h5 {display:inline-block}

.p-dialog{max-height: 90% !important}

.snagNotes{background: #fff;
  border: 1px solid #bbb;
  margin: 4px;
  min-height: 50px;
  max-height: 50px;
  overflow-y: auto;
  font-size: 85%;}
</style>