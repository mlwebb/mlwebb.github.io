define(function () {
  "use strict";
  function C_HiddenPrompt() {}
  C_HiddenPrompt.prototype.draw = function (oControlHost) {
    this.m_sParameterName =
      (oControlHost.configuration && oControlHost.configuration["Parameter"]) ||
      "pl";
    console.log(this.m_sParameterName);
    setTimeout(this.f_submit.bind(this, oControlHost), 0);
  };
  C_HiddenPrompt.prototype.f_submit = function (oControlHost) {
    oControlHost.valueChanged();
    //oControlHost.next();
  };
  C_HiddenPrompt.prototype.setData = function (oControlHost, oDataStore) {
    this.m_oDataStore = oDataStore;
    console.log(this.m_oDataStore);
  };
  C_HiddenPrompt.prototype.getParameters = function () {
    return [
      {
        parameter: this.m_sParameterName,
        values: [{ use: this.m_oDataStore.getCellValue(0, 0) }],
      },
    ];
  };
  return C_HiddenPrompt;
});
