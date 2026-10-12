import axios from 'axios'
import type { ApiProblem } from '@/types/api'

function getProblem(error: unknown): ApiProblem | null {
  if (axios.isAxiosError<ApiProblem>(error) && error.response?.data) {
    return error.response.data
  }
  return null
}

/** One human-readable message, for toasts and banners. */
export function getErrorMessage(error: unknown): string {
  const problem = getProblem(error)
  if (problem?.errors) {
    const first = Object.values(problem.errors)[0]?.[0]
    if (first) return first
  }
  if (problem?.detail) return problem.detail
  if (problem?.title) return problem.title
  if (axios.isAxiosError(error) && !error.response) {
    return 'Cannot reach the server. Check your connection.'
  }
  return 'Something went wrong.'
}

/** "Title" -> "title", "Description.Value" -> "description" */
function normalizeKey(key: string): string {
  const name = key.replace(/\.Value$/, '')
  return name.charAt(0).toLowerCase() + name.slice(1)
}

/** Field-level errors, so a form can show them under the right input. */
export function getFieldErrors(error: unknown): Record<string, string> {
  const errors = getProblem(error)?.errors
  if (!errors) return {}
  return Object.fromEntries(
    Object.entries(errors).map(([key, messages]) => [normalizeKey(key), messages[0]]),
  )
}