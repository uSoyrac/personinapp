import type {
  PracticeGenerationResult,
  WritingFeedbackResult,
  ExamType,
} from "@/types";

// ==============================
// Mock Practice Generation Result
// ==============================

export const MOCK_PRACTICE_RESULT: PracticeGenerationResult = {
  summary:
    "This text explores the impact of urbanisation on biodiversity in modern cities. It argues that while rapid urban growth has fragmented natural habitats, thoughtful city planning — including green corridors, urban parks, and sustainable architecture — can help restore ecological balance. The author draws on case studies from Singapore, Vienna, and Medellín to illustrate how cities can become refuges rather than enemies of wildlife.",
  keyThemes: [
    "Urbanisation and habitat loss",
    "Biodiversity in cities",
    "Sustainable urban planning",
    "Green infrastructure",
    "Wildlife conservation strategies",
  ],
  readingQuestions: [
    {
      id: "q1",
      question:
        "According to the text, what is the primary cause of biodiversity loss in urban areas?",
      options: [
        "Pollution from industrial factories",
        "Fragmentation of natural habitats due to urban expansion",
        "Overuse of pesticides in city parks",
        "Climate change and rising temperatures",
      ],
      correctIndex: 1,
      explanation:
        "The text explicitly states that 'rapid urban growth has fragmented natural habitats,' making option B the most directly supported answer. While pollution and climate change may contribute, the passage focuses on habitat fragmentation as the primary driver.",
      questionType: "multiple_choice",
    },
    {
      id: "q2",
      question:
        "Which of the following best describes the author's overall attitude towards cities and biodiversity?",
      options: [
        "Pessimistic — cities are inherently incompatible with wildlife",
        "Neutral — the author presents facts without a clear stance",
        "Cautiously optimistic — cities can support biodiversity with proper planning",
        "Critical — current planning efforts are insufficient",
      ],
      correctIndex: 2,
      explanation:
        "The author's use of city success stories (Singapore, Vienna, Medellín) and the phrase 'cities can become refuges' signals a cautiously optimistic stance — acknowledging problems while highlighting solutions.",
      questionType: "multiple_choice",
    },
    {
      id: "q3",
      question:
        "The phrase 'green corridors' in the text most likely refers to:",
      options: [
        "Traffic lanes reserved for electric vehicles",
        "Underground tunnels connecting city parks",
        "Continuous strips of vegetation linking urban green spaces",
        "Financial incentives for environmentally friendly buildings",
      ],
      correctIndex: 2,
      explanation:
        "'Green corridors' is an established ecological term for connected strips of natural vegetation that allow wildlife to move between habitats — contextually supported by the passage's discussion of urban planning and habitat connectivity.",
      questionType: "multiple_choice",
    },
    {
      id: "q4",
      question:
        "Based on the text, Singapore is cited as an example of a city that has:",
      options: [
        "Completely reversed all biodiversity loss",
        "Integrated nature into its urban development strategy",
        "Opposed international conservation agreements",
        "Prioritised economic growth over environmental concerns",
      ],
      correctIndex: 1,
      explanation:
        "Singapore appears in the text as a positive case study of a city that has embedded nature into its planning framework — not as a perfect solution, but as a model of integration.",
      questionType: "multiple_choice",
    },
    {
      id: "q5",
      question:
        "TRUE / FALSE / NOT GIVEN: The text suggests that all cities will eventually develop effective biodiversity strategies.",
      options: ["TRUE", "FALSE", "NOT GIVEN"],
      correctIndex: 2,
      explanation:
        "The text does not make a universal prediction about all cities. It highlights specific examples of progress without claiming this will happen everywhere. 'NOT GIVEN' is correct because no such claim is made.",
      questionType: "true_false_not_given",
    },
  ],
  vocabulary: [
    {
      word: "urbanisation",
      partOfSpeech: "noun",
      definition:
        "The process by which towns and cities grow as populations move from rural to urban areas.",
      exampleSentence:
        "Rapid urbanisation in Southeast Asia has transformed agricultural land into dense metropolitan regions.",
      difficulty: "B2",
      collocations: ["rapid urbanisation", "urbanisation rate", "drive urbanisation"],
    },
    {
      word: "fragmentation",
      partOfSpeech: "noun",
      definition:
        "The process of breaking something into smaller, disconnected pieces — in ecology, the division of habitats into isolated patches.",
      exampleSentence:
        "Habitat fragmentation forces species to remain in increasingly small territories, reducing genetic diversity.",
      difficulty: "C1",
      collocations: ["habitat fragmentation", "landscape fragmentation", "fragmentation effect"],
    },
    {
      word: "biodiversity",
      partOfSpeech: "noun",
      definition:
        "The variety of life in a particular ecosystem, measured by the number and variety of species.",
      exampleSentence:
        "Tropical rainforests support extraordinary biodiversity, housing millions of species in a single region.",
      difficulty: "B2",
      collocations: ["biodiversity loss", "biodiversity hotspot", "protect biodiversity"],
    },
    {
      word: "ecological",
      partOfSpeech: "adjective",
      definition:
        "Relating to the relationships between living organisms and their environment.",
      exampleSentence:
        "The ecological consequences of deforestation extend far beyond the immediate loss of trees.",
      difficulty: "B2",
      collocations: ["ecological balance", "ecological impact", "ecological system"],
    },
    {
      word: "sustainable",
      partOfSpeech: "adjective",
      definition:
        "Able to be maintained over time without depleting natural resources or causing permanent damage.",
      exampleSentence:
        "Sustainable architecture incorporates energy efficiency, natural materials, and minimal environmental disruption.",
      difficulty: "B2",
      collocations: ["sustainable development", "sustainable energy", "sustainable growth"],
    },
    {
      word: "infrastructure",
      partOfSpeech: "noun",
      definition:
        "The basic physical systems and structures needed for a society or organisation to function.",
      exampleSentence:
        "Green infrastructure — such as wetlands and parks — can reduce flooding while improving urban air quality.",
      difficulty: "C1",
      collocations: ["green infrastructure", "urban infrastructure", "infrastructure investment"],
    },
    {
      word: "corridor",
      partOfSpeech: "noun",
      definition:
        "In ecology, a strip of habitat connecting separate wildlife areas, enabling animal movement.",
      exampleSentence:
        "The new riverside corridor links three city parks, allowing hedgehogs and foxes to roam freely.",
      difficulty: "C1",
      collocations: ["wildlife corridor", "green corridor", "habitat corridor"],
    },
    {
      word: "refuge",
      partOfSpeech: "noun",
      definition: "A place offering protection or shelter from danger or difficulty.",
      exampleSentence:
        "Urban parks increasingly serve as refuges for migratory birds passing through densely built cities.",
      difficulty: "B2",
      collocations: ["take refuge", "wildlife refuge", "serve as a refuge"],
    },
  ],
  writingPrompt:
    "Some people argue that city planners should prioritise economic development over environmental conservation in urban areas. To what extent do you agree or disagree with this view? Support your answer with reasons and examples from your own knowledge and experience.",
  writingPromptType: "Task 2",
  speakingPrompt:
    "Describe a natural place — such as a park, forest, or beach — that is important to you. You should say: where it is, when you first visited it, what it is like, and explain why it is important to you personally.",
  speakingFollowUps: [
    "Do you think cities in your country do enough to protect natural spaces?",
    "How has your relationship with nature changed as you've grown older?",
    "What are the challenges of preserving green spaces in rapidly growing cities?",
    "Do you think technology can ever replace the need for contact with nature?",
  ],
  studyPlan: [
    {
      day: 1,
      theme: "Foundation: Text Analysis & Vocabulary",
      activities: [
        { type: "review", description: "Re-read the source text and highlight unfamiliar vocabulary", durationMinutes: 20 },
        { type: "practice", description: "Study all 8 vocabulary items — write one original sentence for each", durationMinutes: 30 },
        { type: "practice", description: "Attempt reading questions without checking answers", durationMinutes: 25 },
      ],
      totalMinutes: 75,
    },
    {
      day: 2,
      theme: "Reading: Question Strategies",
      activities: [
        { type: "review", description: "Review reading question answers and read all explanations carefully", durationMinutes: 20 },
        { type: "practice", description: "Practice skimming & scanning: set a 3-minute timer per passage section", durationMinutes: 30 },
        { type: "practice", description: "Attempt 5 True/False/Not Given questions from an IELTS practice bank", durationMinutes: 30 },
      ],
      totalMinutes: 80,
    },
    {
      day: 3,
      theme: "Writing: Task 2 Planning",
      activities: [
        { type: "practice", description: "Plan your essay: write a thesis, 2 main body topic sentences, and a conclusion outline", durationMinutes: 20 },
        { type: "practice", description: "Write a full Task 2 response (250–280 words) to the generated prompt", durationMinutes: 45 },
        { type: "review", description: "Self-check: task response, paragraph structure, linking words", durationMinutes: 15 },
      ],
      totalMinutes: 80,
    },
    {
      day: 4,
      theme: "Speaking: Part 2 & 3",
      activities: [
        { type: "practice", description: "Record yourself speaking on the generated cue card topic (2 minutes)", durationMinutes: 15 },
        { type: "review", description: "Listen back and note: fluency, vocabulary, grammar errors", durationMinutes: 15 },
        { type: "practice", description: "Answer the 4 follow-up questions aloud — aim for 30–60 seconds each", durationMinutes: 20 },
      ],
      totalMinutes: 50,
    },
    {
      day: 5,
      theme: "Vocabulary Deep Dive",
      activities: [
        { type: "practice", description: "Create a collocation map: connect each vocabulary word to its key collocations", durationMinutes: 25 },
        { type: "practice", description: "Write a paragraph using at least 5 of the 8 vocabulary words naturally", durationMinutes: 30 },
        { type: "review", description: "Review collocations with an online corpus (e.g., COCA, Sketch Engine)", durationMinutes: 15 },
      ],
      totalMinutes: 70,
    },
    {
      day: 6,
      theme: "Full Practice Integration",
      activities: [
        { type: "test", description: "Timed reading: complete all 5 questions in 20 minutes without notes", durationMinutes: 20 },
        { type: "test", description: "Timed writing: write Task 2 essay in 40 minutes from scratch", durationMinutes: 40 },
        { type: "review", description: "Compare to Day 3 writing — note improvements", durationMinutes: 15 },
      ],
      totalMinutes: 75,
    },
    {
      day: 7,
      theme: "Review & Consolidation",
      activities: [
        { type: "review", description: "Review all vocabulary one final time using flashcard method", durationMinutes: 20 },
        { type: "review", description: "Re-read your best writing sample — identify 3 things done well", durationMinutes: 15 },
        { type: "rest", description: "Rest your brain — light reading or listening in English only", durationMinutes: 30 },
      ],
      totalMinutes: 65,
    },
  ],
  examType: "IELTS_ACADEMIC",
  skillFocus: "Full",
  level: "B2",
  generatedAt: new Date().toISOString(),
  isUsingMockData: true,
};

