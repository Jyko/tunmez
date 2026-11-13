import { flushPromises } from '@vue/test-utils'

// Returns the element matching selector in the document, overlays included.
export function query<T extends Element = HTMLElement>(selector: string): T {
  const el = document.querySelector<T>(selector)
  if (!el) throw new Error(`No element matches ${selector}`)
  return el
}

// Types value into the text field of the open dialog.
export async function typeInDialog(value: string) {
  const input = query<HTMLInputElement>('.v-dialog input')
  input.value = value
  input.dispatchEvent(new Event('input'))
  await flushPromises()
}

// Submits the form of the open dialog.
export async function submitDialog() {
  query('.v-dialog form').dispatchEvent(new Event('submit'))
  await flushPromises()
}
