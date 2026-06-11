import { z } from "zod";

export const contentPackMetadataSchema = z.object({
  gameId: z.string().min(1),
  version: z.number().int().positive(),
  locale: z.string().min(2),
});

export type ContentPackMetadata = z.infer<typeof contentPackMetadataSchema>;

export function defineContentPack<TContent>(
  metadata: ContentPackMetadata,
  content: TContent,
) {
  return {
    metadata: contentPackMetadataSchema.parse(metadata),
    content,
  } as const;
}
