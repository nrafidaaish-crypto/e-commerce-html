/* STATE MANAGEMENT GLOBAL */
let currentUser = null;
let selectedRole = 'customer';
let selectedDetailProduct = null;
let selectedColor = '';
let selectedQuantity = 1;
let sheetTargetIndex = null;
let sheetActionMode = 'buy_now';
let historyStack = [];

/* DATABASE PRODUK KELOLAAN (8 TAS LENGKAP ULASAN) */
let products = [
  {
    id: 1,
    name: "Aesthetic Leather Shoulder Bag Premium",
    price: 185000,
    stock: 99752,
    rating: 4.9,
    sold: 142,
    colors: ["PUTIH", "HITAM", "PINK", "COKELAT", "BIRU"],
    colorMap: {
      "PUTIH": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=500",
      "HITAM": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=500",
      "PINK": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=500",
      "COKELAT": "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=500",
      "BIRU": "https://images.unsplash.com/photo-1614179689702-355944cd0918?auto=format&fit=crop&q=80&w=500"
    },
    img: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=500",
    desc: "Aesthetic Leather Shoulder Bag Premium dirancang khusus untuk wanita modern yang menginginkan perpaduan gaya minimalis dan fungsionalitas tinggi. Menggunakan bahan kulit sintetis PU Grade A berkualitas premium yang memiliki tekstur sangat lembut, tahan percikan air, serta tidak mudah mengelupas.\n\nTas ini dilengkapi dengan kompartemen utama yang luas berpenutup resleting anti-macet, slot khusus smartphone, serta saku interior berresleting untuk menyimpan barang berharga. Dimensi 26cm x 8cm x 17cm sangat pas untuk membawa tablet kecil, dompet, hingga makeup kit.",
    reviews: [
      { name: "malik_abdulazis00", rating: 5, date: "02 Ags 2026", variant: "Warna: PUTIH", comment: "Lucu banget tasnya, realpict juga sesuai gambar ❤️❤️ Next order lagi!" },
      { name: "Clarissa M.", rating: 5, date: "28 Jul 2026", variant: "Warna: PINK", comment: "Bahan kulit sintetisnya halus dan kelihatan mewah banget. Jahitannya sangat rapi!" },
      { name: "Anisa_Syarif", rating: 5, date: "25 Jul 2026", variant: "Warna: HITAM", comment: "Cocok banget dipake buat ngantor. Tali bahunya nyaman ga bikin pegel!" },
      { name: "Dinda_Kusuma", rating: 4, date: "20 Jul 2026", variant: "Warna: COKELAT", comment: "Pengiriman cepat, packing buble wrap tebel. Produk sesuai harga 👍" },
      { name: "Rina_Febriani", rating: 5, date: "15 Jul 2026", variant: "Warna: BIRU", comment: "Warna birunya soft estetik banget! Suka parah deh pokoknya 😍" }
    ]
  },
  {
    id: 2,
    name: "Cute Mini Crossbody Sling Bag",
    price: 125000,
    stock: 450,
    rating: 4.8,
    sold: 98,
    colors: ["PINK", "BIRU", "HITAM", "PUTIH"],
    colorMap: {
      "PINK": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=500",
      "BIRU": "https://images.unsplash.com/photo-1614179689702-355944cd0918?auto=format&fit=crop&q=80&w=500",
      "HITAM": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=500",
      "PUTIH": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=500"
    },
    img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=500",
    desc: "Cute Mini Crossbody Sling Bag adalah pilihan terbaik bagi Anda yang mengutamakan kepraktisan tanpa mengorbankan estetika. Desainnya yang ringkas dan menggemaskan menjadikan tas ini sangat favorit di kalangan remaja dan wanita muda.\n\nDibuat dari kombinasi bahan sintetis empuk bernuansa quilted dan tali rantai kombinasi kulit yang elegan.",
    reviews: [
      { name: "Bellani_P", rating: 5, date: "03 Ags 2026", variant: "Warna: PINK", comment: "Ukurannya pas banget buat yang ga suka bawa tas berat." },
      { name: "Citra_K", rating: 5, date: "01 Ags 2026", variant: "Warna: HITAM", comment: "Rantainya kokoh dan ga gampang luntur warnanya." },
      { name: "Maya_Sari", rating: 5, date: "29 Jul 2026", variant: "Warna: BIRU", comment: "Imut polll! Beli buat kado ultah temen dan dia suka banget!" },
      { name: "Ayu_Widya", rating: 4, date: "24 Jul 2026", variant: "Warna: PUTIH", comment: "Bagus dan simpel, pengiriman lumayan lumayan gercep." }
    ]
  },
  {
    id: 3,
    name: "Korean Canvas Casual Tote Bag",
    price: 95000,
    stock: 320,
    rating: 4.7,
    sold: 210,
    colors: ["PUTIH", "HITAM", "COKELAT"],
    colorMap: {
      "PUTIH": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=500",
      "HITAM": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=500",
      "COKELAT": "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=500"
    },
    img: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=500",
    desc: "Korean Canvas Casual Tote Bag mengusung konsep minimalis kasual khas fashion Korean Style yang serbaguna dan tahan lama.",
    reviews: [
      { name: "Lestari_A", rating: 5, date: "04 Ags 2026", variant: "Warna: PUTIH", comment: "Muat laptop 14 inch, cocok banget buat kuliah sehari-hari!" },
      { name: "Siti_Nurhaliza", rating: 5, date: "02 Ags 2026", variant: "Warna: HITAM", comment: "Bahan kanvasnya tebel bgt bukan yang tipis melayang. Top BGT!" }
    ]
  },
  {
    id: 4,
    name: "Vintage Plaid Top Handle Satchel",
    price: 210000,
    stock: 180,
    rating: 4.9,
    sold: 85,
    colors: ["COKELAT", "HITAM", "PUTIH"],
    colorMap: {
      "COKELAT": "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=500",
      "HITAM": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=500",
      "PUTIH": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=500"
    },
    img: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=500",
    desc: "Vintage Plaid Top Handle Satchel memberikan sentuhan klasik elegan dengan aksen motif kotak-kotak ala retro Inggris.",
    reviews: [
      { name: "Gita_K", rating: 5, date: "01 Ags 2026", variant: "Warna: COKELAT", comment: "Sangat mewah untuk harga segini! Cocok dipake kondangan." }
    ]
  },
  {
    id: 5,
    name: "Minimalist Soft Bucket Bag",
    price: 165000,
    stock: 250,
    rating: 4.8,
    sold: 120,
    colors: ["PUTIH", "PINK", "BIRU", "COKELAT"],
    colorMap: {
      "PUTIH": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=500",
      "PINK": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=500",
      "BIRU": "https://images.unsplash.com/photo-1614179689702-355944cd0918?auto=format&fit=crop&q=80&w=500",
      "COKELAT": "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=500"
    },
    img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=500",
    desc: "Minimalist Soft Bucket Bag hadir dengan potongan siluet menyerupai serutan kantong yang fleksibel, kasual namun tetap anggun.",
    reviews: [
      { name: "Dewi_Anggraini", rating: 5, date: "30 Jul 2026", variant: "Warna: PUTIH", comment: "Warna putihnya bersih bgt dan serutannya lancar!" }
    ]
  },
  {
    id: 6,
    name: "Elegant Pearl Clutch Evening Bag",
    price: 245000,
    stock: 110,
    rating: 5.0,
    sold: 64,
    colors: ["PUTIH", "PINK"],
    colorMap: {
      "PUTIH": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=500",
      "PINK": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=500"
    },
    img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=500",
    desc: "Elegant Pearl Clutch Evening Bag diciptakan khusus untuk melengkapi penampilan glamor Anda di acara pesta.",
    reviews: [
      { name: "Siska_Valerie", rating: 5, date: "29 Jul 2026", variant: "Warna: PUTIH", comment: "Sumpah ini cantik banget, mutiaranya rapat dan mewah!" }
    ]
  },
  {
    id: 7,
    name: "Casual Trendy Backpack Mini",
    price: 175000,
    stock: 390,
    rating: 4.7,
    sold: 156,
    colors: ["HITAM", "PINK", "BIRU"],
    colorMap: {
      "HITAM": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=500",
      "PINK": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=500",
      "BIRU": "https://images.unsplash.com/photo-1614179689702-355944cd0918?auto=format&fit=crop&q=80&w=500"
    },
    img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=500",
    desc: "Casual Trendy Backpack Mini merupakan jawaban ideal untuk Anda yang aktif bergerak namun tetap ingin tampil chic.",
    reviews: [
      { name: "Nadia_Fitri", rating: 5, date: "26 Jul 2026", variant: "Warna: HITAM", comment: "Bahan tahan air beneran, muat banyak barang." }
    ]
  },
  {
    id: 8,
    name: "Chic Ruched Dumpling Cloud Bag",
    price: 155000,
    stock: 420,
    rating: 4.9,
    sold: 178,
    colors: ["PUTIH", "PINK", "COKELAT", "BIRU"],
    colorMap: {
      "PUTIH": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=500",
      "PINK": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=500",
      "COKELAT": "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=500",
      "BIRU": "https://images.unsplash.com/photo-1614179689702-355944cd0918?auto=format&fit=crop&q=80&w=500"
    },
    img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=500",
    desc: "Chic Ruched Dumpling Cloud Bag memadukan tren bentuk awan (cloud bag) kekinian dengan tekstur lipatan ruched estetik.",
    reviews: [
      { name: "Ayu_Permata", rating: 5, date: "22 Jul 2026", variant: "Warna: PUTIH", comment: "Empuk bgt kaya awan! Pas banget dipake foto-foto cafe hopping." }
    ]
  }
];

