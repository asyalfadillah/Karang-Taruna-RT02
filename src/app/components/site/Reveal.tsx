import { motion } from "motion/react";
import React from "react";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  desc,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
  align?: "center" | "left";
}) {
  const isCenter = align === "center";
  return (
    <div className={`max-w-2xl mb-12 ${isCenter ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <div className={`flex items-center gap-3 mb-4 ${isCenter ? "justify-center" : ""}`}>
          <span className="h-px w-8 bg-[#A8802F]" />
          <span className="text-xs tracking-[0.18em] uppercase text-[#A8802F]" style={{ fontWeight: 600 }}>
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className="text-3xl md:[font-size:2.5rem] text-[#211C17] leading-[1.15]" style={{ fontWeight: 600 }}>
        {title}
      </h2>
      {desc && <p className="mt-4 text-muted-foreground leading-relaxed">{desc}</p>}
    </div>
  );
}
