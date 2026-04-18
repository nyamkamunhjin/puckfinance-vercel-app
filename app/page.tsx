import { HeroSection } from "@/components/landing/hero-section-new";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { FeaturesGrid } from "@/components/landing/features-grid";
import { LandingFooter } from "@/components/landing/landing-footer";

export const metadata = {
	title: "PuckFinance - Trading on Autopilot",
	description:
		"Automate your crypto strategies. Monitor performance in real-time. Stop staring at charts with AI-powered trading automation.",
	keywords:
		"crypto trading, cryptocurrency, trading automation, AI trading, portfolio management, real-time monitoring",
	openGraph: {
		title: "PuckFinance - Trading on Autopilot",
		description:
			"Automate your crypto strategies. Monitor performance in real-time. Stop staring at charts with AI-powered trading automation.",
		type: "website",
		locale: "en_US",
		siteName: "PuckFinance",
		images: [
			{
				url: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=1200&auto=format&fit=crop",
				width: 1200,
				height: 630,
				alt: "PuckFinance - Trading on Autopilot",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "PuckFinance - Trading on Autopilot",
		description:
			"Automate your crypto strategies. Monitor performance in real-time. Stop staring at charts with AI-powered trading automation.",
		creator: "@puckfinance",
		images: [
			{
				url: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=1200&auto=format&fit=crop",
				width: 1200,
				height: 630,
				alt: "PuckFinance - Trading on Autopilot",
			},
		],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	alternates: {
		canonical: "/",
	},
	other: {
		"theme-color": "#000000",
	},
};

export default function Home() {
	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "Organization",
						name: "PuckFinance",
						url: "https://puckfinance.com",
						logo: "https://puckfinance.com/logo.png",
						description:
							"Automate your crypto strategies. Monitor performance in real-time. Stop staring at charts with AI-powered trading automation.",
						sameAs: [
							"https://twitter.com/puckfinance",
							"https://github.com/puckfinance",
						],
						contactPoint: {
							"@type": "ContactPoint",
							contactType: "customer support",
							email: "support@puckfinance.com",
						},
					}),
				}}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "WebSite",
						name: "PuckFinance",
						url: "https://puckfinance.com",
						description:
							"Automate your crypto strategies. Monitor performance in real-time. Stop staring at charts with AI-powered trading automation.",
						potentialAction: {
							"@type": "SearchAction",
							target: "https://puckfinance.com/search?q={search_term_string}",
							"query-input": "required name=search_term_string",
						},
					}),
				}}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "SoftwareApplication",
						name: "PuckFinance",
						applicationCategory: "FinanceApplication",
						operatingSystem: "Web",
						offers: {
							"@type": "Offer",
							price: "0",
							priceCurrency: "USD",
						},
						aggregateRating: {
							"@type": "AggregateRating",
							ratingValue: "4.8",
							ratingCount: "1500",
						},
					}),
				}}
			/>
			<main className="flex min-h-screen flex-col">
				<HeroSection />
				<DashboardPreview />
				<FeaturesGrid />
				<LandingFooter />
			</main>
		</>
	);
}
