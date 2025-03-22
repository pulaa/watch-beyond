"use client";
import NextImage from "next/image";

import { discoverMedia, searchMedia } from "@/actions/movie-actions";
import { MediaFilters } from "@/types";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Pagination } from "@heroui/pagination";
import { useEffect, useState } from "react";
import { Image } from "@heroui/image";
import { Chip } from "@heroui/chip";
import { IconCalendarMonth, IconStar } from "@tabler/icons-react";
import MediaDetailModal from "./media-detail-modal";

interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
}

interface MediaGridProps {
  onPageChange: (page: number) => void;
  filters: MediaFilters;
}

export default function MediaGridGrid({
  onPageChange,
  filters,
}: MediaGridProps) {
  const [results, setResults] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMedia, setSelectedMedia] = useState<{
    id: number;
    type: "movie" | "tv";
  } | null>(null);

  const {
    mediaType,
    providers,
    language,
    region,
    page,
    query,
    genres,
    sortBy,
  } = filters;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        let data;

        if (query) {
          data = await searchMedia(query, mediaType, page);
        } else {
          data = await discoverMedia(filters);
        }
        //  await new Promise((resolve) => setTimeout(resolve, 500))

        setResults(data.results);
        setTotalPages(data.total_pages);
      } catch (err) {
        setError("Error loading content. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mediaType, providers, language, region, page, query, genres, sortBy]);

  if (error) {
    return (
      // <Alert color="red" title="Error" icon={<IconAlertCircle size={16} />}>
      //   {error}
      // </Alert>
      <span className="block text-center text-red-500">{error}</span>
    );
  }

  return (
    <div className="w-full">
      {/* <Text size="xl" fw={600} mb="md">
        {searchQuery
          ? `Search results for "${searchQuery}"`
          : `${mediaType === "movie" ? "Movies" : "TV Shows"} on ${providerName}`}
      </Text> */}

      {loading ? (
        <>
          <span className="block text-center text-default-500">Loading...</span>
        </>
      ) : results.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.map((item) => (
              <Card
                className="max-w-sm"
                isPressable
                onPress={() =>
                  setSelectedMedia({
                    id: item.id,
                    type: mediaType as "movie" | "tv",
                  })
                }
                key={item.id}
              >
                <CardBody className="p-0 overflow-hidden">
                  <div className="relative">
                    <Image
                      alt={item.title || item.name || "poster"}
                      className="object-cover w-full aspect-[2/3]"
                      src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                      radius="none"
                    />
                    <Chip
                      startContent={<IconStar stroke={2} size={20} className="text-yellow-400" />}
                      className="absolute top-2 right-2 bg-black/50 border-none z-10 p-2.5"
                      color="default"
                      variant="bordered"
                      size="sm"
                    >
                      <span className="text-sm text-white">
                        {item.vote_average.toFixed(1)}
                      </span>
                    </Chip>
                  </div>
                </CardBody>
                <CardFooter className="flex flex-col items-start">
                  <h3 className="font-bold">
                    {item.title || item.name}
                  </h3>
                  <div className="flex items-center mt-1 text-sm text-default-500">
                    {item.release_date?.substring(0, 4) ||
                      item.first_air_date?.substring(0, 4) ||
                      "N/A"}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Pagination
              total={totalPages}
              page={page}
              onChange={onPageChange}
              showControls
              color="primary"
            />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          {/* <Icon 
            icon="lucide:search" 
            className="w-12 h-12 text-default-400"
          /> */}
          <p className="text-default-500">
            {query
              ? `No results found for "${query}". Try a different search term.`
              : "No results found. Try different filters."}
          </p>
        </div>
      )}

      {selectedMedia && (
        <MediaDetailModal
          mediaType={selectedMedia.type}
          mediaId={selectedMedia.id}
          isOpen={!!selectedMedia}
          onClose={() => setSelectedMedia(null)}
        />
      )}
    </div>
  );
}
