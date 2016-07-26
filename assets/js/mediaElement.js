// all the functions referent to a media
// if you receive a blockid that mean that this media is the main media.
// The main media it's used like referent for next or previous blocks
var mediaElement = function(type, name, prevBlockId, blockid, main, visible){
   console.log('mediaElement: ',type);

   this.type = type;
   this.mediaType;
   this.id = (main)? "main_"+blockid : _.uniqueId(this.type+'_');
   this.name = name;
   this.visible = visible;
   this.script = {};
   this.inputMedia = {};
   this.markUp = '';
   this.mainElem = main;

   this.setMediaType();
   this.setElemScript(prevBlockId,blockid);
   this.setInputMedia();
   this.setMediaMarkUp();

};


mediaElement.prototype.setMediaType = function () {
   if(_.contains(app.videoTimeLine.textTypes,this.type)){
      this.mediaType = 'text';
   } else if(_.contains(app.videoTimeLine.imageTypes,this.type)){
      this.mediaType = 'image';
   } else if(_.contains(app.videoTimeLine.videoTypes,this.type)){
      this.mediaType = 'video';
   } else if(_.contains(app.videoTimeLine.audioTypes,this.type)){
      this.mediaType = 'audio';
   }else{
      alert('el Elemento '+this.type+' no existe');
   }
};

mediaElement.prototype.setElemScript = function (prevBlockId, blockid) {
   this.script[this.mediaType] = app.scriptGenerator.getElement(this.type);
   this.script[this.mediaType].id = this.id;

   if(prevBlockId!=-1)
      this.script[this.mediaType].play = "main_"+prevBlockId+ this.script[this.mediaType].play;
   else
      this.script[this.mediaType].play = 0;
   var duration = this.script[this.mediaType].duration;
   if (blockid && typeof(duration) == 'string' && duration.indexOf('.')==0) {
      this.script[this.mediaType].duration = "main_"+blockid+ this.script[this.mediaType].duration;
   }
};


mediaElement.prototype.setInputMedia = function () {
   var newInputMedia = {
      inputID: this.id,  // the Dynamic Media ID
      type: this.mediaType
   };
   this.inputMedia = newInputMedia;
};

/**
 * generate the markup for the new media element added to the timeline
 * @return {String}           markup of the element to add in the timeline DOM
 */
mediaElement.prototype.setMediaMarkUp= function(){
   var markUpType ;

   if(this.mediaType=="text"){
      markUpType = '<input id="media-'+this.id+'" type="text" class="form-control media-element" placeholder="descriptive text">';

   }else if(this.mediaType=="video" || this.mediaType=="audio" || this.mediaType=="image"){
      markUpType = ''+
         '<div id="media-'+this.id+'" class="media-element">'+
            '<select id="media-select-'+this.id+'" class="media-select">'+
               '<option value="file" selected>From my PC</option>'+
               '<option value="url">URL</option>'+
               '<option value="aws">Amazon</option>'+
            '</select>'+
            '<input id="media-file-'+this.id+'" type="file" class="media-option file">'+
            '<input id="media-url-'+this.id+'" type="text" class="media-option url" placeholder="media url">'+
            '<div id="media-aws-'+this.id+'" class="media-option aws">'+
               '<input id="media-aws-bucket-'+this.id+'" class="aws-bucket" type="text" placeholder="Bucket">'+
               '<input id="media-aws-key-'+this.id+'" class="aws-key" type="text" placeholder="Key (file name)">'+
            '</div>'+
         '</div>';
   }

   this.markUp = markUpType;
};

/**
 * Set the default values for this media (if exist)
 */
mediaElement.prototype.setDefaultValues = function () {
   if(this.name){

      var mediaInfo = templateMedias[this.name];
      if(!!mediaInfo){
         if(mediaInfo.url){
            $('#media-select-'+this.id)
               .val('url')
               .trigger('change');
            $('#media-url-'+this.id).val(mediaInfo.url);
            
            this.updateMedia('url',mediaInfo.url);
         }else if(mediaInfo.bucket && mediaInfo.key){
            $('#media-select-'+this.id)
               .val('aws')
               .trigger('change');
            $('#media-aws-bucket-'+this.id).val(mediaInfo.bucket);
            $('#media-aws-key-'+this.id).val(mediaInfo.key);
            this.updateMedia('aws',mediaInfo);
         }
      }
      if(!this.visible){
         $('#media-'+this.id).hide();
      }
   }
};


mediaElement.prototype.getElemScript = function () {
   return this.script;
};

mediaElement.prototype.getInputMedia = function () {
   return this.inputMedia;
};

mediaElement.prototype.getMediaMarkUp = function () {
   return this.markUp;
};

mediaElement.prototype.uploadFileToSezion = function (file) {
   var that = this;

   sznAPI.MediaUpload (file, file.name, app.videoTimeLine.video.name+' '+that.id, that.uploadProgress, function (err, sezionMedia) {
      if (err) {
        if (err) alert ("There were an error: "+JSON.stringify (err));
      }
      else {
         console.log(sezionMedia.id);
         that.inputMedia.sezionID = sezionMedia.id;
      }
   });
};

mediaElement.prototype.uploadProgress = function (percent) {
   var $progressBar= $('#media-'+this.id).closest('.file-input').find('.progress-bar');
   $progressBar
      .css ('width', percent+'%')
      .html(percent+'%');
};


mediaElement.prototype.updateMedia = function (uploadType,data) {
   if(this.mediaType == 'text'){
      this.inputMedia.text = $('#media-'+this.id).val();
   }else{
      switch (uploadType) {
         case 'file':
            this.uploadFileToSezion($('#media-file-'+this.id).get(0).files[0]);
            break;
         case 'aws':
            this.inputMedia.awsS3 = data;
            break;
         case 'url':
            this.inputMedia.http = data;
            break;
         default:

      }
   }

};

/**
 * Launch the structure for add a new file for image,video and audio.
 */
mediaElement.prototype.addFileInput= function(){
   switch (this.mediaType) {
      case 'text':
         break;
      case 'image':
         $("#media-file-"+this.id)
            .fileinput({
               language: "es",
               showUpload: false,
               allowedFileExtensions: ["jpg", "png", "gif"]
            });
         break;
      case 'video':
         $("#media-file-"+this.id).fileinput({
            language: "es",
            showUpload: false,
            allowedFileExtensions: ["mp4", "mpeg", "mpg", "avi", "mkv", "mov", "3gp", "webm", "wmv"]
         });
         break;
      case 'audio':
         $("#media-file-"+this.id).fileinput({
            language: "es",
            showUpload: false,
            allowedFileExtensions: ["mp3", "wav", "m4a", "ogg"]
         });
         break;
      default:
   }
   $("#media-file-"+this.id).on('fileuploaded', function(event, data, previewId, index) {
       console.log('File uploaded triggered');
       console.log(data.response);

   });

};
