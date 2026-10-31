# Runs behind the post

All on 2026-10-31 (UTC), resy-availability build 0.1.5 (latest), from the
account `simple.actor` (the owner's), so nothing was billed. The caller price is
the listing's $0.001 per dataset item (FREE/BRONZE tier), read the same day, for
the `apify-default-dataset-item` events each run recorded. Party size 2 throughout.

| Run | Input | Result | Time | Platform usage | Caller price |
|---|---|---|---|---|---|
| `SuzQ9MrWErZSiokxZ` | 12 venue URLs, 30-day calendar, `maxItems` left at its default 3 | 2 rows (Carbone, 4 Charles); `don-angie` not found | 6.5s | $0.00017 | $0.002 |
| `MDLxMiPo86QEdc11p` | the same 12 URLs, `maxItems` 20, calendar 31 Oct + 30 days, 03:37 UTC | 8 rows; `don-angie`, `rezdora`, `ci-siamo`, `le-b` not found | 21.0s | $0.00042 | $0.008 |
| `UBTdaNiLKaCHcziDl` | the 5 venues with no open day, calendar to 2026-12-31 | 5 rows, same days plus 25 Dec `not available` | 11.2s | $0.00025 | $0.005 |
| `Kw9dKoG9Uvpragh32` | Carbone, Torrisi, calendar 30 Nov to 31 Dec | 2 rows, only 25 Dec | 5.1s | $0.00015 | $0.002 |
| `nPqFSl182dDNOcB84` | the 8 venues, availability for 2026-11-07, `keepUnavailable` | 8 rows, Misi 13 slots (lunch), the rest 0 | 19.4s | $0.00039 | $0.008 |
| `qJoNWtiTUYJwu4Rtj` | Lilia, Misi, availability for 2026-11-04 | 9 slots each | 5.3s | $0.00015 | $0.002 |
| `Ur0DmtRtfbtjMbMBm`, `OGgyP9q0dsKL7cXlu`, `fNBFQ9xxF9HKB9NJF`, `dTcYIdLxILd0yDpmd` | search mode, New York, "Ci Siamo", "Don Angie", "Le B", "Rezdora", `maxItems` 2 | 2 other restaurants each | 5.1-5.4s | $0.0006 together | $0.008 |
| `WKro8wV7nHbWMihxP` | `example/node/open-tables.mjs` on Lilia, I Sodi, Carbone, Torrisi, 03:42 UTC | Lilia 18 of 27 (31 Oct newly open), I Sodi 1, Carbone 0, Torrisi 0 | 11.5s | $0.00025 | $0.004 |
| `M1kyDQyX6rSFueXyv` | `example/python/open_tables.py` on Misi, Don Angie | Misi 25 of 27, Don Angie no row | 4.8s | $0.00014 | $0.001 |

Regenerate the numbers and images: `python3 analyse.py`, then
`python3 images/make.py`. Both read the run files that
`marketing/tools/apify_api.py run` wrote to /tmp.
