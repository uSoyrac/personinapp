/**
 * Translations — Multilingual vocabulary support
 * TR, ES, DE, FR translations for common academic words
 */

export type NativeLanguage = "tr" | "es" | "de" | "fr";

export const LANGUAGE_LABELS: Record<NativeLanguage, string> = {
  tr: "Türkçe",
  es: "Español",
  de: "Deutsch",
  fr: "Français",
};

export const LANGUAGE_FLAGS: Record<NativeLanguage, string> = {
  tr: "🇹🇷",
  es: "🇪🇸",
  de: "🇩🇪",
  fr: "🇫🇷",
};

// Academic word translations
const DICT: Record<string, Record<NativeLanguage, string>> = {
  analysis: { tr: "analiz", es: "análisis", de: "Analyse", fr: "analyse" },
  approach: { tr: "yaklaşım", es: "enfoque", de: "Ansatz", fr: "approche" },
  environment: { tr: "çevre", es: "medio ambiente", de: "Umwelt", fr: "environnement" },
  research: { tr: "araştırma", es: "investigación", de: "Forschung", fr: "recherche" },
  significant: { tr: "önemli", es: "significativo", de: "bedeutend", fr: "significatif" },
  process: { tr: "süreç", es: "proceso", de: "Prozess", fr: "processus" },
  impact: { tr: "etki", es: "impacto", de: "Auswirkung", fr: "impact" },
  structure: { tr: "yapı", es: "estructura", de: "Struktur", fr: "structure" },
  concept: { tr: "kavram", es: "concepto", de: "Konzept", fr: "concept" },
  evidence: { tr: "kanıt", es: "evidencia", de: "Beweis", fr: "preuve" },
  method: { tr: "yöntem", es: "método", de: "Methode", fr: "méthode" },
  theory: { tr: "teori", es: "teoría", de: "Theorie", fr: "théorie" },
  policy: { tr: "politika", es: "política", de: "Politik", fr: "politique" },
  factor: { tr: "faktör", es: "factor", de: "Faktor", fr: "facteur" },
  data: { tr: "veri", es: "datos", de: "Daten", fr: "données" },
  context: { tr: "bağlam", es: "contexto", de: "Kontext", fr: "contexte" },
  response: { tr: "yanıt", es: "respuesta", de: "Antwort", fr: "réponse" },
  community: { tr: "topluluk", es: "comunidad", de: "Gemeinschaft", fr: "communauté" },
  resources: { tr: "kaynaklar", es: "recursos", de: "Ressourcen", fr: "ressources" },
  potential: { tr: "potansiyel", es: "potencial", de: "Potenzial", fr: "potentiel" },
  sustainable: { tr: "sürdürülebilir", es: "sostenible", de: "nachhaltig", fr: "durable" },
  biodiversity: { tr: "biyoçeşitlilik", es: "biodiversidad", de: "Biodiversität", fr: "biodiversité" },
  ecosystem: { tr: "ekosistem", es: "ecosistema", de: "Ökosystem", fr: "écosystème" },
  infrastructure: { tr: "altyapı", es: "infraestructura", de: "Infrastruktur", fr: "infrastructure" },
  conservation: { tr: "koruma", es: "conservación", de: "Naturschutz", fr: "conservation" },
  ecological: { tr: "ekolojik", es: "ecológico", de: "ökologisch", fr: "écologique" },
  urbanisation: { tr: "kentleşme", es: "urbanización", de: "Urbanisierung", fr: "urbanisation" },
  fragmentation: { tr: "parçalanma", es: "fragmentación", de: "Fragmentierung", fr: "fragmentation" },
  restoration: { tr: "restorasyon", es: "restauración", de: "Wiederherstellung", fr: "restauration" },
  phenomenon: { tr: "fenomen", es: "fenómeno", de: "Phänomen", fr: "phénomène" },
  correlation: { tr: "korelasyon", es: "correlación", de: "Korrelation", fr: "corrélation" },
  hypothesis: { tr: "hipotez", es: "hipótesis", de: "Hypothese", fr: "hypothèse" },
  paradigm: { tr: "paradigma", es: "paradigma", de: "Paradigma", fr: "paradigme" },
  methodology: { tr: "metodoloji", es: "metodología", de: "Methodik", fr: "méthodologie" },
  comprehensive: { tr: "kapsamlı", es: "integral", de: "umfassend", fr: "complet" },
  fundamental: { tr: "temel", es: "fundamental", de: "grundlegend", fr: "fondamental" },
  contemporary: { tr: "çağdaş", es: "contemporáneo", de: "zeitgenössisch", fr: "contemporain" },
  predominant: { tr: "baskın", es: "predominante", de: "vorherrschend", fr: "prédominant" },
  subsequent: { tr: "sonraki", es: "subsiguiente", de: "nachfolgend", fr: "subséquent" },
  preliminary: { tr: "ön", es: "preliminar", de: "vorläufig", fr: "préliminaire" },
  demonstrate: { tr: "göstermek", es: "demostrar", de: "demonstrieren", fr: "démontrer" },
  facilitate: { tr: "kolaylaştırmak", es: "facilitar", de: "erleichtern", fr: "faciliter" },
  implement: { tr: "uygulamak", es: "implementar", de: "umsetzen", fr: "mettre en œuvre" },
  enhance: { tr: "geliştirmek", es: "mejorar", de: "verbessern", fr: "améliorer" },
  contribute: { tr: "katkıda bulunmak", es: "contribuir", de: "beitragen", fr: "contribuer" },
  integrate: { tr: "entegre etmek", es: "integrar", de: "integrieren", fr: "intégrer" },
  transformation: { tr: "dönüşüm", es: "transformación", de: "Transformation", fr: "transformation" },
  interpretation: { tr: "yorum", es: "interpretación", de: "Interpretation", fr: "interprétation" },
  evaluation: { tr: "değerlendirme", es: "evaluación", de: "Bewertung", fr: "évaluation" },
  distribution: { tr: "dağılım", es: "distribución", de: "Verteilung", fr: "distribution" },
  consequence: { tr: "sonuç", es: "consecuencia", de: "Konsequenz", fr: "conséquence" },
  perspective: { tr: "bakış açısı", es: "perspectiva", de: "Perspektive", fr: "perspective" },
  implication: { tr: "çıkarım", es: "implicación", de: "Implikation", fr: "implication" },
  observation: { tr: "gözlem", es: "observación", de: "Beobachtung", fr: "Beobachtung" },
  development: { tr: "gelişim", es: "desarrollo", de: "Entwicklung", fr: "développement" },
  application: { tr: "uygulama", es: "aplicación", de: "Anwendung", fr: "application" },
  circumstance: { tr: "koşul", es: "circunstancia", de: "Umstand", fr: "circonstance" },
  corridor: { tr: "koridor", es: "corredor", de: "Korridor", fr: "corridor" },
  refuge: { tr: "sığınak", es: "refugio", de: "Zuflucht", fr: "refuge" },
  migration: { tr: "göç", es: "migración", de: "Migration", fr: "migration" },
  species: { tr: "tür", es: "especie", de: "Art", fr: "espèce" },
  habitat: { tr: "yaşam alanı", es: "hábitat", de: "Lebensraum", fr: "habitat" },
  wildlife: { tr: "yaban hayatı", es: "vida silvestre", de: "Tierwelt", fr: "faune" },
  vegetation: { tr: "bitki örtüsü", es: "vegetación", de: "Vegetation", fr: "végétation" },
  pollution: { tr: "kirlilik", es: "contaminación", de: "Verschmutzung", fr: "pollution" },
  climate: { tr: "iklim", es: "clima", de: "Klima", fr: "climat" },
  renewable: { tr: "yenilenebilir", es: "renovable", de: "erneuerbar", fr: "renouvelable" },
  agriculture: { tr: "tarım", es: "agricultura", de: "Landwirtschaft", fr: "agriculture" },
  innovation: { tr: "yenilik", es: "innovación", de: "Innovation", fr: "innovation" },
  efficiency: { tr: "verimlilik", es: "eficiencia", de: "Effizienz", fr: "efficacité" },
  inequality: { tr: "eşitsizlik", es: "desigualdad", de: "Ungleichheit", fr: "inégalité" },
  diversity: { tr: "çeşitlilik", es: "diversidad", de: "Vielfalt", fr: "diversité" },
  strategy: { tr: "strateji", es: "estrategia", de: "Strategie", fr: "stratégie" },
  investment: { tr: "yatırım", es: "inversión", de: "Investition", fr: "investissement" },
  regulation: { tr: "düzenleme", es: "regulación", de: "Regulierung", fr: "régulation" },
  technology: { tr: "teknoloji", es: "tecnología", de: "Technologie", fr: "technologie" },
  population: { tr: "nüfus", es: "población", de: "Bevölkerung", fr: "population" },
  proportion: { tr: "oran", es: "proporción", de: "Anteil", fr: "proportion" },
  assumption: { tr: "varsayım", es: "suposición", de: "Annahme", fr: "hypothèse" },
  criterion: { tr: "kriter", es: "criterio", de: "Kriterium", fr: "critère" },
  dimension: { tr: "boyut", es: "dimensión", de: "Dimension", fr: "dimension" },
  framework: { tr: "çerçeve", es: "marco", de: "Rahmen", fr: "cadre" },
  mechanism: { tr: "mekanizma", es: "mecanismo", de: "Mechanismus", fr: "mécanisme" },
  objective: { tr: "amaç", es: "objetivo", de: "Ziel", fr: "objectif" },
  principle: { tr: "ilke", es: "principio", de: "Prinzip", fr: "principe" },
  technique: { tr: "teknik", es: "técnica", de: "Technik", fr: "technique" },
  variable: { tr: "değişken", es: "variable", de: "Variable", fr: "variable" },
};

/** Get translation for a word in a given language. Returns null if not found. */
export function getTranslation(word: string, lang: NativeLanguage): string | null {
  const entry = DICT[word.toLowerCase()];
  return entry?.[lang] ?? null;
}

/** Get all available translations for a word. */
export function getAllTranslations(word: string): Record<NativeLanguage, string> | null {
  return DICT[word.toLowerCase()] ?? null;
}

/** Check if translation exists for a word. */
export function hasTranslation(word: string): boolean {
  return word.toLowerCase() in DICT;
}

/** Get saved native language preference. */
export function getNativeLanguage(): NativeLanguage | null {
  if (typeof window === "undefined") return null;
  return (localStorage.getItem("practiceforge_native_lang") as NativeLanguage) ?? null;
}

/** Save native language preference. */
export function setNativeLanguage(lang: NativeLanguage) {
  if (typeof window === "undefined") return;
  localStorage.setItem("practiceforge_native_lang", lang);
}
