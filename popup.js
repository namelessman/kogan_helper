chrome.runtime.sendMessage({ action: "getUsageSummary" });


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "usageSummaryData") {
    displayUsageSummary(message.data);
  }
});


function displayUsageSummary(data) {
  const usageSummaryDiv = document.getElementById("usageSummary");

  const plan = data.plan;
  const dataEntitlement = plan.entitlements.find(entitlement => entitlement.entitlementType === "DATA");

  usageSummaryDiv.innerHTML = `
    <div class="section">
      <p><strong>Title:</strong> ${plan.title}</p>
      <p><strong>Description:</strong> ${plan.description}</p>
      <p><strong>Data Allowance:</strong> ${dataEntitlement.totalAllowance.amount} ${dataEntitlement.totalAllowance.unit}</p>
      <p><strong>Remaining Data:</strong> ${dataEntitlement.remainingAllowance.amount} ${dataEntitlement.remainingAllowance.unit}</p>
      <p class="highlight"><strong>End Date:</strong> ${plan.end_date_inclusive}</p>
    </div>
  `;
}
