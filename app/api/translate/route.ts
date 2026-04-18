import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { texts, targetLang } = await req.json();

    if (!texts || !Array.isArray(texts) || texts.length === 0 || !targetLang) {
      return NextResponse.json(
        { error: "Missing texts array or targetLang" },
        { status: 400 },
      );
    }

    // Limit batch size to prevent abuse
    if (texts.length > 50) {
      return NextResponse.json(
        { error: "Too many texts (max 50)" },
        { status: 400 },
      );
    }

    const separator = "\n\n---SPLIT---\n\n";
    const combined = texts.join(separator);

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(combined)}`;

    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json(
        { error: "Translation service unavailable" },
        { status: 502 },
      );
    }

    const data = await res.json();

    // Google Translate returns: [[["translated", "original", ...], ...], ...]
    const fullTranslation = (data[0] as Array<[string, ...unknown[]]>)
      .map((item) => item[0])
      .join("");

    const translations = fullTranslation
      .split(/\n?\s*---\s*SPLIT\s*---\s*\n?/i)
      .map((t: string) => t.trim());

    // Pad with empty strings if splitting didn't work perfectly
    while (translations.length < texts.length) {
      translations.push(texts[translations.length]);
    }

    return NextResponse.json({
      translations: translations.slice(0, texts.length),
    });
  } catch {
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
