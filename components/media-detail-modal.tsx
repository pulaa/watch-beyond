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
import { IconCalendarWeek, IconClock, IconStar } from "@tabler/icons-react";

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
      // classNames={{
      //   base: "bg-gradient-to-t from-black via-black/40 to-black/30",
      // }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 pt-16 relative -z-10">
          {details.backdrop_path && (
            <div className="absolute inset-0 w-full rounded-t-lg overflow-hidden">
              <Image
                src={`https://image.tmdb.org/t/p/w1280${details.backdrop_path}`}
                alt={mediaType === "movie" ? details.title : details.name}
                className="object-cover w-full h-full"
              />
              {/* <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/90"></div> */}
            </div>
          )}

          <div className="relative z-10 flex flex-col sm:flex-row gap-6">
            {/* Poster */}
            <div className="relative flex-shrink-0 w-32 sm:w-40 h-48 sm:h-60 rounded-lg overflow-hidden shadow-lg mx-auto sm:mx-0">
              <Image
                src={
                  details.poster_path
                    ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
                    : "/placeholder.svg?height=750&width=500"
                }
                alt={mediaType === "movie" ? details.title : details.name}
                className="object-cover"
              />
            </div>

            {/* details Info */}
            <div className="flex-grow">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                {mediaType === "movie" ? details.title : details.name}
              </h2>

              <div className="flex flex-wrap gap-2 mt-3">
                {details.genres.map((genre) => (
                  <Chip key={genre.id} variant="shadow" size="sm">
                    {genre.name}
                  </Chip>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 mt-4 text-sm text-white/80">
                {details.release_date && (
                  <div className="flex items-center">
                    <IconCalendarWeek stroke={2} />
                    <span>
                      {new Date(details.release_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {details.runtime && (
                  <div className="flex items-center">
                    <IconClock stroke={2} />
                    <span>{formatRuntime(details.runtime)}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <IconStar stroke={2} />
                  <span>{details.vote_average.toFixed(1)}</span>
                </div>
              </div>

              <p className="mt-4 text-white/70 line-clamp-4 sm:line-clamp-none">
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
