# Quba Product Requirements Document

## MVP v1.0

| Atribut | Nilai |
|---|---|
| Status | Draft untuk review tim |
| Versi | 1.0 |
| Tanggal | 26 Agustus 2026 |
| Pemilik dokumen | Product Team Quba |
| Target pengguna awal | The Cozy / Playful Self-Improver |
| Platform | Quba App, Quba Bot, dan backend Quba |
| Referensi | `QUBA_ICP_Persona_Behavior_Detailed.pdf`, `quba.excalidraw`, dan konsep UI 22 Agustus 2026 |

---

## 1. Ringkasan Eksekutif

Quba adalah ekosistem robot pendamping dan aplikasi yang membantu pengguna membangun kebiasaan baik melalui reminder yang lembut, aktivitas fisik bebas distraksi, dan progres yang terlihat.

Quba bukan sekadar habit tracker dengan robot sebagai aksesori. Aplikasi digunakan untuk merencanakan dan merefleksikan kebiasaan, sedangkan robot digunakan untuk mengingatkan, menemani aktivitas, dan mencatat progres tanpa mengharuskan pengguna terus membuka ponsel.

Alur nilai utama produk:

> App merencanakan -> Robot menemani -> Robot mencatat -> App membantu refleksi

MVP berfokus pada satu pemilik akun yang menggunakan satu robot Quba dalam **Self Mode**. Pengguna dapat membuat kebiasaan berbasis checklist, counter, atau countdown; menyinkronkannya ke robot; menjalankan aktivitas melalui robot; kemudian melihat XP, level, streak, badge, dan ringkasan progres di aplikasi. Pengguna juga dapat membuat counter atau session sekali jalan tanpa harus membuat habit terlebih dahulu.

Parent Mode merupakan arah produk berikutnya, tetapi tidak menjadi ruang lingkup utama MVP agar pengalaman awal, model data, dan sinkronisasi dapat divalidasi terlebih dahulu.

---

## 2. Latar Belakang dan Masalah

Pengguna ingin lebih konsisten dalam ibadah, belajar, membaca, dan aktivitas kesehatan, tetapi menghadapi beberapa hambatan:

1. Membuka ponsel untuk melihat jadwal, timer, atau pencatat aktivitas sering berujung pada distraksi.
2. Habit tracker yang ada terasa formal, rumit, atau tidak menyenangkan untuk digunakan dalam jangka panjang.
3. Reminder dari ponsel mudah diabaikan karena bercampur dengan notifikasi lain.
4. Checklist digital tidak memberikan interaksi fisik atau kehadiran emosional.
5. Progress yang tidak terlihat membuat rutinitas terasa seperti kewajiban tanpa reward.
6. Orang tua yang ingin membangun rutinitas anak cenderung harus mengingatkan secara verbal atau memberikan akses ke gadget.

Quba menjawab masalah tersebut dengan memindahkan momen pelaksanaan aktivitas ke robot yang berada di meja pengguna, sementara app tetap menjadi pusat konfigurasi dan refleksi.

---

## 3. Visi dan Positioning

### 3.1 Visi

Menjadi teman fisik yang membantu orang membangun kebiasaan baik secara konsisten, menyenangkan, dan minim distraksi layar.

### 3.2 Positioning

> Quba membantu kamu memulai, menjalankan, dan menjaga kebiasaan baik tanpa harus terus membuka ponsel.

### 3.3 Tagline Kerja

**Quba - Teman Tumbuh, Teman Aktivitas.**

Alternatif yang dapat diuji:

- Kebiasaan baik, ditemani Quba.
- Bantu mulai, temani selesai.
- Teman kecil untuk langkah baik setiap hari.

### 3.4 Diferensiasi Utama

- Interaksi habit melalui benda fisik, bukan hanya layar.
- Counter dan countdown dapat digunakan tanpa membuka ponsel.
- Robot memberikan reminder di ruang tempat aktivitas dilakukan.
- Ekspresi robot dan gamifikasi memberi feedback emosional langsung.
- Aktivitas tetap dapat dicatat ketika robot tidak terhubung ke ponsel.

---

## 4. Target Pengguna

### 4.1 Persona Utama: The Cozy / Playful Self-Improver

Contoh persona: Nabila, 22 tahun, mahasiswa tingkat akhir dan freelancer.

Karakteristik:

- Ingin konsisten beribadah, membaca, belajar, atau berolahraga.
- Menyukai benda estetik, wholesome, dan ekspresif di meja kerja.
- Responsif terhadap feedback visual, XP, streak, dan badge.
- Mudah terdistraksi ketika membuka ponsel.
- Menginginkan interaksi yang cepat dan tidak serumit productivity tool.

Job to be done:

> Ketika saya ingin melakukan rutinitas baik, bantu saya memulai dan menyelesaikannya tanpa terdistraksi ponsel, lalu tunjukkan bahwa progres kecil saya berarti.

### 4.2 Persona Sekunder: The Intentional Parent

Contoh persona: Hendra, 36 tahun, yang mendampingi Rayyan, 9 tahun.

Kebutuhan utama:

- Mengatur reminder dan target aktivitas anak.
- Mengurangi screen time anak.
- Menghindari pola mengingatkan dengan marah atau berulang kali.
- Melihat ringkasan progres untuk memberi dukungan atau hadiah nyata.

Parent Mode tidak menjadi target peluncuran MVP. Arsitektur data sebaiknya tidak menutup kemungkinan satu akun mengelola beberapa profil atau robot di masa depan.

### 4.3 Keputusan yang Perlu Dikonfirmasi

Target peluncuran yang diusulkan adalah **Self Mode**. Tim perlu mengonfirmasi keputusan ini sebelum desain final dan backlog engineering dikunci.

---

## 5. Prinsip Produk

1. **Screen-light, bukan screen-free.** App digunakan untuk hal yang kompleks; robot digunakan untuk momen aktivitas harian.
2. **Satu tindakan, satu feedback.** Setiap sentuhan atau penyelesaian aktivitas harus menghasilkan respons yang jelas.
3. **Mendukung, bukan menghakimi.** Bahasa, animasi, dan streak tidak boleh mempermalukan pengguna.
4. **Ibadah bukan permainan angka.** XP menghargai konsistensi membangun rutinitas, bukan menilai kualitas spiritual pengguna.
5. **Offline-first untuk robot.** Aktivitas inti harus tetap dapat berjalan ketika ponsel tidak berada di dekat robot.
6. **Konfigurasi kompleks tetap di app.** Robot tidak menjadi tempat membuat atau mengedit habit yang rumit.
7. **Sinkronisasi harus dapat dipercaya.** Pengguna harus mengetahui data apa yang berhasil diambil dan dikirim.

