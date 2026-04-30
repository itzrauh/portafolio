import { useState, useRef, useEffect } from "react";
import styles from "../styles/Music.module.css";
import musicData from "../data/music.json";

const PlayIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

const NextIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
  </svg>
);

const PreviousIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

const songFilenames = Array.isArray(musicData) ? musicData : (musicData.songs || []);

const parseFilename = (filename) => {
  const match = filename.match(/^(.+?)\s*-\s*(.+?)\.mp3$/i);
  if (match) {
    return {
      artist: match[1].trim(),
      title: match[2].trim(),
      filename: filename,
      audioSrc: `/songs/${filename}`,
    };
  }
  const nameWithoutExt = filename.replace(/\.mp3$/i, "");
  return {
    artist: "Unknown",
    title: nameWithoutExt,
    filename: filename,
    audioSrc: `/songs/${filename}`,
  };
};

const getLuminance = (r, g, b) => {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};

const adjustColorsForVisibility = (primary, primaryDark, primaryLight) => {
  const rgbMatch = primary.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!rgbMatch) return { primary, primaryDark, primaryLight };
  
  const [, r, g, b] = rgbMatch.map(Number);
  const luminance = getLuminance(r, g, b);
  if (luminance < 0.15) {
    const adjustedR = Math.min(255, Math.round(r * 2.5));
    const adjustedG = Math.min(255, Math.round(g * 2.5));
    const adjustedB = Math.min(255, Math.round(b * 2.5));
    
    const adjustedPrimary = `rgb(${adjustedR}, ${adjustedG}, ${adjustedB})`;
    const adjustedPrimaryDark = `rgb(${Math.round(adjustedR * 0.7)}, ${Math.round(adjustedG * 0.7)}, ${Math.round(adjustedB * 0.7)})`;
    const adjustedPrimaryLight = `rgb(${Math.min(255, Math.round(adjustedR * 1.3))}, ${Math.min(255, Math.round(adjustedG * 1.3))}, ${Math.min(255, Math.round(adjustedB * 1.3))})`;
    
    return { 
      primary: adjustedPrimary, 
      primaryDark: adjustedPrimaryDark, 
      primaryLight: adjustedPrimaryLight 
    };
  }
  
  return { primary, primaryDark, primaryLight };
};

const extractColorsFromImage = (imageUrl) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 50;
        canvas.height = 50;
        ctx.drawImage(img, 0, 0, 50, 50);
        
        const imageData = ctx.getImageData(0, 0, 50, 50);
        const data = imageData.data;
        
        let r = 0, g = 0, b = 0;
        let count = 0;

        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);

        const primary = `rgb(${r}, ${g}, ${b})`;
        const primaryDark = `rgb(${Math.max(0, Math.round(r * 0.7))}, ${Math.max(0, Math.round(g * 0.7))}, ${Math.max(0, Math.round(b * 0.7))})`;
        const primaryLight = `rgb(${Math.min(255, Math.round(r * 1.2))}, ${Math.min(255, Math.round(g * 1.2))}, ${Math.min(255, Math.round(b * 1.2))})`;
        const adjustedColors = adjustColorsForVisibility(primary, primaryDark, primaryLight);
        resolve(adjustedColors);
      } catch (error) {
        console.log("Error extracting colors:", error);
        resolve({
          primary: "rgb(100, 100, 100)",
          primaryDark: "rgb(50, 50, 50)",
          primaryLight: "rgb(130, 130, 130)",
        });
      }
    };
    
    img.onerror = () => {
      resolve({
        primary: "rgb(100, 100, 100)",
        primaryDark: "rgb(50, 50, 50)",
        primaryLight: "rgb(130, 130, 130)",
      });
    };
    
    img.src = imageUrl;
  });
};

const loadSongMetadata = async (filename) => {
  const baseSong = parseFilename(filename);

  const coverFilename = filename.replace(/\.mp3$/i, ".webp");
  const coverPath = `/songs/cover/${coverFilename}`;

  let albumArt = null;
  let colors = {
    primary: "rgb(100, 100, 100)",
    primaryDark: "rgb(50, 50, 50)",
    primaryLight: "rgb(130, 130, 130)",
  };

  const checkAndLoadCover = () => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = async () => {
        albumArt = coverPath;
        try {
          colors = await extractColorsFromImage(coverPath);
        } catch (error) {
          console.log("Error extracting colors from cover:", error);
        }
        resolve({ albumArt, colors });
      };

      img.onerror = () => {
        resolve({ albumArt: null, colors });
      };

      img.src = coverPath;
    });
  };

  const coverResult = await checkAndLoadCover();
  albumArt = coverResult.albumArt;
  colors = coverResult.colors;

  return {
    ...baseSong,
    albumArt,
    colors,
  };
};

