import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { readAISettings } from "@/lib/ai-config";

export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
    const body = await request.json();
    const conversationId = String(body.conversationId || "");
    const content = String(body.content || "").trim();
    if (!/^[0-9a-f-]{36}$/i.test(conversationId) || !content || content.length > 12000) {
      return NextResponse.json({ error: "A valid chat and message (up to 12,000 characters) are required." }, { status: 400 });
    }
    const { data: chat } = await supabase.from("conversations").select("id")
      .eq("id", conversationId).eq("owner_id", user.id).maybeSingle();
    if (!chat) return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
    const settings = await readAISettings();
    if (!settings) return NextResponse.json({ error: "AI provider is not configured by an administrator yet." }, { status: 503 });
    const { data: history, error: historyError } = await supabase.from("messages")
      .select("role,content").eq("conversation_id", conversationId).eq("owner_id", user.id)
      .in("role", ["user", "assistant"]).order("created_at", { ascending: true }).limit(30);
    if (historyError) return NextResponse.json({ error: "Could not load chat history." }, { status: 500 });
    const { error: insertError } = await supabase.from("messages").insert({
      conversation_id: conversationId, owner_id: user.id, role: "user", content,
    });
    if (insertError) return NextResponse.json({ error: "Your message could not be saved." }, { status: 500 });
    const messages = [...(history ?? []).map((m) => ({ role: m.role, content: m.content })), { role: "user", content }];
    const response = await fetch(settings.baseUrl.replace(/\/+$/, "") + "/chat/completions", {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + settings.apiKey },
      body: JSON.stringify({ model: settings.model, messages, temperature: 0.7 }),
      signal: AbortSignal.timeout(60000),
    });
    if (!response.ok) {
      const status = response.status;
      return NextResponse.json({ error: status === 401 || status === 403 ? "Provider rejected the API key. Check admin settings." : status === 429 ? "Provider rate limit reached. Try again shortly." : "AI provider request failed. Check provider URL, model and account status." }, { status: 502 });
    }
    const result = await response.json();
    const answer = result?.choices?.[0]?.message?.content;
    if (typeof answer !== "string" || !answer.trim()) return NextResponse.json({ error: "AI provider returned an empty response." }, { status: 502 });
    const { error: saveError } = await supabase.from("messages").insert({
      conversation_id: conversationId, owner_id: user.id, role: "assistant", content: answer.slice(0, 100000),
    });
    if (saveError) return NextResponse.json({ error: "AI replied, but the response could not be saved." }, { status: 500 });
    return NextResponse.json({ message: { role: "assistant", content: answer } });
  } catch (error) {
    console.error("Chat request failed:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Chat request failed. Verify server setup and try again." }, { status: 500 });
  }
}
