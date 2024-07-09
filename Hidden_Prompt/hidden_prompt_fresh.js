define( function() {
  "use strict";
  function C_HiddenPrompt()
  {
  };
  C_HiddenPrompt.prototype.draw = function( oControlHost )
  {
      this.m_sParameterName = ( oControlHost.configuration && oControlHost.configuration["Parameter"] ) || "pl";
      this.n_ParameterValue = (oControlHost.configuration && oControlHost.configuration["ParameterValue"]) || ""
      setTimeout( this.f_submit.bind( this, oControlHost ), 0 );
  };
  C_HiddenPrompt.prototype.f_submit = function( oControlHost )
  {
      oControlHost.valueChanged();
      oControlHost.next();
  };
  C_HiddenPrompt.prototype.setData = function( oControlHost, oDataStore )
  {
      this.m_oDataStore = oDataStore;
      console.log(oDataStore)
  };
  C_HiddenPrompt.prototype.getParameters = function()
  { console.log(oDataStore)
      return [{
          "parameter": this.m_sParameterName,
          "values": [{ "use" : this.m_oDataStore.getCellValue( 0, 0 ) }]
      }];
  };

  C_HiddenPrompt.prototype.getDatastore = function(oDataStore)
  {
    if (this.m_oDataStore) {
      console.log("DatastoreName",this?.m_oDataStore?.name || "none")
    } 
  };
  return C_HiddenPrompt;
  });