const Music = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentSong, setCurrentSong] = useState(null);
  const [playedSongs, setPlayedSongs] = useState([]);
  const audioRef = useRef(null);
  const progressTimerRef = useRef(null);
  const [volume, setVolume] = useState(1);
  const progressBarRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef(rotation);
  rotationRef.current = rotation;
  const [dynamicColors, setDynamicColors] = useState({
    primary: "rgb(100, 100, 100)",
    primaryDark: "rgb(50, 50, 50)",
    primaryLight: "rgb(130, 130, 130)",
  });
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isInitialized, setIsInitialized] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartTime, setDragStartTime] = useState(0);
  const [songs, setSongs] = useState([]);

  const getRandomSong = () => {
    if (songs.length === 0) return null;

    if (playedSongs.length >= songs.length) {
      setPlayedSongs([]);
    }

    const currentPlayedSongs =
      playedSongs.length >= songs.length ? [] : playedSongs;
    const availableSongs = songs.filter(
      (song) => !currentPlayedSongs.includes(song.title)
    );

    if (availableSongs.length === 0) {
      const randomIndex = Math.floor(Math.random() * songs.length);
      return songs[randomIndex];
    }

    const randomIndex = Math.floor(Math.random() * availableSongs.length);
    const selectedSong = availableSongs[randomIndex];

    setPlayedSongs((prev) => [...prev, selectedSong.title]);

    return selectedSong;
  };
  const playSong = (song) => {
    if (!song) return;

    setCurrentSong(song);
    setCurrentTime(0);

    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.log("Error playing audio:", err);
            setIsPlaying(false);
          });
      }
    }, 100);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    try {
      localStorage.setItem("musicPlayerVolume", newVolume.toString());
    } catch (e) {
    }
  };

  const togglePlayPause = (e) => {
    e.stopPropagation();

    if (!currentSong) {
      const newSong = getRandomSong();
      if (newSong) {
        playSong(newSong);
      }
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.log("Error playing audio:", err);
          setIsPlaying(false);
        });
    }
  };

  const handleNextSong = (e) => {
    if (e) e.stopPropagation();
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const nextSong = history[nextIndex];
      setHistoryIndex(nextIndex);
      playSong(nextSong);
    } else {
      const nextSong = getRandomSong();
      if (nextSong) {
        setHistory((prev) => [...prev, nextSong]);
        setHistoryIndex((prev) => prev + 1);
        playSong(nextSong);
      }
    }
  };

  const handlePreviousSong = (e) => {
    if (e) e.stopPropagation();

    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const prevSong = history[prevIndex];
      setHistoryIndex(prevIndex);
      playSong(prevSong);
    } else if (historyIndex === 0 && history.length > 0) {
      const currentSongFromHistory = history[0];
      playSong(currentSongFromHistory);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && !isDragging) {
      const newTime = audioRef.current.currentTime;
      setCurrentTime(newTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
      audioRef.current.volume = volume;
    }
  };

  const handleAudioError = () => {
    console.log("Error loading audio");
    setIsPlaying(false);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    handleNextSong();
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "00:00";

    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleProgressMouseDown = (e) => {
    if (!audioRef.current || !progressBarRef.current || !duration) return;

    setIsDragging(true);
    const rect = progressBarRef.current.getBoundingClientRect();
    setDragStartX(e.clientX - rect.left);
    setDragStartTime(currentTime);

    const clickX = e.clientX - rect.left;
    const newTime = Math.max(
      0,
      Math.min(duration, (clickX / rect.width) * duration)
    );
    setCurrentTime(newTime);

    e.preventDefault();
  };

  const handleProgressMouseMove = (e) => {
    if (
      !isDragging ||
      !audioRef.current ||
      !progressBarRef.current ||
      !duration
    )
      return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = Math.max(
      0,
      Math.min(duration, (clickX / rect.width) * duration)
    );

    setCurrentTime(newTime);
  };

  const handleProgressMouseUp = (e) => {
    if (
      !isDragging ||
      !audioRef.current ||
      !progressBarRef.current ||
      !duration
    )
      return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = Math.max(
      0,
      Math.min(duration, (clickX / rect.width) * duration)
    );

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setIsDragging(false);
  };

  const handleProgressClick = (e) => {
    if (isDragging) return;

    if (!audioRef.current || !progressBarRef.current || !duration) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;

    if (newTime >= 0 && newTime <= duration) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => handleProgressMouseMove(e);
    const handleMouseUp = (e) => handleProgressMouseUp(e);

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, duration]);

  useEffect(() => {
    let animationFrameId;

    const rotate = () => {
      setRotation((prev) => (prev + 0.6) % 360);
      animationFrameId = requestAnimationFrame(rotate);
    };

    if (isPlaying) {
      animationFrameId = requestAnimationFrame(rotate);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) {}
  }, [isPlaying]);

  useEffect(() => {
    if (!isInitialized) return;

    try {
      const stateToSave = {
        currentSongTitle: currentSong?.title || null,
        isPlaying: isPlaying,
        currentTime: currentTime,
        history: history.map(song => song.title),
        historyIndex: historyIndex,
        playedSongs: playedSongs,
      };
      localStorage.setItem("musicPlayerState", JSON.stringify(stateToSave));
    } catch (e) {}
  }, [currentSong, isPlaying, history, historyIndex, playedSongs, isInitialized]);

  useEffect(() => {
    if (!isInitialized || !currentSong) return;

    const timeSaveInterval = setInterval(() => {
      try {
        const savedState = localStorage.getItem("musicPlayerState");
        if (savedState) {
          const state = JSON.parse(savedState);
          state.currentTime = currentTime;
          localStorage.setItem("musicPlayerState", JSON.stringify(state));
        }
      } catch (e) {}
    }, 2000);

    return () => clearInterval(timeSaveInterval);
  }, [currentTime, isInitialized, currentSong]);

  useEffect(() => {
    const loadAllSongsMetadata = async () => {
      try {
        const loadedSongs = await Promise.all(
          songFilenames.map((filename) => loadSongMetadata(filename))
        );
        setSongs(loadedSongs);
      } catch (error) {
        console.error("Error loading songs metadata:", error);
        const fallbackSongs = songFilenames.map((filename) => ({
          ...parseFilename(filename),
          albumArt: null,
          colors: {
            primary: "rgb(100, 100, 100)",
            primaryDark: "rgb(50, 50, 50)",
            primaryLight: "rgb(130, 130, 130)",
          },
        }));
        setSongs(fallbackSongs);
      }
    };

    loadAllSongsMetadata();
  }, []);

  useEffect(() => {
    if (songs.length === 0) return;

    const initializeComponent = async () => {
      try {
        const savedVolume = localStorage.getItem("musicPlayerVolume");
        if (savedVolume) {
          const volumeValue = parseFloat(savedVolume);
          if (!isNaN(volumeValue) && volumeValue >= 0 && volumeValue <= 1) {
            setVolume(volumeValue);
          }
        }
      } catch (e) {}

      try {
        const savedState = localStorage.getItem("musicPlayerState");
        if (savedState) {
          const state = JSON.parse(savedState);

          if (state.currentSongTitle) {
            const savedSong = songs.find(song => song.title === state.currentSongTitle);
            if (savedSong) {
              setCurrentSong(savedSong);

              if (state.history && state.history.length > 0) {
                const restoredHistory = state.history
                  .map(title => songs.find(song => song.title === title))
                  .filter(song => song !== undefined);
                
                if (restoredHistory.length > 0) {
                  setHistory(restoredHistory);
                  setHistoryIndex(state.historyIndex !== undefined ? state.historyIndex : restoredHistory.length - 1);
                }
              }

              if (state.playedSongs && Array.isArray(state.playedSongs)) {
                setPlayedSongs(state.playedSongs);
              }

              if (savedSong.colors) {
                setDynamicColors(savedSong.colors);
              }

              setTimeout(() => {
                if (audioRef.current) {
                  if (state.currentTime && state.currentTime > 0) {
                    audioRef.current.currentTime = state.currentTime;
                  }
                  if (state.isPlaying) {
                    audioRef.current
                      .play()
                      .then(() => setIsPlaying(true))
                      .catch((err) => {
                        console.log("Error resuming playback:", err);
                        setIsPlaying(false);
                      });
                  }
                }
              }, 200);
              
              setIsInitialized(true);
              return;
            }
          }
        }
      } catch (e) {
        console.log("Error restoring music player state:", e);
      }

      const initialSong = getRandomSong();
      if (initialSong) {
        setCurrentSong(initialSong);
        setHistory([initialSong]);
        setHistoryIndex(0);

        if (initialSong.colors) {
          try {
            setDynamicColors(initialSong.colors);
          } catch (error) {
            console.log("Error extracting initial colors:", error);
          }
        }
      }

      setIsInitialized(true);
    };

    initializeComponent();

    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, [songs]);

  useEffect(() => {
    if (!isInitialized || !currentSong?.colors) return;

    setDynamicColors(currentSong.colors);
  }, [currentSong, isInitialized]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, currentSong]);

  return (
    <div
      className={`${styles.musicPlayer} ${isExpanded ? styles.expanded : ""}`}
      onClick={toggleExpanded}
      style={{
        userSelect: "none",
        caretColor: "transparent",
        ...(isExpanded
          ? {
              background: `linear-gradient(145deg, ${dynamicColors.primaryDark}33, ${dynamicColors.primary}22)`,
              borderColor: `${dynamicColors.primary}66`,
              boxShadow: `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1), 0 0 0 1px ${dynamicColors.primary}44`,
            }
          : {}),
      }}
    >
      <audio
        ref={audioRef}
        src={currentSong?.audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
        onError={handleAudioError}
        preload="metadata"
      />

      {isExpanded ? (
        <div
          className={styles.playerContent}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className={styles.closeButton}
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(false);
            }}
          >
            <CloseIcon />
          </button>

          <div className={styles.vinylContainer}>
            <div
              className={styles.vinylDisc}
              style={{
                width: "180px",
                height: "180px",
                "--rotation": `${rotation}deg`,
                transform: isPlaying
                  ? `rotate(var(--rotation)) scale(1.02)`
                  : `rotate(var(--rotation))`,
                border: `3px solid ${dynamicColors.primary}88`,
                boxShadow: `0 0 24px ${dynamicColors.primary}40, 0 6px 18px rgba(0,0,0,0.55)`,
              }}
            >
              {currentSong?.albumArt && (
                <img
                  src={currentSong.albumArt}
                  alt={currentSong.title}
                  className={styles.vinylImage}
                  draggable={false}
                />
              )}
              <div className={styles.vinylHole}></div>
            </div>
          </div>

          <div className={styles.rightColumn}>
            {/* Song Info */}
            <div className={styles.songInfo}>
              {currentSong && (
                <>
                  <div className="relative">
                    <div className="text-center w-full">
                      <div
                        className={styles.songTitle}
                        style={{
                          color: dynamicColors.primaryLight,
                          userSelect: "text",
                          caretColor: "transparent",
                        }}
                      >
                        {currentSong.title}
                      </div>
                      <div
                        className={styles.songArtist}
                        style={{
                          color: `${dynamicColors.primary}cc`,
                          userSelect: "none",
                          caretColor: "transparent",
                        }}
                      >
                        {currentSong.artist}
                      </div>
                    </div>
                    {currentSong.link && (
                      <a
                        href={currentSong.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-0 -right-10 p-2 rounded-full hover:bg-neutral-800/50 transition-all duration-200 group"
                        title="Ir a la canción"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg
                          className="w-4 h-4 text-neutral-400 group-hover:text-neutral-300 transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>

          <div className="flex items-center gap-3 w-full px-1">
            <div className="text-xs leading-4 text-neutral-500 font-mono min-w-10 text-center">
              {formatTime(currentTime)}
            </div>
            <div
              className="relative w-full h-1.5 bg-neutral-800/80 rounded-full cursor-pointer overflow-visible"
              ref={progressBarRef}
              onClick={handleProgressClick}
              onMouseDown={handleProgressMouseDown}
            >
              <div
                className="absolute left-0 top-0 h-full rounded-full transition-all duration-200"
                style={{
                  width: `${
                    duration > 0 ? (currentTime / duration) * 100 : 0
                  }%`,
                  background: `${dynamicColors.primary}`,
                  boxShadow: isPlaying
                    ? `0 0 12px ${dynamicColors.primary}66`
                    : "none",
                }}
              ></div>
              <div
                className={`${styles.progressHandle} absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white cursor-grab ${
                  isDragging ? "cursor-grabbing" : ""
                }`}
                style={{
                  left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                  marginLeft: "-6px",
                  background: dynamicColors.primary,
                }}
                onMouseDown={handleProgressMouseDown}
              ></div>
            </div>
            <div className="text-xs leading-4 text-neutral-500 font-mono min-w-10 text-center">
              {formatTime(duration)}
            </div>
          </div>

          <div className={styles.controls}>
            <button
              className={styles.previousButton}
              onClick={handlePreviousSong}
              disabled={historyIndex <= 0}
              style={{
                borderColor: `${dynamicColors.primary}44`,
                color: dynamicColors.primaryLight,
              }}
            >
              <PreviousIcon />
            </button>

            <button
              className={styles.playPauseButton}
              onClick={togglePlayPause}
              style={{
                borderColor: `${dynamicColors.primary}44`,
                color: dynamicColors.primaryLight,
              }}
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button
              className={styles.nextButton}
              onClick={handleNextSong}
              style={{
                borderColor: `${dynamicColors.primary}44`,
                color: dynamicColors.primaryLight,
              }}
            >
              <NextIcon />
            </button>

            <div className={styles.volumeContainer}>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className={styles.volumeSlider}
                style={{
                  "--volume-percent": `${volume * 100}%`,
                  background: `linear-gradient(to right, 
                    ${dynamicColors.primary} 0%, 
                    ${dynamicColors.primary} ${volume * 100}%, 
                    hsl(0 0% 14.9%) ${volume * 100}%, 
                    hsl(0 0% 14.9%) 100%)`,
                }}
              />
              <span className={styles.volumeText}>
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
        </div>
        </div>
      ) : (
        <div
          className={`${styles.minimizedPlayer} ${
            isPlaying ? styles.playing : ""
          }`}
          style={{
            borderColor: `${dynamicColors.primary}88`,
            background: `linear-gradient(135deg, ${dynamicColors.primaryDark}22, ${dynamicColors.primary}11)`,
            boxShadow: isPlaying
              ? `0 0 15px -5px ${dynamicColors.primary}aa, 0 1px 3px 0 rgb(0 0 0 / 0.1), inset 0 1px 0 ${dynamicColors.primary}33`
              : `0 1px 2px 0 rgb(0 0 0 / 0.05), inset 0 1px 0 ${dynamicColors.primary}22`,
          }}
        >
          <div className={styles.vinylContainer}>
            <div
              className={styles.vinylDisc}
              style={{
                "--rotation": `${rotation}deg`,
                transform: isPlaying ? `rotate(var(--rotation))` : "none",
              }}
            >
              {currentSong?.albumArt && (
                <img
                  src={currentSong.albumArt}
                  alt={currentSong.title}
                  className={styles.vinylImage}
                  draggable={false}
                />
              )}
              <div className={styles.vinylHole}></div>
            </div>
          </div>

          {currentSong && (
            <div className={`${styles.miniSongInfo}`}>
              <div className="relative w-full">
                <div className={`w-full ${currentSong.link ? "pr-8" : ""}`}>
                  <div className={styles.miniTitleRow}>
                    <span
                      className={`${styles.songTitle} truncate`}
                      style={{
                        color: dynamicColors.primaryLight,
                        userSelect: "text",
                        caretColor: "transparent",
                      }}
                    >
                      {currentSong.title}
                    </span>
                    {isPlaying && (
                      <span className={styles.equalizer} aria-hidden="true">
                        <span className={styles.equalizerBar}></span>
                        <span className={styles.equalizerBar}></span>
                        <span className={styles.equalizerBar}></span>
                      </span>
                    )}
                  </div>
                  <div
                    className={`${styles.songArtist} truncate`}
                    style={{
                      color: `${dynamicColors.primary}cc`,
                      userSelect: "none",
                      caretColor: "transparent",
                    }}
                  >
                    {currentSong.artist}
                  </div>
                </div>
                {currentSong.link && (
                  <a
                    href={currentSong.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-1/2 -translate-y-1/2 right-0 p-1 rounded-full hover:bg-neutral-800/50 transition-all duration-200 group"
                    title="Ir a la canción"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg
                      className="w-3 h-3 text-neutral-400 group-hover:text-neutral-300 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Music;