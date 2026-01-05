export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 py-4 text-center text-sm text-muted-foreground bg-background/80 backdrop-blur-sm">
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
