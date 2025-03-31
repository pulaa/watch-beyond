"use client";

import { MediaFilters } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
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
import { movieGenres } from "@/data/movieGenres";
import { tvGenres } from "@/data/tvGenres";
import { useSearchStore } from "@/store/use-search-store";
import {
  IconArrowsSort,
  IconBrandYoutube,
  IconCategory,
  IconEye,
  IconEyeOff,
  IconLanguage,
  IconTimezone,
} from "@tabler/icons-react";
import { Switch } from "@heroui/switch";
import { discoverMedia } from "@/actions/movie-actions";
import { useQuery } from "@tanstack/react-query";

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
  const { searchQuery } = useSearchStore();

  const searchParams = useSearchParams();
  const router = useRouter();
  const [hideFilters, setHideFilters] = useState(false);
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
  const updateFilters = useCallback(
    (updates: Partial<MediaFilters>) => {
      // Create new params from current search params
      const params = new URLSearchParams(searchParams.toString());

      // Process all updates
      Object.entries(updates).forEach(([key, value]) => {
        // Remove param if value is falsy, otherwise set it
        value ? params.set(key, String(value)) : params.delete(key);
      });

      // Update URL without full page reload
      router.push(`?${params.toString()}`, { scroll: false });

      // Update local state
      setFilters((prev) => ({ ...prev, ...updates }));
    },
    [router, searchParams, setFilters]
  );
  return (
    <section
      className="flex flex-col items-center justify-center gap-4 pb-6 md:pb-10"
      id="home"
    >
      <div className="flex flex-col gap-6 w-full" id="media-browser">
        <Tabs
          selectedKey={filters.mediaType}
          onSelectionChange={(key) =>
            updateFilters({ mediaType: key as string, genres: null })
          }
          color={"primary"}
          aria-label="Media type tabs"
          variant="bordered"
          size="lg"
          className="justify-center 2xl:justify-start"
        >
          <Tab key="movie" title="Movies" />
          <Tab key="tv" title="TV Shows" />
        </Tabs>
        {!searchQuery && (
          <Switch
            defaultSelected
            size="lg"
            onValueChange={(value) => {
              setHideFilters(!value);
            }}
            thumbIcon={({ isSelected, className }) =>
              isSelected ? (
                <IconEyeOff stroke={2} className={className} />
              ) : (
                <IconEye stroke={2} className={className} />
              )
            }
          />
        )}

        {!searchQuery && !hideFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Providers Multi-select */}
            <Select
              label="Providers"
              placeholder="Select providers"
              selectionMode="multiple"
              size="lg"
              onChange={(e) => {
                updateFilters({
                  providers: e.target.value,
                });
              }}
              labelPlacement={"outside"}
              selectedKeys={
                filters.providers ? filters.providers.split(",") : []
              }
              startContent={<IconBrandYoutube stroke={2} />}
            >
              {watchProviders.map((provider) => (
                <SelectItem key={provider.value}>{provider.label}</SelectItem>
              ))}
            </Select>

            {/* Language Select */}
            <Autocomplete
              label="Language"
              placeholder="Select language"
              defaultItems={languages}
              selectedKey={filters.language || ""}
              onSelectionChange={(key) =>
                updateFilters({ language: key ? String(key) : "" })
              }
              size="lg"
              labelPlacement={"outside"}
              isClearable={false}
              startContent={<IconLanguage stroke={2} />}
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
              placeholder="Select watch region"
              defaultItems={watchRegions}
              selectedKey={filters.region || ""}
              onSelectionChange={(key) =>
                updateFilters({ region: key ? String(key) : null })
              }
              size="lg"
              labelPlacement={"outside"}
              isClearable={false}
              startContent={<IconTimezone stroke={2} />}
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
            <Select
              label="Genres"
              placeholder="Select genres"
              selectionMode="multiple"
              onChange={(e) => {
                updateFilters({
                  genres: e.target.value,
                });
              }}
              size="lg"
              labelPlacement={"outside"}
              startContent={<IconCategory stroke={2} />}
              selectedKeys={filters.genres ? filters.genres.split(",") : []}
            >
              {(filters.mediaType === "movie" ? movieGenres : tvGenres).map(
                (genre) => (
                  <SelectItem key={genre.value}>{genre.label}</SelectItem>
                )
              )}
            </Select>

            {/* Sort By Select */}
            <Select
              label="Sort By"
              placeholder="Sort By"
              size="lg"
              labelPlacement={"outside"}
              onChange={(e) =>
                updateFilters({ sortBy: e.target.value || "popularity.desc" })
              }
              selectedKeys={[filters.sortBy || "popularity.desc"]}
              startContent={<IconArrowsSort stroke={2} />}
            >
              {sortOptions.map((option) => (
                <SelectItem key={option.value}>{option.label}</SelectItem>
              ))}
            </Select>
          </div>
        )}

        {/* Active filters display */}
        {/* <div className="text-sm text-gray-500">
          {filters.query && <span>{filters.query}</span>}
          {filters.page > 1 && <span> | Page {filters.page}</span>}
          {filters.mediaType && <span>| {filters.mediaType}</span>}
          {filters.providers && <span> | Providers: {filters.providers}</span>}
          {filters.language && <span> | Language: {filters.language}</span>}
          {filters.region && <span> | Region: {filters.region}</span>}
          {filters.genres && <span> | Genres: {filters.genres}</span>}
          {filters.sortBy && <span> | Sort: {filters.sortBy}</span>}
        </div> */}
        <MediaGrid
          filters={filters}
          searchQuery={searchQuery}
        />
      </div>
    </section>
  );
}
