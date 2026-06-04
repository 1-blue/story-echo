"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
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
        "border-hairline mx-auto max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl border-b-0 p-0",
        className,
      )}
      {...props}
    >
      {showHandle && (
        <div className="flex justify-center pt-3 pb-2">
          <div className="bg-hairline-strong h-1.5 w-12 rounded-full" aria-hidden="true" />
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
