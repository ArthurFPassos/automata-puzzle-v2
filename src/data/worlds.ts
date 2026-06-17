import type { World } from '@/types';

export const WORLDS: World[] = [
  {
    id: 1, name: 'Mundo 1', subtitle: 'Fundamentos',
    emoji: '🔵', color: '#6EE7B7', glow: 'rgba(110,231,183,0.22)', accent: '#34D399',
    mechanicLabel: 'Conceitos e Identificação',
  },
  {
    id: 2, name: 'Mundo 2', subtitle: 'Raciocínio',
    emoji: '⚡', color: '#93C5FD', glow: 'rgba(147,197,253,0.22)', accent: '#60A5FA',
    mechanicLabel: 'Transições e Reconhecimento',
  },
  {
    id: 3, name: 'Mundo 3', subtitle: 'Construção',
    emoji: '🏗️', color: '#FCA5A5', glow: 'rgba(252,165,165,0.22)', accent: '#F87171',
    mechanicLabel: 'Montagem de Autômatos',
  },
];

export const getWorld = (id: number): World | undefined =>
  WORLDS.find(w => w.id === id);
