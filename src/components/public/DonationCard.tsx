import type { DonationProgram } from "@/types";

export default function DonationCard({ program }: { program: DonationProgram }) {
  return (
    <article className="card flex flex-col">
      <div className="aspect-[16/9] w-full overflow-hidden rounded-xl bg-masjid-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img loading="lazy" src={program.image_url || "/placeholder.svg"} alt={program.title} className="h-full w-full object-cover" />
      </div>
      <div className="mt-4 flex-1">
        <span className="rounded-full bg-gold-400/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold-600">{program.category}</span>
        <h3 className="mt-3 font-display text-xl font-semibold text-masjid-900">{program.title}</h3>
        {program.description && <p className="mt-2 text-sm text-masjid-800/70">{program.description}</p>}
        <div className="mt-4 space-y-1 text-xs text-masjid-800/70">
          {program.bank_name && <p>Bank: {program.bank_name}</p>}
          {program.account_number && <p>No. Rekening: {program.account_number}</p>}
          {program.account_holder && <p>a.n. {program.account_holder}</p>}
          {program.whatsapp && <p>Konfirmasi: WhatsApp {program.whatsapp}</p>}
        </div>
        {program.qris_url && (
          <div className="mt-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img loading="lazy" src={program.qris_url} alt="QRIS" className="h-32 w-32 rounded-lg border border-masjid-800/10" />
          </div>
        )}
      </div>
    </article>
  );
}

