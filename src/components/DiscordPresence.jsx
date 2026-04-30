import { useState, useEffect, useRef } from "react";

const DISCORD_USER_ID = "1081542020465692702";

const STATUS_CONFIG = {
  online: { color: "#23a55a", label: "En línea" },
  idle: { color: "#f0b232", label: "Ausente" },
  dnd: { color: "#f23f43", label: "No molestar" },
  offline: { color: "#80848e", label: "Desconectado" },
};

const ACTIVITY_LABELS = {
  0: "Jugando",
  1: "En directo en",
  2: "Escuchando",
  3: "Viendo",
  5: "Compitiendo en",
};

function getActivityImage(activity) {
  if (!activity?.assets?.large_image) return null;
  const img = activity.assets.large_image;
  if (img.startsWith("mp:external/")) {
    return `https://media.discordapp.net/external/${img.replace("mp:external/", "")}`;
  }
  if (img.startsWith("spotify:")) {
    return `https://i.scdn.co/image/${img.replace("spotify:", "")}`;
  }
  if (activity.application_id) {
    return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${img}.png`;
  }
  return null;
}

function getSmallImage(activity) {
  if (!activity?.assets?.small_image) return null;
  const img = activity.assets.small_image;
  if (img.startsWith("mp:external/")) {
    return `https://media.discordapp.net/external/${img.replace("mp:external/", "")}`;
  }
  if (activity.application_id) {
    return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${img}.png`;
  }
  return null;
}

function ElapsedTime({ timestamp }) {
  const [elapsed, setElapsed] = useState("");

  useEffect(() => {
    function update() {
      const diff = Date.now() - timestamp;
      const mins = Math.floor(diff / 60000);
      const hrs = Math.floor(mins / 60);
      if (hrs > 0) {
        setElapsed(`${hrs}h ${mins % 60}m`);
      } else {
        setElapsed(`${mins}m`);
      }
    }
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [timestamp]);

  if (!elapsed) return null;
  return <span className="text-neutral-600 text-[10px]">· {elapsed}</span>;
}

export default function DiscordPresence() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const wsRef = useRef(null);
  const heartbeatRef = useRef(null);
  const reconnectRef = useRef(null);

  useEffect(() => {
    function connect() {
      const ws = new WebSocket("wss://api.lanyard.rest/socket");
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            op: 2,
            d: { subscribe_to_id: DISCORD_USER_ID },
          })
        );
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);

        if (msg.op === 1) {
          heartbeatRef.current = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ op: 3 }));
            }
          }, msg.d.heartbeat_interval);
        }

        if (msg.op === 0) {
          if (msg.t === "INIT_STATE" || msg.t === "PRESENCE_UPDATE") {
            setData(msg.d);
            setLoading(false);
          }
        }
      };

      ws.onclose = () => {
        clearInterval(heartbeatRef.current);
        reconnectRef.current = setTimeout(connect, 5000);
      };

      ws.onerror = () => ws.close();
    }

    connect();

    return () => {
      clearInterval(heartbeatRef.current);
      clearTimeout(reconnectRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-xs mx-auto">
        <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 backdrop-blur-sm p-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-800" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-neutral-800 rounded w-24" />
              <div className="h-3 bg-neutral-800 rounded w-16" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const status = data.discord_status || "offline";
  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.offline;
  const user = data.discord_user;

  const avatarUrl = user?.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "webp"}?size=128`
    : `https://cdn.discordapp.com/embed/avatars/${(BigInt(user?.id || "0") >> 22n) % 6n}.png`;

  const customStatus = data.activities?.find((a) => a.type === 4);
  const activity = data.activities?.find((a) => a.type !== 4 && a.type !== 2);
  const spotify = data.spotify;

  return (
    <div className="w-full max-w-xs mx-auto space-y-2">
      <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 backdrop-blur-sm overflow-hidden transition-all duration-300">
        <div className="p-4 pb-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <img
                src={avatarUrl}
                alt={user?.username || "Discord"}
                className="w-10 h-10 rounded-full"
              />
              <div
                className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-[2.5px] border-neutral-950"
                style={{ backgroundColor: statusConfig.color }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-neutral-100 text-sm truncate">
                  {user?.global_name || user?.username}
                </span>
                <svg
                  className="w-4 h-4 text-[#5865F2] flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z" />
                </svg>
              </div>
              <span
                className="text-xs font-medium"
                style={{ color: statusConfig.color }}
              >
                {statusConfig.label}
              </span>
            </div>
          </div>
          {customStatus && (customStatus.state || customStatus.emoji) && (
            <div className="mt-2.5 flex items-center gap-1.5 text-sm text-neutral-400">
              {customStatus.emoji?.id ? (
                <img
                  src={`https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.${customStatus.emoji.animated ? "gif" : "webp"}?size=20`}
                  alt=""
                  className="w-4 h-4 flex-shrink-0"
                />
              ) : customStatus.emoji?.name ? (
                <span className="text-sm flex-shrink-0">
                  {customStatus.emoji.name}
                </span>
              ) : null}
              {customStatus.state && (
                <span className="truncate text-xs">{customStatus.state}</span>
              )}
            </div>
          )}
        </div>
        {activity && (
          <div className="px-4 pb-3">
            <div className="rounded-lg bg-neutral-900/60 p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">
                  {ACTIVITY_LABELS[activity.type] || "Usando"}
                </span>
                {activity.timestamps?.start && (
                  <ElapsedTime timestamp={activity.timestamps.start} />
                )}
              </div>
              <div className="flex items-start gap-3">
                {getActivityImage(activity) && (
                  <div className="relative flex-shrink-0">
                    <img
                      src={getActivityImage(activity)}
                      alt={activity.name}
                      className="w-14 h-14 rounded-lg"
                    />
                    {getSmallImage(activity) && (
                      <img
                        src={getSmallImage(activity)}
                        alt=""
                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-neutral-900"
                      />
                    )}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-neutral-200 text-sm truncate">
                    {activity.name}
                  </div>
                  {activity.details && (
                    <div className="text-xs text-neutral-400 truncate">
                      {activity.details}
                    </div>
                  )}
                  {activity.state && (
                    <div className="text-xs text-neutral-500 truncate">
                      {activity.state}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {spotify && (
          <div className="px-4 pb-3">
            <div className="rounded-lg bg-neutral-900/60 p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <svg
                  className="w-3.5 h-3.5 text-[#1DB954]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">
                  Escuchando Spotify
                </span>
              </div>
              <div className="flex items-center gap-3">
                {spotify.album_art_url && (
                  <img
                    src={spotify.album_art_url}
                    alt={spotify.album}
                    className="w-14 h-14 rounded-lg flex-shrink-0"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-neutral-200 text-sm truncate">
                    {spotify.song}
                  </div>
                  <div className="text-xs text-neutral-400 truncate">
                    {spotify.artist}
                  </div>
                  <div className="text-xs text-neutral-500 truncate">
                    {spotify.album}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
