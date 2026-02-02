"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import {
  Truck,
  Hash,
  ClipboardList,
  Scale,
  Calculator,
  Save,
  LogOut,
  ArrowRight,
  LayoutPanelTop,
  Table2,
  ListOrdered,
  X,
  Database,
  Server,
  Banknote,
  Building2,
  CreditCard,
} from "lucide-react";

const FLOW_STEPS = [
  { step: 1, title: "Truck arrives", desc: "Vehicle comes to the scale", Icon: Truck },
  { step: 2, title: "Gets a number", desc: "Sr No (e.g. 9113) is assigned", Icon: Hash },
  { step: 3, title: "First weight + data", desc: "Weight & party, product, vehicle filled", Icon: ClipboardList },
  { step: 4, title: "Second weight", desc: "After load/unload (optional)", Icon: Scale },
  { step: 5, title: "Net weight", desc: "First − Second = Net", Icon: Calculator },
  { step: 6, title: "Save / Print", desc: "Record is saved", Icon: Save },
  { step: 7, title: "Truck leaves", desc: "Vehicle exits after record saved", Icon: LogOut },
  { step: 8, title: "ERP server", desc: "Data is stored (Odoo / server)", Icon: Server },
];

/** For each step: details in this section + what should be filled + which image shows it */
const STEP_DETAILS: Record<
  number,
  { details: string[]; whatToFill: string; imageLabel: string }
> = {
  1: {
    details: ["Vehicle at scale", "Ready for weighing"],
    whatToFill: "No form fields yet – truck is just at the scale.",
    imageLabel: "Brochure – Weighing System overview (0.jpg)",
  },
  2: {
    details: ["Sr No"],
    whatToFill: "Sr No – Serial number for this weighing (e.g. 9113). Assigned at top of form.",
    imageLabel: "Data entry – where truck number & data are filled (1.jpg)",
  },
  3: {
    details: ["Vehicle No", "Delivery Note No", "Party Code / Name", "Product Code / Name", "Trans. Code / Name", "First Weight", "First Date / Time", "Comments"],
    whatToFill: "Vehicle No, Party (F5 for lookup), Product, Transporter, First Weight, First Date/Time. Optional: Delivery Note No, Comments.",
    imageLabel: "Data entry (1.jpg), Party lookup F5 (3.jpg)",
  },
  4: {
    details: ["2nd Weight", "2nd Date / Time"],
    whatToFill: "2nd Weight and 2nd Date/Time – after load/unload. Left/right panel.",
    imageLabel: "When the truck leaves the factory (2nd weight 4430, 1st 4820)",
  },
  5: {
    details: ["Net Weight", "Quantity / Rate / Amount"],
    whatToFill: "Net Weight (First − Second). Optionally Quantity, Rate per ton, Amount.",
    imageLabel: "Record saved – full details stored (2.jpg)",
  },
  6: {
    details: ["Record is saved", "Print"],
    whatToFill: "Save the record. Print if needed. Status shows 'Record is saved'.",
    imageLabel: "Record saved (2.jpg), When truck leaves (final screen)",
  },
  7: {
    details: ["Flow: out ← 2 then 1", "Vehicle exits"],
    whatToFill: "No extra fields. Truck leaves after 2nd weight then 1st weight recorded. See flow note: out ← 2 1.",
    imageLabel: "When the truck leaves the factory",
  },
  8: {
    details: ["Odoo database", "Physical server / Cloud", "Tally, reports", "Payment mode"],
    whatToFill: "Saved weighing data is sent to ERP server: Odoo and/or your server/cloud for Tally accounting, reports (trucks, material, weight), and payment (cash, bank, POS).",
    imageLabel: "Where stored data goes (Odoo + Server/Cloud section)",
  },
};

