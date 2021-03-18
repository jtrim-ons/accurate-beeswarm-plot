# Accurate Beeswarm Plot

If `data` is an array of items, `fn` is a function that takes an element
of data and returns its x position, and `r` is a boolean for whether to
use random tie breaking, calling

```
let result = AccurateBeeswarm(data, radius, fn, r).calculateYPositions();
```

returns an array of objects.  Each object contains `datum` (an element of
`data`), `x` (the x position), and `y` (the y position).
