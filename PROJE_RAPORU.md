# 📊 PracticeForge — Proje Raporu

> **Oluşturulma tarihi:** 29 Nisan 2026  
> **Repo:** https://github.com/uSoyrac/personinapp  
> **Durum:** MVP tamamlandı, çalışır durumda ✅

---

## 🎯 Proje Nedir?

PracticeForge, IELTS Academic ve TOEFL iBT sınavlarına hazırlanan öğrenciler için yapay zeka destekli kişiselleştirilmiş pratik içerik üreten bir web uygulamasıdır.

**Temel fikir:** Kullanıcı herhangi bir akademik makale, ders notu veya transkript yapıştırır → uygulama saniyeler içinde gerçek sınav stilinde pratik materyali üretir.

> ⚠️ **Önemli:** PracticeForge bağımsız bir çalışma aracıdır. IELTS, TOEFL, ETS, British Council, IDP veya Cambridge ile **hiçbir resmi bağlantısı yoktur.** Üretilen band/skor tahminleri resmi sonuç değildir.

---

## 🚀 Hızlı Başlangıç

### Yerel çalıştırma

```bash
# 1. Bağımlılıkları yükle
npm install

# 2. (Opsiyonel) OpenAI API anahtarını ekle
cp .env.local.example .env.local
# .env.local dosyasını aç ve OPENAI_API_KEY değerini gir

# 3. Geliştirme sunucusunu başlat
npm run dev

# 4. Tarayıcıda aç
# http://localhost:3000
```

> 💡 API anahtarı olmadan da çalışır! Demo modu gerçekçi örnek içerik gösterir.

---

## 🛠️ Teknik Yapı

### Tech Stack

| Katman | Teknoloji |
|---|---|
| Framework | Next.js 16 (App Router) |
| Dil | TypeScript |
| Stil | Vanilla CSS (custom design tokens, dark mode) |
| Yapay Zeka | OpenAI API (`gpt-4o-mini` + `gpt-4o`) |
| Font | Inter + DM Serif Display (Google Fonts) |
| Platform | Node.js 24 |

### Klasör Yapısı

```
practiceforge/
├── app/
│   ├── page.tsx                      # Ana sayfa (landing page)
│   ├── layout.tsx                    # Kök layout, Nav, Footer
│   ├── globals.css                   # Tasarım sistemi, CSS token'ları
│   ├── api/
│   │   ├── generate/route.ts         # POST /api/generate
│   │   └── writing-feedback/route.ts # POST /api/writing-feedback
│   ├── practice/
│   │   ├── page.tsx                  # Pratik üretici sayfası
│   │   └── writing-feedback/page.tsx # Yazma geri bildirim sayfası
│   └── pricing/
│       └── page.tsx                  # Fiyatlandırma sayfası
├── components/
│   ├── Nav.tsx                       # Yapışkan navigasyon
│   ├── Footer.tsx                    # Footer + yasal uyarı
│   ├── FeatureGrid.tsx               # Özellik grid'i (client component)
│   ├── ResultTabs.tsx                # 5 sekmeli sonuç konteyneri
│   ├── WritingFeedbackCard.tsx       # Yazma geri bildirimi kartı
│   └── results/
│       ├── SummaryCard.tsx           # Metin özeti + temalar
│       ├── ReadingCard.tsx           # İnteraktif soru-cevap
│       ├── VocabularyCard.tsx        # Genişletilebilir kelime kartları
│       ├── WritingCard.tsx           # Yazma + konuşma promptları
│       └── StudyPlanCard.tsx         # 7 günlük çalışma planı zaman çizelgesi
├── lib/
│   └── ai/
│       ├── generatePractice.ts       # AI soyutlama katmanı (ana giriş noktası)
│       ├── prompts.ts                # Tüm prompt builder'ları
│       └── mockData.ts               # API anahtarı olmadan gerçekçi demo içerik
└── types/
    └── index.ts                      # Tüm TypeScript tipleri
```

---

## ✅ Tamamlanan Özellikler (MVP)

### Sayfalar