let cart = [];
let orders = [];

/* DATA TRANSAKSI UTUH UNTUK LAPORAN HARIAN, BULANAN, & TAHUNAN */
let orders = [
  {
    id: 'GS-882910',
    date: '07 Ags 2026',
    category: 'harian',
    customer: 'Clarissa M.',
    items: [{ product: products[0], qty: 2 }],
    total: 370000,
    payment: 'Transfer Bank (BCA)',
    status: 'Selesai'
  },
  {
    id: 'GS-882911',
    date: '07 Ags 2026',
    category: 'harian',
    customer: 'Evaline',
    items: [{ product: products[1], qty: 1 }],
    total: 125000,
    payment: 'E-Wallet (Gopay)',
    status: 'Selesai'
  },
  {
    id: 'GS-774102',
    date: '01 Ags 2026',
    category: 'bulanan',
    customer: 'Anisa Syarif',
    items: [{ product: products[2], qty: 3 }],
    total: 285000,
    payment: 'COD (Bayar di Tempat)',
    status: 'Selesai'
  },
  {
    id: 'GS-661034',
    date: '15 Jul 2026',
    category: 'bulanan',
    customer: 'Dinda Kusuma',
    items: [{ product: products[3], qty: 1 }],
    total: 210000,
    payment: 'Transfer Bank (Mandiri)',
    status: 'Selesai'
  },
  {
    id: 'GS-550192',
    date: '10 Mei 2026',
    category: 'tahunan',
    customer: 'Siti Nurhaliza',
    items: [{ product: products[4], qty: 2 }],
    total: 330000,
    payment: 'E-Wallet (ShopeePay)',
    status: 'Selesai'
  }
];
