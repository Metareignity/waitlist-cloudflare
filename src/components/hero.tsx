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
				<img
					src="/mark.png"
					alt="METAREIGNITY Mark"
					className="w-48 h-48 sm:w-56 sm:h-56 object-contain animate-slow-breath"
				/>
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
				<h2 className="text-lg sm:text-xl font-semibold text-zinc-200 tracking-wide max-w-xl mx-auto uppercase">
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
