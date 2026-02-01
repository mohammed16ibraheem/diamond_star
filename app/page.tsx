import Image from "next/image";
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
} from "lucide-react";

const FLOW_STEPS = [
  { step: 1, title: "Truck arrives", desc: "Vehicle comes to the scale", Icon: Truck },
  { step: 2, title: "Gets a number", desc: "Sr No (e.g. 9113) is assigned", Icon: Hash },
  { step: 3, title: "First weight + data", desc: "Weight & party, product, vehicle filled", Icon: ClipboardList },
  { step: 4, title: "Second weight", desc: "After load/unload (optional)", Icon: Scale },
  { step: 5, title: "Net weight", desc: "First − Second = Net", Icon: Calculator },
  { step: 6, title: "Save / Print", desc: "Record is saved", Icon: Save },
  { step: 7, title: "Truck leaves", desc: "Vehicle exits after record saved", Icon: LogOut },
];

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
  return (
    <div className="min-h-dvh w-full max-w-[100vw] bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100">
      <header className="sticky top-0 z-10 border-b border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-3 sm:px-4 md:px-6 safe-area-inset-top">
        <div className="mx-auto w-full max-w-5xl">
          <h1 className="text-base font-bold sm:text-lg md:text-xl truncate">Weighing System – Flow & Data</h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-3 py-6 sm:px-4 sm:py-8 md:px-6 space-y-8 sm:space-y-12 pb-safe">
        {/* Diagram: what is happening – icons + animated flow */}
        <section className="weighing-section bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-4 sm:p-6 shadow-sm">
          <h2 className="text-base font-semibold sm:text-lg mb-2 flex items-center gap-2">
            <span className="text-amber-600 dark:text-amber-400">What is happening (flow)</span>
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">
            First the truck comes → it gets a number (Sr No) → then weight and details are filled → optionally second weight → net weight → save → truck leaves.
          </p>
          <div className="flex flex-wrap items-stretch justify-center sm:justify-start gap-2 sm:gap-2">
            {FLOW_STEPS.map((item, i) => {
              const StepIcon = item.Icon;
              return (
                <div key={item.step} className="flex items-center gap-1 sm:gap-2">
                  <div
                    className="weighing-step flex flex-col items-center min-w-[88px] sm:min-w-[120px] md:min-w-[130px] rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 sm:p-4 text-center shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <span className="weighing-icon mb-1.5 sm:mb-2 inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-200/80 dark:bg-amber-800/50 text-amber-700 dark:text-amber-300">
                      <StepIcon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.25} />
                    </span>
                    <span className="text-[10px] sm:text-xs font-medium text-amber-700 dark:text-amber-400">Step {item.step}</span>
                    <span className="text-xs sm:text-sm font-semibold mt-0.5 leading-tight">{item.title}</span>
                    <span className="text-[10px] sm:text-xs text-stone-600 dark:text-stone-400 mt-0.5 sm:mt-1 line-clamp-2">{item.desc}</span>
                  </div>
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

        {/* Images – where truck load and data are filled */}
        <section className="weighing-section bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-4 sm:p-6 shadow-sm">
          <h2 className="text-base font-semibold sm:text-lg mb-2 flex items-center gap-2">
            <LayoutPanelTop className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="break-words">Screens – where truck and data are filled</span>
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm mb-4 sm:mb-6">
            The images below show where the truck gets its number, where weight is entered, and where party/product details are filled.
          </p>
          <div className="grid gap-6 sm:gap-8 grid-cols-1">
            {IMAGES.map((img, idx) => (
              <div key={idx} className="weighing-image-card space-y-2 w-full min-w-0" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="relative rounded-lg overflow-hidden border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-900 shadow-sm w-full">
                  <Image
                    src={img.src}
                    alt={img.label}
                    width={800}
                    height={500}
                    className="w-full h-auto object-contain max-h-[50vh] sm:max-h-[420px]"
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1024px"
                  />
                </div>
                <p className="text-xs sm:text-sm font-medium break-words">{img.label}</p>
                <p className="text-[10px] sm:text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 rounded px-2 py-1 inline-block break-words max-w-full">
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
        <section className="weighing-section bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-4 sm:p-6 shadow-sm overflow-hidden">
          <h2 className="text-base font-semibold sm:text-lg mb-2 flex items-center gap-2">
            <Table2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            What kind of data and details
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm mb-3 sm:mb-4">
            Each field in the weighing form and where it appears.
          </p>
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full min-w-[520px] text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-600">
                  <th className="text-left py-2 pr-2 sm:pr-4 font-semibold whitespace-nowrap">Field</th>
                  <th className="text-left py-2 pr-2 sm:pr-4 font-semibold whitespace-nowrap">Where it is filled</th>
                  <th className="text-left py-2 font-semibold">Meaning</th>
                </tr>
              </thead>
              <tbody>
                {DATA_FIELDS.map((row) => (
                  <tr key={row.field} className="weighing-table-row border-b border-stone-100 dark:border-stone-700/50">
                    <td className="py-2 pr-2 sm:pr-4 font-medium whitespace-nowrap">{row.field}</td>
                    <td className="py-2 pr-2 sm:pr-4 text-stone-600 dark:text-stone-400">{row.where}</td>
                    <td className="py-2 text-stone-600 dark:text-stone-400 break-words">{row.meaning}</td>
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
