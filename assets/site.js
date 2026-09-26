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
      ? (support ? "Lumo 技术支持" : "Lumo 5.0 · iPad 上的桌面级浏览器")
      : (support ? "Lumo Support" : "Lumo 5.0 · Desktop-class browsing for iPad");
    const description = document.querySelector('meta[name="description"]');
    if (description && !support) {
      description.content = language === "zh"
        ? "Lumo 5.0 为 iPad 带来桌面级浏览：命令面板、无痕空间、网页扩展、媒体视图、会话管理，以及清晰的使用指南。"
        : "Lumo 5.0 brings desktop-class browsing to iPad: a command panel, private space, Web Extensions, Media View, sessions, and a practical user guide.";
    }
  }

  button?.addEventListener("click", () => {
    language = language === "zh" ? "en" : "zh";
    applyLanguage();
  });
  applyLanguage();
})();
