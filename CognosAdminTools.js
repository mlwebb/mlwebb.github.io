  // Function to create and append styles
function createAndAppendStyles() {
  const style = document.createElement("style");
  style.textContent = `
  .custom-toast {
    position: fixed;
    top: 100px;
    right: 100px;
    background: #333;
    color: white;
    padding: 15px 20px;
    border-radius: 4px;
    width: 300px;
    max-width: 300px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    opacity: 0;
    transition: all 0.3s ease-in-out;
    display: flex;
    flex-direction: column;
  }
    .custom-toast-progress-main {
    position: fixed;
    top: calc(100vh - 136px);
    left: 50%;
    transform: translate(-50%, -50%);
    background: #333;
    color: white;
    padding: 15px 20px;
    border-radius: 4px;
    width: 60%;
    max-width: 60%;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    display: flex;
    flex-direction: column;

}
  
  .custom-toast.show {
    opacity: 1;
  }
  
  .custom-toast-close {
    position: absolute;
    top: 5px;
    right: 5px;
    background: none;
    border: none;
    color: white;
    font-size: 16px;
    cursor: pointer;
    padding: 0;
    line-height: 1;
    opacity: 0.7;
    transition: opacity 0.2s ease-in-out;
  }
  
  .custom-toast-close:hover {
    opacity: 1;
  }
  
  .custom-toast-content {
    margin-right: 15px;
  }
  .custom-toast-title {
    font-weight: bold;
    margin-bottom: 5px;
  }
  .custom-toast-success {
    width: 300px;
    background-color: #28a745;
  }
  .custom-toast-error {
    width: 300px;
    background-color: #dc3545;
  }
  .custom-toast-warning {
    width: 300px;
    background-color: #ffc107;
    color: #333;
  }
  .custom-toast-info {
    background-color: #17a2b8;
    width: 300px;
  }
  .custom-toast-progress {
    background: rgba(255,255,255,0.3);
    height: 4px;
    width: 100%;
    top: 200px;
    margin-top: 10px;
  }
  .custom-toast-progress-bar {
    background: #fff;
    height: 100%;
    width: 0%;
    transition: width 0.3s ease-in-out;
  }`;
  document.head.appendChild(style);
}
  // Store active toasts
  var activeToasts = {};
  const toastStack = [];
  const maxVisibleToasts = 5;
  const toastSpacing = 10; // pixels between toasts
  const initialTopPosition = 20; // pixels from top of screen

  window.showToast = function (
    message,
    titleOrOptions = {},
    durationOrOptions = {},
    additionalOptions = {}
  ) {
    let title = "";
    let duration = 5000;
    let options = { type: "info" };

    // Parse arguments
    if (typeof titleOrOptions === "string") {
      title = titleOrOptions;
      if (typeof durationOrOptions === "number") {
        duration = durationOrOptions;
        options = { ...options, ...additionalOptions };
      } else if (typeof durationOrOptions === "object") {
        options = { ...options, ...durationOrOptions };
      }
    } else if (typeof titleOrOptions === "object") {
      options = { ...options, ...titleOrOptions };
    }

    // Validate type
    const validTypes = ["success", "error", "warning", "info"];
    if (!validTypes.includes(options.type)) {
      console.warn(
        `Invalid toast type: ${options.type}. Defaulting to 'info'.`
      );
      options.type = "info";
    }

    // Generate unique ID
    let id = generateUniqueId();

    // Create toast element
    var toast = document.createElement("div");
    toast.className = `custom-toast custom-toast-${options.type}`;
    toast.id = "toast-" + id;

    // Add close button
    var closeButton = document.createElement("button");
    closeButton.className = "custom-toast-close";
    closeButton.innerHTML = "&#x2715;"; // X symbol
    closeButton.onclick = function () {
      removeToast(id);
    };
    toast.appendChild(closeButton);

    // Create content wrapper
    var contentWrapper = document.createElement("div");
    contentWrapper.className = "custom-toast-content";

    // Add title if provided
    if (title) {
      var titleElement = document.createElement("div");
      titleElement.className = "custom-toast-title";
      titleElement.textContent = title;
      contentWrapper.appendChild(titleElement);
    }

    // Add message
    var messageElement = document.createElement("div");
    messageElement.textContent = message;
    contentWrapper.appendChild(messageElement);

    // Add content wrapper to toast
    toast.appendChild(contentWrapper);

    // Add close button
    var closeButton = document.createElement("button");
    closeButton.className = "custom-toast-close";
    closeButton.innerHTML = "&#x2715;"; // X symbol
    closeButton.onclick = function () {
      removeToast(id);
    };
    toast.appendChild(closeButton);

    // Add to DOM
    document.body.appendChild(toast);

    // Add to stack and update positions
    addToastToStack(toast);

    // Trigger reflow to enable transition
    toast.offsetHeight;

    toast.classList.add("show");

    // Store the toast
    activeToasts[id] = {
      element: toast,
      type: options.type,
    };

    // Set timeout for removal if duration is not Infinity
    if (duration !== Infinity) {
      setTimeout(function () {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  // Helper function to generate unique ID
  function generateUniqueId() {
    let id;
    do {
      id = "toast_" + Math.random().toString(36).substr(2, 9);
    } while (id in activeToasts);
    return id;
  }

  function addToastToStack(toast) {
    // Add new toast to the beginning of the array
    toastStack.unshift(toast);

    // Update positions of all toasts
    updateToastPositions();

    // If we exceed the max visible toasts, remove the oldest one
    if (toastStack.length > maxVisibleToasts) {
      const oldestToast = toastStack.pop();
      fadeOutToast(oldestToast);
    }
  }

  function updateToastPositions() {
    let cumulativeHeight = initialTopPosition;

    toastStack.forEach((toast, index) => {
      toast.style.top = cumulativeHeight + "px";
      cumulativeHeight += toast.offsetHeight + toastSpacing;
    });
  }

  function fadeOutToast(toast) {
    toast.style.opacity = "0";
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300); // Match this to your CSS transition time
  }

  // Modify removeToast function
  function removeToast(id) {
    var toast = activeToasts[id];
    if (toast) {
      const index = toastStack.indexOf(toast.element);
      if (index > -1) {
        toastStack.splice(index, 1);
      }
      fadeOutToast(toast.element);
      delete activeToasts[id];
      updateToastPositions();
    }
  }

  // Custom toast function with progress bar
  window.showProgressToast = function (totalCount, message, title = "") {
    console.log("showProgressToast called", { totalCount, message, title });

    var toast = document.createElement("div");
    toast.className = "custom-toast-progress-main";
    let id = generateUniqueId();
    toast.id = id;

    if (title) {
      var titleElement = document.createElement("div");
      titleElement.className = "custom-toast-title";
      titleElement.textContent = title;
      toast.appendChild(titleElement);
    }

    var messageElement = document.createElement("div");
    messageElement.textContent = message;
    toast.appendChild(messageElement);

    var progressContainer = document.createElement("div");
    progressContainer.className = "custom-toast-progress";
    var progressBar = document.createElement("div");
    progressBar.className = "custom-toast-progress-bar";
    progressContainer.appendChild(progressBar);
    toast.appendChild(progressContainer);

    document.body.appendChild(toast);

    // Force reflow
    void toast.offsetWidth;

    // Set initial opacity to 0 and then change it to 1
    toast.style.opacity = "0";
    setTimeout(() => {
      toast.style.opacity = "1";
    }, 10);

    activeToasts[id] = {
      element: toast,
      progressBar: progressBar,
      totalCount: totalCount,
      currentCount: 0,
    };

    console.log("Toast created with ID:", id);

    updateProgressToast(id, 0); // Initialize with 0 progress
    return id;
  };

  window.updateProgressToast = function (id, increment = 1, newMessage = null) {
    console.log("updateProgressToast called", { id, increment, newMessage });

    var toast = activeToasts[id];
    if (!toast) {
      console.error("Toast with id " + id + " not found");
      return;
    }

    toast.currentCount += increment;
    var percentage = Math.min(
      (toast.currentCount / toast.totalCount) * 100,
      100
    );
    toast.progressBar.style.width = percentage + "%";

    if (newMessage !== null) {
      var messageElement = toast.element.querySelector(
        "div:not(.custom-toast-title):not(.custom-toast-progress)"
      );
      if (messageElement) {
        messageElement.textContent = newMessage;
      }
    }

    console.log(`Toast ${id} progress: ${percentage}%`);

    if (percentage >= 100) {
      console.log(`Toast ${id} completed, scheduling removal`);
      setTimeout(function () {
        if (activeToasts[id]) {
          console.log(`Removing toast ${id}`);
          toast.element.style.opacity = "0";
          setTimeout(function () {
            if (document.body.contains(toast.element)) {
              document.body.removeChild(toast.element);
              console.log(`Toast ${id} removed from DOM`);
            }
            delete activeToasts[id];
            console.log(`Toast ${id} deleted from activeToasts`);
          }, 300);
        }
      }, 1000);
    }
  };

  window.listToasts = function () {
    let toastList = [];

    for (let id in activeToasts) {
      let toast = activeToasts[id];
      let type = toast.progressBar ? "Progress" : "Error";
      let progress = toast.progressBar
        ? ((toast.currentCount / toast.totalCount) * 100).toFixed(2)
        : null;

      toastList.push({
        id: id,
        type: type,
        progress: progress ? parseFloat(progress) : null,
        message: toast.element.textContent.trim(),
        element: toast.element,
      });
    }

    return toastList;
  };
  window.removeToast = function (id) {
    var toastId = "toast-" + id;
    var toast = document.getElementById(toastId);

    if (toast && activeToasts[id]) {
      // Start the fade out animation
      toast.classList.remove("show");
      toast.style.opacity = "0";

      // Wait for the animation to complete before removing the element
      setTimeout(function () {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
        delete activeToasts[id];
      }, 300); // 300ms matches the transition time in the CSS

      return true; // Toast found and removal process started
    } else {
      console.warn("Toast with id " + id + " not found");
      return false; // Toast not found
    }
  };

  // Function to check if a toast is complete
  window.isToastComplete = function (id) {
    return !activeToasts[id];
  };

// Initialization function
function initializeToastSystem() {
  createAndAppendStyles();
  // Any other initialization code
}

// Call the initialization function when the script loads
initializeToastSystem();


async function fetchObjectInfo(id, outputType) {
  const defaultParams = {
    schemaInfo: true,
    fields: [
      "ancestors",
      "base.defaultName",
      "base.options",
      "base.permissions",
      "camIdentity",
      "canBurst",
      "contact",
      "creationTime",
      "defaultDescription",
      "defaultName",
      "defaultPortalAction",
      "defaultScreenTip",
      "description",
      "disabled",
      "effectiveUserCapabilities",
      "extensions",
      "hasChildren",
      "hidden",
      "iconURI",
      "id",
      "modificationTime",
      "name",
      "name.locale",
      "options",
      "owner",
      "owner.defaultName",
      "owner.id",
      "permissions",
      "policies",
      "policies.defaultName",
      "policies.permissions",
      "policies.searchPath",
      "runInAdvancedViewer",
      "searchPath",
      "searchPathForURL",
      "specification",
      "tags",
      "target.disabled",
      "target.searchPath",
      "tenantID",
      "type",
      "usage",
      "userCapabilities",
      "userCapabilityPolicies",
      "userCapabilityPolicies.defaultName",
      "userCapabilityPolicies.permissions",
      "userCapabilityPolicies.searchPath",
      "userInterfaces",
    ],
  };
  try {
    // Convert the params object into a query string
    const queryString = `schemaInfo=${
      defaultParams.schemaInfo
    }&fields=${defaultParams.fields.join(",")}`;

    // Construct the URL
    const url =
      __glassAppController.glassContext.gateway +
      `/v1/objects/${id}?${queryString}`;

    const response =
      await __glassAppController.glassContext.services.services.ajax.ajax({
        type: "GET",
        dataType: "json",
        url: url,
      });

    // Return the specified field from the response if outputType is provided
    if (outputType && response.data[0][outputType] !== undefined) {
      return response.data[0][outputType];
    } else {
      return response.data && response.data[0] ? response.data[0] : null;
    }
  } catch (error) {
    console.error("Error fetching info for Object ID:", id, error);
    // Additional logging for debugging
    console.error("Response Status:", error.status);
    console.error("Response Text:", error.statusText);
    return null;
  }
}

async function fetchFolderObjects(id, objectType) {
  try {
    const url =
      __glassAppController.glassContext.gateway +
      `/v1/expressbus/content-manager?searchPath=storeID('${id}')//${objectType}&properties=id,defaultName`;

    const response =
      await __glassAppController.glassContext.services.services.ajax.ajax({
        type: "GET",
        dataType: "json",
        url: url,
      });

    return response;
  } catch (error) {
    console.error("Error fetching info for Object ID:", id, error);
    // Additional logging for debugging
    console.error("Response Status:", error.status);
    console.error("Response Text:", error.statusText);
    return null;
  }
}

async function fetchFolderObjectTypes(id) {
  try {
    const url =
      __glassAppController.glassContext.gateway +
      `/v1/expressbus/content-manager?searchPath=storeID('${id}')//*&properties=id`;

    const response =
      await __glassAppController.glassContext.services.services.ajax.ajax({
        type: "GET",
        dataType: "json",
        url: url,
      });
    const mappedResponse = response.map((item) => {
      return {
        id: item.id,
        type: item.type,
      };
    });
    const uniqueTypes = [...new Set(mappedResponse.map((item) => item.type))];

    return uniqueTypes;
  } catch (error) {
    console.error("Error fetching info for Object ID:", id, error);
    // Additional logging for debugging
    console.error("Response Status:", error.status);
    console.error("Response Text:", error.statusText);
    return null;
  }
}

// Define objectTypes with integrated handler functions
const objectTypes = {
  report: {
    titleMessage: "Report Action",
    descMessage: "report",
    actions: {
      action1: {
        name: "Get All Report Filters",
        execute: async (objectDetails) => {
          console.log(
            "Get All Filters",
            generateAndDownloadSingleReportFiltersCSV(objectDetails)
          );
        },
      },
      action2: {
        name: "Get All Report Information",
        execute: async (objectDetails) => {
          generateAllReportInfo(objectDetails);
        },
      },
    },
  },
  folder: {
    titleMessage: "Folder Action",
    descMessage: "folder",
    actions: {
      action1: {
        name: "Get All Object Types in Folder",
        execute: async (objectDetails) => {
          console.log(await fetchFolderObjectTypes(objectDetails.id));
          //   console.log("folder action1");

          // Implement folder action 1 logic here
        },
      },
      action2: {
        name: "Get list of reports",
        execute: async (objectDetails) => {
          await generateAndDownloadReportListCSV(objectDetails);
          // Implement folder action 2 logic here
        },
      },
      action3: {
        name: "Get All Filters in all reports in Folder",
        execute: async (objectDetails) => {
          await generateAndDownloadFiltersCSV(objectDetails);
        },
      },
      action4: {
        name: "Export All Report Info (JSON)",
        execute: async (objectDetails) => {
          await generateJSONAllReportsInfo(objectDetails);
        },
      },
      action4: {
        name: "Show Toast",
        execute: async (objectDetails) => {},
      },
    },
  },
  exploration: {
    titleMessage: "Exploration Action",
    descMessage: "exploration",
    message: "Exploration Action",
    actions: {
      action1: {
        name: "Action 1",
        execute: async (objectDetails) => {
          console.log("exploration action1");
          // Implement exploration action 1 logic here
        },
      },
      action2: {
        name: "Action 2",
        execute: async (objectDetails) => {
          console.log("exploration action2");
          // Implement exploration action 2 logic here
        },
      },
    },
  },
};

async function showDialogAndGetObjectId() {
  // Fetch the selectionId
  let defaultSelectionId = "";
  const currentAppViewContent =
    __glassAppController.glassContext.currentPerspective.getCurrentContentView();

  if (currentAppViewContent && currentAppViewContent.selectionId) {
    defaultSelectionId = currentAppViewContent.selectionId;
  } else if (currentAppViewContent && currentAppViewContent.folder) {
    defaultSelectionId = currentAppViewContent.folder;
  }

  // Fetch object info before creating the dialog
  let objectDetails;
  try {
    objectDetails = await fetchObjectInfo(defaultSelectionId);
  } catch (error) {
    console.error("Error fetching object info:", error);
    objectDetails = { type: "unknown" };
  }

  return new Promise((resolve, reject) => {
    __glassAppController.glassContext.getCoreSvc(".Dialog").createDialog({
      title: "Export Object Details",
      message: `
                Enter ${getActionDescTextHtml(
                  objectDetails.type
                )} object ID into text area below<br>
                <input id="ObjectIDexport" placeholder="Object ID" aria-label='objectID Export' tabindex='0' style='width: 75%; font-size: 16px; font-size: max(16px, 1em); font-family: inherit; padding: 0.25em 0.5em; background-color: #fff; border: 2px solid #8b8a8b; border-radius: 4px;' value='${defaultSelectionId}'><br><br>
                
                <label for="actionSelect">Select Action:</label><br>
                <select id="actionSelect" aria-label='action Select' style='width: 75%; font-size: 16px; font-size: max(16px, 1em); font-family: inherit; padding: 0.25em 0.5em; background-color: #fff; border: 2px solid #8b8a8b; border-radius: 4px;'>
                    <option value="">--Select Action--</option>
                    ${getActionOptionsHtml(objectDetails.type)}
                </select>`,
      className: "info",
      buttons: ["ok", "cancel"],
      width: "50%",
      type: "info",
      size: "default",
      htmlContent: true,
      callback: {
        ok: () => handleOkCallback(resolve, reject),
        cancel: () => handleCancelCallback(reject),
      },
      callbackScope: { ok: this, cancel: this },
      payload: { url: __glassAppController.Glass.getUrl() },
    });

    setupEventListeners(objectDetails, reject);
  });
}

function getActionOptionsHtml(objectType) {
  if (objectTypes[objectType]) {
    const actions = objectTypes[objectType].actions;
    return Object.entries(actions)
      .map(([key, action]) => `<option value='${key}'>${action.name}</option>`)
      .join("");
  }
  return "";
}
function getActionTitleTextHtml(objectType) {
  if (objectTypes[objectType]) {
    const titleMessage = objectTypes[objectType].titleMessage;
    return titleMessage;
  }
  return "";
}
function getActionDescTextHtml(objectType) {
  if (objectTypes[objectType]) {
    const descMessage = objectTypes[objectType].descMessage;
    return descMessage;
  }
  return "";
}

function setupEventListeners(initialObjectDetails, reject) {
  const observer = new MutationObserver(() => {
    const objectIDInput = document.getElementById("ObjectIDexport");
    const actionSelect = document.getElementById("actionSelect");
    const closeButton = document.querySelector(
      ".ba-common-dialog__closeX button"
    );

    if (objectIDInput && actionSelect) {
      objectIDInput.addEventListener("input", async () => {
        const objectID = objectIDInput.value;
        if (objectID) {
          try {
            const newObjectDetails = await fetchObjectInfo(objectID);
            actionSelect.innerHTML = `<option value=''>--Select Action--</option>${getActionOptionsHtml(
              newObjectDetails.type
            )}`;
          } catch (error) {
            console.error("Error fetching object info:", error);
            actionSelect.innerHTML =
              "<option value=''>--Select Action--</option>";
          }
        }
      });

      if (closeButton) {
        closeButton.addEventListener("click", () => {
          reject("Dialog closed with close button");
        });
      }

      observer.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

async function handleOkCallback(resolve, reject) {
  const objectID = document.getElementById("ObjectIDexport").value;
  const selectedAction = document.getElementById("actionSelect").value;

  try {
    const objectDetails = await fetchObjectInfo(objectID);

    if (
      objectDetails &&
      objectTypes[objectDetails.type] &&
      objectTypes[objectDetails.type].actions[selectedAction]
    ) {
      resolve(objectID);
      const { actions } = objectTypes[objectDetails.type];
      const selectedActionObj = actions[selectedAction];

      // Execute the action after showing the toast
      await selectedActionObj.execute(objectDetails);
    } else {
      throw new Error("Invalid object type or action");
    }
  } catch (error) {
    showToast("Error: " + error.message, {
      type: "error",
    });
    showToast(`${error.Message}`, "Error", { type: "error" });
    reject(error);
  }
}

function handleCancelCallback(reject) {
  reject("Dialog cancelled");
  showToast("User Cancellation", "Cancelled", { type: "warning" });
}

async function getSecurityObjects(objectDetails) {
  console.log(objectDetails);

  // Initialize security objects as empty arrays
  const roles = [];
  const groups = [];
  const accounts = [];

  const securityObjects = {
    roles,
    groups,
    accounts,
  };

  return securityObjects;
}

function getFilters(xmlDoc, namespaceURI, fileName) {
  let qrycounter = 0;
  let filt = [];

  // Find All Query Elements
  const queries = xmlDoc.querySelectorAll("query");
  if (queries.length === 0) {
    console.error(`No queries found for ${fileName}`);
    return filt;
  }

  queries.forEach((qry) => {
    let qryname = qry.getAttribute("name");
    if (qryname.includes("prompt")) {
      return;
    }
    qrycounter += 1;

    // Function to process filterExpressions
    const processFilters = (filterType) => {
      const filters = qry.querySelectorAll(
        `${filterType}Filter > filterExpression`
      );
      return Array.from(filters)
        .filter((filter) => {
          const useAttribute = filter.parentNode.getAttribute("use");
          return useAttribute === "optional" || !useAttribute;
        })
        .map((filter, i) => {
          const parentNode = filter.parentNode;
          const useAttribute = parentNode.getAttribute("use") || "required";
          return {
            query: qryname,
            type: useAttribute,
            name: `${filterType}Filter${i + 1}`,
            expression: filter.textContent.trim(),
            sort: "-1",
          };
        });
    };

    // Process detailFilters
    filt.push(...processFilters("detail"));

    // Process summaryFilters
    filt.push(...processFilters("summary"));

    // Process slicerMemberSets
    const slicerMemberSets = qry.querySelectorAll("slicer > slicerMemberSet");
    const slicerFilters = Array.from(slicerMemberSets).map(
      (slicerMemberSet, i) => {
        return {
          query: qryname,
          type: "required",
          name: `slicer${i + 1}`,
          expression: slicerMemberSet.textContent.trim(),
          sort: "-1",
        };
      }
    );

    filt.push(...slicerFilters);
  });

  //console.log(filt);
  return filt;
}

async function parseReportXML(objectDetails, outputType) {
  //console.log(objectDetails);
  const xmlString = objectDetails.specification;
  if (!xmlString) {
    throw new Error("XML specification not found in the response");
  }

  const xmlDoc = new DOMParser().parseFromString(xmlString, "application/xml");
  const namespaceURI =
    xmlDoc.documentElement.namespaceURI || "default-namespace-uri";

  if (outputType === "Filters Only") {
    const filt = getFilters(xmlDoc, namespaceURI, objectDetails.defaultName);

    return filt;
  } else {
    const modelPathElement = xmlDoc.querySelector("modelPath");
    if (!modelPathElement) {
      console.error("No modelPath found");
      return;
    }
    const modelPath = modelPathElement.textContent;

    const secObjects = await getSecurityObjects(objectDetails);
    //console.log(secObjects);

    const output = {
      reportName: objectDetails?.defaultName || "",
      reportURL: objectDetails?._meta?.links?.path?.url || "",
      modelPath,
      creationTime: objectDetails?.creationTime || "",
      modificationTime: objectDetails?.modificationTime || "",
      type: objectDetails?.type || "",
      secAll: secObjects,
      secRoles: secObjects.roles || [],
      secGroups: secObjects.groups || [],
      secAccounts: secObjects.accounts || [],
      id: objectDetails?.id || "",
      usage: objectDetails?.usage || "",
      searchPath: objectDetails?.searchPath,
      description: objectDetails?.defaultDescription || "",
      version: objectDetails?.version || "",
      pages: [],
      filters: [],
      columnArray: [],
    };

    const filt = getFilters(xmlDoc, namespaceURI, objectDetails.defaultName);
    output.filters = filt;
    return output;
  }
}

async function getFiltersAllReportsinFolder(objectDetails, outputType) {
  try {
    let reportList = await fetchFolderObjects(objectDetails.id, "report");
    let reportCount = reportList.length;
    let processedCount = 0;
    let errorCount = 0;

    return new Promise((resolve, reject) => {
      __glassAppController.glassContext.getCoreSvc(".Dialog").createDialog({
        title: "Warning",
        message: `Are you sure you want to get filters for ${reportCount} reports?`,
        className: "info",
        buttons: ["ok", "cancel"],
        width: "50%",
        type: "error",
        size: "default",
        htmlContent: true,
        callback: {
          ok: async () => {
            try {
              let allFilters = [];
              let progressID = showProgressToast(
                reportCount,
                `Processing reports: 0/${reportCount}`
              );

              for (const report of reportList) {
                try {
                  let reportDetails = await fetchObjectInfo(report.id);
                  let reportFilters = await parseReportXML(
                    reportDetails,
                    "Filters Only"
                  );
                  reportFilters.forEach((filter) => {
                    allFilters.push({
                      reportId: report.id,
                      reportName: reportDetails.defaultName,
                      reportPath: reportDetails.searchPath,
                      reportType: reportDetails.type,
                      reportUsage: reportDetails.usage,
                      reportDescription: reportDetails.description,
                      reportCreationTime: formatDateTime(
                        reportDetails.creationTime
                      ),
                      reportModificationTime: formatDateTime(
                        reportDetails.modificationTime
                      ),
                      reportHidden: reportDetails.hidden,
                      reportCanBurst: reportDetails.canBurst,
                      reporthasChildren: reportDetails.hasChildren,
                      ...filter,
                    });
                  });

                  processedCount++;

                  updateProgressToast(
                    progressID,
                    1,
                    `Processing reports: ${processedCount}/${reportCount}`
                  );
                } catch (error) {
                  errorCount++;
                  console.error(`Error processing report ${report.id}:`, error);
                }
              }
              // Ensure the progress reaches 100%
              updateProgressToast(
                progressID,
                reportCount - processedCount,
                `Completed. Processed: ${processedCount}, Errors: ${errorCount}`
              );

              if (errorCount > 0) {
                showToast(
                  `Encountered errors in ${errorCount} reports. Check console for details.`,
                  { type: "error" }
                );
              }

              resolve(allFilters);
            } catch (error) {
              console.error("Error in processing reports:", error);
              updateProgressToast(
                progressID,
                reportCount - processedCount,
                `Error occurred. Processed: ${processedCount}, Errors: ${
                  errorCount + 1
                }`
              );
              showToast(
                "An error occurred while processing reports. Check console for details.",
                { type: "error" }
              );
              reject(error);
            }
          },
          cancel: () => {
            reject(new Error("Operation cancelled by user"));
          },
        },
        callbackScope: { ok: this, cancel: this },
        payload: { url: __glassAppController.Glass.getUrl() },
      });
    });
  } catch (error) {
    console.error("Error in getFiltersAllReportsinFolder:", error);
    throw error;
  }
}

function convertArrayToCSV(array) {
  console.log(array);
  if (array.length === 0) return "";

  const flattenObject = (obj, prefix = "") => {
    return Object.keys(obj).reduce((acc, k) => {
      if (k.includes("_meta")) return acc; // Skip _meta keys
      const pre = prefix.length ? prefix + "." : "";
      if (
        typeof obj[k] === "object" &&
        obj[k] !== null &&
        !Array.isArray(obj[k])
      ) {
        Object.assign(acc, flattenObject(obj[k], pre + k));
      } else {
        acc[pre + k] = obj[k];
      }
      return acc;
    }, {});
  };

  const flattenedArray = array.map((item) => flattenObject(item));
  const columns = Array.from(
    new Set(flattenedArray.flatMap((obj) => Object.keys(obj)))
  ).filter((key) => !key.includes("_meta")); // Additional filter for _meta keys

  let csv = columns.join(",") + "\n";

  const escapeCell = (cell) => {
    if (cell == null) return "";
    if (Array.isArray(cell)) return JSON.stringify(cell);
    cell = cell.toString();
    if (cell.includes('"') || cell.includes(",") || cell.includes("\n")) {
      return '"' + cell.replace(/"/g, '""') + '"';
    }
    return cell;
  };

  flattenedArray.forEach((item) => {
    const row = columns.map((column) => escapeCell(item[column] || ""));
    csv += row.join(",") + "\n";
  });

  return csv;
}

function downloadCSV(csvContent, fileName) {
  const todaysDate = getTodayFormatted();
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${fileName} - ${todaysDate}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

function formatDateTime(isoString) {
  const date = new Date(isoString);
  return (
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0") +
    " " +
    String(date.getHours()).padStart(2, "0") +
    ":" +
    String(date.getMinutes()).padStart(2, "0") +
    ":" +
    String(date.getSeconds()).padStart(2, "0")
  );
}
function downloadObjectAsJson(objectDetails, fileName) {
  // Convert the object to a JSON string
  const jsonString = JSON.stringify(objectDetails, null, 2);

  // Create a Blob with the JSON data
  const blob = new Blob([jsonString], { type: "application/json" });

  // Create a temporary URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create a temporary anchor element
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName || "download.json";

  // Append the link to the body (required for Firefox)
  document.body.appendChild(link);

  // Programmatically click the link to trigger the download
  link.click();

  // Clean up by removing the link and revoking the URL
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
async function generateAndDownloadFiltersCSV(objectDetails) {
  try {
    const filtersArray = await getFiltersAllReportsinFolder(objectDetails);

    showToast(
      `Creating CSV of all filters for reports in folder: \n${objectDetails.defaultName}`,
      "Process Initiated",
      2000
    );

    const csvContent = convertArrayToCSV(filtersArray);
    downloadCSV(csvContent, "Filter_Report");
    console.log("CSV download initiated.");
  } catch (error) {
    if (error.message === "Operation cancelled by user") {
      showToast("Operation cancelled by user", "Cancelled", 2000, {
        type: "warning",
      });
      console.log("Operation cancelled by user");
    } else {
      console.error("Failed to generate and download CSV:", error);
      showToast("Failed to generate and download CSV", "", { type: "error" });
    }
  }
}

async function generateAndDownloadFiltersCSV(objectDetails) {
  try {
    const filtersArray = await getFiltersAllReportsinFolder(objectDetails);

    showToast(
      `Creating CSV of all filters for reports in folder: \n${objectDetails.defaultName}`
    );

    const csvContent = convertArrayToCSV(filtersArray);
    downloadCSV(csvContent, "Filter_Report");
    console.log("CSV download initiated.");
  } catch (error) {
    if (error.message === "Operation cancelled by user") {
      showToast("Operation cancelled by user", "Cancelled", 2000, {
        type: "warning",
      });
      console.log("Operation cancelled by user");
    } else {
      console.error("Failed to generate and download CSV:", error);
      showToast("Failed to generate and download CSV", { type: "error" });
    }
  }
}

async function generateAndDownloadSingleReportFiltersCSV(objectDetails) {
  try {
    let reportArray = parseReportXML(objectDetails, "Filters Only");
    showToast(
      `Creating CSV for all reports in folder: \n${objectDetails.defaultName}`
    );

    const csvContent = convertArrayToCSV(reportArray);
    downloadCSV(csvContent, "Report_List");
    console.log("CSV download initiated.");
  } catch (error) {
    console.error("Failed to generate and download CSV:", error);
  }
}

function getTodayFormatted() {
  const today = new Date();
  return (
    today.getFullYear().toString() +
    (today.getMonth() + 1).toString().padStart(2, "0") +
    today.getDate().toString().padStart(2, "0")
  );
}

async function generateJSONReportInfo(objectDetails) {
  try {
    showToast(`Parsing Report Info: \n${objectDetails.defaultName}`);
    let reportObject = await parseReportXML(objectDetails);

    showToast(`JSON Download Initiated: \n${objectDetails.defaultName}`);
    downloadObjectAsJson(reportObject, `${objectDetails.defaultName}.json`);
  } catch (error) {
    console.error("Failed to generate and download CSV:", error);
  }
}

async function generateJSONAllReportsInfo(objectDetails) {
  try {
    let reportList = await fetchFolderObjects(objectDetails.id, "report");
    let reportCount = reportList.length;
    let processedCount = 0;
    let errorCount = 0;

    return new Promise((resolve, reject) => {
      __glassAppController.glassContext.getCoreSvc(".Dialog").createDialog({
        title: "Warning",
        message: `Are you sure you want to download info for ${reportCount} reports?`,
        className: "info",
        buttons: ["ok", "cancel"],
        width: "50%",
        type: "error",
        size: "default",
        htmlContent: true,
        callback: {
          ok: async () => {
            try {
              let allReports = [];

              showProgressToast(
                "filterProgress",
                reportCount,
                `Processing reports: 0/${reportCount}`
              );

              for (const report of reportList) {
                try {
                  let reportDetails = await fetchObjectInfo(report.id);
                  let reportParsedObject = await parseReportXML(reportDetails);

                  allReports.push(reportParsedObject);

                  processedCount++;
                  updateProgressToast(
                    "filterProgress",
                    1,
                    `Processing reports: ${processedCount}/${reportCount}`
                  );
                } catch (error) {
                  errorCount++;
                  console.error(`Error processing report ${report.id}:`, error);
                }
              }
              // Ensure the progress reaches 100%
              updateProgressToast(
                "filterProgress",
                reportCount - processedCount,
                `Completed. Processed: ${processedCount}, Errors: ${errorCount}`
              );

              if (errorCount > 0) {
                showToast(
                  `Encountered errors in ${errorCount} reports. Check console for details.`,
                  "Error",
                  5000,
                  { type: "error" }
                );
              }

              resolve(
                downloadObjectAsJson(
                  allReports,
                  `${objectDetails.defaultName}.json`
                )
              );
            } catch (error) {
              console.error("Error in processing reports:", error);
              updateProgressToast(
                "filterProgress",
                reportCount - processedCount,
                `Error occurred. Processed: ${processedCount}, Errors: ${
                  errorCount + 1
                }`
              );
              showToast(
                "An error occurred while processing reports. Check console for details.",
                "Error",
                5000,
                { type: "error" }
              );
              reject(error);
            }
          },
          cancel: () => {
            reject(new Error("Operation cancelled by user"));
          },
        },
        callbackScope: { ok: this, cancel: this },
        payload: { url: __glassAppController.Glass.getUrl() },
      });
    });
  } catch (error) {
    console.error("Failed to generate and download CSV:", error);
  }
}

// Usage example:
const formattedDate = getTodayFormatted();
console.log(formattedDate); // Output: yyyymmdd (e.g., 20240731)

showDialogAndGetObjectId();
