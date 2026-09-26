"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { formatCompact } from "@/lib/feed/utils";

/** Number that slides in from below when it grows and from above when it shrinks. */
export function AnimatedCount({ value }: { value: number }) {
  const prev = useRef(value);
  const direction = value >= prev.current ? 1 : -1;
  const changed = value !== prev.current;
  useEffect(() => {
    prev.current = value;
  }, [value]);

  return (
    <span className="inline-flex overflow-hidden tabular-nums">
      <motion.span
        key={value}
        initial={changed ? { y: direction * 10, opacity: 0 } : false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.18 }}
      >
        {formatCompact(value)}
      </motion.span>
    </span>
  );
}
