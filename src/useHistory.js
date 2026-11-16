import { useCallback, useRef, useState } from "react";
export default function useHistory(initial) {
  const [state, setState] = useState(initial),
    current = useRef(state),
    transaction = useRef(null);
  const stacks = useRef({ past: [], future: [] }),
    [revision, setRevision] = useState(0);
  const update = useCallback((next) => {
    current.current = next;
    setState(next);
  }, []);
  const push = useCallback((base) => {
    stacks.current.past = [...stacks.current.past.slice(-79), base];
    stacks.current.future = [];
    setRevision((x) => x + 1);
  }, []);
  const begin = useCallback(() => {
    if (!transaction.current) transaction.current = current.current;
  }, []);
  const preview = useCallback(
    (next) => update(typeof next === "function" ? next(current.current) : next),
    [update],
  );
  const end = useCallback(() => {
    const base = transaction.current;
    transaction.current = null;
    if (base && JSON.stringify(base) !== JSON.stringify(current.current))
      push(base);
  }, [push]);
  const cancel = useCallback(() => {
    if (transaction.current) {
      update(transaction.current);
      transaction.current = null;
    }
  }, [update]);
  const change = useCallback(
    (next) => {
      const base = transaction.current || current.current;
      transaction.current = null;
      const value = typeof next === "function" ? next(current.current) : next;
      if (JSON.stringify(base) !== JSON.stringify(value)) push(base);
      update(value);
    },
    [push, update],
  );
  const undo = useCallback(() => {
    if (transaction.current) {
      cancel();
      return;
    }
    const { past, future } = stacks.current;
    if (!past.length) return;
    future.unshift(current.current);
    update(past.pop());
    setRevision((x) => x + 1);
  }, [cancel, update]);
  const redo = useCallback(() => {
    if (transaction.current) return;
    const { past, future } = stacks.current;
    if (!future.length) return;
    past.push(current.current);
    update(future.shift());
    setRevision((x) => x + 1);
  }, [update]);
  return {
    state,
    current,
    revision,
    change,
    begin,
    preview,
    end,
    cancel,
    undo,
    redo,
    canUndo: stacks.current.past.length > 0,
    canRedo: stacks.current.future.length > 0,
    isEditing: () => transaction.current !== null,
  };
}
