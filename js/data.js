/* =========================================================
   数据层：mock 用户 / 商品 / 会话 / 订单
   所有图片均为内联 SVG，离线可用
   ========================================================= */
(function (global) {
  'use strict';

  /* ---------- 占位图生成 ---------- */
  function svgImg(w, h, from, to, emoji, label) {
    var s =
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">' +
        '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0" stop-color="' + from + '"/><stop offset="1" stop-color="' + to + '"/>' +
        '</linearGradient></defs>' +
        '<rect width="' + w + '" height="' + h + '" fill="url(#g)"/>' +
        '<circle cx="' + (w * 0.82) + '" cy="' + (h * 0.16) + '" r="' + (w * 0.32) + '" fill="#ffffff" opacity="0.12"/>' +
        '<circle cx="' + (w * 0.12) + '" cy="' + (h * 0.88) + '" r="' + (w * 0.26) + '" fill="#000000" opacity="0.06"/>' +
        '<text x="' + (w / 2) + '" y="' + (h * 0.46) + '" font-size="' + Math.round(w * 0.28) + '" text-anchor="middle" dominant-baseline="middle">' + emoji + '</text>' +
        '<text x="' + (w / 2) + '" y="' + (h * 0.67) + '" font-size="' + Math.round(w * 0.055) + '" fill="#ffffff" opacity="0.92" text-anchor="middle" font-family="PingFang SC,Microsoft YaHei,sans-serif">' + label + '</text>' +
      '</svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
  }

  function avatar(ch, bg) {
    var s =
      '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">' +
        '<rect width="96" height="96" rx="48" fill="' + bg + '"/>' +
        '<text x="48" y="49" font-size="40" fill="#ffffff" text-anchor="middle" dominant-baseline="middle" font-family="PingFang SC,Microsoft YaHei,sans-serif">' + ch + '</text>' +
      '</svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
  }

  /* ---------- 分类 ---------- */
  var categories = ['全部', '手机数码', '电脑办公', '服饰鞋包', '家居百货', '图书文娱', '运动户外', '美妆个护', '母婴玩具'];

  /* ---------- 商品 ---------- */
  function item(o) {
    var mk = function (h) {
      return svgImg(600, h, o.c1, o.c2, o.emoji, o.imgLabel || o.title.slice(0, 8));
    };
    return {
      id: o.id,
      title: o.title,
      price: o.price,
      origPrice: o.origPrice,
      condition: o.condition,
      category: o.category,
      location: o.location,
      distance: o.distance,
      likes: o.likes,
      views: o.views,
      shipping: o.shipping || '包邮',
      desc: o.desc,
      tags: o.tags || [],
      time: o.time,
      images: [mk(o.h1 || 760), mk(o.h2 || 840), mk(o.h3 || 700)],
      seller: {
        name: o.seller,
        avatar: avatar(o.seller.slice(0, 1), o.sc || '#4C6FFF'),
        credit: o.credit || 95,
        items: o.sellerItems || 8
      },
      mine: false
    };
  }

  var items = [
    item({
      id: 'i1', title: 'iPhone 13 128G 星光色 国行 电池健康 92%',
      price: 2499, origPrice: 5999, condition: '95新', category: '手机数码',
      location: '杭州·西湖区', distance: '1.2km', likes: 128, views: 2043,
      seller: '阿凯', sc: '#4C6FFF', credit: 96, sellerItems: 12,
      time: '2小时前', h1: 820,
      desc: '自用机，无磕碰无拆修，功能全部正常。\n电池健康度 92%，原装充电器 + 包装盒都在。\n同城可当面验机，外地顺丰包邮。',
      tags: ['可小刀', '无拆修', '原装配件'],
      emoji: '📱', c1: '#5B7CFA', c2: '#8FA8FF', imgLabel: 'iPhone 13'
    }),
    item({
      id: 'i2', title: 'MacBook Air M2 8+256 午夜色 循环 32 次',
      price: 5299, origPrice: 7999, condition: '99新', category: '电脑办公',
      location: '杭州·滨江区', distance: '3.4km', likes: 86, views: 1302,
      seller: '林小满', sc: '#7C5CFF', credit: 98, sellerItems: 5,
      time: '5小时前', h1: 700,
      desc: '2023 年买的，一直贴膜带壳使用，成色非常好。\n电池循环 32 次，几乎没用过。\n送原装充电器和内胆包。',
      tags: ['自用', '带壳', '送配件'],
      emoji: '💻', c1: '#2F3542', c2: '#57606F', imgLabel: 'MacBook Air'
    }),
    item({
      id: 'i3', title: 'AirPods Pro 2 代 全新未拆封 国行正品',
      price: 899, origPrice: 1899, condition: '全新', category: '手机数码',
      location: '杭州·余杭区', distance: '6.1km', likes: 203, views: 3310,
      seller: '数码小铺', sc: '#FF7A45', credit: 93, sellerItems: 36,
      time: '10分钟前', h1: 880,
      desc: '公司年会抽奖中的，全新未拆封，国行正品带发票。\n支持验货，假一赔十。',
      tags: ['全新未拆', '带发票', '可验货'],
      emoji: '🎧', c1: '#12B886', c2: '#63E6BE', imgLabel: 'AirPods Pro'
    }),
    item({
      id: 'i4', title: 'iPad Air 5 64G WiFi 版 蓝色 学生党自用',
      price: 2999, origPrice: 4399, condition: '9成新', category: '电脑办公',
      location: '杭州·下沙', distance: '8.7km', likes: 64, views: 980,
      seller: '柠檬不酸', sc: '#F783AC', credit: 94, sellerItems: 7,
      time: '1天前', h1: 760,
      desc: '毕业出，屏幕无划痕，边框有一点点使用痕迹（已拍细节图）。\n电池健康 90%，配原装充电头。',
      tags: ['毕业出', '可小刀'],
      emoji: '📲', c1: '#4DABF7', c2: '#A5D8FF', imgLabel: 'iPad Air 5'
    }),
    item({
      id: 'i5', title: '索尼 WH-1000XM5 头戴降噪耳机 黑色',
      price: 1299, origPrice: 2899, condition: '95新', category: '手机数码',
      location: '杭州·拱墅区', distance: '2.8km', likes: 97, views: 1544,
      seller: '耳机控', sc: '#845EF7', credit: 97, sellerItems: 4,
      time: '3小时前', h1: 700,
      desc: '买来通勤用，后来开车就不用了，闲置出。\n降噪效果顶级，耳罩无磨损，原装收纳盒齐全。',
      tags: ['原装收纳盒', '无磨损'],
      emoji: '🎵', c1: '#3B5BDB', c2: '#748FFC', imgLabel: 'WH-1000XM5'
    }),
    item({
      id: 'i6', title: '宜家 马尔姆 双人床架 150×200 自提',
      price: 380, origPrice: 1299, condition: '9成新', category: '家居百货',
      location: '杭州·西湖区', distance: '1.8km', likes: 41, views: 620,
      seller: '搬家中', sc: '#20C997', credit: 92, sellerItems: 9,
      time: '6小时前', h1: 900,
      desc: '搬家急出，床架完好，需自行拆卸搬运。\n同小区可帮忙搬到楼下。',
      tags: ['仅自提', '急出'],
      emoji: '🛏️', c1: '#B08968', c2: '#DDB892', imgLabel: '宜家床架'
    }),
    item({
      id: 'i7', title: '优衣库 男款轻型羽绒服 L 码 藏青',
      price: 199, origPrice: 599, condition: '95新', category: '服饰鞋包',
      location: '杭州·上城区', distance: '4.2km', likes: 23, views: 310,
      seller: '衣柜清仓', sc: '#F06595', credit: 95, sellerItems: 15,
      time: '8小时前', h1: 820,
      desc: '去年冬天买的，穿过三四次，无污渍无破损。\n尺码偏大，170/65kg 穿 L 合适。',
      tags: ['穿过几次', '无污渍'],
      emoji: '🧥', c1: '#364FC7', c2: '#5C7CFA', imgLabel: '优衣库羽绒服'
    }),
    item({
      id: 'i8', title: '捷安特 SCR2 公路自行车 51 码 骑行 300km',
      price: 1680, origPrice: 3299, condition: '9成新', category: '运动户外',
      location: '杭州·萧山区', distance: '12km', likes: 76, views: 1180,
      seller: '追风少年', sc: '#FD7E14', credit: 96, sellerItems: 3,
      time: '1天前', h1: 700,
      desc: '入手半年，骑行约 300km，车况良好，刚做过保养。\n送骑行头盔和水壶架。',
      tags: ['刚保养', '送头盔'],
      emoji: '🚲', c1: '#F76707', c2: '#FFA94D', imgLabel: '捷安特 SCR2'
    }),
    item({
      id: 'i9', title: '考研英语一 全套资料 真题 + 词汇 + 笔记',
      price: 45, origPrice: 320, condition: '8成新', category: '图书文娱',
      location: '杭州·江干区', distance: '5.5km', likes: 52, views: 740,
      seller: '上岸的鱼', sc: '#12B886', credit: 99, sellerItems: 6,
      time: '2天前', h1: 860,
      desc: '已上岸，资料全套转给学弟学妹。\n含真题、词汇书、自己的手写笔记，笔记很详细。',
      tags: ['含笔记', '全套'],
      emoji: '📚', c1: '#0CA678', c2: '#63E6BE', imgLabel: '考研资料'
    }),
    item({
      id: 'i10', title: 'Switch OLED 白色 续航版 + 3 张游戏卡',
      price: 1599, origPrice: 2599, condition: '95新', category: '图书文娱',
      location: '杭州·滨江区', distance: '3.9km', likes: 145, views: 2260,
      seller: '游戏收藏家', sc: '#E64980', credit: 94, sellerItems: 11,
      time: '4小时前', h1: 780,
      desc: '玩得不多，屏幕无划痕，手柄无漂移。\n含塞尔达、马力欧赛车、动森三张卡带。',
      tags: ['含游戏卡', '无漂移'],
      emoji: '🎮', c1: '#D6336C', c2: '#F783AC', imgLabel: 'Switch OLED'
    }),
    item({
      id: 'i11', title: '戴森 V8 无绳吸尘器 配件齐全 已清洁',
      price: 899, origPrice: 2999, condition: '9成新', category: '家居百货',
      location: '杭州·西湖区', distance: '2.1km', likes: 58, views: 830,
      seller: '爱干净', sc: '#15AABF', credit: 97, sellerItems: 5,
      time: '1天前', h1: 740,
      desc: '换了新款所以出，吸力正常，电池续航约 25 分钟。\n所有吸头齐全，已深度清洁消毒。',
      tags: ['配件齐全', '已消毒'],
      emoji: '🌀', c1: '#1098AD', c2: '#66D9E8', imgLabel: '戴森 V8'
    }),
    item({
      id: 'i12', title: '佳能 EOS M50 微单套机 15-45mm 快门 8k',
      price: 2890, origPrice: 5299, condition: '95新', category: '手机数码',
      location: '杭州·上城区', distance: '4.6km', likes: 112, views: 1760,
      seller: '光影记录', sc: '#7048E8', credit: 98, sellerItems: 8,
      time: '7小时前', h1: 820,
      desc: '快门数 8000 左右，成像优秀，镜头无霉无雾。\n含原装电池两块、充电器、相机包。',
      tags: ['低快门', '含相机包'],
      emoji: '📷', c1: '#5F3DC4', c2: '#9775FA', imgLabel: '佳能 M50'
    }),
    item({
      id: 'i13', title: '乐高 保时捷 911 10295 已拼装 零件齐全',
      price: 1200, origPrice: 2199, condition: '9成新', category: '母婴玩具',
      location: '杭州·余杭区', distance: '9.3km', likes: 67, views: 940,
      seller: '积木迷', sc: '#F59F00', credit: 95, sellerItems: 6,
      time: '2天前', h1: 760,
      desc: '已拼装完成，一直摆在柜子里，无灰尘。\n零件齐全，说明书和包装盒都在。',
      tags: ['零件齐全', '含包装盒'],
      emoji: '🧱', c1: '#E8590C', c2: '#FFA94D', imgLabel: '乐高 911'
    }),
    item({
      id: 'i14', title: '小米扫地机器人 1S 激光导航 已换新刷',
      price: 599, origPrice: 1799, condition: '9成新', category: '家居百货',
      location: '杭州·拱墅区', distance: '3.1km', likes: 39, views: 560,
      seller: '科技宅', sc: '#4C6EF5', credit: 93, sellerItems: 10,
      time: '3天前', h1: 800,
      desc: '升级换新出，机器工作正常，刚换过边刷和滤网。\nApp 可正常连接控制。',
      tags: ['刚换耗材', '可连 App'],
      emoji: '🤖', c1: '#364FC7', c2: '#91A7FF', imgLabel: '米家扫地机'
    }),
    item({
      id: 'i15', title: '雅诗兰黛 小棕瓶精华 50ml 全新未拆 专柜小样',
      price: 399, origPrice: 850, condition: '全新', category: '美妆个护',
      location: '杭州·西湖区', distance: '1.5km', likes: 88, views: 1230,
      seller: '美妆代购', sc: '#E64980', credit: 91, sellerItems: 22,
      time: '5小时前', h1: 880,
      desc: '专柜赠品，全新未拆封，2027 年到期。\n可提供专柜小票照片。',
      tags: ['全新未拆', '有小票'],
      emoji: '🧴', c1: '#C2255C', c2: '#FAA2C1', imgLabel: '小棕瓶 50ml'
    })
  ];

  /* ---------- 当前用户 ---------- */
  var user = {
    id: 'u1',
    name: '小鱼干',
    avatar: avatar('鱼', '#FFB020'),
    credit: 96,
    following: 23,
    followers: 8,
    city: '杭州'
  };

  /* ---------- 会话 ---------- */
  var chats = [
    {
      id: 'c1', itemId: 'i1', name: '阿凯', avatar: avatar('凯', '#4C6FFF'),
      unread: 2, time: '刚刚',
      messages: [
        { from: 'them', text: '你好，这个 iPhone 还在的', time: '14:02' },
        { from: 'me', text: '电池健康多少呀？有没有拆修过？', time: '14:05' },
        { from: 'them', text: '92%，全原装没拆过，可以当面验机', time: '14:06' },
        { from: 'them', text: '同城的话今天就能面交', time: '14:06' }
      ]
    },
    {
      id: 'c2', itemId: 'i5', name: '耳机控', avatar: avatar('耳', '#845EF7'),
      unread: 0, time: '昨天',
      messages: [
        { from: 'them', text: '耳机还在，配件都齐', time: '昨天 20:11' },
        { from: 'me', text: '1200 可以吗？', time: '昨天 20:20' },
        { from: 'them', text: '1250 吧，包邮给你', time: '昨天 20:22' }
      ]
    },
    {
      id: 'c3', itemId: 'i9', name: '上岸的鱼', avatar: avatar('鱼', '#12B886'),
      unread: 0, time: '10月28日',
      messages: [
        { from: 'me', text: '资料还在吗？', time: '10月28日 09:30' },
        { from: 'them', text: '在的，笔记很全，45 包邮', time: '10月28日 09:41' }
      ]
    }
  ];

  /* ---------- 收货地址 ---------- */
  var address = {
    name: '李小鱼',
    phone: '138****6688',
    text: '浙江省杭州市西湖区文三路 478 号 华星时代广场 A 座 1203'
  };

  /* ---------- 预置订单 ---------- */
  var seedOrders = [
    {
      id: '20261028140231', itemId: 'i5',
      title: '索尼 WH-1000XM5 头戴降噪耳机 黑色',
      image: items[4].images[0], price: 1299, shipping: 0, total: 1299,
      status: 'pending_receive', createdAt: '2026-10-28 14:20',
      payMethod: '微信支付', note: '', address: address
    },
    {
      id: '20261026093012', itemId: 'i9',
      title: '考研英语一 全套资料 真题 + 词汇 + 笔记',
      image: items[8].images[0], price: 45, shipping: 0, total: 45,
      status: 'done', createdAt: '2026-10-26 09:30',
      payMethod: '微信支付', note: '', address: address
    }
  ];

  /* ---------- 评价标签 ---------- */
  var reviewTags = ['描述相符', '成色很好', '发货很快', '包装仔细', '态度超好', '价格实惠'];

  /* ---------- 商品留言 ---------- */
  var comments = {
    i1: [
      { name: '小张', avatar: avatar('张', '#F783AC'), text: '能便宜点吗？2300 有意', time: '1小时前' },
      { name: '阿凯', avatar: avatar('凯', '#4C6FFF'), text: '2300 太低了，2450 可以', time: '58分钟前' }
    ],
    i3: [
      { name: '数码控', avatar: avatar('数', '#20C997'), text: '国行还是港版？', time: '20分钟前' }
    ]
  };

  global.DB = {
    categories: categories,
    items: items,
    user: user,
    chats: chats,
    address: address,
    seedOrders: seedOrders,
    reviewTags: reviewTags,
    comments: comments,
    svgImg: svgImg,
    avatar: avatar
  };
})(window);
