import type { GenealogyData } from "../types/genealogy";

type DashboardProps = {
  data: GenealogyData;
};

function Dashboard({ data }: DashboardProps) {
  const peopleCount = data.people.length;
  const eventsCount = data.events.length;

  return (
    <div>
      <h2>Dashboard</h2>

      <p>
        Explore the people, families, generations, and events
        recorded in the application.
      </p>

      <div className="dashboard-grid">
        <div className="stat-card">
          <span className="stat-label">People</span>
          <strong>{peopleCount}</strong>
        </div>

        <div className="stat-card">
          <span className="stat-label">Events</span>
          <strong>{eventsCount}</strong>
        </div>

        <div className="stat-card">
          <span className="stat-label">Generations</span>
          <strong>—</strong>
        </div>
      </div>

      <section className="dashboard-section">
        <h3>Recent Events</h3>

        <div className="event-list">
          {data.events.slice(0, 5).map((event) => (
            <div key={event.id} className="event-card">
              <strong>{event.title}</strong>

              {event.date?.year && (
                <span>
                  {Math.abs(event.date.year)}{" "}
                  {event.date.year < 0 ? "BC" : "AD"}
                </span>
              )}

              {event.description && (
                <p>{event.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;