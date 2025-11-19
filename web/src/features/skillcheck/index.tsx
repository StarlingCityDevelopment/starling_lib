import { useRef, useState } from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import Indicator from './indicator';
import { fetchNui } from '../../utils/fetchNui';
import { Box, createStyles } from '@mantine/core';
import type { GameDifficulty, SkillCheckProps } from '../../typings';

export const circleCircumference = 2 * 50 * Math.PI;

const getRandomAngle = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

const difficultyOffsets = {
  easy: 50,
  medium: 40,
  hard: 25,
};

const useStyles = createStyles((theme, params: { difficultyOffset: number }) => ({
  svg: {
    position: 'absolute',
    top: '50%',
    left: '20%',
    transform: 'translate(-50%, -50%)',
    r: 50,
    width: 500,
    height: 500,
  },
  track: {
    fill: 'transparent',
    stroke: "rgba(115, 115, 115, 0.20)",
    strokeWidth: 8,
    r: 50,
    cx: 250,
    cy: 250,
    strokeDasharray: circleCircumference,
    '@media (min-height: 1440px)': {
      strokeWidth: 10,
      r: 65,
      strokeDasharray: 2 * 65 * Math.PI,
    },
  },
  skillArea: {
    fill: 'transparent',
    stroke: "#ff0000",
    strokeWidth: 8,
    r: 50,
    cx: 250,
    cy: 250,
    strokeDasharray: circleCircumference,
    strokeDashoffset: circleCircumference - (Math.PI * 50 * params.difficultyOffset) / 180,
    '@media (min-height: 1440px)': {
      strokeWidth: 10,
      r: 65,
      strokeDasharray: 2 * 65 * Math.PI,
      strokeDashoffset: 2 * 65 * Math.PI - (Math.PI * 65 * params.difficultyOffset) / 180,
    },
  },
  indicator: {
    stroke: '#FFF',
    strokeWidth: "1.75vh",
    fill: 'transparent',
    filter: "drop-shadow(0 0 14.3px rgba(255, 255, 255, 0.57))",
    r: 50,
    cx: 250,
    cy: 250,
    strokeDasharray: circleCircumference,
    strokeDashoffset: circleCircumference - 3,
    '@media (min-height: 1440px)': {
      strokeWidth: 18,
      r: 65,
      strokeDasharray: 2 * 65 * Math.PI,
      strokeDashoffset: 2 * 65 * Math.PI - 5,
    },
  },
  button: {
    position: 'absolute',
    left: '20%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: "3.1481vh",
    height: "3.1481vh",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: "0.463vh",
    border: "0.0926vh solid rgba(255, 255, 255, 0.18)",
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    color: "#FFF",
    textAlign: "center",
    textShadow: "0 0 2.2315vh rgba(255, 255, 255, 0.79)",
    fontSize: "1.4815vh",
    fontWeight: 600,
  },
  skillCont: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40vh',
    height: '13vh',
    borderRadius: '0.9259vh',
    border: '0.0926vh solid #373737',
    background: 'radial-gradient(140.75% 140.75% at 50% 50%, rgba(26, 27, 30, 0.97) 0%, rgba(8, 8, 9, 0.87) 100%), linear-gradient(156deg, rgba(255, 255, 255, 0.00) 38.82%, rgba(255, 255, 255, 0.10) 131.78%)',
  },
  progbg: {
    display: 'flex',
    marginTop: '1.5vh',
    marginLeft: '3vh',
    position: 'absolute',
    width: '9.9vh',
    height: '9.9vh',
    borderRadius: '8.0556vh',
    background: 'radial-gradient(50% 50% at 50% 50%, rgba(217, 217, 217, 0.00) 57.69%, rgba(115, 115, 115, 0.27) 100%)',
  },
  inText: {
    marginTop: '2.75vh',
    marginLeft: '14.5vh',
    color: '#FFF',
    fontSize: '1.5vh',
    fontWeight: 600,
  },
  inDesc: {
    marginTop: '.5vh',
    marginLeft: '14.5vh',
    color: '#A3A3A3',
    fontSize: '1.0185vh',
    fontWeight: 500,
  },
  inSvg: {
    marginTop: '.25vh',
    marginLeft: '13.6vh',
    display: 'flex',
    width: '2.59vh',
    height: '2.59vh',
  },
  inDesc2: {
    marginTop: '-2.1vh',
    marginLeft: '15.75vh',
    color: 'rgba(255, 255, 255, 0.36)',
    fontSize: '1.0185vh',
    fontWeight: 500,
  },
  inCount: {
    width: '5vh',
    height: '1.75vh',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '4.9074vh',
    background: 'rgba(255, 0, 0, 0.2)',
    paddingTop: '.2vh',
    color: '#ff0000',
    fontSize: '1vh',
    letterSpacing: '.2vh',
    fontWeight: 500,
  },
}));

