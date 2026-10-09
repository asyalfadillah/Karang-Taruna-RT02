import { Landmark } from "lucide-react";
import { Reveal } from "./Reveal";
import { Countdown } from "./Countdown";
import { useLang } from "../../i18n/i18n";

// Jayakarta didirikan 22 Juni 1527 -> HUT ke-500 jatuh pada 22 Juni 2027.
const JAKARTA_500_DATE = "2027-06-22";

export function JakartaAnniversary() {
  const { td } = useLang();
  const j = (td as any).jakarta;
  return (
    <section className="py-16 md:py-20 bg-[#1C3A54]">
      <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
        <Reveal>
          <Landmark className="size-9 text-[#d9bd7a] mx-auto" />
          <div className="mt-4 text-xs tracking-[0.18em] uppercase text-[#d9bd7a]" style={{ fontWeight: 600 }}>
            {j.eyebrow}
          </div>
          <h2 className="mt-3 text-3xl md:text-5xl text-white leading-[1.15]" style={{ fontWeight: 600 }}>
            {j.title}
          </h2>
          <p className="mt-4 text-white/75 max-w-xl mx-auto">{j.desc}</p>
          <div className="mt-8">
            <Countdown date={JAKARTA_500_DATE} large />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
