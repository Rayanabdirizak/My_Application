import { useState } from "react";

function NotesPanel() {
  const [note, setNote] = useState("");

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-bold mb-2">Notes</h2>

      <textarea
        className="border p-2 w-full"
        rows="5"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">
        Save Note
      </button>
    </div>
  );
}

export default NotesPanel;