---

## 6. Tujuan dan Non-Tujuan MVP

### 6.1 Tujuan MVP

MVP harus membuktikan bahwa pengguna dapat:

1. Mengaktifkan dan menghubungkan Quba tanpa bantuan teknis.
2. Membuat kebiasaan dan mengirimkannya ke robot.
3. Menjalankan checklist, counter, atau countdown melalui app maupun robot sesuai konteks.
4. Membuat counter atau session sekali jalan, lalu memilih apakah aktivitas dihubungkan ke habit atau menggunakan judul custom.
5. Menggunakan robot tanpa koneksi ponsel untuk aktivitas yang sudah tersinkron.
6. Menyinkronkan hasil aktivitas kembali ke app tanpa duplikasi atau kehilangan data.
7. Memahami XP, level, streak, badge, dan ringkasan progres.
8. Merasakan bahwa Quba mengurangi kebutuhan membuka ponsel ketika melakukan aktivitas.

### 6.2 Non-Tujuan MVP

Fitur berikut tidak menjadi kebutuhan wajib untuk peluncuran pertama:

- Parent dashboard penuh.
- Multi-child atau multi-profile.
- Satu akun mengelola beberapa robot.
- Community, challenge, leaderboard, atau social feed.
- Chat atau AI coach.
- Marketplace badge.
- Custom badge builder dengan aturan kompleks.
- Statistik bulanan dan tahunan yang mendalam.
- Integrasi wearable atau health platform.
- Kontrol robot melalui internet secara real-time.
- Ekosistem konten mushaf digital di dalam app.

---

## 7. Ruang Lingkup MVP

### 7.1 P0 - Wajib untuk Peluncuran

- Aktivasi produk dengan kode unik.
- Registrasi, login, logout, dan pemulihan akun.
- Pairing satu akun dengan satu Quba melalui Bluetooth Low Energy.
- Status koneksi, baterai, dan waktu sinkronisasi terakhir.
- Sinkronisasi waktu, konfigurasi, reminder, dan log aktivitas.
- Template lima habit utama.
- Custom habit sederhana.
- Tipe habit checklist, counter, dan session/countdown.
- Aktivitas cepat berupa counter atau session yang dapat dihubungkan ke habit atau diberi judul custom tanpa habit.
- Reminder terjadwal, termasuk reminder waktu shalat.
- XP, level, streak per habit, dan badge default.
- Home dashboard dan statistik mingguan sederhana.
- Bahasa, tema, profil, suara, dan pengaturan reminder.
- Empty, loading, success, offline, dan error states.

### 7.2 P1 - Setelah Alur Inti Stabil

- Custom badge dasar: nama, ikon, dan milestone.
- Shareable achievement card.
- Detail statistik per habit.
- Streak recovery atau grace day.
- Pilihan metode perhitungan waktu shalat yang lebih lengkap.
- OTA firmware update jika hardware mendukung.

### 7.3 P2 - Pasca-MVP

- Parent Mode.
- Multi-profile dan multi-robot.
- Family reward.
- Community dan challenge.
- Konten dzikir atau mushaf terintegrasi.
- Integrasi layanan pihak ketiga.

---

## 8. Model Aktivitas dan Habit

Quba membedakan antara **habit** dan **activity run**:

- **Habit** adalah rutinitas yang disimpan, memiliki jadwal, occurrence, streak, dan badge.
- **Activity run** adalah satu pelaksanaan counter atau session. Activity run dapat dihubungkan ke habit atau berdiri sendiri.

Contoh:

- Pengguna membuat session 15 menit dan memilih habit **Baca Buku**. Durasi session masuk ke progres occurrence Baca Buku hari itu.
- Pengguna membuat session 15 menit dengan judul **Bereskan Meja** tanpa memilih habit. Aktivitas tetap dapat dijalankan di Quba dan dicatat di riwayat, tetapi tidak menjadi rutinitas terjadwal.

### 8.1 Jenis Habit

| Jenis | Definisi | Contoh | Kondisi Selesai |
|---|---|---|---|
| Checklist | Aktivitas yang cukup ditandai selesai per jadwal | Shalat sunah, minum air | Pengguna menandai occurrence selesai |
| Counter | Aktivitas berbasis jumlah pengulangan | Dzikir, push-up | Nilai counter mencapai target |
| Session | Aktivitas berbasis durasi | Baca buku, tilawah, fokus | Countdown mencapai durasi target |

### 8.2 Template Habit Awal

| Habit | Mekanisme Default | Opsi Target |
|---|---|---|
| Shalat 5 waktu | Lima checklist terjadwal | Subuh, Zuhur, Asar, Maghrib, Isya |
| Shalat sunah | Checklist | Jenis shalat dan frekuensi |
| Baca Qur'an | Session | Menit; halaman menjadi opsi P1 |
| Dzikir | Counter | Jumlah pengulangan |
| Baca buku | Session | Menit; halaman menjadi opsi P1 |

### 8.3 Custom Habit

Pengguna dapat menentukan:

- Nama habit.
- Ikon dari daftar yang tersedia.
- Tipe: checklist, counter, atau session.
- Target angka atau durasi jika diperlukan.
- Hari aktif.
- Waktu reminder.
- Status reminder suara.

MVP tidak mendukung formula habit gabungan, target bertingkat, atau rule builder.

### 8.4 Occurrence

Setiap jadwal habit menghasilkan satu occurrence dengan identitas unik. XP dan streak dihitung berdasarkan occurrence, bukan berdasarkan jumlah event mentah, untuk mencegah pemberian reward ganda.

Contoh:

- Habit dzikir harian menghasilkan satu occurrence per hari.
- Shalat 5 waktu menghasilkan lima occurrence terpisah per hari.
- Habit membaca setiap Senin, Rabu, dan Jumat hanya memengaruhi streak pada hari yang dijadwalkan.

### 8.5 Mode Activity Run

| Mode | Hubungan | Dampak Progres |
|---|---|---|
| Linked activity | Terhubung ke habit yang sudah ada dan occurrence yang relevan | Nilai counter atau durasi session ditambahkan ke progres habit; dapat menyelesaikan occurrence serta memengaruhi XP dan streak |
| Standalone activity | Tidak memiliki `habit_id`; menggunakan judul custom | Dicatat di activity history dan statistik aktivitas, tetapi tidak memengaruhi streak atau badge habit |

Ketentuan MVP:

