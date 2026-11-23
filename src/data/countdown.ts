/* One date drives the hero countdown and the top strip. After it passes both
   hide themselves, so nothing needs a follow-up deploy. */
export const COUNTDOWN_TARGET = '2026-12-01T00:00:00+01:00';

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
  en: { label: 'Countdown', title: 'Revolution, 1 December', date: '1 December', d: 'days', h: 'hrs', m: 'min', s: 'sec', strip: 'Revolution on 1 December', sr: 'Time left until 1 December', sub: 'I\'m not saying more yet. Come back and see.', tick: 'Revolution' },
  pl: { label: 'Odliczanie', title: 'Rewolucja, 1 grudnia', date: '1 grudnia', d: 'dni', h: 'godz', m: 'min', s: 'sek', strip: 'Rewolucja 1 grudnia', sr: 'Czas do 1 grudnia', sub: 'Na razie nic więcej nie powiem. Wróć i zobacz.', tick: 'Rewolucja' },
  it: { label: 'Conto alla rovescia', title: 'Rivoluzione, 1° dicembre', date: '1° dicembre', d: 'giorni', h: 'ore', m: 'min', s: 'sec', strip: 'Rivoluzione il 1° dicembre', sr: 'Tempo rimasto al 1° dicembre', sub: 'Per ora non dico altro. Torna a vedere.', tick: 'Rivoluzione' },
  de: { label: 'Countdown', title: 'Revolution, 1. Dezember', date: '1. Dezember', d: 'Tage', h: 'Std', m: 'Min', s: 'Sek', strip: 'Revolution am 1. Dezember', sr: 'Zeit bis zum 1. Dezember', sub: 'Mehr verrate ich noch nicht. Schau wieder vorbei.', tick: 'Revolution' },
  dk: { label: 'Nedtælling', title: 'Revolution, 1. december', date: '1. december', d: 'dage', h: 'timer', m: 'min', s: 'sek', strip: 'Revolution den 1. december', sr: 'Tid til 1. december', sub: 'Mere siger jeg ikke endnu. Kom tilbage og se.', tick: 'Revolution' },
  no: { label: 'Nedtelling', title: 'Revolusjon, 1. desember', date: '1. desember', d: 'dager', h: 'timer', m: 'min', s: 'sek', strip: 'Revolusjon 1. desember', sr: 'Tid til 1. desember', sub: 'Mer sier jeg ikke ennå. Kom tilbake og se.', tick: 'Revolusjon' },
  jp: { label: 'カウントダウン', title: '革命、12月1日', date: '12月1日', d: '日', h: '時間', m: '分', s: '秒', strip: '12月1日、革命', sr: '12月1日までの残り時間', sub: '今はまだ多くを語りません。またのぞいてください。', tick: '革命' },
  es: { label: 'Cuenta atrás', title: 'Revolución, 1 de diciembre', date: '1 de diciembre', d: 'días', h: 'h', m: 'min', s: 's', strip: 'Revolución el 1 de diciembre', sr: 'Tiempo hasta el 1 de diciembre', sub: 'Aún no digo más. Vuelve a verlo.', tick: 'Revolución' },
  ar: { label: 'العد التنازلي', title: 'ثورة، 1 ديسمبر', date: '1 ديسمبر', d: 'يوم', h: 'ساعة', m: 'دقيقة', s: 'ثانية', strip: 'ثورة في 1 ديسمبر', sr: 'الوقت المتبقي حتى 1 ديسمبر', sub: 'لن أقول المزيد الآن. عد لتشاهد.', tick: 'ثورة' },
};
