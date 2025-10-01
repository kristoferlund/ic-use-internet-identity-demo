![ic-use-internet-identity-demo](/media/header.png)

This demo application demonstrates how to use the `ic-use-internet-identity` hook to create a simple login flow for a React application communicating with a canister on the [Internet Computer](https://internetcomputer.org).

[Internet Identity](https://internetcomputer.org/how-it-works/web-authentication-identity) is an authentication service running on the Internet Computer. It allows users to create an identity that can be used to authenticate with canisters (smart contracts) running on the Internet Computer.

`ic-use-internet-identity` is a hook that makes it easy to integrate Internet Identity into your React application. It provides a simple interface for logging in and out with the Internet Identity service.

## 👀 Try the live demo: <https://x2jdf-giaaa-aaaal-qc66a-cai.icp0.io>

## Key features

The demo is built using [Vite](https://vitejs.dev/) to provide a fast development experience. It also uses:

- TypeScript
- TailwindCSS
- React Hot Toast for notifications

## Table of contents

- [App components](#app-components)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Run locally](#run-locally)
- [`ic-use-internet-identity` Features](#ic-use-internet-identity-features)
- [Implementation Details](#implementation-details)
  - [1. The `InternetIdentityProvider` component](#1-the-internetidentityprovider-component)
  - [2. Setting up the backend actor with `ic-use-actor`](#2-setting-up-the-backend-actor-with-ic-use-actor)
  - [3. Connect the `login()` function to a button](#3-connect-the-login-function-to-a-button)
  - [4. Use the `identity` to access authenticated features](#4-use-the-identity-to-access-authenticated-features)
- [Contributing](#contributing)
- [License](#license)

## App components

If you are new to IC, please read the [Internet Computer Basics](https://internetcomputer.org/basics) before proceeding.

This app consists of two main components:

### Backend

The backend is a Rust-based canister that, for demonstration purposes, implements some basic functionality - a counter and a function that returns the user's identity.

[/src/backend/src/lib.rs](/src/backend/src/lib.rs)

### Frontend

The frontend is a React application that interacts with the backend canister. To be able to make authenticated calls to the backend canister, the frontend needs to have an identity.

[/src/frontend/src/main.tsx](/src/frontend/src/main.tsx)

## Run locally

```bash
pnpm i
dfx start --clean --background
dfx deploy
```

## `ic-use-internet-identity` Features

- **Cached Identity**: The identity is cached in local storage and restored on page load. This allows the user to stay logged in even if the page is refreshed.
- **Login progress**: State variables are provided to indicate whether the user is logged in, logging in, or logged out.
- **Works with ic-use-actor**: Plays nicely with [ic-use-actor](https://www.npmjs.com/package/ic-use-actor) that provides easy access to canister methods.

## Implementation Details

### 1. The `InternetIdentityProvider` component

The application's root component is wrapped with `InternetIdentityProvider` to provide all child components access to the identity context. The provider accepts `loginOptions` to configure the Internet Identity provider URL based on the environment.

```jsx
// main.tsx

import { InternetIdentityProvider } from "ic-use-internet-identity";
import React from "react";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <InternetIdentityProvider loginOptions={{
      identityProvider: process.env.DFX_NETWORK === "local"
        ? `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`
        : "https://identity.ic0.app"
    }}>
      <App />
    </InternetIdentityProvider>
  </React.StrictMode>
);
```

### 2. Setting up the backend actor with `ic-use-actor`

The demo uses `ic-use-actor`'s `createActorHook` to create a custom hook for interacting with the backend canister. This approach provides a typed interface and supports interceptors for handling requests and responses. The hook is created in `main.tsx` and used in the `AuthGuard` component.

```jsx
// main.tsx

import {
  createActorHook,
} from "ic-use-actor";
import { canisterId, idlFactory } from "../../declarations/backend/index";
import { _SERVICE } from "../../declarations/backend/backend.did";

export const useBackend = createActorHook<_SERVICE>({
  canisterId,
  idlFactory,
});
```

```jsx
// components/AuthGuard.tsx

import {
  InterceptorErrorData,
  InterceptorRequestData,
  InterceptorResponseData,
} from "ic-use-actor";
import { useEffect, useRef } from "react";
import { _SERVICE } from "../../../declarations/backend/backend.did";
import toast from "react-hot-toast";
import { useInternetIdentity } from "ic-use-internet-identity";
import { DelegationIdentity, isDelegationValid } from "@dfinity/identity";
import { useBackend } from "../main";

export default function AuthGuard() {
  const { identity, clear } = useInternetIdentity();
  const { authenticate, setInterceptors, actor } = useBackend();
  const interceptorsSet = useRef(false);

  // Set up interceptors for logging and error handling
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

  // Authenticate the actor with the identity
  useEffect(() => {
    if (!identity) return;
    authenticate(identity);
  }, [identity, authenticate]);

  return null;
}
```

The AuthGuard component also includes delegation validation to check if the login has expired:

```jsx
const handleRequest = (data: InterceptorRequestData) => {
  if (identity instanceof DelegationIdentity && !isDelegationValid(identity.getDelegation())) {
    toast.error("Login expired.", {
      id: "login-expired",
      position: "bottom-right",
    });
    setTimeout(() => {
      clear(); // Clears the identity from the state and local storage
      window.location.reload(); // Reloads the page to reset the UI
    }, 1000);
  }
  return data.args;
};
```

### 3. Connect the `login()` function to a button

The `LoginButton` component handles both login and logout functionality. It uses the `isLoggingIn` state to show loading status and toggles between login/logout based on whether an identity exists.

```jsx
// LoginButton.tsx

import { useInternetIdentity } from "ic-use-internet-identity";
import { useBackend } from "../main";

export function LoginButton() {
  const { isLoggingIn, login, clear: clearIdentity, identity } = useInternetIdentity();
  const { reset: resetBackend } = useBackend();

  function handleClick() {
    if (identity) {
      clearIdentity();  // Clear the identity
      resetBackend();    // Reset the backend actor
    } else {
      login();          // Open Internet Identity login
    }
  }

  const text = () => {
    if (identity) {
      return "Logout";
    } else if (isLoggingIn) {
      return "Logging in...";
    }
    return "Login";
  };

  return (
    <button onClick={handleClick} disabled={isLoggingIn}>
      {text()}
    </button>
  );
}
```

### 4. Use the `identity` to access authenticated features

Once logged in, the identity is available throughout the application. Components can use it to conditionally render authenticated content and make authenticated calls to the backend canister.

```jsx
// Counter.tsx

import { useInternetIdentity } from "ic-use-internet-identity";
import { useBackend } from "../main";

export function Counter() {
  const { actor: backend } = useBackend();
  const { identity } = useInternetIdentity();
  const [counter, setCounter] = useState<number>();

  // Get counter value from backend
  useEffect(() => {
    if (!backend) return;
    backend.get_counter().then((c) => {
      setCounter(c);
    });
  }, [backend]);

  // Only render if user is logged in
  if (!identity) return null;

  // Make authenticated calls to the backend
  function handleClick() {
    if (!backend) return;
    backend.inc_counter().then((c) => {
      setCounter(c);
    });
  }

  return (
    <div>
      Counter: {counter}
      <button onClick={handleClick}>+</button>
    </div>
  );
}
```

## Contributing

Contributions are welcome. Please submit your pull requests or open issues to propose changes or report bugs.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.