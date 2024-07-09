define(() => {
  class CustomDesignControl {
    static f_htmlEncode = (s) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    static initialization = {
      configuration: {
        Label: "Popup Label",
        Tooltip: "",
        Color: "",
        Parameters: [
          {
            Parameter_Name: "pBasic_Param1",
            dataSetName: {
              col_type: "",
              col_type_comment: "Use category, value, or measure",
              name: "",
              column_name: "",
            },
          },
          {
            Parameter_Name: "p_DateParam",
            type: "date",
            note: "dates must be in CCYY-MM-DD format",
            useColumns: false,
            Multiple_Select: true,
            dataSourceType: "static",
            dataSourceType_comment: "Use static or dataset",
            dataSetName: {
              col_type: "",
              col_type_comment: "Use category, value, or measure",
              name: "",
              Range: [
                {
                  start_columnName: null,
                  end_columnName: null,
                },
              ],
              Value: { use_valueName: "", display_valueName: "" },
            },
            Date_Range: [
              {
                start: "1900-01-01",
                end: "",
              },
            ],
            Value: [],
          },
        ],
      },
      path: "../v1/ext/Hidden_Prompt/Hidden_Prompt",
    };

    static configOptions = {
      allowJsonEdit: true,
      topLevelProperties: {
        Label: {
          tooltip: "The label to display beside the icon",
        },
        Tooltip: {
          tooltip: "The tooltip displayed when hvoering over the label or icon",
        },
        Color: {
          type: "color",
          tooltip: "The foreground color",
        },
        /*"Hover color":
          {
              type: "color",
              tooltip: "The foreground color used when hovering"
          },*/
      },
    };

    static properties = {
      visibility: {
        show: ["ccConfiguration"],
      },
      labels: {
        ccConfiguration: "Options",
      },
      descriptions: {
        ccConfiguration: "Hidden Prompt options",
      },
    };

    static dataSets = {
      limits: {
        max: 0,
      },
    };

    static toolboxLocation = {
      group: {
        id: "toolboxLayoutLabel",
        location: "first",
      },
    };

    static draw(nCustomControl) {
      const oConfig = JSON.parse(
        nCustomControl.querySelector("configuration").textContent
      );
      const sPadding = oConfig.Label ? "" : "padding:0;";
      const sColor = oConfig.Color ? `color:${oConfig.Color};` : "";
      const sLabel = oConfig.Label
        ? `<DIV class="clsPopupLabel">${this.f_htmlEncode(oConfig.Label)}</DIV>`
        : "";
      const sIcon = oConfig["SVG Icon"];
      return `<div class="clsPopup"><div class="clsPopup" style="${sColor}${sPadding}">${sLabel}</div></div>`;
    }

    static drawConfiguration(nCustomControl, sConfiguration) {
      return "(Defined)";
    }

    static initModule() {
      const v_elLink = document.createElement("LINK");
      v_elLink.setAttribute("rel", "stylesheet");
      v_elLink.setAttribute(
        "href",
        "../v1/ext/Hidden_Prompt/hidden_prompt.css"
      );
      document.querySelector("HEAD").appendChild(v_elLink);
    }
  }
  CustomDesignControl.initModule();

  return CustomDesignControl;
});
