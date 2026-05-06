import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

type DashboardLayoutProps = {
  inputPanel: ReactNode;
  analysisPanel: ReactNode;
};

export function DashboardLayout({ inputPanel, analysisPanel }: DashboardLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="grid items-start gap-6 xl:grid-cols-[minmax(420px,0.95fr)_minmax(0,1.05fr)]"
    >
      <div className="xl:sticky xl:top-24">{inputPanel}</div>
      {analysisPanel}
    </motion.div>
  );
}
