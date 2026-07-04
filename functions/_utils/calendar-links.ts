// "Add to calendar" deep links for the booking emails. Google and Outlook both
// accept an event via URL params; Apple/Outlook-desktop use the attached .ics.

export interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  details?: string;
  location?: string;
}

/** UTC basic format Google expects: 20260707T070000Z */
function utc(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

export function googleCalendarUrl(e: CalendarEvent): string {
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: e.title,
    dates: `${utc(e.start)}/${utc(e.end)}`,
  });
  if (e.details) p.set('details', e.details);
  if (e.location) p.set('location', e.location);
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

export function outlookCalendarUrl(e: CalendarEvent): string {
  const p = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: e.title,
    startdt: e.start.toISOString(),
    enddt: e.end.toISOString(),
  });
  if (e.details) p.set('body', e.details);
  if (e.location) p.set('location', e.location);
  return `https://outlook.live.com/calendar/0/deeplink/compose?${p.toString()}`;
}
