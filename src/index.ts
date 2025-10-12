import requestAllScores from './utils/requestAllScores';
import requestRecentAll from './utils/requestRecentAll';
import requestRecentDetail from './utils/requestRecentDetail';
import requestPlayerData from './utils/requestPlayerData';

const ToolURL = 'https://chart.minecraftpeayer.me/upload-data';

(function () {
    let commentBox = document.querySelector('.comment_block');
    let urlSpan = document.createElement('span');
    let url = document.createElement('a');
    url.href = ToolURL;
    url.innerText = 'Upload Data to maibot';
    url.target = 'ratingChart';
    url.className = 'f_14';
    url.style = 'color: rgb(20, 119, 230);';
    urlSpan.onclick = (e) => {
        let win = window.open(ToolURL, 'ratingChart');

        window.addEventListener('message', async (e) => {
            if (!win) return;

            if (e.data === 'request_playerData') {
                win.postMessage(await requestPlayerData(e), '*');
            }

            if (e.data === 'request_recentAll') {
                win.postMessage(await requestRecentAll(e), '*');
            }

            if (typeof e.data !== 'string') return;
            if (e.data.startsWith('request_recentDetail__')) {
                win.postMessage(await requestRecentDetail(e), '*');
            }

            if (e.data.startsWith('request_allScores__')) {
                win.postMessage(await requestAllScores(e), '*');
            }
        });
    };
    urlSpan.appendChild(url);
    if (commentBox) commentBox.appendChild(urlSpan);
})();
