import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Upload, Trash2, UserPlus, FileText } from 'lucide-react';

export default function DataInput() {
  const { names, setNames, addNames, clearAll } = useApp();
  const [inputText, setInputText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        const parsedNames: string[] = [];
        results.data.forEach((row: any) => {
          // Assume single column or check for 'name' column
          const values = Object.values(row);
          values.forEach((val: any) => {
            if (typeof val === 'string' && val.trim()) {
              parsedNames.push(val.trim());
            }
          });
        });
        addNames(parsedNames);
      },
      header: false, // Simple list usually doesn't have headers, or we just grab all text
    });
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleManualAdd = () => {
    if (!inputText.trim()) return;
    const newNames = inputText.split(/[\n,]+/).map(n => n.trim()).filter(n => n);
    addNames(newNames);
    setInputText('');
  };

  const loadDemoData = () => {
    const demoNames = [
      "Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Hannah", "Ivy", "Jack",
      "Kevin", "Liam", "Mia", "Noah", "Olivia", "Paul", "Quinn", "Rachel", "Sam", "Tina",
      "Ursula", "Victor", "Wendy", "Xander", "Yara", "Zack"
    ];
    addNames(demoNames);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Manual Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Paste Names
              </div>
              <Button variant="ghost" size="sm" onClick={loadDemoData} className="text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                Load Demo List
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              className="w-full h-40 p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="Paste names here (separated by new lines or commas)..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <Button onClick={handleManualAdd} className="w-full" disabled={!inputText.trim()}>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Names
            </Button>
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload CSV
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                accept=".csv,.txt"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <div className="flex flex-col items-center gap-2 text-gray-500">
                <Upload className="w-8 h-8" />
                <span className="text-sm font-medium">Click to upload CSV or TXT</span>
              </div>
            </div>
            <div className="text-xs text-gray-400 text-center">
              Supported formats: .csv, .txt
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Name List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Current List ({names.length})</CardTitle>
          {names.length > 0 && (
            <Button variant="danger" size="sm" onClick={clearAll}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {names.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No names added yet. Add some names to get started!
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {names.map((name, index) => (
                <div 
                  key={`${name}-${index}`}
                  className="bg-gray-100 px-3 py-2 rounded-md text-sm flex items-center justify-between group"
                >
                  <span className="truncate">{name}</span>
                  <button 
                    onClick={() => setNames(names.filter((_, i) => i !== index))}
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
