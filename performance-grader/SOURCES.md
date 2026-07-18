# Performance Profile: data sources and methodology

This document records the source, transformation, grading decisions, and limitations for every score shown in the app.

## 1. Intended user

The app is designed for a **physically fit generalist who does not specialize in powerlifting**. The three barbell lifts still use competition-quality data because the lifts are judged consistently and the dataset is unusually large, but the labels are deliberately calibrated below competitive median standards.

## 2. Strength: squat, bench press, and deadlift

### Primary sources

- **OpenPowerlifting**, public-domain competition database: https://www.openpowerlifting.org/
- OpenPowerlifting data service and schema: https://openpowerlifting.gitlab.io/opl-csv/
- van den Hoek et al. (2024), *Normative data for the squat, bench press and deadlift exercises in powerlifting: Data from 809,986 competition entries*, Journal of Science and Medicine in Sport 27(10), 734–742: https://doi.org/10.1016/j.jsams.2024.07.005

The article is open access under **CC BY 4.0**. OpenPowerlifting competition data are released to the public domain.

### Population and filters

The published study used 809,986 entries from drug-tested, unequipped powerlifting competitions. It reports relative strength (`lift ÷ bodyweight`) by biological sex, United Nations age group, and current IPF weight class.

The app embeds selected 10th, 30th, 50th, 70th, and 90th deciles from:

- Table 3: female age groups
- Table 4: male age groups
- Table 5: female weight classes
- Table 6: male weight classes

Age groups are:

- 18–35
- 36–59
- 60–79
- 80+

### Combining age and bodyweight

The paper publishes age-only tables and weight-class-only tables in the main article; exact combined age-by-weight tables are supplementary. To keep the app self-contained, each weight-class decile is adjusted using the published age curve at the same decile:

`age-adjusted class ratio = weight-class ratio × (selected-age ratio ÷ 18–35 ratio)`

The target lift is then:

`target weight = bodyweight × age-adjusted class ratio`

This provides a transparent age discriminator while preserving weight-class effects. It is an approximation of the exact supplementary joint table, not a claim of false single-year precision.

### Fit-generalist grade calibration

Competitive powerlifters are much stronger than the general population. The study itself cautions that its values are not directly comparable with community-dwelling or non-strength-trained people. Therefore, the app interprets lower competitive deciles as higher recreational-fitness grades:

- **Average:** approximately the 10th percentile of raw, drug-tested competitors
- **Good:** approximately the 30th percentile
- **Great:** approximately the 50th percentile
- **Elite:** approximately the 70th percentile

The displayed trained-competitor percentile is interpolated between the embedded deciles. The common 0–100 category score maps competitive percentile 10 → 50, 30 → 75, 50 → 90, 70 → 95, and 90 → 100.

### Strength limitations

- These remain powerlifting-derived references, not direct norms for all fit adults.
- The age adjustment uses broad published age bands rather than individual-year curves.
- Competition movement standards matter: squat depth, bench pause/lockout, and deadlift lockout should be reasonably comparable.
- Training history, injuries, limb lengths, technique, and exercise variations are not modeled.

## 3. Cardio: one-mile run

**Data:** WMA/USATF age-grading tables, 2020 edition  
**Implementation source:** Runalyze `age-grade` repository  
**Code license:** MIT  
**Table license:** CC BY 4.0

The source tables provide open-standard times and age factors. The app supports ages 18–100 and embeds selected age factors with linear interpolation.

The source provides standards at 1500 m and 3000 m. Following the source implementation's interpolation method, the app estimates a standard at 1.609344 km:

- Male open mile standard: 222.921 seconds
- Female open mile standard: 252.075 seconds

Age grade:

`age-specific standard time ÷ actual time × 100`

Bands:

- Average: 50.0–59.9%
- Good: 60.0–69.9%
- Great: 70.0–79.9%
- Elite: 80.0% or higher

Sources:

- https://github.com/Runalyze/age-grade
- http://www.runscore.com/Alan/AgeGrade.html
- https://github.com/AlanLyttonJones/Age-Grade-Tables

### Cardio limitations

Age grading is not a population percentile or medical fitness test. Course accuracy, terrain, weather, pacing, and whether the mile was raced affect the result.

## 4. Body composition context

### Waist percentile

**Data:** CDC/NCHS NHANES waist-circumference percentiles by sex and age  
**Reference period:** 2007–2010  
**License:** U.S. federal publication, public domain

The app embeds published 5th, 10th, 15th, 25th, 50th, 75th, 85th, 90th, and 95th percentile values and interpolates between them.

Because lower waist circumference is favorable for this proxy:

- Average: at or below the 50th waist percentile
- Good: at or below the 25th percentile
- Great: at or below the 10th percentile
- Elite: at or below the 5th percentile

The Body Composition score remains `100 − waist percentile`.

Sources:

- https://www.ncbi.nlm.nih.gov/books/NBK603339/
- https://wwwn.cdc.gov/Nchs/Data/Nhanes/Public/2021/DataFiles/BMX_L.htm

### Height, waist-to-height ratio, and BMI

Height is used to calculate:

- `waist-to-height ratio = waist ÷ height`
- `BMI = weight kg ÷ height m²`

NICE classifies adult waist-to-height ratio as:

- 0.40–0.49: healthy central adiposity
- 0.50–0.59: increased central adiposity
- 0.60+: high central adiposity

NICE advises keeping the waist below half of height and notes the classification can be useful in adults with high muscle mass when BMI is below 35. The app displays this as **context and a health notice**, not as a performance-score multiplier, to avoid inventing unsupported Great/Elite thresholds.

Source: https://www.nice.org.uk/guidance/ng246/chapter/Identifying-and-assessing-overweight-obesity-and-central-adiposity

The app also retains the NIH screening notice at 40 inches for men and 35 inches for women.

### Body-composition limitations

Waist, BMI, and waist-to-height ratio are screening measurements, not direct body-fat measurements. Measurement location and technique matter. BMI can overstate adiposity in muscular people. Population rank and health-risk classification are separate concepts.

## 5. Category and overall scores

The three lift scores are averaged to produce **Strength**.

The mile age grade is transformed to the common score scale:

- 50% age grade → score 50
- 60% → score 75
- 70% → score 90
- 80% → score 95
- 100% → score 100

**Body Composition** is `100 − waist percentile`.

Overall performance gives equal weight to the three categories:

`(Strength + Cardio + Body Composition) ÷ 3`

Common labels:

- Below average: below 50
- Average: 50–74.9
- Good: 75–89.9
- Great: 90–94.9
- Elite: 95–100

Equal category weighting prevents the three powerlifts from counting three times as much as cardio or body composition.

## 6. Dashboard-event architecture

Tests are registered in a single `TEST_CATALOG` in `app.js`. Each test has an ID, name, category, and color. The dashboard picker stores selected IDs in browser `localStorage`; pinning changes which detailed cards appear, not the underlying category calculations.

This structure is intended to scale to a future 20–30-test catalog. New modules can be added to the registry and calculation layer without redesigning the dashboard.

## 7. Privacy and disclaimer

All source tables are embedded. The app makes no scoring API request. Entered values and dashboard choices are stored only in the browser using `localStorage`.

This app is informational and is not medical or individualized training advice.
