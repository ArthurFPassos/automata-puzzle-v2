import { useState } from 'react';
import type { Screen, Level, World, ProgressMap } from '@/types';
import { ALL_LEVELS, getLevelsByWorld } from '@/data/levels';
import { WORLDS } from '@/data/worlds';
import { MenuScreen }               from '@/screens/MenuScreen';
import { SplashScreen }             from '@/screens/SplashScreen';
import { LevelScreen }              from '@/screens/LevelScreen';
import { GameScreen }               from '@/screens/GameScreen';
import { AchievementsScreen }       from '@/screens/AchievementsScreen';
import { FlashcardLibraryScreen }   from '@/screens/FlashcardLibraryScreen';
import { TrainingModeScreen }       from '@/screens/TrainingModeScreen';
import { useProgress }              from '@/hooks/useProgress';

export default function App() {
  const [screen, setScreen]       = useState<Screen>('menu');
  const [activeWorldId, setActiveWorldId] = useState(1);
  const [activeLevelId, setActiveLevelId] = useState<number | null>(null);
  const { progress, completeLevel } = useProgress();

  const activeLevel  = activeLevelId != null ? ALL_LEVELS.find(l => l.id === activeLevelId) ?? null : null;
  const activeWorld  = WORLDS.find(w => w.id === activeWorldId) ?? WORLDS[0];

  const handleSelectWorld = (worldId: number) => {
    setActiveWorldId(worldId);
    setScreen('levels');
  };

  const handleSelectLevel = (levelId: number) => {
    setActiveLevelId(levelId);
    setScreen('game');
  };

  const handleComplete = (levelId: number, score: number, stars: number, noHint: boolean) => {
    completeLevel(levelId, score, stars, noHint);
    setScreen('levels');
  };

  return (
    <>
      {screen === 'menu' && (
        <MenuScreen
          progress={progress}
          onNavigate={setScreen}
        />
      )}
      {screen === 'splash' && (
        <SplashScreen
          worlds={WORLDS}
          progress={progress}
          onSelectWorld={handleSelectWorld}
          onNavigate={setScreen}
        />
      )}
      {screen === 'worlds' && (
        <SplashScreen
          worlds={WORLDS}
          progress={progress}
          onSelectWorld={handleSelectWorld}
          onNavigate={setScreen}
        />
      )}
      {screen === 'levels' && (
        <LevelScreen
          world={activeWorld}
          levels={getLevelsByWorld(activeWorldId)}
          progress={progress}
          allLevels={ALL_LEVELS}
          onSelectLevel={handleSelectLevel}
          onBack={() => setScreen('worlds')}
          onNavigate={setScreen}
        />
      )}
      {screen === 'game' && activeLevel && (
        <GameScreen
          level={activeLevel}
          world={activeWorld}
          progress={progress}
          onComplete={handleComplete}
          onBack={() => setScreen('levels')}
          onNavigate={setScreen}
        />
      )}
      {screen === 'achievements' && (
        <AchievementsScreen
          progress={progress}
          onBack={() => setScreen('worlds')}
        />
      )}
      {screen === 'flashcards' && (
        <FlashcardLibraryScreen onNavigate={setScreen} />
      )}
      {screen === 'training' && (
        <TrainingModeScreen onNavigate={setScreen} />
      )}
    </>
  );
}
