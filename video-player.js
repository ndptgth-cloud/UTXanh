const stage = document.querySelector("#video-player");
const frame = document.querySelector("#video-player-frame");
const overlay = document.querySelector("#video-player-overlay");
const status = document.querySelector("#video-player-status");
const centerPlay = document.querySelector("#video-center-play");
const playToggle = document.querySelector("#video-play-toggle");
const muteToggle = document.querySelector("#video-mute-toggle");
const fullscreenToggle = document.querySelector("#video-fullscreen-toggle");
const seek = document.querySelector("#video-seek");
const volume = document.querySelector("#video-volume");
const time = document.querySelector("#video-time");

let player;
let playerReady = false;
let hideControlsTimer;
let lastVolume = 100;

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function setStatus(message) {
  status.textContent = message;
}

function updatePlayButton(isPlaying) {
  const label = isPlaying ? "Tạm dừng video" : "Phát video";
  playToggle.setAttribute("aria-label", label);
  playToggle.title = label;
  playToggle.innerHTML = isPlaying
    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h4v14H6zm8 0h4v14h-4z" fill="currentColor"/></svg>'
    : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';
}

function updateMuteButton() {
  const isMuted = player.isMuted() || player.getVolume() === 0;
  const label = isMuted ? "Bật tiếng" : "Tắt tiếng";
  muteToggle.setAttribute("aria-label", label);
  muteToggle.title = label;
  muteToggle.innerHTML = isMuted
    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 4V5L7 9H3zm13.59 3 2.12 2.12-1.42 1.42L15.17 13.4l-2.12 2.13-1.42-1.42L13.76 12l-2.13-2.12 1.42-1.42 2.12 2.13 2.13-2.13 1.42 1.42L16.59 12z" fill="currentColor"/></svg>'
    : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 4V5L7 9H3zm12.5 3a3.5 3.5 0 0 0-2-3.16v6.32a3.5 3.5 0 0 0 2-3.16zm-2-8.77v2.06a7 7 0 0 1 0 13.42v2.06a9 9 0 0 0 0-17.54z" fill="currentColor"/></svg>';
}

function showControls() {
  stage.classList.remove("controls-hidden");
  clearTimeout(hideControlsTimer);

  if (playerReady && player.getPlayerState() === YT.PlayerState.PLAYING) {
    hideControlsTimer = setTimeout(() => stage.classList.add("controls-hidden"), 2200);
  }
}

function updateProgress() {
  if (!playerReady) return;
  const duration = player.getDuration();
  const currentTime = player.getCurrentTime();
  const progress = duration > 0 ? Math.round((currentTime / duration) * 1000) : 0;

  if (document.activeElement !== seek) seek.value = String(progress);
  time.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
}

function loadYouTubeApi() {
  window.onYouTubeIframeAPIReady = () => {
    player = new YT.Player(frame, {
      events: {
        onReady: () => {
          playerReady = true;
          seek.disabled = false;
          setStatus("");
          updatePlayButton(false);
          updateMuteButton();
          updateProgress();
          window.setInterval(updateProgress, 500);
        },
        onStateChange: (event) => {
          const isPlaying = event.data === YT.PlayerState.PLAYING;
          stage.classList.toggle("is-playing", isPlaying);
          updatePlayButton(isPlaying);
          showControls();
          if (event.data === YT.PlayerState.ENDED) seek.value = "1000";
        },
        onError: () => setStatus("Không phát được video. Hãy thử mở video trực tiếp trên YouTube.")
      }
    });
  };

  const apiScript = document.createElement("script");
  apiScript.src = "https://www.youtube.com/iframe_api";
  apiScript.onerror = () => setStatus("Không tải được trình phát YouTube. Hãy kiểm tra kết nối mạng.");
  document.head.append(apiScript);
}

function togglePlayback() {
  if (!playerReady) return;
  if (player.getPlayerState() === YT.PlayerState.PLAYING) player.pauseVideo();
  else player.playVideo();
}

centerPlay.addEventListener("click", (event) => {
  event.stopPropagation();
  togglePlayback();
});

playToggle.addEventListener("click", togglePlayback);

muteToggle.addEventListener("click", () => {
  if (!playerReady) return;
  if (player.isMuted() || player.getVolume() === 0) {
    player.unMute();
    player.setVolume(lastVolume);
  } else {
    lastVolume = player.getVolume();
    player.mute();
  }
  updateMuteButton();
  volume.value = String(player.getVolume());
});

volume.addEventListener("input", () => {
  if (!playerReady) return;
  const nextVolume = Number(volume.value);
  player.setVolume(nextVolume);
  if (nextVolume > 0 && player.isMuted()) player.unMute();
  if (nextVolume > 0) lastVolume = nextVolume;
  updateMuteButton();
});

seek.addEventListener("change", () => {
  if (!playerReady) return;
  const duration = player.getDuration();
  if (duration > 0) player.seekTo((Number(seek.value) / 1000) * duration, true);
});

fullscreenToggle.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    stage.requestFullscreen().catch((error) => {
      console.error("Không thể mở video toàn màn hình:", error);
      setStatus("Trình duyệt không cho phép mở chế độ toàn màn hình.");
    });
  } else {
    document.exitFullscreen();
  }
});

stage.addEventListener("pointermove", showControls);
stage.addEventListener("pointerdown", showControls);
stage.addEventListener("click", (event) => {
  if (event.target === stage || event.target === overlay || event.target === frame) togglePlayback();
});

document.addEventListener("fullscreenchange", () => {
  const isFullscreen = document.fullscreenElement === stage;
  const label = isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình";
  fullscreenToggle.setAttribute("aria-label", label);
  fullscreenToggle.title = label;
});

loadYouTubeApi();
