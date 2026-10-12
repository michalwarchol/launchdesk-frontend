import { useEffect, useState } from "react";

export function useObjectUrl(blob: Blob, type?: string): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const typed = type && blob.type !== type ? new Blob([blob], { type }) : blob;
    const objectUrl = URL.createObjectURL(typed);
    // Publish the URL from the effect so cleanup revokes that same URL, including under Strict Mode.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
      setUrl(null);
    };
  }, [blob, type]);

  return url;
}
