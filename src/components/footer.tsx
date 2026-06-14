import Link from "next/link";

export default function Footer() {
	return (
		<footer className="flex flex-col justify-center items-center gap-4 pb-8 pt-4">
			<div>
				<p className="text-xs text-muted-foreground text-center">
					&copy; {new Date().getFullYear()}{" "}
					<Link
						href="https://github.com/Meta-Reignity"
						className="font-bold text-foreground hover:text-foreground/90 transition-colors duration-200"
						target="_blank"
						rel="noopener noreferrer"
					>
						METAREIGNITY
					</Link>
					. Governed programmatically.
				</p>
			</div>
		</footer>
	);
}
