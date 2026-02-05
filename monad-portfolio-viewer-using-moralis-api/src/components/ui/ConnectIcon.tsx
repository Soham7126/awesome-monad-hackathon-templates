import * as React from "react";
import { LogOut } from "lucide-react";

export interface ConnectIconHandle {
  // This can be used for future ref forwarding if needed
}

export const ConnectIcon = React.forwardRef<
  ConnectIconHandle,
  { size?: number; className?: string }
>(({ size = 20, className }, ref) => {
  return <LogOut size={size} className={className} />;
});
ConnectIcon.displayName = "ConnectIcon";
