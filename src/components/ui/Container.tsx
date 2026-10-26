import { type ReactNode } from "react";

export default function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1400px] px-[var(--gutter)] ${className}`}>
      {children}
    </div>
  );
}