const DATA_FIELDS = [
  { field: "Sr No", where: "Top of form", meaning: "Serial number for this weighing (e.g. 9113)" },
  { field: "Vehicle No", where: "Top of form", meaning: "Truck/vehicle plate or ID (e.g. 6275, XYZ)" },
  { field: "Delivery Note No", where: "Party section", meaning: "Optional delivery reference" },
  { field: "Party Code / Name", where: "Press F5 For New Party", meaning: "Customer/supplier (e.g. 266 – AL JAMEEL INTERNATIONAL)" },
  { field: "Product Code / Name", where: "Party section", meaning: "Material type (e.g. 17 – OCC)" },
  { field: "Trans. Code / Name", where: "Party section", meaning: "Transporter (e.g. 9 – FAVAS MON PARAKKAL)" },
  { field: "First Weight", where: "Left panel – Weight Info", meaning: "Weight when truck first arrives (e.g. 4820 kg)" },
  { field: "2nd Weight", where: "Left panel – Weight Info", meaning: "Weight after load/unload (0 if not yet weighed)" },
  { field: "Net Weight", where: "Left panel – Weight Info", meaning: "First Weight − 2nd Weight = net load" },
  { field: "First Date / Time", where: "Right panel", meaning: "When first weight was taken" },
  { field: "2nd Date / Time", where: "Right panel", meaning: "When second weight was taken" },
  { field: "Quantity / Rate / Amount", where: "Right panel", meaning: "Qty, rate per ton, total amount" },
  { field: "Comments", where: "Left panel", meaning: "Notes (e.g. Without Driver.)" },
];

/** Where saved weighing data goes: Odoo vs physical/cloud server (Tally, reports, payment) */
const DATA_DESTINATIONS = [
  {
    id: "odoo",
    title: "Odoo database",
    desc: "Stored data goes to Odoo (ERP)",
    Icon: Database,
    uses: [
      "All weighing records sync to Odoo",
      "Party, product, vehicle, weights, dates",
      "Used for ERP: inventory, sales, purchase",
    ],
  },
  {
    id: "server",
    title: "Physical server / Cloud",
    desc: "Stored data goes to your server or cloud",
    Icon: Server,
    uses: [
      "Tally accounting – data can be used in Tally",
      "Reports: how many trucks came, what material, how much weight",
      "Mode of payment: Cash, Bank transfer, or POS machine",
    ],
    paymentModes: [
      { label: "Cash", Icon: Banknote },
      { label: "Bank transfer", Icon: Building2 },
      { label: "POS machine", Icon: CreditCard },
    ],
  },
];

const IMAGES = [
  { src: "/pitcher/0.jpg", label: "Brochure – Weighing System overview", highlight: "First / Second / Third Weight buttons" },
  { src: "/pitcher/1.jpg", label: "Data entry – where truck number & data are filled", highlight: "Sr No, Vehicle No, First Weight, Party, Product" },
  { src: "/pitcher/2.jpg", label: "Record saved – full details stored", highlight: "Record is saved, Net Weight, all fields" },
  { src: "/pitcher/3.jpg", label: "Party lookup – F5 to pick company", highlight: "Party list: Code + Title (company name)" },
  {
    src: "/pitcher/when%20truck%20leave%20the%20factory.jpg",
    label: "When the truck leaves the factory",
    highlight: "2nd weight 4430, 1st weight 4820, Net 390 · Record saved · out ← 2 1",
    dataFromScreen: {
      srNo: "9113",
      vehicleNo: "6275",
      deliveryNoteNo: "—",
      partyCode: "266",
      partyName: "AL JAMEEL INTERNATIONAL",
      productCode: "17",
      productName: "OCC",
      transCode: "9",
      transName: "FAVAS MON PARAKKAL",
      firstWeight: "4820",
      secondWeight: "4430",
      netWeight: "390",
      firstDateTime: "19/Jan/2026 10:41:52 AM",
      secondDateTime: "19/Jan/2026 10:56:10 AM",
      quantity: "0",
      ratePerTon: "0",
      amount: "0.00",
      comments: "Without Driver.",
      status: "Record is saved",
      flowNote: "out ← 2 1 (when truck leaves: 2nd weight then 1st)",
    },
  },
];

