"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";

type BootstrapDataProps = {
  compact?: boolean;
};

export function BootstrapData({ compact = false }: BootstrapDataProps) {
  const status = useQuery(api.site.getBootstrapStatus);
  const seedData = useMutation(api.seed.seedDemoData);
  const [isSeeding, setIsSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status?.hasData || isSeeding) {
      return;
    }

    let ignore = false;

    const run = async () => {
      try {
        setIsSeeding(true);
        await seedData({});
      } catch (seedError) {
        if (!ignore) {
          setError(seedError instanceof Error ? seedError.message : "Unable to seed demo data.");
        }
      } finally {
        if (!ignore) {
          setIsSeeding(false);
        }
      }
    };

    void run();

    return () => {
      ignore = true;
    };
  }, [isSeeding, seedData, status?.hasData]);

  if (status?.hasData) {
    return null;
  }

  return (
    <div className={compact ? "rounded-xl border border-border/70 bg-muted/50 p-4" : "card-surface p-5"}>
      <p className="text-sm font-semibold text-foreground">Initializing trip data</p>
      <p className="mt-2 text-sm text-muted-foreground">
        {error
          ? `Convex is reachable but demo seeding failed: ${error}`
          : "The app is preparing demo packages, hotels, vehicles, and itinerary days for the connected flow."}
      </p>
      {error ? (
        <Button
          className="mt-4"
          onClick={async () => {
            setError(null);
            setIsSeeding(true);
            try {
              await seedData({});
            } catch (seedError) {
              setError(seedError instanceof Error ? seedError.message : "Unable to seed demo data.");
            } finally {
              setIsSeeding(false);
            }
          }}
        >
          Retry initialization
        </Button>
      ) : null}
    </div>
  );
}
