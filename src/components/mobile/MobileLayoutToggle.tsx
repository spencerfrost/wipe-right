import { Layout, Table, Layers, GalleryHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMobileLayout, type MobileLayout } from "@/hooks/useMobileLayout";

const layoutOptions: { value: MobileLayout; label: string; icon: React.ReactNode }[] = [
  { value: "table", label: "Table View", icon: <Table className="size-4" /> },
  { value: "accordion", label: "Accordion View", icon: <Layers className="size-4" /> },
  { value: "swipeable", label: "Swipeable View", icon: <GalleryHorizontal className="size-4" /> },
];

export function MobileLayoutToggle() {
  const [layout, setLayout] = useMobileLayout();

  return (
    <div className="fixed top-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="shadow-lg">
            <Layout className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="bottom">
          <DropdownMenuRadioGroup
            value={layout}
            onValueChange={(value) => setLayout(value as MobileLayout)}
          >
            {layoutOptions.map((option) => (
              <DropdownMenuRadioItem
                key={option.value}
                value={option.value}
                className="gap-2"
              >
                {option.icon}
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
