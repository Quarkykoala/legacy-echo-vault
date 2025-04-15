"use client";
import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Database } from '../../../../../../shared/types/database.types';
import { ErrorBoundary } from "./ErrorBoundary";

interface VaultListProps {
  apiUrl?: string; // For testing or override
}

/**
 * VaultList component fetches and displays a list of vaults from the backend API.
 * Uses shared types, loading/error states, and accessibility best practices.
 */
export const VaultList: React.FC<VaultListProps> = ({ apiUrl = "/api/v1/vaults" }) => {
  const { data, isLoading, error } = useQuery<{ vaults: Database["public"]["Tables"]["vaults"]["Row"][] }>(
    ["vaults"],
    async () => {
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error("Failed to fetch vaults");
      return res.json();
    }
  );

  if (isLoading) {
    return <div role="status" aria-live="polite" className="p-4">Loading vaults…</div>;
  }
  if (error) {
    return <div role="alert" className="p-4 text-red-600">Error loading vaults.</div>;
  }
  if (!data?.vaults?.length) {
    return <div role="status" className="p-4">No vaults found.</div>;
  }
  return (
    <ErrorBoundary>
      <ul className="space-y-4" aria-label="Vault list">
        {data.vaults.map((vault) => (
          <li key={vault.id} className="p-4 rounded shadow bg-white dark:bg-gray-900" tabIndex={0} aria-label={`Vault: ${vault.name}`}>
            <div className="font-semibold text-lg">{vault.name}</div>
            <div className="text-sm text-gray-500">Theme: {vault.theme.join(", ")}</div>
            <div className="text-xs text-gray-400">Created: {new Date(vault.created_at).toLocaleString()}</div>
            <div className="text-xs text-gray-400">Created by: {vault.creator_id}</div>
          </li>
        ))}
      </ul>
    </ErrorBoundary>
  );
}; 