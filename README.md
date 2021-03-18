# Accurate Beeswarm Plot

[See examples](https://jtrim-ons.github.io/accurate-beeswarm-plot/)

If `data` is an array of items, `fn` is a function that takes an element
of data and returns its x position, calling

```
let result = new AccurateBeeswarm(data, radius, fn)
        .calculateYPositions();
```

returns an array of objects.  Each object contains `datum` (an element of
`data`), `x` (the x position), and `y` (the y position).

## Additional Options

One-sided y values:

```
let result = new AccurateBeeswarm(data, radius, fn)
        .oneSided()
        .calculateYPositions();
```

Random tie-break (reduces the honeycomb pattern that sometimes appears):

```
let result = new AccurateBeeswarm(data, radius, fn)
        .withTiesBrokenRandomly()
        .calculateYPositions();
```

