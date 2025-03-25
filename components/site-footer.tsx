import type React from "react"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"

interface SiteFooterProps extends React.HTMLAttributes<HTMLElement> {
  className?: string
}

export function SiteFooter({ className, ...props }: SiteFooterProps) {
  return (
    <footer className={cn("bg-background", className)} {...props}>
      <div className="container flex flex-col items-center gap-4 py-6 md:flex-row md:justify-between md:py-8">
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © {new Date().getFullYear()} watch beyond. All rights reserved.
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Content data from</span>
            <Link
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <Image
                src="/tmdb.svg"
                alt="TMDB Logo"
                width={60}
                height={30}
                className="h-3 w-auto"
              />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Streaming services data from</span>
            <Link
              href="https://www.justwatch.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <Image
                src="/JustWatch-logo-large.webp"
                alt="JustWatch Logo"
                width={60}
                height={30}
                        className="h-3 w-auto"
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

