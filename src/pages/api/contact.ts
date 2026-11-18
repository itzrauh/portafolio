import type { APIRoute } from "astro";

export const prerender = false;
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60000;

function cleanIP(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const ip = value.split(",")[0].trim();
  if (!ip || ip === "unknown") return undefined;
  return ip;
}

function isLocalIP(ip: string): boolean {
  return (
    ip === "unknown" ||
    ip === "::1" ||
    ip === "127.0.0.1" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ip)
  );
}

function getClientIP(request: Request, clientAddress?: string): string {
  return (
    cleanIP(request.headers.get("x-forwarded-for")) ||
    cleanIP(request.headers.get("x-vercel-forwarded-for")) ||
    cleanIP(request.headers.get("x-real-ip")) ||
    cleanIP(clientAddress) ||
    "unknown"
  );
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const lastRequest = rateLimitMap.get(ip);

  if (lastRequest) {
    const timeSinceLastRequest = now - lastRequest;
    
    if (timeSinceLastRequest < RATE_LIMIT_WINDOW) {
      const retryAfter = Math.ceil((RATE_LIMIT_WINDOW - timeSinceLastRequest) / 1000);
      return { allowed: false, retryAfter };
    }
  }

  rateLimitMap.set(ip, now);

  if (rateLimitMap.size > 1000) {
    const oneHourAgo = now - 3600000;
    for (const [key, timestamp] of rateLimitMap.entries()) {
      if (timestamp < oneHourAgo) {
        rateLimitMap.delete(key);
      }
    }
  }

  return { allowed: true };
}

type ClientMeta = {
  userAgent?: string;
  language?: string;
  languages?: string[];
  timezone?: string;
  timezoneOffset?: number;
  platform?: string;
  screen?: string;
  referrer?: string;
  path?: string;
  geo?: { lat: number; lon: number; accuracy?: number } | null;
  elapsedMs?: number;
};

function asText(value: unknown, max = 200): string | undefined {
  if (typeof value !== "string") return undefined;
  const text = value.trim();
  return text ? text.slice(0, max) : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function parseMeta(value: unknown): ClientMeta {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const raw = value as Record<string, unknown>;
  const rawGeo =
    raw.geo && typeof raw.geo === "object" && !Array.isArray(raw.geo)
      ? (raw.geo as Record<string, unknown>)
      : null;
  const lat = asNumber(rawGeo?.lat);
  const lon = asNumber(rawGeo?.lon);

  return {
    userAgent: asText(raw.userAgent, 300),
    language: asText(raw.language, 40),
    languages: Array.isArray(raw.languages)
      ? raw.languages
          .filter((item): item is string => typeof item === "string")
          .slice(0, 5)
          .map((item) => item.slice(0, 40))
      : [],
    timezone: asText(raw.timezone, 80),
    timezoneOffset: asNumber(raw.timezoneOffset),
    platform: asText(raw.platform, 80),
    screen: asText(raw.screen, 40),
    referrer: asText(raw.referrer, 300),
    path: asText(raw.path, 200),
    geo:
      lat !== undefined &&
      lon !== undefined &&
      Math.abs(lat) <= 90 &&
      Math.abs(lon) <= 180
        ? { lat, lon, accuracy: asNumber(rawGeo?.accuracy) }
        : null,
    elapsedMs: asNumber(raw.elapsedMs),
  };
}

function headerNumber(value: string | null): number | undefined {
  if (!value) return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function safeDecode(value: string | null): string | undefined {
  if (!value) return undefined;
  try {
    return decodeURIComponent(value).slice(0, 100);
  } catch {
    return value.slice(0, 100);
  }
}

function getServerGeo(request: Request) {
  return {
    country:
      request.headers.get("x-vercel-ip-country") ||
      request.headers.get("cf-ipcountry") ||
      undefined,
    region: safeDecode(request.headers.get("x-vercel-ip-country-region")),
    city: safeDecode(request.headers.get("x-vercel-ip-city")),
    timezone: safeDecode(request.headers.get("x-vercel-ip-timezone")),
    lat: headerNumber(request.headers.get("x-vercel-ip-latitude")),
    lon: headerNumber(request.headers.get("x-vercel-ip-longitude")),
  };
}

type Geo = ReturnType<typeof getServerGeo>;

async function resolveGeo(request: Request, ip: string): Promise<Geo> {
  const fromHeaders = getServerGeo(request);
  if (fromHeaders.country || isLocalIP(ip)) return fromHeaders;

  try {
    const response = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
      signal: AbortSignal.timeout(2500),
    });
    if (!response.ok) return fromHeaders;

    const data = await response.json();
    if (data.success === false) return fromHeaders;

    return {
      country: asText(data.country, 100) || fromHeaders.country,
      region: asText(data.region, 100) || fromHeaders.region,
      city: asText(data.city, 100) || fromHeaders.city,
      timezone: asText(data.timezone?.id, 100) || fromHeaders.timezone,
      lat: asNumber(data.latitude) ?? fromHeaders.lat,
      lon: asNumber(data.longitude) ?? fromHeaders.lon,
    };
  } catch {
    return fromHeaders;
  }
}

