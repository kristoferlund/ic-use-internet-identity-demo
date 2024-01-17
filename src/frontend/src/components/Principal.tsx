import { PrincipalPill } from "./PrincipalPill";
import Spinner from "./Spinner";
import { useInternetIdentity } from "ic-use-internet-identity";

export default function Principal({ principal }: { principal?: string }) {
  const { identity } = useInternetIdentity();

  if (!identity) return null;

  return (
    <div className="flex items-center">
      Your principal is:
      {principal ? (
        <PrincipalPill principal={principal} />
      ) : (
        <div className="inline-block px-5 ml-3 rounded bg-zinc-600">
          <Spinner className="w-10 h-16" />
        </div>
      )}
    </div>
  );
}
