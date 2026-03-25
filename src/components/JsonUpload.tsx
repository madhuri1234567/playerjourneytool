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
        accept=".json,application/json"
        onChange={handleFile}
        className="sr-only"
      />
    </label>
  );
};

export default JsonUpload;
