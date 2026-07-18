# Strength Tools

A small static-web collection containing:

- `plate-loader.html` — plate-loading calculator
- `performance-grader/` — age-adjusted performance profile for strength, a one-mile run, and body composition
- `index.html` — shared tools home page

## Performance Profile

The profile now:

- adds height, BMI context, and waist-to-height classification
- uses embedded, published age and weight-class deciles for squat, bench press, and deadlift
- calibrates strength labels for a fit non-powerlifter rather than the median competitive powerlifter
- supports a persistent dashboard-event picker designed to scale to a future 20–30-test catalog
- works without a scoring API; entries stay in browser `localStorage`

See `performance-grader/SOURCES.md` for data sources, licenses, formulas, and limitations.

## Running locally

Open `index.html` in a browser or serve the folder with any static-file server.
