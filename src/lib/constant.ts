import { Difficulty } from './enums';

const indexDefine = [
    'SSSp',
    'APp',
    'SSS',
    'AP',
    'SSp',
    'FCp',
    'SS',
    'FC',
    'Sp',
    'FDXp',
    'S',
    'FDX',
    'CLEAR',
    'FSp',
    'dxstar_5',
    'FS',
    'dxstar_4',
    'SYNCPLAY',
    'dxstar_3',
    'dxstar_2',
    'dxstar_1',
];

const DifficultyStringId = {
    [Difficulty.Basic]: 'basic',
    [Difficulty.Advanced]: 'advanced',
    [Difficulty.Expert]: 'expert',
    [Difficulty.Master]: 'master',
    [Difficulty.ReMaster]: 'remaster',
};

export { indexDefine, DifficultyStringId };
