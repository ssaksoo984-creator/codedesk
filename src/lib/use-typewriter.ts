"use client";

import { useEffect, useState } from "react";

interface TypewriterOptions {
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseAfterType?: number;
  pauseAfterDelete?: number;
}

export function useTypewriter(
  phrases: string[],
  {
    typingSpeed = 80,
    deletingSpeed = 45,
    pauseAfterType = 1100,
    pauseAfterDelete = 300,
  }: TypewriterOptions = {}
) {
  const [text, setText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIndex % phrases.length];
    let timeout: number;

    if (!deleting && text === current) {
      timeout = window.setTimeout(() => setDeleting(true), pauseAfterType);
    } else if (deleting && text === "") {
      timeout = window.setTimeout(() => {
        setDeleting(false);
        setPhraseIndex((i) => (i + 1) % phrases.length);
      }, pauseAfterDelete);
    } else {
      const next = deleting
        ? current.slice(0, text.length - 1)
        : current.slice(0, text.length + 1);
      timeout = window.setTimeout(
        () => setText(next),
        deleting ? deletingSpeed : typingSpeed
      );
    }

    return () => window.clearTimeout(timeout);
  }, [
    text,
    deleting,
    phraseIndex,
    phrases,
    typingSpeed,
    deletingSpeed,
    pauseAfterType,
    pauseAfterDelete,
  ]);

  return { text, index: phraseIndex % phrases.length };
}
