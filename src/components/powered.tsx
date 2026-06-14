import { CloudflareLogo } from "./svgs";

export default function Powered() {
	return (
		<div className="flex flex-col items-center justify-center gap-10 py-12 border-t border-b border-border/10 w-full max-w-3xl mx-auto">
			<div className="flex flex-col items-center justify-center gap-2">
				<h3 className="text-foreground text-xs font-bold tracking-widest uppercase text-muted-foreground">Powered by</h3>
			</div>
			<div className="flex items-center justify-center gap-8 sm:gap-12 flex-wrap">
				<div className="flex items-center gap-2">
					<img
						src="https://waitlist.metareignity.com/logo.png"
						alt="METAREIGNITY Logo"
						className="h-7 w-7 object-contain rounded-md"
					/>
					<span className="font-sans font-black tracking-widest text-foreground text-sm">
						METAREIGNITY
					</span>
				</div>
				<div className="h-4 w-px bg-border/50 hidden sm:block" />
				<div className="flex items-center gap-2 text-foreground">
					<CloudflareLogo className="h-5 w-auto" />
					<span className="font-sans font-bold tracking-wider text-sm">
						Cloudflare
					</span>
				</div>
			</div>
		</div>
	);
}
