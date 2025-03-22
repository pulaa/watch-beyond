import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Tab, Tabs } from "@heroui/tabs";
import { CSSProperties, useEffect, useState } from "react";
import { Image } from "@heroui/image";
import { getMediaDetails } from "@/actions/movie-actions";
import WatchProviders from "./watch-providers";

interface MediaDetailModalProps {
  mediaType: "movie" | "tv";
  mediaId: number;
  isOpen: boolean;
  onClose: () => void;
}
// Format runtime to hours and minutes
const formatRuntime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};
export default function MediaDetailModal({
  isOpen,
  onClose,
  mediaType,
  mediaId,
}: MediaDetailModalProps) {
  const [details, setDetails] = useState<Awaited<
    ReturnType<typeof getMediaDetails>
  > | null>(null);
  useEffect(() => {
    if (mediaId) {
      Promise.all([
        getMediaDetails(mediaType, mediaId),
        // getExternalRatings(mediaType, mediaId),
      ])
        .then(([detailsData]) => {
          setDetails(detailsData);
        })
        .catch((error) => {
          console.error("Error fetching media details:", error);
        });
    }
  }, [mediaType, mediaId]);

  if (!details) {
    return null; // or a loading spinner
  }
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="5xl"
      scrollBehavior="outside"
    >
      <ModalContent>
        <div className="absolute h-full w-full -z-10">
          {details.backdrop_path && (
            <Image
              src={`https://image.tmdb.org/t/p/w1280${details.backdrop_path}`}
              alt={details.title}

            />
          )}

        </div>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Poster */}
            <div className="relative flex-shrink-0 w-32 sm:w-40 h-48 sm:h-60 rounded-lg overflow-hidden shadow-lg mx-auto sm:mx-0">
              <Image
                src={
                  details.poster_path
                    ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
                    : "/placeholder.svg?height=750&width=500"
                }
                alt={details.title}
                className="object-cover"
              />
            </div>

            {/* details Info */}
            <div className="flex-grow">
              <h2 className="text-2xl sm:text-3xl font-bold">
                {details.title}
              </h2>

              <div className="flex flex-wrap gap-2 mt-3">
                {details.genres.map((genre) => (
                  <Chip key={genre.id} variant="flat" size="sm">
                    {genre.name}
                  </Chip>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 mt-4 text-sm text-default-500">
                {details.release_date && (
                  <div className="flex items-center">
                    {/* <Calendar className="w-4 h-4 mr-1" /> */}
                    <span>
                      {new Date(details.release_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {details.runtime && (
                  <div className="flex items-center">
                    {/* <Clock className="w-4 h-4 mr-1" /> */}
                    <span>{formatRuntime(details.runtime)}</span>
                  </div>
                )}
                <div className="flex items-center">
                  {/* <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" /> */}
                  <span>{details.vote_average.toFixed(1)}</span>
                </div>
              </div>

              <p className="mt-4 text-default-500 line-clamp-4 sm:line-clamp-none">
                {details.overview}
              </p>
            </div>
          </div>
        </ModalHeader>

        <ModalBody>
          <WatchProviders providers={details?.["watch/providers"]} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
