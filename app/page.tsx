import { birdeye, BirdeyeToken } from "@/lib/birdeye";
import LandingContent from "./LandingContent";

export default async function Home() {
  let trendingTokens: BirdeyeToken[] = [];

  try {
    // Production Grade: Show real tokens even on the landing page for "Wow" factor
    trendingTokens = await birdeye.getTrendingTokens(3);
  } catch (e) {
    console.error("Landing page fetch failed:", e);
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
      <LandingContent initialTokens={trendingTokens} />
    </div>
  );
}
