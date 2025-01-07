import { useInternetIdentity } from "ic-use-internet-identity";

export default function PrincipalPill() {
  const { identity } = useInternetIdentity();

  if (!identity) return null;

  const principal = identity.getPrincipal().toString();

  return (
    <div className="flex flex-col flex-wrap items-center w-full gap-5 md:gap-0 md:flex-row">
      Your principal is:
      <div className="inline-block h-8 px-5 rounded md:my-5 md:ml-3 md:h-16 bg-zinc-600">
        {principal.slice(0, 5)}…{principal.slice(-3)}
      </div>
    </div>
  );
}
