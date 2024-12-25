document.addEventListener("DOMContentLoaded", function () {
  const websiteInput = document.getElementById("websiteInput");
  const saveButton = document.getElementById("saveButton");
  const savedWebsitesDiv = document.getElementById("savedWebsites");

  // 加载已保存的网站规则
  chrome.storage.sync.get(["matchedWebsites"], function (result) {
    const websites = result.matchedWebsites || [];
    updateSavedWebsitesList(websites);
  });

  // 保存网站规则
  saveButton.addEventListener("click", function () {
    const newWebsite = websiteInput.value.trim();
    if (newWebsite) {
      chrome.storage.sync.get(["matchedWebsites"], function (result) {
        const websites = result.matchedWebsites || [];

        // 避免重复添加
        if (!websites.includes(newWebsite)) {
          websites.push(newWebsite);

          chrome.storage.sync.set({ matchedWebsites: websites }, function () {
            updateSavedWebsitesList(websites);
            websiteInput.value = ""; // 清空输入框
          });
        }
      });
    }
  });

  // 更新已保存网站列表的显示
  function updateSavedWebsitesList(websites) {
    savedWebsitesDiv.innerHTML = "<h3>已保存的网站:</h3>";
    websites.forEach((site, index) => {
      const siteElement = document.createElement("div");
      siteElement.textContent = site;

      // 添加删除按钮
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "删除";
      deleteButton.addEventListener("click", function () {
        websites.splice(index, 1);
        chrome.storage.sync.set({ matchedWebsites: websites }, function () {
          updateSavedWebsitesList(websites);
        });
      });

      siteElement.appendChild(deleteButton);
      savedWebsitesDiv.appendChild(siteElement);
    });
  }
});
