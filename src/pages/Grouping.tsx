import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Users, Grid, Shuffle, Settings, Download } from 'lucide-react';
import { motion } from 'motion/react';
import Papa from 'papaparse';

export default function Grouping() {
  const { names } = useApp();
  const [groups, setGroups] = useState<string[][]>([]);
  const [groupSize, setGroupSize] = useState(4);
  const [mode, setMode] = useState<'bySize' | 'byCount'>('bySize');
  const [groupCount, setGroupCount] = useState(4);

  const handleGroup = () => {
    if (names.length === 0) return;

    // Shuffle names
    const shuffled = [...names].sort(() => Math.random() - 0.5);
    const newGroups: string[][] = [];

    if (mode === 'bySize') {
      // Chunk by size
      for (let i = 0; i < shuffled.length; i += groupSize) {
        newGroups.push(shuffled.slice(i, i + groupSize));
      }
    } else {
      // Distribute into N groups
      // Initialize empty groups
      for (let i = 0; i < groupCount; i++) {
        newGroups.push([]);
      }
      // Distribute round-robin
      shuffled.forEach((name, index) => {
        const groupIndex = index % groupCount;
        newGroups[groupIndex].push(name);
      });
    }

    setGroups(newGroups);
  };

  const downloadCSV = () => {
    if (groups.length === 0) return;

    // Prepare data for CSV: Group Number, Name
    const csvData: { Group: string; Name: string }[] = [];
    groups.forEach((group, idx) => {
      group.forEach(name => {
        csvData.push({
          Group: `Group ${idx + 1}`,
          Name: name
        });
      });
    });

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'grouping_results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="grid gap-6 md:grid-cols-4">
        {/* Controls */}
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="w-5 h-5" />
              Grouping Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Mode</label>
              <div className="flex rounded-md shadow-sm">
                <button
                  onClick={() => setMode('bySize')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-l-md border ${
                    mode === 'bySize'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  By Size
                </button>
                <button
                  onClick={() => setMode('byCount')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-r-md border-t border-b border-r ${
                    mode === 'byCount'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  By Count
                </button>
              </div>
            </div>

            {mode === 'bySize' ? (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  People per Group
                </label>
                <input
                  type="number"
                  min="1"
                  max={names.length || 100}
                  value={groupSize}
                  onChange={(e) => setGroupSize(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Number of Groups
                </label>
                <input
                  type="number"
                  min="1"
                  max={names.length || 100}
                  value={groupCount}
                  onChange={(e) => setGroupCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            )}

            <Button onClick={handleGroup} className="w-full" disabled={names.length === 0}>
              <Shuffle className="w-4 h-4 mr-2" />
              Generate Groups
            </Button>
            
            {groups.length > 0 && (
              <Button onClick={downloadCSV} variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download CSV
              </Button>
            )}
            
            <div className="text-xs text-gray-500 text-center">
              Total Names: {names.length}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="md:col-span-3">
          {groups.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
              <Grid className="w-12 h-12 mb-4 opacity-20" />
              <p>No groups generated yet.</p>
              <p className="text-sm">Adjust settings and click "Generate Groups"</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {groups.map((group, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
                      <CardTitle className="text-base font-medium flex justify-between items-center">
                        <span>Group {idx + 1}</span>
                        <span className="text-xs font-normal bg-white px-2 py-1 rounded-full border border-gray-200 text-gray-500">
                          {group.length} members
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <ul className="space-y-2">
                        {group.map((member, mIdx) => (
                          <li key={mIdx} className="flex items-center gap-2 text-sm text-gray-700">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                            {member}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