const SkillCheck: React.FC = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const [totalStages, setTotalStages] = useState(1);
  const [visible, setVisible] = useState(false);
  const dataRef = useRef<{ difficulty: GameDifficulty | GameDifficulty[]; inputs?: string[] } | null>(null);
  const dataIndexRef = useRef<number>(0);
  const [skillCheck, setSkillCheck] = useState<SkillCheckProps>({
    angle: 0,
    difficultyOffset: 50,
    difficulty: 'easy',
    key: 'e',
  });

  const { classes } = useStyles({ difficultyOffset: skillCheck.difficultyOffset });

  useNuiEvent('startSkillCheck', (data: { difficulty: GameDifficulty | GameDifficulty[]; inputs?: string[] }) => {
    setCurrentStage(0);
    setTotalStages(1);
    dataRef.current = data;
    dataIndexRef.current = 0;
    const gameData = Array.isArray(data.difficulty) ? data.difficulty[0] : data.difficulty;
    const offset = typeof gameData === 'object' ? gameData.areaSize : difficultyOffsets[gameData];
    const randomKey = data.inputs ? data.inputs[Math.floor(Math.random() * data.inputs.length)] : 'e';
    setSkillCheck({
      angle: -90 + getRandomAngle(120, 360 - offset),
      difficultyOffset: offset,
      difficulty: gameData,
      keys: data.inputs?.map((input) => input.toLowerCase()),
      key: randomKey.toLowerCase(),
    });

    if (Array.isArray(dataRef.current.difficulty)) {
      const totalStages = dataRef.current.difficulty.length;
      setTotalStages(totalStages);
    }
    setVisible(true);
  });

  useNuiEvent('skillCheckCancel', () => {
    setVisible(false);
    fetchNui('skillCheckOver', false);
  });

  const handleComplete = (success: boolean) => {
    if (!dataRef.current) return;

    if (Array.isArray(dataRef.current.difficulty)) {
      const totalStages = dataRef.current.difficulty.length;
      const currentStage = dataIndexRef.current + 1;

      setCurrentStage(currentStage);
      setTotalStages(totalStages);
    }

    if (!success || !Array.isArray(dataRef.current.difficulty)) {
      setVisible(false);
      return fetchNui('skillCheckOver', success);
    }

    if (dataIndexRef.current >= dataRef.current.difficulty.length - 1) {
      setVisible(false);
      return fetchNui('skillCheckOver', success);
    }

    dataIndexRef.current++;
    const data = dataRef.current.difficulty[dataIndexRef.current];
    const key = dataRef.current.inputs
      ? dataRef.current.inputs[Math.floor(Math.random() * dataRef.current.inputs.length)]
      : 'e';
    const offset = typeof data === 'object' ? data.areaSize : difficultyOffsets[data];
    setSkillCheck((prev) => ({
      ...prev,
      angle: -90 + getRandomAngle(120, 360 - offset),
      difficultyOffset: offset,
      difficulty: data,
      key: key.toLowerCase(),
    }));
  };

  return (
    <>
      {visible && (
        <>
          <div className={classes.skillCont}>
            <svg className={classes.svg}>
              <circle className={classes.track} />
              <circle transform={`rotate(${skillCheck.angle}, 250, 250)`} className={classes.skillArea} />
              <Indicator
                angle={skillCheck.angle}
                offset={skillCheck.difficultyOffset}
                multiplier={
                  skillCheck.difficulty === 'easy'
                    ? 1
                    : skillCheck.difficulty === 'medium'
                      ? 1.5
                      : skillCheck.difficulty === 'hard'
                        ? 1.75
                        : skillCheck.difficulty.speedMultiplier
                }
                handleComplete={handleComplete}
                className={classes.indicator}
                skillCheck={skillCheck}
              />
            </svg>

            <div className={classes.progbg}></div>
            <Box className={classes.button}>{skillCheck.key.toUpperCase()}</Box>

            <div className={classes.inText}>Test de Compétence <span className={classes.inCount}>{currentStage}/{totalStages}</span></div>
            <div className={classes.inDesc}>Appuyez sur le bouton quand le <span style={{ color: "#fff" }}>point blanc</span> atteint la <span style={{ color: "#FF4E62" }}>zone rouge</span></div>

            <svg className={classes.inSvg} xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38" fill="none">
              <g filter="url(#filter0_d_40_160)">
                <circle cx="18.7002" cy="18.7" r="5" fill="#ff0000" />
              </g>
              <defs>
                <filter id="filter0_d_40_160" x="0.000195503" y="1.23978e-05" width="37.4" height="37.4" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                  <feOffset />
                  <feGaussianBlur stdDeviation="6.85" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.305882 0 0 0 0 0.384314 0 0 0 0.35 0" />
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_40_160" />
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_40_160" result="shape" />
                </filter>
              </defs>
            </svg>
            <div className={classes.inDesc2}>Le timing est essentiel..</div>
          </div>
        </>
      )}
    </>
  );
};

export default SkillCheck;
