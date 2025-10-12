import { DifficultyStringId } from '../lib/constant';
import { Difficulty, ChartType, ComboType, SyncType } from '../lib/enums';

export default async function requestRecentDetail(e: MessageEvent) {
    let idx = e.data.split('__')[1];
    let recentDetailData = { type: 'recentDetail', data: {} };
    let data = await fetch(
        `https://maimaidx-eng.com/maimai-mobile/record/playlogDetail?idx=${idx}`,
    );
    let dom = new DOMParser().parseFromString(await data.text(), 'text/html');

    let record = dom.querySelector('.p_10.t_l.f_0.v_b');
    let track = parseInt(
        record!
            .querySelectorAll(
                '.playlog_top_container.p_r > .sub_title > span',
            )[0]
            ?.textContent.replace(/TRACK /g, '') || '-1',
    );
    let time = new Date(
        `${record!.querySelectorAll('.playlog_top_container.p_r > .sub_title > span')[1]?.textContent} GMT+9`,
    );

    let difficulty;
    if (record!.querySelector('.playlog_remaster_container'))
        difficulty = Difficulty.ReMaster;
    else if (record!.querySelector('.playlog_master_container'))
        difficulty = Difficulty.Master;
    else if (record!.querySelector('.playlog_expert_container'))
        difficulty = Difficulty.Expert;
    else if (record!.querySelector('.playlog_advanced_container'))
        difficulty = Difficulty.Advanced;
    else difficulty = Difficulty.Basic;

    let songName = record!
        .querySelector(
            `.playlog_${DifficultyStringId[difficulty]}_container > .basic_block`,
        )!
        .textContent.replace(
            record!.querySelector('.w_80.f_r > .music_lv_back')!.textContent,
            '',
        )
        .replace(/[\t\n]+/g, '');

    let level = record!.querySelector(
        '.w_80.f_r > .music_lv_back',
    )!.textContent;

    let chartType;
    let chartTypeSrc = record!
        .querySelector('.playlog_music_kind_icon')!
        .getAttribute('src')!
        .split('?')[0]!
        .split('/');
    switch (chartTypeSrc[chartTypeSrc.length - 1]?.replace('.png', '')) {
        case 'music_standard':
            chartType = ChartType.STD;
            break;
        case 'music_dx':
            chartType = ChartType.DX;
            break;
    }

    let achievement = parseFloat(
        record!
            .querySelector('.playlog_achievement_txt')!
            .textContent.replace('%', ''),
    );
    let achievementNewRecord = !!record!.querySelector(
        '.playlog_achievement_newrecord',
    );

    console.log(record!.querySelector('.playlog_score_block')!.textContent);
    let dxScore = record!
        .querySelector('.playlog_score_block')!
        .textContent.replace(/[\t\n]+/g, '')
        .split('/')
        .map((item) => parseInt(item.replace(/,/g, '')));
    let dxScoreNewRecord = !!record!.querySelector(
        '.playlog_deluxscore_newrecord',
    );
    let dxStar;
    if (record!.querySelector('.playlog_deluxscore_star') === null) {
        dxStar = 0;
    } else {
        let srcArray = record!
            .querySelector('.playlog_deluxscore_star')!
            .getAttribute('src')!
            .split('?')[0]!
            .split('/');
        switch (srcArray[srcArray.length - 1]?.replace('.png', '')) {
            case 'dxstar_1':
                dxStar = 1;
                break;
            case 'dxstar_2':
                dxStar = 2;
                break;
            case 'dxstar_3':
                dxStar = 3;
                break;
            case 'dxstar_4':
                dxStar = 4;
                break;
            case 'dxstar_5':
                dxStar = 5;
                break;
            default:
                dxStar = 0;
                break;
        }
    }

    let fcType;
    let fcTypeSrc = record!
        .querySelectorAll('.playlog_result_innerblock > img')[0]!
        .getAttribute('src')!
        .split('?')[0]!
        .split('/');
    switch (fcTypeSrc[fcTypeSrc.length - 1]?.replace('.png', '')) {
        case 'fc':
            fcType = ComboType.FC;
            break;
        case 'fcplus':
            fcType = ComboType.FCp;
            break;
        case 'ap':
            fcType = ComboType.AP;
            break;
        case 'applus':
            fcType = ComboType.APp;
            break;
        default:
            fcType = ComboType.none;
            break;
    }

    let syncType;
    let syncTypeSrc = record!
        .querySelectorAll('.playlog_result_innerblock > img')[1]!
        .getAttribute('src')!
        .split('?')[0]!
        .split('/');
    switch (syncTypeSrc[syncTypeSrc.length - 1]?.replace('.png', '')) {
        case 'sync':
            syncType = SyncType.SYNC;
            break;
        case 'fs':
            syncType = SyncType.FS;
            break;
        case 'fsplus':
            syncType = SyncType.FSp;
            break;
        case 'fsd':
            syncType = SyncType.FDX;
            break;
        case 'fsdplus':
            syncType = SyncType.FDXp;
            break;
        default:
            syncType = SyncType.none;
            break;
    }

    let noteDetail: Record<string, string[]> = {};
    let noteDetailElement = dom.querySelector('.playlog_notes_detail');
    let notes = ['', 'tap', 'hold', 'slide', 'touch', 'break'];
    for (let i = 1; i < notes.length; i++) {
        let thisNote = noteDetailElement!.querySelectorAll('tr')[i];
        let countElement = thisNote!.querySelectorAll('td');
        countElement.forEach((element) => {
            let count =
                element.textContent.trim().length === 0
                    ? '-'
                    : element.textContent.trim();
            if (!noteDetail[notes[i] || 0]) {
                noteDetail[notes[i] || 0] = [];
            }
            noteDetail[notes[i] || 0]?.push(count);
        });
    }

    let combo = dom
        .querySelectorAll(
            '.gray_block > .p_5 > .col2 > .playlog_score_block',
        )[0]!
        .textContent.replace(/[\t\n]+/g, '')
        .split('/')
        .map((item) => parseInt(item));
    let sync = dom
        .querySelectorAll(
            '.gray_block > .p_5 > .col2 > .playlog_score_block',
        )[1]!
        .textContent.replace(/[\t\n]+/g, '')
        .split('/')
        .map((item) => parseInt(item));

    let fastLate: number[] = [];
    let fastLateElement = dom
        .querySelectorAll('.playlog_fl_block > .w_96.f_l.t_r > .p_t_5')
        .forEach((element) =>
            fastLate.push(
                parseInt(element.textContent.replace(/[\t\n]+/g, '')),
            ),
        );

    recentDetailData.data = {
        track: track,
        time: time,
        difficulty: difficulty,
        chartType: chartType,
        level: level,
        songName: songName,
        achievement: achievement,
        achievementNewRecord: achievementNewRecord,
        dxScore: dxScore,
        dxScoreNewRecord: dxScoreNewRecord,
        dxStar: dxStar,
        fcType: fcType,
        syncType: syncType,
        fastLate: {
            fast: fastLate[0],
            late: fastLate[1],
        },
        idx: idx,
        noteDetail: noteDetail,
        combo: combo,
        sync: sync,
    };

    return recentDetailData;
}
