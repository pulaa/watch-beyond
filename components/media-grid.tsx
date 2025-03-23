"use client";

import { discoverMedia, searchMedia } from "@/actions/movie-actions";
import { MediaFilters } from "@/types";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Pagination } from "@heroui/pagination";
import { useEffect, useState } from "react";
import { Image } from "@heroui/image";
import { Chip } from "@heroui/chip";
import { IconStar } from "@tabler/icons-react";
import MediaDetailModal from "./media-detail-modal";
import { Spinner } from "@heroui/spinner";
import { Alert } from "@heroui/alert";

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
  searchQuery?: string;
}

export default function MediaGridGrid({
  onPageChange,
  filters,
  searchQuery,
}: MediaGridProps) {
  const [results, setResults] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMedia, setSelectedMedia] = useState<{
    id: number;
    type: "movie" | "tv";
  } | null>(null);

  const { mediaType, providers, language, region, page, genres, sortBy } =
    filters;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        let data;

        if (searchQuery) {
          data = await searchMedia(searchQuery, mediaType, page);
        } else {
          data = await discoverMedia(filters);
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));

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
  }, [
    mediaType,
    providers,
    language,
    region,
    page,
    searchQuery,
    genres,
    sortBy,
  ]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <Alert color="danger" title="Error">
          {error}
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full mt-4">
      {/* <Text size="xl" fw={600} mb="md">
        {searchQuery
          ? `Search results for "${searchQuery}"`
          : `${mediaType === "movie" ? "Movies" : "TV Shows"} on ${providerName}`}
      </Text> */}

      {loading ? (
        <>
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Spinner variant="wave" />
          </div>
        </>
      ) : results.length > 0 ? (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-4">
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
                shadow="lg"
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
                      startContent={
                        <IconStar
                          stroke={2}
                          size={18}
                          className="text-yellow-400"
                        />
                      }
                      className="absolute top-2 right-2  z-10"
                      color="default"
                      variant="flat"
                      size="sm"
                    >
                      <span className="text-sm text-white">
                        {item.vote_average.toFixed(1)}
                      </span>
                    </Chip>
                  </div>
                </CardBody>
                {/* <CardFooter className="flex flex-col items-start">
                  <p className="font-bold">{item.title || item.name}</p>
                  <div className="flex items-center mt-1 text-sm text-default-500">
                    {item.release_date?.substring(0, 4) ||
                      item.first_air_date?.substring(0, 4) ||
                      "N/A"}
                  </div>
                </CardFooter> */}
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
          <Alert color="default">
            {searchQuery
              ? `No results found for "${searchQuery}". Try a different search term.`
              : "No results found. Try different filters."}
          </Alert>
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
