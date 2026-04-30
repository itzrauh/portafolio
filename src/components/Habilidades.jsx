import React from "react";
import { FaPaperPlane } from "react-icons/fa";
import { SiAstro } from "react-icons/si";
import { IoLogoElectron } from "react-icons/io5";
import { TbBrandMinecraft } from "react-icons/tb";
import { FaNodeJs } from "react-icons/fa";
import { SiIntellijidea } from "react-icons/si";
import { FaGitAlt } from "react-icons/fa";
import { BiLogoVisualStudio } from "react-icons/bi";
import { SiGradle } from "react-icons/si";
import { FaDiscord } from "react-icons/fa";
import { SiObsstudio } from "react-icons/si";

function Habilidades() {
  const habilidades = [
    {
      categoria: "Backend & Core",
      icono: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
          />
        </svg>
      ),
      tecnologias: [
        {
          nombre: "Java",
          nivel: 95,
          color: "from-orange-500 to-red-600",
          icono: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.851 18.56s-.917.534.653.714c1.902.218 2.874.187 4.969-.211 0 0 .552.346 1.321.646-4.699 2.013-10.633-.118-6.943-1.149M8.276 15.933s-1.028.761.542.924c2.032.209 3.636.227 6.413-.308 0 0 .384.389.987.602-5.679 1.661-12.007.13-7.942-1.218M13.116 11.475c1.158 1.333-.304 2.533-.304 2.533s2.939-1.518 1.589-3.418c-1.261-1.772-2.228-2.652 3.007-5.688 0-.001-8.216 2.051-4.292 6.573M19.33 20.504s.679.559-.747.991c-2.712.822-11.288 1.069-13.669.033-.856-.373.75-.89 1.254-.998.527-.114.828-.93.828-.93-.953.671-6.156 1.317-2.643 1.887 9.58 1.553 17.462-.7 14.977-1.983M9.292 13.21s-4.362 1.036-1.544 1.412c1.189.159 3.561.123 5.77-.062 1.806-.152 3.618-.477 3.618-.477s-.637.272-1.098.587c-4.429 1.165-12.986.623-10.522-.568 2.082-1.006 3.776-.892 3.776-.892M17.116 17.584c4.503-2.34 2.421-4.589.968-4.285-.355.074-.515.138-.515.138s.132-.207.385-.297c2.875-1.011 5.086 2.981-.928 4.562 0-.001.07-.062.09-.118M14.401 0s2.494 2.494-2.365 6.33c-3.896 3.077-.888 4.832-.001 6.836-2.274-2.053-3.943-3.858-2.824-5.539 1.644-2.469 6.197-3.665 5.19-7.627M9.734 23.924c4.322.277 10.959-.153 11.116-2.198 0 0-.302.775-3.572 1.391-3.688.694-8.239.613-10.937.168 0-.001.553.457 3.393.639" />
            </svg>
          ),
        },
        {
          nombre: "JavaScript",
          nivel: 90,
          color: "from-yellow-400 to-yellow-600",
          icono: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z" />
            </svg>
          ),
        },
        {
          nombre: "Minecraft Plugins (Paper)",
          nivel: 85,
          color: "from-emerald-500 to-emerald-700",
          icono: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-send"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M10 14l11 -11" />
              <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
            </svg>
          ),
        },
        {
          nombre: "Node.js",
          nivel: 80,
          color: "from-green-500 to-green-700",
          icono: <FaNodeJs />,
        },
        {
          nombre: "Launcher Development",
          nivel: 85,
          color: "from-blue-500 to-blue-700",
          icono: <TbBrandMinecraft />,
        },
      ],
    },
    {
      categoria: "Frontend",
      icono: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      tecnologias: [
        {
          nombre: "React",
          nivel: 85,
          color: "from-blue-400 to-blue-600",
          icono: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.66.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.384-.465-.764-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z" />
            </svg>
          ),
        },
        {
          nombre: "HTML/CSS",
          nivel: 90,
          color: "from-orange-400 to-red-500",
          icono: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z" />
            </svg>
          ),
        },
        {
          nombre: "Tailwind CSS",
          nivel: 88,
          color: "from-cyan-400 to-cyan-600",
          icono: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" />
            </svg>
          ),
        },
        {
          nombre: "Electron",
          nivel: 75,
          color: "from-purple-500 to-blue-600",
          icono: <IoLogoElectron />,
        },
        {
          nombre: "Astro",
          nivel: 80,
          color: "from-orange-400 to-red-600",
          icono: <SiAstro />,
        },
        {
          nombre: "TypeScript",
          nivel: 70,
          color: "from-blue-600 to-blue-800",
          icono: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" />
            </svg>
          ),
        },
      ],
    },
    {
      categoria: "Herramientas",
      icono: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      tecnologias: [
        {
          nombre: "IntelliJ IDEA",
          nivel: 95,
          color: "from-purple-500 to-purple-700",
          icono: <SiIntellijidea />,
        },
        {
          nombre: "Git",
          nivel: 90,
          color: "from-orange-500 to-red-600",
          icono: <FaGitAlt />,
        },
        {
          nombre: "VS Code",
          nivel: 85,
          color: "from-blue-500 to-blue-700",
          icono: <BiLogoVisualStudio />,
        },
        {
          nombre: "Maven/Gradle",
          nivel: 80,
          color: "from-green-600 to-green-800",
          icono: <SiGradle />,
        },
        {
          nombre: "discord.js",
          nivel: 75,
          color: "from-indigo-500 to-purple-600",
          icono: <FaDiscord />,
        },
        {
          nombre: "OBS Studio",
          nivel: 70,
          color: "from-gray-600 to-gray-800",
          icono: <SiObsstudio />,
        },
      ],
    },
  ];

  const softSkills = [
    "Resolución de problemas",
    "Trabajo en equipo",
    "Comunicación efectiva",
    "Aprendizaje rápido",
    "Gestión del tiempo",
    "Creatividad",
    "Adaptabilidad",
    "Liderazgo",
  ];

  return (
    <section id="habilidades" className="min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-neutral-100 via-neutral-300 to-neutral-100 bg-clip-text text-transparent">
              Habilidades & Tecnologías
            </span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-neutral-600 to-neutral-400 rounded-full mx-auto no-cursor" />
          <p className="text-neutral-400 mt-6 max-w-2xl mx-auto">
            Las herramientas y tecnologías que domino para crear experiencias
            digitales excepcionales.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {habilidades.map((categoria, index) => (
            <div key={index} className="group">
              <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 backdrop-blur-sm p-6 h-full transition-all duration-200 hover:bg-neutral-900/50 hover:border-neutral-700">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-neutral-400">{categoria.icono}</span>
                  <h3 className="text-xl font-semibold text-neutral-200">
                    {categoria.categoria}
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {categoria.tecnologias.map((tech, techIndex) => (
                    <div key={techIndex} className="group/item">
                      <div className="rounded-lg relative p-3 transition-all duration-200 hover:scale-105 hover:shadow-lg border border-neutral-700/30 overflow-hidden">
                        <div
                          className={`absolute inset-0 bg-gradient-to-r ${tech.color} opacity-70`}
                        ></div>
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="relative flex items-center gap-3 z-10">
                          {tech.icono && (
                            <span className="text-white text-lg drop-shadow-sm">
                              {typeof tech.icono === "string"
                                ? tech.icono
                                : tech.icono}
                            </span>
                          )}
                          <span className="text-white font-medium drop-shadow-sm">
                            {tech.nombre}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-semibold text-neutral-200 mb-8">
            Habilidades Interpersonales
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {softSkills.map((skill, index) => (
              <div
                key={index}
                className="group relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className="rounded-lg border border-neutral-800 bg-neutral-950/30 backdrop-blur-sm px-4 py-3 transition-all duration-200 hover:bg-neutral-900/50 hover:border-neutral-700 hover:scale-105"
                  style={{ userSelect: "none" }}
                >
                  <span className="text-sm text-neutral-300 font-medium">
                    {skill}
                  </span>
                </div>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-neutral-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
          <div className="text-center group">
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 backdrop-blur-sm p-6 transition-all duration-200 hover:bg-neutral-900/50 hover:border-neutral-700">
              <div className="text-3xl font-bold bg-gradient-to-br from-neutral-100 to-neutral-400 bg-clip-text text-transparent mb-2">
                ~2
              </div>
              <div className="text-sm text-neutral-500 uppercase tracking-wider">
                Años programando
              </div>
            </div>
          </div>

          <div className="text-center group">
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 backdrop-blur-sm p-6 transition-all duration-200 hover:bg-neutral-900/50 hover:border-neutral-700">
              <div className="text-3xl font-bold bg-gradient-to-br from-neutral-100 to-neutral-400 bg-clip-text text-transparent mb-2">
                10+
              </div>
              <div className="text-sm text-neutral-500 uppercase tracking-wider">
                Proyectos
              </div>
            </div>
          </div>

          <div className="text-center group">
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 backdrop-blur-sm p-6 transition-all duration-200 hover:bg-neutral-900/50 hover:border-neutral-700">
              <div className="text-3xl font-bold bg-gradient-to-br from-neutral-100 to-neutral-400 bg-clip-text text-transparent mb-2">
                5+
              </div>
              <div className="text-sm text-neutral-500 uppercase tracking-wider">
                Plugins
              </div>
            </div>
          </div>

          <div className="text-center group">
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 backdrop-blur-sm p-6 transition-all duration-200 hover:bg-neutral-900/50 hover:border-neutral-700">
              <div className="text-3xl font-bold bg-gradient-to-br from-neutral-100 to-neutral-400 bg-clip-text text-transparent mb-2">
                ∞
              </div>
              <div className="text-sm text-neutral-500 uppercase tracking-wider">
                Gaming
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default React.memo(Habilidades);
