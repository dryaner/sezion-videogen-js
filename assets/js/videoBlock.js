var videoBlock = function(type){
   console.log('videoblock: ',type);
   this.blockType = type;
   this.id = _.uniqueId();
   this.idContainer = this.blockType+'_'+this.id;
   this.elems = [];

   this.createBlockElements();
};

videoBlock.prototype.createBlockElements = function () {
   var videoLastIndex = app.videoTimeLine.videoBlocks.length - 1;
   if($('[id^=block-end]').length)
      videoLastIndex--;
   var prevBlockId = (videoLastIndex >= 0) ? app.videoTimeLine.videoBlocks[videoLastIndex].id : -1;
   switch (this.blockType) {
      case 'block-intro':
      case 'block-end':
      case 'block-video':
         this.elems.push(new mediaElement('video_full',this.blockType.replace('-',''),prevBlockId, this.id, true,true)); //main element
         break;
      case 'block-qoute_with_image':
         this.elems.push(new mediaElement('image','cciImage1',prevBlockId, this.id, true,true)); //main element
         this.elems.push(new mediaElement('qoute_with_image-text_Quote_Azul','ccitext_Quote_Azul',prevBlockId, this.id, false,true));
         break;
      case 'block-title_with_video':
         var   video = new mediaElement('title_with_video-video','video',prevBlockId, this.id, true,true), //main element
               tcvtext_Titular_1 = new mediaElement('text_Titular_1','tcvtext_Titular_1',prevBlockId, this.id, false,true);
         this.elems.push(video, tcvtext_Titular_1);
         break;
      case 'block-imagen':
         this.elems.push(new mediaElement('image','iImage1',prevBlockId, this.id, true,true)); //main element
         break;

      default:
   }
};

videoBlock.prototype.getPrevBlockId = function () {
   var index = _.findIndex(app.videoTimeLine.videoBlocks,{id:this.id});
   if(index != -1){
      return app.videoTimeLine.videoBlocks[index-1].id;
   }
   return -1;
};


/**
 * add a script from a variable with a json string
 * @param  {object} script the script to add
 */
// videoBlock.prototype.addScriptFromVar = function(newScript){
//    $.extend(this.script,newScript);
// };

/**
 * generate the markup for the new media element added to the timeline
 * @param  {string} elemets split by , to add in the dom
 * @return {String}           markup of the element to add in the timeline DOM
 */
videoBlock.prototype.getBlockMarkUp= function(elements){
   var markUpBlock = '';

   $.each(this.elems, function(){
      markUpBlock+= this.getMediaMarkUp();
   });


   var markUp = ''+
               '<article id="'+this.idContainer+'" class=" video-block row text edit">'+
                  '<div class="col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2">'+
                     '<header class="row">'+
                        '<div class="col-xs-8 col-xs-offset-2 text-center media-title">'+this.blockType+'</div>'+
                        '<div class="col-xs-2">'+
                           '<button type="button" class="btn btn-default remove">'+
                             '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>'+
                           '</button>'+
                        '</div>'+
                     '</header>'+
                     '<section class="row main-section">'+
                        '<div class="col-xs-10 col-xs-offset-1">'+
                           markUpBlock +
                        '</div>'+
                     '</section>'+
                     '<footer class="row">'+
                        '<div class="col-xs-4 col-xs-offset-4">'+
                           '<button type="button" class="media-done btn btn-success center-block">Save</button>'+
                           '<button type="button" class="media-edit btn btn-success center-block">Edit</button>'+
                        '</div>'+
                     '</footer>'+
                  '</div>'+
               '</article>';

   return markUp;
};

videoBlock.prototype.saveElements = function () {
   $.each(this.elems, function(){
      var selectElem = $('#media-'+this.id).find('select'),
          uploadType = (selectElem.length) ? selectElem.val() : '',
          data;
      if(uploadType=='url'){
         data = $('#media-'+this.id).find('.media-option.url').val();
      }else if (uploadType=='aws') {
         data = {
            "bucket" : $('#media-'+this.id).find('.aws-bucket').val(),
            "key"    : $('#media-'+this.id).find('.aws-key').val()
         };
      }
      this.updateMedia(uploadType,data);
   });
};

/**
 * Register all the event relatives at this media structure
 * @return {[type]} [description]
 */
videoBlock.prototype.registerEvents = function () {
   var that = this;
   $container = $('#'+this.idContainer);
   $container
      .on('click','.btn.remove',function(){
         app.videoTimeLine.removeBlock(that.idContainer);
         $(this).closest('.video-block')
            .fadeOut(300,function() { $(this).remove(); });
         console.log('remove');
      })
      .on('click','.media-done',function(){
         console.log('save');
         $(this).closest('.video-block').removeClass('edit');
         that.saveElements();
      })
      .on('click','.media-edit',function(){
         $(this).closest('.video-block').addClass('edit');
      })
      .on('change','.media-select',function(){
         console.log('change media select');
         var $elem = $(this).closest('.media-element');
         $elem.find('.media-option').hide();
         $elem.find('.media-option.'+$(this).val()).show();
         if($(this).val()=='file')
            $elem.find('.file-input').show();
         else
            $elem.find('.file-input').hide();

      });
   $.each(this.elems, function(){
      this.addFileInput();
   });
   $container.find('.media-select').trigger('change');
};