function field(name: string, value: string | undefined, inline = false) {
  const text = typeof value === "string" ? value.trim() : "";
  return {
    name,
    value: text ? text.slice(0, 1024) : "—",
    inline,
  };
}

function formatOffset(minutes: number): string {
  const sign = minutes > 0 ? "-" : "+";
  const absolute = Math.abs(minutes);
  const hours = String(Math.floor(absolute / 60)).padStart(2, "0");
  const mins = String(absolute % 60).padStart(2, "0");
  return `UTC${sign}${hours}:${mins}`;
}

function describeUserAgent(ua: string | undefined): string | undefined {
  if (!ua) return undefined;
  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /OPR\//.test(ua)
      ? "Opera"
      : /Firefox\//.test(ua)
        ? "Firefox"
        : /Chrome\//.test(ua)
          ? "Chrome"
          : /Safari\//.test(ua)
            ? "Safari"
            : /curl|python|postman|scrapy|bot|spider/i.test(ua)
              ? "Posible bot"
              : "Desconocido";
  const os = /Windows NT 10/.test(ua)
    ? "Windows 10/11"
    : /Windows/.test(ua)
      ? "Windows"
      : /Android/.test(ua)
        ? "Android"
        : /iPhone|iPad/.test(ua)
          ? "iOS"
          : /Mac OS X/.test(ua)
            ? "macOS"
            : /Linux/.test(ua)
              ? "Linux"
              : "Desconocido";
  return `${browser} · ${os}`;
}

type TurnstileResult = { success: boolean; error?: string; status?: number };

