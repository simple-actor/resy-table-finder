"""Which nights in the next 30 days have a table at each Resy restaurant, read from
Resy's own booking calendar, with every day written to calendar.csv.

    APIFY_TOKEN=... python open_tables.py https://resy.com/cities/new-york-ny/venues/lilia https://resy.com/cities/new-york-ny/venues/carbone
    PARTY=4 DAYS=14 ... to change the party size and the window.
"""
import csv
import os
import sys

from apify_client import ApifyClient

urls = sys.argv[1:]
if not urls:
    sys.exit("Give one or more Resy venue URLs")
client = ApifyClient(os.environ["APIFY_TOKEN"])

# maxItems caps the venue URLs too, and it defaults to 3, so set it to the list's length.
run = client.actor("simple.actor/resy-availability").call(run_input={
    "startUrls": [{"url": u} for u in urls], "maxItems": len(urls),
    "includeCalendar": True, "calendarDays": int(os.environ.get("DAYS", 30)),
    "partySize": int(os.environ.get("PARTY", 2))})
items = list(client.dataset(run.default_dataset_id).iterate_items())
for r in items:
    if r.get("error"):
        print(f"{r['error']}: {r['errorDescription']}", file=sys.stderr)
venues = [r for r in items if not r.get("error")]

# A URL Resy answers with "not found" leaves no row at all: wrong slug, or the venue left Resy.
found = {v["canonicalUrl"] for v in venues}
for u in urls:
    if u.split("?")[0] not in found:
        print(f"no row for {u}", file=sys.stderr)

for v in sorted(venues, key=lambda v: -v["availableDateCount"]):
    first = f"  first {v['availableDates'][0]}" if v["availableDates"] else ""
    print(f"{v['availableDateCount']:>3} of {len(v['calendar'])} days  {v['name']}{first}")

with open("calendar.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["venue", "date", "reservation", "walkIn"])
    rows = [[v["name"], c["date"], c["reservation"], c.get("walkIn")] for v in venues for c in v["calendar"]]
    w.writerows(rows)
print(f"{len(rows)} days written to calendar.csv")
