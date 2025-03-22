"use client";

import { MediaFilters } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Tabs, Tab } from "@heroui/tabs";
import { Divider } from "@heroui/divider";
import { watchProviders } from "@/data/watchProviders";
import { Select, SelectSection, SelectItem } from "@heroui/select";
import { languages } from "@/data/languages";
import { watchRegions } from "@/data/region";
import {
  Autocomplete,
  AutocompleteSection,
  AutocompleteItem,
} from "@heroui/autocomplete";
import { Avatar } from "@heroui/avatar";
import MediaGrid from "./media-grid";
const sortOptions = [
  { value: "popularity.desc", label: "Popularity (High to Low)" },
  { value: "popularity.asc", label: "Popularity (Low to High)" },
  { value: "vote_average.desc", label: "Rating (High to Low)" },
  { value: "vote_average.asc", label: "Rating (Low to High)" },
  { value: "primary_release_date.desc", label: "Release Date (Newest)" },
  { value: "primary_release_date.asc", label: "Release Date (Oldest)" },
  { value: "revenue.desc", label: "Revenue (High to Low)" },
  { value: "revenue.asc", label: "Revenue (Low to High)" },
];

export default function MediaBrowser() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");

  // Create a single filters object from URL params or defaults
  const [filters, setFilters] = useState<MediaFilters>({
    mediaType: searchParams.get("mediaType") || "movie",
    providers: searchParams.get("providers"),
    language: searchParams.get("language"),
    region: searchParams.get("region") || "AU",
    page: Number.parseInt(searchParams.get("page") || "1", 10),
    query: "",
    genres: searchParams.get("genres"),
    sortBy: searchParams.get("sortBy") || "popularity.desc",
  });

  // Update filters and URL
  const updateFilters = (updates: Partial<MediaFilters>) => {
    const params = new URLSearchParams(searchParams);

    // Update URL params based on filter changes
    Object.entries(updates).forEach(([key, value]) => {
      console.log(key, value);
      if (!value) {
        params.delete(key);
      } else if (value) {
        params.set(key, value.toString());
      }
    });

    // Update URL
    router.push(`?${params.toString()}`);

    // Update state
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const clearSearch = () => {
    setSearchInput("");
  };
  const handleProvidersChange = (keys: React.Key | null) => {
    const values = String(keys).split(",").filter(Boolean);
    updateFilters({
      providers: values.length > 0 ? values.join(",") : null,
    });
  };
  return (
    <div className="flex flex-col gap-4">
      {/* <div className="w-full">
        <Input
          placeholder={`Search ${filters.mediaType === "movie" ? "movies" : "TV shows"}...`}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          endContent={
            searchInput ? (
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onClick={clearSearch}
              >
                <XIcon size={16} />
              </Button>
            ) : (
              <SearchIcon size={16} />
            )
          }
          className="w-full"
        />
      </div> */}

      <Tabs
        selectedKey={filters.mediaType}
        onSelectionChange={(key) => updateFilters({ mediaType: key as string })}
        fullWidth
        aria-label="Media type tabs"
        variant="underlined"
      >
        <Tab key="movie" title="Movies" />
        <Tab key="tv" title="TV Shows" />
      </Tabs>
      {!filters.query && (
        <div className="flex flex-wrap gap-3 items-center">
          {/* Providers Multi-select */}
          <Select
            label="Providers"
            placeholder="Select providers"
            selectionMode="multiple"
            className="max-w-xs"
            onChange={(e) => {
              updateFilters({
                providers: e.target.value,
              });
            }}
            selectedKeys={filters.providers ? filters.providers.split(",") : []}
          >
            {watchProviders.map((provider) => (
              <SelectItem key={provider.value}>{provider.label}</SelectItem>
            ))}
          </Select>

          {/* Language Select */}
          <Autocomplete
            label="Language"
            className="max-w-xs"
            placeholder="Select language"
            defaultItems={languages}
            selectedKey={filters.language || ""}
            onSelectionChange={(key) =>
              updateFilters({ language: key ? String(key) : null })
            }
            isClearable
          >
            {(language) => (
              <AutocompleteItem key={language.value}>
                {language.label}
              </AutocompleteItem>
            )}
          </Autocomplete>

          {/* Region Select */}
          <Autocomplete
            label="Watch Region"
            className="max-w-xs"
            placeholder="Select watch region"
            defaultItems={watchRegions}
            selectedKey={filters.region || ""}
            onSelectionChange={(key) =>
              updateFilters({ region: key ? String(key) : null })
            }
            isClearable={false}
          >
            {(region) => (
              <AutocompleteItem
                key={region.value}
                startContent={
                  <Avatar
                    alt={region.value}
                    className="w-6 h-6"
                    src={`https://flagcdn.com/${region.value.toLowerCase()}.svg`}
                  />
                }
              >
                {region.label}
              </AutocompleteItem>
            )}
          </Autocomplete>

          {/* Genres Multi-select */}
          {/* <Select
  label="Genres"
  placeholder="Select genres"
  selectionMode="multiple"
  className="max-w-xs"
  onChange={(e) => {
    const values = e.target.value.split(",").filter(Boolean);
    updateFilters({
      genres: values.length > 0 ? values.join(",") : null,
    });
  }}
  selectedKeys={filters.genres ? filters.genres.split(",") : []}
>
  {currentGenres.map((genre) => (
    <SelectItem key={genre.value} value={genre.value}>
      {genre.label}
    </SelectItem>
  ))}
</Select> */}

          {/* Sort By Select */}
          <Select
            label="Sort By"
            placeholder="Sort By"
            className="max-w-xs"
            onChange={(e) =>
              updateFilters({ sortBy: e.target.value || "popularity.desc" })
            }
            selectedKeys={[filters.sortBy || "popularity.desc"]}
          >
            {sortOptions.map((option) => (
              <SelectItem key={option.value}>{option.label}</SelectItem>
            ))}
          </Select>
        </div>
      )}

      {/* Active filters display */}
      <div className="text-sm text-gray-500">
        {filters.query && <span>{filters.query}</span>}
        {filters.page > 1 && <span> | Page {filters.page}</span>}
        {filters.mediaType && <span>| {filters.mediaType}</span>}
        {filters.providers && <span> | Providers: {filters.providers}</span>}
        {filters.language && <span> | Language: {filters.language}</span>}
        {filters.region && <span> | Region: {filters.region}</span>}
        {filters.genres && <span> | Genres: {filters.genres}</span>}
        {filters.sortBy && <span> | Sort: {filters.sortBy}</span>}
      </div>
      <MediaGrid
        filters={filters}
        onPageChange={(newPage) => updateFilters({ page: newPage })}
      />
    </div>
  );
}