// ==============================
// Mock Writing Feedback
// ==============================

export function getMockWritingFeedback(
  userAnswer: string,
  examType: ExamType
): WritingFeedbackResult {
  const wordCount = userAnswer.trim().split(/\s+/).filter(Boolean).length;
  const isIELTS = examType === "IELTS_ACADEMIC";

  return {
    estimatedBand: isIELTS ? "6.0–6.5" : "21–24",
    overallFeedback:
      "Your response demonstrates a solid understanding of the topic and presents a clear position. The essay is well-organised with an identifiable introduction, body paragraphs, and conclusion. To move to a higher band, focus on developing your ideas more fully with specific examples, widening your range of vocabulary (avoiding repetition), and varying your sentence structures more consistently.",
    taskResponse: {
      score: isIELTS ? 6 : 22,
      label: "Task Response",
      feedback:
        "You address the task directly and present a clear opinion. However, some points are stated rather than fully developed. Adding a specific real-world example in each body paragraph would significantly strengthen your argument.",
      strengths: [
        "Clear position stated in the introduction",
        "Both sides of the argument acknowledged",
        "Conclusion restates main position effectively",
      ],
      improvements: [
        "Develop each argument with a concrete example",
        "Avoid simply listing points — explain the 'why'",
        "Ensure all content is directly relevant to the prompt",
      ],
    },
    coherenceCohesion: {
      score: isIELTS ? 6 : 21,
      label: "Coherence & Cohesion",
      feedback:
        "Your essay flows reasonably well and uses common linking words (however, furthermore, in conclusion). To improve, vary your cohesive devices and ensure each paragraph has a clear central idea with all sentences contributing to that idea.",
      strengths: [
        "Logical paragraph progression",
        "Use of discourse markers (however, furthermore)",
        "Introduction and conclusion present",
      ],
      improvements: [
        "Vary cohesive devices beyond 'however' and 'furthermore'",
        "Ensure topic sentences clearly signal paragraph focus",
        "Avoid starting multiple sentences with the same word",
      ],
    },
    lexicalResource: {
      score: isIELTS ? 6 : 21,
      label: "Lexical Resource",
      feedback:
        "Your vocabulary is adequate for the task. You use some topic-specific terms correctly. However, several high-frequency words are repeated frequently (e.g., 'environment', 'important', 'good'). Try substituting with more precise alternatives: 'ecological', 'crucial', 'beneficial'.",
      strengths: [
        "Topic-appropriate vocabulary used",
        "Generally accurate word choice",
        "Some academic vocabulary present",
      ],
      improvements: [
        "Reduce repetition of high-frequency words",
        "Use more precise academic collocations",
        "Attempt lower-frequency vocabulary appropriate to C1 level",
      ],
    },
    grammaticalRange: {
      score: isIELTS ? 6 : 22,
      label: "Grammatical Range & Accuracy",
      feedback:
        "Your grammar is mostly accurate with minor errors that do not significantly impede communication. You tend to use simple and compound sentences. Incorporating more complex structures (relative clauses, conditionals, passive constructions) would demonstrate greater grammatical range.",
      strengths: [
        "Generally accurate use of tense",
        "Subject-verb agreement mostly correct",
        "Punctuation largely appropriate",
      ],
      improvements: [
        "Use a wider range of sentence structures",
        "Practise relative clauses (which, that, whose)",
        "Review use of articles (a/an/the) in academic writing",
      ],
    },
    improvedVersion: `City planners face a complex challenge: balancing economic imperatives with the urgent need to preserve natural environments. While some argue that development should take precedence, I contend that sustainable urban growth — which integrates environmental conservation — ultimately yields superior long-term economic outcomes.

Proponents of prioritising economic development often cite the immediate benefits of construction and infrastructure investment: job creation, tax revenue, and improved urban services. In rapidly developing nations, these gains can be transformative. However, this perspective underestimates the economic value of natural capital. Research conducted in Singapore demonstrates that urban green spaces increase surrounding property values by up to 15%, while simultaneously reducing flood management costs through natural water absorption.

Furthermore, the false dichotomy between development and conservation obscures a more nuanced reality. Cities such as Medellín and Vienna have demonstrated that ecologically sensitive design can attract investment and tourism simultaneously. Medellín's urban cable cars and botanical corridors, for instance, have revitalised previously neglected districts, generating economic activity while restoring ecological connectivity.

In conclusion, framing this as a choice between economic development and environmental preservation is fundamentally misleading. Enlightened urban planning treats natural systems as essential infrastructure — one that underpins long-term economic resilience. I strongly believe that cities which invest in biodiversity today are building the economic foundations of tomorrow.`,
    nextExercises: [
      {
        title: "Cohesive Device Expansion",
        description:
          "Write three short paragraphs (50 words each) on any topic, but challenge yourself to use a different cohesive device in each one: concession (admittedly, despite this), addition (what is more, in addition), and contrast (conversely, on the other hand).",
        type: "writing",
      },
      {
        title: "Vocabulary Precision Practice",
        description:
          "Take your original essay and underline any repeated or vague words. For each underlined word, find two more precise alternatives using a learner's dictionary or thesaurus. Rewrite those sentences.",
        type: "vocabulary",
      },
      {
        title: "Complex Sentence Construction",
        description:
          "Practice writing 5 sentences that each use a different complex structure: one relative clause, one conditional (If…), one passive construction, one noun clause (It is clear that…), and one concessive clause (Although…).",
        type: "grammar",
      },
    ],
    wordCount,
    generatedAt: new Date().toISOString(),
    isUsingMockData: true,
    disclaimer:
      "⚠️ This is an AI-generated practice estimate only. It is not an official IELTS or TOEFL score. PracticeForge is not affiliated with IDP, British Council, ETS, or Cambridge Assessment English.",
  };
}