- Hanya habit dengan mekanisme yang sesuai yang dapat dipilih. Session hanya dapat dihubungkan ke habit session; counter hanya dapat dihubungkan ke habit counter.
- Pengguna dapat mengubah judul activity run tanpa mengubah nama habit.
- Beberapa activity run dapat berkontribusi pada satu occurrence. Contoh: dua session membaca masing-masing 15 menit dapat memenuhi target harian 30 menit.
- Jika tidak ada occurrence aktif pada hari tersebut, activity run tetap masuk ke histori habit sebagai aktivitas tambahan tetapi tidak membuat streak baru.
- Standalone activity tidak otomatis membuat habit.
- Opsi **Jadikan Habit** untuk standalone activity ditempatkan sebagai P1 dan tidak memberikan streak secara retroaktif.
- Rekomendasi awal: standalone activity tidak memberikan XP pada MVP untuk mencegah farming; keputusan final dicatat sebagai keputusan terbuka.

---

## 9. Pengalaman Utama Pengguna

### 9.1 Onboarding dan Aktivasi

Alur yang diusulkan:

1. Pengguna membuka Quba App.
2. App menjelaskan manfaat utama secara singkat.
3. Pengguna memasukkan kode unik dari kemasan robot.
4. Sistem memvalidasi kode.
5. Pengguna membuat akun dengan username, email, dan password.
6. Pengguna menyalakan Bluetooth dan Quba.
7. App mencari perangkat di sekitar.
8. Pengguna memilih robot dan mengonfirmasi identitas perangkat.
9. App menyinkronkan waktu dan melakukan tes koneksi.
10. Pengguna memilih starter routine atau membuat habit pertama.
11. App mengirim konfigurasi pertama.
12. Pengguna menyelesaikan satu aktivitas percobaan sebagai first win.

### 9.2 Golden Journey

Journey utama yang harus bekerja sebelum fitur lain dianggap selesai:

> Buat habit dzikir 33 kali -> sync ke Quba -> sentuh Quba 33 kali -> target selesai -> sync kembali -> XP dan streak bertambah.

Journey aktivitas cepat yang juga wajib bekerja:

> Buat session 15 menit -> pilih habit Baca Buku atau isi judul custom -> kirim ke Quba -> selesaikan countdown -> hasil masuk ke progres habit atau activity history sesuai mode yang dipilih.

### 9.3 Daily Loop

1. Quba menampilkan aktivitas berikutnya.
2. Saat jadwal tiba, Quba memberikan reminder lembut.
3. Pengguna memulai aktivitas melalui robot.
4. Robot menampilkan progres dan memberikan feedback.
5. Ketika target tercapai, robot menyimpan event dan menampilkan ekspresi keberhasilan.
6. App mengambil event pada koneksi berikutnya.
7. App memperbarui progres, XP, streak, dan badge.
8. Home menampilkan ringkasan dan aktivitas berikutnya.

### 9.4 Quick Activity Flow

1. Pengguna memilih **Buat Aktivitas** dari Beranda atau halaman Quba.
2. Pengguna memilih **Session** atau **Counter**.
3. Pengguna menentukan target durasi/jumlah.
4. Pengguna memilih salah satu:
   - Hubungkan ke habit yang kompatibel.
   - Tanpa habit, lalu isi judul custom.
5. Pengguna memilih jalankan di app atau kirim ke Quba jika perangkat terhubung.
6. Ketika selesai, app menyimpan hasil ke progres habit atau activity history.
7. App menawarkan **Jadikan Habit** untuk aktivitas standalone sebagai fitur P1.

---

## 10. Arsitektur Pengalaman App, Robot, dan Backend

| Komponen | Tanggung Jawab Utama |
|---|---|
| Quba App | Akun, setup, habit, quick activity, target, jadwal, pairing, sinkronisasi, koreksi, progres, statistik, dan pengaturan |
| Quba Bot | Reminder lokal, tampilan aktivitas, input sentuhan, counter, countdown, feedback emosional, dan penyimpanan event offline |
| Backend Quba | Akun, aktivasi kode, kepemilikan perangkat, backup konfigurasi, data progres, dan pemulihan akun |

### 10.1 Sumber Kebenaran Data

- App/backend menjadi sumber kebenaran untuk konfigurasi habit dan jadwal.
- Robot menjadi sumber kebenaran sementara untuk event aktivitas yang dibuat ketika offline.
- Event aktivitas bersifat append-only dan dideduplikasi menggunakan `event_id`.
- Perubahan konfigurasi menggunakan `config_version`.
- Penghapusan habit harus menggunakan tombstone atau status archived sampai semua perangkat mengonfirmasi sinkronisasi.
- Activity run standalone menggunakan ID tersendiri dan tidak boleh dipaksa memiliki `habit_id` atau `occurrence_id`.

---

## 11. Functional Requirements

Prioritas menggunakan MoSCoW:

- **Must:** wajib untuk MVP.
- **Should:** penting, tetapi dapat menyusul setelah alur inti stabil.
- **Could:** kandidat pengembangan berikutnya.

### 11.1 Aktivasi dan Akun

| ID | Requirement | Prioritas | Acceptance Criteria |
|---|---|---|---|
| ACT-01 | Pengguna harus memasukkan kode unik yang valid sebelum mengaktifkan Quba | Must | Kode valid dapat dilanjutkan; kode tidak valid menampilkan alasan dan tindakan berikutnya |
| ACT-02 | Kode unik hanya dapat dimiliki satu akun aktif | Must | Sistem mencegah klaim ganda dan menyediakan jalur pemulihan kepemilikan |
| ACT-03 | Pengguna dapat registrasi menggunakan username, email, dan password | Must | Akun berhasil dibuat setelah validasi input dan verifikasi yang ditentukan backend |
| ACT-04 | Pengguna dapat login menggunakan username atau email dan dapat logout | Must | Kedua identifier menerima kredensial akun yang sama; sesi dapat diakhiri pengguna |
| ACT-05 | Pengguna dapat memulihkan akun ketika mengganti atau kehilangan ponsel | Must | Setelah verifikasi, konfigurasi terakhir dapat dipulihkan dari backend |
| ACT-06 | Pengguna dapat melihat robot yang terikat ke akun | Must | Halaman perangkat menampilkan nama, ID tersamarkan, dan status binding |

### 11.2 Pairing dan Device Management

