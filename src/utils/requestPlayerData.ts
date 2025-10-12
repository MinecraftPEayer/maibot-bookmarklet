import { TitleType } from '../lib/enums';

import { PlayerData } from '../../types/main';
import { indexDefine } from '../lib/constant';

export default async function requestPlayerData(e: MessageEvent) {
    let playerData: PlayerData = {
        type: 'playerData',
        data: {
            playerName: '',
            rating: 0,
            title: { type: TitleType.Normal, text: '' },
            avatar: '',
            overviewData: {},
            course: '',
            class: '',
            playCount: { all: 0, current: 0 },
        },
    };
    let data = await fetch('https://maimaidx-eng.com/maimai-mobile/playerData');
    let dom = new DOMParser().parseFromString(await data.text(), 'text/html');
    if (!dom) return null;

    const nameBlock = dom.querySelector('.name_block');
    if (!nameBlock) return null;
    let playerName = nameBlock.textContent;
    playerData.data.playerName = playerName;

    let ratingBlock = dom.querySelector('.rating_block');
    if (!ratingBlock) return null;
    let rating = ratingBlock.textContent;
    playerData.data.rating = parseInt(rating);

    let trophyElement = dom.querySelector('.trophy_inner_block');
    if (!trophyElement) return null;
    let title = {
        text: trophyElement.textContent.replace(/[\t\n]+/g, ''),
        type: TitleType.Normal,
    };
    if (dom.querySelector('.trophy_Normal')) {
        title.type = TitleType.Normal;
    } else if (dom.querySelector('.trophy_Bronze')) {
        title.type = TitleType.Bronze;
    } else if (dom.querySelector('.trophy_Silver')) {
        title.type = TitleType.Silver;
    } else if (dom.querySelector('.trophy_Gold')) {
        title.type = TitleType.Gold;
    } else if (dom.querySelector('.trophy_Rainbow')) {
        title.type = TitleType.Rainbow;
    }
    playerData.data.title = title;

    let avatarURL = (
        dom.querySelector('.basic_block > img') as HTMLImageElement
    )?.src;
    playerData.data.avatar = avatarURL;

    playerData.data.overviewData = {};
    let overviewData = dom.querySelectorAll('.musiccount_block');
    for (let i = 0; i < overviewData.length; i++) {
        const index = indexDefine[i];
        if (typeof index === 'string') {
            let text = overviewData[i]?.textContent || '';
            text = text.replace(/[\t\n]+/g, '').replace(/,/g, '');
            playerData.data.overviewData[index] = text
                .split('/')
                .map((item) => parseInt(item));
        }
    }

    let courseElement = dom.querySelectorAll('.h_35.f_l')[0];
    let classElement = dom.querySelectorAll('.h_35.f_l')[1];
    if (!courseElement || !classElement) return null;
    let courseImage = courseElement.getAttribute('src');
    let classImage = classElement.getAttribute('src');
    if (!courseImage || !classImage) return null;

    playerData.data.course = courseImage;
    playerData.data.class = classImage;

    let playCountElement = dom.querySelector('.m_5.m_b_5.t_r.f_12');
    if (!playCountElement) return null;
    let playCountMsg = playCountElement.innerHTML.replace('<br>', '\n');
    let playCountAll = parseInt(
        playCountMsg.split('\n')[1]?.split('：')[1] || '0',
    );
    let playCountCurrent = parseInt(
        playCountMsg.split('\n')[0]?.split('：')[1] || '0',
    );
    playerData.data.playCount = {
        all: playCountAll,
        current: playCountCurrent,
    };

    return playerData;
}
