```markdown
# 🍳 Resep Nusantara - Aplikasi Resep Masakan Indonesia Tugas Kelompok 32

Aplikasi PWA (Progressive Web App) untuk menjelajahi resep masakan dan minuman khas Indonesia dengan fitur favorit, pencarian, dan manajemen resep.

![React](https://img.shields.io/badge/React-18.2.0-blue)
![PWA](https://img.shields.io/badge/PWA-✅-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Fitur Utama

- 🍽️ **Koleksi Resep Lengkap** - Resep makanan dan minuman tradisional Indonesia
- ⭐ **Sistem Favorit** - Simpan resep favorit dengan sync ke backend
- 🔍 **Pencarian & Filter** - Cari resep berdasarkan nama, kategori, tingkat kesulitan
- 📱 **PWA Ready** - Dapat diinstall di mobile dan desktop
- 🚀 **Performance Optimized** - Caching dan lazy loading untuk pengalaman terbaik
- 🎨 **Modern UI** - Glassmorphism design dengan animasi smooth
- 👤 **Manajemen Profil** - Ubah avatar dan username

## 🛠️ Teknologi yang Digunakan

- **Frontend**: React 18, React Router DOM
- **State Management**: React Query (TanStack Query)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **PWA**: Workbox, Service Worker

## 📦 Instalasi dan Menjalankan

### Prerequisites
- Node.js 16+ 
- npm atau yarn

### Langkah Instalasi

1. **Clone repository**
```bash
git clone https://github.com/username/resep-nusantara.git
cd resep-nusantara
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```
Edit `.env` file:
```env
VITE_API_BASE_URL=https://your-api-url.com/api
VITE_APP_NAME=Resep Nusantara
```

4. **Jalankan development server**
```bash
npm run dev
```

5. **Build untuk production**
```bash
npm run build
```

6. **Preview production build**
```bash
npm run preview
```

## 🚀 Scripts Available

- `npm run dev` - Menjalankan development server
- `npm run build` - Build production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run serve` - Serve PWA locally

## 📁 Struktur Project

```
src/
├── components/          # Komponen reusable
│   ├── common/         # Komponen umum (Button, Image, dll)
│   ├── makanan/        # Komponen khusus halaman makanan
│   ├── minuman/        # Komponen khusus halaman minuman
│   ├── navbar/         # Navigation components
│   └── recipe/         # Komponen detail resep
├── hooks/              # Custom React hooks
│   ├── useRecipes.js   # Hook untuk fetch resep
│   └── useFavorites.js # Hook untuk manajemen favorit
├── pages/              # Halaman aplikasi
│   ├── HomePage.jsx
│   ├── MakananPage.jsx
│   ├── MinumanPage.jsx
│   ├── ProfilePage.jsx
│   └── SplashScreen.jsx
├── services/           # API services
│   ├── recipeService.js
│   ├── favoriteService.js
│   └── userService.js
├── main.jsx           # Entry point aplikasi
└── index.css          # Global styles
```

## 🎯 Fitur Performance

### Caching Strategy
- **React Query Caching**: Data API di-cache selama 5 menit
- **Disk Cache**: Gambar dan assets di-cache oleh browser
- **Stale While Revalidate**: Tampilkan data lama sambil fetch yang baru

### Lazy Loading
- **Image Lazy Load**: Gambar hanya load saat masuk viewport
- **Component Lazy Load**: Komponen besar di-load secara dinamis
- **Route-based Code Splitting**: Bundle terpisah per halaman

### PWA Features
- **Offline Support**: Buka aplikasi tanpa koneksi
- **Installable**: Install di home screen seperti native app
- **Fast Loading**: Service worker caching untuk load instant

## 📱 Halaman Aplikasi

### 🏠 Home Page
- Overview resep trending
- Quick navigation ke kategori
- Featured recipes

### 🍛 Makanan Page
- Grid layout resep makanan
- Advanced filtering system
- Pagination untuk resep banyak

### 🥤 Minuman Page  
- Koleksi resep minuman tradisional
- Filter by difficulty dan prep time
- Search functionality

### 👤 Profile Page
- Kelola profil pengguna
- Daftar resep favorit
- Edit avatar dan username

### 📖 Recipe Detail
- Detail lengkap resep
- Bahan dan langkah memasak
- Tombol favorit dan share

## 🔧 Konfigurasi API

Aplikasi membutuhkan backend API dengan endpoint berikut:

```javascript
// Recipe endpoints
GET /recipes?category=makanan&search=keyword
GET /recipes/:id

// Favorite endpoints  
POST /favorites/toggle
GET /favorites/:userIdentifier

// User endpoints
GET /user/profile
POST /user/avatar
POST /user/username
```

## 🧪 Testing Performance

### Verifikasi Caching & Lazy Loading

1. **Buka DevTools** → **Network tab**
2. **Filter by "Img"** untuk monitor gambar
3. **Reload halaman** dan scroll
4. **Amati**: 
   - Gambar load bertahap saat scroll
   - Cache hit terlihat dari "(disk cache)"
   - API calls berkurang setelah cache

### Lighthouse Audit
```bash
# Hasil target Lighthouse
Performance: 90+
PWA: 95+
Accessibility: 95+
Best Practices: 95+
SEO: 90+
```

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 Lisensi

Distributed under the MIT License. See `LICENSE` for more information.

## 👥 Tim Pengembang

- **Your Name** - Lead Developer - [GitHub](https://github.com/username)

## 🙏 Acknowledgments

- Design inspiration from modern PWA examples
- Icons by [Lucide React](https://lucide.dev)
- UI components with [Tailwind CSS](https://tailwindcss.com)

---

<div align="center">

**⭐ Jangan lupa kasih star jika project ini membantu! ⭐**

</div>
```