| ID | Requirement | Prioritas | Acceptance Criteria |
|---|---|---|---|
| DEV-01 | App dapat mencari Quba melalui BLE | Must | Hanya perangkat Quba yang kompatibel ditampilkan |
| DEV-02 | Pengguna dapat mengonfirmasi robot yang benar | Must | App dan robot menampilkan indikator identitas yang dapat dicocokkan |
| DEV-03 | App menyimpan hubungan perangkat setelah pairing | Must | Koneksi berikutnya dapat dilakukan tanpa pairing ulang selama binding valid |
| DEV-04 | App menampilkan status Connected, Syncing, Offline, dan Needs Attention | Must | Status berubah sesuai kondisi aktual dan memiliki penjelasan yang mudah dipahami |
| DEV-05 | App menampilkan baterai dan waktu sinkronisasi terakhir | Must | Nilai diperbarui setelah koneksi berhasil |
| DEV-06 | Pengguna dapat mengganti nama robot | Should | Nama baru muncul di app dan dikirim ke robot jika didukung |
| DEV-07 | Pengguna dapat melepas binding perangkat dengan verifikasi | Must | Pelepasan tidak dapat terjadi karena satu sentuhan yang tidak disengaja |

### 11.3 Habit Management

| ID | Requirement | Prioritas | Acceptance Criteria |
|---|---|---|---|
| HAB-01 | Pengguna dapat memilih lima template habit | Must | Template membuat konfigurasi awal yang dapat diedit |
| HAB-02 | Pengguna dapat membuat custom habit | Must | Habit tersimpan setelah nama, tipe, jadwal, dan target valid |
| HAB-03 | Pengguna dapat mengedit, menonaktifkan, dan mengarsipkan habit | Must | Perubahan tersinkron tanpa menghapus histori lama |
| HAB-04 | Pengguna dapat menentukan hari aktif | Must | Occurrence hanya dibuat untuk hari yang dipilih |
| HAB-05 | Pengguna dapat menentukan satu atau beberapa waktu reminder sesuai tipe habit | Must | Reminder yang valid masuk ke konfigurasi sinkronisasi |
| HAB-06 | Pengguna dapat mengurutkan prioritas habit di robot | Should | Urutan tampil konsisten setelah sinkronisasi |
| HAB-07 | App membatasi konfigurasi sesuai kapasitas robot | Must | Pengguna mendapat penjelasan ketika jumlah habit/reminder melampaui kemampuan perangkat |

### 11.4 Checklist

| ID | Requirement | Prioritas | Acceptance Criteria |
|---|---|---|---|
| CHK-01 | Pengguna dapat menandai occurrence selesai dari app | Must | Status berubah sekali dan tidak memberikan XP ganda |
| CHK-02 | Pengguna dapat menandai occurrence selesai dari robot jika UI hardware mendukung | Must | Event tersimpan lokal dan muncul di app setelah sinkronisasi |
| CHK-03 | Pengguna dapat membatalkan status selesai pada hari yang sama | Should | Progres, XP, dan streak dihitung ulang secara konsisten |

### 11.5 Counter

| ID | Requirement | Prioritas | Acceptance Criteria |
|---|---|---|---|
| CNT-01 | Setiap sentuhan valid menambah counter satu unit | Must | Robot memberi feedback visual atau haptic/audio untuk input yang diterima |
| CNT-02 | Pengguna dapat mengurangi atau membatalkan hitungan terakhir | Must | Koreksi tidak menghasilkan event penyelesaian ganda |
| CNT-03 | Robot menampilkan nilai saat ini dan target | Must | Nilai tetap tersedia ketika robot offline |
| CNT-04 | Target selesai ketika nilai mencapai target | Must | Event selesai hanya dibuat satu kali per occurrence |
| CNT-05 | Input setelah target dapat dicatat tanpa XP tambahan | Should | App membedakan target selesai dan total aktual |

### 11.6 Session / Countdown

| ID | Requirement | Prioritas | Acceptance Criteria |
|---|---|---|---|
| SES-01 | Pengguna dapat memulai countdown dari app atau robot | Must | Hanya satu session aktif pada satu waktu untuk user/robot yang sama |
| SES-02 | Pengguna dapat pause, resume, dan cancel | Must | Waktu tersisa tetap konsisten setelah interupsi yang didukung |
| SES-03 | Robot menampilkan waktu tersisa | Must | Countdown dapat berjalan tanpa koneksi ponsel |
| SES-04 | Robot memberikan feedback ketika waktu selesai | Must | Completion event disimpan tepat satu kali |
| SES-05 | App menyimpan total durasi dan jumlah session | Should | Statistik diperbarui setelah sinkronisasi |

### 11.7 Aktivitas Cepat / Practice

| ID | Requirement | Prioritas | Acceptance Criteria |
|---|---|---|---|
| PRA-01 | Pengguna dapat membuat activity run berupa session atau counter tanpa membuka form pembuatan habit | Must | Pengguna dapat mencapai layar mulai aktivitas dengan memilih tipe dan target |
| PRA-02 | Pengguna dapat menghubungkan activity run ke habit yang sudah ada | Must | Daftar hanya menampilkan habit dengan mekanisme kompatibel |
| PRA-03 | Pengguna dapat membuat activity run standalone dengan judul custom | Must | Activity run tersimpan dengan `habit_id` dan `occurrence_id` kosong |
| PRA-04 | Linked activity menambah progres occurrence habit yang relevan | Must | Beberapa run diakumulasi dan completion hanya terjadi sekali ketika target tercapai |
| PRA-05 | Standalone activity masuk ke activity history tanpa mengubah streak atau badge habit | Must | Riwayat menampilkan judul, tipe, target, hasil, durasi/waktu, dan sumber aktivitas |
| PRA-06 | Pengguna dapat memilih menjalankan aktivitas di app atau Quba | Must | Tujuan yang tidak tersedia dinonaktifkan dengan alasan yang jelas |
| PRA-07 | App dapat mengirim satu activity run sementara ke Quba tanpa menyimpannya sebagai habit | Must | Robot menerima judul, tipe, target, dan run ID; hasil kembali ke run yang sama |
| PRA-08 | Pengguna dapat menjadikan standalone activity sebagai habit baru | Should | Form habit terisi dari aktivitas sebelumnya tanpa memberi streak retroaktif |
| PRA-09 | Pengguna dapat membatalkan activity run sebelum selesai | Must | Run berstatus cancelled dan tidak menyelesaikan occurrence atau memberi reward |

### 11.8 Reminder dan Waktu Shalat

| ID | Requirement | Prioritas | Acceptance Criteria |
|---|---|---|---|
| REM-01 | App dapat membuat reminder berdasarkan waktu lokal | Must | Reminder dipicu pada waktu yang tersinkron di robot |
| REM-02 | App menyinkronkan timezone dan waktu perangkat | Must | Robot mendeteksi atau memperbaiki drift sesuai toleransi teknis |
| REM-03 | App menghitung atau memperoleh jadwal shalat berdasarkan lokasi dan konfigurasi pengguna | Must | Jadwal menampilkan sumber/metode dan dapat diperiksa sebelum disinkronkan |
| REM-04 | Pengguna dapat mengatur offset waktu shalat | Should | Offset diterapkan konsisten pada app dan robot |
| REM-05 | Pengguna dapat mengatur suara dan volume reminder | Must | Mode senyap tidak menghilangkan feedback visual |
| REM-06 | Reminder yang terlewat tidak memberikan pesan yang menyalahkan | Must | Copy bersifat netral dan menawarkan tindakan selanjutnya |
| REM-07 | Pengguna dapat menunda reminder yang sedang aktif | Should | Reminder dijadwalkan ulang satu kali sesuai interval snooze yang ditentukan produk |