| Sayfa | URL | Açıklama |
|---|---|---|
| Ana Sayfa | `/` | Hero, demo önizleme, nasıl çalışır, özellikler, kişiler, uyarı |
| Pratik Üretici | `/practice` | Tam form + sekmeli sonuçlar |
| Yazma Geri Bildirimi | `/practice/writing-feedback` | Essay analizi + band tahmini |
| Fiyatlandırma | `/pricing` | 4 katman UI (ödeme henüz yok) |

### Pratik Üretici Akışı

1. **Sınav seçimi** — IELTS Academic veya TOEFL iBT
2. **Beceri odağı** — Okuma, Yazma, Konuşma, Kelime veya Tam Pratik
3. **Metin alanı** — Herhangi bir akademik içerik yapıştırılır
4. **Opsiyonel detaylar** — Mevcut seviye (B1/B2/C1), hedef puan, sınav tarihi, zayıf alan
5. **Üretilen içerik** (tek tıkla, 5 sekmede):
   - 📝 **Özet** — Metnin akademik özeti + anahtar temalar
   - 📖 **Okuma** — 5 sınav tipi soru, cevap anahtarı ve açıklamalar (interaktif)
   - 🔤 **Kelime** — 6-10 akademik kelime, tanım, örnek cümle, kollokasyonlar
   - ✍️ **Yazma/Konuşma** — Bir yazma promptu + bir konuşma promptu + 4 takip sorusu
   - 📅 **Çalışma Planı** — Kişiselleştirilmiş 7 günlük mikro plan

### Yazma Geri Bildirimi

- Kullanıcı essay yazar → AI 4 IELTS boyutunda analiz eder:
  - Task Response (Görev Yanıtı)
  - Coherence & Cohesion (Tutarlılık)
  - Lexical Resource (Sözcük Kaynağı)
  - Grammatical Range & Accuracy (Dil Bilgisi)
- Tahmini band aralığı (örn. `6.0–6.5`)
- AI tarafından yazılmış geliştirilmiş versiyon
- 3 somut sonraki egzersiz önerisi
- Her sonuçta resmi skor olmadığına dair uyarı

### Yapay Zeka Katmanı

```
lib/ai/generatePractice.ts
├── hasApiKey()           → .env.local'den OPENAI_API_KEY kontrol eder
├── generatePractice()    → Pratik oturumu üretir
│   ├── API varsa → OpenAI'yi paralel 4 istek ile çağırır (hızlı)
│   └── API yoksa → mockData.ts'den gerçekçi demo döner (1.2sn gecikme ile)
└── generateWritingFeedback() → Essay analizi
    ├── API varsa → gpt-4o (daha güçlü model)
    └── API yoksa → mock feedback döner
```

**Prompt güvenlik önlemleri:**
- Resmi puan iddiası yok
- Band aralıkları ile gösterim (kesin değer değil)
- Her sonuçta disclaimer
- 50 karakter altı metin için hata mesajı
- Kısa essay (50 kelime altı) için uyarı

---

## 🎨 Tasarım Sistemi

### Renk Paleti (Dark Mode)

| Token | Değer | Kullanım |
|---|---|---|
| `--background` | `#0f172a` | Sayfa arka planı |
| `--surface` | `#1e293b` | Kartlar |
| `--primary` | `#6366f1` | Indigo — CTA, aktif sekmeler |
| `--accent` | `#10b981` | Emerald — başarı, doğru cevap |
| `--foreground` | `#f1f5f9` | Ana metin |
| `--foreground-muted` | `#94a3b8` | İkincil metin |

### Animasyonlar
- `fadeIn` — sonuçlar belirdiğinde
- `shimmer` — yükleme skeleton'ı
- `float` — dekoratif elementler
- `spin-slow` — yükleme ikonu

---

## 📡 API Dokümantasyonu

### `POST /api/generate`

**İstek:**
```json
{
  "examType": "IELTS_ACADEMIC" | "TOEFL_IBT",
  "skillFocus": "Full" | "Reading" | "Writing" | "Speaking" | "Vocabulary",
  "inputText": "string (min 50 karakter)",
  "level": "B1" | "B2" | "C1",
  "targetScore": "string (opsiyonel)",
  "examDate": "string (opsiyonel)",
  "weakArea": "string (opsiyonel)"
}
```

**Başarılı Yanıt:** `PracticeGenerationResult` (bkz. `types/index.ts`)

### `POST /api/writing-feedback`

