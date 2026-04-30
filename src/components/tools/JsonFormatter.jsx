import React, { useState } from "react";
import { VscJson } from "react-icons/vsc";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [indentLevel, setIndentLevel] = useState(2);

  const formatJson = () => {
    if (!input.trim()) {
      setOutput("");
      setError("");
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indentLevel);
      setOutput(formatted);
      setError("");
    } catch (err) {
      setError(`Error de validación: ${err.message}`);
      setOutput("");
    }
  };

  const minifyJson = () => {
    if (!input.trim()) {
      setOutput("");
      setError("");
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError("");
    } catch (err) {
      setError(`Error de validación: ${err.message}`);
      setOutput("");
    }
  };

  const validateJson = () => {
    if (!input.trim()) {
      setError("");
      setOutput("");
      return;
    }

    try {
      JSON.parse(input);
      setError("");
      setOutput("✓ JSON válido");
    } catch (err) {
      setError(`✗ JSON inválido: ${err.message}`);
      setOutput("");
    }
  };

  const handleCopy = async () => {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const textarea = document.createElement("textarea");
      textarea.value = output;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setError("");
  };

  return (
    <div className="max-w-4xl mx-auto pt-10 px-6">
      <div className="space-y-6">
        <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 backdrop-blur-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500/20 to-yellow-700/20 border border-yellow-500/30">
              <VscJson className="w-5 h-5 text-yellow-400" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-100">JSON Input</h3>
          </div>

          <textarea
            className="w-full h-64 px-4 py-3 rounded-lg border border-neutral-700 bg-neutral-900/50 text-neutral-100 placeholder-neutral-500 resize-none focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-colors font-mono text-sm"
            placeholder='Pega tu JSON aquí, por ejemplo: {"nombre": "Juan", "edad": 30}'
            value={input}
            onChange={handleInputChange}
          />

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <button
              onClick={formatJson}
              className="px-4 py-2 rounded-lg border border-green-600 bg-green-600/20 text-green-300 font-medium transition-all duration-200 hover:bg-green-600/30 hover:border-green-500 hover:scale-[1.02] active:scale-[0.98]"
            >
              Formatear
            </button>
            <button
              onClick={minifyJson}
              className="px-4 py-2 rounded-lg border border-blue-600 bg-blue-600/20 text-blue-300 font-medium transition-all duration-200 hover:bg-blue-600/30 hover:border-blue-500 hover:scale-[1.02] active:scale-[0.98]"
            >
              Minificar
            </button>
            <button
              onClick={validateJson}
              className="px-4 py-2 rounded-lg border border-purple-600 bg-purple-600/20 text-purple-300 font-medium transition-all duration-200 hover:bg-purple-600/30 hover:border-purple-500 hover:scale-[1.02] active:scale-[0.98]"
            >
              Validar
            </button>
            <div className="flex items-center gap-2 ml-auto">
              <label className="text-sm text-neutral-400">Indentación:</label>
              <select
                value={indentLevel}
                onChange={(e) => setIndentLevel(Number(e.target.value))}
                className="px-2 py-1 rounded border border-neutral-700 bg-neutral-900/50 text-neutral-100 text-sm focus:border-yellow-500 focus:outline-none"
              >
                <option value={2}>2 espacios</option>
                <option value={4}>4 espacios</option>
                <option value={0}>Tab</option>
              </select>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 backdrop-blur-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-neutral-100">Resultado</h3>
            <button
              onClick={handleCopy}
              disabled={!output}
              className="px-3 py-1 text-sm rounded-lg border border-neutral-700 bg-neutral-900/50 text-neutral-300 font-medium transition-all duration-200 hover:bg-neutral-800/50 hover:border-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {copied ? (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copiado
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copiar
                </span>
              )}
            </button>
          </div>

          <textarea
            readOnly
            className="w-full h-64 px-4 py-3 rounded-lg border border-neutral-700 bg-neutral-900/30 text-neutral-100 placeholder-neutral-500 resize-none focus:border-neutral-600 focus:outline-none transition-colors font-mono text-sm"
            placeholder="El resultado aparecerá aquí..."
            value={output}
          />
        </div>
      </div>
    </div>
  );
}

