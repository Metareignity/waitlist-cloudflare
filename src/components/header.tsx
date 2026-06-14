"use client";

import { cn } from "~/lib/utils";
import { useScroll } from "~/hooks/use-scroll";
import { GithubLogo } from "./svgs";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Header() {
	const scrolled = useScroll();

	return (
		<header
			className={cn(
				"py-4 flex flex-row gap-2 justify-between items-center md:px-10 sm:px-6 px-4 sticky top-0 z-50 transition-colors duration-200",
				scrolled &&
					"bg-background/80 backdrop-blur-md border-b border-border/50",
			)}
		>
			<Link href="/" className="flex items-center gap-3 cursor-pointer group hover:no-underline">
				<img
					src="/logo.png"
					alt="METAREIGNITY Logo"
					className="w-8 h-8 object-contain rounded-md group-hover:scale-105 transition-transform duration-200"
				/>
				<span className="font-sans font-bold text-lg tracking-wider text-foreground group-hover:text-foreground/90">
					METAREIGNITY
				</span>
			</Link>

			<div className="flex items-center gap-2">
				<Link
					href="https://github.com/Meta-Reignity"
					target="_blank"
					rel="noopener noreferrer"
					className="cursor-pointer"
				>
					<Button variant="secondary" className="flex items-center gap-2">
						<GithubLogo />
						GitHub
					</Button>
				</Link>
			</div>
		</header>
	);
}
