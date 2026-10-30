/* =========================================================
   页面：发布 / 消息 / 聊天 / 我的 / 登录
   ========================================================= */
(function () {
  'use strict';

  var App = window.App;
  var icon = App.icon;
  var money = App.money;
  var esc = App.escape;

  /* =========================================================
     登录
     ========================================================= */
  App.requireLogin = function () {
    App.sheet(
      '<div class="login-sheet">' +
        '<div class="logo">🐟</div>' +
        '<h3>登录闲置集市</h3>' +
        '<p>使用微信一键登录<br>同步你的收藏、消息与订单</p>' +
        '<button class="btn btn-primary" data-action="do-login">微信一键登录</button>' +
        '<span class="cancel" data-action="close-sheet">暂不登录</span>' +
      '</div>'
    );
  };

  App.action('login', function () { App.requireLogin(); });

  App.action('do-login', function () {
    App.state.loggedIn = true;
    App.save();
    App.closeSheet(true);
    App.router.refresh();
    App.toast('登录成功，欢迎回来');
  });

  App.action('logout', function () {
    App.state.loggedIn = false;
    App.save();
    App.closeSheet(true);
    App.router.refresh();
    App.toast('已退出登录');
  });

  /* =========================================================
     发布
     ========================================================= */
  var pub = { photos: [], category: '手机数码', condition: '95新', shipping: '包邮' };

  function photoGridHtml() {
    var slots = pub.photos.map(function (src, i) {
      return '<div class="photo-slot"><img src="' + src + '" alt="">' +
        '<button class="del" data-action="del-photo" data-i="' + i + '">✕</button></div>';
    }).join('');
    var add = pub.photos.length < 9
      ? '<button class="photo-add" data-action="add-photo">' + icon('camera', 22) + '<span>添加图片</span></button>'
      : '';
    return slots + add;
  }

  function refreshPhotos() {
    var grid = document.querySelector('.photo-grid');
    if (grid) grid.innerHTML = photoGridHtml();
  }

  App.page('publish', {
    render: function () {
      pub = { photos: [], category: '手机数码', condition: '95新', shipping: '包邮' };

      return '' +
      '<header class="nav bordered">' +
        '<button class="icon-btn" data-action="back">' + icon('back', 22) + '</button>' +
        '<div class="nav-title">发布闲置</div>' +
        '<div class="nav-right"><button class="search-cancel" data-action="toast" data-msg="草稿已保存">存草稿</button></div>' +
      '</header>' +

      '<div class="scroll publish-scroll">' +
        '<div class="pub-photos">' +
          '<div class="photo-grid" id="photoGrid">' + photoGridHtml() + '</div>' +
          '<div class="photo-tip">添加清晰的实拍图，更容易卖出 · 最多 9 张</div>' +
        '</div>' +

        '<div class="form-card">' +
          '<div class="form-row"><input id="pubTitle" placeholder="标题：品牌型号 + 成色，卖得更快" maxlength="30"></div>' +
          '<textarea id="pubDesc" class="form-textarea" placeholder="描述一下宝贝的入手渠道、使用感受、转手原因…" maxlength="200"></textarea>' +
        '</div>' +

        '<div class="form-card">' +
          '<div class="form-row">' +
            '<span class="label">价格</span>' +
            '<span class="unit">¥</span><input id="pubPrice" type="number" placeholder="0.00" style="flex:0 0 90px">' +
            '<span class="label" style="width:auto;flex:0 0 auto;text-align:right">原价</span>' +
            '<input id="pubOrig" type="number" placeholder="选填" style="flex:0 0 80px;text-align:right">' +
          '</div>' +
          '<div class="form-row" data-action="pick-category">' +
            '<span class="label">分类</span>' +
            '<span class="value filled" id="pubCategory">' + pub.category + '</span>' +
            '<span class="arrow">' + icon('forward', 16) + '</span>' +
          '</div>' +
          '<div class="form-row" data-action="pick-condition">' +
            '<span class="label">成色</span>' +
            '<span class="value filled" id="pubCondition">' + pub.condition + '</span>' +
            '<span class="arrow">' + icon('forward', 16) + '</span>' +
          '</div>' +
          '<div class="form-row">' +
            '<span class="label">运费</span>' +
            '<div style="margin-left:auto;display:flex;gap:8px" id="shipGroup">' +
              '<button class="btn btn-sm ' + (pub.shipping === '包邮' ? 'btn-primary' : 'btn-ghost') + '" data-action="pick-ship" data-ship="包邮">包邮</button>' +
              '<button class="btn btn-sm ' + (pub.shipping === '自提' ? 'btn-primary' : 'btn-ghost') + '" data-action="pick-ship" data-ship="自提">仅自提</button>' +
            '</div>' +
          '</div>' +
          '<div class="form-row">' +
            '<span class="label">位置</span>' +
            '<span class="value filled">杭州 · 西湖区</span>' +
            '<span class="arrow">' + icon('location', 16) + '</span>' +
          '</div>' +
        '</div>' +

        '<div class="pub-tip">' +
          '发布小贴士：真实描述瑕疵、支持验货、价格合理，成交率能提升 3 倍哦～' +
        '</div>' +
        '<div style="height:20px"></div>' +
      '</div>' +

      '<div class="publish-bar">' +
        '<button class="btn btn-primary btn-lg" style="flex:1" data-action="submit-publish">发布</button>' +
      '</div>';
    }
  });

  App.action('add-photo', function () {
    if (pub.photos.length >= 9) return App.toast('最多上传 9 张图片');
    var emojis = ['📦', '🛍️', '📸', '✨', '🎁'];
    var pairs = [['#8FA8FF', '#5B7CFA'], ['#FFC078', '#FF922B'], ['#63E6BE', '#12B886'], ['#FAA2C1', '#E64980']];
    var c = pairs[pub.photos.length % pairs.length];
    pub.photos.push(DB.svgImg(600, 600, c[0], c[1], emojis[pub.photos.length % emojis.length], '实拍图'));
    refreshPhotos();
  });

  App.action('del-photo', function (el) {
    pub.photos.splice(Number(el.getAttribute('data-i')), 1);
    refreshPhotos();
  });

  App.action('pick-category', function () {
    App.sheet(
      '<div class="sheet-head"><span>选择分类</span><button data-action="close-sheet">关闭</button></div>' +
      '<div class="sheet-list">' +
        DB.categories.filter(function (c) { return c !== '全部'; }).map(function (c) {
          return '<button class="sheet-item' + (pub.category === c ? ' on' : '') + '" data-action="set-category" data-value="' + esc(c) + '">' + esc(c) +
            (pub.category === c ? '<span class="check">' + icon('check', 18) + '</span>' : '') + '</button>';
        }).join('') +
      '</div>'
    );
  });

  App.action('set-category', function (el) {
    pub.category = el.getAttribute('data-value');
    var n = document.getElementById('pubCategory');
    if (n) n.textContent = pub.category;
    App.closeSheet(true);
  });

  App.action('pick-condition', function () {
    var conds = ['全新', '99新', '95新', '9成新', '8成新'];
    App.sheet(
      '<div class="sheet-head"><span>选择成色</span><button data-action="close-sheet">关闭</button></div>' +
      '<div class="sheet-list">' +
        conds.map(function (c) {
          return '<button class="sheet-item' + (pub.condition === c ? ' on' : '') + '" data-action="set-condition" data-value="' + c + '">' + c +
            (pub.condition === c ? '<span class="check">' + icon('check', 18) + '</span>' : '') + '</button>';
        }).join('') +
      '</div>'
    );
  });

  App.action('set-condition', function (el) {
    pub.condition = el.getAttribute('data-value');
    var n = document.getElementById('pubCondition');
    if (n) n.textContent = pub.condition;
    App.closeSheet(true);
  });

  App.action('pick-ship', function (el) {
    pub.shipping = el.getAttribute('data-ship');
    var group = document.getElementById('shipGroup');
    if (group) {
      Array.prototype.forEach.call(group.children, function (b) {
        var on = b.getAttribute('data-ship') === pub.shipping;
        b.className = 'btn btn-sm ' + (on ? 'btn-primary' : 'btn-ghost');
      });
    }
  });

  App.action('submit-publish', function () {
    var title = (document.getElementById('pubTitle') || {}).value || '';
    var desc = (document.getElementById('pubDesc') || {}).value || '';
    var price = Number((document.getElementById('pubPrice') || {}).value || 0);
    var orig = Number((document.getElementById('pubOrig') || {}).value || 0);

    if (!title.trim()) return App.toast('请填写标题');
    if (!price) return App.toast('请填写价格');

    var fallback = [DB.svgImg(600, 760, '#8FA8FF', '#5B7CFA', '📦', '闲置好物')];

    var item = {
      id: 'm' + Date.now(),
      title: title.trim(),
      price: price,
      origPrice: orig || price,
      condition: pub.condition,
      category: pub.category,
      location: '杭州·西湖区',
      distance: '0km',
      likes: 0,
      views: 1,
      shipping: pub.shipping === '自提' ? '自提' : '包邮',
      desc: desc.trim() || '卖家很懒，什么都没写～',
      tags: ['新发布'],
      time: '刚刚',
      images: pub.photos.length ? pub.photos.slice() : fallback,
      seller: {
        name: App.state.user.name,
        avatar: App.state.user.avatar,
        credit: App.state.user.credit,
        items: 1
      },
      mine: true
    };

    App.state.myItems.unshift(item);
    App.save();
    App.router.back();
    App.toast('发布成功，宝贝已上架');
  });

  /* =========================================================
     消息
     ========================================================= */
  App.page('messages', {
    tab: true,
    render: function () {
      var chats = App.state.chats;

      return '' +
      '<header class="nav bordered">' +
        '<div class="nav-title">消息</div>' +
      '</header>' +

      '<div class="scroll">' +
        '<div class="msg-quick">' +
          '<button data-action="toast" data-msg="暂无新的赞和收藏"><span class="qi">❤️</span>赞和收藏</button>' +
          '<button data-action="toast" data-msg="暂无新粉丝"><span class="qi">👤</span>新粉丝</button>' +
          '<button data-action="toast" data-msg="暂无系统通知"><span class="qi">🔔</span>系统通知</button>' +
        '</div>' +

        (chats.length
          ? '<div class="chat-list">' + chats.map(function (c) {
              var last = c.messages[c.messages.length - 1] || {};
              var it = App.getItem(c.itemId);
              return '<div class="chat-item" data-action="open-chat" data-id="' + c.id + '">' +
                '<img class="avatar" src="' + c.avatar + '" alt="">' +
                '<div class="c-main">' +
                  '<div class="c-top"><span class="c-name">' + esc(c.name) + '</span>' +
                    '<span class="c-time">' + esc(c.time) + '</span></div>' +
                  '<div class="c-last">' + esc(last.text || '') + '</div>' +
                  (it ? '<div class="c-tags"><span class="tag">' + esc(it.title.slice(0, 14)) + '…</span></div>' : '') +
                '</div>' +
                (c.unread ? '<span class="badge">' + c.unread + '</span>' : '') +
              '</div>';
            }).join('') + '</div>'
          : '<div class="empty"><span class="emoji">💬</span><div class="empty-title">还没有消息</div><div>和卖家聊聊，问问宝贝细节</div></div>') +

        '<div style="height:20px"></div>' +
      '</div>';
    }
  });

  App.action('open-chat', function (el) {
    var c = App.getChat(el.getAttribute('data-id'));
    if (c) c.unread = 0;
    App.save();
    App.router.go('chat', { id: el.getAttribute('data-id') });
  });

  /* =========================================================
     聊天
     ========================================================= */
  App.page('chat', {
    render: function (p) {
      var c = App.getChat(p.id);
      if (!c) return '<header class="nav"><button class="icon-btn" data-action="back">' + icon('back', 22) + '</button><div class="nav-title">聊天</div></header>' + '<div class="empty">会话不存在</div>';
      var it = App.getItem(c.itemId);

      return '' +
      '<header class="nav bordered">' +
        '<button class="icon-btn" data-action="back">' + icon('back', 22) + '</button>' +
        '<div class="nav-title">' + esc(c.name) + '</div>' +
        '<div class="nav-right"><button class="icon-btn" data-action="toast" data-msg="已进入会话设置">' + icon('more', 20) + '</button></div>' +
      '</header>' +

      '<div class="scroll chat-scroll" id="chatScroll">' +
        (it ? '<div class="chat-item-pin" data-action="go" data-page="detail" data-id="' + it.id + '">' +
          '<img src="' + it.images[0] + '" alt="">' +
          '<div class="p-info">' +
            '<div class="p-title">' + esc(it.title) + '</div>' +
            '<div class="p-price">¥' + money(it.price) + '</div>' +
          '</div>' +
          '<span class="p-go">' + icon('forward', 16) + '</span>' +
        '</div>' : '') +

        '<div class="chat-time">' + (c.time || '') + '</div>' +

        c.messages.map(function (m) {
          return '<div class="bubble-row ' + (m.from === 'me' ? 'me' : '') + '">' +
            '<img src="' + (m.from === 'me' ? App.state.user.avatar : c.avatar) + '" alt="">' +
            '<div class="bubble">' + esc(m.text) + '</div>' +
          '</div>';
        }).join('') +
      '</div>' +

      '<div class="quick-replies">' +
        ['还在吗？', '可以便宜点吗？', '什么时候能发货？', '能当面交易吗？'].map(function (q) {
          return '<button data-action="quick-reply" data-text="' + esc(q) + '">' + esc(q) + '</button>';
        }).join('') +
      '</div>' +

      '<div class="chat-inputbar">' +
        '<input id="chatInput" placeholder="说点什么…" data-enter="send-msg">' +
        '<button class="send" data-action="send-msg">发送</button>' +
      '</div>';
    },
    mounted: function (el) {
      var sc = el.querySelector('#chatScroll');
      if (sc) sc.scrollTop = sc.scrollHeight;
    }
  });

  App.action('quick-reply', function (el) {
    var input = document.getElementById('chatInput');
    if (input) { input.value = el.getAttribute('data-text'); input.focus(); }
  });

  App.action('send-msg', function () {
    var t = App.router.top();
    if (!t || t.name !== 'chat') return;
    var input = document.getElementById('chatInput');
    var text = input ? input.value.trim() : '';
    if (!text) return;

    var c = App.getChat(t.params.id);
    if (!c) return;
    c.messages.push({ from: 'me', text: text, time: '刚刚' });
    c.time = '刚刚';
    App.save();
    App.router.refresh();

    setTimeout(function () {
      var top = App.router.top();
      if (!top || top.name !== 'chat' || top.params.id !== c.id) return;
      var replies = ['在的，有什么想了解的～', '可以小刀，你出个价', '今天就发货，顺丰包邮', '同城可以当面交易'];
      c.messages.push({ from: 'them', text: replies[Math.floor(Math.random() * replies.length)], time: '刚刚' });
      App.save();
      App.router.refresh();
    }, 900);
  });

  /* =========================================================
     我的
     ========================================================= */
  App.page('profile', {
    tab: true,
    render: function () {
      var s = App.state;
      var u = s.user;
      var counts = {
        pending_pay: 0, pending_ship: 0, pending_receive: 0, pending_review: 0
      };
      s.orders.forEach(function (o) {
        if (counts[o.status] !== undefined) counts[o.status]++;
      });

      var head = s.loggedIn
        ? '<div class="profile-user">' +
            '<img class="avatar" src="' + u.avatar + '" alt="">' +
            '<div>' +
              '<div class="u-name">' + esc(u.name) + '<span class="credit">信用 ' + u.credit + '</span></div>' +
              '<div class="u-sub"><span>关注 ' + u.following + '</span><span>粉丝 ' + u.followers + '</span><span>' + esc(u.city) + '</span></div>' +
            '</div>' +
            '<button class="edit" data-action="toast" data-msg="资料编辑（演示）">编辑资料</button>' +
          '</div>' +
          '<div class="profile-stats">' +
            '<div><b>' + s.myItems.length + '</b><span>在售</span></div>' +
            '<div><b>' + s.favorites.length + '</b><span>收藏</span></div>' +
            '<div><b>' + s.orders.filter(function (o) { return o.status === 'done'; }).length + '</b><span>成交</span></div>' +
          '</div>'
        : '<div class="profile-user">' +
            '<img class="avatar" src="' + u.avatar + '" alt="" style="filter:grayscale(1);opacity:.6">' +
            '<div>' +
              '<div class="login-hint" data-action="login">点击登录 / 注册</div>' +
              '<div class="login-sub">登录后可发布、收藏和交易</div>' +
            '</div>' +
          '</div>';

      var orderBtns = [
        { k: 'pending_pay', label: '待付款', e: '💳' },
        { k: 'pending_ship', label: '待发货', e: '📦' },
        { k: 'pending_receive', label: '待收货', e: '🚚' },
        { k: 'pending_review', label: '待评价', e: '⭐' }
      ];

      return '' +
      '<div class="scroll">' +
        '<div class="profile-head">' + head + '</div>' +

        '<div class="order-entry">' +
          '<div class="oe-head">我的订单' +
            '<span data-action="go" data-page="orders" data-tab="all">全部订单 ' + icon('forward', 13) + '</span>' +
          '</div>' +
          '<div class="oe-grid">' +
            orderBtns.map(function (b) {
              return '<button data-action="go" data-page="orders" data-tab="' + b.k + '">' +
                '<span class="oi">' + b.e + '</span><span>' + b.label + '</span>' +
                (counts[b.k] ? '<span class="n">' + counts[b.k] + '</span>' : '') +
              '</button>';
            }).join('') +
          '</div>' +
        '</div>' +

        '<div class="quad-grid">' +
          '<div class="quad" data-action="go" data-page="orders" data-tab="all">' +
            '<span class="q-ico">🛒</span>' +
            '<div class="q-main"><div class="q-title">我买到的</div><div class="q-sub">全部订单</div></div>' +
            '<span class="q-num">' + s.orders.length + '</span>' +
          '</div>' +
          '<div class="quad" data-action="go" data-page="list" data-type="sold">' +
            '<span class="q-ico">💰</span>' +
            '<div class="q-main"><div class="q-title">我卖出的</div><div class="q-sub">成交记录</div></div>' +
            '<span class="q-num">2</span>' +
          '</div>' +
          '<div class="quad" data-action="go" data-page="list" data-type="published">' +
            '<span class="q-ico">📮</span>' +
            '<div class="q-main"><div class="q-title">我发布的</div><div class="q-sub">在售宝贝</div></div>' +
            '<span class="q-num">' + s.myItems.length + '</span>' +
          '</div>' +
          '<div class="quad" data-action="go" data-page="list" data-type="fav">' +
            '<span class="q-ico">💛</span>' +
            '<div class="q-main"><div class="q-title">我的收藏</div><div class="q-sub">想买的都在这</div></div>' +
            '<span class="q-num">' + s.favorites.length + '</span>' +
          '</div>' +
        '</div>' +

        '<div class="tool-list">' +
          '<div class="tool-row" data-action="toast" data-msg="收货地址管理（演示）"><span class="t-ico">📍</span><span>收货地址</span><span class="arrow">' + icon('forward', 15) + '</span></div>' +
          '<div class="tool-row" data-action="toast" data-msg="暂无可用优惠券"><span class="t-ico">🎫</span><span>优惠券</span><span class="arrow">' + icon('forward', 15) + '</span></div>' +
          '<div class="tool-row" data-action="toast" data-msg="客服在线时间 9:00-21:00"><span class="t-ico">💬</span><span>联系客服</span><span class="arrow">' + icon('forward', 15) + '</span></div>' +
          '<div class="tool-row" data-action="open-settings"><span class="t-ico">⚙️</span><span>设置</span><span class="arrow">' + icon('forward', 15) + '</span></div>' +
        '</div>' +

        (s.loggedIn ? '<div class="logout" data-action="logout">退出登录</div>' : '<div class="logout" data-action="login">立即登录</div>') +
        '<div class="list-end">闲置集市 v1.0.0 · 演示原型</div>' +
      '</div>';
    }
  });

  App.action('open-settings', function () {
    App.sheet(
      '<div class="sheet-head"><span>设置</span><button data-action="close-sheet">关闭</button></div>' +
      '<div class="sheet-list">' +
        '<button class="sheet-item" data-action="toast" data-msg="已是最新版本 v1.0.0">检查更新</button>' +
        '<button class="sheet-item" data-action="toast" data-msg="感谢反馈">意见反馈</button>' +
        '<button class="sheet-item" data-action="reset-demo" style="color:#FF4D2D">重置演示数据</button>' +
      '</div>'
    );
  });
})();
