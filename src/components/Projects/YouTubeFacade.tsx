import { useEffect, useRef, useState } from 'react';
import { Picture, type PictureData } from '../Picture/Picture';

interface YouTubeFacadeProps {
  videoId: string;
  /** Descriptive iframe title, e.g. "Vídeo de YouTube: Vídeo · Marta Vegas". */
  title: string;
  playLabel: string;
  poster?: PictureData;
  posterSizes: string;
}

/**
 * Shows a poster and a play button; the YouTube iframe (and its third-party
 * requests) only loads after the user asks for it.
 */
export function YouTubeFacade({ videoId, title, playLabel, poster, posterSizes }: YouTubeFacadeProps) {
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
      {poster && <Picture picture={poster} sizes={posterSizes} alt="" />}
      <span className="project-modal__facade-play" aria-hidden="true">
        ▶
      </span>
      <span className="visually-hidden">{playLabel}</span>
    </button>
  );
}
