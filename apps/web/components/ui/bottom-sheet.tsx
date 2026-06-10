"use client";

import * as React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type BottomSheetContentProps = React.ComponentPropsWithoutRef<typeof SheetContent> & {
  showHandle?: boolean;
  showClose?: boolean;
  unpadded?: boolean;
};

const BottomSheet = Sheet;
const BottomSheetTrigger = SheetTrigger;
const BottomSheetClose = SheetClose;
const BottomSheetHeader = SheetHeader;
const BottomSheetTitle = SheetTitle;
const BottomSheetDescription = SheetDescription;
const BottomSheetFooter = SheetFooter;

const BottomSheetContent = React.forwardRef<
  React.ElementRef<typeof SheetContent>,
  BottomSheetContentProps
>(
  (
    { className, children, showHandle = true, showClose = false, unpadded = false, ...props },
    ref,
  ) => (
    <SheetContent
      ref={ref}
      side="bottom"
      showClose={showClose}
      className={cn(
        "mx-auto max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl border-b-0 border-hairline p-0",
        className,
      )}
      {...props}
    >
      {showHandle && (
        <div className="flex justify-center pt-3 pb-2">
          <div className="h-1.5 w-12 rounded-full bg-hairline-strong" aria-hidden="true" />
        </div>
      )}
      {unpadded ? children : <div className="px-6 pb-8">{children}</div>}
    </SheetContent>
  ),
);
BottomSheetContent.displayName = "BottomSheetContent";

export {
  BottomSheet,
  BottomSheetTrigger,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetDescription,
  BottomSheetFooter,
};
