package database

func GetSeedDataPart3() []SeedQuiz {
	var quizzes []SeedQuiz

	// --- 6. IPS (ILMU PENGETAHUAN SOSIAL) ---
	// Grade 7
	quizzes = append(quizzes, SeedQuiz{
		SubjectCode: "IPS", Grade: 7, Title: "Ilmu Pengetahuan Sosial Kelas VII",
		Questions: []SeedQuestion{
			{Text: "Pengertian ruang dalam IPS adalah...", Options: o("Tempat di permukaan bumi", "Ruang kelas", "Kamar tidur", "Angkasa"), Explanation: "Konsep ruang."},
			{Text: "Peta adalah gambaran permukaan bumi pada...", Options: o("Bidang datar", "Bola dunia", "Layar HP", "Batu"), Explanation: "Definisi peta."},
			{Text: "Garis khayal yang membagi bumi menjadi belahan utara dan selatan adalah...", Options: o("Garis Khatulistiwa", "Garis Bujur", "Garis Meridan", "Garis Weber"), Explanation: "Equator."},
			{Text: "Letak astronomis Indonesia adalah...", Options: o("6 LU - 11 LS dan 95 BT - 141 BT", "Sabang - Merauke", "Asia - Australia", "Samudra Hindia - Pasifik"), Explanation: "Astronomis."},
			{Text: "Angin Muson Barat menyebabkan Indonesia mengalami musim...", Options: o("Hujan", "Kemarau", "Semi", "Gugur"), Explanation: "Membawa uap air."},
			{Text: "Fauna tipe Asiatis terdapat di wilayah...", Options: o("Indonesia Barat", "Indonesia Tengah", "Indonesia Timur", "Papua"), Explanation: "Gajah, Harimau."},
			{Text: "Contoh interaksi sosial disosiatif adalah...", Options: o("Persaingan/Kompetisi", "Kerjasama", "Asimilasi", "Akulturasi"), Explanation: "Menuju perpecahan."},
			{Text: "Lembaga sosial yang terkecil adalah...", Options: o("Keluarga", "Sekolah", "RT", "Negara"), Explanation: "Family."},
			{Text: "Zaman praaksara adalah zaman ketika manusia belum mengenal...", Options: o("Tulisan", "Api", "Alat batu", "Berburu"), Explanation: "Nirleka."},
			{Text: "Fosil manusia purba Meganthropus Paleojavanicus ditemukan di...", Options: o("Sangiran/Sragen", "Flores", "Wajak", "Liang Bua"), Explanation: "Manusia raksasa Jawa."},
			{Text: "Tujuan kegiatan produksi adalah...", Options: o("Menghasilkan barang/jasa", "Menghabiskan nilai guna", "Menyalurkan barang", "Mencari teman"), Explanation: "Produksi."},
			{Text: "Hukum permintaan: Jika harga naik, maka permintaan...", Options: o("Turun", "Naik", "Tetap", "Bertambah"), Explanation: "Law of Demand."},
			{Text: "Kewirausahaan adalah kemampuan untuk...", Options: o("Menciptakan sesuatu yang baru", "Menyontek ide", "Bekerja di kantor", "Meminjam uang"), Explanation: "Inovasi."},
			{Text: "Raja terkenal dari Kerajaan Kediri adalah...", Options: o("Jayabaya", "Hayam Wuruk", "Mulawarman", "Gajah Mada"), Explanation: "Ramalan Jayabaya."},
			{Text: "Candi Borobudur bercorak agama...", Options: o("Buddha", "Hindu", "Islam", "Konghucu"), Explanation: "Buddha Mahayana."},
			{Text: "Masuknya Islam ke Indonesia melalui jalur...", Options: o("Perdagangan", "Perang", "Penjajahan", "Transmigrasi"), Explanation: "Pedagang Gujarat/Arab."},
			{Text: "Kerajaan Islam pertama di Jawa adalah...", Options: o("Demak", "Mataram", "Banten", "Cirebon"), Explanation: "Raden Patah."},
			{Text: "Manusia sebagai makhluk ekonomi disebut...", Options: o("Homo Economicus", "Homo Sapiens", "Homo Socius", "Zoon Politicon"), Explanation: "Makhluk ekonomi."},
			{Text: "Kebutuhan yang harus dipenuhi untuk kelangsungan hidup disebut...", Options: o("Kebutuhan Primer", "Kebutuhan Sekunder", "Kebutuhan Tersier", "Kebutuhan Mewah"), Explanation: "Sandang, pangan, papan."},
			{Text: "Pasar yang hanya ada satu penjual disebut pasar...", Options: o("Monopoli", "Oligopoli", "Persaingan Sempurna", "Tradisional"), Explanation: "Mono = satu."},
		},
	})
	// Grade 8
	quizzes = append(quizzes, SeedQuiz{
		SubjectCode: "IPS", Grade: 8, Title: "Ilmu Pengetahuan Sosial Kelas VIII",
		Questions: []SeedQuestion{
			{Text: "ASEAN didirikan pada tanggal...", Options: o("8 Agustus 1967", "17 Agustus 1945", "18 Agustus 1999", "5 Juni 1970"), Explanation: "Bangkok Declaration."},
			{Text: "Negara ASEAN yang tidak memiliki laut adalah...", Options: o("Laos", "Thailand", "Vietnam", "Kamboja"), Explanation: "Landlocked country."},
			{Text: "Mata uang negara Thailand adalah...", Options: o("Baht", "Ringgit", "Peso", "Rupiah"), Explanation: "Baht."},
			{Text: "Bentuk kerjasama ASEAN di bidang ekonomi adalah...", Options: o("MEA (Masyarakat Ekonomi ASEAN)", "ZOPFAN", "SEATO", "NATO"), Explanation: "Ekonomi."},
			{Text: "Mobilitas sosial vertikal naik contohnya...", Options: o("Guru diangkat jadi Kepala Sekolah", "Pensiun", "Pindah rumah", "Sakit"), Explanation: "Social climbing."},
			{Text: "Faktor pendorong mobilitas sosial adalah...", Options: o("Pendidikan", "Kemiskinan", "Diskriminasi", "Malas"), Explanation: "Pendidikan membuka peluang."},
			{Text: "Pluralitas masyarakat Indonesia disebabkan oleh...", Options: o("Kondisi geografis kepulauan", "Satu nenek moyang", "Ideologi yang sama", "Bahasa yang sama"), Explanation: "Perbedaan wilayah."},
			{Text: "Rumah adat Sumatera Barat adalah...", Options: o("Rumah Gadang", "Joglo", "Honai", "Tongkonan"), Explanation: "Minangkabau."},
			{Text: "Pelaku ekonomi dalam suatu negara terdiri atas...", Options: o("RTK, RTP, Pemerintah, Masyarakat Luar Negeri", "Ayah, Ibu, Anak", "Penjual, Pembeli", "Bank, Pasar"), Explanation: "4 sektor."},
			{Text: "Perdagangan antarpulau bertujuan untuk...", Options: o("Memenuhi kebutuhan & mencari keuntungan", "Berperang", "Menguasai wilayah", "Jalan-jalan"), Explanation: "Ekonomi."},
			{Text: "Ekspor adalah kegiatan...", Options: o("Menjual barang ke luar negeri", "Membeli barang dari luar", "Menimbun barang", "Membuang barang"), Explanation: "Keluar negeri."},
			{Text: "Agrikultur adalah kegiatan ekonomi di bidang...", Options: o("Pertanian", "Industri", "Jasa", "Tambang"), Explanation: "Pertanian."},
			{Text: "Redistribusi pendapatan contohnya...", Options: o("Pajak untuk subsidi dan bansos", "Menabung", "Belanja", "Korupsi"), Explanation: "Pemerataan."},
			{Text: "Gubernur Jenderal VOC yang memindahkan pusat ke Batavia adalah...", Options: o("J.P. Coen", "Daendels", "Raffles", "Van den Bosch"), Explanation: "Jan Pieterszoon Coen."},
			{Text: "Sistem Tanam Paksa (Cultuurstelsel) dicetuskan oleh...", Options: o("Van den Bosch", "Daendels", "Douwes Dekker", "Snouck Hurgronje"), Explanation: "Tanam paksa."},
			{Text: "Perang Diponegoro terjadi pada tahun...", Options: o("1825-1830", "1945-1949", "1800-1825", "1908-1928"), Explanation: "Perang Jawa."},
			{Text: "Organisasi Budi Utomo berdiri tahun...", Options: o("1908", "1928", "1945", "1905"), Explanation: "Kebangkitan Nasional."},
			{Text: "Sumpah Pemuda menegaskan satu tumpah darah, bangsa, dan...", Options: o("Bahasa", "Agama", "Suku", "Budaya"), Explanation: "Bahasa Indonesia."},
			{Text: "Kerja paksa pada masa pendudukan Jepang disebut...", Options: o("Romusha", "Rod", "Samin", "Seikirei"), Explanation: "Romusha."},
			{Text: "PPKI mengesahkan UUD 1945 pada tanggal...", Options: o("18 Agustus 1945", "17 Agustus 1945", "1 Juni 1945", "19 Agustus 1945"), Explanation: "Sidang PPKI I."},
		},
	})
	// Grade 9
	quizzes = append(quizzes, SeedQuiz{
		SubjectCode: "IPS", Grade: 9, Title: "Ilmu Pengetahuan Sosial Kelas IX",
		Questions: []SeedQuestion{
			{Text: "Benua terluas di dunia adalah...", Options: o("Asia", "Amerika", "Afrika", "Eropa"), Explanation: "Asia."},
			{Text: "Benua yang dijuluki Benua Hitam adalah...", Options: o("Afrika", "Asia", "Eropa", "Australia"), Explanation: "Afrika."},
			{Text: "Negara maju di Asia contohnya...", Options: o("Jepang", "Indonesia", "Vietnam", "India"), Explanation: "Jepang & Korsel."},
			{Text: "Terusan Suez menghubungkan Laut Tengah dan...", Options: o("Laut Merah", "Laut Hitam", "Laut Mati", "Samudra Pasifik"), Explanation: "Mesir."},
			{Text: "Perubahan sosial budaya yang berlangsung cepat disebut...", Options: o("Revolusi", "Evolusi", "Akulturasi", "Asimilasi"), Explanation: "Revolusi."},
			{Text: "Penyebab perubahan sosial dari dalam masyarakat adalah...", Options: o("Bertambah/berkurangnya penduduk", "Bencana alam", "Peperangan", "Pengaruh budaya lain"), Explanation: "Internal."},
			{Text: "Westernisasi adalah...", Options: o("Meniru gaya hidup barat berlebihan", "Modernisasi", "Globalisasi", "Cinta budaya sendiri"), Explanation: "Ke barat-baratan."},
			{Text: "Dampak negatif globalisasi adalah...", Options: o("Kriminalitas dan kenakalan remaja", "IPTEK maju", "Ekonomi tumbuh", "Pariwisata berkembang"), Explanation: "Masalah sosial."},
			{Text: "Perdagangan intrnasional terjadi karena perbedaan...", Options: o("Sumber daya alam", "Agama", "Warna kulit", "Presiden"), Explanation: "Keunggulan komparatif."},
			{Text: "Devisa negara diperoleh dari...", Options: o("Ekspor dan pariwisata", "Impor", "Utang", "Banjir"), Explanation: "Mata uang asing."},
			{Text: "Ekonomi kreatif mengandalkan...", Options: o("Ide dan pengetahuan", "Tenaga otot", "Mesin tua", "Tanah luas"), Explanation: "Kreativitas."},
			{Text: "Subsektor ekonomi kreatif antara lain...", Options: o("Kuliner, Fashion, Desain", "Pertanian, Perikanan", "Pertambangan", "Kehutanan"), Explanation: "Industri kreatif."},
			{Text: "ASEAN Free Trade Area (AFTA) bertujuan...", Options: o("Meningkatkan daya saing ekonomi ASEAN", "Perang dagang", "Menutup impor", "Menaikkan pajak"), Explanation: "Perdagangan bebas."},
			{Text: "Masa Demokrasi Parlementer (1950-1959) ditandai dengan...", Options: o("Sering bergantinya kabinet", "Stabil politiknya", "Pembangunan pesat", "Presiden berkuasa mutlak"), Explanation: "Instabilitas."},
			{Text: "Pemilu pertama di Indonesia tahun 1955 untuk memilih...", Options: o("DPR dan Konstituante", "Presiden", "Kepala Desa", "Gubernur"), Explanation: "Pemilu 55."},
			{Text: "Tritura (Tri Tuntutan Rakyat) berisi, kecuali...", Options: o("Ganyang Malaysia", "Bubarkan PKI", "Bersihkan Kabinet", "Turunkan Harga"), Explanation: "Ganyang Malaysia adalah Dwikora."},
			{Text: "Surat Perintah 11 Maret (Supersemar) diberikan kepada...", Options: o("Soeharto", "Nasution", "Yani", "Habibie"), Explanation: "Mandat ke Soeharto."},
			{Text: "Reformasi 1998 ditandai dengan mundurnya Presiden...", Options: o("Soeharto", "Soekarno", "Habibie", "Gus Dur"), Explanation: "Lengsernya Soeharto."},
			{Text: "Timor Timur lepas dari Indonesia pada masa Presiden...", Options: o("B.J. Habibie", "Megawati", "Gus Dur", "SBY"), Explanation: "Referendum 1999."},
			{Text: "Lembaga kerjasama ekonomi internasional di bawah PBB adalah...", Options: o("WTO", "WHO", "UNESCO", "UNICEF"), Explanation: "World Trade Organization (terkait). ECOSOC."},
		},
	})

	// --- 7. ING (Bahasa Inggris) ---
	// Grade 7
	quizzes = append(quizzes, SeedQuiz{
		SubjectCode: "ING", Grade: 7, Title: "Bahasa Inggris Kelas VII",
		Questions: []SeedQuestion{
			{Text: "How do you say 'Selamat Pagi' in English?", Options: o("Good morning", "Good night", "Good afternoon", "Good bye"), Explanation: "Greeting."},
			{Text: "My mother's sister is my...", Options: o("Aunt", "Uncle", "Niece", "Grandmother"), Explanation: "Family tree."},
			{Text: "I ... a student.", Options: o("am", "is", "are", "be"), Explanation: "I am."},
			{Text: "This is a book. ... book is red.", Options: o("The", "A", "An", "Two"), Explanation: "Article."},
			{Text: "We use our eyes to...", Options: o("See", "Hear", "Smell", "Taste"), Explanation: "Senses."},
			{Text: "What time is 07.30?", Options: o("It is half past seven", "It is seven thirty o'clock", "It is half to seven", "It is thirty seven"), Explanation: "Time."},
			{Text: "Today is Monday. Tomorrow is...", Options: o("Tuesday", "Wednesday", "Sunday", "Friday"), Explanation: "Days."},
			{Text: "There ... five apples on the table.", Options: o("are", "is", "am", "was"), Explanation: "Plural."},
			{Text: "She ... to school every day.", Options: o("goes", "go", "going", "gone"), Explanation: "Present Tense."},
			{Text: "Synonym of 'Smart' is...", Options: o("Clever", "Stupid", "Lazy", "Slow"), Explanation: "Synonyms."},
			{Text: "Where do you cook?", Options: o("Kitchen", "Bedroom", "Bathroom", "Garage"), Explanation: "Rooms."},
			{Text: "What is the color of the sky?", Options: o("Blue", "Green", "Red", "Yellow"), Explanation: "Colors."},
			{Text: "Elephants are ... (besar)", Options: o("Big", "Small", "Tiny", "Short"), Explanation: "Adjective."},
			{Text: "Please ... the door.", Options: o("Open", "Read", "Sing", "Drink"), Explanation: "Imperative."},
			{Text: "My hobby is ... (membaca)", Options: o("Reading", "Swimming", "Cooking", "Sleeping"), Explanation: "Gerund."},
			{Text: "Do you like pizza?", Options: o("Yes, I do", "Yes, I am", "No, I don't like", "Yes, I does"), Explanation: "Short answer."},
			{Text: "He is ... (ganteng)", Options: o("Handsome", "Beautiful", "Pretty", "Ugly"), Explanation: "Adjective."},
			{Text: "Plural of 'Child' is...", Options: o("Children", "Childs", "Childes", "Kid"), Explanation: "Irregular plural."},
			{Text: "Descriptive text is used to...", Options: o("Describe person, place, or thing", "Tell a story", "Explain how to make", "Amuse reader"), Explanation: "Genre."},
			{Text: "I have breakfast in the...", Options: o("Morning", "Afternoon", "Evening", "Night"), Explanation: "Time of day."},
		},
	})
	// Grade 8
	quizzes = append(quizzes, SeedQuiz{
		SubjectCode: "ING", Grade: 8, Title: "Bahasa Inggris Kelas VIII",
		Questions: []SeedQuestion{
			{Text: "Expression of asking for attention:", Options: o("Attention please!", "Thank you", "I'm sorry", "Good luck"), Explanation: "Asking attention."},
			{Text: "Can you play guitar? (Ability)", Options: o("Yes, I can", "Yes, I will", "Yes, I do", "Yes, I am"), Explanation: "Modal Can."},
			{Text: "You ... wear uniform at school. (Obligation)", Options: o("Must", "May", "Can", "Will"), Explanation: "Must."},
			{Text: "My father is ... than me. (Comparative)", Options: o("Taller", "Tall", "Tallest", "More tall"), Explanation: "Comparative degree."},
			{Text: "Recount text tells about...", Options: o("Past experience", "Future plan", "How to make something", "General truth"), Explanation: "Recount."},
			{Text: "Simple Past Tense uses verb...", Options: o("Verb 2", "Verb 1", "Verb 3", "Verb -ing"), Explanation: "Past tense."},
			{Text: "She ... (buy) a new bike yesterday.", Options: o("Bought", "Buyed", "Buys", "Buying"), Explanation: "Irregular verb."},
			{Text: "Continuous Tense formula:", Options: o("S + to be + V-ing", "S + V1", "S + V2", "S + will + V1"), Explanation: "Present Continuous."},
			{Text: "Notice: 'No Smoking' means...", Options: o("We are not allowed to smoke", "We must smoke", "Smoking is good", "Smoke here"), Explanation: "Prohibition."},
			{Text: "Greeting card is sent for...", Options: o("Birthday, Achievement, Holiday", "Exam", "Sleeping", "Driving"), Explanation: "Function."},
			{Text: "There is ... sugar in the jar.", Options: o("Some (Uncountable)", "Many", "A few", "A"), Explanation: "Quantifier."},
			{Text: "The superlative of 'Good' is...", Options: o("Best", "Goodest", "Better", "Most good"), Explanation: "Superlative."},
			{Text: "While I ... (study), the phone rang.", Options: o("Was studying", "Studied", "Am studying", "Study"), Explanation: "Past Continuous."},
			{Text: "Message: 'Call me back'. It is a...", Options: o("Short Message", "Letter", "Notice", "Poster"), Explanation: "Short message."},
			{Text: "Announcement text usually contains...", Options: o("What, where, when, who", "Steps", "Characters", "Conflict"), Explanation: "Announcement."},
			{Text: "The sun ... in the East.", Options: o("Rises", "Rise", "Rose", "Rising"), Explanation: "General truth."},
			{Text: "Don't forget to ... your teeth.", Options: o("Brush", "Wash", "Clean", "Sweep"), Explanation: "Collocation."},
			{Text: "Invitation letter is for...", Options: o("Inviting someone", "Giving information", "Asking help", "Apologizing"), Explanation: "Invitation."},
			{Text: "Song lyrics usually contain...", Options: o("Moral value / Message", "Steps", "News", "Report"), Explanation: "Song."},
			{Text: "Mr. Budi is a teacher. He teaches in...", Options: o("School", "Hospital", "Police station", "Market"), Explanation: "Profession."},
		},
	})
	// Grade 9
	quizzes = append(quizzes, SeedQuiz{
		SubjectCode: "ING", Grade: 9, Title: "Bahasa Inggris Kelas IX",
		Questions: []SeedQuestion{
			{Text: "Expression of hope/wish:", Options: o("I hope you win", "I hate you", "I don't care", "You are bad"), Explanation: "Congratulation & Hope."},
			{Text: "Purpose of Procedure Text (Recipe):", Options: o("To tell how to make something", "To describe food", "To sell food", "To eat food"), Explanation: "Procedure."},
			{Text: "Connectives in Procedure Text:", Options: o("First, Then, Finally", "Once upon a time", "However", "Because"), Explanation: "Sequencers."},
			{Text: "Present Perfect Tense formula:", Options: o("S + have/has + V3", "S + had + V3", "S + am + Ving", "S + will + V1"), Explanation: "Present Perfect."},
			{Text: "Narrative text (Fairy Tale) aims to...", Options: o("Entertain the reader", "Inform news", "Describe animal", "Argue"), Explanation: "Narrative."},
			{Text: "Generic structure of Narrative:", Options: o("Orientation, Complication, Resolution", "Goal, Materials, Steps", "Thesis, Argument", "Identification, Description"), Explanation: "Structure."},
			{Text: "Passive Voice: 'Rice is eaten by me'. Active:", Options: o("I eat rice", "I ate rice", "I am eating rice", "Rice eats me"), Explanation: "Passive."},
			{Text: "Report text describes things...", Options: o("In general (scientifically)", "Specifically", "Like a story", "Like a procedure"), Explanation: "Report vs Descriptive."},
			{Text: "Sangkuriang is a legend from...", Options: o("West Java", "Bali", "Papua", "Sumatra"), Explanation: "Folklore."},
			{Text: "Advertisement text is for...", Options: o("Promoting product/service", "Warning", "Teaching", "Singing"), Explanation: "Ad."},
			{Text: "Conjunction 'So that' means...", Options: o("Agar/Supaya", "Tetapi", "Karena", "Atau"), Explanation: "Purpose."},
			{Text: "Direct: He said, 'I am happy'. Indirect:", Options: o("He said that he was happy", "He said that I am happy", "He says happy", "He said he is happy"), Explanation: "Reported speech."},
			{Text: "9th grade is the ... of Junior High School.", Options: o("Last year", "First year", "Middle year", "New year"), Explanation: "Context."},
			{Text: "Meaning of 'Congratulation' is...", Options: o("Selamat", "Semangat", "Semoga", "Terima kasih"), Explanation: "Greeting."},
			{Text: "Label on food packaging shows...", Options: o("Nutrition facts, expiry date", "Price only", "Picture only", "Store name"), Explanation: "Label."},
			{Text: "Synonym of 'Huge' is...", Options: o("Very big", "Small", "Tiny", "Short"), Explanation: "Vocab."},
			{Text: "To agree with an opinion:", Options: o("I agree with you", "I don't think so", "I disagree", "No way"), Explanation: "Agreement."},
			{Text: "Continuous Passive: 'The house is being built'.", Options: o("Sedang dibangun", "Telah dibangun", "Akan dibangun", "Dibangun"), Explanation: "Translation."},
			{Text: "If it rains, I ... stay at home.", Options: o("Will", "Would", "Had", "Am"), Explanation: "Conditional Type 1."},
			{Text: "Last Question: Good luck for your exam!", Options: o("Thank you", "You too", "No problem", "Bye"), Explanation: "Closing."},
		},
	})

	return quizzes
}
