/* =========================================================
   页面：确认订单 / 收银台 / 支付成功 / 订单列表 / 订单详情 / 评价
   ========================================================= */
(function () {
  'use strict';

  var App = window.App;
  var icon = App.icon;
  var money = App.money;
  var esc = App.escape;

  var STATUS = {
    pending_pay: { text: '待付款', cls: '' },
    pending_ship: { text: '待发货', cls: '' },
    pending_receive: { text: '待收货', cls: '' },
    pending_review: { text: '待评价', cls: '' },
    done: { text: '已完成', cls: 'done' }
  };

  var FLOW = ['pending_pay', 'pending_ship', 'pending_receive', 'pending_review', 'done'];

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function nowStr() {
    var d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
      ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  function orderNo() {
    var d = new Date();
    return '' + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) +
      pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds());
  }

  /* =========================================================
     确认订单
     ========================================================= */
  App.page('checkout', {
    render: function (p) {
      var it = App.getItem(p.id);
      if (!it) return '<header class="nav"><button class="icon-btn" data-action="back">' + icon('back', 22) + '</button><div class="nav-title">确认订单</div></header>' + '<div class="empty">宝贝不存在</div>';

      var addr = App.state.address;
      var shipping = it.shipping === '包邮' ? 0 : 12;
      var total = it.price + shipping;

      return '' +
      '<header class="nav bordered">' +
        '<button class="icon-btn" data-action="back">' + icon('back', 22) + '</button>' +
        '<div class="nav-title">确认订单</div>' +
      '</header>' +

      '<div class="scroll" style="padding-bottom:74px">' +
        '<div class="addr-card" data-action="edit-address">' +
          '<span class="a-ico">' + icon('location', 20) + '</span>' +
          '<div class="a-main">' +
            '<div class="a-name">' + esc(addr.name) + '<span>' + esc(addr.phone) + '</span></div>' +
            '<div class="a-text">' + esc(addr.text) + '</div>' +
          '</div>' +
          '<span style="color:#C9CDD3">' + icon('forward', 16) + '</span>' +
        '</div>' +

        '<div class="checkout-item">' +
          '<img src="' + it.images[0] + '" alt="">' +
          '<div class="ci-main">' +
            '<div class="ci-title">' + esc(it.title) + '</div>' +
            '<div class="ci-spec">' + esc(it.condition) + ' · ' + esc(it.shipping) + '</div>' +
          '</div>' +
          '<div>' +
            '<div class="ci-price">¥' + money(it.price) + '</div>' +
            '<div class="ci-qty">x1</div>' +
          '</div>' +
        '</div>' +

        '<div class="form-card" style="margin-top:10px;border-radius:12px;margin-left:12px;margin-right:12px">' +
          '<div class="form-row"><span class="label">运费</span><span class="value filled">' + (shipping ? '¥' + money(shipping) : '包邮') + '</span></div>' +
          '<div class="form-row"><span class="label">优惠券</span><span class="value">暂无可用 ›</span></div>' +
          '<div class="form-row"><span class="label">买家留言</span><input id="orderNote" placeholder="选填，请先和卖家协商一致" maxlength="50"></div>' +
        '</div>' +

        '<div style="padding:14px 16px;font-size:11px;color:#9AA0A8;line-height:1.8">' +
          '· 平台担保交易，确认收货后货款才会打给卖家<br>' +
          '· 如遇问题可在订单内申请退款' +
        '</div>' +
      '</div>' +

      '<div class="paybar">' +
        '<span class="total">合计<b>¥' + money(total) + '</b></span>' +
        '<button class="btn btn-accent" data-action="submit-order" data-id="' + it.id + '">提交订单</button>' +
      '</div>';
    }
  });

  App.action('edit-address', function () {
    App.toast('地址编辑（演示）', 1200);
  });

  App.action('submit-order', function (el) {
    var it = App.getItem(el.getAttribute('data-id'));
    if (!it) return;
    var noteEl = document.getElementById('orderNote');
    var shipping = it.shipping === '包邮' ? 0 : 12;

    var order = {
      id: orderNo(),
      itemId: it.id,
      title: it.title,
      image: it.images[0],
      price: it.price,
      shipping: shipping,
      total: it.price + shipping,
      status: 'pending_pay',
      createdAt: nowStr(),
      payMethod: '',
      note: noteEl ? noteEl.value.trim() : '',
      address: App.state.address
    };

    App.state.orders.unshift(order);
    App.save();
    App.router.go('pay', { orderId: order.id }, { replace: true });
  });

  /* =========================================================
     收银台
     ========================================================= */
  App.page('pay', {
    render: function (p) {
      var o = App.getOrder(p.orderId);
      if (!o) return '<header class="nav"><button class="icon-btn" data-action="back">' + icon('back', 22) + '</button><div class="nav-title">收银台</div></header>' + '<div class="empty">订单不存在</div>';

      return '' +
      '<header class="nav bordered">' +
        '<button class="icon-btn" data-action="back">' + icon('back', 22) + '</button>' +
        '<div class="nav-title">收银台</div>' +
      '</header>' +

      '<div class="scroll" style="padding-bottom:74px">' +
        '<div class="pay-amount">' +
          '<div class="pa-label">支付金额</div>' +
          '<div class="pa-num"><i>¥</i>' + money(o.total) + '</div>' +
        '</div>' +

        '<div class="pay-methods">' +
          '<div class="pay-method on" data-action="pick-pay" data-method="微信支付">' +
            '<span class="pm-ico">' + icon('wallet', 16) + '</span>' +
            '<span>微信支付</span>' +
            '<span class="pm-sub">推荐</span>' +
            '<span class="radio"></span>' +
          '</div>' +
          '<div class="pay-method" data-action="pick-pay" data-method="零钱余额">' +
            '<span class="pm-ico" style="background:#FFF4D6;color:#B8860B">' + icon('bag', 16) + '</span>' +
            '<span>零钱余额</span>' +
            '<span class="pm-sub">¥ 1,280.00</span>' +
            '<span class="radio"></span>' +
          '</div>' +
        '</div>' +

        '<div style="padding:16px;font-size:11px;color:#9AA0A8;line-height:1.8">' +
          '支付即表示同意《担保交易服务协议》<br>平台将在确认收货后结算给卖家' +
        '</div>' +
      '</div>' +

      '<div class="paybar">' +
        '<span class="total">实付<b>¥' + money(o.total) + '</b></span>' +
        '<button class="btn btn-accent" data-action="do-pay" data-id="' + o.id + '">立即支付</button>' +
      '</div>';
    }
  });

  var payMethod = '微信支付';

  App.action('pick-pay', function (el) {
    payMethod = el.getAttribute('data-method');
    var list = el.parentNode.querySelectorAll('.pay-method');
    Array.prototype.forEach.call(list, function (n) { n.classList.remove('on'); });
    el.classList.add('on');
  });

  App.action('do-pay', function (el) {
    var o = App.getOrder(el.getAttribute('data-id'));
    if (!o) return;
    o.status = 'pending_ship';
    o.payMethod = payMethod;
    o.paidAt = nowStr();
    App.save();
    App.router.go('paySuccess', { orderId: o.id }, { replace: true });
  });

  /* =========================================================
     支付成功
     ========================================================= */
  App.page('paySuccess', {
    light: false,
    render: function (p) {
      var o = App.getOrder(p.orderId);
      var amount = o ? o.total : 0;

      return '' +
      '<header class="nav">' +
        '<div class="nav-title">支付结果</div>' +
      '</header>' +
      '<div class="scroll">' +
        '<div class="pay-success">' +
          '<div class="success-icon">' + icon('check', 38) + '</div>' +
          '<h2>支付成功</h2>' +
          '<div class="ps-amount">¥' + money(amount) + '</div>' +
          '<div class="ps-tip">已通知卖家发货，请耐心等待</div>' +
          '<div class="ps-btns">' +
            '<button class="btn btn-ghost" data-action="back-home">返回首页</button>' +
            '<button class="btn btn-primary" data-action="view-order" data-id="' + (o ? o.id : '') + '">查看订单</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    }
  });

  App.action('back-home', function () {
    App.router.switchTab('home');
  });

  App.action('view-order', function (el) {
    App.router.go('orderDetail', { orderId: el.getAttribute('data-id') }, { replace: true });
  });

  /* =========================================================
     订单列表
     ========================================================= */
  var ORDER_TABS = [
    { key: 'all', label: '全部' },
    { key: 'pending_pay', label: '待付款' },
    { key: 'pending_ship', label: '待发货' },
    { key: 'pending_receive', label: '待收货' },
    { key: 'pending_review', label: '待评价' }
  ];

  function orderActions(o) {
    if (o.status === 'pending_pay') {
      return '<button class="btn btn-ghost" data-action="cancel-order" data-id="' + o.id + '">取消订单</button>' +
        '<button class="btn btn-accent" data-action="pay-again" data-id="' + o.id + '">去支付</button>';
    }
    if (o.status === 'pending_ship') {
      return '<button class="btn btn-ghost" data-action="remind" data-id="' + o.id + '">提醒发货</button>' +
        '<button class="btn btn-primary" data-action="detail-order" data-id="' + o.id + '">查看订单</button>';
    }
    if (o.status === 'pending_receive') {
      return '<button class="btn btn-ghost" data-action="logistics" data-id="' + o.id + '">查看物流</button>' +
        '<button class="btn btn-accent" data-action="confirm-receive" data-id="' + o.id + '">确认收货</button>';
    }
    if (o.status === 'pending_review') {
      return '<button class="btn btn-accent" data-action="go-review" data-id="' + o.id + '">去评价</button>';
    }
    return '<button class="btn btn-ghost" data-action="detail-order" data-id="' + o.id + '">查看详情</button>' +
      '<button class="btn btn-ghost" data-action="rebuy" data-id="' + o.id + '">再次购买</button>';
  }

  App.page('orders', {
    render: function (p) {
      var tab = p.tab || 'all';
      var list = App.state.orders.filter(function (o) {
        return tab === 'all' ? true : o.status === tab;
      });

      return '' +
      '<header class="nav bordered">' +
        '<button class="icon-btn" data-action="back">' + icon('back', 22) + '</button>' +
        '<div class="nav-title">我的订单</div>' +
      '</header>' +

      '<div class="order-tabs">' +
        ORDER_TABS.map(function (t) {
          return '<button class="' + (t.key === tab ? 'on' : '') + '" data-action="order-tab" data-tab="' + t.key + '">' + t.label + '</button>';
        }).join('') +
      '</div>' +

      '<div class="scroll">' +
        (list.length ? list.map(function (o) {
          var st = STATUS[o.status];
          return '<div class="order-card">' +
            '<div class="oc-head"><span>订单号 ' + o.id + '</span><span class="oc-status ' + st.cls + '">' + st.text + '</span></div>' +
            '<div class="oc-body" data-action="detail-order" data-id="' + o.id + '">' +
              '<img src="' + o.image + '" alt="">' +
              '<div class="oc-info">' +
                '<div class="oc-title">' + esc(o.title) + '</div>' +
                '<div class="oc-meta">' + esc(o.createdAt) + '</div>' +
              '</div>' +
            '</div>' +
            '<div class="oc-foot">' +
              '<span class="oc-total">实付 <b>¥' + money(o.total) + '</b></span>' +
              orderActions(o) +
            '</div>' +
          '</div>';
        }).join('') : '<div class="empty"><span class="emoji">🧾</span><div class="empty-title">暂无相关订单</div><div>去首页逛逛，找点喜欢的宝贝</div></div>') +
        '<div style="height:20px"></div>' +
      '</div>';
    }
  });

  App.action('order-tab', function (el) {
    var t = App.router.top();
    t.params.tab = el.getAttribute('data-tab');
    App.router.refresh();
  });

  App.action('detail-order', function (el) {
    App.router.go('orderDetail', { orderId: el.getAttribute('data-id') });
  });

  App.action('pay-again', function (el) {
    App.router.go('pay', { orderId: el.getAttribute('data-id') });
  });

  App.action('cancel-order', function (el) {
    var id = el.getAttribute('data-id');
    App.sheet(
      '<div class="sheet-head"><span>确认取消这笔订单？</span><button data-action="close-sheet">关闭</button></div>' +
      '<div class="sheet-list">' +
        '<button class="sheet-item" data-action="do-cancel" data-id="' + id + '" style="color:#FF4D2D">确认取消订单</button>' +
        '<button class="sheet-item" data-action="close-sheet">再想想</button>' +
      '</div>'
    );
  });

  App.action('do-cancel', function (el) {
    var id = el.getAttribute('data-id');
    App.state.orders = App.state.orders.filter(function (o) { return o.id !== id; });
    App.save();
    App.closeSheet(true);
    App.router.refresh();
    App.toast('订单已取消');
  });

  App.action('remind', function () {
    App.toast('已提醒卖家发货');
  });

  App.action('logistics', function () {
    App.toast('物流：顺丰速运 SF1234567890（演示）', 1800);
  });

  App.action('rebuy', function (el) {
    var o = App.getOrder(el.getAttribute('data-id'));
    if (o) App.router.go('detail', { id: o.itemId });
  });

  App.action('confirm-receive', function (el) {
    var id = el.getAttribute('data-id');
    App.sheet(
      '<div class="sheet-head"><span>确认收到宝贝了吗？</span><button data-action="close-sheet">关闭</button></div>' +
      '<div class="sheet-list">' +
        '<button class="sheet-item" data-action="do-receive" data-id="' + id + '" style="color:#FF4D2D">确认收货</button>' +
        '<button class="sheet-item" data-action="close-sheet">还没收到</button>' +
      '</div>'
    );
  });

  App.action('do-receive', function (el) {
    var o = App.getOrder(el.getAttribute('data-id'));
    if (o) { o.status = 'pending_review'; App.save(); }
    App.closeSheet(true);
    App.router.refresh();
    App.toast('确认收货成功，去评价一下吧');
  });

  App.action('go-review', function (el) {
    App.router.go('review', { orderId: el.getAttribute('data-id') });
  });

  /* =========================================================
     订单详情
     ========================================================= */
  App.page('orderDetail', {
    render: function (p) {
      var o = App.getOrder(p.orderId);
      if (!o) return '<header class="nav"><button class="icon-btn" data-action="back">' + icon('back', 22) + '</button><div class="nav-title">订单详情</div></header>' + '<div class="empty">订单不存在</div>';

      var st = STATUS[o.status];
      var idx = FLOW.indexOf(o.status);
      var isDone = o.status === 'done';

      var steps = [
        { t: '提交订单', time: o.createdAt },
        { t: '买家付款', time: o.paidAt || '—' },
        { t: '卖家发货', time: idx >= 2 ? '顺丰速运 SF1234567890' : '—' },
        { t: '确认收货', time: idx >= 3 ? '已签收' : '—' },
        { t: '评价完成', time: isDone ? '已评价' : '—' }
      ];

      return '' +
      '<header class="nav bordered">' +
        '<button class="icon-btn" data-action="back">' + icon('back', 22) + '</button>' +
        '<div class="nav-title">订单详情</div>' +
      '</header>' +

      '<div class="scroll" style="padding-bottom:74px">' +
        '<div class="status-banner ' + (isDone ? 'gray' : '') + '">' +
          '<h3>' + st.text + '</h3>' +
          '<p>' + (o.status === 'pending_pay' ? '请尽快完成支付，超时订单将自动关闭' :
                    o.status === 'pending_ship' ? '卖家正在准备发货，请耐心等待' :
                    o.status === 'pending_receive' ? '宝贝已发出，收到后请确认收货' :
                    o.status === 'pending_review' ? '交易完成，来给卖家一个评价吧' : '感谢你的信任，交易已完成') + '</p>' +
        '</div>' +

        '<div class="section" style="margin-top:0">' +
          '<div class="checkout-item" style="padding:0;margin:0">' +
            '<img src="' + o.image + '" alt="">' +
            '<div class="ci-main">' +
              '<div class="ci-title">' + esc(o.title) + '</div>' +
              '<div class="ci-spec">' + (o.payMethod ? esc(o.payMethod) : '未支付') + '</div>' +
            '</div>' +
            '<div><div class="ci-price">¥' + money(o.price) + '</div><div class="ci-qty">x1</div></div>' +
          '</div>' +
        '</div>' +

        '<div class="section">' +
          '<div class="section-title">收货信息</div>' +
          '<div class="info-row"><span>' + esc(o.address.name) + ' ' + esc(o.address.phone) + '</span></div>' +
          '<div class="info-row"><span style="color:#5B6068;text-align:left;max-width:100%">' + esc(o.address.text) + '</span></div>' +
        '</div>' +

        '<div class="section">' +
          '<div class="section-title">订单进度</div>' +
          '<div class="timeline" style="padding:4px 0 0">' +
            steps.map(function (s, i) {
              var on = i <= idx;
              return '<div class="tl-item' + (on ? ' on' : '') + '">' +
                '<span class="tl-dot"></span>' +
                '<div class="tl-main"><div class="tl-title">' + s.t + '</div><div class="tl-time">' + esc(s.time) + '</div></div>' +
              '</div>';
            }).join('') +
          '</div>' +
        '</div>' +

        '<div class="section">' +
          '<div class="info-row"><span>订单编号</span><span>' + o.id + '</span></div>' +
          '<div class="info-row"><span>下单时间</span><span>' + esc(o.createdAt) + '</span></div>' +
          '<div class="info-row"><span>支付方式</span><span>' + (o.payMethod || '—') + '</span></div>' +
          '<div class="info-row"><span>买家留言</span><span>' + (o.note ? esc(o.note) : '无') + '</span></div>' +
          '<div class="info-row"><span>运费</span><span>' + (o.shipping ? '¥' + money(o.shipping) : '包邮') + '</span></div>' +
          '<div class="info-row"><span>实付款</span><span style="color:#FF4D2D;font-weight:700">¥' + money(o.total) + '</span></div>' +
        '</div>' +

        (o.status === 'pending_ship'
          ? '<div style="padding:0 12px 12px"><button class="btn btn-ghost btn-block" data-action="demo-ship" data-id="' + o.id + '">🛠 演示：模拟卖家发货</button></div>'
          : '') +

        '<div style="height:20px"></div>' +
      '</div>' +

      '<div class="paybar">' +
        (o.status === 'pending_pay'
          ? '<button class="btn btn-accent btn-block" data-action="pay-again" data-id="' + o.id + '">立即支付 ¥' + money(o.total) + '</button>'
          : o.status === 'pending_receive'
            ? '<button class="btn btn-ghost" style="flex:1" data-action="logistics">查看物流</button>' +
              '<button class="btn btn-accent" style="flex:1" data-action="confirm-receive" data-id="' + o.id + '">确认收货</button>'
            : o.status === 'pending_review'
              ? '<button class="btn btn-accent btn-block" data-action="go-review" data-id="' + o.id + '">去评价</button>'
              : '<button class="btn btn-ghost btn-block" data-action="rebuy" data-id="' + o.id + '">再次购买</button>') +
      '</div>';
    }
  });

  App.action('demo-ship', function (el) {
    var o = App.getOrder(el.getAttribute('data-id'));
    if (!o) return;
    o.status = 'pending_receive';
    App.save();
    App.router.refresh();
    App.toast('卖家已发货（演示）');
  });

  /* =========================================================
     评价
     ========================================================= */
  var rating = 5;
  var pickedTags = {};

  App.page('review', {
    render: function (p) {
      var o = App.getOrder(p.orderId);
      if (!o) return '<header class="nav"><button class="icon-btn" data-action="back">' + icon('back', 22) + '</button><div class="nav-title">评价</div></header>' + '<div class="empty">订单不存在</div>';
      rating = 5;
      pickedTags = {};

      return '' +
      '<header class="nav bordered">' +
        '<button class="icon-btn" data-action="back">' + icon('back', 22) + '</button>' +
        '<div class="nav-title">评价宝贝</div>' +
        '<div class="nav-right"><button class="search-cancel" data-action="submit-review" data-id="' + o.id + '">发布</button></div>' +
      '</header>' +

      '<div class="scroll" style="padding-bottom:20px">' +
        '<div class="checkout-item" style="margin-top:12px">' +
          '<img src="' + o.image + '" alt="">' +
          '<div class="ci-main">' +
            '<div class="ci-title">' + esc(o.title) + '</div>' +
            '<div class="ci-spec">¥' + money(o.total) + '</div>' +
          '</div>' +
        '</div>' +

        '<div class="review-stars" id="reviewStars">' +
          [1, 2, 3, 4, 5].map(function (n) {
            return '<button class="on" data-action="star" data-n="' + n + '">★</button>';
          }).join('') +
        '</div>' +
        '<div style="text-align:center;font-size:12px;color:#9AA0A8" id="starText">非常满意</div>' +

        '<div class="review-tags">' +
          DB.reviewTags.map(function (t) {
            return '<button data-action="pick-tag" data-tag="' + t + '">' + t + '</button>';
          }).join('') +
        '</div>' +

        '<div class="review-text">' +
          '<textarea id="reviewText" maxlength="200" placeholder="说说宝贝的成色、卖家的服务，帮助更多人做决定～"></textarea>' +
        '</div>' +

        '<div class="review-anon">' +
          '<span>匿名评价</span>' +
          '<button class="switch" data-action="toggle-anon" aria-label="匿名"></button>' +
        '</div>' +

        '<div style="padding:0 16px;font-size:11px;color:#9AA0A8;line-height:1.8">' +
          '评价发布后不可修改，请如实评价哦～' +
        '</div>' +
      '</div>';
    }
  });

  var STAR_TEXT = ['', '很差', '一般', '还行', '满意', '非常满意'];

  App.action('star', function (el) {
    rating = Number(el.getAttribute('data-n'));
    var wrap = document.getElementById('reviewStars');
    Array.prototype.forEach.call(wrap.children, function (b, i) {
      b.classList.toggle('on', i < rating);
    });
    var txt = document.getElementById('starText');
    if (txt) txt.textContent = STAR_TEXT[rating];
  });

  App.action('pick-tag', function (el) {
    var tag = el.getAttribute('data-tag');
    if (pickedTags[tag]) delete pickedTags[tag]; else pickedTags[tag] = true;
    el.classList.toggle('on', !!pickedTags[tag]);
  });

  App.action('toggle-anon', function (el) {
    el.classList.toggle('on');
  });

  App.action('submit-review', function (el) {
    var o = App.getOrder(el.getAttribute('data-id'));
    if (!o) return;
    var ta = document.getElementById('reviewText');
    o.status = 'done';
    o.review = {
      rating: rating,
      tags: Object.keys(pickedTags),
      text: ta ? ta.value.trim() : '',
      time: nowStr()
    };
    App.save();
    App.router.back();
    App.router.refresh();
    App.toast('评价成功，感谢你的反馈');
  });
})();
