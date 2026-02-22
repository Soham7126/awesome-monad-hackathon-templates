import { NextRequest, NextResponse } from "next/server";

// Only MON and USDC are currently supported on Monad via Kuru Flow
const TOKEN_INFO: Record<string, { symbol: string; address: string; decimals: number }> = {
  mon: { symbol: "MON", address: "0x0000000000000000000000000000000000000000", decimals: 18 },
  monad: { symbol: "MON", address: "0x0000000000000000000000000000000000000000", decimals: 18 },
  usdc: { symbol: "USDC", address: "0x754704Bc059F8C67012fEd69BC8A327a5aafb603", decimals: 6 },
};

export interface ParsedSwapIntent {
  action: "swap";
  fromToken: string;
  toToken: string;
  amount: string;
  fromTokenAddress: string;
  toTokenAddress: string;
  fromDecimals: number;
  toDecimals: number;
  message: string;
}

export interface ParseError {
  action: "error" | "unclear";
  message: string;
}

export type ParseResult = ParsedSwapIntent | ParseError;

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!message) {
      return NextResponse.json(
        { action: "error", message: "Missing message" },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { action: "error", message: "OpenAI API key not configured. Add OPENAI_API_KEY to .env.local" },
        { status: 500 }
      );
    }

    const systemPrompt = `You are a swap intent parser for a cryptocurrency DEX on Monad blockchain. 
Parse user messages to extract swap intents. 

Available tokens: MON (native Monad token), USDC

Return a JSON object with:
- action: "swap" if valid swap intent, "unclear" if you need more info, "error" if invalid
- fromToken: source token symbol (lowercase)
- toToken: destination token symbol (lowercase)  
- amount: numeric amount as string (just the number, no $ or symbols)
- message: confirmation message or question for user

Examples:
"swap 10 usdc to mon" -> {"action":"swap","fromToken":"usdc","toToken":"mon","amount":"10","message":"Swapping 10 USDC to MON"}
"buy 0.5 mon with usdc" -> {"action":"swap","fromToken":"usdc","toToken":"mon","amount":"0.5","message":"Swapping 0.5 USDC to MON"}
"exchange $50 worth of mon for usdc" -> {"action":"swap","fromToken":"mon","toToken":"usdc","amount":"50","message":"Swapping 50 MON to USDC"}
"swap eth to btc" -> {"action":"error","message":"Only MON and USDC swaps are currently supported. Try 'swap 10 USDC to MON'"}
"hello" -> {"action":"unclear","message":"Hi! I can help you swap tokens. Currently supporting MON ↔ USDC. Try 'swap 10 USDC to MON'"}

Return ONLY valid JSON, no markdown.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        temperature: 0.1,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { action: "error", message: errorData.error?.message || "OpenAI API error" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { action: "error", message: "No response from AI" },
        { status: 500 }
      );
    }

    // Parse the JSON response
    const parsed = JSON.parse(content);

    // If it's a swap action, add token addresses
    if (parsed.action === "swap") {
      const fromInfo = TOKEN_INFO[parsed.fromToken.toLowerCase()];
      const toInfo = TOKEN_INFO[parsed.toToken.toLowerCase()];

      if (!fromInfo) {
        return NextResponse.json({
          action: "error",
          message: `Unknown token: ${parsed.fromToken}. Only MON and USDC swaps are currently supported.`,
        });
      }

      if (!toInfo) {
        return NextResponse.json({
          action: "error",
          message: `Unknown token: ${parsed.toToken}. Only MON and USDC swaps are currently supported.`,
        });
      }

      return NextResponse.json({
        ...parsed,
        fromToken: fromInfo.symbol,
        toToken: toInfo.symbol,
        fromTokenAddress: fromInfo.address,
        toTokenAddress: toInfo.address,
        fromDecimals: fromInfo.decimals,
        toDecimals: toInfo.decimals,
      } as ParsedSwapIntent);
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Parse error:", error);
    return NextResponse.json(
      { action: "error", message: "Failed to parse your request. Try something like 'swap 10 USDC to ETH'" },
      { status: 500 }
    );
  }
}
