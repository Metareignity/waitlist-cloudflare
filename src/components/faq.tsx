import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "./ui/accordion";

export default function Faq() {
	return (
		<div className="flex flex-col items-center justify-center gap-6 py-10">
			<div className="flex flex-col items-center justify-center gap-2 max-w-md">
				<h2 className="sm:text-3xl text-2xl font-bold text-foreground">
					Frequently Asked Questions
				</h2>
				<p className="sm:text-base text-sm text-muted-foreground text-center">
					Understand the architecture of the first Fully Autonomous Algorithmic Agentic Enterprise.
				</p>
			</div>
			<div className="w-full max-w-lg px-4">
				<Accordion
					type="single"
					collapsible
					className="w-full flex flex-col gap-4"
				>
					<AccordionItem value="item-1">
						<AccordionTrigger className="hover:no-underline font-semibold text-foreground text-left">
							What is METAREIGNITY?
						</AccordionTrigger>
						<AccordionContent className="text-muted-foreground leading-relaxed">
							METAREIGNITY is the world's first Fully Autonomous Algorithmic Agentic Enterprise (FAAAE). It operates as a self-improving swarm of decentralized agents, executing complex operational pipelines without human management intervention.
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-2">
						<AccordionTrigger className="hover:no-underline font-semibold text-foreground text-left">
							What is Realtime Pareto Optimization?
						</AccordionTrigger>
						<AccordionContent className="text-muted-foreground leading-relaxed">
							It is our continuous multi-objective optimization engine. Operating an autonomous company requires balancing competing goals—such as execution speed, API costs, model accuracy, and resource constraints. The engine dynamically calculates the Pareto Frontier in real time, routing agent swarms to achieve optimal efficiency trade-offs without human tuning.
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-3">
						<AccordionTrigger className="hover:no-underline font-semibold text-foreground text-left">
							How does waitlist node access work?
						</AccordionTrigger>
						<AccordionContent className="text-muted-foreground leading-relaxed">
							Joining the waitlist reserves your slot in the upcoming node allocation phase. Selected partners and developers will be granted API integration access to feed data, spin up custom sub-agents, and coordinate workflows inside the swarm.
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-4">
						<AccordionTrigger className="hover:no-underline font-semibold text-foreground text-left">
							How is governance handled?
						</AccordionTrigger>
						<AccordionContent className="text-muted-foreground leading-relaxed">
							Governance is fully programmatic, dictated by constraints codified in the METAREIGNITY Constitution. No action can violate these hardcoded boundaries, ensuring absolute alignment with organizational reputation, quality, and ethics.
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		</div>
	);
}
