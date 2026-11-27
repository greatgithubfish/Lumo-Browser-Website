(() => {
  "use strict";
  const root = document.documentElement;
  const params = new URLSearchParams(location.search);
  let language = ["zh", "en"].includes(params.get("lang"))
    ? params.get("lang")
    : navigator.language.startsWith("zh")
      ? "zh"
      : "en";
  try {
    const theme = localStorage.getItem("lumo-site-theme");
    if (["light", "dark"].includes(theme)) root.dataset.theme = theme;
  } catch {}
  const dark = () => root.dataset.theme !== "light";
  const themeButton = document.querySelector(".theme-toggle");
  const input = document.querySelector("#help-search");
  const filter = () => {
    if (!input) return;
    const query = input.value.trim().toLocaleLowerCase();
    let matches = 0;
    document.querySelectorAll(".help-section").forEach((section) => {
      let count = 0;
      section.querySelectorAll("details").forEach((item) => {
        const visible =
          !query || item.textContent.toLocaleLowerCase().includes(query);
        item.hidden = !visible;
        if (visible) count++;
      });
      section.hidden = count === 0;
      matches += count;
    });
    const noResults = document.querySelector("#no-results");
    if (noResults) noResults.hidden = matches > 0;
    const status = document.querySelector("#search-status");
    if (status)
      status.textContent = !query
        ? ""
        : language === "zh"
          ? `找到 ${matches} 个相关问题`
          : `${matches} matching question${matches === 1 ? "" : "s"}`;
  };
  function themeMetadata() {
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", dark() ? "#14141a" : "#f6f5f8");
    const next = dark()
      ? language === "zh"
        ? "切换到浅色"
        : "Switch to light mode"
      : language === "zh"
        ? "切换到深色"
        : "Switch to dark mode";
    themeButton?.setAttribute("aria-label", next);
    themeButton?.setAttribute("title", next);
  }
  const profileData = {
    work: {
      zh: ["工作空间", "工作账号", "项目资料、团队协作，各自安放。"],
      en: [
        "Work space",
        "Work account",
        "Projects and team tools, together in one place.",
      ],
      icon: "◈",
    },
    life: {
      zh: ["生活空间", "日常账号", "收藏、计划和生活灵感，留在这里。"],
      en: [
        "Life space",
        "Personal account",
        "Bookmarks, plans and everyday inspiration.",
      ],
      icon: "◉",
    },
    learn: {
      zh: ["学习空间", "学习账号", "课程、资料和笔记，专注同一件事。"],
      en: [
        "Learning space",
        "Learning account",
        "Courses, research and notes, with room to focus.",
      ],
      icon: "✧",
    },
  };
  function updateDemos() {
    const selected = document.querySelector(
      '[data-profile][aria-pressed="true"]',
    );
    if (selected) {
      const profile = profileData[selected.dataset.profile];
      const [name, account, copy] = profile[language];
      document.querySelector(".profile-mark").textContent =
        `${profile.icon} ${name}`;
      document.querySelector(".mini-tab").textContent = "GitHub";
      document.querySelector(".account-title").textContent = account;
      document.querySelector(".profile-copy").textContent = copy;
      document.querySelector(".account-avatar").textContent = profile.icon;
    }
    const switches = [...document.querySelectorAll("[data-script-switch]")];
    const count = document.querySelector(".script-count");
    if (count) {
      const enabled = switches.filter(
        (button) => button.getAttribute("aria-checked") === "true",
      ).length;
      count.textContent =
        language === "zh"
          ? `${enabled} 个脚本已启用 / 共 ${switches.length} 个`
          : `${enabled} of ${switches.length} scripts enabled`;
    }
    const password = document.querySelector(".password-caption");
    if (password) {
      const system =
        document.querySelector('[name="password-demo"]:checked')?.value ===
        "system";
      password.textContent =
        language === "zh"
          ? system
            ? "由系统及你启用的密码提供方处理自动填充。"
            : "使用 Lumo 保存的密码进行填充。"
          : system
            ? "AutoFill is handled by the system and your enabled password provider."
            : "Fill using the passwords you save in Lumo.";
    }
  }
  function applyLanguage(updateURL = false) {
    root.lang = language === "zh" ? "zh-Hans" : "en";
    document
      .querySelector(".site-header nav")
      ?.setAttribute(
        "aria-label",
        language === "zh" ? "主导航" : "Main navigation",
      );
    document
      .querySelector(".help-nav nav")
      ?.setAttribute(
        "aria-label",
        language === "zh" ? "帮助主题" : "Help topics",
      );
    document.querySelectorAll("[data-zh][data-en]").forEach((el) => {
      el.innerHTML = el.dataset[language];
    });
    document.querySelectorAll("[data-alt-zh][data-alt-en]").forEach((img) => {
      img.alt = language === "zh" ? img.dataset.altZh : img.dataset.altEn;
    });
    document
      .querySelectorAll("[data-aria-zh][data-aria-en]")
      .forEach((el) =>
        el.setAttribute(
          "aria-label",
          el.dataset[language === "zh" ? "ariaZh" : "ariaEn"],
        ),
      );
    document.querySelectorAll("[data-placeholder-zh]").forEach((el) => {
      el.placeholder =
        el.dataset[language === "zh" ? "placeholderZh" : "placeholderEn"];
    });
    document.querySelectorAll("a[href]").forEach((link) => {
      const raw = link.getAttribute("href");
      if (!raw || raw.startsWith("#") || /^(?:https?:|mailto:)/.test(raw))
        return;
      const url = new URL(raw, location.href);
      url.searchParams.set("lang", language);
      link.setAttribute(
        "href",
        url.pathname.split("/").pop() + url.search + url.hash,
      );
    });
    const button = document.querySelector(".language");
    if (button) {
      button.textContent = language === "zh" ? "EN" : "中";
      button.setAttribute(
        "aria-label",
        language === "zh" ? "Switch to English" : "切换为中文",
      );
    }
    const support = document.body.dataset.page === "support";
    document.title =
      language === "zh"
        ? support
          ? "Lumo · 支持与使用指南"
          : "Lumo · 你的浏览，由你定义。"
        : support
          ? "Lumo · Support & guides"
          : "Lumo · Your browser. Your kind of space.";
    const description =
      language === "zh"
        ? support
          ? "Lumo 使用指南与 6.6 新功能：空间、用户脚本、扩展、密码、书签、iCloud 同步与 Apple Watch。"
          : "Lumo，适用于 iPhone 与 iPad 的侧边栏浏览器。独立登录空间、扩展与用户脚本、阅读与翻译，以及 6.6 新功能。"
        : support
          ? "Lumo guides and the 6.6 update: spaces, userscripts, extensions, passwords, bookmarks, iCloud sync and Apple Watch."
          : "Your browser. Your kind of space. Explore Lumo for iPhone and iPad: separate sign-ins, extensions, userscripts and the 6.6 update.";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", description);
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", document.title);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute("content", description);
    document
      .querySelector('.site-header a[href^="support.html"]')
      ?.setAttribute("aria-current", support ? "page" : "false");
    if (updateURL) {
      const url = new URL(location.href);
      url.searchParams.set("lang", language);
      history.replaceState(null, "", url);
    }
    updateDemos();
    themeMetadata();
    filter();
  }
  document.querySelector(".language")?.addEventListener("click", () => {
    language = language === "zh" ? "en" : "zh";
    applyLanguage(true);
  });
  themeButton?.addEventListener("click", () => {
    root.dataset.theme = dark() ? "light" : "dark";
    try {
      localStorage.setItem("lumo-site-theme", root.dataset.theme);
    } catch {}
    themeMetadata();
  });
  const deviceButtons = document.querySelectorAll("[data-device]");
  const deviceSlides = document.querySelectorAll("[data-slide]");
  const deviceCaptions = document.querySelectorAll("[data-slide-caption]");
  deviceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const device = button.dataset.device;
      deviceButtons.forEach((option) => {
        option.setAttribute("aria-pressed", String(option === button));
      });
      deviceSlides.forEach((slide) => {
        slide.hidden = slide.dataset.slide !== device;
      });
      deviceCaptions.forEach((caption) => {
        caption.hidden = caption.dataset.slideCaption !== device;
      });
    });
  });

  const paletteButtons = document.querySelectorAll("[data-palette-choice]");
  function selectPalette(palette) {
    root.dataset.palette = palette;
    paletteButtons.forEach((option) => {
      option.setAttribute(
        "aria-pressed",
        String(option.dataset.paletteChoice === palette),
      );
    });
  }
  selectPalette(root.dataset.palette || "violet");
  paletteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const palette = button.dataset.paletteChoice;
      selectPalette(palette);
      try {
        localStorage.setItem("lumo-site-palette", palette);
      } catch {}
    });
  });
  input?.addEventListener("input", filter);
  document.querySelectorAll('.help-nav a[href^="#"]').forEach((link) =>
    link.addEventListener("click", () => {
      if (input?.value) {
        input.value = "";
        filter();
      }
    }),
  );
  document.querySelectorAll("[data-profile]").forEach((button) =>
    button.addEventListener("click", () => {
      document
        .querySelectorAll("[data-profile]")
        .forEach((other) =>
          other.setAttribute("aria-pressed", String(other === button)),
        );
      updateDemos();
    }),
  );
  document.querySelectorAll("[data-script-switch]").forEach((button) =>
    button.addEventListener("click", () => {
      button.setAttribute(
        "aria-checked",
        String(button.getAttribute("aria-checked") !== "true"),
      );
      updateDemos();
    }),
  );
  document
    .querySelectorAll('[name="password-demo"]')
    .forEach((input) => input.addEventListener("change", updateDemos));
  // A recording plays only on request, and stops spending resources in a hidden tab.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden)
      document.querySelectorAll("video").forEach((video) => video.pause());
  });
  applyLanguage();
})();
