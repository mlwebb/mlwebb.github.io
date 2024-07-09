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
    initialize (oControlHost, fnDoneInitializing) {
      C_HiddenPrompt.m_oStyleSheetPromise;
      fnDoneInitializing();
    }  

    draw(oControlHost) {
      this.m_sParameterName =
        (oControlHost.configuration &&
          oControlHost.configuration["Parameter"]) ||
        "pl";
      console.log(oControlHost.getParameter(this.m_sParameterName));
      const oConfig = oControlHost.configuration ?? {};
      const divPopupBlock = oControlHost.container.closest(
        'DIV[specname="block"]'
      );
      if (!divPopupBlock) {
        throw new scriptableReportError(
          "Popup",
          "draw",
          "The popup control must be located inside the block to popup."
        );
      }
      const elDetails = document.createElement("DETAILS");
      const sPadding = oConfig.Label ? "" : "padding:0;";
      const sColor = oConfig.Color ? `color:${oConfig.Color};` : "";
      const sLabel = oConfig.Label ? '<DIV class="clsPopupLabel"></DIV>' : "";
      const sIcon = oConfig["SVG Icon"] ?? "";
      elDetails.innerHTML = `<SUMMARY class="clsPopup" style="${sColor}${sPadding}">${sIcon}${sLabel}</SUMMARY><DIV class="clsDetailPopup"></DIV>`;
      if (oConfig.Label) {
        elDetails.querySelector(".clsPopupLabel").textContent = oConfig.Label;
      }
      if (oConfig.Tooltip) {
        elDetails.querySelector("SUMMARY").title = oConfig.Tooltip;
      }
      divPopupBlock.replaceWith(elDetails);
      elDetails.querySelector("DIV.clsDetailPopup").append(divPopupBlock);

      setTimeout(() => this.f_submit(oControlHost), 0);
    }

    f_submit(oControlHost) {
      oControlHost.valueChanged();
      oControlHost.next();
    }

    setData(oControlHost, oDataStore) {
      this.m_oDataStore = oDataStore;
      this.m_aDataStoreName[oDataStore.name] = oDataStore;
      console.log(this.m_aDataStoreName)
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
