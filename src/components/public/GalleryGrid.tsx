"use client";

import { useState } from "react";
import type { GalleryItem } from "@/types";
import { X } from "@/utils/icons";

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState<GalleryItem | null>(null);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActive(item)}
            className="group relative overflow-hidden rounded-2xl border border-masjid-800/10 bg-masjid-50 text-left"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img loading="lazy" src={item.image_url} alt={item.title} className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-masjid-700">{item.category}</p>
              <p className="mt-1 font-display text-lg font-semibold text-masjid-900">{item.title}</p>
              {item.taken_at && (
                <p className="mt-1 text-xs text-masjid-800/60">{new Date(item.taken_at).toLocaleDateString("id-ID")}</p>
              )}
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4" onClick={() => setActive(null)}>
          <div className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl bg-white" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setActive(null)} aria-label="Tutup" className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white">
              <X className="h-4 w-4" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img loading="lazy" src={active.image_url} alt={active.title} className="max-h-[70vh] w-full object-contain" />
            <div className="p-4">
              <p className="font-display text-xl font-semibold text-masjid-900">{active.title}</p>
              {active.description && <p className="mt-1 text-sm text-masjid-800/70">{active.description}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

