// 检查当前网站是否匹配
function checkWebsiteMatch(currentUrl) {
  return new Promise((resolve) => {
    chrome.storage.sync.get(["matchedWebsites"], (result) => {
      const matchedWebsites = result.matchedWebsites || ["https://www.zhihu.com/*"];
      const isMatched = matchedWebsites.some((pattern) =>
        currentUrl.match(pattern.replace(/\*/g, ".*"))
      );
      resolve(isMatched);
    });
  });
}

// 防抖
function debounce(fn, wait) {
  let timeout = null;
  return function () {
    let context = this;
    let args = arguments;
    if (timeout) clearTimeout(timeout);
    let callNow = !timeout;
    timeout = setTimeout(() => {
      timeout = null;
    }, wait);
    if (callNow) fn.apply(context, args);
  };
}

const hideImgs = debounce(() => {
  const imgs = document.querySelectorAll("img");
  imgs.forEach((img) => {
    img.style.display = "none";
  });
}, 250);

// 异步检查并执行
async function initContentScript() {
  const isMatched = await checkWebsiteMatch(window.location.href);

  if (isMatched) {
    // 增加滚动监听，实现防抖方法
    window.addEventListener("scroll", () => {
      hideImgs();
    });

    // 页面加载2秒后执行一次
    setTimeout(() => {
      hideImgs();
    }, 2000);
  }
}


// 立即执行
initContentScript();
