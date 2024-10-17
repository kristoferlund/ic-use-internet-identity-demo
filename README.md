![ic-use-internet-identity-demo](/media/header.png)

This demo application demonstrates how to use the [`ic-use-internet-identity`](https://www.npmjs.com/package/ic-use-internet-identity) hook to create a simple login flow for a React application communicating with a canister on the [Internet Computer](https://internetcomputer.org).

[Internet Identity](https://internetcomputer.org/how-it-works/web-authentication-identity) is an authentication service running on the Internet Computer. It allows users to create an identity that can be used to authenticate with canisters (smart contracts) running on the Internet Computer.

[ic-use-internet-identity](https://www.npmjs.com/package/ic-use-internet-identity) is a hook that makes it easy to integrate Internet Identity into your React application. It provides a simple interface for logging in and out with the Internet Identity service.

## 👀 Try the live demo: https://x2jdf-giaaa-aaaal-qc66a-cai.icp0.io

## Key features

The demo is built using [Vite](https://vitejs.dev/) to provide a fast development experience. It also uses:

- TypeScript
- TailwindCSS

## Table of contents

- [App components](#app-components)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Run locally](#run-locally)
- [`ic-use-internet-identity` Features](#ic-use-internet-identity-features)
- [Details](#details)
  - [1. The `InternetIdentityProvider` component](#1-the-internetidentityprovider-component)
  - [2. Connect the `login()` function to a button](#2-connect-the-login-function-to-a-button)
  - [3. Use the `identity` context variable to access the identity](#3-use-the-identity-context-variable-to-access-the-identity)
- [Contributing](#contributing)
- [License](#license)

## App components

If you are new to IC, please read the [Internet Computer Basics](https://internetcomputer.org/basics) before proceeding.

This app consists of two main components:

### Backend

The backend is a Rust based canister that, for demonstration purposes, implements some basic functionality - a counter and a function that returns the user's identity.

[/src/backend/src/lib.rs](/src/backend/src/lib.rs)

### Frontend

The frontend is a React application that interacts with the backend canister. To be able to make authenticated calls to the backend canister, the frontend needs to have an identity.

[/src/frontend/src/main.tsx](/src/frontend/src/main.tsx)

## Run locally

```bash
npm i
dfx start --clean --background
dfx deploy
```

## `ic-use-internet-identity` Features

- **Cached Identity**: The identity is cached in local storage and restored on page load. This allows the user to stay logged in even if the page is refreshed.
- **Login progress**: State varibles are provided to indicate whether the user is logged in, logging in, or logged out.
- **Works with ic-use-actor**: Plays nicely with [ic-use-actor](https://www.npmjs.com/package/ic-use-actor) that provides easy access to canister methods.

## Details

### 1. The `InternetIdentityProvider` component

The application's root component is wrapped with `InternetIdentityProvider` to provide all child components access to the identity context.

```jsx
// main.tsx

import { InternetIdentityProvider } from "ic-use-internet-identity";
import React from "react";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <InternetIdentityProvider>
      <App />
    </InternetIdentityProvider>
  </React.StrictMode>
);
```

### 2. Connect the `login()` function to a button

Calling `login()` opens up the Internet Identity service in a new window where the user is asked to sign in. Once signed in, the window closes and the identity is stored in local storage. The identity is then available in the `identity` context variable.

Use the `loginStatus` state variable to track the status of the login process. The `loginStatus` can be one of the following values: `idle`, `logging-in`, `success`, or `error`.

```jsx
// LoginButton.tsx

import { useInternetIdentity } from "ic-use-internet-identity";

export function LoginButton() {
  const { login, loginStatus } = useInternetIdentity();

  const disabled = loginStatus === "logging-in" || loginStatus === "success";
  const text = loginStatus === "logging-in" ? "Logging in..." : "Login";

  return (
    <button onClick={login} disabled={disabled}>
      {text}
    </button>
  );
}
```

### 3. Use the `identity` context variable to access the identity

The `identity` context variable contains the identity of the currently logged in user. The identity is available after successfully loading the identity from local storage or completing the login process.

The preferred way to use the identity is to connect it to the [ic-use-actor](https://www.npmjs.com/package/ic-use-actor) hook. The hook provides a typed interface to the canister methods as well as interceptor functions for handling errors etc.

```jsx
// Actors.tsx

import { ReactNode } from "react";
import {
  ActorProvider,
  createActorContext,
  createUseActorHook,
} from "ic-use-actor";
import {
  canisterId,
  idlFactory,
} from "path-to/your-service/index";
import { _SERVICE } from "path-to/your-service.did";
import { useInternetIdentity } from "ic-use-internet-identity";

const actorContext = createActorContext<_SERVICE>();
export const useActor = createUseActorHook<_SERVICE>(actorContext);

export default function Actors({ children }: { children: ReactNode }) {
  const { identity } = useInternetIdentity();

  return (
    <ActorProvider<_SERVICE>
      canisterId={canisterId}
      context={actorContext}
      identity={identity}
      idlFactory={idlFactory}
    >
      {children}
    </ActorProvider>
  );
}
```

## Contributing

Contributions are welcome. Please submit your pull requests or open issues to propose changes or report bugs.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
