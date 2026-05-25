import { useState } from "react";
import type { Topic } from "./types";
import MainMenu from "./components/MainMenu";
import TopicMenu from "./components/TopicMenu";
import NotesPage from "./components/NotesPage";

type View = "menu" | "notes";

export default function App() {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [view, setView] = useState<View>("menu");

  return (
    <div className="mx-auto max-w-6xl px-3 sm:px-5 py-4 sm:py-6">
      {topic ? (
        // Force remount on topic change → wipes any session state inside
        <TopicMenu key={topic.id} topic={topic} onBack={() => setTopic(null)} />
      ) : view === "notes" ? (
        <NotesPage onBack={() => setView("menu")} />
      ) : (
        <MainMenu onPick={setTopic} onOpenNotes={() => setView("notes")} />
      )}
    </div>
  );
}
