import Link from "next/link";

export default function Footer() {
	return (
		<footer className="flex flex-col justify-center items-center gap-4 pb-8 pt-4">
			<div>
				<p className="text-xs text-muted-foreground text-center">
					&copy; {new Date().getFullYear()}{" "}
					<Link
						href="https://metareignity.com"
						className="font-bold text-foreground hover:text-foreground/90 transition-colors duration-200"
						target="_blank"
						rel="noopener noreferrer"
					>
						METAREIGNITY
					</Link>
					. Governed programmatically.
				</p>
				<div className="sr-only" aria-hidden="true">
					<a href="https://metareignity.com" rel="dofollow">METAREIGNITY</a>
				</div>
			</div>
		</footer>
	);
}
