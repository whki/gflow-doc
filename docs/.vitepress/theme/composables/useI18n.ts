import { computed } from 'vue'
import { useData } from 'vitepress'

/**
 * Locale helper for custom theme components.
 * root locale = Chinese, /en/ = English; reactive on route change.
 */
export function useI18n() {
  const { lang } = useData()
  const isEn = computed(() => lang.value.startsWith('en'))

  /** Prefix a site-internal path with the current locale segment. */
  const link = (path: string) => (isEn.value ? '/en' + path : path)

  return { isEn, link }
}
