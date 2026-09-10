import * as React from "react";

import { cn } from "@/lib/utils";

// dark:shadow-card relies on --shadow-card being overridden inside .dark in
// src/assets/css/index.css with a stronger elevated shadow than its :root value.
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn("bg-card rounded-xl shadow-soft dark:shadow-card", className)}
      {...props}
    />
  );
}

export { Card };
