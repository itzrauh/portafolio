import type { APIRoute } from "astro";

export const prerender = false;
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60000;

function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }
  return "unknown";
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

export const POST: APIRoute = async ({ request }) => {
  try {
    const clientIP = getClientIP(request);

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

    const embedMessage = {
      content: "<@1081542020465692702> ¡Tienes un nuevo mensaje desde el portafolio!",
      embeds: [
        {
          title: "📧 Nuevo mensaje de contacto",
          color: 0x5865f2,
          fields: [
            {
              name: "👤 Nombre",
              value: nombre,
              inline: true,
            },
            {
              name: "📧 Email",
              value: email,
              inline: true,
            },
            {
              name: "📝 Asunto",
              value: asunto,
              inline: false,
            },
            {
              name: "💬 Mensaje",
              value: mensaje,
              inline: false,
            },
          ],
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

