/* One date drives the hero countdown and the top strip. After it passes both
   hide themselves, so nothing needs a follow-up deploy. */
export const COUNTDOWN_TARGET = '2026-11-24T00:00:00+01:00';

type Copy = {
  label: string;
  title: string;
  date: string;
  d: string;
  h: string;
  m: string;
  s: string;
  strip: string;
  sr: string;
};

export const COUNTDOWN_COPY: Record<string, Copy> = {
  en: { label: 'Countdown', title: 'The revolution', date: '24 November', d: 'days', h: 'hrs', m: 'min', s: 'sec', strip: 'The revolution is on 24 November', sr: 'Time left until 24 November' },
  pl: { label: 'Odliczanie', title: 'Rewolucja', date: '24 listopada', d: 'dni', h: 'godz', m: 'min', s: 'sek', strip: 'Rewolucja 24 listopada', sr: 'Czas do 24 listopada' },
  it: { label: 'Conto alla rovescia', title: 'La rivoluzione', date: '24 novembre', d: 'giorni', h: 'ore', m: 'min', s: 'sec', strip: 'La rivoluzione è il 24 novembre', sr: 'Tempo rimasto al 24 novembre' },
  de: { label: 'Countdown', title: 'Die Revolution', date: '24. November', d: 'Tage', h: 'Std', m: 'Min', s: 'Sek', strip: 'Die Revolution beginnt am 24. November', sr: 'Zeit bis zum 24. November' },
  dk: { label: 'Nedtælling', title: 'Revolutionen', date: '24. november', d: 'dage', h: 'timer', m: 'min', s: 'sek', strip: 'Revolutionen starter 24. november', sr: 'Tid til 24. november' },
  no: { label: 'Nedtelling', title: 'Revolusjonen', date: '24. november', d: 'dager', h: 'timer', m: 'min', s: 'sek', strip: 'Revolusjonen starter 24. november', sr: 'Tid til 24. november' },
  jp: { label: 'カウントダウン', title: '革命', date: '11月24日', d: '日', h: '時間', m: '分', s: '秒', strip: '11月24日に革命が始まります', sr: '11月24日までの残り時間' },
  es: { label: 'Cuenta atrás', title: 'La revolución', date: '24 de noviembre', d: 'días', h: 'h', m: 'min', s: 's', strip: 'La revolución es el 24 de noviembre', sr: 'Tiempo hasta el 24 de noviembre' },
  ar: { label: 'العد التنازلي', title: 'الثورة', date: '24 نوفمبر', d: 'يوم', h: 'ساعة', m: 'دقيقة', s: 'ثانية', strip: 'الثورة في 24 نوفمبر', sr: 'الوقت المتبقي حتى 24 نوفمبر' },
};
