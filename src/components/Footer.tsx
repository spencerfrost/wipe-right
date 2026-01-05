import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn("py-4 text-center text-sm text-muted-foreground bg-background/80 backdrop-blur-sm", className)}>
      Made by{" "}
      <a
        href="https://spencerfrost.ca"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-foreground"
      >
        Spencer Frost
      </a>
    </footer>
  );
}
