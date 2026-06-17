import type { Level, Activity } from '@/types';
import { QuizActivityView } from './QuizActivityView';
import { MatchActivityView } from './MatchActivityView';
import { OrderActivityView } from './OrderActivityView';
import { IdentifyActivityView } from './IdentifyActivityView';
import { SelectElementsActivityView } from './SelectElementsActivityView';
import { DragDropActivityView } from './DragDropActivityView';
import { FillDiagramActivityView } from './FillDiagramActivityView';
import { BuildAutomatonActivityView } from './BuildAutomatonActivityView';

interface Props {
  activity: Activity;
  level: Level;
  worldColor: string;
  onResult: (correct: boolean) => void;
  locked: boolean;
}

export function ActivityRenderer({ activity, level, worldColor, onResult, locked }: Props) {
  const shared = { worldColor, onResult, locked };

  switch (activity.type) {
    case 'quiz':
      return <QuizActivityView activity={activity} {...shared} />;
    case 'match':
      return <MatchActivityView activity={activity} {...shared} />;
    case 'order':
      return <OrderActivityView activity={activity} {...shared} />;
    case 'identify':
      return <IdentifyActivityView activity={activity} level={level} {...shared} />;
    case 'select-elements':
      return <SelectElementsActivityView activity={activity} level={level} {...shared} />;
    case 'dragdrop':
      return <DragDropActivityView activity={activity} level={level} {...shared} />;
    case 'fill-diagram':
      return <FillDiagramActivityView activity={activity} level={level} {...shared} />;
    case 'build-automaton':
      return <BuildAutomatonActivityView activity={activity} {...shared} />;
    default:
      return null;
  }
}
