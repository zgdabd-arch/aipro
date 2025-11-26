'use client';
import { DependencyList, useMemo } from "react";

// Define a type that adds an optional __memo property
type Memoized<T> = T & { __memo?: boolean };

/**
 * A custom hook that wraps React's `useMemo`.
 * If the memoized value is an object, it flags it with a `__memo` property.
 * This helps prevent accidental re-renders from unstable object references in effects.
 *
 * @template T The type of the value to be memoized.
 * @param {() => T} factory A function that computes the value.
 * @param {DependencyList} deps An array of dependencies for `useMemo`.
 * @returns {T | Memoized<T>} The memoized value, potentially with a `__memo` flag.
 */
export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T | Memoized<T> {
  // Memoize the value using the standard useMemo hook
  const memoizedValue = useMemo(factory, deps);

  // If the memoized value is a non-null object, add the __memo property
  if (typeof memoizedValue === 'object' && memoizedValue !== null) {
    // Type assertion to let TypeScript know it's safe to add the property
    (memoizedValue as Memoized<T>).__memo = true;
  }

  return memoizedValue;
}
