const categoryPhrases = {
  restaurant: [
    { ja: "メニューをください", zh: "請給我菜單", pinyin: "Qǐng gěi wǒ càidān" },
    { ja: "○○はいくらですか？", zh: "這個多少錢？", pinyin: "Zhège duōshǎo qián?" },
    { ja: "おすすめは何ですか？", zh: "有什麼推薦的嗎？", pinyin: "Yǒu shé me tuījiàn de ma?" },
    { ja: "お会計をお願いします", zh: "我要結帳", pinyin: "Wǒ yào jiézhàng" },
    { ja: "パクチーを抜いてください", zh: "不要香菜", pinyin: "Bùyào xiāngcài" }
  ],
  tourist: [
    { ja: "入場料はいくらですか？", zh: "門票多少錢？", pinyin: "Ménpiào duōshǎo qián?" },
    { ja: "写真を撮ってもいいですか？", zh: "可以拍照嗎？", pinyin: "Kěyǐ pāizhào ma?" },
    { ja: "トイレはどこですか？", zh: "洗手間在哪裡？", pinyin: "Xǐshǒujiān zài nǎlǐ?" },
    { ja: "日本語のパンフレットはありますか？", zh: "有日文導覽手冊嗎？", pinyin: "Yǒu rìwén dǎolǎn shǒucè ma?" }
  ],
  nightmarket: [
    { ja: "○○はいくらですか？", zh: "這個多少錢？", pinyin: "Zhège duōshǎo qián?" },
    { ja: "少し安くしてくれませんか？", zh: "可以算便宜一點嗎？", pinyin: "Kěyǐ suàn piányí yīdiǎn ma?" },
    { ja: "持ち帰りでお願いします", zh: "我要外帶", pinyin: "Wǒ yào wàidài" },
    { ja: "ここで食べます", zh: "內用", pinyin: "Nèiyòng" }
  ]
};

const taipeiData = [
  // --- 評価3.5以上の飲食店 ---
  {
    id: "r1",
    name: "鼎泰豊（ディンタイフォン）本店",
    nameZh: "鼎泰豐 信義本店",
    category: "highRated",
    phraseType: "restaurant",
    lat: 25.033501,
    lng: 121.529881,
    rating: 4.5,
    description: "台湾を代表する小籠包の名店。世界的に有名で常に行列ができています。",
    specialty: "小籠包、トリュフ入り小籠包、エビチャーハン",
    address: "台北市大安區信義路二段194號"
  },
  {
    id: "r2",
    name: "金峰魯肉飯（ジンフォンルーロウファン）",
    nameZh: "金峰魯肉飯",
    category: "highRated",
    phraseType: "restaurant",
    lat: 25.032646,
    lng: 121.518659,
    rating: 4.2,
    description: "ローカルにも大人気のルーローハン（八角が効いた豚肉かけご飯）の超有名店。",
    specialty: "魯肉飯（ルーローハン）、肉焿湯（肉つみれとろみスープ）",
    address: "台北市中正區羅斯福路一段10號"
  },

  // --- ミシュラン・ビブグルマン掲載 ---
  {
    id: "m1",
    name: "雙月食品社（シュアンユエ）青島店",
    nameZh: "雙月食品社 青島店",
    category: "michelin",
    phraseType: "restaurant",
    lat: 25.042854,
    lng: 121.521873,
    rating: 4.6,
    description: "何年も連続でビブグルマンに選出されている、養生スープと台湾総菜の超人気店。",
    specialty: "蛤蜊燉雞湯（ハマグリと鶏肉の漢方スープ）、滷味（台湾風煮込み）",
    address: "台北市中正區青島東路6之2號"
  },
  {
    id: "m2",
    name: "杭州小籠湯包（ハンジョウシャオロンタンバオ）",
    nameZh: "杭州小籠湯包",
    category: "michelin",
    phraseType: "restaurant",
    lat: 25.03451,
    lng: 121.525546,
    rating: 4.1,
    description: "鼎泰豊に匹敵する味と評判で、ビブグルマンにも掲載された小籠包の名店。比較的リーズナブル。",
    specialty: "小籠湯包、カニミソ小籠包",
    address: "台北市大安區杭州南路二段17號"
  },

  // --- 日本人向けの観光スポット ---
  {
    id: "s1",
    name: "台北101（タイペイイチマルイチ）",
    nameZh: "台北101大樓",
    category: "tourist",
    phraseType: "tourist",
    lat: 25.033964,
    lng: 121.564468,
    rating: 4.7,
    description: "台北のシンボルである超高層ビル。展望台からは台北市内を一望できます。",
    specialty: "89階からのパノラマ夜景、巨大なチューンドマスマダンパー",
    address: "台北市信義區信義路五段7號"
  },
  {
    id: "s2",
    name: "国立故宮博物院",
    nameZh: "國立故宮博物院",
    category: "tourist",
    phraseType: "tourist",
    lat: 25.102355,
    lng: 121.548492,
    rating: 4.6,
    description: "世界四大博物館の1つ。歴代中国皇帝の至宝が世界最大規模で展示されています。",
    specialty: "翠玉白菜（白菜を模したヒスイ細工）、肉形石（豚の角煮そっくりな石）",
    address: "台北市士林區至善路二段221號"
  },
  {
    id: "s3",
    name: "龍山寺（ロンシャンスー）",
    nameZh: "艋舺龍山寺",
    category: "tourist",
    phraseType: "tourist",
    lat: 25.037162,
    lng: 121.499895,
    rating: 4.6,
    description: "台北で最も歴史が古く、ご利益があることで知られるパワースポット。様々な神様が祀られています。",
    specialty: "台湾流のおみくじ体験、豪華絢爛な装飾と建築",
    address: "台北市萬華區廣州街211號"
  },

  // --- 夜市 ---
  {
    id: "n1",
    name: "士林夜市（シーリンイエシー）",
    nameZh: "士林夜市",
    category: "nightmarket",
    phraseType: "nightmarket",
    lat: 25.087965,
    lng: 121.524087,
    rating: 4.3,
    description: "台北で最大規模で最も有名な夜市。B級グルメから雑貨、ゲームまで何でも揃います。",
    specialty: "巨大フライドチキン（豪大大鶏排）、牡蠣オムレツ",
    marketMapUrl: "https://placehold.co/600x400/1E1E24/FFD700?text=士林夜市+露店マップ\n(ダミー画像)", 
    address: "台北市士林區基河路101號"
  },
  {
    id: "n2",
    name: "饒河街観光夜市（ラオホージエ）",
    nameZh: "饒河街觀光夜市",
    category: "nightmarket",
    phraseType: "nightmarket",
    lat: 25.050787,
    lng: 121.577242,
    rating: 4.4,
    description: "一本道で歩きやすく、美味しいグルメが密集している人気の夜市。入り口の輝く門が目印。",
    specialty: "胡椒餅（福州世祖胡椒餅）、薬膳排骨",
    marketMapUrl: "https://placehold.co/600x400/2B0B0B/FFC0CB?text=饒河街夜市+露店マップ\n(ダミー画像)",
    address: "台北市松山區饒河街"
  }
];
