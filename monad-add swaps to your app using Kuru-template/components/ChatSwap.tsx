"use client";

import { useState, useRef, useEffect } from "react";
import {
  useAccount,
  useDisconnect,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useReadContract,
  useSwitchChain,
} from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { parseUnits, formatUnits, encodeFunctionData } from "viem";
import {
  generateToken,
  getQuoteWithReferral,
  type QuoteResponse,
} from "@/lib/kuru-flow";
import { monad } from "@/lib/wagmi";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Bot,
  User,
  ExternalLink,
} from "lucide-react";

import type { ParsedSwapIntent, ParseResult } from "@/app/api/parse-swap/route";

interface Message {
  role: "user" | "assistant";
  content: string;
  swapIntent?: ParsedSwapIntent;
  quote?: QuoteResponse;
  txHash?: string;
  status?: "pending" | "confirming" | "success" | "error";
}

const ERC20_ABI = [
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

const DEFAULT_ROUTER = "0xb3e6778480b2E488385E8205eA05E20060B813cb";

export function ChatSwap() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your AI swap assistant. Tell me what you'd like to swap, like \"swap 10 USDC to MON\" or \"buy 0.5 MON with USDC\".",
    },
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [pendingSwap, setPendingSwap] = useState<ParsedSwapIntent | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { address, isConnected, chainId, status } = useAccount();
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const isWrongNetwork = isConnected && chainId !== monad.id;

  const { sendTransaction, isPending: isSending, data: txHash } = useSendTransaction();
  const { sendTransaction: sendApproveTx, isPending: isApprovePending, data: approveTxHash } = useSendTransaction();

  const { isSuccess: swapConfirmed } = useWaitForTransactionReceipt({ hash: txHash });
  const { isSuccess: approveConfirmed } = useWaitForTransactionReceipt({ hash: approveTxHash });

  const routerAddress = DEFAULT_ROUTER;

  const { data: allowanceRaw, refetch: refetchAllowance } = useReadContract({
    address: pendingSwap?.fromTokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address ? [address, routerAddress as `0x${string}`] : undefined,
    query: { 
      enabled: !!pendingSwap && pendingSwap.fromTokenAddress !== "0x0000000000000000000000000000000000000000" 
    },
  });

  // Generate JWT when wallet connects
  useEffect(() => {
    async function fetchToken() {
      if (address) {
        try {
          const tokenResponse = await generateToken(address);
          setJwtToken(tokenResponse.token);
        } catch (err) {
          console.error("Failed to generate token:", err);
        }
      }
    }
    fetchToken();
  }, [address]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Update message when swap confirms
  useEffect(() => {
    if (swapConfirmed && txHash) {
      setMessages((prev) =>
        prev.map((m) =>
          m.txHash === txHash ? { ...m, status: "success" } : m
        )
      );
      setPendingSwap(null);
    }
  }, [swapConfirmed, txHash]);

  // Refetch allowance after approve
  useEffect(() => {
    if (approveConfirmed) {
      refetchAllowance();
    }
  }, [approveConfirmed, refetchAllowance]);

  const addMessage = (role: "user" | "assistant", content: string, extra?: Partial<Message>) => {
    setMessages((prev) => [...prev, { role, content, ...extra }]);
  };

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    setInput("");
    addMessage("user", userMessage);
    setIsProcessing(true);

    try {
      // Parse intent with AI
      const parseRes = await fetch("/api/parse-swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const parsed: ParseResult = await parseRes.json();

      if (parsed.action === "error" || parsed.action === "unclear") {
        addMessage("assistant", parsed.message);
        setIsProcessing(false);
        return;
      }

      // Valid swap intent
      const swapIntent = parsed as ParsedSwapIntent;
      
      if (!isConnected) {
        addMessage("assistant", `${swapIntent.message}\n\nPlease connect your wallet first to execute this swap.`);
        setIsProcessing(false);
        return;
      }

      if (isWrongNetwork) {
        addMessage("assistant", `${swapIntent.message}\n\nPlease switch to Monad network to continue.`);
        setIsProcessing(false);
        return;
      }

      if (!jwtToken) {
        addMessage("assistant", "Waiting for authentication... Please try again in a moment.");
        setIsProcessing(false);
        return;
      }

      // Get quote
      addMessage("assistant", `${swapIntent.message}\n\nFetching quote...`, { swapIntent });

      const amountWei = parseUnits(swapIntent.amount, swapIntent.fromDecimals).toString();
      
      const quote = await getQuoteWithReferral(
        address!,
        swapIntent.fromTokenAddress,
        swapIntent.toTokenAddress,
        amountWei,
        jwtToken!
      );

      if (quote.status !== "success") {
        addMessage("assistant", `Failed to get quote: ${quote.message || "Unknown error"}`);
        setIsProcessing(false);
        return;
      }

      const outputFormatted = formatUnits(BigInt(quote.output), swapIntent.toDecimals);
      const minOutFormatted = formatUnits(BigInt(quote.minOut), swapIntent.toDecimals);

      setPendingSwap(swapIntent);

      // Update last message with quote info
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: `**Quote Ready**\n\nSwap: ${swapIntent.amount} ${swapIntent.fromToken} → ~${parseFloat(outputFormatted).toFixed(6)} ${swapIntent.toToken}\nMinimum: ${parseFloat(minOutFormatted).toFixed(6)} ${swapIntent.toToken}\n\nClick "Execute Swap" to proceed or type another command.`,
          swapIntent,
          quote,
        };
        return updated;
      });
    } catch (error) {
      addMessage("assistant", `Error: ${error instanceof Error ? error.message : "Something went wrong"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const executeSwap = async (quote: QuoteResponse, swapIntent: ParsedSwapIntent) => {
    if (!quote.transaction) return;

    const amountWei = parseUnits(swapIntent.amount, swapIntent.fromDecimals);
    const isNative = swapIntent.fromTokenAddress === "0x0000000000000000000000000000000000000000";

    // Check allowance for ERC20
    if (!isNative && allowanceRaw !== undefined) {
      const allowance = allowanceRaw as bigint;
      if (amountWei > allowance) {
        // Need approval first
        addMessage("assistant", "Approving token spending... Please confirm in your wallet.");
        
        const approveData = encodeFunctionData({
          abi: ERC20_ABI,
          functionName: "approve",
          args: [quote.transaction.to as `0x${string}`, amountWei],
        });

        sendApproveTx({
          to: swapIntent.fromTokenAddress as `0x${string}`,
          data: approveData,
        });
        return;
      }
    }

    // Execute swap
    const calldata = quote.transaction.calldata.startsWith("0x")
      ? quote.transaction.calldata
      : `0x${quote.transaction.calldata}`;

    sendTransaction(
      {
        to: quote.transaction.to as `0x${string}`,
        data: calldata as `0x${string}`,
        value: BigInt(quote.transaction.value || "0"),
      },
      {
        onSuccess: (hash) => {
          addMessage("assistant", `Swap submitted! Waiting for confirmation...`, {
            txHash: hash,
            status: "confirming",
          });
        },
        onError: (error) => {
          addMessage("assistant", `Swap failed: ${error.message}`);
        },
      }
    );
  };

  return (
    <Card className="w-full max-w-2xl shadow-lg">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">AI Swap Agent</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <span className="text-sm text-muted-foreground font-mono">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
                <Button variant="ghost" size="sm" onClick={() => disconnect()}>
                  Disconnect
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={() => open()}>
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {isWrongNetwork && (
        <Alert variant="destructive" className="m-4 mb-0">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Please switch to Monad network</span>
            <Button size="sm" variant="outline" onClick={() => switchChain({ chainId: monad.id })}>
              Switch Network
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <CardContent className="p-0">
        {/* Messages */}
        <div className="h-[400px] overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                
                {msg.quote && msg.swapIntent && (
                  <Button
                    className="mt-3 w-full"
                    onClick={() => executeSwap(msg.quote!, msg.swapIntent!)}
                    disabled={isSending || isApprovePending}
                  >
                    {isSending || isApprovePending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {isApprovePending ? "Approving..." : "Confirming..."}
                      </>
                    ) : (
                      "Execute Swap"
                    )}
                  </Button>
                )}

                {msg.status === "confirming" && (
                  <div className="flex items-center gap-2 mt-2 text-yellow-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-xs">Confirming...</span>
                  </div>
                )}

                {msg.status === "success" && msg.txHash && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 text-green-600 mb-1">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-xs font-medium">Swap confirmed!</span>
                    </div>
                    <a
                      href={`https://monadexplorer.com/tx/${msg.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      View on Explorer <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type 'swap 10 USDC to ETH'..."
              disabled={isProcessing}
              className="flex-1"
            />
            <Button type="submit" disabled={isProcessing || !input.trim()}>
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
