# 📚 BOOKS4EVERYONE

Benvenuto in **BOOKS4EVERYONE** – una piattaforma moderna dove utenti possono **vendere**, **noleggiare** e **commentare** libri!  
Un progetto full-stack sviluppato con 💻 **React**, **Node.js**, **Express** e **MongoDB**.

---

## 🚀 Funzionalità principali

- 👤 Registrazione / Login con autenticazione JWT
- 📚 Aggiunta, modifica ed eliminazione delle offerte (libri)
- 🛒 Carrello intelligente con opzioni di noleggio o acquisto
- 💬 Commenti con valutazione a stelle
- 🧾 Storico ordini visualizzabile
- 📱 Design responsive (desktop, tablet, mobile)

---

## 🔧 Tecnologie utilizzate

- ⚛️ **React** (Vite) + React Router
- 🎨 **Bootstrap** + React-Bootstrap
- 🧠 **Node.js + Express** (API RESTful)
- 🛢️ **MongoDB** + Mongoose
- 🔐 **JWT** per l'autenticazione
- 📦 **Multer** per l’upload immagini
- 💬 **Axios** per le chiamate HTTP
- 🌍 **Render** per il backend – **Vercel** per il frontend

---

## 📁 Struttura del progetto
📦 books4everyone/
┣ 📁 frontend/      → Client React
┣ 📁 Back_end/      → API Node.js + MongoDB
┣ 📄 README.md

---

## ⚙️ Istruzioni per il setup locale

### 1. Clona la repository
```bash
git clone https://github.com/tuo-username/books4everyone.git
cd books4everyone

cd Back_end
npm install
node index.js

MONGO_URI=mongodb+srv://...
JWT_SECRET=tuo_segreto

cd ../frontend
npm install
npm run dev

📦 Deploy
	•	✅ Backend: Render
	•	✅ Frontend: Vercel

🌱 Sviluppi futuri
	•	📧 Notifiche via email automatiche per ordini/commenti
	•	🔎 Filtro e ricerca avanzata offerte
	•	📅 Calendario per gestire i periodi di noleggio
	•	🏷️ Sistema di tag/categorie libri


👨‍💻 Autore

Progetto sviluppato da Massimiliano Cavallo
📅 Capstone – Epicode
📬 Contatti: ca_messy@hotmail.it