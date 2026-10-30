/* =========================================================
   启动 & 评审辅助导航
   ========================================================= */
(function () {
  'use strict';

  var App = window.App;

  function jump(name, params) {
    App.router.switchTab('home');
    if (name !== 'home') {
      App.router.go(name, params || {});
    }
  }

  var QUICK = {
    home: function () { App.router.switchTab('home'); },
    search: function () { jump('search', {}); },
    detail: function () { jump('detail', { id: 'i1' }); },
    publish: function () { jump('publish', {}); },
    messages: function () { App.router.switchTab('messages'); },
    chat: function () { jump('chat', { id: 'c1' }); },
    profile: function () { App.router.switchTab('profile'); },
    orders: function () { jump('orders', { tab: 'all' }); },
    list: function () { jump('list', { type: 'fav' }); },
    checkout: function () { jump('checkout', { id: 'i3' }); }
  };

  document.querySelectorAll('[data-quick]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var fn = QUICK[btn.getAttribute('data-quick')];
      if (fn) fn();
    });
  });

  /* 按可用高度等比缩放手机，保证完整可见（真机访问时不缩放） */
  function fitPhone() {
    if (window.innerWidth <= 500) {
      document.documentElement.style.setProperty('--phone-scale', '1');
      return;
    }
    var avail = window.innerHeight - 76;
    var scale = Math.min(1, Math.max(0.55, avail / 812));
    document.documentElement.style.setProperty('--phone-scale', String(Math.round(scale * 1000) / 1000));
  }
  fitPhone();
  window.addEventListener('resize', fitPhone);

  /* 演示：首次进入给个提示 */
  App.boot();

  setTimeout(function () {
    App.toast('点击商品卡片，体验完整交易流程', 2200);
  }, 500);
})();
