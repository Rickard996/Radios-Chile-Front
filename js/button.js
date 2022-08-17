/* Implementation of the presentation of the audio player */
import lottieWeb from 'https://cdn.skypack.dev/lottie-web';

const playIconContainer = document.querySelectorAll('.play-icon');
const audioPlayerContainer = document.querySelector(".audio-player-container");
const seekSlider = document.querySelector(".seek-slider");
const volumeSlider = document.querySelectorAll('.volume-slider');
const muteIconContainer = document.querySelectorAll('.mute-icon');
let playState = 'play';
let muteState = 'unmute';

const audio = document.querySelectorAll('audio');  //este me interesa

playIconContainer.forEach((playIcon, index) =>{
    const playAnimation = lottieWeb.loadAnimation({
        container: playIcon,
        path: 'https://maxst.icons8.com/vue-static/landings/animated-icons/icons/pause/pause.json',
        renderer: 'svg',
        loop: false,
        autoplay: false,
        name: "Play Animation",
    })

    playAnimation.goToAndStop(14, true);

    playIcon.addEventListener('click', () => {
        if(playState === 'play') {
            audio[index].play();
            playAnimation.playSegments([14, 27], true);
            requestAnimationFrame(whilePlaying);
            playState = 'pause';
        } else {
            audio[index].pause();
            playAnimation.playSegments([0, 14], true);
            cancelAnimationFrame(raf);
            playState = 'play';
        }
    });
})

muteIconContainer.forEach((muteIcon, indexMute) =>{
    const muteAnimation = lottieWeb.loadAnimation({
        container: muteIcon,
        path: 'https://maxst.icons8.com/vue-static/landings/animated-icons/icons/mute/mute.json',
        renderer: 'svg',
        loop: false,
        autoplay: false,
        name: "Mute Animation",
    });

    muteIcon.addEventListener('click', () => {
        if(muteState === 'unmute') {
            muteAnimation.playSegments([0, 15], true);
            audio[indexMute].muted = true;
            muteState = 'mute';
        } else {
            muteAnimation.playSegments([15, 25], true);
            audio[indexMute].muted = false;
            muteState = 'unmute';
        }
    });

})

const showRangeProgress = (rangeInput) => {
    if(rangeInput === seekSlider) audioPlayerContainer.style.setProperty('--seek-before-width', rangeInput.value / rangeInput.max * 100 + '%');
    else audioPlayerContainer.style.setProperty('--volume-before-width', rangeInput.value / rangeInput.max * 100 + '%');
}

seekSlider.addEventListener('input', (e) => {
    showRangeProgress(e.target);
});

const outputContainer = document.querySelectorAll('.volume-output');  //este me interesa

volumeSlider.forEach((volumeItemSlider, indexVolume) =>{
    volumeItemSlider.addEventListener('input', (e) => {
        showRangeProgress(e.target);
    });

    volumeItemSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        outputContainer[indexVolume].textContent = value;
        audio[indexVolume].volume = value / 100;
    });

})


/* Implementation of the functionality of the audio player */



const durationContainer = document.getElementById('duration');
const currentTimeContainer = document.getElementById('current-time');


let raf = null;

const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
}

const displayDuration = () => {
    durationContainer.textContent = calculateTime(audio.duration);
}

const setSliderMax = () => {
    seekSlider.max = Math.floor(audio.duration);
}

const displayBufferedAmount = () => {
    const bufferedAmount = Math.floor(audio.buffered.end(audio.buffered.length - 1));
    audioPlayerContainer.style.setProperty('--buffered-width', `${(bufferedAmount / seekSlider.max) * 100}%`);
}

const whilePlaying = () => {
    seekSlider.value = Math.floor(audio.currentTime);
    currentTimeContainer.textContent = calculateTime(seekSlider.value);
    audioPlayerContainer.style.setProperty('--seek-before-width', `${seekSlider.value / seekSlider.max * 100}%`);
    raf = requestAnimationFrame(whilePlaying);
}

if (audio.readyState > 0) {
    displayDuration();
    setSliderMax();
    displayBufferedAmount();
} else {
    audio.addEventListener('loadedmetadata', () => {
        displayDuration();
        setSliderMax();
        displayBufferedAmount();
    });
}

audio.addEventListener('progress', displayBufferedAmount);

seekSlider.addEventListener('input', () => {
    currentTimeContainer.textContent = calculateTime(seekSlider.value);
    if(!audio.paused) {
        cancelAnimationFrame(raf);
    }
});

seekSlider.addEventListener('change', () => {
    audio.currentTime = seekSlider.value;
    if(!audio.paused) {
        requestAnimationFrame(whilePlaying);
    }
});




