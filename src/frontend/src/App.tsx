import { useEffect, useState } from "react";

import { Counter } from "./components/Counter";
import { LoginButton } from "./components/LoginButton";
import Principal from "./components/Principal";
import { useBackend } from "./ic/Actors";
import { useInternetIdentity } from "ic-use-internet-identity";

function App() {
  const { identity } = useInternetIdentity();
  const { actor: backend } = useBackend();
  const [principal, setPrincipal] = useState<string>();

  // Clear the principal when the identity is cleared
  useEffect(() => {
    if (!identity) setPrincipal(undefined);
  }, [identity]);

  // Get the principal from the backend when an identity is available
  useEffect(() => {
    if (identity && backend && !principal) {
      backend.whoami().then((p) => setPrincipal(p));
    }
  }, [backend, identity, principal]);

  return (
    <div className="flex flex-col items-start w-full gap-10 p-10 font-sans text-6xl italic">
      <img src="/ic.svg" alt="Internet Computer" className="w-96" />
      <div>{identity ? "You are logged in." : "You are not logged in."}</div>
      <LoginButton />
      <Principal principal={principal} />
      <Counter />
    </div>
  );
}

export default App;
