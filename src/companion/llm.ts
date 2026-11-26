import type { CitedVerse } from '../wellness/bundled'

/**
 * Future answers may go through a Supabase Edge Function named `companion-answer`.
 * That function is not deployed, and this build has no API key. The flag stays off,
 * so nothing here calls a network or reads a secret.
 */
export const COMPANION_LLM_ENABLED = false
export const COMPANION_LLM_FUNCTION = 'companion-answer'

export type LlmCompanionRequest = {
  question: string
  citations: CitedVerse[]
}

export type LlmCompanionResult = { used: false; reason: 'disabled' }

export async function callCompanionLlm(_request: LlmCompanionRequest): Promise<LlmCompanionResult> {
  if (!COMPANION_LLM_ENABLED) return { used: false, reason: 'disabled' }
  return { used: false, reason: 'disabled' }
}
