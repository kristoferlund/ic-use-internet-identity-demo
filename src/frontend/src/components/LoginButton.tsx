import Spinner from "./Spinner";
import { twMerge } from "tailwind-merge";
import { useInternetIdentity } from "ic-use-internet-identity";

export function LoginButton() {
  const { isLoggingIn, login, clear, identity } = useInternetIdentity();

  // If the user is logged in, clear the identity. Otherwise, log in.
  function handleClick() {
    if (identity) {
      clear();
    } else {
      login();
    }
  }

  let className =
    "flex h-16 px-5 font-bold text-white bg-blue-500 rounded cursor-pointer hover:bg-blue-700 disabled:bg-blue-500/20 disabled:hover:bg-blue-500/20";
  className = isLoggingIn
    ? twMerge(className, "cursor-wait")
    : twMerge(className, "cursor-pointer");

  const text = () => {
    if (identity) {
      return "Logout";
    } else if (isLoggingIn) {
      return (
        <>
          Logging in
          <Spinner className="w-20 h-20 ml-3" />
        </>
      );
    }
    return "Login";
  };

  return (
    <button onClick={handleClick} className={className} disabled={isLoggingIn}>
      {text()}
    </button>
  );
}
