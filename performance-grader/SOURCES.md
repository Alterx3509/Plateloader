# Performance Profile: data sources and methodology

This document records the source, license, transformation, and limitations for every score shown in the app.

## 1. Strength: squat, bench press, and deadlift

**Primary data integration:** FitnessVolt Strength Standards public API  
**Underlying verified competition source:** OpenPowerlifting  
**Population used by the app:** Raw, verified powerlifting competition results, separated by sex and competition weight class  
**License:** FitnessVolt tables are CC BY 4.0 with visible attribution. OpenPowerlifting's released meet data is public domain.

The app requests the public `/public/standards/{lift}` endpoint and selects the user's powerlifting weight class. It uses these verified competition percentiles:

- Average: 50th percentile
- Good: 75th percentile
- Great: 90th percentile
- Elite: 95th percentile

The response also contains additional percentile points. The user's displayed percentile is linearly interpolated between those points. API results are cached in the browser for 24 hours.

Required visible attribution appears in the app as **Powered by FitnessVolt**.

Sources:
- FitnessVolt open data and API: https://fitnessvolt.com/strength-standards/strength-data/
- FitnessVolt strength standards: https://fitnessvolt.com/strength-standards/
- OpenPowerlifting: https://www.openpowerlifting.org/
- OpenPowerlifting data repository: https://gitlab.com/openpowerlifting/opl-data

### Strength limitations

Powerlifting competitors are a trained, self-selected population. A 50th-percentile competition lift is not the average for the general public. The verified competition table accounts for sex and bodyweight class, but it is not age-stratified. Age is therefore not used to alter the three competition percentiles in version 1. Competition rules, raw equipment standards, technique, and lift validity matter.

## 2. Cardio: one-mile run

**Data:** WMA/USATF age-grading tables, 2020 edition  
**Implementation source:** Runalyze `age-grade` repository  
**Code license:** MIT  
**Table license:** CC BY 4.0

The source tables provide open-standard times and age factors from age 5 through 100. This app supports ages 18–100. To keep the app compact, it embeds selected age factors and linearly interpolates between them.

The source provides standards at 1500 m and 3000 m. Following the implementation's documented interpolation method, the app interpolates an open standard at 1.609344 km (one mile):

- Male open mile standard: 222.921 seconds
- Female open mile standard: 252.075 seconds

Age grade is calculated as:

`age-specific standard time / actual time × 100`

App bands:

- Average: 50.0–59.9%
- Good: 60.0–69.9%
- Great: 70.0–79.9%
- Elite: 80.0% or higher

Sources:
- Runalyze age-grade: https://github.com/Runalyze/age-grade
- WMA/USATF age-grading background: http://www.runscore.com/Alan/AgeGrade.html
- 2020 age-grade tables: https://github.com/AlanLyttonJones/Age-Grade-Tables

### Cardio limitations

Age grading compares performance with age/sex standards; it is not a population percentile or a medical fitness test. Course accuracy, terrain, weather, and whether the mile was raced all affect the result.

## 3. Body composition proxy: waist circumference

**Data:** CDC/NCHS NHANES waist-circumference percentiles by sex and age  
**Reference period:** 2007–2010 tables  
**License:** U.S. federal government publication; public domain

The app embeds the published 5th, 10th, 15th, 25th, 50th, 75th, 85th, 90th, and 95th percentile values. It linearly interpolates the user's position between published points.

Because lower waist circumference is favorable in this context, the app converts waist percentile to a score as `100 − percentile`:

- Average: at or below the 50th waist percentile
- Good: at or below the 25th percentile
- Great: at or below the 10th percentile
- Elite: at or below the 5th percentile

Sources:
- NCHS anthropometric reference tables: https://www.ncbi.nlm.nih.gov/books/NBK603339/
- CDC/NCHS body-measures documentation: https://wwwn.cdc.gov/Nchs/Data/Nhanes/Public/2021/DataFiles/BMX_L.htm
- NIH/NIDDK waist-risk guidance: https://www.niddk.nih.gov/health-information/weight-management/health-risks-overweight

### Body-composition limitations

Waist circumference is a useful screening measurement but is not a direct body-fat measurement. Technique and measurement location matter. The app separately flags the NIH screening thresholds of 40 inches for men and 35 inches for women; a population percentile and a health-risk threshold are not the same thing.

## 4. Category and overall scores

The three lift percentiles are averaged to produce **Strength**.

The mile's age-grade percentage is transformed to a percentile-like score so its requested bands align with the common 0–100 composite scale:

- 50% age grade → score 50
- 60% → score 75
- 70% → score 90
- 80% → score 95
- 100% → score 100

**Body Composition** is `100 − waist percentile`.

Overall performance gives equal weight to the three categories:

`(Strength + Cardio + Body Composition) / 3`

Common score labels:

- Below average: below 50
- Average: 50–74.9
- Good: 75–89.9
- Great: 90–94.9
- Elite: 95–100

This equal-category weighting prevents the three powerlifts from counting three times as much as cardio or body composition.

## 5. Privacy and disclaimer

The app stores entered values and cached standards only in the user's browser using `localStorage`. It does not send profile data to this repository. The FitnessVolt standards requests include only the selected lift, sex, and display unit; the user's lift, age, waist, and bodyweight are scored locally.

This app is informational and is not medical advice.
