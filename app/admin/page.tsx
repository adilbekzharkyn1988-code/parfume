"use client";

import { useState } from "react";
import { fetchLeads, leadsEndpointConfigured, LeadRecord } from "@/lib/leads";
import { RefreshCw, LogOut, Phone, MessageSquare } from "lucide-react";

export default function AdminPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async (l: string, p: string) => {
    setLoading(true);
    setError("");
    const res = await fetchLeads(l, p);
    setLoading(false);
    if (res.ok) {
      setLeads(res.leads || []);
      setAuthed(true);
    } else {
      setError(res.error || "Ошибка");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    load(login, password);
  };

  if (!leadsEndpointConfigured()) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <p className="font-display text-2xl mb-3">Приём заявок ещё не настроен</p>
          <p className="text-sm text-stone leading-relaxed">
            Задайте переменную окружения <code className="bg-ivory-dim px-1.5 py-0.5 rounded">NEXT_PUBLIC_LEADS_ENDPOINT</code>{" "}
            — см. инструкцию в <code className="bg-ivory-dim px-1.5 py-0.5 rounded">docs/google-apps-script.js</code>.
          </p>
        </div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <form onSubmit={handleLogin} className="w-full max-w-sm flex flex-col gap-4">
          <p className="font-display text-2xl text-center mb-2">Вход в админ-панель</p>
          <input
            required
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Логин"
            className="w-full rounded-full px-5 py-3 bg-ivory-dim outline-none border border-ink/15 focus:border-wine transition-colors"
          />
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            className="w-full rounded-full px-5 py-3 bg-ivory-dim outline-none border border-ink/15 focus:border-wine transition-colors"
          />
          {error && <p className="text-sm text-wine text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="eyebrow w-full rounded-full py-3.5 bg-wine text-ivory hover:bg-wine-dark transition-colors disabled:opacity-60"
          >
            {loading ? "Проверяем…" : "Войти"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-10 py-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="eyebrow text-wine mb-2">Админ-панель</p>
          <h1 className="font-display text-3xl">Заявки ({leads.length})</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => load(login, password)}
            disabled={loading}
            className="flex items-center gap-2 text-sm border border-ink/15 rounded-full px-4 py-2 hover:bg-ivory-dim transition-colors"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Обновить
          </button>
          <button
            onClick={() => {
              setAuthed(false);
              setPassword("");
            }}
            className="flex items-center gap-2 text-sm border border-ink/15 rounded-full px-4 py-2 hover:bg-ivory-dim transition-colors"
          >
            <LogOut size={14} />
            Выйти
          </button>
        </div>
      </div>

      {leads.length === 0 ? (
        <p className="text-stone text-center py-20">Заявок пока нет</p>
      ) : (
        <div className="flex flex-col gap-4">
          {leads.map((lead) => (
            <div key={lead.id} className="border border-ink/15 rounded-md p-5">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <p className="font-bold">{lead.name}</p>
                  <a
                    href={`tel:${lead.phone}`}
                    className="flex items-center gap-1.5 text-sm text-wine mt-1 hover:opacity-70"
                  >
                    <Phone size={13} /> {lead.phone}
                  </a>
                </div>
                <p className="text-xs text-stone">
                  {new Date(lead.createdAt).toLocaleString("ru-RU")}
                </p>
              </div>

              <p className="text-sm text-ink/80 mt-3 leading-relaxed">{lead.items}</p>

              {lead.comment && (
                <p className="flex items-start gap-1.5 text-sm text-ink/60 mt-2">
                  <MessageSquare size={13} className="mt-0.5 shrink-0" /> {lead.comment}
                </p>
              )}

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-ink/10">
                <span className="font-mono text-lg">{lead.total?.toLocaleString("ru-RU")} ₸</span>
                <span className="text-xs eyebrow text-stone">{lead.status || "new"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
