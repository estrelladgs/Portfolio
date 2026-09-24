import { useEffect, useRef, useState } from 'react';

interface YouTubeFacadeProps {
  videoId: string;
  /** Descriptive iframe title, e.g. "Vídeo de YouTube: Vídeo · Marta Vegas". */
  title: string;
  playLabel: string;
  poster?: string;
}

/**
 * Shows a poster and a play button; the YouTube iframe (and its third-party
 * requests) only loads after the user asks for it.
 */
export function YouTubeFacade({ videoId, title, playLabel, poster }: YouTubeFacadeProps) {
  const [playing, setPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // The button disappears when the iframe mounts; keep keyboard focus on the player.
  useEffect(() => {
    if (playing) iframeRef.current?.focus();
  }, [playing]);

  if (playing) {
    return (
      <div className="project-modal__video">
        <iframe
          ref={iframeRef}
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button type="button" className="project-modal__facade" onClick={() => setPlaying(true)}>
      {poster && <img src={poster} alt="" width={1200} height={675} />}
      <span className="project-modal__facade-play" aria-hidden="true">
        ▶
      </span>
      <span className="visually-hidden">{playLabel}</span>
    </button>
  );
}
