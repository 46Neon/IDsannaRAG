export type AIRequest = { system: string; user: string; model?: string; temperature?: number };
export type AIResponse = { text: string; provider: string; model: string; usage: Record<string, number> };
export interface AIProvider { complete(input: AIRequest): Promise<AIResponse>; }

/** Gemini is called only from an Edge Function; the APK never receives this secret. */
class GeminiProvider implements AIProvider {
  async complete(input: AIRequest): Promise<AIResponse> {
    const key = Deno.env.get('GEMINI_API_KEY');
    if (!key) throw new Error('provider_not_configured');
    const model = input.model ?? Deno.env.get('GEMINI_MODEL') ?? 'gemini-2.0-flash';
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ systemInstruction: { parts: [{ text: input.system }] }, contents: [{ role: 'user', parts: [{ text: input.user }] }], generationConfig: { temperature: input.temperature ?? 0.2 } })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error('provider_request_failed');
    const text = data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? '').join('')?.trim();
    if (!text) throw new Error('provider_empty_response');
    return { text, provider: 'gemini', model, usage: data?.usageMetadata ?? {} };
  }
}

export function configuredProvider(): AIProvider | null { return Deno.env.get('GEMINI_API_KEY') ? new GeminiProvider() : null; }
