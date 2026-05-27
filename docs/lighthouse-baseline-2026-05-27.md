# Lighthouse baseline - 2026-05-27

## Summary

- Date: 2026-05-27
- Scope: production pages on https://wojciech.io, measured with Lighthouse 13.3.0.
- Mobile average performance score: 99.9.
- Desktop average performance score: 99.5.
- Best mobile page: Spanish home (100, LCP 0.97s).
- Worst mobile page: Italian home (99, LCP 1.66s).
- Biggest issue: total byte weight is above the 300 KB target on 7 of 8 pages, mostly from shared assets and localized home bundles.

## Results

### Home

https://wojciech.io/

| Metric | Mobile | Desktop | Target |
|---|---:|---:|---:|
| Performance score | 100 | 99 | >90 |
| LCP | 1.19s | 0.95s | <2.5s |
| CLS | 0.000 | 0.000 | <0.05 |
| TBT | 0ms | 0ms | <200ms |
| FCP | 1.19s | 0.65s | <1.8s |
| Speed Index | 1.52s | 0.65s | <3.4s |
| Total bundle | 499 KB | 499 KB | <300 KB |

### Insights index

https://wojciech.io/insights/

| Metric | Mobile | Desktop | Target |
|---|---:|---:|---:|
| Performance score | 100 | 100 | >90 |
| LCP | 1.00s | 0.59s | <2.5s |
| CLS | 0.000 | 0.000 | <0.05 |
| TBT | 0ms | 0ms | <200ms |
| FCP | 1.00s | 0.52s | <1.8s |
| Speed Index | 1.10s | 0.52s | <3.4s |
| Total bundle | 296 KB | 296 KB | <300 KB |

### AI production stack

https://wojciech.io/insights/ai-production-stack/

| Metric | Mobile | Desktop | Target |
|---|---:|---:|---:|
| Performance score | 100 | 100 | >90 |
| LCP | 1.04s | 0.69s | <2.5s |
| CLS | 0.000 | 0.000 | <0.05 |
| TBT | 0ms | 0ms | <200ms |
| FCP | 1.04s | 0.57s | <1.8s |
| Speed Index | 1.32s | 0.57s | <3.4s |
| Total bundle | 361 KB | 361 KB | <300 KB |

### Work

https://wojciech.io/work/

| Metric | Mobile | Desktop | Target |
|---|---:|---:|---:|
| Performance score | 100 | 98 | >90 |
| LCP | 1.07s | 1.03s | <2.5s |
| CLS | 0.000 | 0.000 | <0.05 |
| TBT | 0ms | 0ms | <200ms |
| FCP | 1.07s | 0.69s | <1.8s |
| Speed Index | 1.40s | 0.69s | <3.4s |
| Total bundle | 347 KB | 414 KB | <300 KB |

### Italian home

https://wojciech.io/it/

| Metric | Mobile | Desktop | Target |
|---|---:|---:|---:|
| Performance score | 99 | 99 | >90 |
| LCP | 1.66s | 0.97s | <2.5s |
| CLS | 0.000 | 0.000 | <0.05 |
| TBT | 0ms | 0ms | <200ms |
| FCP | 1.66s | 0.68s | <1.8s |
| Speed Index | 1.96s | 0.68s | <3.4s |
| Total bundle | 501 KB | 501 KB | <300 KB |

### Spanish home

https://wojciech.io/es/

| Metric | Mobile | Desktop | Target |
|---|---:|---:|---:|
| Performance score | 100 | 100 | >90 |
| LCP | 0.97s | 0.77s | <2.5s |
| CLS | 0.000 | 0.000 | <0.05 |
| TBT | 0ms | 0ms | <200ms |
| FCP | 0.97s | 0.53s | <1.8s |
| Speed Index | 1.33s | 0.53s | <3.4s |
| Total bundle | 386 KB | 386 KB | <300 KB |

### German home

https://wojciech.io/de/

| Metric | Mobile | Desktop | Target |
|---|---:|---:|---:|
| Performance score | 100 | 100 | >90 |
| LCP | 1.04s | 0.75s | <2.5s |
| CLS | 0.000 | 0.000 | <0.05 |
| TBT | 0ms | 0ms | <200ms |
| FCP | 1.04s | 0.52s | <1.8s |
| Speed Index | 1.40s | 0.52s | <3.4s |
| Total bundle | 386 KB | 386 KB | <300 KB |

### Danish home

https://wojciech.io/dk/

| Metric | Mobile | Desktop | Target |
|---|---:|---:|---:|
| Performance score | 100 | 100 | >90 |
| LCP | 1.00s | 0.74s | <2.5s |
| CLS | 0.000 | 0.000 | <0.05 |
| TBT | 0ms | 0ms | <200ms |
| FCP | 1.00s | 0.38s | <1.8s |
| Speed Index | 1.35s | 0.40s | <3.4s |
| Total bundle | 386 KB | 386 KB | <300 KB |

## Next steps

1. Reduce total byte weight on the home and localized home pages. Current worst cases are Home and Italian home at roughly 500 KB.
2. Review Work page desktop byte weight. It is 414 KB while the performance score still stays high.
3. Keep the reveal-up and hero image changes protected with a recurring Lighthouse comparison after visual or media changes.
