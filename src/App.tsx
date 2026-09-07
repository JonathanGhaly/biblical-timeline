import { useState, useEffect, useCallback } from "react";
import "./App.css";

import fallbackData from "./data/bible-data.json";
import Dashboard from "./pages/Dashboard";
import People from "./pages/People";
import FamilyTree from "./pages/FamilyTree";
import TimelinePage from "./pages/TimelinePage";
import Timeline from "./pages/Timeline";
import Events from "./pages/Events";
import OldTestamentMapPage from "./pages/OldTestamentMapPage";

import { CopticHeader } from "./components/Coptic/CopticHeader";
import { CopticSidebar, type Page } from "./components/Coptic/CopticSidebar";
import { GistSyncModal } from "./components/Coptic/GistSyncModal";
import {
  fetchFromGist,
  saveToGist,
  cacheLocalData,
  getCachedLocalData,
} from "./services/gistService";
import type {
  GenealogyData,
  Person,
  BiblicalEvent,
  Language,
  ThemeMode,
} from "./types/genealogy";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [isGistModalOpen, setIsGistModalOpen] = useState(false);
  const [isGistLive, setIsGistLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Language state (English / Arabic)
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem("biblical_lang") as Language) || "en";
  });

  // Theme mode (Light Parchment / Dark Crypt)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem("biblical_theme") as ThemeMode) || "light";
  });

  // Central data state
  const [data, setData] = useState<GenealogyData>(() => {
    const cached = getCachedLocalData();
    return cached || (fallbackData as GenealogyData);
  });

  const people = data.people;
  const events = data.events;

  // Synchronize language and document direction
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("biblical_lang", lang);
  }, [lang]);

  // Synchronize theme class on document element
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("biblical_theme", theme);
  }, [theme]);

  // Initial fetch from remote GitHub Gist
  const loadGistData = useCallback(async () => {
    try {
      const res = await fetchFromGist();
      setData(res.data);
      setIsGistLive(res.isLive);
      setLastUpdated(res.updatedAt);
    } catch (e) {
      console.warn("Could not load from Gist, using cached:", e);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetchFromGist()
      .then((res) => {
        if (isMounted) {
          setData(res.data);
          setIsGistLive(res.isLive);
          setLastUpdated(res.updatedAt);
        }
      })
      .catch((e) => console.warn("Could not load from Gist on mount:", e));

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleLang = () => {
    setLang((prev) => (prev === "en" ? "ar" : "en"));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // State Mutators with Local Cache and Gist Push
  const updateEntireData = useCallback(
    async (newData: GenealogyData) => {
      setData(newData);
      cacheLocalData(newData);

      // Attempt background push if token is available
      saveToGist(newData)
        .then((res) => {
          if (res.syncedToGist) {
            setIsGistLive(true);
            setLastUpdated(new Date().toISOString());
          }
        })
        .catch((e) => console.warn("Background Gist sync notification:", e));
    },
    []
  );

  const handleAddPerson = (newPerson: Person) => {
    const updatedPeople = [...people, newPerson];
    updateEntireData({ ...data, people: updatedPeople });
  };

  const handleUpdatePerson = (updatedPerson: Person) => {
    const updatedPeople = people.map((p) =>
      p.id === updatedPerson.id ? updatedPerson : p
    );
    updateEntireData({ ...data, people: updatedPeople });
  };

  const handleDeletePerson = (personId: string) => {
    const updatedPeople = people.filter((p) => p.id !== personId);
    updateEntireData({ ...data, people: updatedPeople });
  };

  const handleAddEvent = (newEvent: BiblicalEvent) => {
    const updatedEvents = [...events, newEvent];
    updateEntireData({ ...data, events: updatedEvents });
  };

  const handleUpdateEvent = (updatedEvent: BiblicalEvent) => {
    const updatedEvents = events.map((e) =>
      e.id === updatedEvent.id ? updatedEvent : e
    );
    updateEntireData({ ...data, events: updatedEvents });
  };

  const handleDeleteEvent = (eventId: string) => {
    const updatedEvents = events.filter((e) => e.id !== eventId);
    updateEntireData({ ...data, events: updatedEvents });
  };

  const handleExportData = () => {
    const exportObject = {
      version: data.version || 1,
      creationYearBC: data.creationYearBC || 4000,
      people,
      events,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(exportObject, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", "bible-data.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleResetData = () => {
    const confirmMsg =
      lang === "ar"
        ? "هل أنت متأكد من إعادة ضبط البيانات إلى القيم الأصلية؟ سيتم مسح أي تعديلات محلية غير محفوظة."
        : "Reset to initial bundled biblical data? Any unsaved local changes will be cleared.";

    if (window.confirm(confirmMsg)) {
      const resetState = fallbackData as GenealogyData;
      updateEntireData(resetState);
    }
  };

  function renderPage() {
    switch (currentPage) {
      case "people":
        return (
          <People
            people={people}
            onAddPerson={handleAddPerson}
            onUpdatePerson={handleUpdatePerson}
            onDeletePerson={handleDeletePerson}
            lang={lang}
          />
        );

      case "family-tree":
        return <FamilyTree people={people} lang={lang} />;

      case "family-timeline":
        return <TimelinePage people={people} events={events} lang={lang} />;

      case "timeline":
        return (
          <Timeline
            people={people}
            events={events}
            onUpdateEvent={handleUpdateEvent}
            lang={lang}
          />
        );

      case "events":
        return (
          <Events
            events={events}
            people={people}
            onAddEvent={handleAddEvent}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
            lang={lang}
          />
        );

      case "map":
        return (
          <OldTestamentMapPage
            events={events}
            people={people}
            lang={lang}
          />
        );

      case "dashboard":
      default:
        return (
          <Dashboard
            data={data}
            lang={lang}
            onNavigate={(p) => setCurrentPage(p as Page)}
            onOpenGistModal={() => setIsGistModalOpen(true)}
            isGistLive={isGistLive}
          />
        );
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-[#FBF8EF] dark:bg-[#121110] text-[#2D2721] dark:text-[#E6E0D4] font-body transition-colors duration-200"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* Coptic Heritage Header */}
      <CopticHeader
        lang={lang}
        onToggleLang={toggleLang}
        theme={theme}
        onToggleTheme={toggleTheme}
        isGistLive={isGistLive}
        onOpenGistModal={() => setIsGistModalOpen(true)}
        onExportJson={handleExportData}
        onResetData={handleResetData}
      />

      {/* Main Container with Sidebar & Content */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <CopticSidebar
          currentPage={currentPage}
          onSelectPage={setCurrentPage}
          lang={lang}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {renderPage()}
        </main>
      </div>

      {/* Attribution & Coptic Footer Motif */}
      <footer className="w-full border-t border-[#D4AF37]/30 py-4 px-6 text-center text-xs text-[#7A6E5E] dark:text-[#887C6C] flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="font-cinzel font-bold text-[#800020] dark:text-[#D4AF37]">
            ✝ Coptic Heritage Biblical Chronology
          </span>
        </div>
        <div className="font-mono text-[11px] tracking-wide text-[#8C6F12] dark:text-[#A99F8D]">
          Created by Jonathan Ghaly
        </div>
      </footer>

      {/* Gist Sync & Database Settings Modal */}
      <GistSyncModal
        isOpen={isGistModalOpen}
        onClose={() => setIsGistModalOpen(false)}
        data={data}
        isLive={isGistLive}
        lastUpdated={lastUpdated}
        onRefreshGist={loadGistData}
        onDataSaved={updateEntireData}
        lang={lang}
      />
    </div>
  );
}
