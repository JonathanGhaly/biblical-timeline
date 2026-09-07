import React, { useState } from "react";
import {
  Database,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Key,
  RefreshCw,
  Upload,
  Copy,
  Download,
  X,
  ShieldCheck,
} from "lucide-react";
import { CopticCross } from "./CopticCross";
import {
  getStoredToken,
  setStoredToken,
  getStoredGistId,
  setStoredGistId,
  saveToGist,
} from "../../services/gistService";
import type { GenealogyData, Language } from "../../types/genealogy";
import { UI_TRANSLATIONS } from "../../utils/i18n";

interface GistSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: GenealogyData;
  isLive: boolean;
  lastUpdated: string | null;
  onRefreshGist: () => Promise<void>;
  onDataSaved: (data: GenealogyData) => void;
  lang: Language;
}

export const GistSyncModal: React.FC<GistSyncModalProps> = ({
  isOpen,
  onClose,
  data,
  isLive,
  lastUpdated,
  onRefreshGist,
  lang,
}) => {
  const [token, setToken] = useState(getStoredToken());
  const [gistId, setGistId] = useState(getStoredGistId());
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const t = UI_TRANSLATIONS[lang];

  if (!isOpen) return null;

  const handleSaveSettings = () => {
    setStoredToken(token);
    setStoredGistId(gistId);
    setStatusMessage({
      type: "success",
      text:
        lang === "ar"
          ? "تم حفظ الرمز ومعرّف الجيست بنجاح."
          : "GitHub settings saved successfully.",
    });
  };

  const handlePullFromGist = async () => {
    setIsSyncing(true);
    setStatusMessage(null);
    try {
      await onRefreshGist();
      setStatusMessage({
        type: "success",
        text:
          lang === "ar"
            ? "تم جلب أحدث البيانات من الجيست بنجاح!"
            : "Successfully pulled the latest data from GitHub Gist!",
      });
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text:
          lang === "ar"
            ? `فشل الجلب من الجيست: ${err.message}`
            : `Failed to pull from Gist: ${err.message}`,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePushToGist = async () => {
    setIsSyncing(true);
    setStatusMessage(null);
    try {
      const res = await saveToGist(data, token, gistId);
      if (res.syncedToGist) {
        setStatusMessage({
          type: "success",
          text:
            lang === "ar"
              ? "تم نشر وحفظ جميع التعديلات مباشرة على الجيست بنجاح!"
              : "Successfully pushed changes directly to the remote GitHub Gist!",
        });
      } else {
        setStatusMessage({
          type: "info",
          text: res.message || (lang === "ar" ? "تم الحفظ محلياً." : "Saved locally."),
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCopyJson = () => {
    const json = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadJson = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const anchor = document.createElement("a");
    anchor.setAttribute("href", jsonString);
    anchor.setAttribute("download", "bible-data.json");
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-[#FBF8EF] dark:bg-[#1C1A17] text-[#2D2721] dark:text-[#E6E0D4] border-2 border-[#D4AF37] shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        {/* Illuminated Top Header */}
        <div className="relative flex items-center justify-between p-5 border-b border-[#D4AF37]/40 bg-gradient-to-r from-[#800020]/10 via-[#D4AF37]/15 to-[#1A365D]/10">
          <div className="flex items-center gap-3">
            <CopticCross size={32} />
            <div>
              <h3 className="text-xl font-bold font-cinzel dark:text-[#F3E5AB]">
                {t.gistSettingsTitle}
              </h3>
              <p className="text-xs text-[#6B5E4E] dark:text-[#A99F8D]">
                {t.gistSettingsDesc}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6B5E4E] dark:text-[#A99F8D] hover:bg-[#D4AF37]/20 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          {/* Status Banner */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#D4AF37]/30 bg-white/70 dark:bg-[#25221E] shadow-sm">
            <div className="flex items-center gap-3">
              <div
                className={`w-3.5 h-3.5 rounded-full ${
                  isLive ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                }`}
              />
              <div>
                <span className="text-sm font-semibold">
                  {isLive ? t.gistLive : t.gistCached}
                </span>
                {lastUpdated && (
                  <p className="text-xs text-[#7A6E5E] dark:text-[#9F9382]">
                    {t.lastUpdated} {new Date(lastUpdated).toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            <a
              href={`https://gist.github.com/${gistId}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#800020] dark:text-[#F3E5AB] hover:underline"
            >
              <span>{lang === "ar" ? "عرض على GitHub" : "View on GitHub"}</span>
              <ExternalLink size={14} />
            </a>
          </div>

          {/* Feedback message banner */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl text-sm flex items-start gap-2.5 ${
                statusMessage.type === "success"
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300"
                  : statusMessage.type === "error"
                  ? "bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-300"
                  : "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300"
              }`}
            >
              {statusMessage.type === "success" ? (
                <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Gist ID Input */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#800020] dark:text-[#D4AF37]">
              <Database size={14} />
              {t.gistIdLabel}
            </label>
            <input
              type="text"
              value={gistId}
              onChange={(e) => setGistId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>

          {/* GitHub Token Input */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#800020] dark:text-[#D4AF37]">
              <Key size={14} />
              {t.githubTokenLabel}
            </label>
            <input
              type="password"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4AF37]/50 bg-white dark:bg-[#121110] font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
            <p className="text-xs text-[#7A6E5E] dark:text-[#A99F8D] flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
              {t.githubTokenHelp}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handlePullFromGist}
              disabled={isSyncing}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#1A365D] text-[#1A365D] dark:text-[#90CDF4] dark:border-[#2A4D7F] hover:bg-[#1A365D]/10 font-semibold text-sm transition-all disabled:opacity-50"
            >
              <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} />
              {t.refreshFromGist}
            </button>

            <button
              onClick={handlePushToGist}
              disabled={isSyncing}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#800020] to-[#A01128] text-white hover:brightness-110 font-semibold text-sm shadow-md transition-all disabled:opacity-50"
            >
              <Upload size={16} />
              {t.saveToGist}
            </button>
          </div>

          {/* Secondary Utilities: Copy JSON / Download File */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#D4AF37]/30">
            <div className="flex gap-2">
              <button
                onClick={handleCopyJson}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D4AF37]/50 text-xs font-medium hover:bg-[#D4AF37]/15 transition-colors"
              >
                <Copy size={14} />
                {copied ? t.jsonCopied : t.copyJson}
              </button>
              <button
                onClick={handleDownloadJson}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D4AF37]/50 text-xs font-medium hover:bg-[#D4AF37]/15 transition-colors"
              >
                <Download size={14} />
                {t.exportJson}
              </button>
            </div>

            <button
              onClick={handleSaveSettings}
              className="px-4 py-1.5 rounded-lg bg-[#D4AF37] text-[#121110] hover:bg-[#C5A028] font-bold text-xs shadow transition-all"
            >
              {t.saveSettings}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
