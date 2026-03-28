import { useCallback } from "react";
import { Upload } from "lucide-react";
import { parsePlayerJson } from "@/lib/parsePlayerJson";
import type { PlayerData } from "@/types/map";

interface JsonUploadProps {
  onDataLoaded: (data: PlayerData) => void;
  onError: (message: string) => void;
}

const PARQUET_MAGIC = [0x50, 0x41, 0x52, 0x31] as const; // "PAR1"

const isParquetBinary = (buffer: ArrayBuffer): boolean => {
  if (buffer.byteLength < 4) return false;
  const bytes = new Uint8Array(buffer, 0, 4);
  return PARQUET_MAGIC.every((magic, idx) => bytes[idx] === magic);
};

const extractMatchShortId = (fileName: string): string | null => {
  const underscoreMatch = fileName.match(/_([0-9a-f]{8})-[0-9a-f-]+\.(?:nakama-0|parquet)$/i);
  if (underscoreMatch) return underscoreMatch[1];

  const directMatch = fileName.match(/^([0-9a-f]{8})-[0-9a-f-]+\.(?:nakama-0|parquet)$/i);
  if (directMatch) return directMatch[1];

  return null;
};

/** File upload button for loading player JSON data. */
const JsonUpload = ({ onDataLoaded, onError }: JsonUploadProps) => {
  const handleFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const processFile = async () => {
        const lowerName = file.name.toLowerCase();
        const buffer = await file.arrayBuffer();

        const looksLikeParquet =
          isParquetBinary(buffer) || lowerName.endsWith(".parquet") || lowerName.endsWith(".nakama-0");

        if (looksLikeParquet) {
          const shortId = extractMatchShortId(lowerName);
          if (!shortId) {
            throw new Error(
              "Parquet file detected, but I couldn't extract the match ID from its filename."
            );
          }

          const res = await fetch(`/data/matches/${shortId}.json`);
          if (!res.ok) {
            throw new Error(
              `Could not locate converted match data for ${shortId}. Please use a file from the provided dataset bundle.`
            );
          }

          const convertedJson = await res.text();
          const data = parsePlayerJson(convertedJson);
          onDataLoaded(data);
          return;
        }

        const text = new TextDecoder().decode(buffer);
        const data = parsePlayerJson(text);
        onDataLoaded(data);
      };

      processFile()
        .catch((err) => {
          onError(err instanceof Error ? err.message : "Failed to parse uploaded file.");
        })
        .finally(() => {
          // Reset input so the same file can be re-selected
          e.target.value = "";
        });
    },
    [onDataLoaded, onError]
  );

  return (
    <label className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
      <Upload className="w-3.5 h-3.5" />
      Load JSON
      <input
        type="file"
        accept="*/*"
        onChange={handleFile}
        className="sr-only"
      />
    </label>
  );
};

export default JsonUpload;

