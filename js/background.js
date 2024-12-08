import {
  LOW_DATA_THRESHOLD,
  NOTIFICATION_ICON_URL,
  NOTIFICATION_TITLE,
  CHECK_INTERVAL,
  IS_MOCK,
} from "./config.js";
import { mock } from "./mockData.js";

let myNotificationID = null;

function isLowData(remaining, total) {
  return (remaining / total) * 100 < LOW_DATA_THRESHOLD;
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["enabledNotify"], (result) => {
    if (result.enabledNotify) {
      chrome.alarms.create("dailyCheck", { periodInMinutes: CHECK_INTERVAL });
    }
  });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  chrome.storage.local.get(["enabledNotify"], (result) => {
    if (!result.enabledNotify) return;
    if (alarm.name === "dailyCheck") dailyCheck();
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getUsageSummary") fetchUsageSummary();
  if (message.action === "testNotification") dailyCheck(true);
});

chrome.notifications.onButtonClicked.addListener((notifId, btnIdx) => {
  if (notifId === myNotificationID && btnIdx === 0) {
    chrome.storage.local.set({ enabledNotify: false }, () => {
      console.log("Notification disabled");
    });
  }
});

async function dailyCheck(forceNotification = false) {
  const result = await chrome.storage.local.get(["enabledNotify"]);
  if (!result.enabledNotify) return;

  if (IS_MOCK) {
    const remaining = +mock.plan.entitlements[0].remainingAllowance.amount;
    const total = +mock.plan.entitlements[0].totalAllowance.amount;
    if (forceNotification || isLowData(remaining, total)) {
      chrome.notifications.create(
        {
          type: "basic",
          buttons: [{ title: "Don't show again" }],
          iconUrl: NOTIFICATION_ICON_URL,
          title: NOTIFICATION_TITLE,
          message: `You have ${remaining} ${mock.plan.entitlements[0].remainingAllowance.unit} data remaining.`,
        },
        (id) => {
          myNotificationID = id;
        }
      );
    }
  } else {
    const result = await chrome.storage.local.get(["accountId"]);
    const accountId = result.accountId;
    console.log("Account ID currently is " + accountId);

    if (!accountId) return;
    fetch(
      `https://accounts.koganmobile.co.nz/api/account/usage_summary/${accountId}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (!data?.plan) {
          // chrome.storage.local.set({ enabledNotify: false }, () => {
          //   chrome.notifications.create({
          //     type: "basic",
          //     iconUrl: NOTIFICATION_ICON_URL,
          //     title: NOTIFICATION_TITLE,
          //     message:
          //       "Please log in to Kogan Mobile to check your data usage daily.",
          //   });
          // });
          return;
        }
        const remaining =
          +data?.plan?.entitlements?.[0]?.remainingAllowance.amount;
        const total = +data?.plan?.entitlements?.[0]?.totalAllowance?.amount;
        if (forceNotification || isLowData(remaining, total)) {
          chrome.notifications.create(
            {
              type: "basic",
              buttons: [{ title: "Don't show again" }],
              iconUrl: NOTIFICATION_ICON_URL,
              title: NOTIFICATION_TITLE,
              message: `You have ${remaining} ${data?.plan?.entitlements?.[0]?.remainingAllowance.unit} data remaining.`,
            },
            (id) => {
              myNotificationID = id;
            }
          );
        }
      })
      .catch((error) => console.error("Error fetching usage summary:", error));
  }
}

function setAccountId(accountId) {
  chrome.storage.local.set({ accountId }, () => {
    console.log("Account ID is set to " + accountId);
  });
}

function init() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (
      tab &&
      tab.url?.startsWith("https://accounts.koganmobile.co.nz/services/")
    ) {
      const accountId = tab.url.split("/services/")[1]?.split("/")?.[0];
      setAccountId(accountId);
    }
  });
}

async function fetchUsageSummary() {
  const result = await chrome.storage.local.get(["accountId"]);
  const accountId = result.accountId;
  console.log("Account ID currently is " + accountId);

  if (!accountId) return;

  if (IS_MOCK) {
    chrome.runtime.sendMessage({ action: "usageSummaryData", data: mock });
    return;
  }

  fetch(
    `https://accounts.koganmobile.co.nz/api/account/usage_summary/${accountId}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (!data?.plan) {
        return;
      }
      chrome.runtime.sendMessage({ action: "usageSummaryData", data: data });
    })
    .catch((error) => console.error("Error fetching usage summary:", error));
}

init();
