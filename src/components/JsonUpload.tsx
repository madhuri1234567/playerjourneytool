import { useCallback } from "react";
import { Upload } from "lucide-react";
import { parsePlayerJson } from "@/lib/parsePlayerJson";
import type { PlayerData } from "@/types/map";

interface JsonUploadProps {
  onDataLoaded: (data: PlayerData) => void;
  onError: (message: string) => void;
}

/** File upload button for loading player JSON data. */
const JsonUpload = ({ onDataLoaded, onError }: JsonUploadProps) => {
  const handleFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Detect Parquet / binary files by extension or name pattern
      const name = file.name.toLowerCase();
      if (!name.endsWith(".json") && file.type !== "application/json") {
        onError(
          "This file is not JSON. Raw parquet / .nakama files are not supported for direct upload. " +
          "All match data is already pre-loaded — use the Map, Date and Match filters above to browse."
        );
        e.target.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = parsePlayerJson(reader.result as string);
          onDataLoaded(data);
        } catch (err) {
          onError(err instanceof Error ? err.message : "Invalid JSON file.");
        }
      };
      reader.onerror = () => onError("Failed to read file.");
      reader.readAsText(file);

      // Reset input so the same file can be re-selected
      e.target.value = "";
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
