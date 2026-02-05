"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "./Button";

interface SearchBarProps {
  onSearch: (address: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = "Search wallet address..." }: SearchBarProps) {
  const [searchValue, setSearchValue] = useState("");
  const [isValid, setIsValid] = useState(true);

  const validateAddress = (address: string): boolean => {
    // Basic Ethereum address validation (0x followed by 40 hex characters)
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleSearch = () => {
    const trimmedAddress = searchValue.trim();
    if (trimmedAddress && validateAddress(trimmedAddress)) {
      setIsValid(true);
      onSearch(trimmedAddress);
    } else if (trimmedAddress) {
      setIsValid(false);
    }
  };

  const handleClear = () => {
    setSearchValue("");
    setIsValid(true);
    onSearch("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setIsValid(true);
            }}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className={`w-full pl-10 pr-10 h-10 rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              !isValid ? "border-destructive" : "border-input"
            }`}
          />
          {searchValue && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button onClick={handleSearch} size="default">
          Search
        </Button>
      </div>
      {!isValid && searchValue && (
        <p className="mt-2 text-sm text-destructive">
          Please enter a valid Ethereum address (0x followed by 40 characters)
        </p>
      )}
    </div>
  );
}
