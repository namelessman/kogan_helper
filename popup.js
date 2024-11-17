chrome.runtime.sendMessage({ action: "getUsageSummary" });


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "usageSummaryData") {
    displayUsageSummary(message.data);
  }
});

function calculateDaysBetween(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
  
  return Math.ceil((utc2 - utc1) / (1000 * 60 * 60 * 24));
}

function displayUsageSummary(data) {
  const usageSummaryDiv = document.getElementById("usageSummary");

  const plan = data.plan;
  const dataEntitlement = plan.entitlements.find(entitlement => entitlement.entitlementType === "DATA");
  const today = new Date();
  const todayString = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

  usageSummaryDiv.innerHTML = `
    <div class="section">
      <p><strong>Plan:</strong> ${plan.title}</p>
      <p><strong>Description:</strong> ${plan.description}</p>
      <p><strong>Data Allowance:</strong> ${dataEntitlement.totalAllowance.amount} ${dataEntitlement.totalAllowance.unit}</p>
      <p><strong>Remaining Data:</strong> ${dataEntitlement.remainingAllowance.amount} ${dataEntitlement.remainingAllowance.unit}</p>
      <p class="highlight mb-0"><strong>End Date:</strong> ${plan.end_date_inclusive}</p>
      <p class="mb-0"><strong>Today:</strong> ${todayString}</p>
      <p><strong>Days Remaining:</strong> ${calculateDaysBetween(todayString, plan.end_date_inclusive)}</p>
    </div>
  `;
}
