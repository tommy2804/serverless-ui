import React, { useRef, useState } from 'react';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import PauseCircleOutlineOutlinedIcon from '@mui/icons-material/PauseCircleOutlineOutlined';

interface TestimonialVideoProps {
  caption: string;
  video: string;
  poster?: string;
}

const TestimonialVideo = ({ caption, video, poster }: TestimonialVideoProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCaption, setShowCaption] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setShowCaption(true);
      } else {
        videoRef.current.play();
        setShowCaption(false);
      }
      setIsPlaying((pre) => !pre);
    }
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setShowCaption(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
  };

  const handleMouseEnter = () => {
    if (isPlaying) setShowCaption(true);
  };

  const handleMouseLeave = () => {
    if (isPlaying) setShowCaption(false);
  };

  return (
    <div
      className="video-testimonial-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => togglePlay(e)}
    >
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        ref={videoRef}
        className="testimonial-video"
        src={video}
        poster={poster}
        controls={false}
        onPlay={() => setIsPlaying(true)}
        onPause={handleVideoPause}
        onEnded={handleVideoEnd}
      >
        {caption && <p>{caption}</p>}
      </video>
      <div className={`testimonial-video-caption ${!showCaption ? 'hidden' : ''}`}>
        {caption && <blockquote>{caption}</blockquote>}
        <button type="button" onClick={(e) => togglePlay(e)} className="play-button">
          {isPlaying ? <PauseCircleOutlineOutlinedIcon /> : <PlayCircleOutlinedIcon />}
        </button>
      </div>
    </div>
  );
};

export default TestimonialVideo;
