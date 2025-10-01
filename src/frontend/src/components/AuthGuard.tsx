import {
  InterceptorErrorData,
  InterceptorRequestData,
  InterceptorResponseData,
} from "ic-use-actor";
import { useEffect, useRef } from "react";
import { _SERVICE } from "../../../declarations/backend/backend.did";
import { useInternetIdentity } from "ic-use-internet-identity";
import { useBackend } from "../main";


export default function AuthGuard() {
  const { identity } = useInternetIdentity();
  const { authenticate, setInterceptors, actor } = useBackend();
  const interceptorsSet = useRef(false);

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
    return data.error;
  };

  const handleResponseError = (data: InterceptorErrorData) => {
    console.log("onResponseError", data.args, data.methodName, data.error);
    return data.error;
  };

  useEffect(() => {
    if (!actor || interceptorsSet.current) return;
    setInterceptors({
      onRequest: handleRequest,
      onResponse: handleResponse,
      onRequestError: handleRequestError,
      onResponseError: handleResponseError,
    });
    interceptorsSet.current = true;
  }, [actor]);


  useEffect(() => {
    if (!identity) return;
    authenticate(identity);
  }, [identity, authenticate])

  return null;
}
