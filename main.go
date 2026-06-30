package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

type Contacts struct {
	Email     string   `json:"email"`
	Phone     string   `json:"phone"`
	Telegram  string   `json:"telegram"`
	Instagram string   `json:"instagram"`
	Address   string   `json:"address"`
	Socials   []Social `json:"socials"`
}

type Social struct {
	Name string `json:"name"`
	URL  string `json:"url"`
}

var contacts Contacts

func main() {
	// Получаем текущую рабочую директорию (там, где запущена программа)
	wd, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}

	// Путь к файлу данных
	dataPath := filepath.Join(wd, "data", "contacts.json")
	if err := loadContacts(dataPath); err != nil {
		log.Fatalf("Failed to load contacts: %v", err)
	}

	// API-эндпоинты
	http.HandleFunc("/api/contacts", contactsHandler)
	http.HandleFunc("/api/health", healthHandler)

	// Статические файлы
	staticDir := filepath.Join(wd, "static")
	fs := http.FileServer(http.Dir(staticDir))
	http.Handle("/", fs)

	// Порт из окружения или 8080 по умолчанию
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

func loadContacts(path string) error {
	file, err := os.Open(path)
	if err != nil {
		return err
	}
	defer file.Close()
	decoder := json.NewDecoder(file)
	return decoder.Decode(&contacts)
}

func contactsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(contacts)
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}
