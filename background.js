chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "getUsageSummary") {
    fetchUsageSummary();
  }
});

function fetchUsageSummary() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0];
    if (tab && tab.url.startsWith("https://accounts.koganmobile.co.nz/services/")) {
      const accountId = tab.url.split('/services/')[1]?.split('/')?.[0]
      fetch(`https://accounts.koganmobile.co.nz/api/account/usage_summary/${accountId}`)
        .then(response => response.json())
        .then(data => {
          chrome.runtime.sendMessage({ action: "usageSummaryData", data: data });
        })
        .catch(error => console.error("Error fetching usage summary:", error));
    }
  });
}
