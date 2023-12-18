"use client";

import { IconSun } from "@tabler/icons-react";
import Link from "next/link";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Footer(): React.ReactElement {
  const { setTheme, theme } = useTheme();

  return (
    <footer className="flex w-full items-center justify-between px-2 py-8 text-muted-foreground md:px-4 lg:px-6 xl:px-16">
      <span>
        © 2023{" "}
        <Link
          aria-label="Ian Steiger's GitHub profile"
          className="hover:underline"
          href="https://github.com/CrazyBalz"
        >
          Ian Steiger
        </Link>{" "}
        and{" "}
        <Link
          aria-label="Max Wiseman's GitHub profile"
          className="hover:underline"
          href="https://github.com/maxwiseman"
        >
          Max Wiseman
        </Link>
      </span>
      <div className="flex flex-row items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label="Change the color theme"
              size="icon"
              variant="outline"
            >
              <IconSun className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem
              checked={theme === "system"}
              onSelect={() => {
                setTheme("system");
              }}
            >
              System
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={theme === "dark"}
              onSelect={() => {
                setTheme("dark");
              }}
            >
              Dark
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={theme === "light"}
              onSelect={() => {
                setTheme("light");
              }}
            >
              Light
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Link
          aria-label="View the source code on GitHub"
          href={`https://github.com/${process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER}/${process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG}`}
          target="_blank"
        >
          <Button
            aria-label="View the source code on GitHub"
            size="icon"
            variant="outline"
          >
            <GitHubLogoIcon className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </footer>
  );
}
