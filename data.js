/*
  SEMUA ISI WEBSITE ADA DI FILE INI.
  Ganti teks contoh di bawah dengan data kamu sendiri, simpan, lalu muat ulang halaman.
  Tidak perlu menyentuh index.html, style.css, atau app.js.
*/
window.PORTFOLIO = {
  // ── Identitas ────────────────────────────────────────────────
  name: "Bintang Hanoraga",
  tagline: "turning data into insight • master's @ ITS",
  photo: "photo.jpg", // file foto di folder ini. Kosong = pakai inisial
  initials: "BH",

  // Banner berupa video (diputar otomatis, tanpa suara, berulang).
  // banner.mp4 saat ini adalah video CONTOH: montase 13 detik dari 6 klip stok Mixkit
  // (mixkit.co, "Stock Video Free License", tanpa wajib atribusi) — kampus, jendela
  // pesawat, jalan pegunungan, perpustakaan, pantai, kereta. Ganti dengan videomu sendiri:
  // taruh filenya di folder ini lalu tulis namanya di sini. Saran: MP4 (H.264),
  // lebar 960–1600 px, durasi 10–15 detik, ukuran di bawah 8 MB.
  bannerVideo: "banner.mp4",
  // Banner berupa foto, contoh "banner.jpg". Dipakai kalau bannerVideo kosong.
  // Kalau dua-duanya kosong, banner digambar otomatis sebagai lampu bokeh yang berkelip.
  banner: "",
  // Warna dasar banner bokeh, kartu kontak, dan aksen (0–360).
  // 275 = ungu, 210 = biru, 160 = hijau toska, 20 = jingga, 340 = merah muda
  bannerHue: 215, // biru, senada dengan warna ITS

  // ── Perkenalan ───────────────────────────────────────────────
  greeting: "Hej!",
  /*
    Boleh pakai:
    <b>…</b>                       menebalkan kata
    <b class="blue">…</b>          kata tebal berwarna biru
    <b class="green">…</b>         kata tebal berwarna hijau
    <img class="sticker" src="…">  gambar kecil bergaya stiker di dalam kalimat
    <span class="idle">🐊</span>   emoji dengan animasi idle (naik-turun seperti bernapas)
  */
  intro:
    'I\'m <b>Aga</b>, a maker and <img class="sticker" src="its-logo.png" alt=""> <b class="blue">ITS</b> student from <b class="green">Surabaya</b> <span class="idle">🐊</span>.',

  now: "Master's student in Informatics",
  // Kosong ( [] ) = baris "Previously" disembunyikan.
  previously: ["Ex-Data Analyst Intern @ BNI", "Ex-Contract Data Analyst @ ITS Tekno Sains"],

  // Kosong ( [] ) = daftar ini disembunyikan.
  highlightsTitle: "A few things I'm proudest of:",
  highlights: [
    {
      emoji: "🚀",
      text: "Fast-Track Program, ITS: finished a B.Sc. in Informatics in 3.5 years (GPA 3.52/4.00) and is now completing an M.Sc. (GPA 3.54/4.00).",
    },
    {
      emoji: "🌏",
      text: "ITS delegate to the Universiti Malaya (UM) Summer Course with international Informatics students.",
    },
  ],

  // icon: mail | github | linkedin | instagram | link
  contacts: [
    { icon: "mail", label: "send me an email", href: "mailto:bintanghanoraga@gmail.com" },
    { icon: "github", label: "agaollineed", href: "https://github.com/agaollineed" },
    { icon: "linkedin", label: "bintanghanoragain", href: "https://www.linkedin.com/in/bintanghanoragain" },
  ],

  // ── Pengalaman: Work, Academic, Publication ──────────────────
  experienceTitle: "Experience",
  experienceIntro: "Where I've worked, studied and published.",
  /*
    Tiap grup punya judul (title) dan daftar entri (items).
    kind: "publication" = nama ditulis tanpa garis bergelombang (cocok untuk judul panjang)
    Isi tiap entri:
      logo    : file logo di folder logos/ (tampil sebagai stiker bulat)
      logoFit : "cover" untuk logo yang memenuhi kotak (misalnya berlatar warna)
      emoji   : dipakai di dalam stiker kalau tidak ada logo
      name    : nama tempat / judul publikasi (baris tebal paling atas)
      role    : posisi, gelar, atau jenis publikasi
      date    : periode
      desc    : satu kalimat singkat (kosong = tidak ditampilkan)
      href    : tautan untuk nama (kosong = tidak bisa diklik)
    Kosongkan experience: [] untuk menyembunyikan bagian ini.
  */
  experience: [
    {
      title: "Work",
      items: [
        {
          logo: "logos/bni.png",
          name: "BNI",
          role: "Data Analyst Intern",
          date: "Dec 2024 – Mar 2025",
          desc: "Built an ID card distribution dashboard that cut uncollected cards by 65%.",
        },
        {
          logo: "logos/bukit-bintang.png",
          logoFit: "cover",
          name: "Bukit Bintang Hotel",
          role: "Full-Time Graphic Designer",
          date: "Jan 2023 – Jun 2024",
          desc: "Ran the hotel's Instagram and TikTok content, from concept to publishing.",
        },
        {
          logo: "logos/its-tekno-sains.png",
          name: "ITS Tekno Sains",
          role: "Contract Data Analyst",
          date: "Nov 2022 – Jan 2023",
          desc: "Analyzed data from 10+ East Kalimantan institutions for Pertamina's bidder selection.",
        },
      ],
    },
    {
      title: "Academic",
      items: [
        {
          logo: "logos/its.png",
          name: "Institut Teknologi Sepuluh Nopember",
          role: "Master of Informatics",
          date: "Aug 2025 – Oct 2027 (Expected)",
          desc: "GPA 3.54/4.00",
        },
        {
          logo: "logos/um.png",
          name: "Universiti Malaya (UM)",
          role: "Summer Course Delegate",
          date: "Aug 2025",
          desc: "",
        },
        {
          logo: "logos/its.png",
          name: "Institut Teknologi Sepuluh Nopember",
          role: "Bachelor of Informatics",
          date: "Aug 2022 – Apr 2026",
          desc: "GPA 3.52/4.00",
        },
      ],
    },
    {
      title: "Publication",
      kind: "publication",
      items: [
        {
          emoji: "📄",
          name: "Cheaper on Paper? Measured Energy Savings of Training-Free LLM Cascades on a Consumer GPU",
          role: "Journal",
          date: "2026",
          desc: "",
        },
        {
          emoji: "🎓",
          name: "Uncovering Interaction Inequality in Virtual Learning Environments Using Persistence and Clickstream Analysis by Age and Gender",
          role: "Conference · ICICEES 2026",
          date: "2026",
          desc: "",
        },
      ],
    },
  ],

  // ── Proyek ───────────────────────────────────────────────────
  projectsTitle: "Projects",
  projectsIntro: "A collection of my favourite work!",
  /*
    year    : tahun proyek (kosong = tanpa label tahun)
    desc    : deskripsi satu kalimat (kosong = tidak ditampilkan)
    video   : sampul berupa video rekaman jelajah situs, contoh "projects/ris.mp4"
              (diputar otomatis tanpa suara, berulang, hanya saat kartu terlihat)
    poster  : gambar diam yang tampil sebelum video siap / bila animasi dimatikan
    image   : sampul berupa gambar, dipakai kalau tidak ada video
    colors  : dua warna sampul saat tidak ada video maupun gambar (ditambah emoji)
    featured: true menampilkan bintang ⭐
    tags    : dipakai untuk tombol filter (muncul kalau ada minimal 2 kategori berbeda)
    href    : tautan ke proyek (kosong = kartu tidak bisa diklik)
  */
  projects: [
    {
      year: 2026,
      title: "MPL Indonesia Dashboard",
      desc: "",
      tags: ["Data"],
      featured: false,
      video: "projects/mpl.mp4",
      poster: "projects/mpl.jpg",
      emoji: "🎮",
      colors: ["#0f6b5c", "#7fd1b9"],
      image: "",
      href: "https://github.com/agaollineed/MPLDashboard",
    },
    {
      year: 2026,
      title: "HIS (Hotel Integrated System)",
      desc: "",
      tags: ["Web"],
      featured: false,
      video: "projects/his.mp4",
      poster: "projects/his.jpg",
      emoji: "🏨",
      colors: ["#3b6fd4", "#a9c8ff"],
      image: "",
      href: "https://nyamanapp.site/",
    },
    {
      year: 2025,
      title: "RIS (Restaurant Integrated System)",
      desc: "",
      tags: ["Web"],
      featured: false,
      video: "projects/ris.mp4",
      poster: "projects/ris.jpg",
      emoji: "🍽️",
      colors: ["#e2725b", "#ffd9a8"],
      image: "",
      href: "https://djimatosuperapp.site/",
    },
  ],

  // ── Stiker ───────────────────────────────────────────────────
  /*
    Stiker kecil yang ditempel menjorok di pinggir kartu. Klik/ketuk = muncul balon teks.
    img   : file di folder stickers/ (PNG berlatar transparan dengan tepi putih)
    text  : teks singkat di balon
    at    : bagian tempat menempel: "intro", "projects", atau "experience"
    side  : "left" / "right" — menjorok keluar dari tepi kiri / kanan kartu
    top   : posisi vertikal di dalam bagian itu, dalam persen tingginya
    tilt  : kemiringan dalam derajat
    mobile: true = tetap tampil di layar sempit (di pojok kanan atas bagiannya)
    size  : pengali ukuran, contoh 1.4 = 40% lebih besar (berguna untuk gambar yang lebar)
  */
  stickers: [
    // spotify: lagu yang diputar saat stiker ditekan (tekan lagi = jeda)
    // start  : mulai dari detik ke berapa (95 = 1:35)
    { img: "stickers/spotify.png", text: "now playing: Timeless 🎧", at: "intro", side: "left", top: 30, tilt: -10,
      spotify: "spotify:track:2Kbc5HFurzJ33w6y0PAuIM", start: 95 }, // Timeless — The Weeknd & Playboi Carti
    { img: "stickers/curry.png", text: "night night 🌙", at: "intro", side: "right", top: 60, tilt: 8 },
    { img: "stickers/macbook.png", text: "where every project starts 💻", at: "projects", side: "right", top: 8, tilt: 9, mobile: true },
    { img: "stickers/subway.png", text: "fuel for late-night coding 🌯", at: "projects", side: "left", top: 60, tilt: -8 },
    { img: "stickers/tennis.png", text: "weekend tennis, anyone? 🎾", at: "experience", side: "left", top: 18, tilt: -6 },
    { img: "stickers/running-shoe.png", text: "oh, I also run :)", at: "experience", side: "right", top: 40, tilt: 10, mobile: true, size: 1.4 },
    { img: "stickers/chelsea.png", text: "blue is the colour 💙", at: "experience", side: "left", top: 68, tilt: 7 },
  ],

  // ── Kontak ───────────────────────────────────────────────────
  contactTitle: "Let's talk.",
  contactText: "Got an idea, a collaboration, or just want to say hi? My inbox is always open.",
  contactButton: "Send an email",
  email: "bintanghanoraga@gmail.com",
};
