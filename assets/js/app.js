
// Definition of principal function of the app
var videoGen = function(){
   this.videoTimeLine = new videoTimeLine(_videoInfo); //create the app timeline object
   this.scriptGenerator = new sznVideoScript();
};

var sznAPI,app;

function sznConnect () {
   var conf = getConfig();
   if(!conf.accountID || !conf.templateID || !conf.templateSecret)
      alert("you need add the configuration of your sezion account");
   else{
      
      sznAPI = new SezionTemplateSDK (conf.accountID, conf.templateID, conf.templateSecret, conf.sezionHost, function (err) {
          if (err) {
           alert ("There were an error: "+JSON.stringify (err));
          }
          else {
               console.log('API Client created');
         }
     });
  }
}

$(function(){
   app = new videoGen();

   app.videoTimeLine.createNewBlock('block-intro');
   app.videoTimeLine.createNewBlock('block-end');

   // when click in the select new media menu generate a new media module for add media.
   $('#mediaSelection .dropdown-menu').on('click',function(e){
      var blockType = e.target.id.substring(e.target.id.indexOf('-')+1);
      if(_.contains(app.videoTimeLine.blockTypes,blockType)){
         app.videoTimeLine.createNewBlock(blockType);
      }
   });

   $('#generate-video').on('click',function(){
      if($('.video-block').length==0){
        alert('you need to add at least one content block');
        return;
     }
      if($('.video-block').hasClass('edit'))
         alert('It is necessary save all the blocks before generare the final video');
      else
         app.videoTimeLine.generateVideo();
   });

   sznConnect();
});
