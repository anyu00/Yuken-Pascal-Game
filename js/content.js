/**
 * ============================================================
 *  content.js — ALL TEXT, BRANDING & CONFIGURATION
 *  ✏️  Edit anything here without touching other files!
 * ============================================================
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  🏷️  COMPANY BRANDING  ← edit this section anytime
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const BRAND = {
  name:      "Yuken",
  logoSrc:   "assets/yuken-logo.svg",   // ← swap to your logo file
  logoLink:  "https://www.yuken.co.jp", // ← your company URL
  tagline: {
    en: "Hydraulics for Life",
    ja: "油圧で世界を動かす",
  },
  // Products shown in the simulator as Pascal's "gadgets"
  products: [
    {
      id:    "pump",
      nameen: "Yuken Vane Pump",
      nameja: "油研ベーンポンプ",
      img:   "assets/yuken-vane-pump.svg", // ← swap to your product image
      link:  "https://www.yuken.co.jp/products/pump", // ← your product URL
    },
    {
      id:    "valve",
      nameen: "Yuken Directional Valve",
      nameja: "油研方向制御弁",
      img:   "assets/yuken-valve.svg",
      link:  "https://www.yuken.co.jp/products/valve",
    },
    {
      id:    "cylinder",
      nameen: "Yuken Hydraulic Cylinder",
      nameja: "油研油圧シリンダ",
      img:   "assets/yuken-cylinder.svg",
      link:  "https://www.yuken.co.jp/products/cylinder",
    },
  ],
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  🌐  UI STRINGS  (buttons, labels, headers)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const UI = {
  en: {
    startBtn:       "🚀 Start the Adventure!",
    skipStory:      "Skip Story →",
    nextBtn:        "Next →",
    backBtn:        "← Back",
    simulatorTitle: "🔬 Pascal's Lab",
    simulatorSub:   "Pick an experiment and try it yourself!",
    langBtn:        "🇯🇵 日本語",
    restartBtn:     "🔄 Restart",
    tryBtn:         "Try it! →",
    force:          "Force (F)",
    area:           "Area (A)",
    pressure:       "Pressure (P)",
    forceUnit:      "N",
    areaUnit:       "cm²",
    pressureUnit:   "N/cm²",
    poweredBy:      "Powered by",
    demo1Title:     "🔴 Hydraulic Press",
    demo1Sub:       "Small force in → HUGE force out!",
    demo2Title:     "🔵 Car Brakes",
    demo2Sub:       "One press → pressure goes EVERYWHERE!",
    demo3Title:     "🟢 Deep Sea Diver",
    demo3Sub:       "Go deeper → pressure crushes you!",
    inputForce:     "Your Push (F)",
    inputArea:      "Small Piston Area",
    outputArea:     "Big Piston Area",
    outputForce:    "Output Force",
    depth:          "Depth",
    depthUnit:      "m",
    brakePedal:     "Press Brake Pedal!",
    formulaLabel:   "Pascal's Formula:",
    resultLabel:    "Result:",
  },
  ja: {
    startBtn:       "🚀 冒険を始めよう！",
    skipStory:      "ストーリーをスキップ →",
    nextBtn:        "次へ →",
    backBtn:        "← 戻る",
    simulatorTitle: "🔬 パスカルの実験室",
    simulatorSub:   "実験を選んで、自分で試してみよう！",
    langBtn:        "🇬🇧 English",
    restartBtn:     "🔄 最初から",
    tryBtn:         "試す！ →",
    force:          "力 (F)",
    area:           "面積 (A)",
    pressure:       "圧力 (P)",
    forceUnit:      "N",
    areaUnit:       "cm²",
    pressureUnit:   "N/cm²",
    poweredBy:      "提供：",
    demo1Title:     "🔴 油圧プレス",
    demo1Sub:       "小さな力 → 巨大な力に！",
    demo2Title:     "🔵 車のブレーキ",
    demo2Sub:       "一回踏む → 圧力がどこにでも届く！",
    demo3Title:     "🟢 深海ダイバー",
    demo3Sub:       "深く潜れば → 圧力で押しつぶされる！",
    inputForce:     "あなたが押す力 (F)",
    inputArea:      "小ピストン面積",
    outputArea:     "大ピストン面積",
    outputForce:    "出力される力",
    depth:          "深さ",
    depthUnit:      "m",
    brakePedal:     "ブレーキを踏む！",
    formulaLabel:   "パスカルの公式：",
    resultLabel:    "結果：",
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  🎭  CHARACTER NAMES & EXPRESSIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const CHARACTERS = {
  pascal: {
    nameen: "Pascal",
    nameja: "パスカル",
    color:  "#00d4ff",
  },
  squish: {
    nameen: "SQUISH",
    nameja: "スクイッシュ",
    color:  "#ff6b35",
  },
  cat: {
    nameen: "Fluffy",
    nameja: "モフモフ",
    color:  "#ffd700",
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  📖  STORY SCENES  (5 scenes × EN + JA)
//  Each scene: title, lines[], speaker, mood, character
//  mood: "normal" | "scared" | "excited" | "confused" | "triumphant"
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const SCENES = {
  en: [
    // ── SCENE 1 ─────────────────────────────────────────────
    {
      id: "scene1",
      bg: "city",
      title: "🥞 The Great Pancake Disaster",
      lines: [
        { speaker: "narrator", text: "In the peaceful city of Yukentopia, everything was going fine..." },
        { speaker: "pascal",   text: "Good morning world! Today is going to be a GREAT day! 😊", mood: "excited" },
        { speaker: "narrator", text: "...UNTIL a giant wobbly blob fell from the sky! 💥" },
        { speaker: "squish",   text: "BWAHAHAHA! I AM SQUISH! I WILL SIT ON EVERYTHING!!! 😈", mood: "excited" },
        { speaker: "narrator", text: "SQUISH sat on the whole city. And Pascal's cat..." },
        { speaker: "pascal",   text: "FLUFFY NOOOO!!! My cat is a PANCAKE!!!😱", mood: "scared" },
        { speaker: "cat",      text: "...meow.", mood: "normal" },
        { speaker: "pascal",   text: "I must stop SQUISH! But how...? 🤔", mood: "confused" },
      ],
    },
    // ── SCENE 2 ─────────────────────────────────────────────
    {
      id: "scene2",
      bg: "lab",
      title: "👆 The Tiny Poke Problem",
      lines: [
        { speaker: "pascal",   text: "I'll fight SQUISH with my finger! HI-YAH! 👆", mood: "excited" },
        { speaker: "squish",   text: "Tee hee, that tickles! 😂", mood: "excited" },
        { speaker: "pascal",   text: "Okay... BIG HAMMER then! BONK! 🔨", mood: "excited" },
        { speaker: "squish",   text: "WHEEE!! *bounces off the screen*", mood: "excited" },
        { speaker: "pascal",   text: "...it came back bigger. 😰", mood: "scared" },
        { speaker: "pascal",   text: "Wait wait wait. It's not just about how HARD I push...", mood: "confused" },
        { speaker: "pascal",   text: "It matters WHERE I push! How big the area is! 💡", mood: "excited" },
        { speaker: "narrator", text: "Pascal just discovered something important: FORCE alone isn't enough!" },
      ],
    },
    // ── SCENE 3 ─────────────────────────────────────────────
    {
      id: "scene3",
      bg: "lab",
      title: "📌 The Thumbtack Revelation",
      lines: [
        { speaker: "pascal",   text: "Hmm let me think... *accidentally sits on thumbtack* YEEOWCH!!! 😖", mood: "scared" },
        { speaker: "pascal",   text: "Then sits on big fluffy cushion... Aaaaaaah... 😌", mood: "normal" },
        { speaker: "pascal",   text: "SAME weight! SAME force! But one hurt and one didn't!", mood: "excited" },
        { speaker: "pascal",   text: "The thumbtack is TINY — all my weight on a tiny spot!", mood: "excited" },
        { speaker: "pascal",   text: "The cushion is BIG — weight spread out over a huge area!", mood: "excited" },
        { speaker: "narrator", text: "That feeling? That's called PRESSURE! 🌟" },
        { speaker: "pascal",   text: "Pressure = Force divided by Area! P equals F over A!!! 🎉", mood: "triumphant" },
      ],
    },
    // ── SCENE 4 ─────────────────────────────────────────────
    {
      id: "scene4",
      bg: "formula",
      title: "🎉 The Magic Formula Dance",
      lines: [
        { speaker: "narrator", text: "The three magic letters appeared in the sky..." },
        { speaker: "narrator", text: "P is PRESSURE — the drama queen 👑" },
        { speaker: "narrator", text: "F is FORCE — the muscle 💪" },
        { speaker: "narrator", text: "A is AREA — the chill one 😎" },
        { speaker: "pascal",   text: "Together they make the most powerful formula in physics!", mood: "excited" },
        { speaker: "pascal",   text: "P = F ÷ A !!! 🌟✨🎊", mood: "triumphant" },
        { speaker: "narrator", text: "Big force, tiny area = HUGE pressure. Small area = more OUCH!" },
        { speaker: "pascal",   text: "Now I know how to beat SQUISH! Off to the lab! 🏃", mood: "excited" },
      ],
    },
    // ── SCENE 5 ─────────────────────────────────────────────
    {
      id: "scene5",
      bg: "battle",
      title: "🍅 Squeeze the Ketchup! (Pascal's Law)",
      lines: [
        { speaker: "pascal",   text: "Behold! My SECRET WEAPON! ...it's a ketchup packet. 😅", mood: "normal" },
        { speaker: "squish",   text: "A ketchup packet?! HAHAHA! You're ridiculous!! 😂", mood: "excited" },
        { speaker: "pascal",   text: "Squeeze it from ONE side and... it squirts from ALL sides equally! 💥", mood: "excited" },
        { speaker: "narrator", text: "In a liquid, pressure spreads the SAME in ALL directions! That's Pascal's Law!" },
        { speaker: "pascal",   text: "With Yuken's hydraulic power — pressure goes EVERYWHERE at once!", mood: "triumphant" },
        { speaker: "squish",   text: "W-wait... pressure from ALL sides?! NOOOOO!!! 😱", mood: "scared" },
        { speaker: "narrator", text: "SQUISH exploded into confetti! Fluffy the cat un-pancaked! 🎊" },
        { speaker: "pascal",   text: "YUKENTOPIA IS SAVED! Now let's go to the lab and try it yourself! 🔬", mood: "triumphant" },
      ],
    },
  ],

  // ── JAPANESE VERSION ────────────────────────────────────────
  ja: [
    {
      id: "scene1",
      bg: "city",
      title: "🥞 大パンケーキ大惨事",
      lines: [
        { speaker: "narrator", text: "平和なユーケントピアの街で、すべてが順調でした..." },
        { speaker: "pascal",   text: "おはよう世界！今日は最高の一日になるぞ！😊", mood: "excited" },
        { speaker: "narrator", text: "...大きなブヨブヨしたモンスターが空から降ってきるまでは！💥" },
        { speaker: "squish",   text: "わっはっは！私はスクイッシュ！全部の上に座るぞ！😈", mood: "excited" },
        { speaker: "narrator", text: "スクイッシュが街全体の上に座りました。そしてパスカルのネコは..." },
        { speaker: "pascal",   text: "モフモフちゃんダメェェェ！！猫がパンケーキになった！！😱", mood: "scared" },
        { speaker: "cat",      text: "...にゃ。", mood: "normal" },
        { speaker: "pascal",   text: "スクイッシュを止めなきゃ！でもどうやって？🤔", mood: "confused" },
      ],
    },
    {
      id: "scene2",
      bg: "lab",
      title: "👆 小さな指のつつき問題",
      lines: [
        { speaker: "pascal",   text: "指でやっつけてやる！えいっ！👆", mood: "excited" },
        { speaker: "squish",   text: "くすくす、くすぐったい！😂", mood: "excited" },
        { speaker: "pascal",   text: "よし…大きなハンマーだ！ドカッ！🔨", mood: "excited" },
        { speaker: "squish",   text: "わーい！*画面の外にはじけ飛ぶ*", mood: "excited" },
        { speaker: "pascal",   text: "…もっと大きくなって戻ってきた。😰", mood: "scared" },
        { speaker: "pascal",   text: "ちょっと待って。どれだけ強く押すかだけじゃない…", mood: "confused" },
        { speaker: "pascal",   text: "どこに押すかも大事！面積がどれだけ大きいかも！💡", mood: "excited" },
        { speaker: "narrator", text: "パスカルは大切なことを発見しました：力だけでは足りない！" },
      ],
    },
    {
      id: "scene3",
      bg: "lab",
      title: "📌 画鋲の大発見",
      lines: [
        { speaker: "pascal",   text: "うーん考えよう…*うっかり画鋲に座る* いったああああ！！😖", mood: "scared" },
        { speaker: "pascal",   text: "次は大きなふわふわクッションに座ると… ああー…気持ちいい…😌", mood: "normal" },
        { speaker: "pascal",   text: "同じ体重！同じ力！でも一つは痛くて一つは痛くなかった！", mood: "excited" },
        { speaker: "pascal",   text: "画鋲はとても小さい — 全体重が小さな点に集中！", mood: "excited" },
        { speaker: "pascal",   text: "クッションは大きい — 体重が大きな面積に広がる！", mood: "excited" },
        { speaker: "narrator", text: "その感覚？それが「圧力」というものです！🌟" },
        { speaker: "pascal",   text: "圧力 ＝ 力 ÷ 面積！P = F ÷ A！！！🎉", mood: "triumphant" },
      ],
    },
    {
      id: "scene4",
      bg: "formula",
      title: "🎉 魔法の公式ダンス",
      lines: [
        { speaker: "narrator", text: "三つの魔法の文字が空に現れました..." },
        { speaker: "narrator", text: "Pは圧力 — ドラマクイーン 👑" },
        { speaker: "narrator", text: "Fは力 — 筋肉マン 💪" },
        { speaker: "narrator", text: "Aは面積 — のんびり屋さん 😎" },
        { speaker: "pascal",   text: "三つ合わさると、物理学で最強の公式になる！", mood: "excited" },
        { speaker: "pascal",   text: "P = F ÷ A ！！！🌟✨🎊", mood: "triumphant" },
        { speaker: "narrator", text: "大きな力、小さな面積 = 巨大な圧力。面積が小さいほど = もっと痛い！" },
        { speaker: "pascal",   text: "スクイッシュを倒す方法がわかった！実験室へ！🏃", mood: "excited" },
      ],
    },
    {
      id: "scene5",
      bg: "battle",
      title: "🍅 ケチャップを絞れ！(パスカルの法則)",
      lines: [
        { speaker: "pascal",   text: "見よ！私の秘密兵器！…ケチャップのパックです。😅", mood: "normal" },
        { speaker: "squish",   text: "ケチャップ？！はははは！バカじゃないの！😂", mood: "excited" },
        { speaker: "pascal",   text: "一方から絞ると… 全方向から同じように飛び出す！💥", mood: "excited" },
        { speaker: "narrator", text: "液体の中では、圧力はすべての方向に同じように広がる！これがパスカルの法則！" },
        { speaker: "pascal",   text: "油研の油圧パワーで — 圧力が一気に全方向へ！", mood: "triumphant" },
        { speaker: "squish",   text: "ま、待って…四方八方から圧力？！やめてえええ！😱", mood: "scared" },
        { speaker: "narrator", text: "スクイッシュは紙吹雪になった！モフモフちゃんもパンケーキから元に戻った！🎊" },
        { speaker: "pascal",   text: "ユーケントピアが救われた！さあ実験室で自分で試してみよう！🔬", mood: "triumphant" },
      ],
    },
  ],
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  🔬  SIMULATOR HINT TEXTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const HINTS = {
  en: {
    press_low:   "Try pushing the small piston harder! 💪",
    press_high:  "WOW! That's a LOT of force on the big side! 😮",
    brake_idle:  "Push that pedal and watch the magic! 🚗",
    brake_press: "Pressure travels through ALL 4 wheels equally! ✅",
    diver_surf:  "Safe on the surface! Pressure is low. 😌",
    diver_mid:   "Getting deeper... the pressure is building! 😬",
    diver_deep:  "TOO DEEP! SQUISH-level pressure down here! 😱",
  },
  ja: {
    press_low:   "小さいピストンをもっと強く押してみて！💪",
    press_high:  "すごい！大きい方に엄청난힘が！😮",
    brake_idle:  "ペダルを踏んで魔法を見てみよう！🚗",
    brake_press: "圧力が4つの車輪全部に均等に伝わる！✅",
    diver_surf:  "水面は安全！圧力は低い。😌",
    diver_mid:   "深くなってきた…圧力が増えている！😬",
    diver_deep:  "深すぎる！ここはスクイッシュ級の圧力！😱",
  },
};
