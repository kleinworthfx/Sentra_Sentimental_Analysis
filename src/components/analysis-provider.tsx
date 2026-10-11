import { createContext, useContext, useState, type ReactNode } from 'react';
import { type Analysis } from '@/lib/sentiment';

type AnalysisState = { rows: Analysis[]; setRows: (rows: Analysis[]) => void; isDemo: boolean; setDemo: (demo: boolean) => void; datasetName: string; setDatasetName: (name: string) => void; };
const AnalysisContext = createContext<AnalysisState | null>(null);
export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [rows, setRows] = useState<Analysis[]>([]);
  const [isDemo, setDemo] = useState(true);
  const [datasetName, setDatasetName] = useState('Customer feedback');
  return <AnalysisContext.Provider value={{ rows, setRows, isDemo, setDemo, datasetName, setDatasetName }}>{children}</AnalysisContext.Provider>;
}
export function useAnalysis() { const context = useContext(AnalysisContext); if (!context) throw new Error('Analysis provider missing'); return context; }