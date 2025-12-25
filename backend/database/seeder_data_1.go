package database

func GetSeedDataPart1() []SeedQuiz {
	var quizzes []SeedQuiz

	// --- 1. PAI (Pendidikan Agama Islam) ---
	// Grade 7
	quizzes = append(quizzes, SeedQuiz{
		SubjectCode: "PAI", Grade: 7, Title: "Pendidikan Agama Islam Kelas VII",
		Questions: []SeedQuestion{
			{Text: "Sifat wajib bagi Allah yang artinya Maha Esa adalah...", Options: o("Wahdaniyah", "Qudrat", "Iradat", "Ilmu"), Explanation: "Wahdaniyah artinya Maha Esa."},
			{Text: "Malaikat yang bertugas membagi rezeki adalah...", Options: o("Mikail", "Jibril", "Israfil", "Izrail"), Explanation: "Malaikat Mikail bertugas membagi rezeki."},
			{Text: "Shalat yang dilakukan untuk meminta hujan disebut...", Options: o("Istisqa", "Istikharah", "Tahajud", "Dhuha"), Explanation: "Shalat Istisqa adalah shalat sunnah untuk memohon hujan."},
			{Text: "Kitab suci yang diturunkan kepada Nabi Daud a.s. adalah...", Options: o("Zabur", "Taurat", "Injil", "Al-Qur'an"), Explanation: "Zabur diturunkan kepada Nabi Daud a.s."},
			{Text: "Nabi yang mendapat gelar Khalilullah adalah...", Options: o("Ibrahim a.s.", "Musa a.s.", "Isa a.s.", "Muhammad saw."), Explanation: "Nabi Ibrahim a.s. mendapat gelar Khalilullah (Kekasih Allah)."},
			{Text: "Hari kiamat disebut juga Yaumul Ba'ats yang artinya...", Options: o("Hari Kebangkitan", "Hari Perhitungan", "Hari Pembalasan", "Hari Pertimbangan"), Explanation: "Yaumul Ba'ats artinya Hari Kebangkitan dari kubur."},
			{Text: "Rukun Islam yang ke-5 adalah...", Options: o("Haji", "Syahadat", "Shalat", "Puasa"), Explanation: "Rukun Islam ke-5 adalah menunaikan ibadah Haji bagi yang mampu."},
			{Text: "Surah Al-Fatihah terdiri dari berapa ayat?", Options: o("7", "5", "6", "8"), Explanation: "Surah Al-Fatihah terdiri dari 7 ayat."},
			{Text: "Orang yang berhijrah dari Mekah ke Madinah disebut...", Options: o("Kaum Muhajirin", "Kaum Anshar", "Kaum Quraisy", "Kaum Musyrikin"), Explanation: "Kaum Muhajirin adalah orang-orang yang berhijrah."},
			{Text: "Puasa sunnah yang dilaksanakan pada tanggal 9 Dzulhijjah disebut...", Options: o("Puasa Arafah", "Puasa Syawal", "Puasa Senin Kamis", "Puasa Daud"), Explanation: "Puasa Arafah dilaksanakan pada 9 Dzulhijjah."},
			{Text: "Allah Maha Mendengar adalah arti dari Asmaul Husna...", Options: o("As-Sami'", "Al-Basir", "Al-Alim", "Al-Khabir"), Explanation: "As-Sami' artinya Maha Mendengar."},
			{Text: "Najis yang cara menyucikannya harus dibasuh 7 kali, salah satunya dengan tanah disebut najis...", Options: o("Mughallazah", "Mukhaffafah", "Mutawassitah", "Ma'fu"), Explanation: "Najis Mughallazah (berat) contohnya air liur anjing."},
			{Text: "Hukum bacaan Nun mati bertemu huruf Ba disebut...", Options: o("Iqlab", "Izhar", "Idgham", "Ikhfa"), Explanation: "Iqlab adalah menukar bunyi Nun mati menjadi Mim mati."},
			{Text: "Peristiwa turunnya Al-Qur'an pertama kali disebut...", Options: o("Nuzulul Qur'an", "Isra Mi'raj", "Maulid Nabi", "Hijrah"), Explanation: "Nuzulul Qur'an adalah peristiwa turunnya Al-Qur'an."},
			{Text: "Adzan adalah panggilan untuk...", Options: o("Shalat", "Puasa", "Haji", "Zakat"), Explanation: "Adzan adalah panggilan untuk melaksanakan shalat."},
			{Text: "Masjid pertama yang dibangun Nabi Muhammad saw. adalah...", Options: o("Masjid Quba", "Masjid Nabawi", "Masjidil Haram", "Masjidil Aqsa"), Explanation: "Masjid Quba adalah masjid pertama yang dibangun Rasulullah."},
			{Text: "Istri Nabi Muhammad saw. yang pertama adalah...", Options: o("Khadijah", "Aisyah", "Fatimah", "Hafsah"), Explanation: "Siti Khadijah adalah istri pertama Nabi Muhammad saw."},
			{Text: "Arti dari kata 'Al-Amin' yang disematkan pada Nabi Muhammad adalah...", Options: o("Terpercaya", "Cerdas", "Jujur", "Menyampaikan"), Explanation: "Al-Amin artinya orang yang dapat dipercaya."},
			{Text: "Malaikat yang bertugas meniup sangkakala adalah...", Options: o("Israfil", "Mikail", "Jibril", "Munkar"), Explanation: "Malaikat Israfil bertugas meniup sangkakala pada hari kiamat."},
			{Text: "Surah pendek yang menceritakan tentang pasukan gajah adalah...", Options: o("Al-Fil", "Al-Kautsar", "Al-Ma'un", "Al-Lahab"), Explanation: "Al-Fil artinya Gajah."},
		},
	})
	// Grade 8
	quizzes = append(quizzes, SeedQuiz{
		SubjectCode: "PAI", Grade: 8, Title: "Pendidikan Agama Islam Kelas VIII",
		Questions: []SeedQuestion{
			{Text: "Iman kepada Kitab Allah adalah rukun iman ke...", Options: o("3", "2", "4", "1"), Explanation: "Rukun iman ke-3."},
			{Text: "Rasul Ulul Azmi berjumlah...", Options: o("5", "4", "25", "10"), Explanation: "Ada 5 Rasul Ulul Azmi: Nuh, Ibrahim, Musa, Isa, Muhammad."},
			{Text: "Sifat jaiz bagi Rasul adalah...", Options: o("A'radhul Basyariyah", "Siddiq", "Amanah", "Fathonah"), Explanation: "Sifat kemanusiaan seperti makan, minum, tidur."},
			{Text: "Hukum memakan bangkai ikan dan belalang adalah...", Options: o("Halal", "Haram", "Makruh", "Syubhat"), Explanation: "Bangkai ikan dan belalang dikecualikan dan halal dimakan."},
			{Text: "Minuman keras dalam Islam hukumnya...", Options: o("Haram", "Makruh", "Mubah", "Sunnah"), Explanation: "Khamr atau minuman keras hukumnya haram."},
			{Text: "Salat sunah yang dikerjakan mengiringi salat fardu disebut...", Options: o("Rawatib", "Dhuha", "Tahajud", "Hajat"), Explanation: "Salat Rawatib dikerjakan sebelum/sesudah salat fardu."},
			{Text: "Sujud yang dilakukan karena lupa dalam salat disebut...", Options: o("Sahwi", "Syukur", "Tilawah", "Rukun"), Explanation: "Sujud Sahwi dilakukan ketika lupa rakaat atau rukun."},
			{Text: "Zakat fitrah yang wajib dikeluarkan tiap jiwa adalah...", Options: o("2,5 kg beras", "3,5 liter beras", "10 kg beras", "Uang seikhlasnya"), Explanation: "Umumnya 2,5 kg atau 3,5 liter makanan pokok."},
			{Text: "Khalifah pertama setelah wafatnya Rasulullah adalah...", Options: o("Abu Bakar Ash-Shiddiq", "Umar bin Khattab", "Utsman bin Affan", "Ali bin Abi Thalib"), Explanation: "Abu Bakar adalah Khulafaur Rasyidin pertama."},
			{Text: "Sikap Qana'ah artinya...", Options: o("Merasa cukup", "Putus asa", "Sombong", "Serakah"), Explanation: "Qana'ah adalah sikap merasa cukup atas rezeki Allah."},
			{Text: "Ayat kursi terdapat dalam surah...", Options: o("Al-Baqarah", "Ali Imran", "An-Nisa", "Al-Maidah"), Explanation: "Ayat Kursi adalah ayat 255 Surah Al-Baqarah."},
			{Text: "Tajwid: Iqlaq kubra terjadi jika huruf qalqalah berada di...", Options: o("Akhir kalimat/waqaf", "Tengah kalimat", "Awal kalimat", "Bertemu nun mati"), Explanation: "Qalqalah kubra terjadi saat huruf qalqalah matinya diwaqafkan."},
			{Text: "Hari raya Idul Adha jatuh pada tanggal...", Options: o("10 Dzulhijjah", "1 Syawal", "1 Muharram", "12 Rabiul Awal"), Explanation: "Idul Adha pada 10 Dzulhijjah."},
			{Text: "Ibadah haji dilaksanakan di kota...", Options: o("Mekah", "Madinah", "Jeddah", "Riyadh"), Explanation: "Haji dilaksanakan di tanah suci Mekah."},
			{Text: "Sikap Tasamuh artinya...", Options: o("Toleransi", "Adil", "Jujur", "Disiplin"), Explanation: "Tasamuh berarti toleransi atau tenggang rasa."},
			{Text: "Malaikat Munkar dan Nakir bertugas...", Options: o("Menanyai di alam kubur", "Mencatat amal baik", "Mencatat amal buruk", "Menjaga neraka"), Explanation: "Munkar & Nakir menanyai manusia di alam barzah."},
			{Text: "Ilmu yang mempelajari tata cara membaca Al-Qur'an disebut...", Options: o("Tajwid", "Fiqih", "Tauhid", "Tasawuf"), Explanation: "Ilmu Tajwid."},
			{Text: "Hukum bacaan Alif Lam Syamsiyah ditandai dengan...", Options: o("Alif lam tidak dibaca/lebur", "Alif lam dibaca jelas", "Ada nun mati", "Ada mim mati"), Explanation: "Alif lam lebur ke huruf berikutnya (tasydid)."},
			{Text: "Nabi yang memiliki mukjizat membelah lautan adalah...", Options: o("Musa a.s.", "Isa a.s.", "Ibrahim a.s.", "Nuh a.s."), Explanation: "Nabi Musa a.s. membelah Laut Merah."},
			{Text: "Kitab Injil diturunkan kepada...", Options: o("Isa a.s.", "Musa a.s.", "Daud a.s.", "Muhammad saw."), Explanation: "Kitab Injil kepada Nabi Isa a.s."},
		},
	})
	// Grade 9
	quizzes = append(quizzes, SeedQuiz{
		SubjectCode: "PAI", Grade: 9, Title: "Pendidikan Agama Islam Kelas IX",
		Questions: []SeedQuestion{
			{Text: "Hari Akhir disebut juga...", Options: o("Yaumul Akhir", "Yaumul Awal", "Yaumul Milad", "Yaumul Bid'ah"), Explanation: "Yaumul Akhir adalah Hari Kiamat."},
			{Text: "Pengadilan Allah di akhirat sangat adil, disebut...", Options: o("Yaumul Hisab", "Yaumul Ba'ats", "Yaumul Mahsyar", "Yaumul Jaza"), Explanation: "Yaumul Hisab adalah hari perhitungan amal."},
			{Text: "Takdir yang tidak dapat diubah disebut...", Options: o("Takdir Mubram", "Takdir Muallaq", "Nasib", "Kehendak"), Explanation: "Takdir Mubram adalah ketentuan mutlak (mati, jodoh)."},
			{Text: "Takdir yang erat kaitannya dengan usaha manusia disebut...", Options: o("Takdir Muallaq", "Takdir Mubram", "Qadha", "Qadar"), Explanation: "Takdir Muallaq bisa berubah dengan ikhtiar & doa."},
			{Text: "Zakat Mal disebut juga zakat...", Options: o("Harta", "Jiwa", "Fitrah", "Profesi"), Explanation: "Zakat Mal adalah zakat harta benda."},
			{Text: "Nishab zakat emas adalah...", Options: o("85 gram", "93 gram", "100 gram", "50 gram"), Explanation: "Nishab emas adalah setara 85 gram emas murni."},
			{Text: "Wukuf di Padang Arafah dilaksanakan pada tanggal...", Options: o("9 Dzulhijjah", "10 Dzulhijjah", "8 Dzulhijjah", "11 Dzulhijjah"), Explanation: "Wukuf adalah puncak haji pada 9 Dzulhijjah."},
			{Text: "Kerajaan Islam pertama di Indonesia adalah...", Options: o("Samudera Pasai", "Mataram Islam", "Demak", "Ternate"), Explanation: "Samudera Pasai di Aceh (abad ke-13)."},
			{Text: "Sunan Kalijaga menyebarkan Islam menggunakan media...", Options: o("Wayang Kulit", "Gamelan", "Lukisan", "Tari"), Explanation: "Wayang kulit digunakan sebagai media dakwah."},
			{Text: "Sikap optimis termasuk akhlak...", Options: o("Mahmudah", "Mazmumah", "Qabihah", "Sayyiah"), Explanation: "Akhlak Mahmudah (terpuji)."},
			{Text: "Lawan kata jujur adalah...", Options: o("Kizib/Dusta", "Khianat", "Sombong", "Riya"), Explanation: "Kizib artinya berdusta."},
			{Text: "Menyembelih hewan akikah untuk anak laki-laki sebanyak...", Options: o("2 ekor kambing", "1 ekor kambing", "1 ekor sapi", "2 ekor sapi"), Explanation: "Sunnahnya 2 ekor kambing untuk laki-laki, 1 untuk perempuan."},
			{Text: "Hukum bacaan Mad Thobi'i dibaca sepanjang...", Options: o("2 harakat", "4 harakat", "5 harakat", "6 harakat"), Explanation: "Mad Thobi'i dibaca 2 harakat (1 alif)."},
			{Text: "Surah Al-Hujurat ayat 13 menjelaskan tentang...", Options: o("Toleransi & Keragaman", "Perintah Shalat", "Larangan Zina", "Puasa Ramadhan"), Explanation: "Manusia diciptakan bersuku-suku untuk saling mengenal."},
			{Text: "Wakaf artinya...", Options: o("Menahan harta untuk kepentingan umat", "Memberi sedekah", "Membayar pajak", "Meminjamkan barang"), Explanation: "Wakaf adalah menahan harta yang diambil manfaatnya."},
			{Text: "Tradisi Islam 'Halal Bihalal' biasanya dilakukan saat...", Options: o("Idul Fitri", "Idul Adha", "Maulid Nabi", "Tahun Baru Hijriyah"), Explanation: "Momentum saling memaafkan di Indonesia."},
			{Text: "Imam Mazhab dalam Fiqih ada 4, kecuali...", Options: o("Imam Ghazali", "Imam Syafi'i", "Imam Hanafi", "Imam Maliki"), Explanation: "Imam Ghazali adalah tokoh Tasawuf/Filsafat, bukan pendiri 4 mazhab utama fiqih."},
			{Text: "Perintah berkurban turun pada kisah Nabi...", Options: o("Ibrahim a.s.", "Musa a.s.", "Nuh a.s.", "Adam a.s."), Explanation: "Kisah penyembelihan Ismail oleh Ibrahim."},
			{Text: "Arti 'Iqra' pada wahyu pertama adalah...", Options: o("Bacalah", "Tulislah", "Dengarlah", "Lihatlah"), Explanation: "Iqra artinya Bacalah."},
			{Text: "Asmaul Husna Al-Hakim artinya...", Options: o("Maha Bijaksana", "Maha Mengetahui", "Maha Perkasa", "Maha Adil"), Explanation: "Al-Hakim artinya Maha Bijaksana."},
		},
	})

	// --- 2. PPKN (Pendidikan Pancasila) ---
	// Grade 7
	quizzes = append(quizzes, SeedQuiz{
		SubjectCode: "PPKN", Grade: 7, Title: "Pendidikan Pancasila Kelas VII",
		Questions: []SeedQuestion{
			{Text: "Tanggal lahirnya Pancasila adalah...", Options: o("1 Juni 1945", "17 Agustus 1945", "18 Agustus 1945", "29 Mei 1945"), Explanation: "Pidato Soekarno pada 1 Juni 1945."},
			{Text: "BPUPKI dibentuk oleh pemerintah...", Options: o("Jepang", "Belanda", "Inggris", "Indonesia"), Explanation: "Dibentuk Jepang (Dokuritsu Junbi Cosakai)."},
			{Text: "Ketua BPUPKI adalah...", Options: o("Dr. K.R.T. Radjiman Wedyodiningrat", "Ir. Soekarno", "Moh. Hatta", "Muh. Yamin"), Explanation: "Dr. Radjiman adalah ketua BPUPKI."},
			{Text: "Sila pertama Pancasila berbunyi...", Options: o("Ketuhanan Yang Maha Esa", "Kemanusiaan yang adil dan beradab", "Persatuan Indonesia", "Keadilan sosial"), Explanation: "Bunyi sila ke-1."},
			{Text: "Lambang sila ke-3 Persatuan Indonesia adalah...", Options: o("Pohon Beringin", "Bintang", "Rantai", "Kepala Banteng"), Explanation: "Pohon Beringin melambangkan persatuan."},
			{Text: "Norma yang bersumber dari hati nurani manusia disebut...", Options: o("Norma Kesusilaan", "Norma Kesopanan", "Norma Agama", "Norma Hukum"), Explanation: "Norma Kesusilaan berasal dari hati nurani."},
			{Text: "Hukum dasar tertulis di Indonesia adalah...", Options: o("UUD 1945", "Pancasila", "Tap MPR", "Perpres"), Explanation: "UUD 1945 adalah konstitusi tertulis."},
			{Text: "Bhinneka Tunggal Ika artinya...", Options: o("Berbeda-beda tetapi tetap satu jua", "Bersatu kita teguh", "Maju terus pantang mundur", "Merdeka atau mati"), Explanation: "Semboyan negara Indoneisa."},
			{Text: "Sikap menghargai pendirian orang lain yang berbeda disebut...", Options: o("Toleransi", "Egoisme", "Fanatisme", "Individualisme"), Explanation: "Toleransi adalah kunci keberagaman."},
			{Text: "Gotong royong merupakan pengamalan Pancasila sila ke...", Options: o("5", "4", "3", "2"), Explanation: "Keadilan sosial dan kebersamaan (Sila 5, tapi sering dikaitkan dg sila 3/5. Konteks umum Sila 5: Keadilan Sosial / Gotong Royong Ekaselanya)."},
			{Text: "Panitia Sembilan berhasil merumuskan...", Options: o("Piagam Jakarta", "UUD 1945", "Teks Proklamasi", "Dekrit Presiden"), Explanation: "Piagam Jakarta (Jakarta Charter)."},
			{Text: "Jumlah bulu pada sayap Garuda Pancasila adalah...", Options: o("17", "8", "45", "19"), Explanation: "17 melambangkan tanggal kemerdekaan."},
			{Text: "Pasal 1 ayat 1 UUD 1945 menyatakan Indonesia adalah negara...", Options: o("Kesatuan", "Serikat", "Monarki", "Komunis"), Explanation: "Negara Kesatuan yang berbentuk Republik."},
			{Text: "Lagu kebangsaan Indonesia Raya diciptakan oleh...", Options: o("W.R. Supratman", "Ismail Marzuki", "C. Simanjuntak", "H. Mutahar"), Explanation: "Wage Rudolf Supratman."},
			{Text: "Hak asasi manusia adalah hak yang...", Options: o("Dimiliki manusia sejak lahir", "Diberikan pemerintah", "Dibeli dengan uang", "Didapat setelah dewasa"), Explanation: "Hak dasar anugerah Tuhan."},
			{Text: "Kewajiban utama seorang pelajar adalah...", Options: o("Belajar", "Bekerja", "Bermain", "Demonstrasi"), Explanation: "Tugas pelajar adalah belajar."},
			{Text: "Provinsi paling barat di Indonesia adalah...", Options: o("Aceh", "Sumatera Utara", "Papua", "Bali"), Explanation: "Aceh (Sabang)."},
			{Text: "Lembaga legislatif di Indonesia adalah...", Options: o("DPR", "Presiden", "MA", "KPK"), Explanation: "DPR (Dewan Perwakilan Rakyat)."},
			{Text: "Warna merah pada bendera Indonesia melambangkan...", Options: o("Keberanian", "Kesucian", "Kemakmuran", "Kesedihan"), Explanation: "Merah berarti berani."},
			{Text: "Sumpah Pemuda diikrarkan pada tanggal...", Options: o("28 Oktober 1928", "17 Agustus 1945", "10 November 1945", "2 Mei 1908"), Explanation: "28 Oktober adalah Hari Sumpah Pemuda."},
		},
	})
	// Grade 8
	quizzes = append(quizzes, SeedQuiz{
		SubjectCode: "PPKN", Grade: 8, Title: "Pendidikan Pancasila Kelas VIII",
		Questions: []SeedQuestion{
			{Text: "Pancasila sebagai dasar negara berfungsi sebagai...", Options: o("Sumber dari segala sumber hukum", "Simbol negara semata", "Alat kekuasaan", "Hiasan dinding"), Explanation: "Dasar negara dan sumber hukum."},
			{Text: "Amandemen UUD 1945 telah dilakukan sebanyak...", Options: o("4 kali", "2 kali", "3 kali", "5 kali"), Explanation: "Amandemen dilakukan 4 kali (1999-2002)."},
			{Text: "Hari Kebangkitan Nasional diperingati setiap...", Options: o("20 Mei", "28 Oktober", "10 November", "1 Juni"), Explanation: "Berdirinya Budi Utomo."},
			{Text: "Organisasi pergerakan nasional pertama adalah...", Options: o("Budi Utomo", "Sarekat Islam", "Indische Partij", "PNI"), Explanation: "Budi Utomo (1908)."},
			{Text: "Tiga tokoh yang mengusulkan dasar negara adalah...", Options: o("Yamin, Soepomo, Soekarno", "Hatta, Sjahrir, Tan Malaka", "Kartini, Dewi Sartika, Cut Nyak Dien", "Soeharto, Habibie, Gus Dur"), Explanation: "Dalam sidang BPUPKI."},
			{Text: "Peraturan Perundang-undangan tertinggi di Indonesia adalah...", Options: o("UUD 1945", "UU", "Tap MPR", "Perda"), Explanation: "UUD 1945."},
			{Text: "Kedaulatan berada di tangan rakyat dan dilaksanakan menurut UUD. Ini bunyi pasal...", Options: o("1 ayat 2", "1 ayat 1", "1 ayat 3", "2 ayat 1"), Explanation: "Pasal 1 ayat 2 UUD 1945."},
			{Text: "Sikap rela berkorban demi bangsa dan negara disebut...", Options: o("Patriotisme", "Nasionalisme", "Chauvinisme", "Liberalisme"), Explanation: "Patriotisme."},
			{Text: "Lambang sila ke-4 adalah...", Options: o("Kepala Banteng", "Pohon Beringin", "Bintang", "Rantai"), Explanation: "Kepala Banteng."},
			{Text: "Contoh pengamalan sila ke-2 di sekolah...", Options: o("Menolong teman yang sakit", "Berdoa sebelum belajar", "Mengikuti upacara", "Memilih ketua kelas"), Explanation: "Kemanusiaan: gemar menolong."},
			{Text: "Sistem pemerintahan Indonesia adalah...", Options: o("Presidensial", "Parlementer", "Monarki", "Komunis"), Explanation: "Sistem Presidensial."},
			{Text: "Lembaga yang berwenang melantik Presiden adalah...", Options: o("MPR", "DPR", "Mahkamah Agung", "KPU"), Explanation: "MPR melantik Presiden."},
			{Text: "Usia minimal untuk memilih dalam pemilu adalah...", Options: o("17 tahun / sudah menikah", "19 tahun", "21 tahun", "15 tahun"), Explanation: "17 tahun atau sudah kawin."},
			{Text: "Kabinet pertama RI dipimpin oleh...", Options: o("Ir. Soekarno", "Moh. Hatta", "Sutan Sjahrir", "Amir Sjarifuddin"), Explanation: "Kabinet Presidensial Soekarno."},
			{Text: "Dekrit Presiden dikeluarkan pada...", Options: o("5 Juli 1959", "11 Maret 1966", "17 Agustus 1950", "30 September 1965"), Explanation: "Kembali ke UUD 1945."},
			{Text: "Sikap menempatkan kepentingan bangsa di atas kepentingan pribadi adalah pengamalan sila...", Options: o("Ke-3", "Ke-4", "Ke-2", "Ke-1"), Explanation: "Persatuan Indonesia."},
			{Text: "Ibu kota provinsi Jawa Timur adalah...", Options: o("Surabaya", "Malang", "Semarang", "Yogyakarta"), Explanation: "Surabaya."},
			{Text: "Tokoh proklamator Indonesia adalah...", Options: o("Soekarno - Hatta", "Yamin - Soepomo", "Diponegoro - Imam Bonjol", "Kartini - Rukmini"), Explanation: "Dwitunggal Soekarno-Hatta."},
			{Text: "Hak DPR untuk meminta keterangan kepada pemerintah disebut hak...", Options: o("Interpelasi", "Angket", "Menyatakan Pendapat", "Imunitas"), Explanation: "Hak Interpelasi."},
			{Text: "Dasar hukum otonomi daerah adalah...", Options: o("UU No. 23 Tahun 2014", "UU No. 20 Tahun 2003", "UU No. 12 Tahun 2011", "UU No. 39 Tahun 1999"), Explanation: "Hukum Pemda."},
		},
	})
	// Grade 9
	quizzes = append(quizzes, SeedQuiz{
		SubjectCode: "PPKN", Grade: 9, Title: "Pendidikan Pancasila Kelas IX",
		Questions: []SeedQuestion{
			{Text: "Bentuk penyimpangan pada masa Orde Lama (Demokrasi Terpimpin) adalah...", Options: o("Pengangkatan Presiden Seumur Hidup", "Korupsi merajalela", "Bebas berpendapat", "Pemilu yang demokratis"), Explanation: "TAP MPRS No. III/1963 mengangkat Soekarno seumur hidup."},
			{Text: "Masa awal kemerdekaan (1945-1950) menghadapi pemberontakan...", Options: o("PKI Madiun 1948", "G30S/PKI 1965", "Reformasi 1998", "Tritura"), Explanation: "Pemberontakan PKI Muso di Madiun."},
			{Text: "Ideologi terbuka memiliki ciri...", Options: o("Dinamis dan menyesuaikan zaman", "Kaku dan tertutup", "Menolak perubahan", "Haut milik penguasa"), Explanation: "Pancasila adalah ideologi terbuka."},
			{Text: "Dimensi ideologi yang mencerminkan realita kehidupan masyarakat disebut...", Options: o("Dimensi Realitas", "Dimensi Idealisme", "Dimensi Fleksibilitas", "Dimensi Normatif"), Explanation: "Nilai nyata dalam masyarakat."},
			{Text: "Pembukaan UUD 1945 alinea pertama berisi...", Options: o("Hak segala bangsa akan kemerdekaan", "Cita-cita negara", "Tujuan negara", "Dasar negara"), Explanation: "Bahwa sesungguhnya kemerdekaan itu ialah hak segala bangsa..."},
			{Text: "Tujuan negara Indonesia tercantum dalam Pembukaan UUD 1945 alinea...", Options: o("Ke-4", "Ke-1", "Ke-2", "Ke-3"), Explanation: "Melindungi segenap bangsa... (Alinea 4)."},
			{Text: "Pokok pikiran kedua Pembukaan UUD 1945 adalah...", Options: o("Keadilan Sosial", "Persatuan", "Kedaulatan Rakyat", "Ketuhanan"), Explanation: "Negara hendak mewujudkan keadilan sosial (Pokok Pikiran 2)."},
			{Text: "Sikap positif terhadap pokok pikiran persatuan adalah...", Options: o("Menggunakan produk dalam negeri", "Beribadah tepat waktu", "Musyawarah mufakat", "Menabung"), Explanation: "Cinta tanah air & persatuan."},
			{Text: "Kedaulatan ke luar artinya...", Options: o("Bebas berhubungan dengan negara lain", "Mengatur rumah tangga sendiri", "Memiliki tentara", "Membuat undang-undang"), Explanation: "Hubungan internasional."},
			{Text: "Teori kedaulatan yang dianut Indonesia adalah...", Options: o("Kedaulatan Rakyat & Hukum", "Kedaulatan Raja", "Kedaulatan Tuhan", "Kedaulatan Negara"), Explanation: "Rakyat (Demokrasi) dan Hukum (Nomokrasi)."},
			{Text: "Lembaga negara yang dihapus setelah amandemen UUD 1945 adalah...", Options: o("DPA (Dewan Pertimbangan Agung)", "MPR", "BPK", "KPK"), Explanation: "DPA dihapus."},
			{Text: "Konflik yang terjadi antar suku disebut...", Options: o("Konflik Antarsuku", "Konflik Agama", "Konflik Ras", "Konflik Golongan"), Explanation: "SARA (Suku)."},
			{Text: "Upaya penyelesaian konflik dengan cara mempertemukan kedua belah pihak disebut...", Options: o("Mediasi/Negosiasi", "Kompetisi", "Paksaan", "Ajudikasi"), Explanation: "Musyawarah/Mediasi."},
			{Text: "Sistem pertahanan dan keamanan rakyat semesta disebut...", Options: o("Sishankamrata", "Militerisme", "Wajib Militer", "Bela Negara"), Explanation: "Sishankamrata (TNI, Polri, Rakyat)."},
			{Text: "Pasal 30 ayat 1 berbunyi: Tiap-tiap warga negara berhak dan wajib ikut serta dalam usaha...", Options: o("Pertahanan dan keamanan negara", "Pendidikan", "Ekonomi", "Kebudayaan"), Explanation: "Hankamneg."},
			{Text: "Globalisasi membawa dampak positif berupa...", Options: o("Kemajuan IPTEK", "Pergaulan bebas", "Konsumerisme", "Lunturnya budaya"), Explanation: "Ilmu pengetahuan dan teknologi berkembang."},
			{Text: "Sikap selektif terhadap pengaruh budaya asing adalah...", Options: o("Menerima yang sesuai Pancasila", "Menolak semua", "Menerima semua", "Apatis"), Explanation: "Filter dengan Pancasila."},
			{Text: "Undang-Undang tentang Pemerintah Daerah adalah...", Options: o("UU No 23 Tahun 2014", "UU No 20 Tahun 2003", "UU No 14 Tahun 2005", "UU No 12 Tahun 2012"), Explanation: "UU Pemda."},
			{Text: "Bela negara secara non-fisik dapat dilakukan dengan...", Options: o("Belajar dengan giat", "Mengangkat senjata", "Menjadi tentara", "Perang"), Explanation: "Prestasi dan pengabdian profesi."},
			{Text: "Cinta tanah air disebut juga...", Options: o("Nasionalisme", "Etnosentrisme", "Primordialisme", "Sekularisme"), Explanation: "Nasionalisme."},
		},
	})

	// --- 3. IND (Bahasa Indonesia) ---
	// Grade 7
	quizzes = append(quizzes, SeedQuiz{
		SubjectCode: "IND", Grade: 7, Title: "Bahasa Indonesia Kelas VII",
		Questions: []SeedQuestion{
			{Text: "Teks yang menggambarkan objek secara rinci disebut...", Options: o("Teks Deskripsi", "Teks Narasi", "Teks Prosedur", "Teks Eksposisi"), Explanation: "Deskripsi: menggambarkan objek."},
			{Text: "Struktur teks deskripsi terdiri dari...", Options: o("Identifikasi, Deskripsi Bagian, Simpulan", "Orientasi, Komplikasi, Resolusi", "Tujuan, Langkah-langkah", "Tesis, Argumen"), Explanation: "Struktur deskripsi."},
			{Text: "Majas yang melebih-lebihkan sesuatu disebut...", Options: o("Hiperbola", "Personifikasi", "Metafora", "Simile"), Explanation: "Hiperbola."},
			{Text: "Cerita fantasi termasuk jenis teks...", Options: o("Narasi", "Deskripsi", "Argumentasi", "Persuasi"), Explanation: "Narasi fiksi."},
			{Text: "Langkah-langkah melakukan sesuatu terdapat dalam teks...", Options: o("Prosedur", "Laporan", "Berita", "Puisi"), Explanation: "Teks Prosedur."},
			{Text: "Kata penghubung antar kalimat disebut...", Options: o("Konjungsi", "Preposisi", "Interjeksi", "Nomina"), Explanation: "Konjungsi."},
			{Text: "Puisi rakyat yang bersajak a-b-a-b adalah...", Options: o("Pantun", "Gurindam", "Syair", "Mantra"), Explanation: "Ciri pantun."},
			{Text: "Gurindam terdiri dari berapa baris per bait?", Options: o("2 baris", "4 baris", "3 baris", "6 baris"), Explanation: "Gurindam 2 baris."},
			{Text: "Surat dinas ditulis oleh...", Options: o("Instansi/Lembaga", "Pribadi", "Teman", "Keluarga"), Explanation: "Surat resmi instansi."},
			{Text: "Bahasa dalam surat dinas harus...", Options: o("Baku dan resmi", "Santai", "Gaul", "Puitis"), Explanation: "Menggunakan bahasa baku."},
			{Text: "Buku fiksi adalah buku yang berisi...", Options: o("Imajinasi penulis", "Fakta ilmiah", "Laporan perjalanan", "Biografi tokoh"), Explanation: "Fiksi = rekaan."},
			{Text: "Contoh buku non-fiksi adalah...", Options: o("Biografi", "Novel", "Komik", "Dongeng"), Explanation: "Biografi berdasarkan fakta."},
			{Text: "Unsur intrinsik cerpen yang menyangkut tempat dan waktu adalah...", Options: o("Latar/Setting", "Alur", "Tokoh", "Tema"), Explanation: "Latar."},
			{Text: "Amanat dalam cerita adalah...", Options: o("Pesan moral", "Jalan cerita", "Tokoh utama", "Sudut pandang"), Explanation: "Pesan yang ingin disampaikan."},
			{Text: "'Ibu pergi ke pasar.' Kata 'Ibu' berkedudukan sebagai...", Options: o("Subjek", "Predikat", "Objek", "Keterangan"), Explanation: "Pelaku (Subjek)."},
			{Text: "Sinonim kata 'melihat' adalah...", Options: o("Memandang", "Mendengar", "Merasa", "Mencium"), Explanation: "Persamaan makna."},
			{Text: "Teks yang berisi laporan hasil pengamatan disebut...", Options: o("Laporan Hasil Observasi", "Teks Berita", "Teks Ulasan", "Teks Eksplanasi"), Explanation: "LHO."},
			{Text: "Kalimat perintah dalam teks prosedur biasanya diakhiri dengan...", Options: o("Tanda seru (!)", "Tanda tanya (?)", "Tanda titik (.)", "Tanda koma (,)"), Explanation: "Kalimat imperatif."},
			{Text: "Pantun: Berakit-rakit ke hulu, berenang-renang ke tepian. Baris ini disebut...", Options: o("Sampiran", "Isi", "Tema", "Amanat"), Explanation: "Baris 1-2 adalah sampiran."},
			{Text: "Tokoh yang berwatak jahat disebut...", Options: o("Antagonis", "Protagonis", "Tritagonis", "Figuran"), Explanation: "Penentang/jahat."},
		},
	})
	// Grade 8
	quizzes = append(quizzes, SeedQuiz{
		SubjectCode: "IND", Grade: 8, Title: "Bahasa Indonesia Kelas VIII",
		Questions: []SeedQuestion{
			{Text: "Unsur 5W+1H terdapat dalam teks...", Options: o("Berita", "Puisi", "Pantun", "Drama"), Explanation: "ADIKSIBA (Apa, Di mana, Kapan, Siapa, Mengapa, Bagaimana)."},
			{Text: "Slogan mengutamakan...", Options: o("Kepadatan makna dan kata-kata menarik", "Gambar visual", "Cerita panjang", "Dialog"), Explanation: "Slogan ringkas dan padat."},
			{Text: "Poster biasanya dipasang di...", Options: o("Tempat umum", "Kamar tidur", "Dalam tas", "Buku harian"), Explanation: "Agar dilihat orang banyak."},
			{Text: "Teks yang berisi pendapat penulis tentang suatu fenomena disebut...", Options: o("Teks Eksposisi", "Teks Narasi", "Teks Deskripsi", "Teks Fabel"), Explanation: "Eksposisi memaparkan pendapat."},
			{Text: "Bagian akhir teks eksposisi yang berisi penegasan ulang disebut...", Options: o("Reiterasi", "Tesis", "Argumentasi", "Koda"), Explanation: "Penegasan ulang (Reiterasi)."},
			{Text: "Puisi modern tidak terikat oleh...", Options: o("Rima dan jumlah baris", "Makna", "Tema", "Kata"), Explanation: "Puisi bebas."},
			{Text: "Majas: 'Wajahnya bersinar seperti rembulan.' adalah...", Options: o("Simile/Perumpamaan", "Metafora", "Personifikasi", "Ironi"), Explanation: "Menggunakan kata 'seperti'."},
			{Text: "Teks Eksplanasi menjelaskan tentang...", Options: o("Proses terjadinya fenomena alam/sosial", "Cara membuat makanan", "Kisah hidup seseorang", "Promosi produk"), Explanation: "Why and How fonomena."},
			{Text: "Konjungsi kausalitas contohnya...", Options: o("Sebab, karena, oleh karena itu", "Kemudian, lalu", "Dan, atau", "Tetapi, namun"), Explanation: "Hubungan sebab-akibat."},
			{Text: "Teks Ulasan berisi...", Options: o("Penilaian terhadap karya", "Berita terkini", "Laporan penelitian", "Dongeng"), Explanation: "Review/Resensi."},
			{Text: "Struktur Teks Ulasan: Orientasi, Tafsiran, Evaluasi, dan...", Options: o("Rangkuman", "Resolusi", "Klimaks", "Abstrak"), Explanation: "Rangkuman."},
			{Text: "Kata sifat yang sering muncul dalam ulasan adalah...", Options: o("Menarik, membosankan, bagus", "Pergi, makan, tidur", "Saya, kamu, dia", "Di, ke, dari"), Explanation: "Adjektiva penilaian."},
			{Text: "Teks Persuasi bertujuan untuk...", Options: o("Membujuk/mengajak pembaca", "Menghibur", "Menjelaskan", "Menggambarkan"), Explanation: "Persuasi = ajakan."},
			{Text: "Kalimat ajakan biasanya menggunakan kata...", Options: o("Ayo, mari", "Jangan, dilarang", "Akan, sedang", "Adalah, yaitu"), Explanation: "Partikel lah/ayo."},
			{Text: "Drama yang dialognya dinyanyikan disebut...", Options: o("Opera", "Sendratari", "Tablo", "Farce"), Explanation: "Opera."},
			{Text: "Keterangan tempat, waktu, dan suasana dalam drama disebut...", Options: o("Latar", "Epilog", "Prolog", "Mimik"), Explanation: "Setting/Latar."},
			{Text: "Sifat fiksi dalam buku fiksi berarti...", Options: o("Khayalan", "Nyata", "Fakta", "Ilmiah"), Explanation: "Imajiner."},
			{Text: "Indeks buku berfungsi untuk...", Options: o("Menemukan istilah penting dengan cepat", "Melihat harga", "Membaca ringkasan", "Mengetahui penulis"), Explanation: "Daftar kata penting."},
			{Text: "Antonim dari 'Optimis' adalah...", Options: o("Pesimis", "Realistis", "Skeptis", "Egois"), Explanation: "Pesimis."},
			{Text: "Ungkapan 'Buah tangan' artinya...", Options: o("Oleh-oleh", "Karya", "Anak", "Pukulan"), Explanation: "Oleh-oleh."},
		},
	})
	// Grade 9
	quizzes = append(quizzes, SeedQuiz{
		SubjectCode: "IND", Grade: 9, Title: "Bahasa Indonesia Kelas IX",
		Questions: []SeedQuestion{
			{Text: "Teks Laporan Percobaan bertujuan untuk...", Options: o("Melaporkan hasil praktikum/percobaan", "Menceritakan pengalaman liburan", "Menjual barang", "Mengkritik pemerintah"), Explanation: "Hasil eksperimen."},
			{Text: "Struktur Teks Laporan Percobaan: Tujuan, Alat & Bahan, ... , Hasil, Simpulan.", Options: o("Langkah-langkah", "Argumentasi", "Orientasi", "Resolusi"), Explanation: "Prosedur/Langkah."},
			{Text: "Pidato yang bertujuan meyakinkan pendengar disebut pidato...", Options: o("Persuasif", "Informatif", "Rekreatif", "Deskriptif"), Explanation: "Persuasif."},
			{Text: "Sapaan penghormatan dalam pidato contohnya...", Options: o("Yang terhormat Bapak Kepala Sekolah", "Hai kawan-kawan", "Halo semua", "Woi"), Explanation: "Sapaan resmi."},
			{Text: "Cerpen singkatan dari...", Options: o("Cerita Pendek", "Cerita Panjang", "Cerita Pengetahuan", "Cerdas Penat"), Explanation: "Short story."},
			{Text: "Konflik memuncak dalam alur cerita disebut...", Options: o("Klimaks", "Orientasi", "Resolusi", "Komplikasi"), Explanation: "Puncak masalah."},
			{Text: "Teks Tanggapan berisi...", Options: o("Kritik, saran, atau pujian", "Berita bohong", "Promosi", "Curhat"), Explanation: "Respon santun."},
			{Text: "Kalimat sanggahan yang sopan diawali dengan...", Options: o("Menurut saya kurang tepat, sebaiknya...", "Kamu salah!", "Ide bodoh", "Tidak setuju!"), Explanation: "Santun."},
			{Text: "Teks Diskusi menyajikan...", Options: o("Dua sudut pandang berbeda (Pro & Kontra)", "Satu pendapat saja", "Cerita lucu", "Gambar"), Explanation: "Isu pro dan kontra."},
			{Text: "Cerita Inspiratif bertujuan untuk...", Options: o("Menginspirasi/memotivasi pembaca", "Menakuti", "Membuat sedih", "Membingungkan"), Explanation: "Memberi keteladanan."},
			{Text: "Bagian 'Koda' dalam cerita inspiratif berisi...", Options: o("Pelajaran moral/hikmah", "Perkenalan tokoh", "Masalah", "Judul"), Explanation: "Penyelesaian/moral."},
			{Text: "Literasi buku fiksi dan non-fiksi bertujuan meningkatkan...", Options: o("Minat baca", "Berat badan", "Uang saku", "Teman"), Explanation: "Gemar membaca."},
			{Text: "Peta pikiran (Mind Map) berguna untuk...", Options: o("Merangkum isi buku", "Menggambar", "Bermain", "Menyontek"), Explanation: "Memetakan ide."},
			{Text: "Kata hubung antarkalimat penanda simpulan adalah...", Options: o("Oleh sebab itu", "Selain itu", "Akan tetapi", "Lalu"), Explanation: "Konjungsi penyimpul."},
			{Text: "Unsur ekstrinsik cerpen meliputi...", Options: o("Nilai sosial, budaya, biografi penulis", "Tema, alur, latar", "Tokoh, watak", "Diksi"), Explanation: "Luar karya."},
			{Text: "Majas Litotes adalah...", Options: o("Merendahkan diri", "Melebihkan", "Menyindir", "Mengganti nama"), Explanation: "Mampirlah ke gubuk kami."},
			{Text: "Kalimat pasif ditandai dengan awalan...", Options: o("di- atau ter-", "me- atau ber-", "pe-", "se-"), Explanation: "Dimakan, termakan."},
			{Text: "Sinonim 'Metode' adalah...", Options: o("Cara", "Tujuan", "Hasil", "Alat"), Explanation: "Cara kerja."},
			{Text: "Menyunting teks artinya...", Options: o("Memperbaiki kesalahan naskah", "Menulis baru", "Membuang naskah", "Membaca saja"), Explanation: "Editing."},
			{Text: "Kohesi dan Koherensi dalam paragraf berarti...", Options: o("Kepaduan dan kesinambungan", "Panjang dan lebar", "Indah dan puitis", "Singkat dan padat"), Explanation: "Syarat paragraf baik."},
		},
	})

	return quizzes
}
