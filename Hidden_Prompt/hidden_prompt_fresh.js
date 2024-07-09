define(function () {
  "use strict";
  function C_HiddenPrompt() {
    this.m_aParameters = [];
  }
  C_HiddenPrompt.prototype.draw = function (oControlHost) {
    const divPopupBlock = oControlHost.container.closest( 'DIV[specname="block"]' );
		if ( !divPopupBlock )
		{
			throw new scriptableReportError( "Popup", "draw", "The popup control must be located inside the block to popup." );
		}
		if ( divPopupBlock.style.display !== "none" )
		{
			throw new scriptableReportError( "Popup", "draw", 'The block to popup must have "Box type" set to "None-Block".' );
		}

    this.m_aParameters =
      (oControlHost.configuration &&
        oControlHost.configuration["Parameters"]) ||
      [];
    setTimeout(this.f_submit.bind(this, oControlHost), 0);
  };
  C_HiddenPrompt.prototype.f_submit = function (oControlHost) {
    oControlHost.valueChanged();
    oControlHost.next();
  };
  C_HiddenPrompt.prototype.setData = function (oControlHost, oDataStore) {
    this.m_oDataStore = oDataStore;
  };
  C_HiddenPrompt.prototype.formatDate = function (dateString) {
    if (!dateString) return null;
    let date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Extract date in YYYY-MM-DD format
  };
  C_HiddenPrompt.prototype.getParameters = function () {
    var parameters = [];
    this.m_aParameters.forEach((parameter) => {
      if (parameter["type"] === "single-value-text") {
        let columnIndex = this.m_oDataStore.getColumnIndex(
          parameter["Column_name"]
        );
        if (!isNaN(columnIndex)) {
          parameters.push({
            parameter: parameter["Parameter Name"],
            values: [{ use: this.m_oDataStore.getCellValue(0, columnIndex) }],
          });
        }
      } else if (parameter["type"] === "multi-value-text") {
        let columnIndex = this.m_oDataStore.getColumnIndex(
          parameter["Column_name"]
        );
        if (!isNaN(columnIndex)) {
          let values = [];
          for (let i = 0; i < this.m_oDataStore.rowCount; i++) {
            values.push({
              use: this.m_oDataStore.getCellValue(i, columnIndex),
            });
          }
          parameters.push({
            parameter: parameter["Parameter Name"],
            values: values,
          });
        }
      } else if (parameter["type"] === "date") {
        let values = [];
        if (parameter["useColumns"]) {
          let earliestDateColumn = parameter["Columns"]
            ? parameter["Columns"]["Earliest Date Column"]
            : null;
          let latestDateColumn = parameter["Columns"]
            ? parameter["Columns"]["Latest Date Column"]
            : null;

          if (
            earliestDateColumn &&
            earliestDateColumn["type"] &&
            latestDateColumn &&
            latestDateColumn["type"]
          ) {
            let startDateValue = null;
            let endDateValue = null;

            if (earliestDateColumn["type"] === "Value") {
              let index = earliestDateColumn["index"];
              if (
                typeof index === "number" &&
                this.m_oDataStore.getCell(0, index)
              ) {
                startDateValue = this.m_oDataStore.getCell(0, index).value;
              }
            } else if (earliestDateColumn["type"] === "Categories") {
              let earliestDateColumnIndex = this.m_oDataStore.getColumnIndex(
                earliestDateColumn["column_name"]
              );
              if (!isNaN(earliestDateColumnIndex)) {
                startDateValue = this.m_oDataStore.getCellValue(
                  0,
                  earliestDateColumnIndex
                );
              }
            }

            if (latestDateColumn["type"] === "Value") {
              let index = latestDateColumn["index"];
              if (
                typeof index === "number" &&
                this.m_oDataStore.getCell(index, 0)
              ) {
                endDateValue = this.m_oDataStore.getCell(index, 0).value;
              }
            } else if (latestDateColumn["type"] === "Categories") {
              let latestDateColumnIndex = this.m_oDataStore.getColumnIndex(
                latestDateColumn["column_name"]
              );
              if (!isNaN(latestDateColumnIndex)) {
                endDateValue = this.m_oDataStore.getCellValue(
                  0,
                  latestDateColumnIndex
                );
              }
            }

            console.log(`Start Date Value: ${startDateValue}`);
            console.log(`End Date Value: ${endDateValue}`);

            let dateObj = {
              start: startDateValue
                ? {
                    use: this.formatDate(startDateValue),
                    display: this.formatDate(startDateValue),
                  }
                : null,
              end: endDateValue
                ? {
                    use: this.formatDate(endDateValue),
                    display: this.formatDate(endDateValue),
                  }
                : null,
            };
            values.push(dateObj);
          } else {
            console.error("Column configuration is invalid or missing types");
          }
        } else {
          // Check if Date_Range exists and has values
          if (parameter["Date_Range"] && parameter["Date_Range"].length > 0) {
            parameter["Date_Range"].forEach((dateSelection) => {
              let paramObj = {};

              // Check for start and end dates in Date_Range
              if (dateSelection.start) {
                paramObj.start = {
                  use: dateSelection.start,
                  display: dateSelection.start,
                };
              }
              if (dateSelection.end) {
                paramObj.end = {
                  use: dateSelection.end,
                  display: dateSelection.end,
                };
              }

              // Ensure there's something to add to values
              if (Object.keys(paramObj).length > 0) {
                values.push(paramObj);
              }
            });
          } else if (parameter["Value"] && parameter["Value"].length > 0) {
            // Check if Value exists and has values
            parameter["Value"].forEach((valueObj) => {
              let paramObj = {
                use: valueObj,
                display: valueObj,
              };
              values.push(paramObj);
            });
          }
        }
        if (!parameter["Multiple_Select"]) {
          values = [values[0]]; // Single select means only one date set is allowed
        }
        parameters.push({
          parameter: parameter["Parameter Name"],
          values: values,
        });
      }
    });
    return parameters;
  };
  return C_HiddenPrompt;
});
