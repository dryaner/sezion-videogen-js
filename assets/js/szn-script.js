// all the functions referent to a script and the final script.
var sznVideoScript = function(){
};

/**
 * Return the script settings of  a element
 * @param  {String} type   name of the elements settings
 * @param  {Object} params  to add new temporal settings in a element (no developed)
 * @return {Object} the settings of the element in a JSON structure.
 */
sznVideoScript.prototype.getElement = function (type, params) {
      return $.extend({},scriptElemOptions[type]);

};
