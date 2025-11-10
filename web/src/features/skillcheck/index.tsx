import { useRef, useState, useCallback } from 'react';
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

const useStyles = createStyles((theme) => ({
  svg: {
    color: 'white',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    height: 500,
  },
  track: {
    color: 'white',
    fill: 'transparent',
    stroke: 'rgba(0, 0, 0, 0.65)',
    strokeWidth: 8,
    '@media (min-height: 1440px)': {
      strokeWidth: 10,
    },
  },
  skillArea: {
    color: 'white',
    fill: 'transparent',
    stroke: theme.fn.primaryColor(),
    strokeWidth: 8,
    strokeLinecap: 'round',
    '@media (min-height: 1440px)': {
      strokeWidth: 10,
    },
  },
  indicator: {
    color: 'white',
    stroke: 'red',
    strokeWidth: 16,
    fill: 'transparent',
    '@media (min-height: 1440px)': {
      strokeWidth: 18,
    },
  },
  button: {
    color: 'white',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    width: 32,
    height: 32,
    textAlign: 'center',
    borderRadius: 5,
    fontSize: 20,
    fontWeight: 500,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '@media (min-height: 1440px)': {
      width: 30,
      height: 30,
      fontSize: 22,
    },
  },
}));

const SkillCheck: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const dataRef = useRef<{ difficulty: GameDifficulty | GameDifficulty[]; inputs?: string[] } | null>(null);
  const dataIndexRef = useRef<number>(0);
  const [skillCheck, setSkillCheck] = useState<SkillCheckProps>({
    angle: 0,
    difficultyOffset: 50,
    difficulty: 'easy',
    key: 'e',
  });
  const { classes } = useStyles();

  useNuiEvent('startSkillCheck', (data: { difficulty: GameDifficulty | GameDifficulty[]; inputs?: string[] }) => {
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

    setVisible(true);
  });

  useNuiEvent('skillCheckCancel', () => {
    setVisible(false);
    fetchNui('skillCheckOver', false);
  });

  const handleComplete = useCallback((success: boolean) => {
    if (!dataRef.current) return;
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
  }, []);

  return (
    <>
      {visible && (
        <>
          <svg className={classes.svg} viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
            <circle className={classes.track} cx={250} cy={250} r={50} strokeDasharray={circleCircumference} />
            <circle
              transform={`rotate(${skillCheck.angle}, 250, 250)`}
              className={classes.skillArea}
              cx={250}
              cy={250}
              r={50}
              strokeDasharray={circleCircumference}
              strokeDashoffset={circleCircumference - (Math.PI * 50 * skillCheck.difficultyOffset) / 180}
            />
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
          <Box className={classes.button}>{skillCheck.key.toUpperCase()}</Box>
        </>
      )}
    </>
  );
};

export default SkillCheck;
