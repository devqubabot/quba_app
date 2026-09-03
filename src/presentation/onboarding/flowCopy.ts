import type { Locale } from "@/presentation/copy/messages";

export const onboardingFlowCopy = {
  id: {
    back: "Kembali",
    preview: "Pratinjau UI",
    previewNote:
      "Belum terhubung ke layanan akun atau robot. Gunakan data contoh, bukan password asli.",
    required: "Isi kolom ini terlebih dahulu.",
    emailError: "Masukkan alamat email yang valid.",
    passwordError: "Gunakan minimal 8 karakter.",
    showPassword: "Tampilkan password",
    hidePassword: "Sembunyikan password",
    requiredNote: "Semua kolom wajib diisi.",
    login: {
      label: "Masuk",
      title: "Selamat datang kembali.",
      description:
        "Progres dan konfigurasi Quba akan dipulihkan setelah kamu masuk.",
      action: "Masuk",
    },
    recovery: {
      label: "Pulihkan akun",
      title: "Kembali ke rutinitasmu.",
      description: "Masukkan email akunmu untuk meminta tautan pemulihan.",
      action: "Kirim tautan pemulihan",
    },
    recoveryResult:
      "Pratinjau formulir selesai. Belum ada email pemulihan yang dikirim.",
    activation: {
      label: "Aktivasi",
      step: "Langkah 1 dari 5",
      title: "Masukkan kode unik Quba.",
      description: "Kode tercetak di kartu yang ada di dalam kemasan.",
      action: "Verifikasi kode",
    },
    codeLabel: "Kode aktivasi",
    codeExample: "Contoh format: QBA-1234",
    codeHint:
      "Salin kode dari kartu Quba. Pada pratinjau ini, kode belum diverifikasi.",
    account: {
      label: "Buat akun",
      step: "Langkah 2 dari 5",
      title: "Simpan rutinitasmu dengan aman.",
      description:
        "Buat akun untuk menyimpan konfigurasi Quba dan memulihkan rutinitasmu.",
      action: "Buat akun",
    },
    nickname: "Nama panggilan",
    username: "Username",
    email: "Email",
    identifier: "Email atau username",
    password: "Password",
    namePlaceholder: "Nama panggilanmu",
    usernamePlaceholder: "Pilih username",
    emailPlaceholder: "nama@example.com",
    identifierPlaceholder: "Email atau username kamu",
    passwordPlaceholder: "Minimal 8 karakter",
    localTitle: "Data aktivitas tetap tersedia secara lokal.",
    localDescription:
      "Koneksi internet tidak diperlukan untuk menjalankan aktivitas yang sudah tersinkron.",
    pairing: {
      label: "Hubungkan Quba",
      step: "Langkah 3 dari 5",
      title: "Dekatkan ponsel ke Quba.",
      description: "Nyalakan Bluetooth dan pastikan layar Quba aktif.",
      action: "Hubungkan Quba-1234",
    },
    deviceTitle: "Quba-1234",
    deviceDescription: "Perangkat terdekat · sinyal kuat",
    deviceStatus: "Ditemukan",
    pairingHelp: "Quba tidak terlihat?",
    pairingHelpText:
      "Pastikan Quba menyala, Bluetooth aktif, dan ponsel berada dekat robot. Pencarian perangkat akan tersedia setelah integrasi Bluetooth.",
    starter: {
      label: "Starter habit",
      step: "Langkah 4 dari 5",
      title: "Pilih rutinitas pertama.",
      description: "Kamu bisa mengubah target dan jadwalnya nanti.",
      action: "Gunakan starter habit",
    },
    selected: "Dipilih",
    chooseStarter: "Pilih satu rutinitas untuk melanjutkan.",
    routines: {
      dzikir: {
        title: "Dzikir",
        description: "Counter · target awal 33",
        trial: "Coba Dzikir 33.",
        target: "33",
        unit: "hitungan",
      },
      quran: {
        title: "Baca Qur’an",
        description: "Session · target awal 15 menit",
        trial: "Coba Baca Qur’an.",
        target: "15",
        unit: "menit",
      },
      shalat: {
        title: "Shalat 5 waktu",
        description: "Lima checklist terjadwal",
        trial: "Mulai Shalat 5 waktu.",
        target: "5",
        unit: "checklist",
      },
      book: {
        title: "Baca buku",
        description: "Session · target awal 20 menit",
        trial: "Coba Baca buku.",
        target: "20",
        unit: "menit",
      },
    },
    firstActivity: {
      label: "Aktivitas pertama",
      step: "Langkah 5 dari 5",
      description: "Sentuh Quba atau gunakan tombol demo di bawah.",
      action: "Simulasikan target selesai",
    },
    targetNote: "target siap dikirim",
    noSelection: "Pilih rutinitas terlebih dahulu.",
    complete: {
      label: "Pratinjau selesai",
      title: "Kenalan dengan Quba, selesai!",
      description:
        "Kamu sudah menjelajahi alur onboarding. Belum ada akun, koneksi robot, atau aktivitas yang dibuat.",
      action: "Kembali ke awal",
    },
    loginComplete: {
      title: "Pratinjau login selesai.",
      description:
        "Form login sudah kamu coba. Belum ada sesi masuk atau pemulihan data karena layanan akun belum dihubungkan.",
    },
  },
  en: {
    back: "Back",
    preview: "UI preview",
    previewNote:
      "Account and robot services are not connected. Use sample details, not a real password.",
    required: "Fill in this field first.",
    emailError: "Enter a valid email address.",
    passwordError: "Use at least 8 characters.",
    showPassword: "Show password",
    hidePassword: "Hide password",
    requiredNote: "All fields are required.",
    login: {
      label: "Sign in",
      title: "Welcome back.",
      description:
        "Your progress and Quba configuration will be restored after you sign in.",
      action: "Sign in",
    },
    recovery: {
      label: "Recover account",
      title: "Get back to your routine.",
      description: "Enter your account email to request a recovery link.",
      action: "Send recovery link",
    },
    recoveryResult: "Form preview complete. No recovery email has been sent.",
    activation: {
      label: "Activation",
      step: "Step 1 of 5",
      title: "Enter your unique Quba code.",
      description: "Find the code on the card inside the packaging.",
      action: "Verify code",
    },
    codeLabel: "Activation code",
    codeExample: "Example format: QBA-1234",
    codeHint:
      "Copy the code from your Quba card. Codes are not verified in this preview.",
    account: {
      label: "Create account",
      step: "Step 2 of 5",
      title: "Keep your routines safe.",
      description:
        "Create an account to save your Quba configuration and restore your routines.",
      action: "Create account",
    },
    nickname: "Nickname",
    username: "Username",
    email: "Email",
    identifier: "Email or username",
    password: "Password",
    namePlaceholder: "Your nickname",
    usernamePlaceholder: "Choose a username",
    emailPlaceholder: "name@example.com",
    identifierPlaceholder: "Your email or username",
    passwordPlaceholder: "At least 8 characters",
    localTitle: "Your activity data stays available locally.",
    localDescription:
      "An internet connection is not needed to run activities that have already synced.",
    pairing: {
      label: "Connect Quba",
      step: "Step 3 of 5",
      title: "Bring your phone close to Quba.",
      description: "Turn on Bluetooth and make sure Quba’s screen is active.",
      action: "Connect Quba-1234",
    },
    deviceTitle: "Quba-1234",
    deviceDescription: "Nearest device · strong signal",
    deviceStatus: "Found",
    pairingHelp: "Can’t see Quba?",
    pairingHelpText:
      "Make sure Quba is on, Bluetooth is enabled, and your phone is nearby. Device discovery will be available after Bluetooth integration.",
    starter: {
      label: "Starter habit",
      step: "Step 4 of 5",
      title: "Choose your first routine.",
      description: "You can change its target and schedule later.",
      action: "Use starter habit",
    },
    selected: "Selected",
    chooseStarter: "Choose a routine to continue.",
    routines: {
      dzikir: {
        title: "Dhikr",
        description: "Counter · initial target 33",
        trial: "Try Dhikr 33.",
        target: "33",
        unit: "counts",
      },
      quran: {
        title: "Read Qur’an",
        description: "Session · initial target 15 minutes",
        trial: "Try reading Qur’an.",
        target: "15",
        unit: "minutes",
      },
      shalat: {
        title: "Five daily prayers",
        description: "Five scheduled checklists",
        trial: "Start five daily prayers.",
        target: "5",
        unit: "checklists",
      },
      book: {
        title: "Read a book",
        description: "Session · initial target 20 minutes",
        trial: "Try reading a book.",
        target: "20",
        unit: "minutes",
      },
    },
    firstActivity: {
      label: "First activity",
      step: "Step 5 of 5",
      description: "Touch Quba or use the demo button below.",
      action: "Simulate target complete",
    },
    targetNote: "target ready to send",
    noSelection: "Choose a routine first.",
    complete: {
      label: "Preview complete",
      title: "You’ve met Quba!",
      description:
        "You’ve explored the onboarding flow. No account, robot connection, or activity has been created.",
      action: "Back to the beginning",
    },
    loginComplete: {
      title: "Sign-in preview complete.",
      description:
        "You’ve tried the sign-in form. No session was started or data restored because account services are not connected yet.",
    },
  },
} satisfies Record<Locale, unknown>;

export type StarterId = keyof typeof onboardingFlowCopy.id.routines;
export const starterIds: readonly StarterId[] = [
  "dzikir",
  "quran",
  "shalat",
  "book",
];
export function parseStarter(value: unknown): StarterId | undefined {
  return starterIds.find((id) => id === value);
}
