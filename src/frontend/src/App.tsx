import { Counter } from "./components/Counter";
import { LoginButton } from "./components/LoginButton";
import { useInternetIdentity } from "ic-use-internet-identity";
import PrincipalPill from "./components/PrincipalPill";

function App() {
  const { identity } = useInternetIdentity();

  return (
    <div className="flex flex-col items-center w-full gap-5 p-10 font-sans text-2xl italic md:items-start md:gap-10 md:text-6xl">
      <img
        src="/ic.svg"
        alt="Internet Computer"
        className="w-40 mb-5 md:mb-0 md:w-96"
      />
      <div className="text-center">
        {identity ? "You are logged in." : "You are not logged in."}
      </div>
      <LoginButton />
      <PrincipalPill />
      <Counter />
      <div className="text-center">
        <a
          href="https://github.com/kristoferlund/ic-use-internet-identity-demo"
          className="underline"
        >
          Fork this demo.
        </a>
      </div>
    </div>
  );
}

export default App;
