/* =========================================================
   核心：状态 / 存储 / 路由 / 图标 / 浮层 / 事件总线
   ========================================================= */
(function (global) {
  'use strict';

  var App = global.App = {};

  /* ---------------- 图标 ---------------- */
  var PATHS = {
    back: '<path d="M15 18l-6-6 6-6"/>',
    forward: '<path d="M9 6l6 6-6 6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L21 21"/>',
    heart: '<path d="M12 20.3l-1.3-1.2C5.4 14.4 2 11.3 2 7.6 2 4.9 4.1 3 6.7 3c1.5 0 2.9.7 3.8 1.8L12 6.3l1.5-1.5A5 5 0 0 1 17.3 3C19.9 3 22 4.9 22 7.6c0 3.7-3.4 6.8-8.7 11.5L12 20.3z"/>',
    'heart-fill': '<path d="M12 20.3l-1.3-1.2C5.4 14.4 2 11.3 2 7.6 2 4.9 4.1 3 6.7 3c1.5 0 2.9.7 3.8 1.8L12 6.3l1.5-1.5A5 5 0 0 1 17.3 3C19.9 3 22 4.9 22 7.6c0 3.7-3.4 6.8-8.7 11.5L12 20.3z"/>',
    share: '<path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><path d="M16 6l-4-4-4 4"/><path d="M12 2v13"/>',
    more: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    camera: '<rect x="3" y="6" width="18" height="14" rx="3"/><circle cx="12" cy="13" r="3.4"/><path d="M8.5 6l1.2-2h4.6l1.2 2"/>',
    send: '<path d="M21.5 2.5L11 13"/><path d="M21.5 2.5l-7 19-3.5-8.5L2.5 9.5z"/>',
    home: '<path d="M3 10.5L12 3l9 7.5"/><path d="M5.5 9.5V21h13V9.5"/><path d="M9.5 21v-6h5v6"/>',
    message: '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.6-.8L3 21l1.9-5.4A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    star: '<path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2-5.5-2.9-5.5 2.9 1-6.2L3 9.6l6.2-.9z"/>',
    check: '<path d="M4 12.5l5 5L20 6.5"/>',
    location: '<path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
    arrow: '<path d="M9 6l6 6-6 6"/>',
    arrowDown: '<path d="M6 9l6 6 6-6"/>',
    scan: '<path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8"/><path d="M20 8V5.5A1.5 1.5 0 0 0 18.5 4H16"/><path d="M4 16v2.5A1.5 1.5 0 0 0 5.5 20H8"/><path d="M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16"/>',
    edit: '<path d="M4 20h4L20 8l-4-4L4 16v4z"/><path d="M14.5 5.5l4 4"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/>',
    truck: '<path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.8"/><circle cx="17.5" cy="18" r="1.8"/>',
    wallet: '<rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 10h18"/><circle cx="17" cy="14.5" r="1.3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    bag: '<path d="M5 8h14l-1.2 12.5H6.2L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    tag: '<path d="M20 12.5L12.5 20a2 2 0 0 1-2.8 0L3 13.3V3h10.3L20 9.7a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.4"/>',
    grid: '<rect x="3" y="3" width="7.5" height="7.5" rx="1.6"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6"/>'
  };

  App.icon = function (name, size) {
    size = size || 20;
    var filled = name.indexOf('-fill') > -1;
    return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" ' +
      (filled ? 'fill="currentColor" stroke="none"' : 'fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"') +
      ' aria-hidden="true">' + (PATHS[name] || '') + '</svg>';
  };

  /* ---------------- 状态 ---------------- */
  var KEY = 'xianyu_proto_v1';

  var state = App.state = {
    loggedIn: true,
    user: null,
    favorites: [],
    orders: [],
    myItems: [],
    chats: [],
    comments: {},
    address: null
  };

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function seed() {
    state.user = clone(DB.user);
    state.address = clone(DB.address);
    state.favorites = [];
    state.orders = clone(DB.seedOrders);
    state.myItems = [];
    state.chats = clone(DB.chats);
    state.comments = clone(DB.comments);
    state.loggedIn = true;
  }

  function load() {
    seed();
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return;
      var s = JSON.parse(raw);
      ['loggedIn', 'user', 'favorites', 'orders', 'myItems', 'chats', 'comments', 'address'].forEach(function (k) {
        if (s[k] !== undefined && s[k] !== null) state[k] = s[k];
      });
    } catch (e) { /* 忽略隐私模式等异常 */ }
  }

  App.save = function () {
    try {
      localStorage.setItem(KEY, JSON.stringify({
        loggedIn: state.loggedIn,
        user: state.user,
        favorites: state.favorites,
        orders: state.orders,
        myItems: state.myItems,
        chats: state.chats,
        comments: state.comments,
        address: state.address
      }));
    } catch (e) { /* ignore */ }
  };

  App.resetAll = function () {
    try { localStorage.removeItem(KEY); } catch (e) {}
    seed();
    App.save();
  };

  /* ---------------- 查询 ---------------- */
  App.allItems = function () {
    return state.myItems.concat(DB.items);
  };

  App.getItem = function (id) {
    var list = App.allItems();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  };

  App.isFav = function (id) {
    return state.favorites.indexOf(id) > -1;
  };

  App.toggleFav = function (id) {
    var i = state.favorites.indexOf(id);
    if (i > -1) state.favorites.splice(i, 1);
    else state.favorites.unshift(id);
    App.save();
    return i === -1;
  };

  App.getOrder = function (id) {
    for (var i = 0; i < state.orders.length; i++) if (state.orders[i].id === id) return state.orders[i];
    return null;
  };

  App.getChat = function (id) {
    for (var i = 0; i < state.chats.length; i++) if (state.chats[i].id === id) return state.chats[i];
    return null;
  };

  App.unread = function () {
    return state.chats.reduce(function (n, c) { return n + (c.unread || 0); }, 0);
  };

  /* ---------------- 格式化 ---------------- */
  App.money = function (n) {
    n = Number(n) || 0;
    return n % 1 === 0 ? String(n) : n.toFixed(2);
  };

  App.escape = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  };

  /* ---------------- 浮层 ---------------- */
  var overlayRoot = null;
  var sheetEl = null;
  var toastTimer = null;

  function root() {
    if (!overlayRoot) overlayRoot = document.getElementById('overlayRoot');
    return overlayRoot;
  }

  App.sheet = function (html, opts) {
    opts = opts || {};
    App.closeSheet(true);
    var wrap = document.createElement('div');
    wrap.className = 'sheet-wrap';
    wrap.innerHTML = '<div class="mask"></div><div class="sheet' + (opts.className ? ' ' + opts.className : '') + '">' + html + '</div>';
    root().appendChild(wrap);
    var mask = wrap.querySelector('.mask');
    var sheet = wrap.querySelector('.sheet');
    requestAnimationFrame(function () {
      mask.classList.add('show');
      sheet.classList.add('show');
    });
    mask.addEventListener('click', function () {
      if (opts.dismissible !== false) App.closeSheet();
    });
    sheetEl = wrap;
    return wrap;
  };

  App.closeSheet = function (instant) {
    if (!sheetEl) return;
    var wrap = sheetEl;
    sheetEl = null;
    if (instant) { wrap.remove(); return; }
    var mask = wrap.querySelector('.mask');
    var sheet = wrap.querySelector('.sheet');
    if (mask) mask.classList.remove('show');
    if (sheet) sheet.classList.remove('show');
    setTimeout(function () { wrap.remove(); }, 300);
  };

  App.toast = function (msg, ms) {
    var el = document.querySelector('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      root().appendChild(el);
    }
    el.textContent = msg;
    requestAnimationFrame(function () { el.classList.add('show'); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, ms || 1600);
  };

  /* ---------------- 路由 ---------------- */
  var Router = App.router = {
    defs: {},
    stack: [],

    register: function (name, def) { this.defs[name] = def; },

    top: function () { return this.stack[this.stack.length - 1]; },

    go: function (name, params, opts) {
      params = params || {};
      opts = opts || {};
      var def = this.defs[name];
      if (!def) { console.warn('[router] 未注册页面:', name); return; }

      var cur = this.top();
      if (cur) {
        var sc0 = cur.el.querySelector('.scroll');
        cur.scroll = sc0 ? sc0.scrollTop : 0;
      }

      if (opts.replace && cur) {
        cur.el.remove();
        this.stack.pop();
      }

      var rec = { name: name, params: params, def: def, scroll: 0, el: null };
      var el = document.createElement('section');
      el.className = 'page';
      if (def.tab) el.classList.add('page--tab');
      el.style.zIndex = String(10 + this.stack.length);
      el.innerHTML = def.render(params, rec);
      rec.el = el;
      document.getElementById('pages').appendChild(el);
      this.stack.push(rec);

      if (opts.anim !== false) el.classList.add(opts.anim === 'fade' ? 'page-enter-fade' : 'page-enter');

      this.sync();

      var sc = el.querySelector('.scroll');
      if (sc) {
        sc.addEventListener('scroll', function () { rec.scroll = sc.scrollTop; }, { passive: true });
      }
      if (def.mounted) def.mounted(el, params, rec);
    },

    back: function () {
      if (this.stack.length <= 1) return;
      var cur = this.stack.pop();
      var el = cur.el;
      el.classList.add('page-leave');
      setTimeout(function () { el.remove(); }, 270);
      this.sync();
      var prev = this.top();
      if (prev) {
        var sc = prev.el.querySelector('.scroll');
        if (sc) sc.scrollTop = prev.scroll || 0;
        if (prev.def.resumed) prev.def.resumed(prev.el, prev.params, prev);
      }
    },

    switchTab: function (name) {
      var cur = this.top();
      if (cur && cur.name === name) {
        var sc = cur.el.querySelector('.scroll');
        if (sc) sc.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      while (this.stack.length > 1) {
        this.stack.pop().el.remove();
      }
      var rootRec = this.stack.pop();
      if (rootRec) rootRec.el.remove();
      this.go(name, {}, { anim: 'fade' });
    },

    refresh: function () {
      var t = this.top();
      if (!t) return;
      var old = t.el.querySelector('.scroll');
      var y = old ? old.scrollTop : 0;
      t.el.innerHTML = t.def.render(t.params, t);
      var sc = t.el.querySelector('.scroll');
      if (sc) {
        sc.scrollTop = y;
        sc.addEventListener('scroll', function () { t.scroll = sc.scrollTop; }, { passive: true });
      }
      if (t.def.mounted) t.def.mounted(t.el, t.params, t);
      this.sync();
    },

    sync: function () {
      var t = this.top();
      var isTab = !!(t && t.def.tab);
      var tabbar = document.getElementById('tabbar');
      if (tabbar) tabbar.classList.toggle('hidden', !isTab);
      var screen = document.getElementById('screen');
      if (screen) screen.classList.toggle('light', !!(t && t.def.light));
      if (tabbar) {
        Array.prototype.forEach.call(tabbar.querySelectorAll('[data-tab]'), function (b) {
          b.classList.toggle('active', !!t && b.getAttribute('data-tab') === t.name);
        });
        var badge = tabbar.querySelector('.dot-badge');
        var n = App.unread();
        if (badge) {
          badge.textContent = n > 99 ? '99+' : String(n);
          badge.style.display = n ? '' : 'none';
        }
      }
    }
  };

  App.page = function (name, def) { Router.register(name, def); };

  /* ---------------- 事件 ---------------- */
  var Actions = {};
  App.action = function (name, fn) { Actions[name] = fn; };

  function dispatch(e) {
    var t = e.target.closest('[data-action]');
    if (!t) return;
    var fn = Actions[t.getAttribute('data-action')];
    if (!fn) return;
    e.preventDefault();
    fn(t, e);
  }

  document.addEventListener('click', dispatch);

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    var t = e.target;
    if (!t || !t.getAttribute) return;
    var name = t.getAttribute('data-enter');
    if (!name) return;
    e.preventDefault();
    var fn = Actions[name];
    if (fn) fn(t, e);
  });

  /* ---------------- 启动 ---------------- */
  App.boot = function () {
    load();

    var tabs = [
      { page: 'home', label: '首页', icon: 'home', tab: true },
      { page: 'messages', label: '消息', icon: 'message', tab: true, badge: true },
      { page: 'publish', label: '发布', publish: true },
      { page: 'profile', label: '我的', icon: 'user', tab: true }
    ];

    document.getElementById('tabbar').innerHTML = tabs.map(function (t) {
      if (t.publish) {
        return '<button class="tab tab-publish" data-action="go" data-page="publish" aria-label="发布">' +
          '<span class="pub">' + App.icon('plus', 24) + '</span></button>';
      }
      return '<button class="tab" data-action="tab" data-page="' + t.page + '" data-tab="' + t.page + '">' +
        '<span class="ico">' + App.icon(t.icon, 22) + '</span>' +
        '<span>' + t.label + '</span>' +
        (t.badge ? '<span class="dot-badge" style="display:none">0</span>' : '') +
        '</button>';
    }).join('');

    Router.go('home', {}, { anim: false });
  };

  /* 通用动作 */
  App.action('go', function (el) {
    var p = {};
    ['id', 'keyword', 'category', 'type', 'tab', 'orderId'].forEach(function (k) {
      if (el.getAttribute('data-' + k)) p[k] = el.getAttribute('data-' + k);
    });
    Router.go(el.getAttribute('data-page'), p);
  });

  App.action('back', function () { Router.back(); });

  App.action('tab', function (el) { Router.switchTab(el.getAttribute('data-page')); });

  App.action('close-sheet', function () { App.closeSheet(); });

  App.action('reset-demo', function () {
    App.resetAll();
    App.closeSheet();
    Router.switchTab('home');
    App.toast('演示数据已重置');
  });

  global.App = App;
})(window);
