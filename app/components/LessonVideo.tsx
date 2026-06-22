"use client";

export default function LessonVideo({ src }: { src: string }) {
  return (
    <video
      src={src}
      controls
      controlsList="nodownload noplaybackrate noremoteplayback"
      disablePictureInPicture
      onContextMenu={(e) => e.preventDefault()}
      playsInline
      preload="metadata"
      className="h-full w-full bg-black"
    />
  );
}
