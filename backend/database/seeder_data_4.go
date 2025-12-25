package database

func GetSeedDataPart4() []SeedQuiz {
	var quizzes []SeedQuiz

	// --- 8. PJOK (Pendidikan Jasmani, Olahraga, dan Kesehatan) ---
	// Grade 7
	quizzes = append(quizzes, SeedQuiz{
		SubjectCode: "PJOK", Grade: 7, Title: "PJOK Kelas VII",
		Questions: []SeedQuestion{
			{Text: "Induk organisasi sepak bola dunia adalah...", Options: o("FIFA", "PSSI", "FIBA", "IVBF"), Explanation: "Fédération Internationale de Football Association."},
			{Text: "Jumlah pemain sepak bola dalam satu tim adalah...", Options: o("11 orang", "6 orang", "5 orang", "12 orang"), Explanation: "Kesebelasan."},
			{Text: "Teknik menendang bola dengan kaki bagian dalam digunakan untuk...", Options: o("Umpan jarak pendek", "Menembak keras", "Melambungkan bola", "Menahan bola"), Explanation: "Passing pendek."},
			{Text: "Permainan bola voli diciptakan oleh...", Options: o("William G. Morgan", "James Naismith", "Jules Rimet", "Per Hendrick Ling"), Explanation: "Tahun 1895."},
			{Text: "Gerakan memukul bola voli sebagai tanda dimulainya permainan disebut...", Options: o("Servis", "Smash", "Block", "Passing"), Explanation: "Service."},
			{Text: "Induk organisasi bola basket Indonesia adalah...", Options: o("PERBASI", "PSSI", "PBVSI", "PASI"), Explanation: "Persatuan Bola Basket Seluruh Indonesia."},
			{Text: "Teknik memantulkan bola basket sambil berjalan/berlari disebut...", Options: o("Dribbling", "Passing", "Shooting", "Rebound"), Explanation: "Menggiring bola."},
			{Text: "Lari jarak pendek menggunakan start...", Options: o("Jongkok", "Berdiri", "Melayang", "Duduk"), Explanation: "Crouch start."},
			{Text: "Induk organisasi atletik di Indonesia adalah...", Options: o("PASI", "PSSI", "PRSI", "PERBASI"), Explanation: "Persatuan Atletik Seluruh Indonesia."},
			{Text: "Pencak silat berasal dari negara...", Options: o("Indonesia", "Jepang", "China", "Korea"), Explanation: "Beladiri asli."},
			{Text: "Kebugaran jasmani adalah...", Options: o("Kemampuan tubuh melakukan aktivitas tanpa kelelahan berarti", "Badan kekar", "Sehat rohani", "Tidak sakit"), Explanation: "Definisi kebugaran."},
			{Text: "Latihan push-up melatih kekuatan otot...", Options: o("Lengan dan bahu", "Kaki", "Perut", "Leher"), Explanation: "Otot lengan."},
			{Text: "Gaya renang yang paling lambat adalah...", Options: o("Gaya dada (katak)", "Gaya bebas", "Gaya punggung", "Gaya kupu-kupu"), Explanation: "Breaststroke biasanya paling lambat kompetitif."},
			{Text: "P3K singkatan dari...", Options: o("Pertolongan Pertama Pada Kecelakaan", "Pertolongan Para Korban", "Penyelamatan Kecelakaan", "Pengobatan Kecelakaan"), Explanation: "First Aid."},
			{Text: "Makanan bergizi seimbang mengandung...", Options: o("Karbohidrat, protein, lemak, vitamin, mineral", "Hanya daging", "Hanya sayur", "Nasi saja"), Explanation: "4 sehat 5 sempurna."},
			{Text: "Pola hidup sehat harus menghindari...", Options: o("Merokok dan alkohol", "Olahraga", "Tidur cukup", "Makan sayur"), Explanation: "Gaya hidup buruk."},
			{Text: "Senam irama adalah senam yang diiringi...", Options: o("Musik/Irama", "Teriakan", "Bunyi peluit", "Hening"), Explanation: "Ritmik."},
			{Text: "Alat pemukul dalam permainan kasti disebut...", Options: o("Tongkat pemukul (Bat)", "Raket", "Bet", "Stik golf"), Explanation: "Kasti."},
			{Text: "Roll depan adalah gerakan senam...", Options: o("Lantai", "Alat", "Aerobik", "Irama"), Explanation: "Guling depan."},
			{Text: "Sikap lilin bertumpu pada...", Options: o("Pundak/Punggung atas", "Kepala", "Tangan", "Kaki"), Explanation: "Menopang pinggang."},
		},
	})
	// Grade 8
	quizzes = append(quizzes, SeedQuiz{
		SubjectCode: "PJOK", Grade: 8, Title: "PJOK Kelas VIII",
		Questions: []SeedQuestion{
			{Text: "Teknik menyundul bola dalam sepak bola disebut...", Options: o("Heading", "Dribbling", "Shooting", "Tackling"), Explanation: "Kepala."},
			{Text: "Offside terjadi jika...", Options: o("Pemain penyerang lebih dekat ke gawang lawan daripada bek terakhir saat bola dioper", "Bola keluar lapangan", "Pemain handsball", "Kiper menangkap bola"), Explanation: "Aturan offside."},
			{Text: "Libero dalam bola voli bertugas sebagai...", Options: o("Pemain bertahan khusus", "Smasher", "Tosser", "Server"), Explanation: "Defensive specialist."},
			{Text: "Lay-up shoot dalam basket dilakukan dengan...", Options: o("Melompat mendekati ring", "Menembak dari jauh", "Diam di tempat", "Duduk"), Explanation: "Tembakan melayang."},
			{Text: "Estafet adalah lari sambung menggunakan tongkat. Jaraknya biasanya...", Options: o("4x100m dan 4x400m", "100m", "Maraton", "1000m"), Explanation: "Relay."},
			{Text: "Start melayang digunakan oleh pelari...", Options: o("Kedua, ketiga, keempat dalam estafet", "Pertama", "Semua pelari", "Cadangan"), Explanation: "Flying start."},
			{Text: "Teknik dasar tolak peluru adalah...", Options: o("Menolak peluru", "Melempar peluru", "Menendang peluru", "Memukul peluru"), Explanation: "Pushing not throwing."},
			{Text: "Elakan dan tangkisan adalah teknik beladiri...", Options: o("Pencak Silat", "Renang", "Sepak bola", "Voli"), Explanation: "Defensive moves."},
			{Text: "Back-up adalah latihan untuk melatih otot...", Options: o("Punggung", "Perut", "Kaki", "Tangan"), Explanation: "Otot punggung."},
			{Text: "Penyakit lmenular seksual (PMS) contohnya...", Options: o("HIV/AIDS, Sifilis", "Flu", "Demam berdarah", "Maag"), Explanation: "Penyakit seksual."},
			{Text: "Renang gaya bebas pengambilan napas dilakukan dengan...", Options: o("Menolehkan kepala ke samping", "Mengangkat kepala ke depan", "Di dalam air", "Terlentang"), Explanation: "Breathing."},
			{Text: "NAPZA singkatan dari...", Options: o("Narkotika, Psikotropika, dan Zat Adiktif", "Narkoba", "Obat terlarang", "Zat berbahaya"), Explanation: "Drugs."},
			{Text: "Permainan bulu tangkis dipimpin oleh...", Options: o("Wasit (Umpire)", "Juri", "Hakim garis", "Pelatih"), Explanation: "Referee."},
			{Text: "Pukulan keras menukik dalam bulu tangkis disebut...", Options: o("Smash", "Lob", "Dropshot", "Drive"), Explanation: "Smash."},
			{Text: "Senam lantai menggunakan alas berupa...", Options: o("Matras", "Karpet", "Rumput", "Lantai keramik"), Explanation: "Safety."},
			{Text: "Unsur kebugaran jasmani kelenturan disebut...", Options: o("Flexibility", "Strength", "Speed", "Power"), Explanation: "Lentur."},
			{Text: "Gerakan meroda adalah gerakan memutar badan ke...", Options: o("Samping", "Depan", "Belakang", "Bawah"), Explanation: "Cartwheel."},
			{Text: "Tenis meja menggunakan bola yang terbuat dari...", Options: o("Seluloid", "Karet", "Kulit", "Plastik keras"), Explanation: "Pingpong ball."},
			{Text: "Tujuan utama pengenalan air dalam renang adalah...", Options: o("Beradaptasi dengan air", "Langsung bisa gaya kupu-kupu", "Bermain", "Minum air"), Explanation: "Adaptasi."},
			{Text: "Jalan cepat: salah satu kaki harus selalu...", Options: o("Menyentuh tanah", "Melayang", "Ditekuk", "Lari"), Explanation: "Syarat jalan cepat."},
		},
	})
	// Grade 9
	quizzes = append(quizzes, SeedQuiz{
		SubjectCode: "PJOK", Grade: 9, Title: "PJOK Kelas IX",
		Questions: []SeedQuestion{
			{Text: "Tendangan penalti berjarak...", Options: o("11 meter", "12 meter", "10 meter", "5 meter"), Explanation: "12 pas (yard) approx 11m."},
			{Text: "Dalam voli, satu tim maksimal menyentuh bola sebanyak...", Options: o("3 kali", "2 kali", "4 kali", "1 kali"), Explanation: "3 touches."},
			{Text: "Lama permainan bola basket adalah...", Options: o("4 x 10 menit (FIBA)", "2 x 45 menit", "2 x 20 menit", "Tidak terbatas"), Explanation: "Quarter."},
			{Text: "Lompat jauh memiliki gaya, kecuali...", Options: o("Gaya dada", "Gaya jongkok", "Gaya menggantung", "Gaya berjalan di udara"), Explanation: "Gaya dada itu renang."},
			{Text: "Lempar cakram: alat berbentuk...", Options: o("Piringan", "Bola", "Tongkat", "Lembing"), Explanation: "Discus."},
			{Text: "Pencak silat: 4 aspek utama adalah...", Options: o("Mental spiritual, beladiri, seni, olahraga", "Fisik, teknik, taktik", "Kekuatan, kecepatan", "Pukulan, tendangan"), Explanation: "Filosofi silat."},
			{Text: "Tes kebugaran jasmani untuk mengukur daya tahan jantung paru adalah...", Options: o("Lari 2,4 km atau 12 menit", "Sprint 60m", "Pull up", "Sit up"), Explanation: "Cardio endurance."},
			{Text: "Aerobik artinya...", Options: o("Memerlukan oksigen", "Tanpa oksigen", "Cepat", "Kuat"), Explanation: "With oxygen."},
			{Text: "Renang gaya kupu-kupu disebut juga gaya...", Options: o("Dolfin", "Katak", "Batu", "Anjing"), Explanation: "Butterfly/Dolphin."},
			{Text: "Penyelamatan di air: korban panik sebaiknya didekati dari...", Options: o("Belakang", "Depan", "Atas", "Bawah"), Explanation: "Agar tidak ditenggelamkan korban."},
			{Text: "Bahaya merokok bagi perokok pasif adalah...", Options: o("Sama atau lebih berbahaya dari perokok aktif", "Tidak berbahaya", "Sehat", "Biasa saja"), Explanation: "Passive smoker."},
			{Text: "UU Narkotika di Indonesia adalah...", Options: o("UU No 35 Tahun 2009", "UU No 20 Tahun 2003", "UU 1945", "KUHP"), Explanation: "UU Narkotika."},
			{Text: "Permainan rounders mirip dengan...", Options: o("Kasti / Baseball", "Sepak bola", "Voli", "Basket"), Explanation: "Bola kecil."},
			{Text: "Lari maraton menempuh jarak...", Options: o("42,195 km", "10 km", "5 km", "21 km"), Explanation: "Full marathon."},
			{Text: "Cooling down (pendinginan) bermanfaat untuk...", Options: o("Mengembalikan kondisi tubuh & mengurangi asam laktat", "Membuat lelah", "Menambah beban", "Pemanasan"), Explanation: "Recovery."},
			{Text: "Posisi badan saat renang gaya bebas adalah...", Options: o("Telungkup/Sejajar permukaan air", "Telentang", "Tegak lurus", "Miring"), Explanation: "Streamline."},
			{Text: "Induk organisasi renang dunia...", Options: o("FINA", "FIFA", "IAAF", "BWF"), Explanation: "Aquatics."},
			{Text: "Gerakan meroda bertumpu pada...", Options: o("Kedua tangan", "Satu tangan", "Kepala", "Kaki"), Explanation: "Handstand bergulir."},
			{Text: "Circuit training adalah metode latihan...", Options: o("Berpos-pos", "Terus menerus", "Selingan", "Santai"), Explanation: "Sirkuit."},
			{Text: "Kesehatan pribadi meliputi...", Options: o("Kebersihan tubuh, pakaian, lingkungan", "Uang banyak", "Rumah mewah", "Mobil bagus"), Explanation: "Hygiene."},
		},
	})

	// --- 9. TIK (Informatika) ---
	// Grade 7
	quizzes = append(quizzes, SeedQuiz{
		SubjectCode: "TIK", Grade: 7, Title: "Informatika Kelas VII",
		Questions: []SeedQuestion{
			{Text: "Perangkat keras komputer disebut...", Options: o("Hardware", "Software", "Brainware", "Malware"), Explanation: "Hardware."},
			{Text: "Alat input komputer contohnya...", Options: o("Keyboard, Mouse", "Monitor", "Printer", "Speaker"), Explanation: "Masukan."},
			{Text: "Otak komputer adalah...", Options: o("CPU (Processor)", "RAM", "Harddisk", "VGA"), Explanation: "Central Processing Unit."},
			{Text: "Sistem operasi yang paling banyak digunakan di PC adalah...", Options: o("Windows", "Android", "iOS", "DOS"), Explanation: "Microsoft Windows."},
			{Text: "Tombol untuk menyalin (copy) adalah...", Options: o("Ctrl + C", "Ctrl + V", "Ctrl + X", "Ctrl + P"), Explanation: "Shortcut."},
			{Text: "Aplikasi pengolah kata adalah...", Options: o("Microsoft Word", "Excel", "PowerPoint", "Paint"), Explanation: "Word processor."},
			{Text: "Internet adalah singkatan dari...", Options: o("Interconnected Network", "International Network", "Internal Network", "Inter Network"), Explanation: "Jaringan dunia."},
			{Text: "Mesin pencari (Search Engine) terpopuler adalah...", Options: o("Google", "Yahoo", "Bing", "DuckDuckGo"), Explanation: "Google."},
			{Text: "Surel adalah singkatan dari...", Options: o("Surat Elektronik (Email)", "Surat Elang", "Super Rel", "Surat Kilat"), Explanation: "Email."},
			{Text: "Folder berfungsi untuk...", Options: o("Menyimpan dan mengelompokkan file", "Mengetik", "Menggambar", "Memutar musik"), Explanation: "Direktori."},
			{Text: "Tombol 'Caps Lock' berfungsi untuk...", Options: o("Membuat huruf kapital", "Menghapus", "Spasi", "Pindah baris"), Explanation: "Capital letters."},
			{Text: "Perangkat output yang menghasilkan suara adalah...", Options: o("Speaker", "Monitor", "Printer", "Scanner"), Explanation: "Speaker."},
			{Text: "Virus komputer adalah...", Options: o("Program jahat yang merusak", "Bakteri", "Debu", "Hardware rusak"), Explanation: "Malware."},
			{Text: "WWW singkatan dari...", Options: o("World Wide Web", "World Web Wide", "Web World Wide", "Wide World Web"), Explanation: "Web."},
			{Text: "Menekan tombol kiri mouse dua kali disebut...", Options: o("Double Click", "Click", "Drag", "Drop"), Explanation: "Klik ganda."},
			{Text: "Icon 'Save' biasanya bergambar...", Options: o("Disket", "Pintu", "Gunting", "Kertas"), Explanation: "Floppy disk symbol."},
			{Text: "Berpikir komputasional (Computational Thinking) meliputi...", Options: o("Dekomposisi, Pengenalan Pola, Abstraksi, Algoritma", "Membaca, Menulis", "Menghitung", "Menggambar"), Explanation: "4 fondasi CT."},
			{Text: "Algoritma adalah...", Options: o("Langkah-langkah penyelesaian masalah", "Bahasa pemrograman", "Robot", "Aplikasi"), Explanation: "Steps."},
			{Text: "Bilangan biner hanya terdiri dari angka...", Options: o("0 dan 1", "1 dan 2", "0 sampai 9", "1 sampai 10"), Explanation: "Binary."},
			{Text: "Etika digital melarang kita untuk...", Options: o("Menyebar hoax dan cyberbullying", "Berbagi ilmu", "Berteman online", "Belajar"), Explanation: "Netiquette."},
		},
	})
	// Grade 8
	quizzes = append(quizzes, SeedQuiz{
		SubjectCode: "TIK", Grade: 8, Title: "Informatika Kelas VIII",
		Questions: []SeedQuestion{
			{Text: "Jaringan komputer yang mencakup wilayah kecil (gedung/ruangan) disebut...", Options: o("LAN (Local Area Network)", "WAN", "MAN", "Internet"), Explanation: "Local."},
			{Text: "Media transmisi jaringan nirkabel (wireless) menggunakan...", Options: o("Gelombang radio", "Kabel fiber", "Kabel LAN", "Telepon"), Explanation: "Wi-Fi."},
			{Text: "Topologi jaringan berbentuk cincin disebut...", Options: o("Ring", "Star", "Bus", "Mesh"), Explanation: "Cincin."},
			{Text: "Aplikasi pengolah angka adalah...", Options: o("Microsoft Excel", "Word", "PowerPoint", "Access"), Explanation: "Spreadsheet."},
			{Text: "Rumus penjumlahan di Excel adalah...", Options: o("=SUM()", "=AVERAGE()", "=MAX()", "=MIN()"), Explanation: "Sum."},
			{Text: "Media sosial untuk berbagi foto dan video...", Options: o("Instagram", "WhatsApp", "Twitter", "Email"), Explanation: "IG."},
			{Text: "Cyberbullying artinya...", Options: o("Perundungan di dunia maya", "Bermain game", "Belajar online", "Belanja"), Explanation: "Bully online."},
			{Text: "Router berfungsi untuk...", Options: o("Menghubungkan jaringan yang berbeda/Mengarahkan paket data", "Menyimpan data", "Mencetak", "Mengetik"), Explanation: "Route packets."},
			{Text: "Ekstensi file gambar contohnya...", Options: o(".jpg, .png", ".doc", ".xls", ".mp3"), Explanation: "Image format."},
			{Text: "Perangkat lunak open source artinya...", Options: o("Kode sumbernya terbuka dan gratis dimodifikasi", "Berbayar mahal", "Tertutup", "Bajakan"), Explanation: "Open source."},
			{Text: "ISP singkatan dari...", Options: o("Internet Service Provider", "Internet Server Protocol", "Internal Service Provider", "International Service Protocol"), Explanation: "Penyedia jasa internet."},
			{Text: "Fungsi IF di Excel digunakan untuk...", Options: o("Logika percabangan", "Menjumlahkan", "Mencari rata-rata", "Mengurutkan"), Explanation: "Kondisional."},
			{Text: "Browser internet contohnya...", Options: o("Chrome, Firefox, Edge", "Windows", "Office", "Linux"), Explanation: "Peramban."},
			{Text: "Komputer Server bertugas...", Options: o("Melayani komputer Client", "Menggunakan layanan", "Menonton film", "Bermain game"), Explanation: "Server serves."},
			{Text: "Enkripsi data bertujuan untuk...", Options: o("Mengamankan data/sandi", "Menghapus data", "Membuka data", "Menyebarluaskan"), Explanation: "Security."},
			{Text: "Dampak negatif kecanduan game online...", Options: o("Lupa waktu dan kesehatan menurun", "Jadi pintar", "Dapat uang", "Sehat"), Explanation: "Addiction."},
			{Text: "Alat untuk melakukan presentasi...", Options: o("Proyektor LCD", "Scanner", "Printer", "Modem"), Explanation: "Tampilan besar."},
			{Text: "Ctrl + Z berfungsi untuk...", Options: o("Undo (Membatalkan perintah)", "Redo", "Cut", "Paste"), Explanation: "Undo."},
			{Text: "Microcontroller sederhana untuk belajar robotika...", Options: o("Arduino", "Pentium", "Windows", "Android"), Explanation: "Board mikrokontroler."},
			{Text: "Blog adalah...", Options: o("Jurnal/catatan web pribadi", "Toko online", "Bank", "Pemerintah"), Explanation: "Web log."},
		},
	})
	// Grade 9
	quizzes = append(quizzes, SeedQuiz{
		SubjectCode: "TIK", Grade: 9, Title: "Informatika Kelas IX",
		Questions: []SeedQuestion{
			{Text: "CMS adalah singkatan dari...", Options: o("Content Management System", "Computer Management System", "Center Management System", "Control Management System"), Explanation: "Contoh: WordPress."},
			{Text: "Bahasa pemrograman untuk membuat halaman web dasar adalah...", Options: o("HTML", "Python", "C++", "Java"), Explanation: "HyperText Markup Language."},
			{Text: "Tag HTML untuk membuat paragraf adalah...", Options: o("<p>", "<b>", "<i>", "<a>"), Explanation: "Paragraph."},
			{Text: "Cloud Computing (Komputasi Awan) artinya...", Options: o("Menyimpan dan memproses data di internet/server", "Komputer di awan", "Komputer terbang", "Komputer rusak"), Explanation: "Google Drive, dll."},
			{Text: "IoT (Internet of Things) adalah...", Options: o("Benda-benda yang terhubung ke internet", "Mainan robot", "Internet cepat", "HP baru"), Explanation: "Smart devices."},
			{Text: "Flowchart adalah...", Options: o("Diagram alir algoritma", "Gambar pemandangan", "Grafik statistik", "Peta"), Explanation: "Visual algoritma."},
			{Text: "Simbol belah ketupat pada flowchart menunjukkan...", Options: o("Decision/Keputusan", "Start/End", "Process", "Input/Output"), Explanation: "Percabangan."},
			{Text: "Big Data adalah...", Options: o("Kumpulan data yang sangat besar dan kompleks", "Data kecil", "Flashdisk", "Harddisk"), Explanation: "Volume, Velocity, Variety."},
			{Text: "E-Commerce adalah...", Options: o("Perdagangan elektronik/online", "Belajar online", "Surat elektronik", "Bank"), Explanation: "Tokopedia, Shopee."},
			{Text: "Hoax adalah...", Options: o("Berita bohong", "Berita benar", "Fakta", "Opini"), Explanation: "Fake news."},
			{Text: "Phishing adalah kejahatan siber berupa...", Options: o("Pencurian data dengan situs palsu", "Mancing ikan", "Membuat virus", "Merusak hardware"), Explanation: "Mencuri kredensial."},
			{Text: "UU ITE mengatur tentang...", Options: o("Informasi dan Transaksi Elektronik", "Lalu lintas", "Pendidikan", "Kesehatan"), Explanation: "Hukum siber."},
			{Text: "Fungsi VLOOKUP di Excel...", Options: o("Mencari data di tabel vertikal", "Tabel horizontal", "Menghitung", "Grafik"), Explanation: "Vertical Lookup."},
			{Text: "Resolusi gambar diukur dalam satuan...", Options: o("Pixel", "Byte", "Hertz", "Meter"), Explanation: "Picture element."},
			{Text: "Artificial Intelligence (AI) artinya...", Options: o("Kecerdasan Buatan", "Robot", "Internet", "Komputer"), Explanation: "AI."},
			{Text: "Contoh AI dalam kehidupan sehari-hari...", Options: o("Asisten virtual (Siri/Google), Rekomendasi YouTube", "Kalkulator biasa", "Mesin tik", "Lampu"), Explanation: "Smart applications."},
			{Text: "Inisialiasi variabel dalam pemrograman...", Options: o("Memberi nilai awal", "Menghapus", "Menampilkan", "Mencetak"), Explanation: "x = 0."},
			{Text: "Looping artinya...", Options: o("Perulangan", "Percabangan", "Keputusan", "Berhenti"), Explanation: "Loop."},
			{Text: "Tipe data untuk bilangan bulat adalah...", Options: o("Integer", "Float", "String", "Boolean"), Explanation: "Int."},
			{Text: "Gerbang logika AND bernilai benar jika...", Options: o("Semua input benar", "Salah satu benar", "Semua salah", "Tidak ada yang benar"), Explanation: "Logika AND."},
		},
	})

	// --- 10. SENI (Seni Budaya) ---
	// Grade 7
	quizzes = append(quizzes, SeedQuiz{
		SubjectCode: "SENI", Grade: 7, Title: "Seni Budaya Kelas VII",
		Questions: []SeedQuestion{
			{Text: "Unsur seni rupa yang terkecil adalah...", Options: o("Titik", "Garis", "Bidang", "Bentuk"), Explanation: "Point."},
			{Text: "Warna primer terdiri dari...", Options: o("Merah, Kuning, Biru", "Hijau, Ungu, Oranye", "Putih, Hitam", "Merah, Hijau, Biru"), Explanation: "RYB."},
			{Text: "Gambar yang melebih-lebihkan karakter disebut...", Options: o("Karikatur", "Kartun", "Realis", "Abstrak"), Explanation: "Melebihkan ciri khas."},
			{Text: "Seni rupa yang memiliki panjang, lebar, dan tinggi disebut...", Options: o("3 Dimensi", "2 Dimensi", "Murni", "Terapan"), Explanation: "3D memiliki volume."},
			{Text: "Batik adalah seni rupa...", Options: o("Terapan/Kriya", "Murni", "Mewah", "Modern"), Explanation: "Applied art."},
			{Text: "Alat untuk membatik disebut...", Options: o("Canting", "Kuas", "Pensil", "Pahat"), Explanation: "Canting tulis."},
			{Text: "Bernyanyi satu suara disebut...", Options: o("Unisono", "Paduan suara", "Kanon", "Akapela"), Explanation: "Satu melod."},
			{Text: "Lagu daerah 'Gundul-Gundul Pacul' berasal dari...", Options: o("Jawa Tengah", "Jawa Barat", "Papua", "Sumatera"), Explanation: "Jawa."},
			{Text: "Alat musik yang dimainkan dengan dipetik...", Options: o("Gitar", "Piano", "Suling", "Drum"), Explanation: "Petik."},
			{Text: "Tari Saman berasal dari...", Options: o("Aceh", "Bali", "Jawa", "Kalimantan"), Explanation: "Rateb Meuseukat."},
			{Text: "Level gerak tari ada tiga, yaitu...", Options: o("Tinggi, Sedang, Rendah", "Cepat, Lambat, Sedang", "Kiri, Kanan, Atas", "Maju, Mundur, Diam"), Explanation: "Level."},
			{Text: "Pola lantai adalah...", Options: o("Garis yang dilalui penari", "Lantai panggung", "Hiasan lantai", "Baju penari"), Explanation: "Formasi."},
			{Text: "Keunikan Tari Kecak adalah...", Options: o("Tidak memakai musik alat, tapi suara mulut 'cak'", "Memakai topeng", "Penari wanita semua", "Diam saja"), Explanation: "Musik vokal."},
			{Text: "Teater tradisional dari Jawa Timur...", Options: o("Ludruk", "Lenong", "Ketoprak", "Randai"), Explanation: "Ludruk."},
			{Text: "Wayang kulit terbuat dari...", Options: o("Kulit kerbau/sapi", "Kertas", "Plastik", "Kain"), Explanation: "Kulit."},
			{Text: "Fungsi musik dalam tari...", Options: o("Pengiring dan pemberi suasana", "Pengganggu", "Hiasan", "Penonton"), Explanation: "Accompaniment."},
			{Text: "Ragam hias flora bermotif...", Options: o("Tumbuhan", "Hewan", "Manusia", "Geometris"), Explanation: "Floral."},
			{Text: "Gambar ilustrasi berfungsi untuk...", Options: o("Memperjelas cerita", "Menutupi tulisan", "Memenuhi kertas", "Mahal"), Explanation: "Ilustrasi."},
			{Text: "Warna hijau diperoleh dari campuran...", Options: o("Biru dan Kuning", "Merah dan Kuning", "Merah dan Biru", "Hitam dan Putih"), Explanation: "Sekunder."},
			{Text: "Seni teater mengutamakan...", Options: o("Akting/Peran", "Suara", "Gerak", "Rupa"), Explanation: "Seni peran."},
		},
	})
	// Grade 8
	quizzes = append(quizzes, SeedQuiz{
		SubjectCode: "SENI", Grade: 8, Title: "Seni Budaya Kelas VIII",
		Questions: []SeedQuestion{
			{Text: "Menggambar model berarti...", Options: o("Menggambar dengan melihat objek langsung", "Menggambar imajinasi", "Menggambar abstrak", "Menggambar foto"), Explanation: "Live model."},
			{Text: "Proporsi adalah...", Options: o("Perbandingan ukuran yang ideal", "Keseimbangan", "Kesatuan", "Irama"), Explanation: "Perbandingan."},
			{Text: "Gambar ilustrasi karikatur bersifat...", Options: o("Sindiran/Kritikan", "Lucu", "Nyata", "Menakutkan"), Explanation: "Satire."},
			{Text: "Musik tradisional gamelan didominasi alat musik...", Options: o("Perkusi (Pukul)", "Tiup", "Gesek", "Petik"), Explanation: "Gong, saron, bonang."},
			{Text: "Lagu 'Yamko Rambe Yamko' berasal dari...", Options: o("Papua", "Maluku", "Sulawesi", "NTT"), Explanation: "Papua."},
			{Text: "Menyanyi dengan nada tepat disebut...", Options: o("Intonasi", "Artikulasi", "Phrasering", "Resonansi"), Explanation: "Pitch accuracy."},
			{Text: "Pernapasan terbaik untuk menyanyi adalah...", Options: o("Diafragma", "Dada", "Bahu", "Hidung"), Explanation: "Diaphragm."},
			{Text: "Tari berpasangan ditarikan oleh...", Options: o("2 orang", "1 orang", "Banyak orang", "3 orang"), Explanation: "Duet."},
			{Text: "Properti tari piring adalah...", Options: o("Piring", "Kipas", "Selendang", "Topeng"), Explanation: "Piring."},
			{Text: "Pantomim adalah seni peran...", Options: o("Tanpa kata-kata (Bisu)", "Banyak dialog", "Menyanyi", "Menari"), Explanation: "Mime."},
			{Text: "Poster adalah karya seni untuk...", Options: o("Menyampaikan informasi/ajakan", "Hiasan", "Lukisan", "Bungkus"), Explanation: "Publikasi."},
			{Text: "Komik adalah...", Options: o("Cerita bergambar", "Novel", "Puisi", "Lagu"), Explanation: "Sequential art."},
			{Text: "Alat musik angklung berasal dari...", Options: o("Jawa Barat", "Jawa Tengah", "Bali", "Madura"), Explanation: "Sunda."},
			{Text: "Angklung terbuat dari...", Options: o("Bambu", "Kayu", "Logam", "Plastik"), Explanation: "Bambu."},
			{Text: "Alat musik Sasando dimainkan dengan...", Options: o("Dipetik", "Ditiup", "Dipukul", "Digesek"), Explanation: "Rote."},
			{Text: "Iringan tari internal berasal dari...", Options: o("Tubuh penari (Tepukan, Hentakan, Suara)", "Tape recorder", "Gamelan", "Band"), Explanation: "Internal."},
			{Text: "Panggung prosenium adalah...", Options: o("Panggung bingkai (hanya satu arah pandang)", "Arena", "Thrust", "Terbuka"), Explanation: "Proscenium arch."},
			{Text: "Tugas sutradara adalah...", Options: o("Mengatur jalannya pementasan", "Menjual tiket", "Menata lampu", "Menjadi aktor"), Explanation: "Director."},
			{Text: "Batik teknik ikat celup disebut...", Options: o("Jumputan/Tie Dye", "Tulis", "Cap", "Printing"), Explanation: "Ikat celup."},
			{Text: "Patung termasuk seni rupa...", Options: o("3 Dimensi", "2 Dimensi", "Terapan", "Desain"), Explanation: "Patung."},
		},
	})
	// Grade 9
	quizzes = append(quizzes, SeedQuiz{
		SubjectCode: "SENI", Grade: 9, Title: "Seni Budaya Kelas IX",
		Questions: []SeedQuestion{
			{Text: "Seni lukis adalah pengembangan dari...", Options: o("Menggambar", "Mematung", "Mencetak", "Menulis"), Explanation: "Painting."},
			{Text: "Aliran lukisan yang menggambarkan alam apa adanya...", Options: o("Naturalisme", "Realisme", "Romantisme", "Abstrak"), Explanation: "Nature."},
			{Text: "Pelukis Affandi beraliran...", Options: o("Ekspresionisme", "Naturalisme", "Kubisme", "Suraalisme"), Explanation: "Ekspresif."},
			{Text: "Patung monumen berfungsi untuk...", Options: o("Mengenang jasa pahlawan/peristiwa", "Hiasan taman", "Keagamaan", "Mainan"), Explanation: "Memorial."},
			{Text: "Seni grafis adalah seni rupa teknik...", Options: o("Cetak", "Lukis", "Pahat", "Butsir"), Explanation: "Printmaking."},
			{Text: "Teknik cetak saring disebut juga...", Options: o("Sablon", "Stempel", "Ukiran", "Foto"), Explanation: "Screen printing."},
			{Text: "Pameran di sekolah bermanfaat untuk...", Options: o("Melatih apresiasi dan organisasi", "Pamer", "Jualan", "Bolos"), Explanation: "Edukasi."},
			{Text: "Musik populer / Pop bersifat...", Options: o("Mudah diterima masyarakat & komersial", "Rumit", "Istana", "Sakral"), Explanation: "Populer."},
			{Text: "Penyanyi solo menyanyi...", Options: o("Sendirian", "Berdua", "Bertiga", "Ramai-ramai"), Explanation: "Solo."},
			{Text: "Improvisasi dalam bernyanyi artinya...", Options: o("Melakukan variasi nada spontan", "Lupa lirik", "Diam", "Salah nada"), Explanation: "Variasi."},
			{Text: "Tari kreasi baru adalah...", Options: o("Pengembangan dari tari tradisi", "Tari asing", "Tari purba", "Senam"), Explanation: "Modernisasi tradisi."},
			{Text: "Tari Kontemporer bersifat...", Options: o("Bebas dan kekinian", "Kaku", "Kuno", "Baku"), Explanation: "Bebas."},
			{Text: "Unsur pendukung tari...", Options: o("Tata rias, busana, musik, panggung", "Penonton", "Tiket", "Makanan"), Explanation: "Stagecraft."},
			{Text: "Manajemen pertunjukan bertugas...", Options: o("Merencanakan dan mengelola acara", "Menari", "Menyanyi", "Menonton"), Explanation: "Organizing."},
			{Text: "Teater modern Indonesia dipengaruhi oleh...", Options: o("Teater Barat", "Teater Tradisi", "Wayang", "Lenong"), Explanation: "Western influence."},
			{Text: "Naskah drama disebut...", Options: o("Skenario", "Sinopsis", "Proposal", "Laporan"), Explanation: "Script."},
			{Text: "Merancang pementasan teater dimulai dari...", Options: o("Menentukan naskah/tema", "Latihan", "Pentas", "Bubaran"), Explanation: "Perencanaan."},
			{Text: "Kritik seni bertujuan untuk...", Options: o("Mengevaluasi dan meningkatkan kualitas karya", "Menghina", "Menjatuhkan", "Memuji saja"), Explanation: "Kritik membangun."},
			{Text: "Vokal grup terdiri dari...", Options: o("3-10 orang", "1 orang", "50 orang", "20 orang"), Explanation: "Kelompok kecil."},
			{Text: "Lagu Jazz identik dengan...", Options: o("Improvisasi dan sinkopasi", "Distorsi", "Dangdut", "Teriakan"), Explanation: "Ciri Jazz."},
		},
	})

	return quizzes
}
