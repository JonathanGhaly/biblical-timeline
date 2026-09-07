import { useState } from "react";
import "./App.css";

import bibleData from "./data/bible-data.json";

import Dashboard from "./pages/Dashboard";
import People from "./pages/People";
import FamilyTree from "./pages/FamilyTree";
import TimelinePage from "./pages/TimelinePage";
import Timeline from "./pages/Timeline";
import Events from "./pages/Events";
import type { GenealogyData, Person, BiblicalEvent } from "./types/genealogy";

type Page =
  | "dashboard"
  | "people"
  | "family-tree"
  | "family-timeline"
  | "timeline"
  | "events";

const data = bibleData as GenealogyData;

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");

  // Load initial data from localStorage if available, otherwise fall back to bible-data.json
  const [people, setPeople] = useState<Person[]>(() => {
    const savedPeople = localStorage.getItem("biblical_people");
    return savedPeople ? JSON.parse(savedPeople) : data.people;
  });

  const [events, setEvents] = useState<BiblicalEvent[]>(() => {
    const savedEvents = localStorage.getItem("biblical_events");
    return savedEvents ? JSON.parse(savedEvents) : data.events;
  });

  // Save updates to browser LocalStorage
  const savePeople = (newPeople: Person[]) => {
    setPeople(newPeople);
    localStorage.setItem("biblical_people", JSON.stringify(newPeople));
  };

  const saveEvents = (newEvents: BiblicalEvent[]) => {
    setEvents(newEvents);
    localStorage.setItem("biblical_events", JSON.stringify(newEvents));
  };

  const handleAddPerson = (newPerson: Person) => {
    savePeople([...people, newPerson]);
  };

  const handleUpdatePerson = (updatedPerson: Person) => {
    const updated = people.map((p) =>
      p.id === updatedPerson.id ? updatedPerson : p
    );
    savePeople(updated);
  };

  const handleAddEvent = (newEvent: BiblicalEvent) => {
    saveEvents([...events, newEvent]);
  };

  // Download updated JSON file to replace src/data/bible-data.json in git
  const handleExportData = () => {
    const exportObject = { people, events };
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

  // Optional: Reset back to JSON defaults
  const handleResetData = () => {
    if (
      window.confirm(
        "Reset to default data? Any unsaved local edits will be cleared."
      )
    ) {
      localStorage.removeItem("biblical_people");
      localStorage.removeItem("biblical_events");
      setPeople(data.people);
      setEvents(data.events);
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
          />
        );

      case "family-tree":
        return <FamilyTree people={people} />;

      case "family-timeline":
        return <TimelinePage people={people} events={events} />;

      case "timeline":
        return <Timeline people={people} events={events} />;

      case "events":
        return (
          <Events
            events={events}
            people={people}
            onAddEvent={handleAddEvent}
          />
        );

      case "dashboard":
      default:
        return <Dashboard data={{ ...data, people, events }} />;
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <h1>Biblical Timeline</h1>
          <span>Old Testament Family Tree</span>
        </div>

        <div className="topbar-actions" style={{ display: "flex", gap: "8px" }}>
          <button
            className="btn-secondary"
            onClick={handleExportData}
            title="Download JSON to update repository source code"
          >
            💾 Export JSON
          </button>
          <button
            className="btn-secondary"
            onClick={handleResetData}
            title="Reset to initial bible-data.json values"
          >
            🔄 Reset
          </button>
        </div>
      </header>

      <div className="app-body">
        <aside className="sidebar">
          <nav>
            <button
              className={`nav-item ${
                currentPage === "dashboard" ? "active" : ""
              }`}
              onClick={() => setCurrentPage("dashboard")}
            >
              Dashboard
            </button>

            <button
              className={`nav-item ${
                currentPage === "people" ? "active" : ""
              }`}
              onClick={() => setCurrentPage("people")}
            >
              People
            </button>

            <button
              className={`nav-item ${
                currentPage === "family-tree" ? "active" : ""
              }`}
              onClick={() => setCurrentPage("family-tree")}
            >
              Family Tree
            </button>

            <button
              className={`nav-item ${
                currentPage === "family-timeline" ? "active" : ""
              }`}
              onClick={() => setCurrentPage("family-timeline")}
            >
              Lifespans & Events
            </button>

            <button
              className={`nav-item ${
                currentPage === "timeline" ? "active" : ""
              }`}
              onClick={() => setCurrentPage("timeline")}
            >
              Timeline
            </button>

            <button
              className={`nav-item ${
                currentPage === "events" ? "active" : ""
              }`}
              onClick={() => setCurrentPage("events")}
            >
              Events
            </button>
          </nav>
        </aside>

        <main className="main-content">{renderPage()}</main>
      </div>
    </div>
  );
}

export default App;