import {addCreateDocumentOption} from '../../utils/add-create-document-option';

export function renderAudioNodeToDOM(node, options = {}) {
    addCreateDocumentOption(options);

    const document = options.createDocument();

    if (!node.getSrc() || node.getSrc().trim() === '') {
        return {element: document.createElement('span'), type: 'inner'};
    }

    return frontendTemplate(node, document);
}

function frontendTemplate(node, document) {
    let thumbnailCls = 'kg-audio-thumbnail';
    let emptyThumbnailCls = 'kg-audio-thumbnail placeholder';
    if (!node.getThumbnailSrc()) {
        thumbnailCls += ' kg-audio-hide';
    } else {
        emptyThumbnailCls += ' kg-audio-hide';
    }

    const cardDiv = document.createElement('div');
    cardDiv.setAttribute('class', 'kg-card kg-audio-card');
    const img = document.createElement('img');
    img.src = node.getThumbnailSrc();
    img.alt = 'audio-thumbnail';
    img.setAttribute('class', thumbnailCls);
    cardDiv.appendChild(img);

    const emptyThumbnailDiv = document.createElement('div');
    emptyThumbnailDiv.setAttribute('class', emptyThumbnailCls);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '24');
    svg.setAttribute('height', '24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path1.setAttribute('fill-rule', 'evenodd');
    path1.setAttribute('clip-rule', 'evenodd');
    path1.setAttribute('d', 'M7.5 15.33a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm-2.25.75a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM15 13.83a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm-2.25.75a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0Z');
    svg.appendChild(path1);
    const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path2.setAttribute('fill-rule', 'evenodd');
    path2.setAttribute('clip-rule', 'evenodd');
    path2.setAttribute('d', 'M14.486 6.81A2.25 2.25 0 0 1 17.25 9v5.579a.75.75 0 0 1-1.5 0v-5.58a.75.75 0 0 0-.932-.727.755.755 0 0 1-.059.013l-4.465.744a.75.75 0 0 0-.544.72v6.33a.75.75 0 0 1-1.5 0v-6.33a2.25 2.25 0 0 1 1.763-2.194l4.473-.746Z');
    svg.appendChild(path2);
    const path3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path3.setAttribute('fill-rule', 'evenodd');
    path3.setAttribute('clip-rule', 'evenodd');
    path3.setAttribute('d', 'M3 1.5a.75.75 0 0 0-.75.75v19.5a.75.75 0 0 0 .75.75h18a.75.75 0 0 0 .75-.75V5.133a.75.75 0 0 0-.225-.535l-.002-.002-3-2.883A.75.75 0 0 0 18 1.5H3ZM1.409.659A2.25 2.25 0 0 1 3 0h15a2.25 2.25 0 0 1 1.568.637l.003.002 3 2.883a2.25 2.25 0 0 1 .679 1.61V21.75A2.25 2.25 0 0 1 21 24H3a2.25 2.25 0 0 1-2.25-2.25V2.25c0-.597.237-1.169.659-1.591Z');
    svg.appendChild(path3);
    emptyThumbnailDiv.appendChild(svg);

    cardDiv.appendChild(emptyThumbnailDiv);

    const audioPlayerContainer = document.createElement('div');
    audioPlayerContainer.setAttribute('class', 'kg-audio-player-container');

    const audioElement = document.createElement('audio');
    audioElement.setAttribute('src', node.getSrc());
    audioElement.setAttribute('preload', 'metadata');
    audioPlayerContainer.appendChild(audioElement);

    const audioTitle = document.createElement('div');
    audioTitle.setAttribute('class', 'kg-audio-title');
    audioTitle.textContent = node.getTitle();
    audioPlayerContainer.appendChild(audioTitle);

    const audioPlayer = document.createElement('div');
    audioPlayer.setAttribute('class', 'kg-audio-player');
    const audioPlayIcon = document.createElement('button');
    audioPlayIcon.setAttribute('class', 'kg-audio-play-icon');
    const audioPlayIconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    audioPlayIconSvg.setAttribute('viewBox', '0 0 24 24');
    audioPlayIconSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const playPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    playPath.setAttribute('d', 'M23.14 10.608 2.253.164A1.559 1.559 0 0 0 0 1.557v20.887a1.558 1.558 0 0 0 2.253 1.392L23.14 13.393a1.557 1.557 0 0 0 0-2.785Z');
    audioPlayIconSvg.appendChild(playPath);
    audioPlayIcon.appendChild(audioPlayIconSvg);
    audioPlayer.appendChild(audioPlayIcon);

    const audioPauseIcon = document.createElement('button');
    audioPauseIcon.setAttribute('class', 'kg-audio-pause-icon kg-audio-hide');
    const audioPauseIconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    audioPauseIconSvg.setAttribute('viewBox', '0 0 24 24');
    audioPauseIconSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const rectSvg = document.createElement('rect');
    rectSvg.setAttribute('x', '3');
    rectSvg.setAttribute('y', '1');
    rectSvg.setAttribute('width', '7');
    rectSvg.setAttribute('height', '22');
    rectSvg.setAttribute('rx', '1.5');
    rectSvg.setAttribute('ry', '1.5');
    audioPauseIconSvg.appendChild(rectSvg);
    const rectSvg2 = document.createElement('rect');
    rectSvg2.setAttribute('x', '14');
    rectSvg2.setAttribute('y', '1');
    rectSvg2.setAttribute('width', '7');
    rectSvg2.setAttribute('height', '22');
    rectSvg2.setAttribute('rx', '1.5');
    rectSvg2.setAttribute('ry', '1.5');
    audioPauseIconSvg.appendChild(rectSvg2);
    audioPauseIcon.appendChild(audioPauseIconSvg);
    audioPlayer.appendChild(audioPauseIcon);

    const audioDuration = document.createElement('span');
    audioDuration.setAttribute('class', 'kg-audio-current-time');
    audioDuration.textContent = '0:00';
    audioPlayer.appendChild(audioDuration);

    const audioDurationTotal = document.createElement('div');
    audioDurationTotal.setAttribute('class', 'kg-audio-time');
    audioDurationTotal.textContent = '/';
    const audioDUrationNode = document.createElement('span');
    audioDUrationNode.setAttribute('class', 'kg-audio-duration');
    audioDUrationNode.textContent = node.getDuration();
    audioDurationTotal.appendChild(audioDUrationNode);
    audioPlayer.appendChild(audioDurationTotal);

    const audioSlider = document.createElement('input');
    audioSlider.setAttribute('type', 'range');
    audioSlider.setAttribute('class', 'kg-audio-seek-slider');
    audioSlider.setAttribute('max', '100');
    audioSlider.setAttribute('value', '0');
    audioPlayer.appendChild(audioSlider);

    const playbackRate = document.createElement('button');
    playbackRate.setAttribute('class', 'kg-audio-playback-rate');
    playbackRate.innerHTML = '1&#215;'; // innerHTML not textContent because we need the HTML entity
    audioPlayer.appendChild(playbackRate);

    const unmuteIcon = document.createElement('button');
    unmuteIcon.setAttribute('class', 'kg-audio-unmute-icon');
    const unmuteIconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    unmuteIconSvg.setAttribute('viewBox', '0 0 24 24');
    unmuteIconSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const unmutePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    unmutePath.setAttribute('d', 'M15.189 2.021a9.728 9.728 0 0 0-7.924 4.85.249.249 0 0 1-.221.133H5.25a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h1.794a.249.249 0 0 1 .221.133 9.73 9.73 0 0 0 7.924 4.85h.06a1 1 0 0 0 1-1V3.02a1 1 0 0 0-1.06-.998Z');
    unmuteIconSvg.appendChild(unmutePath);
    unmuteIcon.appendChild(unmuteIconSvg);
    audioPlayer.appendChild(unmuteIcon);

    const muteIcon = document.createElement('button');
    muteIcon.setAttribute('class', 'kg-audio-mute-icon kg-audio-hide');
    const muteIconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    muteIconSvg.setAttribute('viewBox', '0 0 24 24');
    muteIconSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const mutePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    mutePath.setAttribute('d', 'M16.177 4.3a.248.248 0 0 0 .073-.176v-1.1a1 1 0 0 0-1.061-1 9.728 9.728 0 0 0-7.924 4.85.249.249 0 0 1-.221.133H5.25a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h.114a.251.251 0 0 0 .177-.073ZM23.707 1.706A1 1 0 0 0 22.293.292l-22 22a1 1 0 0 0 0 1.414l.009.009a1 1 0 0 0 1.405-.009l6.63-6.631A.251.251 0 0 1 8.515 17a.245.245 0 0 1 .177.075 10.081 10.081 0 0 0 6.5 2.92 1 1 0 0 0 1.061-1V9.266a.247.247 0 0 1 .073-.176Z');
    muteIconSvg.appendChild(mutePath);
    muteIcon.appendChild(muteIconSvg);
    audioPlayer.appendChild(muteIcon);

    const volumeSlider = document.createElement('input');
    volumeSlider.setAttribute('type', 'range');
    volumeSlider.setAttribute('class', 'kg-audio-volume-slider');
    volumeSlider.setAttribute('max', '100');
    volumeSlider.setAttribute('value', '100');
    audioPlayer.appendChild(volumeSlider);

    audioPlayerContainer.appendChild(audioPlayer);
    cardDiv.appendChild(audioPlayerContainer);

    return {element: cardDiv};
}
