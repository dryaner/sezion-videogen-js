var SezionAPIEndPoint = "https://sezion.com";

SezionTemplateSDK = function (accountID, templateID, templateSecret, SznAPIEndPoint, callback) {

  if (SznAPIEndPoint) { SezionAPIEndPoint = SznAPIEndPoint; }
  self = this;

  this.Script = function () {};

  this.accountID      = accountID;
  this.templateID     = templateID;
  this.templateSecret = templateSecret;
  this.url            = SezionAPIEndPoint+"/api?accountID="+accountID+"&templateID="+templateID+"&templateSecret="+templateSecret;
  this.client = Barrister.httpClient (this.url);
  this.client.loadContract (function(err) {
    if (err) {
      callback (err);
    }
    else {
      self.SezionAPI = self.client.proxy ("SezionAPI");
      callback (null);
    }
  });

}

//this function generate a new video based in the template sended to the construct.
SezionTemplateSDK.prototype.VideoNew = function (video, callback) {

  this.SezionAPI.Template_Video_New (this.templateID, video, function (err, videoID) {
    callback (err, videoID);
  });
}

//this function upload a media type video, audio or image
SezionTemplateSDK.prototype.MediaUpload = function (file, name, description, progress, callback) {

  var self = this;
  var formData = new FormData();

  formData.append ('uploadFile-', file);

  $.ajax ({
    url: SezionAPIEndPoint+"/api/upload?accountID="+self.accountID+"&templateID="+self.templateID+"&templateSecret="+self.templateSecret,
    type: "POST",
    data: file,
    dataType: "json",
    contentType: file.type,
    async:true,
    cache:false,
    processData: false,

    xhr: function(){
      var xhr = $.ajaxSettings.xhr() ;
      if (progress) {
        xhr.upload.onprogress = function(evt){
          progress (evt.loaded/evt.total*100);
        };
      }
      xhr.upload.onload = function(){ } ;
      return xhr;
    },

    beforeSend: function (request) {
      request.setRequestHeader ("X-SZN-Filename",    file.name);
      request.setRequestHeader ("X-SZN-Description", description);
    },
    error: function (xhr, textStatus, errorThrown) {
      callback ('AJAX Error: ' + textStatus + '-' + errorThrown + ' - ' + xhr.responseText);
    },
    success: function (data, textStatus, xhr) {
      callback (data.error, data.media);
    }
  });

}
