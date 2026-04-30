import React, { useState } from "react";
import { LuLock } from "react-icons/lu";
import ToolLayout from "./shared/ToolLayout";
import InputArea from "./shared/InputArea";
import OutputArea from "./shared/OutputArea";

export default function Base64Converter() {
  const [textInput, setTextInput] = useState("");
  const [base64Input, setBase64Input] = useState("");
  const [output, setOutput] = useState("");
  const [activeMode, setActiveMode] = useState("encode"); // 'encode' or 'decode'

  const handleEncode = () => {
    if (!textInput.trim()) {
      setOutput("");
      return;
    }

    try {
      const encoded = btoa(unescape(encodeURIComponent(textInput)));
      setOutput(encoded);
      setBase64Input("");
    } catch (error) {
      setOutput("Error: No se pudo codificar el texto");
    }
  };

  const handleDecode = () => {
    if (!base64Input.trim()) {
      setOutput("");
      return;
    }

    try {
      const decoded = decodeURIComponent(escape(atob(base64Input)));
      setOutput(decoded);
      setTextInput("");
    } catch (error) {
      setOutput("Error: Base64 inválido o malformado");
    }
  };

  const handleTextChange = (value) => {
    setTextInput(value);
    setActiveMode("encode");
    if (value.trim()) {
      setBase64Input("");
      setOutput("");
    }
  };

  const handleBase64Change = (value) => {
    setBase64Input(value);
    setActiveMode("decode");
    if (value.trim()) {
      setTextInput("");
      setOutput("");
    }
  };

  const handleProcess = () => {
    if (activeMode === "encode") {
      handleEncode();
    } else {
      handleDecode();
    }
  };

  const handleTextKeyPress = (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      handleEncode();
    }
  };

  const handleBase64KeyPress = (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      handleDecode();
    }
  };

  return (
    <ToolLayout
      icon={<LuLock className="w-5 h-5 text-blue-400" />}
      title="Base64 Encoder/Decoder"
      description="Codifica y decodifica texto en Base64 de manera rápida y sencilla. Perfecto para desarrollo y debugging."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`space-y-4 ${activeMode === 'encode' ? 'ring-2 ring-green-500/20 rounded-lg p-4' : ''}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-green-700/20 border border-green-500/30">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18"/>
              </svg>
            </div>
            <h4 className="text-lg font-medium text-neutral-100">Encode</h4>
          </div>
          
          <InputArea
            label="Texto a codificar"
            value={textInput}
            onChange={handleTextChange}
            placeholder="Escribe aquí el texto que quieres codificar en Base64..."
            rows={6}
            onKeyDown={handleTextKeyPress}
          />
          
          <button
            onClick={handleEncode}
            disabled={!textInput.trim()}
            className="w-full px-4 py-2 rounded-lg border border-green-600 bg-green-600/20 text-green-300 font-medium transition-all duration-200 hover:bg-green-600/30 hover:border-green-500 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            Codificar a Base64
          </button>
        </div>

        <div className={`space-y-4 ${activeMode === 'decode' ? 'ring-2 ring-orange-500/20 rounded-lg p-4' : ''}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-700/20 border border-orange-500/30">
              <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </div>
            <h4 className="text-lg font-medium text-neutral-100">Decode</h4>
          </div>
          
          <InputArea
            label="Base64 a decodificar"
            value={base64Input}
            onChange={handleBase64Change}
            placeholder="Pega aquí el texto en Base64 que quieres decodificar..."
            rows={6}
            onKeyDown={handleBase64KeyPress}
          />
          
          <button
            onClick={handleDecode}
            disabled={!base64Input.trim()}
            className="w-full px-4 py-2 rounded-lg border border-orange-600 bg-orange-600/20 text-orange-300 font-medium transition-all duration-200 hover:bg-orange-600/30 hover:border-orange-500 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/>
            </svg>
            Decodificar Base64
          </button>
        </div>
      </div>

      {/* Result Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-neutral-300">Resultado</label>
          {activeMode === "encode" && (
            <span className="text-xs text-neutral-500">Texto codificado</span>
          )}
          {activeMode === "decode" && (
            <span className="text-xs text-neutral-500">Texto decodificado</span>
          )}
        </div>
        <OutputArea
          text={output}
          placeholder="El resultado aparecerá aquí..."
          showCopy={!!output}
          className="min-h-[120px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg border border-neutral-800 bg-neutral-950/30 p-4">
          <h4 className="text-sm font-medium text-neutral-100 mb-2">¿Qué es Base64?</h4>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Base64 es un sistema de codificación que convierte datos binarios en texto ASCII. 
            Se usa comúnmente para transmitir datos a través de medios que están diseñados para texto, 
            como email o URLs.
          </p>
        </div>
        
        <div className="rounded-lg border border-neutral-800 bg-neutral-950/30 p-4">
          <h4 className="text-sm font-medium text-neutral-100 mb-2">Casos de Uso</h4>
          <ul className="text-neutral-400 text-sm space-y-1">
            <li>• Codificación de datos para URLs</li>
            <li>• Transmisión de imágenes en JSON</li>
            <li>• Autenticación básica HTTP</li>
            <li>• Almacenamiento de datos binarios</li>
          </ul>
        </div>
      </div>

      <div className="rounded-lg border border-neutral-800 bg-neutral-950/30 p-4">
        <h4 className="text-sm font-medium text-neutral-100 mb-2">Atajos de teclado</h4>
        <div className="text-neutral-400 text-sm space-y-1">
          <div>• <kbd className="px-2 py-1 bg-neutral-800 rounded text-xs">Ctrl + Enter</kbd> - Procesar texto actual</div>
          <div>• Escribe en cualquier campo para cambiar automáticamente de modo</div>
        </div>
      </div>
    </ToolLayout>
  );
}