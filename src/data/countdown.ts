/* One date drives the hero countdown and the top strip. After it passes both
   hide themselves, so nothing needs a follow-up deploy. */
export const COUNTDOWN_TARGET = '2026-11-25T00:00:00+01:00';

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
  en: { label: 'Countdown', title: 'Revolution, 25 November', date: '25 November', d: 'days', h: 'hrs', m: 'min', s: 'sec', strip: 'Revolution on 25 November', sr: 'Time left until 25 November', sub: 'I\'m not saying more yet. Come back and see.', tick: 'Revolution' },
  pl: { label: 'Odliczanie', title: 'Rewolucja, 25 listopada', date: '25 listopada', d: 'dni', h: 'godz', m: 'min', s: 'sek', strip: 'Rewolucja 25 listopada', sr: 'Czas do 25 listopada', sub: 'Na razie nic więcej nie powiem. Wróć i zobacz.', tick: 'Rewolucja' },
  it: { label: 'Conto alla rovescia', title: 'Rivoluzione, 25 novembre', date: '25 novembre', d: 'giorni', h: 'ore', m: 'min', s: 'sec', strip: 'Rivoluzione il 25 novembre', sr: 'Tempo rimasto al 25 novembre', sub: 'Per ora non dico altro. Torna a vedere.', tick: 'Rivoluzione' },
  de: { label: 'Countdown', title: 'Revolution, 25. November', date: '25. November', d: 'Tage', h: 'Std', m: 'Min', s: 'Sek', strip: 'Revolution am 25. November', sr: 'Zeit bis zum 25. November', sub: 'Mehr verrate ich noch nicht. Schau wieder vorbei.', tick: 'Revolution' },
  dk: { label: 'Nedtælling', title: 'Revolution, 25. november', date: '25. november', d: 'dage', h: 'timer', m: 'min', s: 'sek', strip: 'Revolution den 25. november', sr: 'Tid til 25. november', sub: 'Mere siger jeg ikke endnu. Kom tilbage og se.', tick: 'Revolution' },
  no: { label: 'Nedtelling', title: 'Revolusjon, 25. november', date: '25. november', d: 'dager', h: 'timer', m: 'min', s: 'sek', strip: 'Revolusjon 25. november', sr: 'Tid til 25. november', sub: 'Mer sier jeg ikke ennå. Kom tilbake og se.', tick: 'Revolusjon' },
  jp: { label: 'カウントダウン', title: '革命、11月25日', date: '11月25日', d: '日', h: '時間', m: '分', s: '秒', strip: '11月25日、革命', sr: '11月25日までの残り時間', sub: '今はまだ多くを語りません。またのぞいてください。', tick: '革命' },
  es: { label: 'Cuenta atrás', title: 'Revolución, 25 de noviembre', date: '25 de noviembre', d: 'días', h: 'h', m: 'min', s: 's', strip: 'Revolución el 25 de noviembre', sr: 'Tiempo hasta el 25 de noviembre', sub: 'Aún no digo más. Vuelve a verlo.', tick: 'Revolución' },
  ar: { label: 'العد التنازلي', title: 'ثورة، 25 نوفمبر', date: '25 نوفمبر', d: 'يوم', h: 'ساعة', m: 'دقيقة', s: 'ثانية', strip: 'ثورة في 25 نوفمبر', sr: 'الوقت المتبقي حتى 25 نوفمبر', sub: 'لن أقول المزيد الآن. عد لتشاهد.', tick: 'ثورة' },
};
