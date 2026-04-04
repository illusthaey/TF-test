(function () {
  function tryLoadWebAwesome() {
    try {
      const wantsWA =
        document.documentElement?.dataset?.uiKit === 'wa'
        || document.body?.dataset?.uiKit === 'wa'
        || !!document.querySelector([
          'wa-button',
          'wa-dialog',
          'wa-input',
          'wa-textarea',
          'wa-select',
          'wa-checkbox',
          'wa-switch',
          'wa-radio',
          'wa-radio-group',
          'wa-dropdown',
          'wa-popup',
          'wa-tooltip',
          'wa-details',
          'wa-card',
          'wa-alert',
          'wa-badge',
          'wa-tag'
        ].join(','));

      if (!wantsWA) return;
      if (document.getElementById('wa-kit-js')) return;

      const script = document.createElement('script');
      script.id = 'wa-kit-js';
      script.src = '/static/wa-kit.js?v=1';
      script.defer = true;
      script.onload = () => {
        try {
          if (window.WAKit && typeof window.WAKit.auto === 'function') {
            window.WAKit.auto();
          }
        } catch (error) {
          console.warn('wa-kit init error', error);
        }
      };
      (document.head || document.documentElement).appendChild(script);
    } catch (error) {
      console.warn('global loader error', error);
    }
  }

  document.addEventListener('DOMContentLoaded', tryLoadWebAwesome);
})();
