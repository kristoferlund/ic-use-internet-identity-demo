import Spinner from "./Spinner";
import { twMerge } from "tailwind-merge";
import { useInternetIdentity } from "ic-use-internet-identity";

export function LoginButton() {
  const { isLoggingIn, login, clear, identity } = useInternetIdentity();

  // If the user is logged in, clear the identity. Otherwise, log in.
  async function handleClick() {
    if (identity) {
      await clear();
    } else {
      await login();
    }
  }

  let className =
    "flex px-5 font-bold text-white bg-blue-500 rounded cursor-pointer h-9 md:h-16 hover:bg-blue-700 disabled:bg-blue-500/20 disabled:hover:bg-blue-500/20";
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
          <Spinner className="w-10 h-10 ml-3 md:w-20 md:h-20" />
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
