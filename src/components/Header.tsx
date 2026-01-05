import logo from "@/assets/wipe-right-icon.png";
import { MobileLayoutToggle } from "./mobile/MobileLayoutToggle";

export function Header() {
  return (
    <header className="mb-2 md:mb-8 px-4 py-2 flex md:flex-col items-center gap-4">
      <img src={logo} alt="Wipe Right" className="flex-0 h-8 md:hidden" />
      <div className="flex flex-col md:items-center">
        <h1 className="text-xl md:text-4xl
                       md:pb-2 md:mx-auto
                       font-bold 
                       bg-gradient-to-r from-primary to-secondary
                       bg-clip-text text-transparent">
          Wipe Right
        </h1>
        <img src={logo} alt="Wipe Right" className="h-10 md:h-24 mx-auto my-2 hidden md:block" />
        <p className="text-muted-foreground text-xs md:text-lg">
          Find the best toilet paper value
        </p>
      </div>
      <MobileLayoutToggle />
    </header>
  );
}