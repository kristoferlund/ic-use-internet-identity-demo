export function PrincipalPill({ principal }: { principal: string }) {
  return (
    <div className="inline-block h-16 px-5 ml-3 rounded bg-zinc-600">
      {principal.slice(0, 5)}…{principal.slice(-3)}
    </div>
  );
}