export default function Home() {
  const [openStepId, setOpenStepId] = useState<number | null>(null);
  const stepDetail = openStepId ? STEP_DETAILS[openStepId] : null;
  const stepInfo = openStepId ? FLOW_STEPS.find((s) => s.step === openStepId) : null;

  // Close modal on Escape
  const closeModal = useCallback(() => setOpenStepId(null), []);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    if (openStepId !== null) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [openStepId, closeModal]);

  return (
    <div className="min-h-dvh w-full max-w-[100vw] overflow-x-hidden bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100 safe-area-x">
      <header className="sticky top-0 z-10 border-b border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-3 sm:px-4 md:px-6 safe-area-inset-top safe-area-x">
        <div className="mx-auto w-full max-w-5xl min-w-0">
          <h1 className="text-base font-bold sm:text-lg md:text-xl truncate">Weighing System – Flow & Data</h1>
        </div>
      </header>

      {/* Step detail popup */}
      {openStepId !== null && stepDetail && stepInfo && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] bg-black/50 backdrop-blur-sm"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="step-modal-title"
        >
          <div
            className="weighing-section step-modal-content relative w-full max-w-lg max-h-[90dvh] sm:max-h-[85vh] overflow-y-auto overflow-x-hidden rounded-t-2xl sm:rounded-xl border border-b-0 sm:border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 shadow-xl p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-3 right-3 p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-600 hover:text-stone-800 dark:hover:text-stone-200 active:scale-95 transition-colors touch-manipulation"
              aria-label="Close"
            >
              <X className="w-5 h-5 shrink-0" />
            </button>
            <h3 id="step-modal-title" className="text-base sm:text-lg font-semibold text-amber-600 dark:text-amber-400 pr-12 sm:pr-10 wrap-break-word">
              Step {stepInfo.step}: {stepInfo.title}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 wrap-break-word">{stepInfo.desc}</p>

            <div className="mt-4 space-y-3">
              <div>
                <h4 className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400 mb-1.5">
                  In this section – details
                </h4>
                <ul className="list-disc list-inside text-xs sm:text-sm text-stone-700 dark:text-stone-300 space-y-0.5 wrap-break-word">
                  {stepDetail.details.map((d, idx) => (
                    <li key={idx}>{d}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400 mb-1.5">
                  What should be filled
                </h4>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 wrap-break-word">{stepDetail.whatToFill}</p>
              </div>
              <div>
                <h4 className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400 mb-1.5">
                  See screen (based on image data)
                </h4>
                <p className="text-[11px] sm:text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 rounded px-2 py-1.5 wrap-break-word">
                  {stepDetail.imageLabel}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto w-full max-w-5xl min-w-0 px-3 py-6 sm:px-4 sm:py-8 md:px-6 lg:px-8 space-y-6 sm:space-y-8 md:space-y-12 pb-safe">
        {/* Diagram: what is happening – icons + animated flow */}
        <section className="weighing-section bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-3 sm:p-6 shadow-sm min-w-0">
          <h2 className="text-base font-semibold sm:text-lg mb-2 flex items-center gap-2 min-w-0">
            <ListOrdered className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="text-amber-600 dark:text-amber-400 shrink-0">What is happening (flow)</span>
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm mb-3 sm:mb-6 leading-relaxed wrap-break-word">
            First the truck comes → it gets a number (Sr No) → then weight and details are filled → optionally second weight → net weight → save → truck leaves → data is stored on ERP server. Tap a step to see details and what to fill.
          </p>
          <div className="flex flex-wrap items-stretch justify-center sm:justify-start gap-2 sm:gap-2 min-w-0">
            {FLOW_STEPS.map((item, i) => {
              const StepIcon = item.Icon;
              return (
                <div key={item.step} className="flex items-center gap-1 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => setOpenStepId(item.step)}
                    className="weighing-step flex flex-col items-center min-w-[88px] sm:min-w-[120px] md:min-w-[130px] min-h-[72px] sm:min-h-0 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 sm:p-4 text-center shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-stone-800 touch-manipulation"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <span className="weighing-icon mb-1.5 sm:mb-2 inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-200/80 dark:bg-amber-800/50 text-amber-700 dark:text-amber-300">
                      <StepIcon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.25} />
                    </span>
                    <span className="text-[10px] sm:text-xs font-medium text-amber-700 dark:text-amber-400">Step {item.step}</span>
                    <span className="text-xs sm:text-sm font-semibold mt-0.5 leading-tight">{item.title}</span>
                    <span className="text-[10px] sm:text-xs text-stone-600 dark:text-stone-400 mt-0.5 sm:mt-1 line-clamp-2">{item.desc}</span>
                  </button>
                  {i < FLOW_STEPS.length - 1 && (
                    <span
                      className="weighing-arrow text-amber-500 dark:text-amber-400 self-center hidden sm:flex items-center shrink-0"
                      style={{ animationDelay: `${i * 120}ms` }}
                    >
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Where stored data goes: Odoo vs Server/Cloud (Tally, reports, payment) */}
        <section className="weighing-section bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-3 sm:p-6 shadow-sm min-w-0 overflow-hidden">
          <h2 className="text-base font-semibold sm:text-lg mb-2 flex items-center gap-2 min-w-0">
            <Database className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="text-amber-600 dark:text-amber-400 shrink-0">Where stored data goes</span>
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm mb-3 sm:mb-6 wrap-break-word">
            Saved weighing records go to two places: Odoo database (ERP) and your physical server or cloud. Server/cloud data is used for Tally accounting, reports (trucks, material, weight), and payment mode (cash, bank transfer, POS).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 min-w-0">
            {DATA_DESTINATIONS.map((dest, idx) => {
              const DestIcon = dest.Icon;
              const isOdoo = dest.id === "odoo";
              return (
                <div
                  key={dest.id}
                  className={`weighing-image-card rounded-xl border p-3 sm:p-5 shadow-sm min-w-0 overflow-hidden ${
                    isOdoo
                      ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
                      : "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800"
                  }`}
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${
                        isOdoo
                          ? "bg-emerald-200/80 dark:bg-emerald-800/50 text-emerald-700 dark:text-emerald-300"
                          : "bg-blue-200/80 dark:bg-blue-800/50 text-blue-700 dark:text-blue-300"
                      }`}
                    >
                      <DestIcon className="w-6 h-6" strokeWidth={2} />
                    </span>
                    <div className="min-w-0">
                      <h3 className={`font-semibold text-sm sm:text-base ${isOdoo ? "text-emerald-800 dark:text-emerald-200" : "text-blue-800 dark:text-blue-200"}`}>
                        {dest.title}
                      </h3>
                      <p className="text-xs text-stone-600 dark:text-stone-400 wrap-break-word">{dest.desc}</p>
                    </div>
                  </div>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-stone-700 dark:text-stone-300 wrap-break-word">
                    {dest.uses.map((use, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-amber-500 dark:text-amber-400 shrink-0">•</span>
                        {use}
                      </li>
                    ))}
                  </ul>
                  {"paymentModes" in dest && dest.paymentModes && (
                    <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-600">
                      <p className="text-[11px] sm:text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-2">Mode of payment</p>
                      <div className="flex flex-wrap gap-2">
                        {dest.paymentModes.map((pm) => {
                          const PmIcon = pm.Icon;
                          return (
                            <span
                              key={pm.label}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-600 px-3 py-2 min-h-[44px] sm:min-h-0 sm:py-1.5 text-xs text-stone-700 dark:text-stone-300 touch-manipulation"
                            >
                              <PmIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                              {pm.label}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Images – where truck load and data are filled */}
        <section className="weighing-section bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-3 sm:p-6 shadow-sm min-w-0 overflow-hidden">
          <h2 className="text-base font-semibold sm:text-lg mb-2 flex items-center gap-2 min-w-0">
            <LayoutPanelTop className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="wrap-break-word min-w-0">Screens – where truck and data are filled</span>
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm mb-3 sm:mb-6 wrap-break-word">
            The images below show where the truck gets its number, where weight is entered, and where party/product details are filled.
          </p>
          <div className="grid gap-4 sm:gap-8 grid-cols-1 min-w-0">
            {IMAGES.map((img, idx) => (
              <div key={img.src} className="weighing-image-card space-y-2 w-full min-w-0" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="relative rounded-lg overflow-hidden border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-900 shadow-sm w-full">
                  <Image
                    src={img.src}
                    alt={img.label}
                    width={800}
                    height={500}
                    className="w-full h-auto object-contain max-h-[45vh] sm:max-h-[420px] min-h-0"
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1024px"
                  />
                </div>
                <p className="text-xs sm:text-sm font-medium wrap-break-word">{img.label}</p>
                <p className="text-[10px] sm:text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 rounded px-2 py-1 inline-block wrap-break-word max-w-full">
                  {img.highlight}
                </p>
                {"dataFromScreen" in img && img.dataFromScreen && (
                  <div className="weighing-data-card mt-3 rounded-lg border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-900/80 p-3 sm:p-4 text-xs sm:text-sm">
                    <p className="font-semibold text-stone-800 dark:text-stone-200 mb-2 sm:mb-3">Data from this screen (when truck leaves)</p>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1.5 sm:gap-y-2 text-stone-600 dark:text-stone-400">
                      <dt className="font-medium text-stone-700 dark:text-stone-300">Sr No</dt>
                      <dd>{img.dataFromScreen.srNo}</dd>
                      <dt className="font-medium text-stone-700 dark:text-stone-300">Vehicle No</dt>
                      <dd>{img.dataFromScreen.vehicleNo}</dd>
                      <dt className="font-medium text-stone-700 dark:text-stone-300">Delivery Note No</dt>
                      <dd>{img.dataFromScreen.deliveryNoteNo}</dd>
                      <dt className="font-medium text-stone-700 dark:text-stone-300">Party Code</dt>
                      <dd>{img.dataFromScreen.partyCode}</dd>
                      <dt className="font-medium text-stone-700 dark:text-stone-300">Party Name</dt>
                      <dd>{img.dataFromScreen.partyName}</dd>
                      <dt className="font-medium text-stone-700 dark:text-stone-300">Product Code</dt>
                      <dd>{img.dataFromScreen.productCode}</dd>
                      <dt className="font-medium text-stone-700 dark:text-stone-300">Product Name</dt>
                      <dd>{img.dataFromScreen.productName}</dd>
                      <dt className="font-medium text-stone-700 dark:text-stone-300">Trans. Code</dt>
                      <dd>{img.dataFromScreen.transCode}</dd>
                      <dt className="font-medium text-stone-700 dark:text-stone-300">Trans. Name</dt>
                      <dd>{img.dataFromScreen.transName}</dd>
                      <dt className="font-medium text-stone-700 dark:text-stone-300">First Weight</dt>
                      <dd>{img.dataFromScreen.firstWeight}</dd>
                      <dt className="font-medium text-stone-700 dark:text-stone-300">2nd Weight</dt>
                      <dd>{img.dataFromScreen.secondWeight}</dd>
                      <dt className="font-medium text-stone-700 dark:text-stone-300">Net Weight</dt>
                      <dd>{img.dataFromScreen.netWeight}</dd>
                      <dt className="font-medium text-stone-700 dark:text-stone-300">First Date/Time</dt>
                      <dd>{img.dataFromScreen.firstDateTime}</dd>
                      <dt className="font-medium text-stone-700 dark:text-stone-300">2nd Date/Time</dt>
                      <dd>{img.dataFromScreen.secondDateTime}</dd>
                      <dt className="font-medium text-stone-700 dark:text-stone-300">Quantity</dt>
                      <dd>{img.dataFromScreen.quantity}</dd>
                      <dt className="font-medium text-stone-700 dark:text-stone-300">Rate per Ton</dt>
                      <dd>{img.dataFromScreen.ratePerTon}</dd>
                      <dt className="font-medium text-stone-700 dark:text-stone-300">Amount</dt>
                      <dd>{img.dataFromScreen.amount}</dd>
                      <dt className="font-medium text-stone-700 dark:text-stone-300">Comments</dt>
                      <dd>{img.dataFromScreen.comments}</dd>
                      <dt className="font-medium text-stone-700 dark:text-stone-300">Status</dt>
                      <dd className="text-emerald-600 dark:text-emerald-400">{img.dataFromScreen.status}</dd>
                      <dt className="font-medium text-stone-700 dark:text-stone-300 col-span-2 sm:col-span-3">Flow note</dt>
                      <dd className="col-span-2 sm:col-span-3">{img.dataFromScreen.flowNote}</dd>
                    </dl>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* What kind of data and details */}
        <section className="weighing-section bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-3 sm:p-6 shadow-sm overflow-hidden min-w-0">
          <h2 className="text-base font-semibold sm:text-lg mb-2 flex items-center gap-2 min-w-0">
            <Table2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="min-w-0">What kind of data and details</span>
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm mb-3 sm:mb-4 wrap-break-word">
            Each field in the weighing form and where it appears. Scroll horizontally on small screens to see all columns.
          </p>
          <div className="weighing-table-scroll overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
            <table className="w-full min-w-[480px] sm:min-w-[520px] text-[11px] sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-600">
                  <th className="weighing-table-sticky-col bg-white dark:bg-stone-800 text-left py-2.5 pr-2 sm:pr-4 font-semibold whitespace-nowrap">Field</th>
                  <th className="text-left py-2.5 pr-2 sm:pr-4 font-semibold whitespace-nowrap">Where it is filled</th>
                  <th className="text-left py-2.5 pr-2 font-semibold min-w-[120px]">Meaning</th>
                </tr>
              </thead>
              <tbody>
                {DATA_FIELDS.map((row) => (
                  <tr key={row.field} className="weighing-table-row border-b border-stone-100 dark:border-stone-700/50">
                    <td className="weighing-table-sticky-col bg-white dark:bg-stone-800 py-2.5 pr-2 sm:pr-4 font-medium whitespace-nowrap">{row.field}</td>
                    <td className="py-2.5 pr-2 sm:pr-4 text-stone-600 dark:text-stone-400 wrap-break-word">{row.where}</td>
                    <td className="py-2.5 pr-2 text-stone-600 dark:text-stone-400 wrap-break-word">{row.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
