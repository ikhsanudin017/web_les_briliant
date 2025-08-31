import * as React from "react";

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm">
        {children}
      </table>
    </div>
  );
}
export function THead({ children }: { children: React.ReactNode }) {
  return <thead className="bg-gray-50 dark:bg-gray-900/50 text-left text-xs text-gray-500">{children}</thead>;
}
export function TBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y">{children}</tbody>;
}
export function TR({ children }: { children: React.ReactNode }) { return <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-900/50">{children}</tr>; }
export function TH({ children }: { children: React.ReactNode }) { return <th className="px-3 py-2 font-medium">{children}</th>; }
export function TD({ children }: { children: React.ReactNode }) { return <td className="px-3 py-2">{children}</td>; }

