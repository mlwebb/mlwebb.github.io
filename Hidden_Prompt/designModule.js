define(() => {
  class CustomDesignControl {
    static f_htmlEncode = (s) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    static initialization = {
      configuration: {
        Label: "Hidden Auto Prompt",
        Tooltip: "",
        Color: "",
        dev_Path:
          "https://mlwebb.github.io/Hidden_Prompt/hidden_prompt_fresh.js",
          Parameter: "p_BasicParam1",
        Parameters: [
          {
            Parameter_Name: "pBasic_Param1",
            dataSourceType: "dataset",
            dataSourceType_comment: "Use static or dataset",
            useDataSet: {
              col_type: "",
              col_type_comment: "Use category, value, or measure",
              dataSetName: "",
              columnName: "",
              isFirstRow: false,
              comment:
                "isFirstRow determines if you just want the value from the first row to be used in parameter",
            },
            defaultValue: {
              use_valueName: "",
              display_valueName: "",
            },
            defaultStringValue:
              "This is a static string value that will set as a default parameter and bypass the dataset logic",
          },
          {
            Parameter_Name: "p_DateParam",
            type: "date",
            note: "dates must be in CCYY-MM-DD format",
            Multiple_Select: true,
            useDataSet: {
              col_type: "",
              col_type_comment: "Use category, value, or measure",
              dataSetName: "",
              isFirstRow: false,
              comment:
                "isFirstRow determines if you just want the value from the first row to be used in parameter",
              Range: [
                {
                  start_columnName: null,
                  end_columnName: null,
                },
              ],
              defaultValue: {
                use_valueName: "",
                display_valueName: "",
              },
              defaultStringValue:
                "This is a static string value that will set as a default parameter and bypass the dataset logic",
            },
            Date_Range: [
              {
                start: "1900-01-01",
                end: "",
              },
            ],
            defaultValue: {
              use_valueName: "",
              display_valueName: "",
            },
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
          tooltip: "The tooltip displayed when hovering over the label or icon",
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
        show: [
          "ccConfiguration",
          "ccDescription",
          "ccUiType",
          "ccPath",
          // "ccHeight",
          // "ccWidth",
          // "ccName",
        ],
      },
      labels: {
        ccConfiguration: "Options",
        ccDescription: "Description",
        ccPath: "File Path",
        ccUiType: "UiType"
        // ccHeight:"",
        // ccWidth:"",
        // ccName:""
      },
      descriptions: {
        ccConfiguration:
          "Configuration JSON to auto fill specific parameters and proceed to Next page without alerting user",
        ccDescription: "",
        ccPath: "",
        ccUiType: "UiType"
        // ccHeight:"",
        // ccWidth:"",
        // ccName:""
      },
    };

    static dataSets = {
      limits: {
        max: 10,
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
