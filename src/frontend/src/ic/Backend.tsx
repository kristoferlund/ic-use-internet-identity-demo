/* eslint-disable react-refresh/only-export-components */
import {
  InterceptorErrorData,
  InterceptorRequestData,
  InterceptorResponseData,
  createActorHook,
} from "ic-use-actor";
import { canisterId, idlFactory } from "../../../declarations/backend/index";
import { useEffect } from "react";
import { _SERVICE } from "../../../declarations/backend/backend.did";
import toast from "react-hot-toast";
import { useInternetIdentity } from "ic-use-internet-identity";
import { DelegationIdentity, isDelegationValid } from "@dfinity/identity";

export const useBackend = createActorHook<_SERVICE>({
  canisterId,
  idlFactory,
});

export default function Backend() {
  const { identity, clear } = useInternetIdentity();
  const { authenticate, setInterceptors } = useBackend();

  const handleRequest = (data: InterceptorRequestData) => {
    console.log("onRequest", data.args, data.methodName);
    if (!isDelegationValid((identity as DelegationIdentity).getDelegation())) {
      toast.error("Login expired.", {
        id: "login-expired",
        position: "bottom-right",
      });
      setTimeout(() => {
        clear(); // Clears the identity from the state and local storage. Effectively "logs the user out".
        window.location.reload(); // Reloads the page to reset the UI.
      }, 1000);
    }
    return data.args;
  };

  const handleResponse = (data: InterceptorResponseData) => {
    console.log("onResponse", data.args, data.methodName, data.response);
    return data.response;
  };

  const handleRequestError = (data: InterceptorErrorData) => {
    console.log("onRequestError", data.args, data.methodName, data.error);
    return data.error;
  };

  const handleResponseError = (data: InterceptorErrorData) => {
    console.log("onResponseError", data.args, data.methodName, data.error);
    return data.error;
  };

  useEffect(() => {
    setInterceptors({
      onRequest: handleRequest,
      onResponse: handleResponse,
      onRequestError: handleRequestError,
      onResponseError: handleResponseError,
    })
  }, [])


  useEffect(() => {
    if (!identity) return;
    authenticate(identity);
  }, [identity, authenticate])

  return null;
}
