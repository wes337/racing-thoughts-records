"use client";

import { useEffect, useState } from "react";

export default function LegalModal({ handle, onClose }) {
  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!handle) {
      return;
    }

    setContent(null);
    setError(null);

    fetch(`/api/legal-content?handle=${handle}`)
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error);
        }

        setContent(data);
      })
      .catch((err) => setError(err.message));
  }, [handle]);

  useEffect(() => {
    if (!handle) {
      return;
    }

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [handle, onClose]);

  if (!handle) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-lg bg-white p-6 text-black"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute right-4 top-4 text-xl opacity-60 hover:opacity-100 cursor-pointer"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {error && <p className="text-sm">{error}</p>}
        {!error && !content && (
          <p className="text-center text-sm opacity-75">Loading...</p>
        )}
        {!error && content && (
          <>
            <h1 className="text-2xl text-center font-bold uppercase opacity-75 mb-4">
              {content.title}
            </h1>
            <div
              className="policy text-sm tracking-tight"
              dangerouslySetInnerHTML={{ __html: content.body }}
            />
          </>
        )}
      </div>
    </div>
  );
}
