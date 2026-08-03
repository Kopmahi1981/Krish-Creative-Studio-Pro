import { useState, useCallback } from 'react'

interface UseControllableStateParams<T> {
  value?: T
  defaultValue: T
  onChange?: (value: T) => void
}

/**
 * Supports both controlled and uncontrolled component usage.
 * When `value` is provided the component is controlled; otherwise internal state is used.
 * `onChange` always fires so parents can react regardless of mode.
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateParams<T>): readonly [T, (next: T) => void] {
  const [internal, setInternal] = useState<T>(defaultValue)
  const isControlled = value !== undefined
  const current = isControlled ? (value as T) : internal

  const set = useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next)
      onChange?.(next)
    },
    [isControlled, onChange],
  )

  return [current, set] as const
}
