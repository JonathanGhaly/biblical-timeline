import type { GenealogyData } from "../types/genealogy";
import fallbackData from "../data/bible-data.json";

export const DEFAULT_GIST_ID = "7f4ad06cefab6dccdaa739d5a086eb98";
export const GIST_FILE_NAME = "bible-data.json";

export interface GistSyncStatus {
  isLive: boolean;
  lastUpdated: string | null;
  error?: string | null;
  hasWriteToken: boolean;
}

export function getStoredToken(): string {
  return localStorage.getItem("github_gist_pat") || "";
}

export function setStoredToken(token: string) {
  if (!token.trim()) {
    localStorage.removeItem("github_gist_pat");
  } else {
    localStorage.setItem("github_gist_pat", token.trim());
  }
}

export function getStoredGistId(): string {
  return localStorage.getItem("github_gist_id") || DEFAULT_GIST_ID;
}

export function setStoredGistId(gistId: string) {
  if (!gistId.trim()) {
    localStorage.setItem("github_gist_id", DEFAULT_GIST_ID);
  } else {
    localStorage.setItem("github_gist_id", gistId.trim());
  }
}

/**
 * Fetches the genealogy and timeline data directly from GitHub Gist
 */
export async function fetchFromGist(customGistId?: string): Promise<{
  data: GenealogyData;
  updatedAt: string;
  isLive: boolean;
}> {
  const gistId = customGistId || getStoredGistId();
  const token = getStoredToken();

  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`https://api.github.com/gists/${gistId}`, {
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: HTTP ${response.status} ${response.statusText}`);
    }

    const gist = await response.json();
    const file = gist.files?.[GIST_FILE_NAME];

    if (!file || !file.content) {
      // If content was truncated, fetch raw_url
      if (file?.raw_url) {
        const rawRes = await fetch(file.raw_url, { cache: "no-store" });
        if (rawRes.ok) {
          const parsed = await rawRes.json();
          cacheLocalData(parsed);
          return { data: parsed, updatedAt: gist.updated_at || new Date().toISOString(), isLive: true };
        }
      }
      throw new Error(`File '${GIST_FILE_NAME}' not found in Gist`);
    }

    const parsedData: GenealogyData = JSON.parse(file.content);
    cacheLocalData(parsedData);
    return {
      data: parsedData,
      updatedAt: gist.updated_at || new Date().toISOString(),
      isLive: true,
    };
  } catch (err: any) {
    console.warn("Could not fetch from live Gist, falling back to local storage / bundle:", err);
    // Fallback: try localStorage then fallbackData
    const cached = getCachedLocalData();
    return {
      data: cached || (fallbackData as GenealogyData),
      updatedAt: new Date().toISOString(),
      isLive: false,
    };
  }
}

/**
 * Updates the live GitHub Gist with new genealogy and events data
 */
export async function saveToGist(
  data: GenealogyData,
  customToken?: string,
  customGistId?: string
): Promise<{ success: boolean; syncedToGist: boolean; message?: string }> {
  // 1. Always ensure data is reliably saved locally in browser
  cacheLocalData(data);

  const gistId = customGistId || getStoredGistId();
  const token = (customToken !== undefined ? customToken : getStoredToken()).trim();

  if (!token) {
    return {
      success: true,
      syncedToGist: false,
      message: "Data saved in local browser storage. Provide a GitHub Personal Access Token (PAT) to synchronize directly with the remote GitHub Gist.",
    };
  }

  try {
    const payload = {
      description: "Biblical Timeline & Old Testament Genealogy Database",
      files: {
        [GIST_FILE_NAME]: {
          content: JSON.stringify(
            {
              version: data.version || 1,
              creationYearBC: data.creationYearBC || 4000,
              people: data.people,
              events: data.events,
            },
            null,
            2
          ),
        },
      },
    };

    const response = await fetch(`https://api.github.com/gists/${gistId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      let parsedErr = errText;
      try {
        const jsonErr = JSON.parse(errText);
        parsedErr = jsonErr.message || errText;
      } catch {}
      throw new Error(`GitHub Gist PATCH returned ${response.status}: ${parsedErr}`);
    }

    return {
      success: true,
      syncedToGist: true,
      message: "Successfully synchronized with GitHub Gist database!",
    };
  } catch (err: any) {
    console.error("Failed to push to GitHub Gist:", err);
    return {
      success: true, // Local save succeeded
      syncedToGist: false,
      message: `Saved locally, but remote Gist sync failed: ${err.message}`,
    };
  }
}

export function cacheLocalData(data: GenealogyData) {
  try {
    localStorage.setItem("biblical_people", JSON.stringify(data.people));
    localStorage.setItem("biblical_events", JSON.stringify(data.events));
    if (data.version) localStorage.setItem("biblical_version", String(data.version));
    if (data.creationYearBC) localStorage.setItem("biblical_creation_year", String(data.creationYearBC));
    localStorage.setItem("biblical_last_synced", new Date().toISOString());
  } catch (e) {
    console.error("Local storage error:", e);
  }
}

export function getCachedLocalData(): GenealogyData | null {
  try {
    const p = localStorage.getItem("biblical_people");
    const e = localStorage.getItem("biblical_events");
    if (p && e) {
      return {
        version: Number(localStorage.getItem("biblical_version") || 1),
        creationYearBC: Number(localStorage.getItem("biblical_creation_year") || 4000),
        people: JSON.parse(p),
        events: JSON.parse(e),
      };
    }
  } catch (err) {
    console.warn("Failed reading cached data:", err);
  }
  return null;
}
