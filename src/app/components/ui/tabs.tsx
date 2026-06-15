"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "./utils";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const listRef = React.useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = React.useState({
    width: 0,
    left: 0,
  });

  React.useEffect(() => {
    const updateIndicator = () => {
      if (!listRef.current) return;
      
      const activeButton = listRef.current.querySelector(
        '[data-state="active"]'
      ) as HTMLElement;
      
      if (activeButton) {
        const listRect = listRef.current.getBoundingClientRect();
        const buttonRect = activeButton.getBoundingClientRect();
        
        setIndicatorStyle({
          width: buttonRect.width,
          left: buttonRect.left - listRect.left,
        });
      }
    };

    updateIndicator();
    
    // Watch for changes in the DOM
    const observer = new MutationObserver(updateIndicator);
    if (listRef.current) {
      observer.observe(listRef.current, {
        attributes: true,
        subtree: true,
        attributeFilter: ['data-state'],
      });
    }

    // Also update on resize
    window.addEventListener('resize', updateIndicator);
    
    // Use a small delay to ensure DOM is fully rendered
    const timeoutId = setTimeout(updateIndicator, 50);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateIndicator);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <TabsPrimitive.List
      ref={listRef}
      data-slot="tabs-list"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-xl p-[3px] flex relative",
        className,
      )}
      {...props}
    >
      {/* Sliding background indicator */}
      <div
        className="absolute bg-card dark:bg-input/30 rounded-xl border border-transparent dark:border-input transition-all duration-200 ease-in-out pointer-events-none"
        style={{
          width: `${indicatorStyle.width}px`,
          height: 'calc(100% - 6px)',
          transform: `translateX(${indicatorStyle.left}px)`,
          top: '3px',
        }}
      />
      {props.children}
    </TabsPrimitive.List>
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 relative z-10",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };