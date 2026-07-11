import { NextRequest, NextResponse } from "next/server";
import { generateText, Output, APICallError } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
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

  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
  });
  const { system, user: userMsg } = buildPrompt(parsed.data);

  // The model occasionally returns a plan that misses the schema — retry once.
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const { output } = await generateText({
        model: openai("gpt-4o-mini"),
        output: Output.object({ schema: PlanSchema }),
        temperature: 0.4,
        system,
        prompt: userMsg,
      });
      return NextResponse.json({ plan: output });
    } catch (err) {
      if (APICallError.isInstance(err) && err.statusCode === 429) {
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
