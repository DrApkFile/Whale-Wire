const BIRDEYE_API_KEY = process.env.BIRDEYE_API_KEY;
const BASE_URL = "https://public-api.birdeye.so";

export interface BirdeyeToken {
    address: string;
    name: string;
    symbol: string;
    price: number;
    v24hUSD: number;
    mc: number;
    logoURI?: string;
    priceChange24h?: number;
}

export interface BirdeyeWalletActivity {
    source: string;
    txHash: string;
    blockUnixTime: number;
    owner: string;
    from: {
        address: string;
        symbol: string;
        uiAmount: number;
    };
    to: {
        address: string;
        symbol: string;
        uiAmount: number;
    };
}

export interface TokenSecurity {
    ownerBalance: string;
    creatorAddress: string;
    creationTime: number;
    mintAddress: string;
    isMutable: boolean;
    isTop10Holders: boolean;
}

export const birdeye = {
    fetch: async (endpoint: string, params: Record<string, string> = {}) => {
        const url = new URL(`${BASE_URL}${endpoint}`);
        Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));

        const response = await fetch(url.toString(), {
            headers: {
                "X-API-KEY": BIRDEYE_API_KEY || "",
                "accept": "application/json",
                "x-chain": "solana",
            },
            next: { revalidate: 60 },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[BIRDEYE] ${response.status} | ${endpoint} | ${errorText}`);

            // Graceful degradation for restricted tiers
            if (response.status === 401 || response.status === 403 || response.status === 404) {
                return null;
            }

            throw new Error(`Birdeye API error: ${response.statusText}`);
        }

        const json = await response.json();
        return json.success ? json.data : (json.data || json);
    },

    getTrendingTokens: async (limit: number = 20): Promise<BirdeyeToken[]> => {
        const data = await birdeye.fetch("/defi/token_trending", {
            sort_by: "rank",
            sort_type: "desc",
            limit: limit.toString()
        });

        const tokens = data?.tokens || [];
        return tokens.map((t: any) => ({
            address: t.address,
            name: t.name || t.symbol,
            symbol: t.symbol,
            price: t.price || 0,
            v24hUSD: t.v24hUSD || t.volume24hUSD || 0,
            mc: t.mc || t.liquidity || 0,
            logoURI: t.logoURI,
            priceChange24h: t.price24hChangePercent || 0
        }));
    },

    getWalletActivity: async (address: string): Promise<BirdeyeWalletActivity[]> => {
        return birdeye.fetch("/defi/txs/wallet", { wallet: address });
    },

    getTokenPrice: async (address: string): Promise<{ value: number } | null> => {
        const data = await birdeye.fetch("/defi/price", { address });
        return data || null;
    },

    getTokenOverview: async (address: string): Promise<any> => {
        return birdeye.fetch("/defi/token_overview", { address });
    },

    getTokenSecurity: async (address: string): Promise<TokenSecurity | null> => {
        return birdeye.fetch("/defi/token_security", { address });
    },

    searchToken: async (query: string): Promise<BirdeyeToken[]> => {
        // Use v3 search for name lookups
        const data = await birdeye.fetch("/defi/v3/search", {
            target: "token",
            keyword: query,
            limit: "10"
        });

        const items = data?.items?.[0]?.result || [];
        return items.map((t: any) => ({
            address: t.address,
            name: t.name,
            symbol: t.symbol,
            price: t.price || 0,
            v24hUSD: t.volume_24h_usd || 0,
            mc: t.market_cap || t.fdv || 0,
            logoURI: t.logo_uri
        }));
    },
};
