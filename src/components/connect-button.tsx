"use client";

import { useEffect } from "react";
import { useAccount } from "wagmi";
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";

interface ConnectButtonProps {
  onConnect?: () => void;
}

export function ConnectButton({ onConnect }: ConnectButtonProps) {
  const { isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && onConnect) onConnect();
  }, [isConnected, onConnect]);

  return <RainbowConnectButton />;
}
