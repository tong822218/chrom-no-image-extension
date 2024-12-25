chrome.runtime.onInstalled.addListener(() => {
  // 初始化默认设置
  chrome.storage.sync.set({ matchedWebsites: ["https://www.zhihu.com/*"] });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    // 获取存储的网站规则
    chrome.storage.sync.get(["matchedWebsites"], (result) => {
      const matchedWebsites = result.matchedWebsites || ["https://www.zhihu.com/*"];

      // 检查当前页面是否匹配
      const isMatched = matchedWebsites.some((pattern) =>
        tab.url?.match(pattern.replace(/\*/g, ".*"))
      );

      if (isMatched) {
        // 如果匹配，注入内容脚本
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ["scripts/content.js"],
        });
      }
    });
  }
});
