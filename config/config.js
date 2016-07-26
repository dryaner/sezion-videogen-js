const ENV = "production";

/**
 * Configuration for different eviroments
 * @type {Object}
 */
const config = {
   production:{
      sezionHost     :  "https://sezion.com",
      
      accountID      :  "",  //you can find it in the admin home page at the left side
      templateID     :  "", //you can find it in the template edition page top on the left
      templateSecret :  "" // you can findi it in the themplate edition page top center
   }
};

/**
 * Information relative to a specific video structure. (defined in videoInfo.js)
 * @type {Object}
 */
var _videoInfo = _videoConf1;


/**
 *  predefined medias to upload in the block. You can define here
 *  Example:
 *  "element-name" : {
 *     url      : URL_TO_MEDIA  //just for url
 *     bucket   : AMAZON_BUCKET_NAME //just for Amazon
 *     key      : AMAZON_KEY_NAME  //just for Amazon
 *   }
 *   @type {Object}
 */
var   templateMedias ={
};

/**
 * Return the configuration of the enviroment indicated of the global enviroment.
 * @param  {String} env enviroment (optional)
 * @return {Object}  configuration for the selected enviroment   
 */
function getConfig(env){
   return config[(!!env) ? env : ENV];
}
