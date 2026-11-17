import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import DonationCard from "@/components/public/DonationCard";
import { getDonations } from "@/lib/data";

export const revalidate = 60;

export default async function DonasiPage() {
  const programs = await getDonations(true);
  return (
    <>
      <Navbar />
      <main className="py-24">
        <div className="container-narrow">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-masjid-700">Donasi</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-masjid-900 md:text-5xl">Program Donasi & Amal</h1>
          <p className="mt-3 max-w-2xl text-masjid-800/70">
            Salurkan infaq, sedekah, dan wakaf Anda untuk mendukung kegiatan Masjid Miftahul Khoir. Informasi rekening dan QRIS dikelola oleh admin masjid.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {programs.length === 0 && <p className="text-sm text-masjid-800/60">Belum ada program donasi.</p>}
            {programs.map((p) => <DonationCard key={p.id} program={p} />)}
          </div>
          <div className="mt-10 rounded-2xl border border-masjid-800/10 bg-masjid-50 p-6">
            <h3 className="font-display text-xl font-semibold text-masjid-900">Konfirmasi Donasi</h3>
            <p className="mt-2 text-sm text-masjid-800/70">
              Setelah melakukan transfer, silakan konfirmasi melalui nomor WhatsApp yang tercantum pada program donasi. Informasi pembayaran resmi hanya dikelola oleh admin masjid melalui CMS.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
