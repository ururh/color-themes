
(() => {
  'use strict';

  const themes = ['blue', 'green', 'pink', 'purple', 'orange', 'turquoise', 'slate'];

  let link = document.getElementById('themeStylesheet');
  const select = document.getElementById('themeSelect');
  const downloadButton = document.getElementById('downloadTheme');

  if (!select) return;

  if (!link) {
    link = document.createElement('link');
    link.id = 'themeStylesheet';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }

  const params = new URLSearchParams(location.search);
  const fromUrl = params.get('theme');

  const stored = (() => {
    try {
      return localStorage.getItem('landing-theme');
    } catch {
      return null;
    }
  })();

  const initial = themes.includes(fromUrl)
    ? fromUrl
    : themes.includes(stored)
      ? stored
      : 'blue';

  function applyTheme(theme) {
    if (!themes.includes(theme)) return;

    link.href = `css/themes/${theme}.css`;
    select.value = theme;
    document.documentElement.dataset.theme = theme;

    try {
      localStorage.setItem('landing-theme', theme);
    } catch {}

    const url = new URL(location.href);
    url.searchParams.set('theme', theme);
    try {
      history.replaceState(null, '', url);
    } catch {}
  }

  applyTheme(initial);

  select.addEventListener('change', () => {
    applyTheme(select.value);
  });

  downloadButton?.addEventListener('click', async () => {
    const theme = select.value;

    if (!themes.includes(theme)) return;

    const filePath = `css/themes/${theme}.css`;

    try {
      const response = await fetch(filePath);

      if (!response.ok) {
        throw new Error('Не вдалося завантажити CSS');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `${theme}.css`;

      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert('Помилка завантаження CSS-файлу');
    }
  });
})();
