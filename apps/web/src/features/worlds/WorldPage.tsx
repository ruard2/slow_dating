import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { LoadingScreen } from "../../app/LoadingScreen";
import { WorldMap } from "../../components/WorldMap";
import { api } from "../../lib/api";

export function WorldPage() {
  const { worldId } = useParams();
  const queryClient = useQueryClient();
  const progress = useQuery({
    queryKey: ["progress"],
    queryFn: api.getProgress,
  });
  const purchase = useMutation({
    mutationFn: api.purchaseWorld,
    onSuccess: (value) => queryClient.setQueryData(["progress"], value),
  });
  const focusWorld = Number(worldId ?? 1);

  if (!progress.data) return <LoadingScreen />;

  return (
    <WorldMap
      focusWorld={
        Number.isInteger(focusWorld) && focusWorld >= 1 && focusWorld <= 5
          ? focusWorld
          : 1
      }
      progress={progress.data}
      purchaseWorld={(world) => purchase.mutate(world)}
      purchasing={purchase.isPending}
    />
  );
}
