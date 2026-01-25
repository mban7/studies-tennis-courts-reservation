import type { ReactNode } from 'react';
import "@/styles/index.css"

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={"min-h-screen bg-background text-foreground"}>
          <div className={"mx-auto px-4 py-8 max-w-7xl"}>
              {children}
          </div>
    </div>
  );
}
