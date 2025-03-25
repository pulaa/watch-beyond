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
import { User } from "@heroui/user";
import { Card, CardBody } from "@heroui/card";

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
export default function MediaDetailModal2({
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
      classNames={{
        body: "p-0",
        // base: "bg-red-50",
        closeButton: "z-10 text-white",
      }}
    >
      <ModalContent>
        {() => (
          <ModalBody>
            <div className="relative flex items-center justify-center py-5 px-4 sm:px-6 before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/80 before:to-black/40 before:rounded-2xl before:-z-[5]">
              <Card className="w-full max-w-sm md:max-w-2xl backdrop-blur-md bg-white/10">
                <CardBody className="flex flex-col justify-center items-center  md:flex-row gap-4 p-4 md:p-0">
                  <Image
                    removeWrapper
                    alt={details.title || details.name}
                    className="object-cover object-top"
                    src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
                    loading="lazy"
                    width={200}
                  />
                  <div>
                    <h3 className="text-large font-medium">
                      {mediaType === "movie" ? details.title : details.name}
                    </h3>
                    <div className="flex flex-col gap-3 pt-2 text-small text-default-500">
                      <p>{details.overview}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {details.genres.map((genre) => (
                        <Chip key={genre.id} variant="shadow" size="sm">
                          {genre.name}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </CardBody>
              </Card>
              <Image
                removeWrapper
                alt="Profile Cover"
                className="h-full w-full object-cover absolute inset-0 -z-10 rounded-2xl"
                src={`https://image.tmdb.org/t/p/w1280${details.backdrop_path}`}
              />
            </div>
            <div className="px-4 sm:px-6 pb-6">
              <div className="flex gap-3 mb-4">
                {details.release_date && (
                  <Chip
                    startContent={<IconCalendarWeek stroke={2} width={25} />}
                    variant="flat"
                    radius="md"
                    className="px-2 py-4"
                  >
                    {new Date(details.release_date).toLocaleDateString()}
                  </Chip>
                )}
                {details.runtime && (
                  <Chip
                    startContent={<IconClock stroke={2} width={25} />}
                    variant="flat"
                    radius="md"
                    className="px-2 py-4"
                  >
                    {formatRuntime(details.runtime)}
                  </Chip>
                )}
                <Chip
                  startContent={<IconStar stroke={2} width={25} />}
                  variant="flat"
                  radius="md"
                  className="px-2 py-4"
                >
                  {details.vote_average.toFixed(1)}
                </Chip>
              </div>
              <div className="flex  flex-col  mt-4 ">
                <WatchProviders providers={details?.["watch/providers"]} />
              </div>
            </div>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
}
