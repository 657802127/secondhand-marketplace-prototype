/* =========================================================
   页面：首页 / 搜索 / 商品详情 / 收藏与列表
   ========================================================= */
(function () {
  'use strict';

  var App = window.App;
  var icon = App.icon;
  var money = App.money;
  var esc = App.escape;

  /* ---------------- 公共卡片 ---------------- */
  App.itemCard = function (it) {
    return '' +
      '<article class="item-card" data-action="go" data-page="detail" data-id="' + it.id + '">' +
        '<div class="thumb">' +
          '<img src="' + it.images[0] + '" alt="" loading="lazy">' +
          '<span class="cond">' + esc(it.condition) + '</span>' +
        '</div>' +
        '<div class="info">' +
          '<h3 class="title">' + esc(it.title) + '</h3>' +
          '<div class="price-row">' +
            '<span class="price"><i>¥</i>' + money(it.price) + '</span>' +
            '<s class="orig">¥' + money(it.origPrice) + '</s>' +
            '<span class="likes">' + icon('heart', 11) + it.likes + '</span>' +
          '</div>' +
          '<div class="meta">' +
            '<img src="' + it.seller.avatar + '" alt="">' +
            '<span>' + esc(it.seller.name) + '</span>' +
            '<span>·</span>' +
            '<span>' + esc(it.location) + '</span>' +
          '</div>' +
        '</div>' +
      '</article>';
  };

  function emptyState(emoji, title, sub) {
    return '<div class="empty">' +
      '<span class="emoji">' + emoji + '</span>' +
      '<div class="empty-title">' + esc(title) + '</div>' +
      '<div>' + esc(sub || '') + '</div>' +
      '</div>';
  }

  /* =========================================================
     首页
     ========================================================= */
  App.page('home', {
    tab: true,
    render: function () {
      var items = App.allItems();
      var cats = DB.categories;

      return '' +
      '<header class="nav nav-home">' +
        '<div class="nav-left">' +
          '<button class="loc">' + icon('location', 14) + '<span>上海</span></button>' +
        '</div>' +
        '<div class="searchbar" data-action="go" data-page="search">' +
          icon('search', 16) + '<span>搜索你想要的商品</span>' +
        '</div>' +
        '<div class="nav-right">' +
          '<button class="icon-btn" data-action="tab" data-page="messages" aria-label="消息">' + icon('message', 21) + '</button>' +
        '</div>' +
      '</header>' +

      '<div class="scroll">' +
        '<div class="cats">' +
          cats.map(function (c, i) {
            return '<button class="cat' + (i === 0 ? ' active' : '') + '" data-action="go" data-page="search" data-category="' + esc(c) + '">' + esc(c) + '</button>';
          }).join('') +
        '</div>' +

        '<div class="banner banner-img" data-action="go" data-page="search">' +
          '<img src="assets/banner.png" alt="Banner">' +  
          '<h3>毕业季 · 闲置好物</h3>' +
          '<p>低至 3.9 折，同城当面交易更放心</p>' +
          '<span class="banner-btn">立即逛逛 ›</span>' +
        '</div>' +

        '<div class="sec-head"><h2>猜你喜欢</h2><span>根据你的浏览推荐</span></div>' +

        '<div class="grid">' + items.map(App.itemCard).join('') + '</div>' +
        '<div class="list-end">—— 没有更多了 ——</div>' +
      '</div>';
    }
  });

  /* =========================================================
     搜索 / 分类结果
     ========================================================= */
  function searchItems(p) {
    var list = App.allItems().slice();
    if (p.category && p.category !== '全部') list = list.filter(function (i) { return i.category === p.category; });
    if (p.keyword) {
      var k = String(p.keyword).toLowerCase();
      list = list.filter(function (i) {
        return (i.title + ' ' + i.desc + ' ' + i.category).toLowerCase().indexOf(k) > -1;
      });
    }
    if (p.cond) list = list.filter(function (i) { return i.condition === p.cond; });

    if (p.sort === 'price-asc') list.sort(function (a, b) { return a.price - b.price; });
    else if (p.sort === 'price-desc') list.sort(function (a, b) { return b.price - a.price; });
    else if (p.sort === 'new') list.sort(function (a, b) { return a.likes - b.likes; });

    return list;
  }

  App.page('search', {
    render: function (p) {
      var list = searchItems(p);
      var sort = p.sort || 'default';

      return '' +
      '<header class="nav bordered search-nav">' +
        '<button class="icon-btn" data-action="back" aria-label="返回">' + icon('back', 22) + '</button>' +
        '<div class="search-field">' +
          icon('search', 15) +
          '<input type="search" placeholder="搜索你想要的宝贝" value="' + esc(p.keyword || '') + '" data-enter="search-submit">' +
        '</div>' +
        '<button class="search-cancel" data-action="search-submit">搜索</button>' +
      '</header>' +

      '<div class="scroll">' +
        '<div class="filterbar">' +
          '<button class="' + (sort === 'default' ? 'on' : '') + '" data-action="sort" data-sort="default">综合</button>' +
          '<button class="' + (sort === 'new' ? 'on' : '') + '" data-action="sort" data-sort="new">最新</button>' +
          '<button class="' + ((sort === 'price-asc' || sort === 'price-desc') ? 'on' : '') + '" data-action="sort" data-sort="price-asc">价格' +
            '<span style="display:inline-flex;' + (sort === 'price-desc' ? 'transform:rotate(180deg)' : '') + '">' + icon('arrowDown', 12) + '</span>' +
          '</button>' +
          '<button class="filter-right" data-action="toggle-cond">' +
            (p.cond ? '成色：' + esc(p.cond) : '筛选') + icon('arrowDown', 12) +
          '</button>' +
        '</div>' +

        (p.category || p.cond ? '<div class="filter-chip">' +
          (p.category ? '<button class="on" data-action="clear-category">' + esc(p.category) + ' ✕</button>' : '') +
          (p.cond ? '<button class="on" data-action="clear-cond">' + esc(p.cond) + ' ✕</button>' : '') +
          '</div>' : '') +

        '<div class="result-count">共 ' + list.length + ' 件宝贝' + (p.keyword ? ' · 搜索“' + esc(p.keyword) + '”' : '') + '</div>' +

        (list.length
          ? '<div class="grid">' + list.map(App.itemCard).join('') + '</div><div class="list-end">—— 到底了 ——</div>'
          : emptyState('🔍', '没有找到相关宝贝', '换个关键词或筛选条件试试')) +
      '</div>';
    }
  });

  App.action('search-submit', function () {
    var t = App.router.top();
    if (!t) return;
    var input = t.el.querySelector('.search-field input');
    t.params.keyword = input ? input.value.trim() : '';
    App.router.refresh();
  });

  App.action('sort', function (el) {
    var t = App.router.top();
    var s = el.getAttribute('data-sort');
    if (s === 'price-asc' && t.params.sort === 'price-asc') s = 'price-desc';
    t.params.sort = s;
    App.router.refresh();
  });

  App.action('clear-category', function () {
    var t = App.router.top();
    delete t.params.category;
    App.router.refresh();
  });

  App.action('clear-cond', function () {
    var t = App.router.top();
    delete t.params.cond;
    App.router.refresh();
  });

  App.action('toggle-cond', function () {
    var t = App.router.top();
    var conds = ['95新', '99新', '9成新', '全新'];
    var cur = t.params.cond || '';
    App.sheet(
      '<div class="sheet-head"><span>选择成色</span><button data-action="close-sheet">关闭</button></div>' +
      '<div class="sheet-list">' +
        '<button class="sheet-item' + (!cur ? ' on' : '') + '" data-action="pick-cond" data-cond="">不限成色' +
          (!cur ? '<span class="check">' + icon('check', 18) + '</span>' : '') + '</button>' +
        conds.map(function (c) {
          return '<button class="sheet-item' + (cur === c ? ' on' : '') + '" data-action="pick-cond" data-cond="' + c + '">' + c +
            (cur === c ? '<span class="check">' + icon('check', 18) + '</span>' : '') + '</button>';
        }).join('') +
      '</div>'
    );
  });

  App.action('pick-cond', function (el) {
    var t = App.router.top();
    var c = el.getAttribute('data-cond');
    if (c) t.params.cond = c; else delete t.params.cond;
    App.closeSheet(true);
    App.router.refresh();
  });

  /* =========================================================
     商品详情
     ========================================================= */
  App.page('detail', {
    light: true,
    render: function (p) {
      var it = App.getItem(p.id);
      if (!it) {
        return '<header class="nav"><button class="icon-btn" data-action="back">' + icon('back', 22) + '</button>' +
          '<div class="nav-title">商品详情</div></header>' + emptyState('🫥', '宝贝不见了', '可能已被卖家下架');
      }
      var fav = App.isFav(it.id);
      var cs = App.state.comments[it.id] || [];

      return '' +
      '<div class="scroll detail-scroll">' +
        '<div class="gallery">' +
          '<div class="gallery-track" id="galleryTrack">' +
            it.images.map(function (src) { return '<img src="' + src + '" alt="">'; }).join('') +
          '</div>' +
          '<span class="gallery-counter" id="galleryCounter">1/' + it.images.length + '</span>' +
        '</div>' +

        '<div class="detail-body">' +
          '<div class="detail-price-row">' +
            '<span class="price"><i>¥</i>' + money(it.price) + '</span>' +
            '<s class="orig">原价 ¥' + money(it.origPrice) + '</s>' +
            '<span class="want"><span>' + it.likes + ' 人想要</span><span>' + it.views + ' 浏览</span></span>' +
          '</div>' +

          '<h1 class="detail-title">' + esc(it.title) + '</h1>' +

          '<div class="detail-tags">' +
            '<span class="tag tag-yellow">' + esc(it.condition) + '</span>' +
            '<span class="tag">' + esc(it.shipping) + '</span>' +
            '<span class="tag">' + esc(it.distance) + '</span>' +
            it.tags.map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('') +
          '</div>' +

          '<div class="seller-card">' +
            '<img class="avatar" src="' + it.seller.avatar + '" alt="">' +
            '<div>' +
              '<div class="s-name">' + esc(it.seller.name) + '<span class="credit">信用 ' + it.seller.credit + '</span></div>' +
              '<div class="s-meta">在售 ' + it.seller.items + ' 件 · ' + esc(it.location) + '</div>' +
            '</div>' +
            '<button class="btn btn-ghost btn-sm">进店看看</button>' +
          '</div>' +

          '<div class="detail-sec">' +
            '<h4>宝贝描述</h4>' +
            '<p class="detail-desc">' + esc(it.desc) + '</p>' +
          '</div>' +

          '<div class="detail-sec">' +
            '<h4>留言 ' + cs.length + '</h4>' +
            (cs.length ? cs.map(function (c) {
              return '<div class="comment">' +
                '<img src="' + c.avatar + '" alt="">' +
                '<div class="c-body">' +
                  '<div class="c-name">' + esc(c.name) + '</div>' +
                  '<div class="c-text">' + esc(c.text) + '</div>' +
                  '<div class="c-time">' + esc(c.time) + '</div>' +
                '</div>' +
              '</div>';
            }).join('') : '<div style="font-size:13px;color:#9AA0A8">还没有留言，来问第一句吧</div>') +
          '</div>' +

          '<div style="height:16px"></div>' +
        '</div>' +
      '</div>' +

      '<header class="nav overlay">' +
        '<button class="icon-btn" data-action="back" aria-label="返回">' + icon('back', 22) + '</button>' +
        '<div class="nav-right">' +
          '<button class="icon-btn" data-action="share" aria-label="分享">' + icon('share', 20) + '</button>' +
          '<button class="icon-btn" data-action="more" aria-label="更多">' + icon('more', 20) + '</button>' +
        '</div>' +
      '</header>' +

      '<div class="actionbar">' +
        '<button class="act' + (fav ? ' on' : '') + '" data-action="fav" data-id="' + it.id + '">' +
          '<span class="ico">' + icon(fav ? 'heart-fill' : 'heart', 22) + '</span><span>收藏</span>' +
        '</button>' +
        '<button class="act" data-action="chat" data-id="' + it.id + '">' +
          '<span class="ico">' + icon('message', 21) + '</span><span>聊一聊</span>' +
        '</button>' +
        '<button class="btn btn-accent" data-action="buy" data-id="' + it.id + '">立即购买</button>' +
      '</div>';
    },
    mounted: function (el, p) {
      var track = el.querySelector('#galleryTrack');
      var counter = el.querySelector('#galleryCounter');
      if (!track || !counter) return;
      var total = track.children.length;
      track.addEventListener('scroll', function () {
        var i = Math.round(track.scrollLeft / track.clientWidth) + 1;
        counter.textContent = Math.min(i, total) + '/' + total;
      }, { passive: true });
    }
  });

  App.action('fav', function (el) {
    var id = el.getAttribute('data-id');
    var on = App.toggleFav(id);
    var svg = el.querySelector('.ico');
    if (svg) svg.innerHTML = icon(on ? 'heart-fill' : 'heart', 22);
    el.classList.toggle('on', on);
    App.toast(on ? '已加入收藏' : '已取消收藏', 1000);
  });

  App.action('share', function () {
    App.toast('已复制宝贝链接（演示）', 1200);
  });

  App.action('more', function () {
    App.sheet(
      '<div class="sheet-head"><span>更多操作</span><button data-action="close-sheet">关闭</button></div>' +
      '<div class="sheet-list">' +
        '<button class="sheet-item" data-action="toast" data-msg="已举报，平台会尽快核实">举报该宝贝</button>' +
        '<button class="sheet-item" data-action="toast" data-msg="已屏蔽该卖家">不感兴趣</button>' +
        '<button class="sheet-item" data-action="toast" data-msg="链接已复制">复制链接</button>' +
      '</div>'
    );
  });

  App.action('toast', function (el) {
    App.toast(el.getAttribute('data-msg') || '操作成功');
    App.closeSheet(true);
  });

  App.action('chat', function (el) {
    if (!App.state.loggedIn) return App.requireLogin();
    var itemId = el.getAttribute('data-id');
    var chat = null;
    for (var i = 0; i < App.state.chats.length; i++) {
      if (App.state.chats[i].itemId === itemId) { chat = App.state.chats[i]; break; }
    }
    if (!chat) {
      var it = App.getItem(itemId);
      chat = {
        id: 'c' + Date.now(),
        itemId: itemId,
        name: it.seller.name,
        avatar: it.seller.avatar,
        unread: 0,
        time: '刚刚',
        messages: [{ from: 'them', text: '你好，宝贝还在的，有什么想了解的？', time: '刚刚' }]
      };
      App.state.chats.unshift(chat);
      App.save();
    }
    chat.unread = 0;
    App.save();
    App.router.go('chat', { id: chat.id });
  });

  App.action('buy', function (el) {
    if (!App.state.loggedIn) return App.requireLogin();
    App.router.go('checkout', { id: el.getAttribute('data-id') });
  });

  /* =========================================================
     收藏 / 我发布的 / 我卖出的
     ========================================================= */
  App.page('list', {
    render: function (p) {
      var type = p.type || 'fav';
      var titleMap = { fav: '我的收藏', published: '我发布的', sold: '我卖出的', bought: '我买到的' };
      var title = titleMap[type] || '列表';
      var body = '';

      if (type === 'fav') {
        var items = App.state.favorites.map(App.getItem).filter(Boolean);
        body = items.length
          ? '<div class="grid">' + items.map(App.itemCard).join('') + '</div><div class="list-end">—— 到底了 ——</div>'
          : emptyState('💛', '还没有收藏的宝贝', '看到喜欢的就点个收藏吧');
      } else if (type === 'published') {
        body = App.state.myItems.length
          ? '<div class="grid">' + App.state.myItems.map(App.itemCard).join('') + '</div>'
          : emptyState('📦', '还没有发布过宝贝', '点击底部「+」发布你的第一件闲置');
      } else if (type === 'sold') {
        var sold = [
          { title: 'Kindle Paperwhite 4 8G 已出售', price: 320, image: DB.items[8].images[0], buyer: '买家 王**', time: '2026-10-20' },
          { title: '罗技 MX Master 3 已出售', price: 380, image: DB.items[11].images[0], buyer: '买家 陈**', time: '2026-10-12' }
        ];
        body = '<div style="padding:10px 12px 0">' + sold.map(function (s) {
          return '<div class="order-card"><div class="oc-head"><span>' + s.time + '</span><span class="oc-status done">已卖出</span></div>' +
            '<div class="oc-body"><img src="' + s.image + '" alt=""><div class="oc-info">' +
            '<div class="oc-title">' + esc(s.title) + '</div>' +
            '<div class="oc-meta">' + esc(s.buyer) + '</div>' +
            '<div class="oc-meta">成交价 ¥' + money(s.price) + '</div>' +
            '</div></div></div>';
        }).join('') + '</div>';
      } else {
        body = emptyState('🧾', '暂无记录', '');
      }

      return '' +
      '<header class="nav bordered">' +
        '<button class="icon-btn" data-action="back">' + icon('back', 22) + '</button>' +
        '<div class="nav-title">' + esc(title) + '</div>' +
      '</header>' +
      '<div class="scroll">' + body + '<div style="height:16px"></div></div>';
    }
  });
})();
