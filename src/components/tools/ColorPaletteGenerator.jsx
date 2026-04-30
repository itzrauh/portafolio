import React, { useState, useEffect } from "react";
import { LuPalette } from "react-icons/lu";

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const rgbToHex = (r, g, b) => {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
};

const rgbToHsl = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
      default:
        h = 0;
    }
  }

  return [h * 360, s * 100, l * 100];
};

const hslToRgb = (h, s, l) => {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [
    Math.round(r * 255),
    Math.round(g * 255),
    Math.round(b * 255),
  ];
};

const generatePalette = (baseColor, type) => {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return [];

  const [h, s, l] = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const colors = [];

  switch (type) {
    case "complementary":
      colors.push(baseColor);
      const compHue = (h + 180) % 360;
      const compRgb = hslToRgb(compHue, s, l);
      colors.push(rgbToHex(compRgb[0], compRgb[1], compRgb[2]));
      break;

    case "triadic":
      colors.push(baseColor);
      for (let i = 1; i < 3; i++) {
        const triHue = (h + i * 120) % 360;
        const triRgb = hslToRgb(triHue, s, l);
        colors.push(rgbToHex(triRgb[0], triRgb[1], triRgb[2]));
      }
      break;

    case "analogous":
      for (let i = -2; i <= 2; i++) {
        const anHue = (h + i * 30 + 360) % 360;
        const anRgb = hslToRgb(anHue, s, l);
        colors.push(rgbToHex(anRgb[0], anRgb[1], anRgb[2]));
      }
      break;

    case "monochromatic":
      for (let i = -2; i <= 2; i++) {
        const newL = Math.max(0, Math.min(100, l + i * 15));
        const monoRgb = hslToRgb(h, s, newL);
        colors.push(rgbToHex(monoRgb[0], monoRgb[1], monoRgb[2]));
      }
      break;

    case "splitComplementary":
      colors.push(baseColor);
      const split1Hue = (h + 150) % 360;
      const split2Hue = (h + 210) % 360;
      const split1Rgb = hslToRgb(split1Hue, s, l);
      const split2Rgb = hslToRgb(split2Hue, s, l);
      colors.push(rgbToHex(split1Rgb[0], split1Rgb[1], split1Rgb[2]));
      colors.push(rgbToHex(split2Rgb[0], split2Rgb[1], split2Rgb[2]));
      break;

    default:
      colors.push(baseColor);
  }

  return colors;

  // función generada por claude, no tengo ni puta idea de paletas de colores.
};

export default function ColorPaletteGenerator() {
  const [baseColor, setBaseColor] = useState("#6366f1");
  const [paletteType, setPaletteType] = useState("complementary");
  const [palette, setPalette] = useState([]);
  const [copiedColor, setCopiedColor] = useState(null);

  useEffect(() => {
    const generatedPalette = generatePalette(baseColor, paletteType);
    setPalette(generatedPalette);
  }, [baseColor, paletteType]);

  const copyColor = async (color) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedColor(color);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      const textarea = document.createElement("textarea");
      textarea.value = color;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiedColor(color);
      setTimeout(() => setCopiedColor(null), 2000);
    }
  };

  const exportCss = () => {
    const cssVars = palette
      .map((color, index) => `  --color-${index + 1}: ${color};`)
      .join("\n");

    return `:root {\n${cssVars}\n}`;
  };

  const exportJson = () => {
    return JSON.stringify(
      palette.map((color, index) => ({
        name: `Color ${index + 1}`,
        hex: color,
        rgb: hexToRgb(color),
      })),
      null,
      2
    );
  };

  const copyExport = async (format) => {
    const exportData =
      format === "css" ? exportCss() : exportJson();
    try {
      await navigator.clipboard.writeText(exportData);
      setCopiedColor("export");
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      const textarea = document.createElement("textarea");
      textarea.value = exportData;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiedColor("export");
      setTimeout(() => setCopiedColor(null), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pt-10 px-6">
      <div className="space-y-6">
        <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 backdrop-blur-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500/20 to-rose-600/20 border border-pink-500/30">
              <LuPalette className="w-5 h-5 text-pink-400" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-100">Configuración</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Color Base:
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="w-20 h-12 rounded-lg border border-neutral-700 cursor-pointer"
                />
                <input
                  type="text"
                  value={baseColor}
                  onChange={(e) => {
                    if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                      setBaseColor(e.target.value);
                    }
                  }}
                  className="flex-1 px-4 py-2 rounded-lg border border-neutral-700 bg-neutral-900/50 text-neutral-100 font-mono focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  placeholder="#6366f1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Tipo de Paleta:
              </label>
              <select
                value={paletteType}
                onChange={(e) => setPaletteType(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-neutral-700 bg-neutral-900/50 text-neutral-100 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              >
                <option value="complementary">Complementario</option>
                <option value="triadic">Triádico</option>
                <option value="analogous">Análogo</option>
                <option value="monochromatic">Monocromático</option>
                <option value="splitComplementary">Complementario Dividido</option>
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 backdrop-blur-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-neutral-100">Paleta de Colores</h3>
            <div className="flex gap-2">
              <button
                onClick={() => copyExport("css")}
                className="px-3 py-1 text-sm rounded-lg border border-neutral-700 bg-neutral-900/50 text-neutral-300 font-medium transition-all duration-200 hover:bg-neutral-800/50 hover:border-neutral-600"
              >
                {copiedColor === "export" ? "Copiado" : "Copiar CSS"}
              </button>
              <button
                onClick={() => copyExport("json")}
                className="px-3 py-1 text-sm rounded-lg border border-neutral-700 bg-neutral-900/50 text-neutral-300 font-medium transition-all duration-200 hover:bg-neutral-800/50 hover:border-neutral-600"
              >
                Copiar JSON
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {palette.map((color, index) => {
              const rgb = hexToRgb(color);
              return (
                <div
                  key={index}
                  className="group rounded-lg overflow-hidden border border-neutral-700 hover:border-neutral-600 transition-all cursor-pointer"
                  onClick={() => copyColor(color)}
                >
                  <div
                    className="h-32 w-full"
                    style={{ backgroundColor: color }}
                  ></div>
                  <div className="p-3 bg-neutral-900/50">
                    <div className="font-mono text-sm text-neutral-100 mb-1">
                      {color.toUpperCase()}
                    </div>
                    {rgb && (
                      <div className="text-xs text-neutral-400">
                        RGB({rgb.r}, {rgb.g}, {rgb.b})
                      </div>
                    )}
                    {copiedColor === color && (
                      <div className="text-xs text-green-400 mt-1">✓ Copiado</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 backdrop-blur-sm p-6">
          <h3 className="text-xl font-semibold text-neutral-100 mb-4">Vista Previa</h3>
          <div className="space-y-4">
            <div className="p-6 rounded-lg" style={{ backgroundColor: palette[0] || "#000" }}>
              <h4 className="text-2xl font-bold mb-2" style={{ color: palette[1] || "#fff" }}>
                Título Principal
              </h4>
              <p style={{ color: palette[2] || "#fff" }}>
                Este es un ejemplo de cómo se vería tu paleta de colores aplicada a un diseño.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

