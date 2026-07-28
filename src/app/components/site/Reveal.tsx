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
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  desc,
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className="max-w-2xl mx-auto text-center mb-12">
      {eyebrow && (
        <span className="inline-block mb-3 px-4 py-1 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] text-sm tracking-wide uppercase">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl text-[#0F4C81]" style={{ fontWeight: 700 }}>
        {title}
      </h2>
      {desc && <p className="mt-4 text-muted-foreground leading-relaxed">{desc}</p>}
    </div>
  );
}
