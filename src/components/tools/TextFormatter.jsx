import React, { useState, useEffect } from "react";
import { IoDocumentTextOutline } from "react-icons/io5";
import ToolLayout from "./shared/ToolLayout";
import InputArea from "./shared/InputArea";
import OutputArea from "./shared/OutputArea";

export default function TextFormatter() {
  const [input, setInput] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("smallcaps");
  const [copied, setCopied] = useState(false);

  const styles = {
    smallcaps: {
      name: "Small Caps",
      preview: "sᴍᴀʟʟ ᴄᴀᴘs",
      map: {
        a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ꜰ", g: "ɢ", h: "ʜ",
        i: "ɪ", j: "ᴊ", k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ", o: "ᴏ", p: "ᴘ",
        q: "ǫ", r: "ʀ", s: "s", t: "ᴛ", u: "ᴜ", v: "ᴠ", w: "ᴡ", x: "x",
        y: "ʏ", z: "ᴢ"
      }
    },
    superscript: {
      name: "Superíndice",
      preview: "ˢᵘᵖᵉʳˢᶜʳᶦᵖᵗ",
      map: {
        a: "ᵃ", b: "ᵇ", c: "ᶜ", d: "ᵈ", e: "ᵉ", f: "ᶠ", g: "ᵍ", h: "ʰ",
        i: "ⁱ", j: "ʲ", k: "ᵏ", l: "ˡ", m: "ᵐ", n: "ⁿ", o: "ᵒ", p: "ᵖ",
        q: "ᵠ", r: "ʳ", s: "ˢ", t: "ᵗ", u: "ᵘ", v: "ᵛ", w: "ʷ", x: "ˣ",
        y: "ʸ", z: "ᶻ"
      }
    },
    italic: {
      name: "Cursiva",
      preview: "𝒾𝓉𝒶𝓁𝒾𝒸",
      map: {
        a: "𝒶", b: "𝒷", c: "𝒸", d: "𝒹", e: "𝓮", f: "𝒻", g: "𝓰", h: "𝒽",
        i: "𝒾", j: "𝓏", k: "𝓀", l: "𝓁", m: "𝓂", n: "𝓃", o: "𝑜", p: "𝓅",
        q: "𝓆", r: "𝓇", s: "𝓈", t: "𝓉", u: "𝓊", v: "𝓋", w: "𝓌", x: "𝓍",
        y: "𝓎", z: "𝓏"
      }
    },
    monospace: {
      name: "Monospace",
      preview: "𝚖𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎",
      map: {
        a: "𝚊", b: "𝚋", c: "𝚌", d: "𝚍", e: "𝚎", f: "𝚏", g: "𝚐", h: "𝚑",
        i: "𝚒", j: "𝚓", k: "𝚔", l: "𝚕", m: "𝚖", n: "𝚗", o: "𝚘", p: "𝚙",
        q: "𝚚", r: "𝚛", s: "𝚜", t: "𝚝", u: "𝚞", v: "𝚟", w: "𝚠", x: "𝚡",
        y: "𝚢", z: "𝚣"
      }
    },
    bold: {
      name: "Negrita",
      preview: "𝐛𝐨𝐥𝐝",
      map: {
        a: "𝐚", b: "𝐛", c: "𝐜", d: "𝐝", e: "𝐞", f: "𝐟", g: "𝐠", h: "𝐡",
        i: "𝐢", j: "𝐣", k: "𝐤", l: "𝐥", m: "𝐦", n: "𝐧", o: "𝐨", p: "𝐩",
        q: "𝐪", r: "𝐫", s: "𝐬", t: "𝐭", u: "𝐮", v: "𝐯", w: "𝐰", x: "𝐱",
        y: "𝐲", z: "𝐳"
      }
    },
    strikethrough: {
      name: "Tachado",
      preview: "s̶t̶r̶i̶k̶e̶t̶h̶r̶o̶u̶g̶h̶",
      map: {
        a: "a̶", b: "b̶", c: "c̶", d: "d̶", e: "e̶", f: "f̶", g: "g̶", h: "h̶",
        i: "i̶", j: "j̶", k: "k̶", l: "l̶", m: "m̶", n: "n̶", o: "o̶", p: "p̶",
        q: "q̶", r: "r̶", s: "s̶", t: "t̶", u: "u̶", v: "v̶", w: "w̶", x: "x̶",
        y: "y̶", z: "z̶"
      }
    },
    underline: {
      name: "Subrayado Doble",
      preview: "u̳n̳d̳e̳r̳l̳i̳n̳e̳",
      map: {
        a: "a̳", b: "b̳", c: "c̳", d: "d̳", e: "e̳", f: "f̳", g: "g̳", h: "h̳",
        i: "i̳", j: "j̳", k: "k̳", l: "l̳", m: "m̳", n: "n̳", o: "o̳", p: "p̳",
        q: "q̳", r: "r̳", s: "s̳", t: "t̳", u: "u̳", v: "v̳", w: "w̳", x: "x̳",
        y: "y̳", z: "z̳"
      }
    },
    bubble: {
      name: "Bubble",
      preview: "Ⓑⓤⓑⓑⓛⓔ",
      map: {
        a: "ⓐ", b: "ⓑ", c: "ⓒ", d: "ⓓ", e: "ⓔ", f: "ⓕ", g: "ⓖ", h: "ⓗ",
        i: "ⓘ", j: "ⓙ", k: "ⓚ", l: "ⓛ", m: "ⓜ", n: "ⓝ", o: "ⓞ", p: "ⓟ",
        q: "ⓠ", r: "ⓡ", s: "ⓢ", t: "ⓣ", u: "ⓤ", v: "ⓥ", w: "ⓦ", x: "ⓧ",
        y: "ⓨ", z: "ⓩ"
      }
    }
  };

  //hecho medio a ciegas, el webstorm en linux y los unicodes no se llevan muy bien JAJAJAAJ

  const [output, setOutput] = useState("");
  
  useEffect(() => {
    if (!input) {
      setOutput("");
      return;
    }
    
    if (selectedStyle === 'uppercase' || selectedStyle === 'lowercase' || selectedStyle === 'capitalize') {
      let result = "";
      switch (selectedStyle) {
        case 'uppercase':
          result = input.toUpperCase();
          break;
        case 'lowercase':
          result = input.toLowerCase();
          break;
        case 'capitalize':
          result = input.replace(/\b\w/g, (c) => c.toUpperCase());
          break;
      }
      setOutput(result);
      return;
    }
    
    const style = styles[selectedStyle];
    if (style) {
      const formatted = input
        .split("")
        .map((ch) => {
          const lower = ch.toLowerCase();
          return style.map[lower] || ch;
        })
        .join("");
      setOutput(formatted);
    }
  }, [input, selectedStyle]);

  return (
    <ToolLayout
      icon={<IoDocumentTextOutline className="w-5 h-5 text-green-400" />}
      title="Fancy Text Formatter"
      description="Convierte texto normal a estilos Unicode especiales. Vista previa en tiempo real."
    >
      <InputArea
        label="Texto de entrada"
        value={input}
        onChange={setInput}
        placeholder="Escribe tu texto aquí para verlo transformado en tiempo real..."
        rows={4}
      />

      <div className="space-y-3">
        <label className="block text-sm font-medium text-neutral-300">Estilo</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {/* Basic styles */}
          <button
            onClick={() => setSelectedStyle('uppercase')}
            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
              selectedStyle === 'uppercase'
                ? 'border-green-500 bg-green-500/20 text-green-300'
                : 'border-neutral-700 bg-neutral-900/50 text-neutral-300 hover:bg-neutral-800/50'
            }`}
          >
            MAYÚSCULAS
          </button>
          
          <button
            onClick={() => setSelectedStyle('lowercase')}
            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
              selectedStyle === 'lowercase'
                ? 'border-green-500 bg-green-500/20 text-green-300'
                : 'border-neutral-700 bg-neutral-900/50 text-neutral-300 hover:bg-neutral-800/50'
            }`}
          >
            minúsculas
          </button>
          
          <button
            onClick={() => setSelectedStyle('capitalize')}
            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
              selectedStyle === 'capitalize'
                ? 'border-green-500 bg-green-500/20 text-green-300'
                : 'border-neutral-700 bg-neutral-900/50 text-neutral-300 hover:bg-neutral-800/50'
            }`}
          >
            Capitalizado
          </button>

          {Object.entries(styles).map(([key, style]) => (
            <button
              key={key}
              onClick={() => setSelectedStyle(key)}
              className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                selectedStyle === key
                  ? 'border-green-500 bg-green-500/20 text-green-300'
                  : 'border-neutral-700 bg-neutral-900/50 text-neutral-300 hover:bg-neutral-800/50'
              }`}
            >
              {style.preview}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-neutral-300">Resultado</label>
        <OutputArea
          text={output}
          placeholder="El texto formateado aparecerá aquí..."
          showCopy={!!output}
        />
      </div>

      <div className="rounded-lg border border-neutral-800 bg-neutral-950/30 p-4">
        <h4 className="text-sm font-medium text-neutral-300 mb-3">Ejemplos de estilos:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div className="text-neutral-400">
            <span className="text-neutral-500">Original:</span> Hola Mundo
          </div>
          <div className="text-neutral-400">
            <span className="text-neutral-500">Small Caps:</span> ʜᴏʟᴀ ᴍᴜɴᴅᴏ
          </div>
          <div className="text-neutral-400">
            <span className="text-neutral-500">Cursiva:</span> 𝒽𝑜𝓁𝒶 𝓂𝓊𝓃𝒹𝑜
          </div>
          <div className="text-neutral-400">
            <span className="text-neutral-500">Monospace:</span> 𝚑𝚘𝚕𝚊 𝚖𝚞𝚗𝚍𝚘
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}