const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const filters = document.querySelector('#filters');

video.addEventListener('canplay', paintToCanvas);

function getVideo() {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(localMediaStream => {
            video.srcObject = localMediaStream;
            video.play();
        }).catch(err => console.error('No video.', err));
}

function paintToCanvas() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        let pixels = ctx.getImageData(0, 0, video.videoWidth, video.videoHeight);
        if(filters.value) {window[filters.value](pixels)};
        pixels = greenScreen(pixels);
        ctx.putImageData(pixels, 0, 0);
    }, 16);
}

function takePhoto() {
    snap.currentTime = 0;
    snap.play();

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/jpeg');
    link.setAttribute('download', 'photo');
    link.innerHTML = `<img src="${link.href}" alt="Photo"/>`;
    strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i + 0] = pixels.data[i + 0] * 1.5; // RED
        pixels.data[i + 1] = pixels.data[i + 1] * 0.7; // GREEN
        pixels.data[i + 2] = pixels.data[i + 2] * 0.4; // Blue
    }
    return pixels;
}
  
function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i - 40] = pixels.data[i + 0]; // RED
        pixels.data[i + 41] = pixels.data[i + 1]; // GREEN
        pixels.data[i - 82] = pixels.data[i + 2]; // Blue
    }
    return pixels;
}

function rgbInvert(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i + 0] = 255 - pixels.data[i + 0]; // RED
        pixels.data[i + 1] = 255 - pixels.data[i + 1]; // GREEN
        pixels.data[i + 2] = 255 - pixels.data[i + 2]; // Blue
    }
    return pixels;
}

function rgbSlide(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
        const tmp = pixels.data[i + 0];
        pixels.data[i + 0] = pixels.data[i + 1]; // RED
        pixels.data[i + 1] = pixels.data[i + 2]; // GREEN
        pixels.data[i + 2] = tmp; // Blue
    }
    return pixels;
}

function rgbSlide2(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
        const tmp = pixels.data[i + 0];
        pixels.data[i + 0] = pixels.data[i + 2]; // RED
        pixels.data[i + 2] = pixels.data[i + 1]; // Blue
        pixels.data[i + 1] = tmp; // GREEN
    }
    return pixels;
}

function splitScreen(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i + 0] = pixels.data[pixels.data.length - i - 4]; // RED
        pixels.data[i + 1] = pixels.data[pixels.data.length - i - 3]; // GREEN
        pixels.data[i + 2] = pixels.data[pixels.data.length - i - 2]; // Blue
    }
    return pixels;
}

function crazy(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i + 0] = pixels.data[i * 2 % pixels.data.length]; // RED
        pixels.data[i + 1] = pixels.data[i * 3 % pixels.data.length]; // GREEN
        pixels.data[i + 2] = pixels.data[i * 4 % pixels.data.length]; // Blue
    }
    return pixels;
}
    
function greenScreen(pixels) {
    const levels = {};
  
    document.querySelectorAll('.rgb input').forEach((input) => {
        levels[input.name] = input.value;
    });
  
    for (i = 0; i < pixels.data.length; i = i + 4) {
        red = pixels.data[i + 0];
        green = pixels.data[i + 1];
        blue = pixels.data[i + 2];

        if (red >= levels.rmin
            && green >= levels.gmin
            && blue >= levels.bmin
            && red <= levels.rmax
            && green <= levels.gmax
            && blue <= levels.bmax) {
                // take it out!
                pixels.data[i + 3] = 0;
        }
    }

    return pixels;
}

getVideo();