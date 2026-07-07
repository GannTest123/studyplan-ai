import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { GenerateRequestSchema, PlanSchema } from "@/lib/schemas";
import { buildPrompt } from "@/lib/prompt";

export const runtime = "nodejs";
export const maxDuration = 60;

async function getAuthedUser(req: NextRequest) {
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  const supabase = createClient(url, anonKey);
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}

export async function POST(req: NextRequest) {
  const user = await getAuthedUser(req);
  if (!user) {
    return NextResponse.json({ error: "Sign in to generate a plan." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = GenerateRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const { system, user: userMsg } = buildPrompt(parsed.data);

  // The model occasionally returns JSON that misses the schema — retry once.
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: userMsg },
        ],
      });

      const raw = completion.choices[0]?.message?.content ?? "";
      const plan = PlanSchema.safeParse(JSON.parse(raw));
      if (plan.success) {
        return NextResponse.json({ plan: plan.data });
      }
    } catch (err) {
      if (err instanceof OpenAI.APIError && err.status === 429) {
        return NextResponse.json(
          { error: "AI service is rate-limited right now — try again in a minute." },
          { status: 429 }
        );
      }
      // fall through to retry / final error
    }
  }

  return NextResponse.json(
    { error: "AI service unavailable — please try again." },
    { status: 502 }
  );
}
