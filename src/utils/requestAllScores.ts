import { ChartType, ComboType, DifficultyNumber, SyncType } from '../lib/enums';

import { RecordData } from '../../types/main';

export default async function requestAllScores(e: MessageEvent) {
    let difficulty = e.data.split('__')[1];
    let scoresData: {
        type: 'scoresData';
        data: RecordData;
    } = {
        type: 'scoresData',
        data: { records: [], difficulty: difficulty },
    };
    let scoreData = await fetch(
        `https://maimaidx-eng.com/maimai-mobile/record/musicSort/search/?search=A&sort=1&playCheck=on&diff=${DifficultyNumber[difficulty]}`,
    );
    let playCountData = await fetch(
        `https://maimaidx-eng.com/maimai-mobile/record/musicMybest/search/?diff=${DifficultyNumber[difficulty]}`,
    );

    let scoreDom = new DOMParser().parseFromString(
        await scoreData.text(),
        'text/html',
    );
    let playCountDom = new DOMParser().parseFromString(
        await playCountData.text(),
        'text/html',
    );

    let allRecords = scoreDom.querySelectorAll(
        `.music_${difficulty}_score_back`,
    );
    let allPlayCounts = playCountDom.querySelectorAll(
        `.music_${difficulty}_score_back`,
    );

    let dataScore = [];
    let dataPlayCount = [];

    for (let record of allRecords) {
        let name = record!
            .querySelector('.music_name_block')!
            .textContent.replace(/[\t\n]+/g, '');
        let chartTypeIcon = record!
            .querySelector('.music_kind_icon')!
            .getAttribute('src')!
            .split('?')[0]!
            .split('/')!
            .pop()!
            .replace('.png', '');
        let chartType;
        switch (chartTypeIcon) {
            case 'music_standard':
                chartType = ChartType.STD;
                break;
            case 'music_dx':
                chartType = ChartType.DX;
                break;
            default:
                chartType = '';
                break;
        }

        let level = record.querySelector('.music_lv_block')!.textContent;
        let achievement = parseFloat(
            record
                .querySelectorAll('.music_score_block')[0]!
                .textContent.replace(/[\t\n]+/g, '')
                .replace('%', ''),
        );
        let dxScore = record
            .querySelectorAll('.music_score_block')[1]!
            .textContent.replace(/[\t\n]+/g, '')
            .split('/')
            .map((item) => parseInt(item.replace(/,/g, '')));

        let syncTypeIcon = record!
            .querySelectorAll('.h_30.f_r')[0]!
            .getAttribute('src')!
            .split('?')[0]!
            .split('/')!
            .pop()!
            .replace('.png', '');
        let syncType;
        switch (syncTypeIcon) {
            case 'music_icon_fs':
                syncType = SyncType.FS;
                break;
            case 'music_icon_fsp':
                syncType = SyncType.FSp;
                break;
            case 'music_icon_fdx':
                syncType = SyncType.FDX;
                break;
            case 'music_icon_fdxp':
                syncType = SyncType.FDXp;
                break;
            case 'music_icon_sync':
                syncType = SyncType.SYNC;
                break;
            case 'music_icon_back':
                syncType = SyncType.none;
                break;
            default:
                syncType = SyncType.none;
                break;
        }

        let comboTypeIcon = record!
            .querySelectorAll('.h_30.f_r')[1]!
            .getAttribute('src')!
            .split('?')[0]!
            .split('/')!
            .pop()!
            .replace('.png', '');
        let comboType;
        switch (comboTypeIcon) {
            case 'music_icon_fc':
                comboType = ComboType.FC;
                break;
            case 'music_icon_fcp':
                comboType = ComboType.FCp;
                break;
            case 'music_icon_ap':
                comboType = ComboType.AP;
                break;
            case 'music_icon_app':
                comboType = ComboType.APp;
                break;
            case 'music_icon_back':
                comboType = ComboType.none;
                break;
            default:
                comboType = ComboType.none;
                break;
        }

        dataScore.push({
            name: name,
            chartType: chartType,
            level: level,
            difficulty: DifficultyNumber[difficulty],
            achievement: achievement,
            dxScore: dxScore,
            syncType: syncType,
            comboType: comboType,
            playCount: 0,
        });
    }

    for (let playCountRecord of allPlayCounts) {
        let name = playCountRecord!
            .querySelector('.music_name_block')!
            .textContent.replace(/[\t\n]+/g, '');
        let chartTypeIcon = playCountRecord!
            .querySelector('.music_kind_icon')!
            .getAttribute('src')!
            .split('?')[0]!
            .split('/')!
            .pop()!
            .replace('.png', '');
        let chartType;
        switch (chartTypeIcon) {
            case 'music_standard':
                chartType = ChartType.STD;
                break;
            case 'music_dx':
                chartType = ChartType.DX;
                break;
            default:
                chartType = -1;
                break;
        }
        let playCount = playCountRecord!
            .querySelector('.music_score_block')!
            .textContent.replace(/[\t\n]+/g, '')
            .split('：')[1];
        dataPlayCount.push({
            name: name,
            chartType: chartType,
            difficulty: difficulty,
            playCount: playCount,
        });
    }

    for (let score of dataScore) {
        let playCountRecord = dataPlayCount.find(
            (record) =>
                record.name === score.name &&
                record.chartType === score.chartType &&
                record.difficulty === score.difficulty,
        );
        if (playCountRecord) {
            score.playCount = parseInt(playCountRecord.playCount || '0');
        }
        scoresData.data.records.push(score);
    }

    scoresData.data.difficulty = difficulty;

    return scoresData;
}
