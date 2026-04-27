import { useState } from "react";
import { Modal } from "./Modal";

export function WipeModal({
  username,
  onCancel,
  onConfirm,
}: {
  username: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const [text, setText] = useState("");
  const matches = text.trim().toLowerCase() === username.toLowerCase();

  return (
    <Modal onClose={onCancel} size="sm">
      <h2 className="text-lg font-extrabold text-rose-300">Wipe data</h2>
      <p className="mt-1 text-xs text-zinc-400">
        This permanently deletes <b>{username}</b>'s coins, gems, level,
        rolls, pets, achievements, and upgrades. This cannot be undone.
      </p>
      <p className="mt-2 text-xs text-zinc-400">
        Type your username to confirm:
      </p>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={username}
        className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-rose-500"
      />
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={onCancel}
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-bold text-zinc-200 active:bg-zinc-800"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={!matches}
          className={
            "rounded-lg px-3 py-2 text-sm font-extrabold " +
            (matches
              ? "bg-rose-600 text-white active:bg-rose-700"
              : "bg-zinc-800 text-zinc-500")
          }
        >
          Wipe
        </button>
      </div>
    </Modal>
  );
}
