import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
export async function reserveCredits(_db: SupabaseClient, _userId: string, _operation: string, _key: string) {
  // Must be replaced by a SECURITY DEFINER transaction/RPC before enabling IA billing.
  return { ok: false, code: "CREDIT_RPC_NOT_DEPLOYED" as const };
}
