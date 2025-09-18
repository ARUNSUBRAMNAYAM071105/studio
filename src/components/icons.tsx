import { Leaf } from "lucide-react";

export function AppLogo() {
  return (
    <div className="flex items-center gap-2">
      <Leaf className="h-6 w-6 text-primary" />
      <h1 className="text-xl font-bold tracking-tight font-headline text-primary">
        CropSafe AI
      </h1>
    </div>
  );
}
