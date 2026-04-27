import { useState } from "react";
import { Modal } from "./Modal";
import { encodeSave } from "../lib/save";
import type { Profile } from "../lib/types";

export function SaveLoadModal({
  profile,
  onClose,
}: {
  profile: Profile;
  onClose: () => void;
}) {
  const code = encodeSave(profile);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  return (
    <Modal onClose={onClose}>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-white">Save code</h2>
        <button
          onClick={onClose}
          className="text-xs text-zinc-400 active:text-zinc-200"
        >
          Close
        </button>
      </div>
      <p className="mb-2 text-[11px] text-zinc-500">
        Copy this somewhere safe. Use it from the login screen to restore your
        progress on any device. You'll need your password too.
      </p>
      <textarea
        readOnly
        value={code}
        rows={5}
        onFocus={(e) => e.currentTarget.select()}
        className="w-full resize-none rounded-md border border-zinc-700 bg-zinc-900 p-2 font-mono text-[11px] text-zinc-100"
      />
      <button
        onClick={copy}
        className="mt-2 w-full rounded-lg bg-gradient-to-b from-amber-400 to-orange-500 px-4 py-2 text-sm font-extrabold text-zinc-950 active:scale-[0.99]"
      >
        {copied ? "Copied!" : "Copy save code"}
      </button>
    </Modal>
  );
}
