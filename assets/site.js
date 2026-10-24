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
      ? (support ? "Lumo 技术支持" : "Lumo 6.0 · iPad 上的桌面级浏览器")
      : (support ? "Lumo Support" : "Lumo 6.0 · Desktop-class browsing for iPad");
    const description = document.querySelector('meta[name="description"]');
    if (description && !support) {
      description.content = language === "zh"
        ? "Lumo 6.0 焕新 iPad 侧边栏：可自定 Profile、整理标签和文件夹、拖放双网页工作台、临时预览链接，并支持网页扩展与 iCloud 备份。"
        : "Lumo 6.0 brings a refined sidebar, customizable Profiles, a two-page workspace, link previews, Web Extensions, and iCloud backup to iPad.";
    }
  }

  button?.addEventListener("click", () => {
    language = language === "zh" ? "en" : "zh";
    applyLanguage();
  });
  applyLanguage();
})();
