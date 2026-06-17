import { useState } from 'react';
import { FLASHCARDS } from '@/data/flashcards';
import { WORLDS } from '@/data/worlds';
import type { Screen } from '@/types';
import { FONT_MONO, FONT_SANS, COLOR } from '@/styles/tokens';

interface Props {
  onNavigate: (s: Screen) => void;
}

export function FlashcardLibraryScreen({ onNavigate }: Props) {
  const [filterWorld, setFilterWorld] = useState<number | 'all'>('all');
  const [flipped, setFlipped] = useState<Set<string>>(new Set());

  const cards = filterWorld === 'all'
    ? FLASHCARDS
    : FLASHCARDS.filter(f => f.world === filterWorld);

  const toggleFlip = (id: string) =>
    setFlipped(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div className="min-h-screen" style={{ background: COLOR.base, fontFamily: FONT_SANS }}>
      {/* Header */}
      <div className="sticky top-0 z-10 px-4 pt-4 pb-3 border-b" style={{ borderColor: COLOR.border, background: COLOR.base }}>
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => onNavigate('worlds')}
                  className="w-8 h-8 rounded-lg border flex items-center justify-center text-slate-400 hover:text-white"
                  style={{ borderColor: COLOR.border }}>
            ←
          </button>
          <div>
            <h1 className="text-white font-black text-lg" style={{ fontFamily: FONT_MONO }}>📚 Biblioteca de Flashcards</h1>
            <p className="text-slate-500 text-xs" style={{ fontFamily: FONT_MONO }}>{cards.length} cartões</p>
          </div>
          <button
            onClick={() => onNavigate('training')}
            className="ml-auto px-4 py-2 rounded-xl font-black text-xs transition-all hover:scale-105"
            style={{ fontFamily: FONT_MONO, background: 'linear-gradient(135deg,#6EE7B7,#34D399)', color: '#020817' }}
          >
            🎯 MODO TREINO
          </button>
        </div>

        {/* World filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setFilterWorld('all')}
            className="px-3 py-1.5 rounded-lg border text-xs font-bold shrink-0 transition-all"
            style={{
              fontFamily: FONT_MONO,
              borderColor: filterWorld === 'all' ? '#6EE7B7' : COLOR.border,
              background: filterWorld === 'all' ? '#6EE7B722' : COLOR.card2,
              color: filterWorld === 'all' ? '#6EE7B7' : COLOR.dim,
            }}
          >
            Todos ({FLASHCARDS.length})
          </button>
          {WORLDS.map(w => {
            const count = FLASHCARDS.filter(f => f.world === w.id).length;
            return (
              <button
                key={w.id}
                onClick={() => setFilterWorld(w.id)}
                className="px-3 py-1.5 rounded-lg border text-xs font-bold shrink-0 transition-all"
                style={{
                  fontFamily: FONT_MONO,
                  borderColor: filterWorld === w.id ? w.color : COLOR.border,
                  background: filterWorld === w.id ? `${w.color}22` : COLOR.card2,
                  color: filterWorld === w.id ? w.color : COLOR.dim,
                }}
              >
                {w.emoji} {w.subtitle} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Cards grid */}
      <div className="p-4 flex flex-col gap-3 max-w-2xl mx-auto">
        {cards.map(card => {
          const isFlipped = flipped.has(card.id);
          const world = WORLDS.find(w => w.id === card.world)!;
          return (
            <div
              key={card.id}
              onClick={() => toggleFlip(card.id)}
              className="rounded-2xl border p-4 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
              style={{
                borderColor: isFlipped ? world.color : COLOR.border,
                background: isFlipped ? `${world.color}11` : COLOR.card,
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ fontFamily: FONT_MONO, background: `${world.color}22`, color: world.color }}>
                  {world.emoji} {world.subtitle}
                </span>
                <span className="text-[10px] text-slate-600" style={{ fontFamily: FONT_MONO }}>
                  {isFlipped ? 'toque para ver frente' : 'toque para virar'}
                </span>
              </div>

              {!isFlipped ? (
                <div>
                  <p className="text-white font-black text-base leading-tight" style={{ fontFamily: FONT_MONO }}>
                    {card.term}
                  </p>
                  {card.example && (
                    <p className="text-slate-600 text-xs mt-1 italic" style={{ fontFamily: FONT_MONO }}>
                      ex: {card.example}
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {card.definition}
                  </p>
                  {card.example && (
                    <div className="mt-2 px-3 py-2 rounded-lg"
                         style={{ background: `${world.color}15`, borderLeft: `3px solid ${world.color}` }}>
                      <p className="text-slate-400 text-xs" style={{ fontFamily: FONT_MONO }}>
                        {card.example}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
