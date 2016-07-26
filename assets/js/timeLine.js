// all the functions referent to the timeline
var videoTimeLine = function(videoInfo){
   this.blockTypes ={
      INTRO:   'block-intro',
      END:   'block-end'
   };

   this.textTypes ={

   };

   this.audioTypes ={

   };

   this.videoTypes ={
      full:   'video_full'
   };

   this.imageTypes ={

   };

   this.videoBlocks = [];
   this.video =  {
               name       : "szn videoGen",
               description: "default description from VideoGen",
               inputMedias: []
             };
   this.scriptFinal = [];
   
   // that extend the configuration that is defined in videoInfo.js  
   $.extend(true,this,videoInfo)
};

/**
 * Add a new media element to the timeline array
 * @param {[type]} block [description]
 */
videoTimeLine.prototype.setBlock = function (position,block) {
   this.videoBlocks.splice(position,0,block);
};

/**
 * remove a block element form the array of medias
 * @param {[type]} idblock [description]
 */
videoTimeLine.prototype.removeBlock = function (idblock) {
   var block = _.findWhere(this.videoBlocks,{idContainer:idblock});
   this.videoBlocks = _.reject(this.videoBlocks,block);
};

/**
 * add the element that are defined always in the final video but could change
 * the media (dynamic media). the script and the media should have the same num
 * of elements.
 * if the media come from sezion the media need to have a sezionID.
 * @param {[type]} script the script object to add in scriptFinal
 * @param {[type]} medias  The media object array to merge with the video.inputMedias array.
 */
videoTimeLine.prototype.addExtraElements = function (script, medias) {
   if (script.length == medias.length) {
      $.merge(this.scriptFinal,script);
      $.merge(this.video.inputMedias,medias);
   }
};

videoTimeLine.prototype.createNewBlock = function (blockType) {
   var newVideoBlock = new videoBlock(blockType);
   var endBlockExist = $('[id^=block-end]').length;
   //creating the new element and adding to the timeLine


   var markUp = newVideoBlock.getBlockMarkUp();
   if(endBlockExist){
      $('[id^=block-end]').before(markUp);
   }else{
      $('#timeLine').append(markUp);
   }
   this.setBlock($('.video-block').index($('#'+newVideoBlock.idContainer)),newVideoBlock);
   newVideoBlock.registerEvents();
   // updating the default values in dom and medias array when de markup is inserted in the DOM
   $.each(newVideoBlock.elems,function(){
      this.setDefaultValues();
   });
};
// update the script positions for play and duration
videoTimeLine.prototype.updatePositions = function () {
   var that = this;
   $.each(this.videoBlocks,function(i){
      var block = this;
      var prevBlockid = (i>0) ? that.videoBlocks[i-1].id : -1;
      $.each(this.elems,function(j){
            this.setElemScript(prevBlockid,block.id);
      });
   });
};

videoTimeLine.prototype.generateVideo = function () {

   this.scriptFinal = [];
   this.video.inputMedias = [];

   this.updatePositions();

   var elems = _.flatten(_.pluck(this.videoBlocks,'elems'));
   var scriptNew = _.pluck(elems,'script');
   var mediasNew = _.pluck(elems,'inputMedia');
   this.addExtraElements(scriptNew,mediasNew);
   // alert('you're video is generating');
   console.log(JSON.stringify(this.scriptFinal));
   this.video.inputScripts = [JSON.stringify(this.scriptFinal)];
   this.video.data=$('#metadata').val();
   sznAPI.VideoNew (this.video, function (err, videoID) {

       if (err) {
         alert ("There were an error: "+JSON.stringify (err));
       }
       else {
         alert ("video generated correctly: ");
       }
   });

};
