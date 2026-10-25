(() => {
  const button = document.querySelector(".language");
  const params = new URLSearchParams(location.search);
  let language = params.get("lang") === "en"
    ? "en"
    : params.get("lang") === "zh"
      ? "zh"
      : (navigator.language.startsWith("zh") ? "zh" : "en");

  function applyLanguage() {
    document.documentElement.lang = language === "zh" ? "zh-Hans" : "en";
    document.querySelectorAll("[data-zh][data-en]").forEach((element) => {
      element.innerHTML = element.dataset[language];
    });

    document.querySelectorAll("a[href]").forEach((link) => {
      const raw = link.getAttribute("href");
      if (!raw || raw.startsWith("#") || raw.startsWith("http") || raw.startsWith("mailto:")) return;
      const url = new URL(raw, location.href);
      url.searchParams.set("lang", language);
      link.setAttribute("href", url.pathname.split("/").pop() + url.search + url.hash);
    });

    if (button) button.textContent = language === "zh" ? "EN" : "中";
    const support = location.pathname.endsWith("support.html");
    document.title = language === "zh"
      ? (support ? "Lumo 技术支持" : "Lumo 6.0 · iPhone 与 iPad 侧边栏浏览器")
      : (support ? "Lumo Support" : "Lumo 6.0 · Sidebar browsing for iPhone and iPad");
    const description = document.querySelector('meta[name="description"]');
    if (description && !support) {
      description.content = language === "zh"
        ? "Lumo 6.0 让侧边栏浏览来到 iPhone 与 iPad：空间、固定网站、焕新的起始页、宽屏双网页工作台，以及丰富的网页工具。"
        : "Lumo 6.0 brings sidebar browsing to iPhone and iPad, with Spaces, a redesigned start page, a two-page workspace on wide screens, and tools for the web.";
    }
  }

  button?.addEventListener("click", () => {
    language = language === "zh" ? "en" : "zh";
    applyLanguage();
  });
  applyLanguage();
})();