### 11.9 XP, Level, Streak, dan Badge

| ID | Requirement | Prioritas | Acceptance Criteria |
|---|---|---|---|
| GAM-01 | Penyelesaian satu occurrence memberikan XP satu kali | Must | Event duplikat tidak menambah XP |
| GAM-02 | Checklist, counter target, dan session target mengikuti aturan XP yang sama | Must | Sumber aktivitas tidak menciptakan ketimpangan reward |
| GAM-03 | App menampilkan total XP dan level | Must | Perubahan terlihat setelah penyelesaian atau sinkronisasi |
| GAM-04 | Streak dihitung per habit berdasarkan jadwalnya | Must | Hari tanpa jadwal tidak memutus streak |
| GAM-05 | Badge default diberikan pada milestone 7, 30, dan 90 occurrence beruntun | Must | Badge hanya diberikan sekali per milestone per habit |
| GAM-06 | Copy gamifikasi tidak mengklaim nilai atau kualitas spiritual | Must | Semua copy lolos review product/content |
| GAM-07 | Pengguna dapat membuat badge dasar | Should | Pengguna dapat memilih nama, ikon, dan milestone dalam batas yang ditentukan |
| GAM-08 | Linked activity mengikuti reward occurrence habit; standalone activity tidak memengaruhi streak atau badge | Must | Activity run standalone tidak membuat atau menyelesaikan occurrence habit |

Aturan balancing awal yang diusulkan:

- Satu occurrence selesai: 10 XP.
- Satu occurrence hanya dapat memberi XP sekali.
- Setiap 100 XP menaikkan satu level pada MVP.
- Nilai dapat diubah melalui konfigurasi backend tanpa memperbarui firmware.
- Tidak ada pengurangan XP ketika habit terlewat.
- Tidak ada bonus untuk sentuhan counter setelah target tercapai.
- Standalone activity tidak memberikan XP pada baseline MVP sampai keputusan balancing disetujui.

Angka tersebut merupakan baseline untuk usability test, bukan keputusan ekonomi permanen.

### 11.10 Dashboard dan Statistik

| ID | Requirement | Prioritas | Acceptance Criteria |
|---|---|---|---|
| STA-01 | Home menampilkan progres hari ini | Must | Pengguna dapat melihat selesai, sedang berjalan, dan belum selesai |
| STA-02 | Home menampilkan aktivitas aktif atau aktivitas berikutnya | Must | CTA membawa pengguna langsung ke tindakan yang relevan |
| STA-03 | Statistik menampilkan XP harian selama tujuh hari | Must | Angka sesuai dengan ledger XP |
| STA-04 | Statistik menampilkan habit paling konsisten | Must | Perhitungan menggunakan completion terhadap occurrence terjadwal |
| STA-05 | Detail habit menampilkan streak, total aktivitas, dan kalender mingguan | Must | Data historis tidak berubah akibat perubahan konfigurasi habit berikutnya |
| STA-06 | App menampilkan activity history untuk linked dan standalone activity | Must | Setiap item menunjukkan hubungan ke habit atau label Standalone secara jelas |

### 11.11 Settings dan Profile

| ID | Requirement | Prioritas | Acceptance Criteria |
|---|---|---|---|
| SET-01 | Pengguna dapat memilih Bahasa Indonesia atau Bahasa Inggris | Must | Seluruh copy inti tersedia lengkap dalam bahasa yang dipilih dan pilihan tersimpan |
| SET-02 | Pengguna dapat memilih tema dari preset yang tersedia atau mengikuti sistem | Must | MVP memiliki minimal dua preset; pilihan tersimpan di akun/perangkat lokal |
| SET-03 | Pengguna dapat mengubah informasi profil | Must | Validasi diterapkan pada username dan email |
| SET-04 | Pengguna dapat menyalakan atau mematikan suara Quba | Must | Pengaturan dikirim pada sinkronisasi berikutnya |
| SET-05 | Pengguna dapat melihat versi app dan firmware | Must | Informasi tersedia untuk kebutuhan support |

---

## 12. Sinkronisasi App-Robot

### 12.1 Alur Sinkronisasi

1. App menemukan dan menghubungkan Quba yang sudah terikat.
2. App dan robot memverifikasi identitas dan versi protokol.
3. App membaca waktu, timezone, baterai, firmware, dan `config_version` robot.
4. App menyelaraskan waktu jika drift melewati toleransi.
5. App mengambil semua event aktivitas yang belum diakui.
6. App melakukan deduplikasi berdasarkan `event_id`.
7. App memperbarui occurrence, XP, streak, badge, dan backend.
8. App mengirim konfigurasi baru jika versinya lebih tinggi.
9. Jika ada activity run sementara, app mengirim run ID, judul, tipe, dan target tanpa membuat konfigurasi habit permanen.
10. Robot memvalidasi dan menyimpan konfigurasi atau activity run secara atomik.
11. Robot mengirim acknowledgement untuk event, konfigurasi, dan activity run.
12. App menampilkan ringkasan hasil sinkronisasi.

Urutan upload aktivitas sebelum download konfigurasi mencegah log lokal hilang atau salah dipetakan ketika habit berubah.

### 12.2 Model Konflik

- Event aktivitas bersifat append-only dan tidak menggunakan last-write-wins.
- Duplikasi dicegah dengan `event_id` yang unik.
- Konfigurasi habit menggunakan versi monotonik.
- App/backend memenangkan konflik konfigurasi pada MVP.
- Robot tidak menghapus event sebelum menerima acknowledgement.
- Perubahan waktu harus dicatat agar event lama tidak mendapat timestamp yang salah.
- Hasil activity run menggunakan `activity_run_id` agar linked dan standalone activity dapat direkonsiliasi tanpa bergantung pada judul.

### 12.3 Offline Behavior

Robot harus tetap dapat:

- Menampilkan waktu.
- Menjalankan reminder yang sudah tersimpan.
- Menjalankan counter dan countdown.
- Menyimpan completion event.
- Menampilkan progres lokal.

Target awal, menunggu validasi kemampuan hardware:

