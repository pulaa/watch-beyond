"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import { Input } from "@heroui/input";
import { ThemeSwitch } from "@/components/theme-switch";
import { useSearchStore } from "@/store/use-search-store";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState } from "react";
import { IconSearch } from "@tabler/icons-react";

export const Navbar = () => {
  const { searchQuery, setSearchQuery, clearSearch } = useSearchStore();

  const [inputValue, setInputValue] = useState(searchQuery);

  const debouncedValue = useDebounce(inputValue, 1000);

  useEffect(() => {
    setSearchQuery(debouncedValue);
  }, [debouncedValue, setSearchQuery]);

  const searchInput = (
    <Input
      aria-label="Search"
      // classNames={{
      //   inputWrapper: "bg-default-100",
      //   input: "text-sm",
      // }}
      fullWidth
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
  );

  return (
    <HeroUINavbar
      classNames={{
        wrapper: "bg-transparent",
        base: "mt-4 bg-transparent",
      }}
    >
      <NavbarContent justify="center" className="mx-auto">
        <NavbarItem>{searchInput}</NavbarItem>
      </NavbarContent>
      {/* <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent> */}
    </HeroUINavbar>
  );
};
