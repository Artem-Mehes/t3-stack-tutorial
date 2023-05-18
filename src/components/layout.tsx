import type { PropsWithChildren } from "react";

export const Layout = (props: PropsWithChildren) => {
  return (
    <main className="flex h-screen justify-center">
      <div className="flex w-full flex-col border-x border-slate-200 md:max-w-2xl">
        {props.children}
      </div>
    </main>
  );
};
