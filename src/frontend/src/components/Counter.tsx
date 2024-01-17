import { useEffect, useState } from "react";

import Spinner from "./Spinner";
import { useBackend } from "../ic/Actors";
import { useInternetIdentity } from "ic-use-internet-identity";

export function Counter() {
  const { actor: backend } = useBackend();
  const { identity } = useInternetIdentity();
  const [loading, setLoading] = useState<boolean>(true);
  const [counter, setCounter] = useState<number>();

  // Get counter value from backend on mount
  useEffect(() => {
    if (!backend) return;
    backend.get_counter().then((c) => {
      setCounter(c);
      setLoading(false);
    });
  }, [backend]);

  // Add 1 to counter on click
  function handleClick() {
    if (!backend) return;
    setLoading(true);
    backend.inc_counter().then((c) => {
      setCounter(c);
      setLoading(false);
    });
  }

  let buttonClassName =
    "inline-block h-16 px-5 ml-2 font-bold text-white bg-blue-500 rounded disabled:bg-blue-500/20 disabled:hover:bg-blue-500/20";
  if (loading) {
    buttonClassName += " cursor-wait";
  } else {
    buttonClassName += " cursor-pointer hover:bg-blue-700";
  }

  if (!identity) return null;

  return (
    <div className="flex items-center">
      Counter:
      <div className="inline-block h-16 px-5 ml-3 rounded bg-zinc-600">
        {counter || <Spinner className="w-10 h-16" />}
      </div>
      <button
        onClick={handleClick}
        className={buttonClassName}
        disabled={loading}
      >
        {loading ? <Spinner className="w-10 h-16" /> : "+"}
      </button>
    </div>
  );
}