async function verifyTurnstile(token: string, ip: string): Promise<TurnstileResult> {
  const secret = import.meta.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    if (import.meta.env.DEV) {
      console.warn("TURNSTILE_SECRET_KEY no configurada; verificación omitida en desarrollo");
      return { success: true };
    }
    console.error("TURNSTILE_SECRET_KEY no está configurada en variables de entorno");
    return {
      success: false,
      error: "Error de configuración del servidor",
      status: 500,
    };
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret,
          response: token,
          remoteip: ip === "unknown" ? undefined : ip,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Turnstile respondió ${response.status}`);
    }

    const result = await response.json();
    if (result.success === true) {
      return { success: true };
    }

    const codes = Array.isArray(result["error-codes"])
      ? result["error-codes"].join(", ")
      : "";
    console.warn("Turnstile rechazó el token", codes);
    return {
      success: false,
      error: "Verificación anti-bots fallida. Inténtalo de nuevo.",
    };
  } catch (error) {
    console.error("Error al verificar Turnstile:", error);
    return {
      success: false,
      error: "No se pudo verificar el CAPTCHA. Inténtalo de nuevo.",
    };
  }
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const clientIP = getClientIP(request, clientAddress);

    const rateLimitCheck = checkRateLimit(clientIP);
    if (!rateLimitCheck.allowed) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Demasiadas solicitudes. Por favor, espera un momento antes de intentar nuevamente.",
          retryAfter: rateLimitCheck.retryAfter,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(rateLimitCheck.retryAfter),
          },
        }
      );
    }

    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ success: false, error: "Método no permitido" }),
        {
          status: 405,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    let body;
    try {
      const text = await request.text();
      if (!text || text.trim() === "") {
        return new Response(
          JSON.stringify({
            success: false,
            error: "El cuerpo de la solicitud está vacío",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      body = JSON.parse(text);
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Formato JSON inválido en el cuerpo de la solicitud",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (asText(body?.website, 200)) {
      console.warn("Mensaje descartado por honeypot", { ip: clientIP });
      return new Response(
        JSON.stringify({
          success: true,
          message: "Mensaje enviado correctamente",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { nombre, email, asunto, mensaje } = body;

    if (!nombre || !email || !asunto || !mensaje) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Todos los campos son requeridos",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Email inválido",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (nombre.length > 100 || email.length > 255 || asunto.length > 200 || mensaje.length > 2000) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Alguno de los campos excede la longitud máxima permitida",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    const captchaConfigured = Boolean(
      import.meta.env.TURNSTILE_SECRET_KEY || import.meta.env.PUBLIC_TURNSTILE_SITE_KEY
    );
    const captchaRequired = captchaConfigured || !import.meta.env.DEV;
    let captchaVerified = false;

    if (captchaRequired) {
      const captchaToken = asText(body.captchaToken, 4096);
      if (!captchaToken) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Falta la verificación anti-bots (CAPTCHA)",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const captcha = await verifyTurnstile(captchaToken, clientIP);
      if (!captcha.success) {
        return new Response(
          JSON.stringify({
            success: false,
            error: captcha.error || "Verificación anti-bots fallida",
          }),
          {
            status: captcha.status || 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      captchaVerified = true;
    }

    // ivo joputa
    const DISCORD_WEBHOOK_URL = import.meta.env.DISCORD_WEBHOOK_URL;

    if (!DISCORD_WEBHOOK_URL) {
      console.error("DISCORD_WEBHOOK_URL no está configurada en variables de entorno");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Error de configuración del servidor",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const meta = parseMeta(body.meta);
    const geo = await resolveGeo(request, clientIP);
    const rawUA = meta.userAgent || request.headers.get("user-agent") || undefined;
    const deviceInfo = [describeUserAgent(rawUA), meta.platform, meta.screen]
      .filter(Boolean)
      .join(" · ");

    const origin = [geo.city, geo.region, geo.country].filter(Boolean).join(", ");
    const localIP = isLocalIP(clientIP);
    const originFallback = [
      localIP ? "Local / desarrollo" : undefined,
      meta.timezone ? `Zona: ${meta.timezone}` : undefined,
    ]
      .filter(Boolean)
      .join(" · ");
    const ipValue =
      clientIP === "unknown"
        ? "No disponible"
        : localIP
          ? `${clientIP} (local)`
          : clientIP;

    const embedFields = [
      field("👤 Nombre", nombre, true),
      field("📧 Email", email, true),
      field("📝 Asunto", asunto),
      field("💬 Mensaje", mensaje),
      field("🌍 Origen (IP)", origin || originFallback || "No disponible", true),
      field("🔌 IP", ipValue, true),
    ];

    if (deviceInfo) {
      embedFields.push(field("🖥️ Navegador / dispositivo", deviceInfo));
    }

    const languages = meta.languages?.length ? ` (${meta.languages.join(", ")})` : "";
    const locale = [
      meta.language ? `${meta.language}${languages}` : undefined,
      meta.timezone
        ? `${meta.timezone}${meta.timezoneOffset !== undefined ? ` · ${formatOffset(meta.timezoneOffset)}` : ""}`
        : undefined,
    ]
      .filter(Boolean)
      .join(" · ");
    if (locale) {
      embedFields.push(field("🗣️ Idioma / zona", locale));
    }

    const ipCoords =
      geo.lat !== undefined && geo.lon !== undefined
        ? `${geo.lat.toFixed(3)}, ${geo.lon.toFixed(3)}`
        : undefined;
    if (meta.geo) {
      const accuracy =
        meta.geo.accuracy !== undefined ? ` · ±${Math.round(meta.geo.accuracy)} m` : "";
      embedFields.push(
        field(
          "📍 GPS (compartido)",
          `${meta.geo.lat.toFixed(3)}, ${meta.geo.lon.toFixed(3)}${accuracy}\nhttps://www.google.com/maps?q=${meta.geo.lat},${meta.geo.lon}`
        )
      );
    } else if (ipCoords) {
      embedFields.push(field("📍 Coordenadas aprox. (IP)", ipCoords));
    }

    const signals: string[] = [];
    if (captchaVerified) {
      signals.push("✅ Turnstile verificado");
    }
    if (meta.elapsedMs !== undefined && meta.elapsedMs < 1500) {
      signals.push(`⚠️ Envío muy rápido (${Math.round(meta.elapsedMs)} ms)`);
    } else if (meta.elapsedMs !== undefined) {
      signals.push(`⏱️ ${(meta.elapsedMs / 1000).toFixed(1)} s rellenando`);
    }
    if (/bot|spider|crawler|curl|python|postman|scrapy/i.test(rawUA || "")) {
      signals.push("🤖 User-Agent sospechoso");
    }
    if (signals.length) {
      embedFields.push(field("🚩 Señales", signals.join("\n")));
    }

    const referer = request.headers.get("referer") || meta.referrer || meta.path;
    if (referer) {
      embedFields.push(field("🔗 Referencia", referer));
    }

    const embedMessage = {
      content: "<@1081542020465692702> ¡Tienes un nuevo mensaje desde el portafolio!",
      embeds: [
        {
          title: "📧 Nuevo mensaje de contacto",
          color: 0x5865f2,
          fields: embedFields,
          timestamp: new Date().toISOString(),
          footer: {
            text: "https://itzrauh.xyz",
          },
        },
      ],
    };

    const discordResponse = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(embedMessage),
    });

    if (!discordResponse.ok) {
      console.error("Error al enviar mensaje a Discord:", await discordResponse.text());
      return new Response(
        JSON.stringify({
          success: false,
          error: "Error al enviar el mensaje. Por favor, inténtalo más tarde.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Mensaje enviado correctamente",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error en API de contacto:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Error interno del servidor. Por favor, inténtalo más tarde.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

