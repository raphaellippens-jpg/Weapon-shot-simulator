const shootButton = document.querySelector("#shoot");
const cockButton = document.querySelector("#cock");
const count = document.querySelector("#count");
const statusText = document.querySelector("#status");
let busy = false;
let cocked = false;

const soundFiles = {
  pistol: {
    cock: "https://sfxmint.com/dl/gun-cocking-01.mp3",
    shot: "https://sfxmint.com/dl/impact-gunshot-10.mp3"
  },
  shotgun: {
    // Pumped Shotgun file includes the blast followed by the pump action.
    cock: "https://sfxmint.com/dl/gun-cocking-07.mp3",
    shot: "https://sfxmint.com/dl/shotgun-01.mp3"
  },
  rifle: {
    cock: "https://sfxmint.com/dl/gun-cocking-03.mp3",
    shot: "https://sfxmint.com/dl/impact-gunshot-08.mp3"
  },
  smg: {
    cock: "https://sfxmint.com/dl/gun-cocking-07.mp3",
    shot: "https://sfxmint.com/dl/automatic-gunfire-04.mp3"
  }
};

const weapon = location.pathname.split("/").pop().replace(".html", "").toLowerCase();
const sounds = soundFiles[weapon] || soundFiles.rifle;
const audio = {
  cock: new Audio(sounds.cock),
  shot: new Audio(sounds.shot)
};
audio.cock.preload = "auto";
audio.shot.preload = "auto";
audio.cock.volume = 1;
audio.shot.volume = 1;

function playAudio(sound) {
  sound.pause();
  sound.currentTime = 0;
  return sound.play().catch(() => {
    statusText.textContent = "TAP AGAIN TO ENABLE AUDIO";
  });
}

cockButton.addEventListener("click", async () => {
  if (busy || cocked) return;
  await playAudio(audio.cock);
  cocked = true;
  shootButton.disabled = false;
  cockButton.disabled = true;
  statusText.textContent = "COCKED — READY TO FIRE";
});

function triggerIpadFlash() {
  // Create this Shortcut on iPad with the exact name "Weapon Flash".
  // It should turn the flashlight on, wait briefly, then turn it off.
  const shortcutURL = "shortcuts://run-shortcut?name=Weapon%20Flash&input=text&text=flash";
  window.location.href = shortcutURL;
}

shootButton.addEventListener("click", async () => {
  if (busy || !cocked) return;
  busy = true;
  shootButton.disabled = true;
  statusText.textContent = "FIRING SEQUENCE…";

  for (let n = 3; n >= 1; n--) {
    count.textContent = n;
    count.classList.add("show");
    await new Promise(resolve => setTimeout(resolve, 850));
  }

  count.classList.remove("show");
  statusText.textContent = "SHOT FIRED";
  await playAudio(audio.shot);
  triggerIpadFlash();

  await new Promise(resolve => setTimeout(resolve, 1000));
  cocked = false;
  cockButton.disabled = false;
  shootButton.disabled = true;
  statusText.textContent = "RE-COCK TO FIRE AGAIN";
  busy = false;
});