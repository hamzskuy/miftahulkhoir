import type { Schedule } from "@/types";

export default function ScheduleSection({ items }: { items: Schedule[] }) {
  const now = Date.now();
  const upcoming = items.filter((s) => new Date(s.start_at).getTime() >= now - 86400000);
  const past = items.filter((s) => new Date(s.start_at).getTime() < now - 86400000);

  return (
    <section id="jadwal" className="py-16 md:py-24">
      <div className="container-narrow">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-masjid-700">Jadwal Kegiatan</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-masjid-900">Agenda Masjid</h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {upcoming.length === 0 && <p className="text-sm text-masjid-800/60">Belum ada jadwal mendatang.</p>}
          {upcoming.map((s) => (
            <div key={s.id} className="card">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-xl font-semibold text-masjid-900">{s.title}</h3>
                <span className="rounded-full bg-masjid-100 px-2.5 py-1 text-[10px] font-semibold uppercase text-masjid-800">Mendatang</span>
              </div>
              <p className="mt-2 text-sm text-masjid-800/70">{s.description}</p>
              <div className="mt-3 space-y-1 text-xs text-masjid-800/60">
                <p>📅 {new Date(s.start_at).toLocaleString("id-ID")}</p>
                {s.end_at && <p>Selesai: {new Date(s.end_at).toLocaleString("id-ID")}</p>}
                {s.location && <p>📍 {s.location}</p>}
              </div>
            </div>
          ))}
        </div>

        {past.length > 0 && (
          <div className="mt-10">
            <h3 className="font-display text-xl font-semibold text-masjid-800/70">Kegiatan Sebelumnya</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {past.map((s) => (
                <div key={s.id} className="rounded-2xl border border-masjid-800/10 bg-masjid-50 p-4 opacity-70">
                  <p className="font-medium text-masjid-900">{s.title}</p>
                  <p className="mt-1 text-xs text-masjid-800/60">{new Date(s.start_at).toLocaleString("id-ID")}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
