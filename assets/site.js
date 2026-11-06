(() => {
  const root = document.documentElement;
  const params = new URLSearchParams(location.search);
  let language = ['zh','en'].includes(params.get('lang')) ? params.get('lang') : navigator.language.startsWith('zh') ? 'zh' : 'en';
  let selectedTheme = null;
  try { selectedTheme = localStorage.getItem('lumo-site-theme'); } catch {}
  if (['light','dark'].includes(selectedTheme)) root.dataset.theme = selectedTheme;
  const systemTheme = matchMedia('(prefers-color-scheme: dark)');
  const dark = () => root.dataset.theme ? root.dataset.theme === 'dark' : systemTheme.matches;
  const themeButton = document.querySelector('.theme-toggle');
  const input = document.querySelector('#help-search');
  const filter = () => {
    if (!input) return;
    const query = input.value.trim().toLocaleLowerCase();
    let matches = 0;
    document.querySelectorAll('.help-section').forEach(section => {
      let count = 0;
      section.querySelectorAll('details').forEach(item => {
        const visible = !query || item.textContent.toLocaleLowerCase().includes(query);
        item.hidden = !visible;
        if (visible) count++;
      });
      section.hidden = count === 0;
      matches += count;
    });
    document.querySelector('#no-results').hidden = matches > 0;
    document.querySelector('#search-status').textContent = !query ? '' : language === 'zh' ? `找到 ${matches} 个相关问题` : `${matches} matching question${matches === 1 ? '' : 's'}`;
  };
  const themeMetadata = () => {
    document.querySelector('meta[name="theme-color"]').content = dark() ? '#080808' : '#fafafa';
    const next = dark() ? (language === 'zh' ? '切换到浅色' : 'Switch to light mode') : (language === 'zh' ? '切换到深色' : 'Switch to dark mode');
    themeButton?.setAttribute('aria-label',next);
    themeButton?.setAttribute('title',next);
  };
  function applyLanguage(updateURL = false) {
    root.lang = language === 'zh' ? 'zh-Hans' : 'en';
    document.querySelector('.site-header nav')?.setAttribute('aria-label', language === 'zh' ? '主导航' : 'Main navigation');
    document.querySelector('.help-nav nav')?.setAttribute('aria-label', language === 'zh' ? '帮助主题' : 'Help topics');
    document.querySelectorAll('[data-zh][data-en]').forEach(el => el.innerHTML = el.dataset[language]);
    document.querySelectorAll('[data-placeholder-zh]').forEach(el => el.placeholder = el.dataset[language === 'zh' ? 'placeholderZh' : 'placeholderEn']);
    document.querySelectorAll('a[href]').forEach(link => {
      const raw = link.getAttribute('href');
      if (!raw || raw.startsWith('#') || /^(?:https?:|mailto:)/.test(raw)) return;
      const url = new URL(raw, location.href);
      url.searchParams.set('lang',language);
      link.setAttribute('href',url.pathname.split('/').pop()+url.search+url.hash);
    });
    const button = document.querySelector('.language');
    button.textContent = language === 'zh' ? 'EN' : '中';
    button.setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换为中文');
    const support = document.body.dataset.page === 'support';
    document.title = language === 'zh' ? (support ? 'Lumo 6.3 · 支持与使用指南' : 'Lumo 6.3 · 给浏览，多一种可能') : (support ? 'Lumo 6.3 · Support & guides' : 'Lumo 6.3 · A different way to browse');
    document.querySelector('meta[name="description"]').content = language === 'zh' ? (support ? 'Lumo 6.3 使用指南：空间、标签、扩展、用户脚本、网页深色模式、下载、备份、AI 与购买问题。' : 'Lumo 6.3，适用于 iPhone 与 iPad 的侧边栏浏览器。独立登录空间、猫抓与 SingleFile、用户脚本同步、网页深色适配与自定义水印。') : (support ? 'Lumo 6.3 guides: spaces, tabs, extensions, userscripts, dark mode, downloads, backup, AI, and purchases.' : 'Lumo 6.3 for iPhone and iPad: separate sign-in spaces, Cat Catch and SingleFile, userscript sync, webpage dark mode, and custom watermarks.');
    if (updateURL) { const url = new URL(location.href); url.searchParams.set('lang',language); history.replaceState(null,'',url); }
    themeMetadata();filter();
  }
  document.querySelector('.language')?.addEventListener('click',()=>{language=language==='zh'?'en':'zh';applyLanguage(true);});
  themeButton?.addEventListener('click',()=>{root.dataset.theme=dark()?'light':'dark';try{localStorage.setItem('lumo-site-theme',root.dataset.theme);}catch{}themeMetadata();});
  systemTheme.addEventListener('change',themeMetadata);
  input?.addEventListener('input',filter);
  document.querySelectorAll('.help-nav a[href^="#"]').forEach(link=>link.addEventListener('click',()=>{if(input?.value){input.value='';filter();}}));
  applyLanguage();
})();
