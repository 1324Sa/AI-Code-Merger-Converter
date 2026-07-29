'use client';

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

const SUPPORTED_LANGUAGES = [
  'python', 'html', 'sql', 'css', 'cpp', 'csharp', 
  'c', 'r', 'php', 'go', 'swift', 'java', 'javascript', 'typescript'
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<'merge' | 'convert'>('merge');
  
  // حالات الدمج
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [existingCode, setExistingCode] = useState('# Python Code\ndef calculate_discount(price):\n    return price * 0.90');
  const [incomingCode, setIncomingCode] = useState('# Python Code\ndef calculate_discount(price, is_vip=False):\n    if is_vip:\n        return price * 0.80\n    return price * 0.90');
  const [mergeResult, setMergeResult] = useState<any>(null);
  
  // حالات التحويل
  const [sourceLang, setSourceLang] = useState('python');
  const [targetLang, setTargetLang] = useState('go');
  const [convertCode, setConvertCode] = useState('# Python Source\ndef greet(name: str) -> str:\n    return f"Hello, {name}"');
  const [convertResult, setConvertResult] = useState<any>(null);

  const [loading, setLoading] = useState<boolean>(false);

  // تنفيذ الدمج
  const handleMerge = async () => {
    setLoading(true);
    setMergeResult(null);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/merge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          existing_code: existingCode,
          incoming_code: incomingCode,
          language: selectedLanguage,
        }),
      });
      const data = await res.json();
      setMergeResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // تنفيذ التحويل
  const handleConvert = async () => {
    setLoading(true);
    setConvertResult(null);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_code: convertCode,
          source_language: sourceLang,
          target_language: targetLang,
        }),
      });
      const data = await res.json();
      setConvertResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6 font-sans">
      <header className="mb-6 flex flex-col md:flex-row justify-between items-center border-b border-slate-700 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-400">AI Code Engine & Multi-Lang Converter</h1>
          <p className="text-xs text-slate-400 mt-1">Local LLM Architecture (qwen2.5-coder)</p>
        </div>

        {/* أزرار التنقل بين الوظائف */}
        <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setActiveTab('merge')}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
              activeTab === 'merge' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Code Merger
          </button>
          <button
            onClick={() => setActiveTab('convert')}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
              activeTab === 'convert' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Language Transpiler
          </button>
        </div>
      </header>

      {/* قسم الدمج Code Merger */}
      {activeTab === 'merge' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-300">Select Language:</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-md px-3 py-1 text-sm font-mono text-blue-300 capitalize"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleMerge}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 px-6 py-2 rounded-lg font-semibold transition-all"
            >
              {loading ? 'Merging Code...' : 'Analyze & Merge'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="border border-slate-700 rounded-lg overflow-hidden">
              <div className="bg-slate-800 px-4 py-2 text-sm font-mono text-slate-300">Existing Code</div>
              <Editor height="350px" language={selectedLanguage} theme="vs-dark" value={existingCode} onChange={(v) => setExistingCode(v || '')} />
            </div>
            <div className="border border-slate-700 rounded-lg overflow-hidden">
              <div className="bg-slate-800 px-4 py-2 text-sm font-mono text-slate-300">Incoming Code</div>
              <Editor height="350px" language={selectedLanguage} theme="vs-dark" value={incomingCode} onChange={(v) => setIncomingCode(v || '')} />
            </div>
          </div>

          {mergeResult && (
            <div className="border border-slate-700 bg-slate-800 rounded-lg p-6">
              <h2 className="text-lg font-bold mb-2">
                Status: <span className={mergeResult.can_merge ? 'text-green-400' : 'text-red-400'}>{mergeResult.can_merge ? 'Success' : 'Conflicts Found'}</span>
              </h2>
              {mergeResult.can_merge ? (
                <Editor height="250px" language={selectedLanguage} theme="vs-dark" value={mergeResult.merged_code} options={{ readOnly: true }} />
              ) : (
                mergeResult.conflicts.map((c: any, i: number) => (
                  <div key={i} className="bg-red-950/40 border border-red-800 p-3 rounded my-2 text-sm">
                    <p className="font-bold text-red-300">{c.line_or_function}</p>
                    <p>{c.reason}</p>
                    <p className="text-blue-300">{c.suggestion}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* قسم تحويل اللغات Transpiler */}
      {activeTab === 'convert' && (
        <div>
          <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-slate-300">From:</label>
                <select
                  value={sourceLang}
                  onChange={(e) => setSourceLang(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-md px-3 py-1 text-sm font-mono text-green-400 capitalize"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>

              <span className="text-slate-500 font-bold">➜</span>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-slate-300">To:</label>
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-md px-3 py-1 text-sm font-mono text-purple-400 capitalize"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleConvert}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 px-6 py-2 rounded-lg font-semibold transition-all"
            >
              {loading ? 'Translating Syntax...' : 'Convert Code'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="border border-slate-700 rounded-lg overflow-hidden">
              <div className="bg-slate-800 px-4 py-2 text-sm font-mono text-slate-300 capitalize">Source Code ({sourceLang})</div>
              <Editor height="380px" language={sourceLang} theme="vs-dark" value={convertCode} onChange={(v) => setConvertCode(v || '')} />
            </div>

            <div className="border border-slate-700 rounded-lg overflow-hidden">
              <div className="bg-slate-800 px-4 py-2 text-sm font-mono text-slate-300 capitalize">Converted Output ({targetLang})</div>
              <Editor
                height="380px"
                language={targetLang}
                theme="vs-dark"
                value={convertResult?.converted_code || '// Converted code will appear here...'}
                options={{ readOnly: true }}
              />
            </div>
          </div>

          {convertResult?.notes && (
            <div className="border border-slate-700 bg-slate-800/80 rounded-lg p-4">
              <h3 className="text-md font-semibold text-purple-300 mb-2">Translation Adaptations & Notes:</h3>
              <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                {convertResult.notes.map((note: string, idx: number) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </main>
  );
}