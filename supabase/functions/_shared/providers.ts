export type AIRequest = { system: string; user: string; model?: string; temperature?: number };
export type AIResponse = { text: string; provider: string; model: string; usage: Record<string, number> };
export interface AIProvider { complete(input: AIRequest): Promise<AIResponse>; }
export function configuredProvider(): AIProvider | null {
  // Provider implementations belong here and must read secrets only in Edge Functions.
  // Returning null prevents an unconfigured deployment from pretending it used IA.
  return null;
}