- Menyimpan minimal 7 hari konfigurasi reminder waktu shalat.
- Menyimpan minimal 500 event yang belum tersinkron.
- Mempertahankan data setelah restart atau kehilangan daya normal.

### 12.4 Status Sinkronisasi untuk Pengguna

App harus membedakan:

- Berhasil: aktivitas dan konfigurasi sudah selaras.
- Berhasil sebagian: aktivitas tersimpan tetapi konfigurasi belum dikirim, atau sebaliknya.
- Tidak terhubung: Quba tidak ditemukan.
- Perlu tindakan: firmware/protokol tidak kompatibel, storage penuh, atau binding bermasalah.

Contoh pesan berhasil:

> 8 aktivitas diambil dan 2 pengingat diperbarui.

---

## 13. Model Data Minimum

### 13.1 Habit

```text
id
owner_profile_id
name
icon
type: checklist | counter | session
target_value
target_unit
active_days
reminder_times
enabled
archived_at
config_version
created_at
updated_at
```

### 13.2 Occurrence

```text
id
habit_id
scheduled_date
scheduled_time
status: pending | in_progress | completed | skipped
completed_value
completed_at
xp_awarded
```

### 13.3 ActivityEvent

```text
event_id
device_id
activity_run_id
habit_id: nullable
occurrence_id: nullable
event_type
value
started_at
recorded_at
device_time_offset
source: robot | app
sync_status
```

### 13.4 ActivityRun

```text
id
owner_profile_id
type: counter | session
title
link_mode: linked | standalone
habit_id: nullable
occurrence_id: nullable
target_value
target_unit
current_value
status: draft | queued | active | paused | completed | cancelled
execution_target: app | robot
started_at
completed_at
created_at
```

`habit_id` dan `occurrence_id` wajib untuk linked activity jika occurrence yang relevan tersedia. Keduanya harus kosong untuk standalone activity.

### 13.5 Device

```text
device_id
activation_code_id
owner_account_id
display_name
firmware_version
protocol_version
battery_level
timezone
device_clock
last_sync_at
config_version
binding_status
```

### 13.6 XP Ledger

```text
ledger_id
account_id
occurrence_id
activity_event_id
xp_delta
reason
created_at
```

Ledger diperlukan agar XP dapat diaudit, dideduplikasi, dan dihitung ulang tanpa hanya menyimpan total akhir.

---

## 14. Information Architecture App

Navigasi utama yang diusulkan:

1. **Beranda** - progres hari ini, aktivitas aktif, aktivitas berikutnya, XP, dan status singkat Quba.
2. **Habits** - daftar, template, custom habit, serta detail habit.
3. **Quba** - aktivitas cepat, koneksi, sinkronisasi, baterai, konfigurasi perangkat, dan tes perangkat.
4. **Statistik** - ringkasan mingguan, konsistensi, XP, dan histori.
5. **Profil** - akun, bahasa, tema, suara, bantuan, dan informasi versi.

Ketika session aktif, navigasi atau CTA utama harus menyediakan akses langsung ke session tanpa membuat pengguna mencari layar asalnya.

Beranda dan halaman Quba menyediakan CTA **Buat Aktivitas** dengan pilihan Session atau Counter. Pemilihan habit bersifat opsional dan dilakukan setelah tipe serta target aktivitas ditentukan.

---

## 15. UX dan Content Requirements

### 15.1 Tone

- Ramah, ringan, dan tidak menggurui.
- Tidak infantil untuk Self Mode.
- Tidak menggunakan rasa bersalah sebagai motivasi.
- Kalimat singkat dan berorientasi tindakan.

Contoh:

- Gunakan: “Belum sempat hari ini? Kamu bisa mulai dari 5 menit.”
- Hindari: “Streak-mu gagal karena kamu melewatkan aktivitas.”
- Gunakan: “Quba belum terhubung. Dekatkan ponsel dan coba lagi.”
- Hindari: “Bluetooth error 0x04.”

### 15.2 Feedback Robot

- Idle: ekspresi tenang dan animasi minimal.
- Reminder: ekspresi mengajak, bukan alarm yang mengejutkan.
- Input diterima: feedback cepat dan konsisten.
- Target tercapai: celebration singkat.
- Sync berlangsung: indikator progres yang tidak disalahartikan sebagai hang.
- Error: ekspresi netral disertai instruksi di app.

### 15.3 Accessibility Dasar

- Informasi tidak hanya dibedakan menggunakan warna.
- Ukuran teks utama mengikuti standar keterbacaan platform.
- Tombol memiliki area sentuh memadai.
- Animasi app mengikuti preferensi reduced motion jika platform menyediakan.
- Audio reminder selalu memiliki padanan visual.

---

## 16. Non-Functional Requirements

| Area | Target MVP |
|---|---|
| Pairing | Pengguna normal dapat menyelesaikan pairing pertama dalam maksimal 60 detik setelah Quba ditemukan |
| Sinkronisasi | Sinkronisasi rutin dengan kurang dari 50 event ditargetkan selesai dalam maksimal 10 detik |
| Keandalan event | Tidak ada duplicate XP dari pengiriman event yang sama berulang kali |
| Offline | Robot tetap menjalankan konfigurasi terakhir tanpa app |
| Recovery | Kegagalan koneksi tidak menghapus event atau konfigurasi terakhir yang valid |
| Keamanan | Binding perangkat dan operasi sensitif memerlukan akun yang terautentikasi |
| Privasi | Hanya data yang diperlukan untuk akun, perangkat, dan progres yang dikumpulkan |
| Observability | App mencatat error pairing/sync dengan kode internal yang dapat digunakan support |
| Localization | Semua copy pengguna dipisahkan dari kode untuk mendukung lebih dari satu bahasa |
| Compatibility | Versi protokol app dan firmware diperiksa sebelum pertukaran data |

Target performa perlu divalidasi kembali setelah spesifikasi chipset, BLE, storage, dan display robot tersedia.

---

## 17. Analytics dan Metrik Keberhasilan

### 17.1 North Star Metric

**Weekly Meaningful Activity Completions per Active Quba**

Completion dianggap meaningful ketika occurrence habit mencapai target atau standalone activity selesai di Quba dan event berhasil tersinkron tanpa duplikasi. Habit completion dan standalone completion tetap dilaporkan sebagai dua dimensi terpisah.

### 17.2 Activation Metrics

- Persentase pengguna yang berhasil mengklaim kode.
- Persentase pengguna yang berhasil pairing.
- Median waktu dari instalasi hingga pairing.
- Persentase pengguna yang membuat atau memilih habit pertama.
- Persentase pengguna yang membuat linked atau standalone activity pertama.
- Persentase pengguna yang menyelesaikan golden journey.
- Waktu hingga completion pertama.

