define(() => {
  "use strict";

  class C_HiddenPrompt {
    constructor() {
      this.m_sParameterName = "pl";
    }
    static m_oStyleSheetPromise;
    static initModule() {
      const d = document;
      const v_elLink = d.createElement("LINK");
      v_elLink.setAttribute("rel", "stylesheet");
      this.m_oStyleSheetPromise = new Promise(
        (fnResolve) => (v_elLink.onload = fnResolve)
      ); // eslint-disable-line no-return-assign, no-promise-executor-return
      v_elLink.setAttribute(
        "href",
        "../v1/ext/Hidden_Prompt/hidden_prompt.css"
      );
      d.querySelector("HEAD").appendChild(v_elLink);
    }
    initialize = () => C_HiddenPrompt.m_oStyleSheetPromise;

    draw(oControlHost) {
      this.m_sParameterName =
        (oControlHost.configuration &&
          oControlHost.configuration["Parameter"]) ||
        "pl";
      console.log(oControlHost.getParameter(this.m_sParameterName));
      oControlHost.container.innerHTML = `<div id="${oControlHost.generateUniqueID()}">${oControlHost.getParameter(
        this.m_sParameterName
      )}</div>`;

      setTimeout(() => this.f_submit(oControlHost), 0);
    }

    f_submit(oControlHost) {
      oControlHost.valueChanged();
      oControlHost.next();
    }

    setData(oControlHost, oDataStore) {
      this.m_aDataStore[oDataStore.name] = oDataStore;
    }

    getParameters(oControlHost) {
      return [
        {
          parameter: this.m_sParameterName,
          values: [{ use: this.m_oDataStore.getCellValue(0, 0) }],
        },
      ];
    }
  }
  C_HiddenPrompt.initModule();
  return C_HiddenPrompt;
});