**İstek:**
```json
{
  "userAnswer": "string (min 50 kelime)",
  "writingPrompt": "string",
  "examType": "IELTS_ACADEMIC" | "TOEFL_IBT",
  "level": "B1" | "B2" | "C1"
}
```

**Başarılı Yanıt:** `WritingFeedbackResult` (bkz. `types/index.ts`)

---

## 🔧 Çevre Değişkenleri

| Değişken | Zorunlu | Açıklama |
|---|---|---|
| `OPENAI_API_KEY` | Hayır | OpenAI API anahtarı. Yoksa demo modu devreye girer. |
| `NEXT_PUBLIC_APP_URL` | Hayır | Uygulama URL'si (ilerideki kullanım için) |

---

## 🗺️ Gelecek Geliştirmeler (Roadmap)

### 🔴 Kısa Vadeli (1-4 hafta)

| Özellik | Açıklama | Zorluk |
|---|---|---|
| **Kullanıcı kaydı/girişi** | Supabase Auth ile e-posta + sosyal giriş | Orta |
| **Oturum kaydı** | Üretilen pratikleri kaydetme ve geçmişe bakma | Orta |
| **Streaming yanıtlar** | AI yanıtlarını akış olarak göster (daha hızlı UX) | Orta |
| **PDF export** | Pratik oturumunu PDF olarak indirme | Kolay |

### 🟡 Orta Vadeli (1-3 ay)

| Özellik | Açıklama | Zorluk |
|---|---|---|
| **Stripe ödeme** | Plus/Pro/Teacher katmanları için gerçek ödeme | Zor |
| **İlerleme takibi** | Puan geçmişi, zayıf alanlar, grafik dashboard | Zor |
| **Kelime tekrar sistemi** | Spaced repetition (Anki tarzı) kelime kartları | Orta |
| **Konuşma geri bildirimi** | Whisper API ile ses kaydı analizi | Çok zor |
| **Birden fazla AI sağlayıcı** | Anthropic Claude veya Google Gemini seçeneği | Kolay |

### 🟢 Uzun Vadeli (3+ ay)

| Özellik | Açıklama | Zorluk |
|---|---|---|
| **Öğretmen paneli** | Öğrencilere görev atama, ilerleme görüntüleme | Çok zor |
| **YouTube transkript entegrasyonu** | Video URL'den otomatik metin çekme | Zor |
| **Mobil uygulama** | React Native veya PWA | Çok zor |
| **Toplu içerik üretimi** | Öğretmenler için 30+ öğrenciye aynı anda içerik | Orta |
| **Özelleştirilmiş mock test** | Tam IELTS/TOEFL oturumu simülasyonu (zamanlayıcılı) | Zor |

---

## 🐛 Bilinen Sınırlamalar (MVP)

1. **Oturum kaydı yok** — Sayfa yenilenince üretilen içerik kaybolur (Supabase henüz bağlanmadı)
2. **Demo içeriği sabit** — API anahtarı olmadan her seferinde aynı örnek içerik gösterilir
3. **Konuşma geri bildirimi yok** — Sadece metin tabanlı (ses desteği yok)
4. **Mobil menü** — Küçük ekranlarda hamburger menü bazı tarayıcılarda CSS sınırlaması yaşayabilir
5. **Ödeme sistemi yok** — Fiyatlandırma sayfası sadece UI, fonksiyonel değil

---

## 📈 Önerilen İlk Adımlar (Sonraki Sprint)

```
1. [ ] Supabase projesi oluştur → kullanıcı kaydı/girişi ekle
2. [ ] practice_sessions tablosu → oturumları kaydet
3. [ ] writing_feedback tablosu → geri bildirimleri kaydet  
4. [ ] Kullanıcı dashboard'u → geçmiş pratikler, ilerleme
5. [ ] Vercel deploy → canlı URL ile test
6. [ ] Stripe entegrasyonu → Plus planı aktif et
```

---

## 🔗 Linkler

- **GitHub:** https://github.com/uSoyrac/personinapp
- **Yerel:** http://localhost:3000 (npm run dev ile)
- **Geliştirici:** uSoyrac

---

*PracticeForge — AI-powered exam practice. Not affiliated with IELTS, TOEFL, ETS, British Council, IDP, or Cambridge.*
