import { useState } from "react";

export function useBooleanState(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const setTrue = () => setValue(true);
  const setFalse = () => setValue(false);
  const toggle = () => setValue((prev) => !prev);

  return { value, setTrue, setFalse, toggle };
}
