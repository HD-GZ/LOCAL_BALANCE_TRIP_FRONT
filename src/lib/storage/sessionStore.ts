"use client";

import type { z } from "zod";

export function createSessionStore<TSchema extends z.ZodType>(key: string, schema: TSchema) {
  type TValue = z.infer<TSchema>;

  const changeEventName = `session-store-change:${key}`;

  let cachedRaw: string | null = null;
  let cachedValue: TValue | null = null;

  function resetCache() {
    cachedRaw = null;
    cachedValue = null;
  }

  function emitChange() {
    window.dispatchEvent(new Event(changeEventName));
  }

  function get(): TValue | null {
    if (typeof window === "undefined") {
      return null;
    }

    const item = window.sessionStorage.getItem(key);

    if (!item) {
      resetCache();
      return null;
    }

    if (item === cachedRaw) {
      return cachedValue;
    }

    let parsed: unknown;

    try {
      parsed = JSON.parse(item);
    } catch {
      resetCache();
      return null;
    }

    const result = schema.safeParse(parsed);

    if (!result.success) {
      resetCache();
      return null;
    }

    cachedRaw = item;
    cachedValue = result.data as TValue;

    return cachedValue;
  }

  function set(value: TValue) {
    if (typeof window === "undefined") {
      return;
    }

    const raw = JSON.stringify(value);

    window.sessionStorage.setItem(key, raw);
    cachedRaw = raw;
    cachedValue = value;
    emitChange();
  }

  function clear() {
    if (typeof window === "undefined") {
      return;
    }

    window.sessionStorage.removeItem(key);
    resetCache();
    emitChange();
  }

  function subscribe(onStoreChange: () => void) {
    if (typeof window === "undefined") {
      return () => undefined;
    }

    window.addEventListener(changeEventName, onStoreChange);
    window.addEventListener("storage", onStoreChange);

    return () => {
      window.removeEventListener(changeEventName, onStoreChange);
      window.removeEventListener("storage", onStoreChange);
    };
  }

  const getServerSnapshot = () => null;

  return { clear, get, getServerSnapshot, set, subscribe };
}
