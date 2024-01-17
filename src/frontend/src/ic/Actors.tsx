/* eslint-disable react-refresh/only-export-components */
import {
  ActorProvider,
  createActorContext,
  createUseActorHook,
} from "ic-use-actor";
import {
  InterceptorErrorData,
  InterceptorRequestData,
  InterceptorResponseData,
} from "ic-use-actor/dist/interceptor-data.type";
import { canisterId, idlFactory } from "../../../declarations/backend/index";

import { ReactNode } from "react";
import { _SERVICE } from "../../../declarations/backend/backend.did";
import toast from "react-hot-toast";
import { useInternetIdentity } from "ic-use-internet-identity";

const actorContext = createActorContext<_SERVICE>();
export const useBackend = createUseActorHook<_SERVICE>(actorContext);

export default function Actors({ children }: { children: ReactNode }) {
  const { identity, clear } = useInternetIdentity();

  const handleRequest = (data: InterceptorRequestData) => {
    console.log("onRequest", data.args, data.methodName);
    return data.args;
  };

  const handleResponse = (data: InterceptorResponseData) => {
    console.log("onResponse", data.args, data.methodName, data.response);
    return data.response;
  };

  const handleRequestError = (data: InterceptorErrorData) => {
    console.log("onRequestError", data.args, data.methodName, data.error);
    toast.error("Request error" as string, {
      position: "bottom-right",
    });
    return data.error;
  };

  // This could be done using a library like Zod, but I don't want to add a dependency for this one check.
  const isAuthError = (data: unknown) => {
    if (typeof data !== "object" || data === null || !("error" in data))
      return false;

    const { error } = data;
    if (
      typeof error !== "object" ||
      error === null ||
      !("name" in error) ||
      error.name !== "AgentHTTPResponseError" ||
      !("message" in error) ||
      typeof error.message !== "string" ||
      !error.message.includes("Failed to authenticate request") ||
      !("response" in error) ||
      error.response === null ||
      typeof error.response !== "object"
    )
      return false;

    return "status" in error.response && error.response.status === 403;
  };

  const handleResponseError = (data: InterceptorErrorData) => {
    console.log("onResponseError", data.args, data.methodName, data.error);
    if (isAuthError(data.error)) {
      toast.error("Invalid Identity", {
        id: "invalid-identity",
        position: "bottom-right",
      });
      setTimeout(() => {
        clear(); // Clears the identity from the state and local storage. Effectively "logs the user out".
      }, 1000);
      return;
    }

    if (
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
    ) {
      toast.error(data.message, {
        position: "bottom-right",
      });
    }
  };

  return (
    <ActorProvider<_SERVICE>
      canisterId={canisterId}
      context={actorContext}
      identity={identity}
      idlFactory={idlFactory}
      onRequest={handleRequest}
      onResponse={handleResponse}
      onRequestError={handleRequestError}
      onResponseError={handleResponseError}
    >
      {children}
    </ActorProvider>
  );
}
