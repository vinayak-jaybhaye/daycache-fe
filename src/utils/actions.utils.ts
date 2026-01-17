import { useEffect, useRef, useCallback } from "react"

export function useDebouncedCallback<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
) {
  const fnRef = useRef(fn)
  const timeout = useRef<number | null>(null)

  // always keep latest fn
  useEffect(() => {
    fnRef.current = fn
  }, [fn])

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeout.current) {
        window.clearTimeout(timeout.current)
      }
    }
  }, [])

  const debounced = useCallback(
    (...args: Parameters<T>) => {
      if (timeout.current) {
        window.clearTimeout(timeout.current)
      }

      timeout.current = window.setTimeout(() => {
        fnRef.current(...args)
      }, delay)
    },
    [delay]
  )

  return debounced
}

export function useInfiniteScroll(
  onLoadMore: () => void,
  root?: HTMLElement | null
) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onLoadMore()
        }
      },
      {
        root: root ?? null,
        rootMargin: "200px",
      }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [onLoadMore, root])

  return ref
}
