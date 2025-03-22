import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};



export interface MediaFilters {
  mediaType: string;
  providers: string | null;
  language: string | null;
  region: string | null;
  page: number;
  query: string | null;
  genres: string | null;
  sortBy: string;
}