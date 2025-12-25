package database

func GetSeedDataPart2() []SeedQuiz {
	var quizzes []SeedQuiz

	// --- 4. MAT (Matematika) ---
	// Grade 7
	quizzes = append(quizzes, SeedQuiz{
		SubjectCode: "MAT", Grade: 7, Title: "Matematika Kelas VII",
		Questions: []SeedQuestion{
			{Text: "Hasil dari -15 + 7 adalah...", Options: o("-8", "8", "-22", "22"), Explanation: "-15 + 7 = -8."},
			{Text: "KPK dari 12 dan 18 adalah...", Options: o("36", "24", "72", "6"), Explanation: "Kelipatan 12: 12, 24, 36... 18: 18, 36... KPK = 36."},
			{Text: "Bilangan pecahan 3/4 senilai dengan...", Options: o("75%", "0.34", "30%", "40%"), Explanation: "3/4 = 0.75 = 75%."},
			{Text: "Bentuk aljabar 2x + 3x hasilnya...", Options: o("5x", "6x", "5x^2", "6x^2"), Explanation: "Dumlah koefisien: 2+3=5."},
			{Text: "Nilai x dari persamaan 3x = 15 adalah...", Options: o("5", "3", "12", "45"), Explanation: "x = 15/3 = 5."},
			{Text: "Pertidaksamaan x + 2 > 5, maka...", Options: o("x > 3", "x < 3", "x > 7", "x = 3"), Explanation: "x > 5 - 2 => x > 3."},
			{Text: "Perbandingan senilai: Jika 2 buku harganya 4000, maka 5 buku harganya...", Options: o("10000", "8000", "12000", "20000"), Explanation: "1 buku 2000. 5 buku 10000."},
			{Text: "Sudut siku-siku besarnya...", Options: o("90 derajat", "180 derajat", "45 derajat", "360 derajat"), Explanation: "Siku-siku = 90."},
			{Text: "Luas persegi dengan sisi 5 cm adalah...", Options: o("25 cm2", "20 cm2", "10 cm2", "15 cm2"), Explanation: "L = s x s = 5 x 5 = 25."},
			{Text: "Garis yang membagi sudut menjadi dua sama besar disebut...", Options: o("Garis bagi", "Garis tinggi", "Garis berat", "Garis sumbu"), Explanation: "Garis bagi."},
			{Text: "Himpunan semesta dari {kucing, anjing, ayam} adalah...", Options: o("Hewan", "Tumbuhan", "Benda mati", "Kendaraan"), Explanation: "Hewan."},
			{Text: "A = {1, 2}, B = {2, 3}. A irisan B adalah...", Options: o("{2}", "{1, 2, 3}", "{1}", "{3}"), Explanation: "Yang sama adalah 2."},
			{Text: "Bruto 100 kg, Tara 2%. Netto adalah...", Options: o("98 kg", "102 kg", "2 kg", "90 kg"), Explanation: "Tara = 2 kg. Netto = 100 - 2 = 98."},
			{Text: "Sudut pelurus dari 120 derajat adalah...", Options: o("60 derajat", "180 derajat", "90 derajat", "30 derajat"), Explanation: "180 - 120 = 60."},
			{Text: "Jenis segitiga yang ketiga sisinya sama panjang adalah...", Options: o("Sama sisi", "Sama kaki", "Siku-siku", "Sembarang"), Explanation: "Equilateral triangle."},
			{Text: "Rumus keliling persegi panjang adalah...", Options: o("2(p+l)", "p x l", "4 x s", "a + t"), Explanation: "K = 2(p+l)."},
			{Text: "Diagram batang digunakan untuk menyajikan...", Options: o("Data statistik", "Lukisan", "Peta", "Foto"), Explanation: "Visualisasi data."},
			{Text: "Mean dari data 2, 3, 4, 3 adalah...", Options: o("3", "2", "4", "3.5"), Explanation: "(2+3+4+3)/4 = 12/4 = 3."},
			{Text: "-5 x -4 = ...", Options: o("20", "-20", "9", "-9"), Explanation: "Negatif kali negatif = positif."},
			{Text: "Suhu awal -3C naik 10C menjadi...", Options: o("7C", "-13C", "13C", "-7C"), Explanation: "-3 + 10 = 7."},
		},
	})
	// Grade 8
	quizzes = append(quizzes, SeedQuiz{
		SubjectCode: "MAT", Grade: 8, Title: "Matematika Kelas VIII",
		Questions: []SeedQuestion{
			{Text: "Suku ke-5 dari barisan 2, 4, 6, 8, ... adalah...", Options: o("10", "12", "14", "8"), Explanation: "Un = 2n. Suku ke-5 = 10."},
			{Text: "Rumus suku ke-n barisan aritmatika adalah...", Options: o("Un = a + (n-1)b", "Un = a x r^(n-1)", "Un = n(n+1)", "Un = n^2"), Explanation: "Rumus aritmatika."},
			{Text: "Titik koordinat (3, -2) berada di kuadran...", Options: o("IV", "I", "II", "III"), Explanation: "x positif, y negatif = Kuadran IV."},
			{Text: "Relasi dari himpunan A ke B disebut fungsi jika...", Options: o("Setiap anggota A memiliki tepat satu pasangan di B", "Setiap anggota A memiliki 2 pasangan", "Ada anggota A yang tidak punya pasangan", "Anggota B habis dipasangkan"), Explanation: "Definisi fungsi."},
			{Text: "Gradien garis y = 3x + 2 adalah...", Options: o("3", "2", "-3", "-2"), Explanation: "y = mx + c. m = 3."},
			{Text: "Persamaan garis yang melalui (0,0) dan (2,4) adalah...", Options: o("y = 2x", "y = x", "y = 4x", "y = 0.5x"), Explanation: "m = (4-0)/(2-0) = 2. y = 2x."},
			{Text: "Sistem persamaan: x + y = 5, x - y = 1. Nilai x adalah...", Options: o("3", "2", "4", "5"), Explanation: "2x = 6 -> x = 3."},
			{Text: "Teorema Pythagoras berlaku pada segitiga...", Options: o("Siku-siku", "Sama sisi", "Tumpul", "Lancip"), Explanation: "Hanya segitiga siku-siku."},
			{Text: "Tripel Pythagoras di bawah ini adalah...", Options: o("3, 4, 5", "5, 12, 14", "6, 8, 11", "9, 10, 15"), Explanation: "3^2 + 4^2 = 5^2 (9+16=25)."},
			{Text: "Lingkaran: Sudut keliling yang menghadap diameter besarnya...", Options: o("90 derajat", "180 derajat", "45 derajat", "360 derajat"), Explanation: "Sudut keliling = 90 jika menghadap diameter."},
			{Text: "Luas lingkaran dengan jari-jari 7 cm adalah...", Options: o("154 cm2", "44 cm2", "22 cm2", "88 cm2"), Explanation: "22/7 * 7 * 7 = 154."},
			{Text: "Garis singgung lingkaran selalu ... terhadap jari-jari.", Options: o("Tegak lurus", "Sejajar", "Berimpit", "Bersilangan"), Explanation: "Tegak lurus di titik singgung."},
			{Text: "Bangun ruang sisi datar kecuali...", Options: o("Kerucut", "Kubus", "Balok", "Prisma"), Explanation: "Kerucut sisi lengkung."},
			{Text: "Volume kubus dengan rusuk 5 cm adalah...", Options: o("125 cm3", "25 cm3", "100 cm3", "150 cm3"), Explanation: "s^3 = 5^3 = 125."},
			{Text: "Banyak titik sudut pada balok adalah...", Options: o("8", "6", "12", "4"), Explanation: "8 titik sudut."},
			{Text: "Mean dari 4, 5, 6, 7, 8 adalah...", Options: o("6", "5", "7", "6.5"), Explanation: "Nilai tengah dan rata-rata simetris."},
			{Text: "Modus dari data 3, 3, 4, 5, 5, 5, 6 adalah...", Options: o("5", "3", "4", "6"), Explanation: "Paling sering muncul."},
			{Text: "Peluang muncul angka pada pelemparan koin adalah...", Options: o("1/2", "1/4", "1", "0"), Explanation: "Angka atau Gambar (1/2)."},
			{Text: "Peluang muncul mata dadu 7 pada pelemparan 1 dadu adalah...", Options: o("0 (Mustahil)", "1/6", "1", "1/2"), Explanation: "Dadu cuma sampai 6."},
			{Text: "Banyak ruang sampel 2 koin adalah...", Options: o("4", "2", "8", "6"), Explanation: "2^2 = 4 (AA, AG, GA, GG)."},
		},
	})
	// Grade 9
	quizzes = append(quizzes, SeedQuiz{
		SubjectCode: "MAT", Grade: 9, Title: "Matematika Kelas IX",
		Questions: []SeedQuestion{
			{Text: "Hasil dari 2 pangkat 3 adalah...", Options: o("8", "6", "5", "9"), Explanation: "2 x 2 x 2 = 8."},
			{Text: "Bentuk baku dari 0,0005 adalah...", Options: o("5 x 10^-4", "5 x 10^4", "50 x 10^-5", "0.5 x 10^-3"), Explanation: "Scientific notation."},
			{Text: "Hasil perkalian akar: √2 x √3 = ...", Options: o("√6", "√5", "6", "5"), Explanation: "√6."},
			{Text: "Akar-akar persamaan kuadrat x^2 - 5x + 6 = 0 diperloleh dengan faktorisasi...", Options: o("(x-2)(x-3)", "(x+2)(x+3)", "(x-1)(x-6)", "(x+1)(x-6)"), Explanation: "x=2, x=3."},
			{Text: "Diskriminan D = b^2 - 4ac. Jika D > 0 maka...", Options: o("Memiliki 2 akar real berbeda", "Memiliki 1 akar kembar", "Tidak punya akar real", "Akar imajiner"), Explanation: "Syarat 2 akar real."},
			{Text: "Grafik fungsi kuadrat berbentuk...", Options: o("Parabola", "Garis lurus", "Lingkaran", "Hiperbola"), Explanation: "Parabola."},
			{Text: "Titik puncak fungsi y = x^2 adalah...", Options: o("(0,0)", "(1,1)", "(-1,1)", "(0,1)"), Explanation: "Origin."},
			{Text: "Pencerminan titik A(2,3) terhadap sumbu x menjadi...", Options: o("A'(2,-3)", "A'(-2,3)", "A'(-2,-3)", "A'(3,2)"), Explanation: "y berubah tanda."},
			{Text: "Rotasi 90 derajat berlawanan jarum jam dari (1,0) pusat (0,0) adalah...", Options: o("(0,1)", "(0,-1)", "(-1,0)", "(1,1)"), Explanation: "Rotasi 90."},
			{Text: "Dilatasi [0, 2] dari titik (3,4) menghasilkan...", Options: o("(6,8)", "(1.5, 2)", "(5,6)", "(3,4)"), Explanation: "Dikali 2."},
			{Text: "Dua bangun datar dikatakan kongruen jika...", Options: o("Sama bentuk dan sama ukuran", "Sama bentuk beda ukuran", "Beda bentuk sama ukuran", "Sembarang"), Explanation: "Kongruen = sama persis."},
			{Text: "Syarat kesebangunan dua segitiga adalah...", Options: o("Sudut-sudut bersesuaian sama besar", "Sisi-sisi sama panjang", "Luas sama", "Keliling sama"), Explanation: "Sudut sama (AA)."},
			{Text: "Volume tabung dengan r=7 dan t=10 adalah...", Options: o("1540 cm3", "15400 cm3", "440 cm3", "220 cm3"), Explanation: "pi.r^2.t = 154 x 10 = 1540."},
			{Text: "Luas permukaan bola dengan r=7 adalah...", Options: o("616 cm2", "154 cm2", "308 cm2", "1386 cm2"), Explanation: "4.pi.r^2 = 4 x 154 = 616."},
			{Text: "Rumus volume kerucut adalah...", Options: o("1/3 pi r^2 t", "pi r^2 t", "4/3 pi r^3", "p x l x t"), Explanation: "1/3 volume tabung."},
			{Text: "Garis pelukis (s) kerucut berhubungan dengan r dan t melalui rumus...", Options: o("s^2 = r^2 + t^2", "s = r + t", "s^2 = r^2 - t^2", "t^2 = s^2 + r^2"), Explanation: "Pythagoras."},
			{Text: "Bangun ruang sisi lengkung contohnya...", Options: o("Tabung, Kerucut, Bola", "Kubus, Balok", "Prisma, Limas", "Persegi"), Explanation: "Curved surfaces."},
			{Text: "Hasil dari (2^3)^2 adalah...", Options: o("2^6", "2^5", "2^9", "8^2"), Explanation: "Pangkat dikalikan."},
			{Text: "Notasi ilmiah 2.500.000 adalah...", Options: o("2,5 x 10^6", "25 x 10^5", "2,5 x 10^5", "0,25 x 10^7"), Explanation: "2.5 juta."},
			{Text: "Sumbu simetri fungsi y = x^2 - 4x + 4 adalah...", Options: o("x = 2", "x = -2", "x = 4", "x = 0"), Explanation: "x = -b/2a = 4/2 = 2."},
		},
	})

	// --- 5. IPA (Ilmu Pengetahuan Alam) ---
	// Grade 7
	quizzes = append(quizzes, SeedQuiz{
		SubjectCode: "IPA", Grade: 7, Title: "Ilmu Pengetahuan Alam Kelas VII",
		Questions: []SeedQuestion{
			{Text: "Satuan SI untuk waktu adalah...", Options: o("Sekon/Detik", "Menit", "Jam", "Hari"), Explanation: "Second."},
			{Text: "Alat ukur massa adalah...", Options: o("Neraca", "Termometer", "Stopwatch", "Mistar"), Explanation: "Neraca/Timbangan."},
			{Text: "Ciri makhluk hidup yang bertujuan melestarikan jenisnya adalah...", Options: o("Berkembang biak", "Bernapas", "Bergerak", "Makan"), Explanation: "Reproduksi."},
			{Text: "Kelompok hewan menyusui disebut...", Options: o("Mamalia", "Aves", "Reptil", "Pisces"), Explanation: "Mamalia."},
			{Text: "Zat tunggal yang tidak dapat diuraikan lagi disebut...", Options: o("Unsur", "Senyawa", "Campuran", "Larutan"), Explanation: "Definition of Element."},
			{Text: "Lambang unsur Oksigen adalah...", Options: o("O", "H", "C", "N"), Explanation: "Oxygen."},
			{Text: "Kertas lakmus merah dicelupkan ke basa akan berwarna...", Options: o("Biru", "Merah", "Kuning", "Hijau"), Explanation: "Basa membirukan lakmus merah."},
			{Text: "Perubahan wujud padat ke cair disebut...", Options: o("Mencair", "Membeku", "Menguap", "Menyublim"), Explanation: "Melting."},
			{Text: "Satuan suhu dalam SI adalah...", Options: o("Kelvin", "Celcius", "Fahrenheit", "Reamur"), Explanation: "Kelvin."},
			{Text: "Kalor berpindah secara aliran zat disebut...", Options: o("Konveksi", "Konduksi", "Radiasi", "Isolasi"), Explanation: "Konveksi (fluida)."},
			{Text: "Sumber energi utama di bumi adalah...", Options: o("Matahari", "Batu bara", "Minyak bumi", "Angin"), Explanation: "Sun."},
			{Text: "Fotosintesis menghasilkan...", Options: o("Oksigen dan Glukosa", "Karbon dioksida", "Air", "Cahaya"), Explanation: "O2 + C6H12O6."},
			{Text: "Organisasi kehidupan terkecil adalah...", Options: o("Sel", "Jaringan", "Organ", "Sistem Organ"), Explanation: "Sel."},
			{Text: "Bagian sel yang mengatur seluruh kegiatan sel...", Options: o("Inti sel (Nukleus)", "Mitokondria", "Ribosom", "Vakuola"), Explanation: "Nukleus."},
			{Text: "Pencemaran udara disebabkan oleh gas...", Options: o("Karbon monoksida (CO)", "Oksigen", "Nitrogen", "Hidrogen"), Explanation: "CO dari kendaraan."},
			{Text: "Efek rumah kaca menyebabkan...", Options: o("Pemanasan global", "Pendinginan global", "Gempa bumi", "Tsunami"), Explanation: "Global warming."},
			{Text: "Lapisan bumi paling luar disebut...", Options: o("Kerak bumi", "Mantel", "Inti luar", "Inti dalam"), Explanation: "Crust."},
			{Text: "Benda langit yang memiliki ekor disebut...", Options: o("Komet", "Asteroid", "Meteor", "Planet"), Explanation: "Bintang berekor."},
			{Text: "Gerak bumi mengelilingi matahari disebut...", Options: o("Revolusi", "Rotasi", "Presesi", "Nutasi"), Explanation: "Revolusi Bumi (365 hari)."},
			{Text: "Pasang surut air laut disebabkan oleh...", Options: o("Gravitasi Bulan", "Angin", "Panas Matahari", "Ombak"), Explanation: "Tarikan bulan."},
		},
	})
	// Grade 8
	quizzes = append(quizzes, SeedQuiz{
		SubjectCode: "IPA", Grade: 8, Title: "Ilmu Pengetahuan Alam Kelas VIII",
		Questions: []SeedQuestion{
			{Text: "Gaya adalah...", Options: o("Tarikan atau dorongan", "Energi", "Daya", "Usaha"), Explanation: "F = ma."},
			{Text: "Hukum Newton I dikenal sebagai hukum...", Options: o("Kelembaman", "Aksi-Reaksi", "Percepatan", "Gravitasi"), Explanation: "Inersia."},
			{Text: "Energi kinetik adalah energi yang dimiliki benda karena...", Options: o("Geraknya", "Posisinya", "Panasnya", "Bentuknya"), Explanation: "1/2 mv^2."},
			{Text: "Pesawat sederhana yang digunakan untuk menimba air sumur adalah...", Options: o("Katrol", "Pengungkit", "Bidang miring", "Roda berporos"), Explanation: "Katrol tetap."},
			{Text: "Jaringan tumbuhan yang berfungsi mengangkut air dari akar adalah...", Options: o("Xilem", "Floem", "Epidermis", "Parenkim"), Explanation: "Xilem (Air)."},
			{Text: "Pencernaan mekanik terjadi di...", Options: o("Mulut", "Usus halus", "Kerongkongan", "Anus"), Explanation: "Gigi."},
			{Text: "Enzim ptialin terdapat di...", Options: o("Mulut/Ludah", "Lambung", "Pankreas", "Usus"), Explanation: "Mengubah amilum."},
			{Text: "Bahan pengawet buatan yang berbahaya adalah...", Options: o("Formalin", "Garam", "Gula", "Cuka"), Explanation: "Formalin."},
			{Text: "Zat adiktif pada rokok adalah...", Options: o("Nikotin", "Kafein", "Alkohol", "Morfin"), Explanation: "Nikotin."},
			{Text: "Jantung berfungsi untuk...", Options: o("Memompa darah", "Menyaring darah", "Menghasilkan oksigen", "Mencerna makanan"), Explanation: "Pompa darah."},
			{Text: "Pembuluh darah yang membawa darah keluar dari jantung disebut...", Options: o("Arteri", "Vena", "Kapiler", "Aorta"), Explanation: "Arteri."},
			{Text: "Penyakit kurang darah disebut...", Options: o("Anemia", "Leukemia", "Hipertensi", "Stroke"), Explanation: "Anemia."},
			{Text: "Tekanan zat cair pada kedalaman tertentu disebut tekanan...", Options: o("Hidrostatis", "Udara", "Darah", "Osnotik"), Explanation: "Hidrostatis."},
			{Text: "Bunyi tidak dapat merambat di...", Options: o("Ruang hampa", "Udara", "Air", "Benda padat"), Explanation: "Butuh medium."},
			{Text: "Cermin yang digunakan pada spion kendaraan adalah...", Options: o("Cermin Cembung", "Cermin Cekung", "Cermin Datar", "Lensa"), Explanation: "Agar bayangan luas."},
			{Text: "Alat optik untuk melihat benda kecil adalah...", Options: o("Mikroskop", "Teleskop", "Kamera", "Lup"), Explanation: "Mikroskop."},
			{Text: "Sistem ekskresi manusia yang menyaring darah adalah...", Options: o("Ginjal", "Hati", "Kulit", "Paru-paru"), Explanation: "Ginjal."},
			{Text: "Getaran yang merambat disebut...", Options: o("Gelombang", "Frekuensi", "Amplitudo", "Periode"), Explanation: "Gelombang."},
			{Text: "Nada adalah bunyi yang...", Options: o("Frekuensinya teratur", "Keras", "Lemah", "Tidak teratur (desah)"), Explanation: "Teratur."},
			{Text: "Bayangan pada retina mata bersifat...", Options: o("Nyata, terbalik, diperkecil", "Maya, tegak, diperbesar", "Nyata, tegak, sama besar", "Maya, terbalik, diperkecil"), Explanation: "Sifat bayangan mata."},
		},
	})
	// Grade 9
	quizzes = append(quizzes, SeedQuiz{
		SubjectCode: "IPA", Grade: 9, Title: "Ilmu Pengetahuan Alam Kelas IX",
		Questions: []SeedQuestion{
			{Text: "Pembelahan sel yang menghasilkan sel gamet (kelamin) adalah...", Options: o("Meiosis", "Mitosis", "Amitosis", "Fertilisasi"), Explanation: "Meiosis (haploid)."},
			{Text: "Organ reproduksi pria yang menghasilkan sperma adalah...", Options: o("Testis", "Penis", "Skrotum", "Vas deferens"), Explanation: "Testis."},
			{Text: "Peristiwa menempelnya serbuk sari di kepala putik disebut...", Options: o("Penyerbukan", "Pembuahan", "Penyebaran", "Pertumbuhan"), Explanation: "Polinasi."},
			{Text: "Hewan yang berkembang biak dengan bertelur disebut...", Options: o("Ovipar", "Vivipar", "Ovovivipar", "Spora"), Explanation: "Ovipar."},
			{Text: "Materi genetik yang membawa sifat keturunan adalah...", Options: o("DNA/Kromosom", "Darah", "Sel", "Protein"), Explanation: "Deoxyribonucleic acid."},
			{Text: "Persilangan dengan satu sifat beda disebut...", Options: o("Monohibrid", "Dihibrid", "Trihibrid", "Polihibrid"), Explanation: "Mono = satu."},
			{Text: "Benda bermuatan positif jika...", Options: o("Kekurangan elektron", "Kelebihan elektron", "Jumlah proton = elektron", "Tidak punya elektron"), Explanation: "Elektron pindah."},
			{Text: "Hukum Coulomb menjelaskan tentang...", Options: o("Gaya tarik/tolak antar muatan", "Arus listrik", "Tegangan", "Hambatan"), Explanation: "F = k.q1.q2/r^2."},
			{Text: "Satuan kuat arus listrik adalah...", Options: o("Ampere", "Volt", "Ohm", "Watt"), Explanation: "Ampere."},
			{Text: "Sumber arus searah (DC) contohnya...", Options: o("Baterai", "PLN", "Generator AC", "Dinamo sepeda"), Explanation: "Baterai/Akki."},
			{Text: "Alat pengukur tegangan listrik adalah...", Options: o("Voltmeter", "Amperemeter", "Ohmmeter", "Barometer"), Explanation: "Voltmeter."},
			{Text: "Energi listrik dapat diubah menjadi energi panas pada alat...", Options: o("Setrika", "Kipas angin", "Lampu LED", "Radio"), Explanation: "Setrika."},
			{Text: "Kemagnetan yang timbul karena aliran listrik disebut...", Options: o("Elektromagnetik", "Feromagnetik", "Induksi", "Permanen"), Explanation: "Elektromagnet."},
			{Text: "Bioteknologi konvensional menggunakan bantuan...", Options: o("Mikroorganisme (Jamur/Bakteri)", "Mesin canggih", "Rekayasa genetika", "Kloning"), Explanation: "Ragi tape, tempe."},
			{Text: "Produk bioteknologi: Tempe dibuat dengan bantuan jamur...", Options: o("Rhizopus oryzae", "Saccharomyces", "Lactobacillus", "Penicillium"), Explanation: "Rhizopus."},
			{Text: "Partikel penyusun atom bermuatan negatif adalah...", Options: o("Elektron", "Proton", "Neutron", "Positron"), Explanation: "Elektron."},
			{Text: "Nomor atom menunjukkan jumlah...", Options: o("Proton", "Neutron", "Massa", "Kulit"), Explanation: "Proton."},
			{Text: "Tanah yang subur banyak mengandung...", Options: o("Humus", "Pasir", "Liat", "Batu"), Explanation: "Humus."},
			{Text: "Teknologi ramah lingkungan contohnya...", Options: o("Panel surya", "Mesin diesel", "Plastik", "Pestisida"), Explanation: "Solar cell."},
			{Text: "Biogas dihasilkan dari fermentasi...", Options: o("Kotoran ternak", "Plastik", "Kertas", "Besi"), Explanation: "Metana."},
		},
	})

	return quizzes
}
