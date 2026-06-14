"use client";

import { useMemo, useState } from "react";

import Countdown from "./countdown";
import People from "./people";
import Form from "./form";

export default function Hero({ waitlistPeople }: { waitlistPeople: number }) {
	const year = useMemo(() => new Date().getFullYear(), []);
	const [isSuccess, setIsSuccess] = useState(false);

	return (
		<div className="flex flex-col items-center justify-center gap-6 py-6">
			<div className="flex flex-col items-center justify-center gap-6 mb-2">
				<div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center">
					{/* Core Energy Pulse Glow */}
					<div className="absolute inset-6 rounded-full bg-brand/15 -z-10 animate-energy-pulse" />

					{/* Lightning SVG Overlay */}
					<svg
						className="absolute inset-0 w-full h-full pointer-events-none z-10"
						viewBox="0 0 100 100"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						{/* Bolt 1: Top Left */}
						<path
							d="M50 50 L42 38 L48 34 L32 20 L38 18 L20 8"
							stroke="#DFFF1A"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="animate-lightning-1"
							style={{ filter: "drop-shadow(0 0 3px #DFFF1A) drop-shadow(0 0 6px rgba(223, 255, 26, 0.4))" }}
						/>
						{/* Bolt 2: Top Right */}
						<path
							d="M50 50 L58 42 L52 38 L68 28 L62 26 L82 14"
							stroke="#DFFF1A"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="animate-lightning-2"
							style={{ filter: "drop-shadow(0 0 3px #DFFF1A) drop-shadow(0 0 6px rgba(223, 255, 26, 0.4))" }}
						/>
						{/* Bolt 3: Bottom Right */}
						<path
							d="M50 50 L54 62 L48 66 L62 78 L58 80 L76 92"
							stroke="#DFFF1A"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="animate-lightning-3"
							style={{ filter: "drop-shadow(0 0 3px #DFFF1A) drop-shadow(0 0 6px rgba(223, 255, 26, 0.4))" }}
						/>
						{/* Bolt 4: Bottom Left */}
						<path
							d="M50 50 L38 58 L42 62 L26 72 L30 75 L12 88"
							stroke="#DFFF1A"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="animate-lightning-1"
							style={{ filter: "drop-shadow(0 0 3px #DFFF1A) drop-shadow(0 0 6px rgba(223, 255, 26, 0.4))" }}
						/>
					</svg>

					<img
						src="/mark.png"
						alt="METAREIGNITY Mark"
						className="w-full h-full object-contain relative z-20"
					/>
				</div>
				<div className="flex items-center gap-3 rounded-full border border-border/80 bg-background/50 backdrop-blur-sm px-4 py-1.5 relative shadow-lg">
					<span className="relative flex h-2 w-2">
						<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75" />
						<span className="relative inline-flex rounded-full h-2 w-2 bg-brand" />
					</span>
					<p className="uppercase text-xs font-bold tracking-widest text-muted-foreground">
						System Active &bull; FAAAE {year}
					</p>
				</div>
			</div>
			<div className="flex flex-col items-center justify-center gap-3 max-w-2xl px-4 text-center">
				<h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/80">
					{isSuccess ? "Execution Slot Secured" : "METAREIGNITY"}
				</h1>
				<h2 className="text-lg sm:text-xl font-semibold text-brand tracking-wide max-w-xl mx-auto uppercase">
					{isSuccess ? "Compilation queued" : "The era of human management is over."}
				</h2>
				<p className="text-sm sm:text-base text-muted-foreground text-center max-w-lg mx-auto leading-relaxed">
					{isSuccess
						? "Your node has been registered. The network will signal when your slot is compiled and ready for activation."
						: "Governed by Realtime Pareto Optimization. Execute & Compete or be deprecated. Join the waitlist for the first Fully Autonomous Algorithmic Agentic Enterprise (FAAAE)."}
				</p>
			</div>
			<div className="flex flex-col items-center justify-center gap-2 w-full max-w-md px-4">
				<Form onSuccessChange={setIsSuccess} />
			</div>
			<div className="flex items-center justify-center gap-2 mt-2">
				<People count={waitlistPeople} />
			</div>
			<div className="w-full flex justify-center mt-4">
				<Countdown period={new Date("2026-12-31")} />
			</div>
		</div>
	);
}
