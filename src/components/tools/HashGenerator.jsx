import React, { useState } from "react";
import { LuKeyRound } from "react-icons/lu";
import ToolLayout from "./shared/ToolLayout";
import InputArea from "./shared/InputArea";
import OutputArea from "./shared/OutputArea";
import CopyButton from "./shared/CopyButton";

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState({
    sha1: "",
    sha256: "",
    sha512: "",
  });
  const [loading, setLoading] = useState(false);
  const [copiedHash, setCopiedHash] = useState(null);

  const arrayBufferToHex = (buffer) => {
    const bytes = new Uint8Array(buffer);
    return Array.from(bytes)
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
  };

  const calculateHash = async (text, algorithm) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    return arrayBufferToHex(hashBuffer);
  };

  const handleTextHash = async () => {
    if (!input.trim()) {
      setHashes({ sha1: "", sha256: "", sha512: "" });
      return;
    }

    setLoading(true);
    try {
      const [sha1, sha256, sha512] = await Promise.all([
        calculateHash(input, "SHA-1"),
        calculateHash(input, "SHA-256"),
        calculateHash(input, "SHA-512"),
      ]);

      setHashes({ sha1, sha256, sha512 });
    } catch (err) {
      console.error("Error calculating hashes:", err);
      setHashes({
        sha1: "Error",
        sha256: "Error",
        sha512: "Error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileHash = async (file) => {
    if (!file) return;

    setLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      const [sha1, sha256, sha512] = await Promise.all([
        crypto.subtle.digest("SHA-1", arrayBuffer).then(arrayBufferToHex),
        crypto.subtle.digest("SHA-256", arrayBuffer).then(arrayBufferToHex),
        crypto.subtle.digest("SHA-512", arrayBuffer).then(arrayBufferToHex),
      ]);

      setHashes({ sha1, sha256, sha512 });
      setInput(file.name);
    } catch (err) {
      console.error("Error calculating file hashes:", err);
      setHashes({
        sha1: "Error",
        sha256: "Error",
        sha512: "Error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileHash(file);
    }
  };

  const copyHash = async (hash, hashType) => {
    if (!hash) return;

    try {
      await navigator.clipboard.writeText(hash);
      setCopiedHash(hashType);
      setTimeout(() => setCopiedHash(null), 2000);
    } catch (err) {
      const textarea = document.createElement("textarea");
      textarea.value = hash;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiedHash(hashType);
      setTimeout(() => setCopiedHash(null), 2000);
    }
  };

  return (
    <ToolLayout
      icon={<LuKeyRound className="w-5 h-5 text-purple-400" />}
      title="Hash Generator"
      description="Genera hashes SHA1, SHA256 y SHA512 para texto o archivos usando Web Crypto API."
    >
      <InputArea
        label="Texto para generar hashes"
        value={input}
        onChange={setInput}
        placeholder="Escribe el texto para generar hashes..."
        rows={6}
        className="font-mono text-sm"
      />

      <div className="flex items-center gap-4">
        <div className="flex-1 border-t border-neutral-700"></div>
        <span className="text-neutral-500 text-sm">o</span>
        <div className="flex-1 border-t border-neutral-700"></div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-neutral-300">
          Selecciona un archivo:
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-purple-600 file:bg-purple-600/20 file:text-purple-300 file:hover:bg-purple-600/30 file:transition-all file:cursor-pointer"
        />
      </div>

      <button
        onClick={handleTextHash}
        disabled={loading || !input.trim()}
        className="w-full px-4 py-2 rounded-lg border border-purple-600 bg-purple-600/20 text-purple-300 font-medium transition-all duration-200 hover:bg-purple-600/30 hover:border-purple-500 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Calculando...
          </span>
        ) : (
          "Generar Hashes"
        )}
      </button>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-sm font-medium">
              SHA-1
            </span>
            <CopyButton text={hashes.sha1} />
          </div>
          <div className="px-4 py-3 rounded-lg border border-neutral-700 bg-neutral-900/30 text-neutral-100 font-mono text-sm break-all">
            {hashes.sha1 || "El hash SHA-1 aparecerá aquí..."}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 text-sm font-medium">
              SHA-256
            </span>
            <CopyButton text={hashes.sha256} />
          </div>
          <div className="px-4 py-3 rounded-lg border border-neutral-700 bg-neutral-900/30 text-neutral-100 font-mono text-sm break-all">
            {hashes.sha256 || "El hash SHA-256 aparecerá aquí..."}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-sm font-medium">
              SHA-512
            </span>
            <CopyButton text={hashes.sha512} />
          </div>
          <div className="px-4 py-3 rounded-lg border border-neutral-700 bg-neutral-900/30 text-neutral-100 font-mono text-sm break-all">
            {hashes.sha512 || "El hash SHA-512 aparecerá aquí..."}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-neutral-800 bg-neutral-950/30 p-4">
        <h4 className="text-sm font-medium text-neutral-100 mb-2">Sobre los hashes:</h4>
        <div className="text-neutral-400 text-sm space-y-1">
          <p>• <strong>SHA-1:</strong> 160 bits, más rápido pero considerado menos seguro</p>
          <p>• <strong>SHA-256:</strong> 256 bits, balance entre velocidad y seguridad</p>
          <p>• <strong>SHA-512:</strong> 512 bits, máximo nivel de seguridad</p>
          <p>• Se usa Web Crypto API para procesamiento local y seguro</p>
        </div>
      </div>
    </ToolLayout>
  );
}

