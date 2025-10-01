import "./index.css";

import App from "./App.tsx";
import { InternetIdentityProvider } from "ic-use-internet-identity";
import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import {
  createActorHook,
} from "ic-use-actor";
import { canisterId, idlFactory } from "../../declarations/backend/index";
import { _SERVICE } from "../../declarations/backend/backend.did";
import AuthGuard from "./components/AuthGuard.tsx";

export const useBackend = createActorHook<_SERVICE>({
  canisterId,
  idlFactory,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <InternetIdentityProvider loginOptions={{
      identityProvider: process.env.DFX_NETWORK === "local"
        ? `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`
        : "https://identity.ic0.app"
    }}>
      <AuthGuard />
      <App />
      <Toaster
        position="bottom-right"
        containerClassName="font-sans text-4xl italic"
      />
    </InternetIdentityProvider>
  </React.StrictMode>,
);
