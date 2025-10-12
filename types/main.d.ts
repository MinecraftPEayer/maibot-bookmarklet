export type PlayerData = {
    type: 'playerData';
    data: {
        playerName: string;
        rating: number;
        title: {
            type: TitleType;
            text: string;
        };
        avatar: string;
        overviewData: {
            [key in OverviewDataIndex]: number[];
        };
        course: string;
        class: string;
        playCount: {
            all: number;
            current: number;
        };
    };
};

export type RecentRecordData = {
    records: RecentRecord[];
};

type RecentRecord = {
    track: number;
    time: Date;
    difficulty: Difficulty;
    songName: string;
    level: string;
    chartType: ChartType;
    achievement: number;
    achievementNewRecord: boolean;
    dxScore: number[];
    dxStar: number;
    fcType: ComboType;
    syncType: SyncType;
    idx: string | null;
};

export type RecordData = {
    records: ScoreRecord[];
    difficulty: string;
};

type ScoreRecord = {
    name: string;
    chartType: ChartType;
    level: string;
    difficulty: Difficulty;
    achievement: number;
    dxScore: number[];
    syncType: SyncType;
    comboType: ComboType;
    playCount: number;
};
