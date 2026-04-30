export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  coverImage: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "ielts-speaking-7-sirleri",
    title: "IELTS Speaking'den 7.0 Almanın Sırları",
    excerpt: "IELTS Speaking sınavında 7.0 ve üzeri almak için gereken kelime dağarcığı ve akıcılık taktikleri.",
    date: "2026-05-01",
    author: "PracticeForge Ekibi",
    coverImage: "https://images.unsplash.com/photo-1546410531-dd4cb8cdfc1c?w=800&auto=format&fit=crop",
    content: `
# IELTS Speaking'den 7.0 Almanın Sırları

IELTS Speaking bölümü pek çok öğrenci için streslidir. Ancak doğru strateji ve düzenli pratikle 7.0 ve üzeri bir skor almak kesinlikle mümkündür. 

## 1. Kelime Dağarcığınızı Genişletin (Lexical Resource)
Sadece temel kelimeleri kullanmak yerine, konuya uygun (topic-specific) kelimeler seçin. Örneğin "good" yerine "beneficial" veya "outstanding" kelimelerini kullanmak puanınızı artırır.

## 2. Akıcılık (Fluency)
Duraksamak normaldir ancak duraksadığınızda "umm", "ahh" demek yerine "That's an interesting question..." gibi doldurucu cümleler kullanın.

## 3. Yapay Zeka ile Pratik Yapın
Uygulamamızdaki **Premium Speaking Agent** ile her gün 2 dakika pratik yapmak, sınav stresini yenmenize ve anında geri bildirim almanıza yardımcı olur.
    `
  },
  {
    slug: "toefl-okuma-hizlandirma",
    title: "TOEFL Reading İçin Hızlı Okuma Teknikleri",
    excerpt: "TOEFL sınavında zaman yetiştirememe sorunu yaşıyorsanız, bu skimming ve scanning tekniklerini hemen uygulayın.",
    date: "2026-04-28",
    author: "PracticeForge Ekibi",
    coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&auto=format&fit=crop",
    content: `
# TOEFL Reading İçin Hızlı Okuma Teknikleri

Zaman yönetimi TOEFL iBT Reading bölümünün en zorlu yanlarından biridir.

## Skimming ve Scanning
Skimming, metnin ana fikrini anlamak için hızlıca göz gezdirmektir. Scanning ise belirli bir kelimeyi veya tarihi bulmak için metni taramaktır.

Metni baştan sona kelime kelime okumak yerine, önce ilk ve son cümlelere odaklanın.

## Soru Bankası Kullanımı
PracticeForge üzerindeki metinleri okurken bilmediğiniz kelimeleri anında **Soru Bankanıza** kaydedin. Böylece aynı hataları tekrarlamazsınız.
    `
  }
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(post => post.slug === slug);
}
