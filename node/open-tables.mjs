// Which nights in the next 30 days have a table at each Resy restaurant, read from
// Resy's own booking calendar, with every day written to calendar.csv.
//
//   APIFY_TOKEN=... node open-tables.mjs https://resy.com/cities/new-york-ny/venues/lilia https://resy.com/cities/new-york-ny/venues/carbone
//   PARTY=4 DAYS=14 ... to change the party size and the window.
import { ApifyClient } from 'apify-client';
import { writeFileSync } from 'node:fs';

const urls = process.argv.slice(2);
if (!urls.length) throw new Error('Give one or more Resy venue URLs');
const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

// maxItems caps the venue URLs too, and it defaults to 3, so set it to the list's length.
const run = await client.actor('simple.actor/resy-availability').call({
    startUrls: urls.map((url) => ({ url })), maxItems: urls.length,
    includeCalendar: true, calendarDays: Number(process.env.DAYS || 30),
    partySize: Number(process.env.PARTY || 2),
});
const { items } = await client.dataset(run.defaultDatasetId).listItems();
for (const r of items.filter((i) => i.error)) console.error(`${r.error}: ${r.errorDescription}`);
const venues = items.filter((i) => !i.error);

// A URL Resy answers with "not found" leaves no row at all: wrong slug, or the venue left Resy.
const found = new Set(venues.map((v) => v.canonicalUrl));
for (const u of urls) if (!found.has(u.split('?')[0])) console.error(`no row for ${u}`);

for (const v of venues.sort((a, b) => b.availableDateCount - a.availableDateCount)) {
    console.log(`${String(v.availableDateCount).padStart(3)} of ${v.calendar.length} days  ${v.name}`
        + (v.availableDates.length ? `  first ${v.availableDates[0]}` : ''));
}

const rows = venues.flatMap((v) => v.calendar.map((c) => [v.name, c.date, c.reservation, c.walkIn]));
const cell = (x) => (/[",\n]/.test(String(x)) ? `"${String(x).replace(/"/g, '""')}"` : String(x ?? ''));
writeFileSync('calendar.csv', [['venue', 'date', 'reservation', 'walkIn'], ...rows]
    .map((r) => r.map(cell).join(',')).join('\n') + '\n');
console.log(`${rows.length} days written to calendar.csv`);
