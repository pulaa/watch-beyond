"use client";

import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@heroui/button";
import { IconCaretUp } from "@tabler/icons-react";

interface BackToTopProps {
  threshold?: number;
  className?: string;
  position?: "bottom-right" | "bottom-left";
}

export function BackToTop({
  threshold = 300,
  className,
  position = "bottom-right",
}: BackToTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > threshold);
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const positionClasses = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  return (
    <Button
      isIconOnly
      aria-label="Like"
      color="primary"
      size="lg"
      className={cn(
        "fixed z-50 rounded-full shadow-md transition-opacity duration-300",
        positionClasses[position],
        visible ? "opacity-100" : "opacity-0 pointer-events-none",
        className
      )}
      onPress={() => {
        scrollToTop();
      }}
    >
      <IconCaretUp stroke={2} />
    </Button>
  );
}
