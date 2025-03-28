"use client";
import { useEffect, useState } from "react";
import { Navbar } from "./navbar";
import { motion } from "motion/react";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearchStore } from "@/store/use-search-store";
import { Input } from "@heroui/input";
import { IconSearch } from "@tabler/icons-react";

export function HeroHighlightSection() {
  const { searchQuery, setSearchQuery, clearSearch } = useSearchStore();

  const [inputValue, setInputValue] = useState(searchQuery);

  const debouncedValue = useDebounce(inputValue, 1000);

  useEffect(() => {
    setSearchQuery(debouncedValue);
  }, [debouncedValue, setSearchQuery]);

  return (
    <motion.div
      initial={{ opacity: 0.0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.3,
        duration: 0.8,
        ease: "easeInOut",
      }}
      className="relative flex flex-col gap-4 items-center justify-center px-4 py-10"
    >
      <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
        Watch Beyond Borders with a VPN.
      </h1>
      <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
        Find where movies and TV shows are available across countries — and
        connect with a VPN to start watching.
      </p>
      <Input
        aria-label="Search"
        classNames={{
          inputWrapper: "max-w-lg mx-auto",
        }}
        labelPlacement="outside"
        placeholder="Search..."
        startContent={<IconSearch stroke={2} />}
        type="search"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onClear={() => {
          setInputValue("");
          clearSearch();
        }}
      />
    </motion.div>
  );
}
