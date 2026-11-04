'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { PRICING_REGIONS, type PricingCurrencyCode } from '@/lib/pricing-regions';

export function MobileCurrencySelector({ code, onSelect }: {
  code: PricingCurrencyCode;
  onSelect: (code: PricingCurrencyCode) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const [open, setOpen] = useState(false);
  const selected = PRICING_REGIONS.find(region => region.code === code)!;

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  const close = () => dialog.current?.close();
  const choose = (value: PricingCurrencyCode) => {
    onSelect(value);
    close();
  };

  return <>
    <div className="flex w-full flex-col gap-2 sm:hidden">
      <span className="font-medium text-[#095F46]">Country / currency</span>
      <button
        type="button"
        aria-label="Country and pricing currency"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => { dialog.current?.showModal(); setOpen(true); }}
        className="flex min-h-14 w-full items-center gap-3 rounded-xl border border-[#71877a] bg-white px-4 py-3 text-left text-base text-[#202823] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#095F46]"
      >
        <span className="min-w-0 flex-1 font-semibold">{selected.region}</span>
        <span className="shrink-0 rounded-md bg-[#e8efea] px-2 py-1 text-sm font-semibold text-[#095F46]">{code}</span>
        <ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 text-[#095F46]" />
      </button>
    </div>
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onClose={() => setOpen(false)}
      onClick={event => { if (event.target === event.currentTarget) close(); }}
      className="fixed inset-x-0 bottom-0 top-auto m-0 max-h-[85dvh] w-full max-w-none overflow-y-auto rounded-t-3xl border-0 bg-white p-0 text-[#202823] shadow-xl backdrop:bg-[#0b3027]/45 sm:inset-0 sm:m-auto sm:max-w-md sm:rounded-2xl"
    >
      <div className="px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id={titleId} className="text-xl font-bold">Choose your pricing region</h2>
            <p id={descriptionId} className="mt-1 text-sm leading-relaxed text-[#56635c]">Choose the currency used for course prices.</p>
          </div>
          <button type="button" onClick={close} aria-label="Close currency options" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[#095F46] hover:bg-[#e8efea] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#095F46]">
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
        <div role="group" aria-label="Pricing currencies" className="mt-5 flex flex-col gap-2">
          {PRICING_REGIONS.map(region => <button
            key={region.code}
            type="button"
            aria-pressed={code === region.code}
            onClick={() => choose(region.code)}
            className={`flex min-h-14 w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#095F46] ${code === region.code ? 'border-[#095F46] bg-[#eef5f0]' : 'border-transparent hover:bg-stone-50'}`}
          >
            <span className="min-w-0 flex-1 font-medium">{region.region}</span>
            <span className="text-sm font-semibold text-[#56635c]">{region.code}</span>
            <span className="flex h-5 w-5 shrink-0 items-center justify-center text-[#095F46]">{code === region.code && <Check aria-hidden="true" className="h-5 w-5" />}</span>
          </button>)}
        </div>
      </div>
    </dialog>
  </>;
}