### 17.3 Engagement dan Retention

- Daily dan weekly active Quba.
- Completion per pengguna aktif per minggu.
- Rasio linked activity terhadap standalone activity.
- Persentase aktivitas yang dilakukan melalui robot dibanding app.
- D1, D7, dan D30 retention.
- Persentase pengguna yang mempertahankan minimal satu streak 7 hari.
- Frekuensi sync dan persentase sync berhasil.

### 17.4 Target Validasi Awal

Target awal berikut adalah hipotesis untuk pilot, bukan KPI final:

- >= 80% peserta berhasil pairing tanpa bantuan moderator.
- >= 70% peserta menyelesaikan golden journey pada sesi pertama.
- >= 60% peserta melakukan minimal tiga meaningful completions pada minggu pertama.
- >= 30% peserta pilot tetap aktif pada hari ke-7.
- >= 95% sync rutin berhasil tanpa kehilangan atau duplikasi event.

### 17.5 Event Analytics Minimum

```text
activation_code_submitted
activation_completed
pairing_started
pairing_completed
pairing_failed
habit_created
habit_synced
activity_run_created
activity_run_linked
activity_run_started
activity_run_cancelled
reminder_triggered
activity_started
activity_completed
sync_started
sync_completed
sync_failed
xp_awarded
streak_achieved
badge_unlocked
```

Data analytics tidak boleh merekam isi sensitif yang tidak diperlukan.

---

## 18. Edge Cases dan Failure States

Produk harus memiliki perilaku yang ditentukan untuk kondisi berikut:

1. Kode unik salah, kedaluwarsa, rusak, atau sudah diklaim.
2. Pengguna mengganti ponsel tetapi robot masih terikat.
3. Bluetooth mati atau permission ditolak.
4. Lebih dari satu Quba terdeteksi dengan nama serupa.
5. Koneksi terputus di tengah upload event.
6. Koneksi terputus di tengah download konfigurasi.
7. Event yang sama dikirim ulang.
8. Waktu robot berubah atau drift terlalu jauh.
9. Pengguna berpindah timezone.
10. Habit dihapus ketika robot masih memiliki event yang belum tersinkron.
11. Session dimulai dari app dan robot hampir bersamaan.
12. Baterai robot habis ketika countdown berlangsung.
13. Storage event robot hampir penuh.
14. Jadwal reminder bertabrakan.
15. Waktu shalat berubah setelah lokasi atau metode perhitungan diubah.
16. App offline dari backend tetapi terhubung ke robot.
17. Firmware robot dan app menggunakan versi protokol yang tidak kompatibel.

Untuk setiap failure, app harus menjelaskan:

- Apa yang terjadi.
- Apakah data pengguna aman.
- Tindakan yang dapat dilakukan.
- Apakah proses dapat dicoba ulang.

---

## 19. Risiko Produk dan Mitigasi

| Risiko | Dampak | Mitigasi Awal |
|---|---|---|
| BLE tidak konsisten | Hilangnya kepercayaan terhadap progres | Event append-only, acknowledgement, retry, deduplikasi, dan status sync yang transparan |
| Robot terlalu bergantung pada app | Nilai screen-light tidak tercapai | Simpan jadwal, aktivitas, dan event secara lokal |
| Gamifikasi terasa meremehkan ibadah | Penolakan pengguna dan risiko reputasi | Reward konsistensi, review copy, hindari penilaian spiritual |
| Reminder menjadi mengganggu | Pengguna mematikan fitur atau meninggalkan produk | Volume, quiet hours, snooze, dan reminder lembut |
| Persona dewasa dan anak tercampur | Tone serta UI tidak relevan | Fokus Self Mode pada MVP dan pisahkan mode peran berikutnya |
| XP mudah dimanipulasi | Reward kehilangan makna | XP per occurrence, deduplikasi, dan tidak ada farming setelah target |
| Jadwal shalat tidak akurat | Hilangnya kepercayaan | Metode transparan, lokasi terkontrol, offset manual, dan QA domain |
| Hardware tidak mendukung scope | Keterlambatan dan redesign | Feasibility spike sebelum UI dan backlog final |
| Aktivasi kode menyulitkan recovery | Support burden tinggi | Ownership model, account recovery, dan controlled rebind sejak awal |

---

## 20. Dependensi dan Keputusan Hardware

PRD membutuhkan konfirmasi kemampuan Quba Bot berikut:

- Jenis dan resolusi display.
- Touch sensor: single touch, long press, double tap, dan debounce.
- Speaker, buzzer, atau audio playback.
- Haptic feedback jika tersedia.
- Real-time clock dan akurasi drift.
- Kapasitas persistent storage.
- Kapasitas RAM untuk konfigurasi dan event queue.
- BLE version, throughput, MTU, dan bonding support.
- Mekanisme firmware update.
- Status baterai dan metode charging.
- Perilaku saat restart, low battery, dan kehilangan daya.

Tanpa jawaban tersebut, target offline, jumlah habit, jumlah reminder, jumlah event, dan performa sinkronisasi belum dapat dianggap final.

---

## 21. Validasi Pengguna

### 21.1 Usability Test Pertama

Jumlah awal: 5-8 pengguna yang mendekati persona utama.

Tugas pengujian:

1. Aktivasi kode dan buat akun.
2. Hubungkan Quba.
3. Buat habit dzikir dengan target 33.
4. Sinkronkan habit.
5. Selesaikan target melalui robot.
6. Sinkronkan kembali dan temukan XP/streak.
7. Ubah reminder dan suara Quba.

Pertanyaan observasi:

- Apakah pengguna memahami pembagian tugas app dan robot?
- Apakah pengguna mengetahui kapan data sudah tersinkron?
- Apakah robot mengurangi kebutuhan membuka ponsel?
- Apakah feedback target selesai terasa memuaskan?
- Apakah XP dan streak dipahami tanpa penjelasan?
- Apakah reminder terasa membantu atau mengganggu?

### 21.2 Hipotesis yang Harus Dibuktikan

1. Kehadiran robot meningkatkan kemungkinan pengguna memulai aktivitas.
2. Counter dan countdown fisik mengurangi distraksi ponsel.
3. Feedback ekspresif meningkatkan keinginan untuk mengulang aktivitas.
4. Pengguna mempercayai progres ketika sinkronisasi dapat dipahami.
5. Self Mode cukup bernilai sebelum Parent Mode tersedia.

---

## 22. Milestone Pengembangan

### Milestone 0 - Product dan Hardware Feasibility

