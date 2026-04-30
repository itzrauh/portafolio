import React, { useState } from "react";
import { IoDocumentTextOutline } from "react-icons/io5";
import { LuLock } from "react-icons/lu";
import { VscJson } from "react-icons/vsc";
import { LuKeyRound } from "react-icons/lu";
import { LuPalette } from "react-icons/lu";

const tools = [
  {
    name: "Base64 Encoder/Decoder",
    description: "Codifica y decodifica texto en Base64 de manera rápida y sencilla.",
    tags: ["Encoding", "Security"],
    category: "security",
    disponible: true,
    url: "/tools/base64-react",
    icon: <LuLock className="w-6 h-6" />,
    iconColor: "from-blue-500/20 to-blue-700/20 border-blue-500/30 text-blue-400",
    statusColor: "bg-green-500/20 text-green-400 border border-green-500/30",
    statusText: "Disponible",
  },
  {
    name: "Fancy Text Formatter",
    description: "Convierte texto normal a letras especiales: texto → ᴛᴇxᴛᴏ, ᵗᵉˣᵗᵒ, 𝕥𝕖𝕩𝕥𝕠, etc.",
    tags: ["Typography", "Unicode"],
    category: "text",
    disponible: true,
    url: "/tools/textformatter",
    icon: <IoDocumentTextOutline className="w-6 h-6" />,
    iconColor: "from-green-600/20 to-emerald-600/20 border-green-500/30 text-green-400",
    statusColor: "bg-green-500/20 text-green-400 border border-green-500/30",
    statusText: "Disponible",
  },
  {
    name: "JSON Formatter",
    description: "Formatea y valida JSON con highlighting de sintaxis.",
    tags: ["Formatting", "JSON"],
    category: "dev",
    disponible: true,
    url: "/tools/json",
    icon: <VscJson className="w-6 h-6" />,
    iconColor: "from-yellow-500/20 to-yellow-700/20 border-yellow-500/30 text-yellow-400",
    statusColor: "bg-green-500/20 text-green-400 border border-green-500/30",
    statusText: "Disponible",
  },
  {
    name: "Hash Generator",
    description: "Genera hashes SHA1, SHA256 y SHA512 para texto o archivos.",
    tags: ["Security", "Hashing"],
    category: "security",
    disponible: true,
    url: "/tools/hash",
    icon: <LuKeyRound className="w-6 h-6" />,
    iconColor: "from-purple-500/20 to-purple-700/20 border-purple-500/30 text-purple-400",
    statusColor: "bg-green-500/20 text-green-400 border border-green-500/30",
    statusText: "Disponible",
  },
  {
    name: "Color Palette Generator",
    description: "Genera paletas de colores harmoniosas para tus proyectos.",
    tags: ["Design", "Colors"],
    category: "design",
    disponible: true,
    url: "/tools/palette",
    icon: <LuPalette className="w-6 h-6" />,
    iconColor: "from-pink-500/20 to-rose-600/20 border-pink-500/30 text-pink-400",
    statusColor: "bg-green-500/20 text-green-400 border border-green-500/30",
    statusText: "Disponible",
  },
];

const categories = [
  { id: "all", name: "Todas", icon: "🔧" },
  { id: "text", name: "Texto", icon: "📝" },
  { id: "security", name: "Seguridad", icon: "🔒" },
  { id: "design", name: "Diseño", icon: "🎨" },
  { id: "dev", name: "Dev", icon: "⚙️" },
];

function Tools() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTools = tools.filter((tool) => {
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
    const matchesSearch = searchTerm === "" || 
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch && tool.disponible;
  });

  return (
    <main className="pt-20 px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-neutral-100 via-neutral-300 to-neutral-100 bg-clip-text text-transparent">
              Herramientas
            </span>
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-neutral-600 to-neutral-400 rounded-full mx-auto" />
          <p className="text-neutral-400 mt-6 max-w-2xl mx-auto">
            Una colección de herramientas útiles para desarrolladores y gamers.
          </p>
        </div>

        <div className="mb-12 space-y-6">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar herramientas por nombre, descripción o tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-12 py-4 rounded-xl border border-neutral-800 bg-neutral-950/50 backdrop-blur-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full border font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? "border-blue-500 bg-blue-500/20 text-blue-300 scale-105"
                    : "border-neutral-700 bg-neutral-900/50 text-neutral-300 hover:bg-neutral-800/50 hover:border-neutral-600"
                }`}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>
          <div className="text-center">
            <p className="text-neutral-400 text-sm">
              {filteredTools.length === 0 
                ? "No se encontraron herramientas" 
                : `${filteredTools.length} herramienta${filteredTools.length !== 1 ? 's' : ''} encontrada${filteredTools.length !== 1 ? 's' : ''}`
              }
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool, i) => (
            <div key={i} className="group">
              <div
                className={`rounded-xl border border-neutral-800 bg-neutral-950/50 backdrop-blur-sm p-6 h-full transition-all duration-200 hover:bg-neutral-900/50 hover:border-neutral-700 hover:scale-105`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-lg bg-gradient-to-br ${
                      tool.iconColor
                    } border ${tool.iconColor.split(" ")[2]}`}
                  >
                    {tool.icon}
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${tool.statusColor}`}
                  >
                    {tool.statusText}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-neutral-100 mb-2">
                  {tool.name}
                </h3>

                <p className="text-neutral-400 mb-4 leading-relaxed">
                  {tool.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {tool.tags.map((tag, j) => (
                    <span
                      key={j}
                      className="text-xs px-2 py-1 rounded-full bg-neutral-800/50 text-neutral-300 border border-neutral-700/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {tool.disponible ? (
                  <a
                    href={tool.url}
                    className="block w-full px-4 py-2 rounded-lg border border-neutral-700 bg-neutral-900/50 text-neutral-200 font-medium text-center transition-all duration-200 hover:bg-neutral-800/50 hover:border-neutral-600 group-hover:scale-105 no-underline"
                  >
                    Usar Herramienta
                    <svg
                      className="w-4 h-4 inline-block ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </a>
                ) : (
                  <button
                    disabled
                    className="w-full px-4 py-2 rounded-lg border border-neutral-800 bg-neutral-950/50 text-neutral-500 font-medium cursor-not-allowed"
                  >
                    Próximamente
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        {filteredTools.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-neutral-100 mb-2">
              No se encontraron herramientas
            </h3>
            <p className="text-neutral-400">
              Intenta ajustar tu búsqueda o seleccionar otra categoría.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default React.memo(Tools);
