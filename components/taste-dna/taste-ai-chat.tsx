"use client";

import { FormEvent, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
  source?: "azure-ai" | "local";
};

const suggestions = [
  "What pattern do you see in my taste?",
  "What should my next pick feel like?",
  "How could you surprise me without missing?",
  "What should recommendations avoid?",
];

export function TasteAiChat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<"idle" | "asking" | "error">("idle");

  async function ask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuestion = question.trim();

    if (trimmedQuestion.length < 3 || status === "asking") {
      return;
    }

    setMessages((current) => [
      ...current,
      { role: "user", content: trimmedQuestion },
    ]);
    setQuestion("");
    setStatus("asking");

    const response = await fetch("/api/explain-taste", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: trimmedQuestion }),
    });
    const body = (await response.json()) as {
      answer?: string;
      source?: "azure-ai" | "local";
      error?: string;
    };

    if (!response.ok || !body.answer) {
      setStatus("error");
      return;
    }

    setMessages((current) => [
      ...current,
      {
        role: "assistant",
        content: body.answer ?? "",
        source: body.source,
      },
    ]);
    setStatus("idle");
  }

  return (
    <div className="rounded-lg border border-[#ded6c7] bg-white/80">
      <div className="border-b border-[#ded6c7] p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#3c6e71]">
          Ask Taste AI
        </p>
        <h2 className="mt-2 text-2xl font-semibold">
          Question the pattern, not just the picks.
        </h2>
      </div>

      <div
        aria-live="polite"
        className="min-h-64 space-y-4 p-5"
      >
        {messages.length === 0 ? (
          <div>
            <p className="text-sm text-[#657074]">
              Start with one of these, or ask your own taste question.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setQuestion(suggestion)}
                  className="rounded-lg border border-[#cfc7b9] bg-[#f7f3ec] px-3 py-2 text-left text-sm font-semibold text-[#344347] transition hover:border-[#3c6e71]"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={
                message.role === "user"
                  ? "ml-auto max-w-[85%] rounded-lg bg-[#1f2428] px-4 py-3 text-sm text-white"
                  : "max-w-[92%] border-l-2 border-[#3c6e71] pl-4 text-sm leading-6 text-[#344347]"
              }
            >
              <p>{message.content}</p>
              {message.role === "assistant" && message.source ? (
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#788486]">
                  {message.source === "azure-ai"
                    ? "Azure AI grounded in your Taste DNA"
                    : "Moodmatch profile analysis"}
                </p>
              ) : null}
            </div>
          ))
        )}
        {status === "asking" ? (
          <p className="text-sm font-semibold text-[#3c6e71]">
            Reading your signals...
          </p>
        ) : null}
        {status === "error" ? (
          <p className="rounded-lg bg-[#f8dfd7] px-3 py-2 text-sm text-[#7a2e1f]">
            Taste AI could not answer that right now. Try again.
          </p>
        ) : null}
      </div>

      <form onSubmit={ask} className="border-t border-[#ded6c7] p-5">
        <label htmlFor="taste-question" className="sr-only">
          Ask Taste AI
        </label>
        <textarea
          id="taste-question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          maxLength={500}
          rows={3}
          placeholder="Why do quiet, character-driven stories work for me?"
          className="w-full resize-none rounded-lg border border-[#cfc7b9] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#8a9394] focus:border-[#3c6e71]"
        />
        <div className="mt-3 flex items-center justify-between gap-4">
          <span className="text-xs text-[#788486]">{question.length}/500</span>
          <button
            type="submit"
            disabled={question.trim().length < 3 || status === "asking"}
            className="h-10 rounded-lg bg-[#1f2428] px-4 text-sm font-semibold text-white transition hover:bg-[#343b40] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Ask Taste AI
          </button>
        </div>
      </form>
    </div>
  );
}
