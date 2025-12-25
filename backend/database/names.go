package database

import (
	"math/rand"
	"time"
)

var firstNames = []string{
	"Adi", "Budi", "Candra", "Dedi", "Eko", "Fajar", "Gilang", "Hadi", "Indra", "Joko",
	"Kurnia", "Lukman", "Mahendra", "Nanda", "Oki", "Prasetyo", "Qori", "Rahmat", "Satria", "Taufik",
	"Usman", "Vicky", "Wahyu", "Xaverius", "Yusuf", "Zainal",
	"Ayu", "Bunga", "Citra", "Dewi", "Endah", "Fitri", "Gita", "Hana", "Indah", "Juli",
	"Kartika", "Lestari", "Maya", "Nia", "Olivia", "Putri", "Qisya", "Ratna", "Sari", "Tia",
	"Ulfah", "Vina", "Wulan", "Xena", "Yulia", "Zahra",
	"Agus", "Bambang", "Cecep", "Doni", "Edi", "Feri", "Guntur", "Hendra", "Iwan", "Jamal",
	"Kevin", "Lalu", "Maman", "Noval", "Opik", "Panji", "Rudi", "Slamet", "Tono", "Ujang",
	"Vian", "Wawan", "Yudi", "Zulfikar",
	"Anita", "Bella", "Cahya", "Dina", "Elisa", "Fanny", "Gabriella", "Hesti", "Ika", "Jessica",
	"Karina", "Lina", "Melati", "Nadia", "Ocha", "Puspa", "Rina", "Siska", "Tari", "Utami",
	"Vera", "Winda", "Yanti", "Zaskia",
}

var lastNames = []string{
	"Aditya", "Budiman", "Cahyono", "Darmawan", "Ekaputra", "Firdaus", "Gunawan", "Hidayat", "Irawan", "Jaya",
	"Kusuma", "Lesmana", "Maulana", "Nugroho", "Oktaviani", "Pratama", "Qodri", "Ramadhan", "Santoso", "Triyono",
	"Utomo", "Vebrianto", "Wibowo", "Yulianto", "Zulkarnain",
	"Anggraini", "Basuki", "Chairunnisa", "Damayanti", "Effendi", "Fadhilah", "Gumelar", "Handayani", "Indriyani", "Jannah",
	"Kusumawardhani", "Larasati", "Maharani", "Novitasari", "Oktavia", "Pertiwi", "Rahmawati", "Saputri", "Triana", "Utami",
	"Veronica", "Wulandari", "Yuliani", "Zahroh",
	"Saputra", "Wijaya", "Kurniawan", "Sanjaya", "Setiawan", "Herry", "Susanto", "Siregar", "Simanjuntak", "Pasaribu",
	"Nasution", "Lubis", "Harahap", "Batubara", "Hutasuhut", "Rangkuti", "Daulay", "Hasibuan", "Ritonga", "Marpaung",
	"Sitorus", "Manurung", "Pangabean", "Tampubolon", "Sitompul", "Hutapea", "Panggabean",
}

// GenerateRandomName generates a random full name combining a first and last name.
func GenerateRandomName() string {
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	first := firstNames[r.Intn(len(firstNames))]
	last := lastNames[r.Intn(len(lastNames))]
	return first + " " + last
}
