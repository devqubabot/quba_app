import type { Messages } from "@/presentation/copy/messages";

export const idMessages: Messages = {
  common: { back: "Kembali", cancel: "Batal", close: "Tutup" },
  shell: {
    activeActivity: "Aktivitas aktif",
    createActivity: "Buat aktivitas",
    tabs: {
      home: "Beranda",
      habits: "Habits",
      quba: "Quba",
      statistics: "Statistik",
      profile: "Profil",
    },
  },
  onboarding: {
    signIn: "Masuk",
    eyebrow: "Teman tumbuhmu",
    mascotLabel: "Quba menyapa dengan ceria",
    stepLabel: "Langkah 1 dari 3",
    title: "Mulai aktivitas tanpa tenggelam di layar.",
    description:
      "Atur rutinitas di app, lalu biarkan Quba menemanimu saat waktunya bergerak.",
    action: "Aktifkan Quba",
  },
  empty: {
    home: {
      title: "Hari ini masih lapang.",
      description:
        "Aktivitas dan progres harianmu akan muncul di sini setelah habit pertama dibuat.",
      action: "Lihat habits",
    },
    habits: {
      title: "Belum ada habit.",
      description:
        "Buat rutinitas sederhana untuk checklist, counter, atau session.",
      action: "Buat habit",
    },
    quba: {
      title: "Quba belum terhubung.",
      description:
        "Saat pairing tersedia, status koneksi dan sinkronisasi akan muncul di sini.",
      action: "Pelajari koneksi Quba",
    },
    statistics: {
      title: "Belum ada progres untuk dirangkum.",
      description:
        "Ringkasan mingguan akan muncul setelah kamu menyelesaikan aktivitas.",
      action: "Kembali ke Beranda",
    },
    profile: {
      title: "Pengaturan profil belum tersedia.",
      description:
        "Bahasa, tema, suara, dan informasi versi akan dikelola di sini.",
      action: "Kembali ke Beranda",
    },
    createActivity: {
      title: "Buat aktivitas cepat.",
      description:
        "Pilihan Session dan Counter akan tersedia pada tahap fitur berikutnya.",
      action: "Tutup",
    },
    activeActivity: {
      title: "Tidak ada aktivitas aktif.",
      description:
        "Saat aktivitas berjalan, kamu dapat kembali ke sini dari mana pun.",
      action: "Buat aktivitas",
    },
    habitDetail: {
      title: "Detail habit belum tersedia.",
      description:
        "Streak, total aktivitas, dan kalender mingguan akan muncul di sini.",
      action: "Kembali ke Habits",
    },
  },
  controls: {
    fieldError: "Periksa isian ini lalu coba lagi.",
    progressLabel: "Progres",
  },
};

export const idCopy = idMessages;