- Konfirmasi persona peluncuran.
- Konfirmasi kemampuan hardware.
- Definisikan BLE protocol dan data contract.
- Prototype counter dan event storage.
- Prototype sinkronisasi waktu serta event.

### Milestone 1 - Golden Journey Alpha

- Aktivasi development code.
- Pairing satu robot.
- Satu habit counter.
- Satu standalone session atau counter dengan judul custom.
- Aktivitas offline.
- Sync event kembali ke app.
- XP dan streak dasar.

### Milestone 2 - Feature-Complete Internal Beta

- Lima template habit.
- Custom habit.
- Checklist, counter, dan session.
- Reminder dan waktu shalat.
- Dashboard, badge, statistik, dan settings.
- Error handling serta recovery.

### Milestone 3 - Closed Pilot

- 5-20 pengguna target.
- Instrumentasi analytics.
- Pengujian D7.
- Perbaikan pairing, sync, reminder, dan balancing XP.

### Milestone 4 - Release Candidate

- Security dan privacy review.
- QA lintas versi firmware/app.
- Support playbook.
- Production activation codes.
- Store readiness dan release monitoring.

---

## 23. Definition of Done MVP

MVP dianggap siap pilot ketika:

1. Golden journey berhasil end-to-end pada hardware sebenarnya.
2. Event tidak hilang atau menghasilkan XP ganda setelah retry sync.
3. Robot tetap dapat menjalankan habit yang sudah tersinkron saat app tidak terhubung.
4. Semua P0 requirement memiliki test case dan lulus acceptance test.
5. Pairing, sync, dan recovery memiliki error states yang dapat dipahami pengguna.
6. Jadwal shalat sudah melewati review akurasi dan konfigurasi.
7. Copy ibadah dan gamifikasi sudah melewati review product/content.
8. Analytics untuk activation, golden journey, sync, dan retention tersedia.
9. Usability test menunjukkan mayoritas peserta dapat menyelesaikan golden journey tanpa bantuan.
10. Tim support dapat mengidentifikasi versi app, firmware, perangkat, dan error sync.
11. Linked activity masuk ke progres habit yang benar, sedangkan standalone activity tetap tercatat tanpa membuat occurrence habit.

---

## 24. Keputusan Terbuka

Keputusan berikut harus diselesaikan sebelum backlog final:

| No. | Pertanyaan | Rekomendasi Awal | Pemilik |
|---|---|---|---|
| 1 | Siapa persona peluncuran? | Self Mode / Cozy Self-Improver | Product/Business |
| 2 | Apakah checklist dapat dilakukan langsung dari robot? | Ya, jika input dapat dibedakan dari counter | Product/Firmware |
| 3 | Apakah session dapat dimulai dari app dan robot? | Ya, dengan satu active-session lock | App/Firmware |
| 4 | Berapa kapasitas habit, reminder, dan event di robot? | Ditentukan dari feasibility hardware | Firmware |
| 5 | Bagaimana metode waktu shalat dipilih? | Default berdasarkan lokasi dengan opsi review dan offset | Product/Backend |
| 6 | Apakah robot memainkan adzan penuh atau reminder pendek? | Reminder pendek sebagai default | Product/Legal/Content |
| 7 | Apakah Bahasa Inggris wajib saat peluncuran? | Ya, sesuai requirement Bahasa; dapat diturunkan ke P1 jika copy belum siap saat scope lock | Business/Product |
| 8 | Apakah custom badge termasuk P0? | Tidak; default badge P0, custom badge P1 | Product |
| 9 | Apakah level memakai formula linear? | Mulai 100 XP/level dan uji pada pilot | Product/Data |
| 10 | Berapa lama data disimpan di backend dan robot? | Tentukan setelah privacy serta hardware review | Backend/Firmware |
| 11 | Apakah standalone activity mendapatkan XP? | Tidak pada baseline MVP; ukur penggunaan sebelum menentukan reward yang tidak mudah di-farm | Product/Data |
| 12 | Apakah activity run tanpa occurrence terjadwal dapat memengaruhi streak? | Tidak; masukkan sebagai aktivitas tambahan di histori habit | Product/Data |

---

## 25. Lampiran: Ringkasan Acceptance Journey

### Journey A - Aktivasi

**Given** pengguna memiliki kode unik yang valid dan robot baru  
**When** pengguna memasukkan kode, membuat akun, dan memilih robot  
**Then** akun memiliki binding yang benar, waktu robot tersinkron, dan app menampilkan status Connected.

### Journey B - Membuat Habit

**Given** app terhubung dengan Quba  
**When** pengguna membuat habit dzikir target 33 dan menekan Sync  
**Then** Quba dapat menampilkan nama habit, nilai 0/33, dan jadwal reminder yang benar.

### Journey C - Aktivitas Offline

**Given** habit sudah tersinkron dan ponsel tidak terhubung  
**When** pengguna menyentuh robot sampai target tercapai  
**Then** robot menampilkan progres, merayakan completion satu kali, dan menyimpan event secara persisten.

### Journey D - Sinkronisasi Progres

**Given** robot memiliki completion event yang belum tersinkron  
**When** app terhubung dan melakukan sinkronisasi  
**Then** app mengambil event, memberi 10 XP satu kali, memperbarui streak, dan mengakui event kepada robot.

### Journey E - Retry Aman

**Given** koneksi terputus setelah app menerima event tetapi sebelum robot menerima acknowledgement  
**When** sinkronisasi diulang  
**Then** event dikirim ulang tanpa menambah XP atau completion kedua.

### Journey F - Session Terhubung ke Habit

**Given** pengguna memiliki habit Baca Buku dengan target 30 menit hari ini  
**When** pengguna membuat session 15 menit, memilih habit Baca Buku, dan menyelesaikannya  
**Then** progres occurrence Baca Buku menjadi 15/30 menit dan streak belum bertambah sampai target penuh tercapai.

### Journey G - Session Standalone

**Given** pengguna ingin melakukan aktivitas yang belum menjadi habit  
**When** pengguna membuat session 15 menit dengan judul custom dan tidak memilih habit  
**Then** session dapat dijalankan di app atau Quba, masuk ke activity history, serta tidak mengubah streak atau badge habit.

---

## 26. Riwayat Perubahan

| Versi | Tanggal | Perubahan |
|---|---|---|
| 1.0 Draft | 26 Agustus 2026 | Penyusunan awal PRD MVP berdasarkan diskusi tim, ICP/persona, papan ide, dan konsep UI |
| 1.0 Draft rev. 1 | 26 Agustus 2026 | Menambahkan activity run linked dan standalone untuk session/counter, termasuk flow, data model, reward, sinkronisasi, dan acceptance journey |
