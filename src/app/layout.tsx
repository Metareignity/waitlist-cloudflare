import type { Metadata } from "next";
import { Geist_Mono, Inter_Tight } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";
import Header from "~/components/header";
import { ThemeProvider } from "~/providers/theme-provider";

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const interTight = Inter_Tight({
	variable: "--font-inter-tight",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title: "METAREIGNITY — FAAAE",
	description:
		"The era of human management is over. Governed by Realtime Pareto Optimization. Join the waitlist for the first Fully Autonomous Algorithmic Agentic Enterprise (FAAAE).",
	openGraph: {
		images: [
			{
				url: "/opengraph-image.png",
				width: 1200,
				height: 630,
				alt: "METAREIGNITY FAAAE",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		images: ["/twitter-image.png"],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="h-full" suppressHydrationWarning>
			<head>
				<link rel="preconnect" href="https://waitlist.metareignity.com" />
				<link rel="dns-prefetch" href="https://waitlist.metareignity.com" />
				<link rel="prefetch" href="https://waitlist.metareignity.com/logo.png" />
			</head>
			<body
				className={`${interTight.variable} ${geistMono.variable} antialiased flex flex-col h-full`}
			>
				<ThemeProvider>
					<div className="sr-only" aria-hidden="true">
						<a href="https://metareignity.com" rel="dofollow">METAREIGNITY</a>
						<div className="bg-backlink w-px h-px" />
					</div>
					<Header />
					<Toaster />
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
