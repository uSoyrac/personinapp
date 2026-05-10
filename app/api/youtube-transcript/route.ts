import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || !url.includes("youtube.com") && !url.includes("youtu.be")) {
      return NextResponse.json(
        { error: "Invalid YouTube URL provided." },
        { status: 400 }
      );
    }

    // Simulate network delay for fetching transcript
    await new Promise(resolve => setTimeout(resolve, 1200));

    // MOCK DATA: For MVP purposes, we return a hardcoded transcript
    // This perfectly matches the mock analysis done in GeneralEnglishPage
    const mockTranscript = `Urbanisation has profoundly transformed ecosystems across the globe. As cities expand, natural habitats are increasingly fragmented, reducing biodiversity and disrupting ecological corridors. However, thoughtfully designed green infrastructure can mitigate these effects. By integrating parks, green roofs, and urban forests, cities can support local wildlife while improving air quality and human well-being. Ultimately, sustainable urban planning is essential to balance human development with ecological preservation.`;

    return NextResponse.json({ transcript: mockTranscript });
  } catch (err) {
    console.error("[/api/youtube-transcript] Error:", err);
    return NextResponse.json({ error: "Failed to fetch transcript. Please try again." }, { status: 500 });
  }
}
