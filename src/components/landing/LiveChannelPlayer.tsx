import { useEffect, useRef, useState } from "react";
import type Hls from "hls.js";
import { Volume2, VolumeX } from "lucide-react";
import type { LiveChannel } from "@/data/liveChannels";

const RETRY_INTERVAL_MS = 45_000;

export function LiveChannelPlayer({ channel }: { channel: LiveChannel }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [status, setStatus] = useState<"loading" | "live" | "offline">("loading");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;
    let retryTimeout: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const scheduleRetry = () => {
      if (cancelled || retryTimeout) return;
      retryTimeout = setTimeout(() => {
        retryTimeout = null;
        load();
      }, RETRY_INTERVAL_MS);
    };

    const onLive = () => {
      if (cancelled) return;
      setStatus("live");
      video.play().catch(() => {});
    };

    const onOffline = () => {
      if (cancelled) return;
      setStatus("offline");
      scheduleRetry();
    };

    async function load() {
      if (cancelled) return;
      setStatus((s) => (s === "live" ? s : "loading"));
      hls?.destroy();
      hls = null;

      const { default: HlsRuntime } = await import("hls.js");
      if (cancelled) return;

      if (HlsRuntime.isSupported()) {
        hls = new HlsRuntime({ maxBufferLength: 15 });
        hls.loadSource(channel.streamUrl);
        hls.attachMedia(video!);
        hls.on(HlsRuntime.Events.MANIFEST_PARSED, onLive);
        hls.on(HlsRuntime.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            hls?.destroy();
            hls = null;
            onOffline();
          }
        });
      } else if (video!.canPlayType("application/vnd.apple.mpegurl")) {
        video!.src = channel.streamUrl;
      } else {
        setStatus("offline");
      }
    }

    video.addEventListener("loadedmetadata", onLive);
    video.addEventListener("error", onOffline);
    load();

    return () => {
      cancelled = true;
      if (retryTimeout) clearTimeout(retryTimeout);
      video.removeEventListener("loadedmetadata", onLive);
      video.removeEventListener("error", onOffline);
      hls?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel.streamUrl]);

  return (
    <div className="card-surface group relative aspect-video overflow-hidden">
      <video ref={videoRef} muted={muted} autoPlay playsInline className="h-full w-full bg-black object-cover" />

      {status !== "live" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/90 text-center">
          <span className="text-sm font-medium text-muted-foreground">
            {status === "loading" ? "Connecting…" : "Channel offline right now"}
          </span>
          {status === "offline" && (
            <span className="text-xs text-muted-foreground/70">Retrying automatically…</span>
          )}
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between gap-2 bg-gradient-to-b from-black/70 to-transparent p-3">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-white">
          <span className="relative flex h-2 w-2">
            {status === "live" && (
              <span className="absolute inline-flex h-full w-full rounded-full bg-live animate-live-pulse" />
            )}
            <span className={`relative inline-flex h-2 w-2 rounded-full ${status === "live" ? "bg-live" : "bg-muted-foreground"}`} />
          </span>
          {channel.name}
        </span>
      </div>

      <button
        onClick={() => setMuted((m) => !m)}
        aria-label={muted ? "Unmute" : "Mute"}
        className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80"
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
