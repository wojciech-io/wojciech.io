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
  sub: string;
  tick: string;
};

export const COUNTDOWN_COPY: Record<string, Copy> = {
  en: { label: 'Countdown', title: 'Revolution, 24 November', date: '24 November', d: 'days', h: 'hrs', m: 'min', s: 'sec', strip: 'Revolution on 24 November', sr: 'Time left until 24 November', sub: 'I\'m not saying more yet. Come back and see.', tick: 'Revolution' },
  pl: { label: 'Odliczanie', title: 'Rewolucja, 24 listopada', date: '24 listopada', d: 'dni', h: 'godz', m: 'min', s: 'sek', strip: 'Rewolucja 24 listopada', sr: 'Czas do 24 listopada', sub: 'Na razie nic więcej nie powiem. Wróć i zobacz.', tick: 'Rewolucja' },
  it: { label: 'Conto alla rovescia', title: 'Rivoluzione, 24 novembre', date: '24 novembre', d: 'giorni', h: 'ore', m: 'min', s: 'sec', strip: 'Rivoluzione il 24 novembre', sr: 'Tempo rimasto al 24 novembre', sub: 'Per ora non dico altro. Torna a vedere.', tick: 'Rivoluzione' },
  de: { label: 'Countdown', title: 'Revolution, 24. November', date: '24. November', d: 'Tage', h: 'Std', m: 'Min', s: 'Sek', strip: 'Revolution am 24. November', sr: 'Zeit bis zum 24. November', sub: 'Mehr verrate ich noch nicht. Schau wieder vorbei.', tick: 'Revolution' },
  dk: { label: 'Nedtælling', title: 'Revolution, 24. november', date: '24. november', d: 'dage', h: 'timer', m: 'min', s: 'sek', strip: 'Revolution den 24. november', sr: 'Tid til 24. november', sub: 'Mere siger jeg ikke endnu. Kom tilbage og se.', tick: 'Revolution' },
  no: { label: 'Nedtelling', title: 'Revolusjon, 24. november', date: '24. november', d: 'dager', h: 'timer', m: 'min', s: 'sek', strip: 'Revolusjon 24. november', sr: 'Tid til 24. november', sub: 'Mer sier jeg ikke ennå. Kom tilbake og se.', tick: 'Revolusjon' },
  jp: { label: 'カウントダウン', title: '革命、11月24日', date: '11月24日', d: '日', h: '時間', m: '分', s: '秒', strip: '11月24日、革命', sr: '11月24日までの残り時間', sub: '今はまだ多くを語りません。またのぞいてください。', tick: '革命' },
  es: { label: 'Cuenta atrás', title: 'Revolución, 24 de noviembre', date: '24 de noviembre', d: 'días', h: 'h', m: 'min', s: 's', strip: 'Revolución el 24 de noviembre', sr: 'Tiempo hasta el 24 de noviembre', sub: 'Aún no digo más. Vuelve a verlo.', tick: 'Revolución' },
  ar: { label: 'العد التنازلي', title: 'ثورة، 24 نوفمبر', date: '24 نوفمبر', d: 'يوم', h: 'ساعة', m: 'دقيقة', s: 'ثانية', strip: 'ثورة في 24 نوفمبر', sr: 'الوقت المتبقي حتى 24 نوفمبر', sub: 'لن أقول المزيد الآن. عد لتشاهد.', tick: 'ثورة' },
};
