"use client";

import { useEffect, useState } from "react";
import { em, MultiSelect } from "@mantine/core";
import { getGenres } from "../actions/movie-actions";
import { useMediaQuery } from "@mantine/hooks";

interface GenreFilterProps {
  mediaType: string;
  selectedGenres: string[];
  onChange: (genres: string[]) => void;
}

interface Genre {
  id: number;
  name: string;
}

export default function GenreFilter({
  mediaType,
  selectedGenres,
  onChange,
}: GenreFilterProps) {
  const [genres, setGenres] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      setLoading(true);
      try {
        const genreData = await getGenres(mediaType);
        setGenres(
          genreData.map((genre) => ({
            value: genre.id.toString(),
            label: genre.name,
          }))
        );
      } catch (error) {
        console.error("Error fetching genres:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, [mediaType]);

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  
  return (
    <MultiSelect
      data={genres}
      value={selectedGenres}
      onChange={onChange}
      placeholder="Select genres"
      searchable
      clearable
      size={isMobile ? "xs" : "sm"}
      disabled={loading}
    />
  );
}
