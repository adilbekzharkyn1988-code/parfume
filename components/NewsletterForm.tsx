"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-md"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <input
        type="email"
        required
        placeholder="Ваш email"
        className="flex-1 rounded-full px-5 py-3.5 bg-ivory text-ink placeholder:text-ink/40 outline-none"
      />
      <button className="eyebrow rounded-full px-6 py-3.5 bg-ink hover:bg-ink-soft transition-colors">
        {submitted ? "Готово ✓" : "Подписаться"}
      </button>
    </form>
  );
}
