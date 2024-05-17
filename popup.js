// 当popup页面加载时发送消息给background脚本请求数据
chrome.runtime.sendMessage({ action: "getUsageSummary" });

// 监听来自background脚本的消息
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "usageSummaryData") {
    displayUsageSummary(message.data);
  }
});

// 在popup页面上展示使用情况摘要
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
