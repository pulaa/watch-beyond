"use client";

import { discoverMedia, searchMedia } from "@/actions/movie-actions";
import { MediaFilters } from "@/types";
import { Card, CardBody } from "@heroui/card";
import { useEffect, useRef, useCallback, useState } from "react";
import { Image } from "@heroui/image";
import { Chip } from "@heroui/chip";
import { IconStar } from "@tabler/icons-react";
import { Spinner } from "@heroui/spinner";
import { Alert } from "@heroui/alert";
import MediaDetailModal2 from "./media-detail-modal-2";
import { useInfiniteQuery } from "@tanstack/react-query";

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
  filters: MediaFilters;
  searchQuery?: string;
}

export default function MediaGridGrid({
  filters,
  searchQuery,
}: MediaGridProps) {
  const [selectedMedia, setSelectedMedia] = useState<{
    id: number;
    type: "movie" | "tv";
  } | null>(null);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: searchQuery
      ? ["Search", searchQuery, filters.mediaType]
      : ["Media", filters],
    queryFn: ({ pageParam = 1 }) => {
      if (searchQuery) {
        return searchMedia(searchQuery, filters.mediaType, pageParam);
      } else {
        return discoverMedia({ ...filters, page: pageParam });
      }
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page < Math.min(lastPage.total_pages, 500)) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(handleObserver, {
      rootMargin: "100px",
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver, loadMoreRef]);

  const allResults = data?.pages.flatMap((page) => page.results) || [];

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4 min-h-screen">
        <div className="mb-auto">
          <Alert color="danger" title="Error" className="mb-auto ">
            {error.message || "An unexpected error occurred."}
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mt-4">
      <div className="min-h-screen" id="media-grid">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4 min-h-screen">
            <Spinner variant="wave" className="mb-auto" />
          </div>
        ) : allResults.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {allResults.map((item) => (
                <Card
                  className="max-w-sm"
                  isPressable
                  onPress={() =>
                    setSelectedMedia({
                      id: item.id,
                      type: filters.mediaType as "movie" | "tv",
                    })
                  }
                  shadow="lg"
                  key={`${item.id}-${item.title || item.name}`}
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
                        className="absolute top-2 right-2 z-10"
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
                </Card>
              ))}
            </div>
            <div ref={loadMoreRef} className="flex justify-center my-8">
              {isFetchingNextPage && <Spinner size="md" color="primary" />}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-4 min-h-screen">
            <div className="mb-auto">
              <Alert color="default">
                {searchQuery
                  ? `No results found for "${searchQuery}". Try a different search term.`
                  : "No results found. Try different filters."}
              </Alert>
            </div>
          </div>
        )}
      </div>

      {selectedMedia && (
        <MediaDetailModal2
          mediaType={selectedMedia.type}
          mediaId={selectedMedia.id}
          isOpen={!!selectedMedia}
          onClose={() => setSelectedMedia(null)}
        />
      )}
    </div>
  );
}
