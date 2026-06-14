"use client";

import { cn } from "~/lib/utils";
import { useScroll } from "~/hooks/use-scroll";
import { GithubLogo } from "./svgs";
import { Button } from "./ui/button";
import Link from "next/link";

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" {...props}>
		<title>X (formerly Twitter)</title>
		<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
	</svg>
);

const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" {...props}>
		<title>LinkedIn</title>
		<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
	</svg>
);

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

			<div className="flex items-center gap-4">
				<Link
					href="https://linkedin.com/in/metareignity"
					target="_blank"
					rel="noopener noreferrer"
					className="text-muted-foreground hover:text-foreground transition-colors duration-200"
					aria-label="LinkedIn"
				>
					<LinkedInIcon className="w-5 h-5" />
				</Link>
				<Link
					href="https://x.com/metareignity"
					target="_blank"
					rel="noopener noreferrer"
					className="text-muted-foreground hover:text-foreground transition-colors duration-200"
					aria-label="X (Twitter)"
				>
					<XIcon className="w-5 h-5" />
				</Link>
				<Link
					href="https://github.com/Meta-Reignity"
					target="_blank"
					rel="noopener noreferrer"
					className="cursor-pointer ml-1"
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
