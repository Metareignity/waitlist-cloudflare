"use client";

import { useEffect, useState } from "react";

export default function SpotlightBackground() {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
		// Start in the center of the viewport
		setMousePosition({
			x: window.innerWidth / 2,
			y: window.innerHeight / 2,
		});

		const handleMouseMove = (e: MouseEvent) => {
			setMousePosition({
				x: e.clientX,
				y: e.clientY,
			});
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, []);

	if (!isMounted) return null;

	return (
		<div className="fixed inset-0 -z-50 h-screen w-screen overflow-hidden bg-background pointer-events-none">
			{/* Spotlight glow following the cursor */}
			<div
				className="absolute inset-0 transition-opacity duration-300 ease-out"
				style={{
					background: `radial-gradient(650px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(223, 255, 26, 0.08), transparent 80%)`,
				}}
			/>

			{/* Minimalist Grid Lines Pattern */}
			<div 
				className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" 
			/>
		</div>
	);
}
