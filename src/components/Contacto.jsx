import React, { useState } from "react";
import { IoLogoTwitter } from "react-icons/io";
import { IoIosSend } from "react-icons/io";
import { IoLogoInstagram } from "react-icons/io5";

function Contacto() {
  const [copiedDiscord, setCopiedDiscord] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const redesSociales = [
    {
      nombre: "GitHub",
      url: "https://github.com/itzrauh",
      icono: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      ),
      color: "hover:text-gray-400",
    },
    {
      nombre: "Twitch",
      url: "https://twitch.tv/itzrauh",
      icono: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
        </svg>
      ),
      color: "hover:text-purple-400",
    },
    {
      nombre: "Twitter",
      url: "https://twitter.com/itzrauh",
      icono: (
        <IoLogoTwitter
          style={{
            width: "1.5em",
            height: "1.5em",
          }}
        />
      ),
      color: "hover:text-sky-500",
    },
    {
      nombre: "Instagram",
      url: "https://instagram.com/_itzrauh",
      icono: (
        <IoLogoInstagram
          className="hover:text-fuchsia-500"
          style={{ width: "1.5em", height: "1.5em" }}
        />
      ),
      color: "hover:text-pink-400",
    },
  ];
  const formasContacto = [
    {
      tipo: "Email",
      valor: "me@itzrauh.xyz",
      link: "mailto:me@itzrauh.xyz",
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
            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      tipo: "Discord",
      valor: "itzrauh",
      link: "https://discord.gg",
      copyToClipboard: true,
      icono: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z" />
        </svg>
      ),
    },
    {
      tipo: "Ubicación",
      valor: "España, Sevilla",
      link: "#",
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
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.nombre ||
      !formData.email ||
      !formData.asunto ||
      !formData.mensaje
    ) {
      setSubmitStatus("error");
      return;
    }

    setIsLoading(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // ivo intenta tirar esto pedazo de hijo de la gran puta

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus("success");
        setFormData({
          nombre: "",
          email: "",
          asunto: "",
          mensaje: "",
        });
      } else {
        if (response.status === 429) {
          setSubmitStatus("rate-limited");
        } else {
          setSubmitStatus("error");
        }
        console.error("Error:", data.error || "Error al enviar mensaje");
      }
    } catch (error) {
      console.error("Error:", error);
      setSubmitStatus("error");
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("me@itzrauh.xyz").then(() => {
      console.log("Email copiado al portapapeles");
    });
  };

  const handleCopyDiscord = () => {
    navigator.clipboard
      .writeText("itzrauh")
      .then(() => {
        setCopiedDiscord(true);
        setTimeout(() => {
          setCopiedDiscord(false);
        }, 2000);
      })
      .catch(() => {
        console.log("Error al copiar Discord username");
      });
  };

  return (
    <section id="contacto" className="min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-neutral-100 via-neutral-300 to-neutral-100 bg-clip-text text-transparent">
              Contacto
            </span>
          </h2>
          <div
            className="w-20 h-1 bg-gradient-to-r from-neutral-600 to-neutral-400 rounded-full mx-auto"
            style={{
              userSelect: "none",
            }}
          />
          <p className="text-neutral-400 mt-6 max-w-2xl mx-auto">
            ¿Tienes un proyecto en mente? ¡Contacta conmigo!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-neutral-200 mb-6">
                Información de Contacto
              </h3>

              <div className="space-y-4">
                {formasContacto.map((contacto, index) => (
                  <div key={index} className="group">
                    <a
                      href={contacto.link}
                      className="flex items-center gap-4 p-4 rounded-xl border border-neutral-800 bg-neutral-950/50 backdrop-blur-sm transition-all duration-200 hover:bg-neutral-900/50 hover:border-neutral-700 hover:scale-[1.02]"
                      onClick={
                        contacto.tipo === "Email"
                          ? (e) => {
                              e.preventDefault();
                              handleCopyEmail();
                            }
                          : contacto.tipo === "Discord"
                          ? (e) => {
                              e.preventDefault();
                              handleCopyDiscord();
                            }
                          : undefined
                      }
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-700 flex items-center justify-center text-neutral-300 group-hover:text-neutral-100 transition-colors">
                        {contacto.icono}
                      </div>
                      <div>
                        <div className="font-medium text-neutral-300 text-sm uppercase tracking-wider">
                          {contacto.tipo}
                        </div>
                        <div className="text-neutral-100 font-medium">
                          {contacto.valor}
                        </div>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-neutral-200 mb-6">
                Sígueme en
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {redesSociales.map((red, index) => {
                  if (red.copyToClipboard) {
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          navigator.clipboard
                            .writeText(red.username)
                            .then(() => {
                              console.log(
                                "Discord username copiado: " + red.username
                              );
                            });
                        }}
                        className={`group flex items-center gap-3 p-4 rounded-xl border border-neutral-800 bg-neutral-950/50 backdrop-blur-sm transition-all duration-200 hover:bg-neutral-900/50 hover:border-neutral-700 hover:scale-[1.02] text-neutral-400 ${red.color}`}
                      >
                        <div className="text-neutral-400 group-hover:text-current transition-colors">
                          {red.icono}
                        </div>
                        <span className="font-medium">{red.nombre}</span>
                        <svg
                          className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    );
                  }
                  return (
                    <a
                      key={index}
                      href={red.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group flex items-center gap-3 p-4 rounded-xl border border-neutral-800 bg-neutral-950/50 backdrop-blur-sm transition-all duration-200 hover:bg-neutral-900/50 hover:border-neutral-700 hover:scale-[1.02] text-neutral-400 ${red.color}`}
                    >
                      <div className="text-neutral-400 group-hover:text-current transition-colors">
                        {red.icono}
                      </div>
                      <span className="font-medium">{red.nombre}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 backdrop-blur-sm p-8">
              <h3 className="text-2xl font-semibold text-neutral-200 mb-6">
                Envíame un mensaje
              </h3>

              {submitStatus === "success" && (
                <div className="mb-6 p-4 rounded-lg bg-green-900/20 border border-green-500/20 text-green-400">
                  ✅ ¡Mensaje enviado correctamente! Te responderé pronto.
                </div>
              )}

              {submitStatus === "rate-limited" && (
                <div className="mb-6 p-4 rounded-lg bg-yellow-900/20 border border-yellow-500/20 text-yellow-400">
                  ⏱️ Demasiadas solicitudes. Por favor, espera un momento antes de intentar nuevamente.
                </div>
              )}

              {submitStatus === "error" && (
                <div className="mb-6 p-4 rounded-lg bg-red-900/20 border border-red-500/20 text-red-400">
                  ❌ Error al enviar el mensaje. Por favor, inténtalo de nuevo.
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-6 caret-white yescursor"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-neutral-700 bg-neutral-900/50 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-transparent transition-all duration-200 yescursor"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="yescursor w-full px-4 py-3 rounded-lg border border-neutral-700 bg-neutral-900/50 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-transparent transition-all duration-200"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Asunto
                  </label>
                  <input
                    type="text"
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleInputChange}
                    required
                    className="yescursor w-full px-4 py-3 rounded-lg border border-neutral-700 bg-neutral-900/50 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-transparent transition-all duration-200"
                    placeholder="Asunto del mensaje"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Mensaje
                  </label>
                  <textarea
                    rows={6}
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleInputChange}
                    required
                    className="yescursor w-full px-4 py-3 rounded-lg border border-neutral-700 bg-neutral-900/50 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Cuéntame sobre tu proyecto..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-neutral-800 bg-neutral-950/80 backdrop-blur-sm text-neutral-100 font-medium transition-all duration-200 hover:bg-neutral-900/80 hover:border-neutral-700 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span>{isLoading ? "Enviando..." : "Enviar mensaje"}</span>
                  {isLoading ? (
                    <svg
                      className="animate-spin h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="opacity-25"
                      ></circle>
                      <path
                        fill="currentColor"
                        className="opacity-75"
                        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <IoIosSend />
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default React.memo(Contacto);
