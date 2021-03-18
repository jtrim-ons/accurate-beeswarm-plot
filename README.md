# Accurate Beeswarm Plot

The file `accurate-beeswarm-plot.js` in this repository provides the class
`AccurateBeeswarm` for calculating a two-dimensional beeswarm arrangement
of a one-dimensional dataset.  The main goals are to represent values
precisely (unlike some force-directed beeswarm layouts) and 
to pack the points together tightly without overlap.

[d3-beeswarm](https://github.com/Kcnarf/d3-beeswarm) is another library
with similar goals.

[See examples.](https://jtrim-ons.github.io/accurate-beeswarm-plot/)

## How to use `AccurateBeeswarm`

It is assumed that the data (x) axis of the plot will be horizontal.  For
a vertical beeswarm, simply swap x and y axes when plotting.

To calculate a beeswarm arrangement, you need an array of items `data`
and a function `fn` that takes an element of data and returns its x position.
The following call returns an array of objects;  each object contains fields
`datum` (an element of `data`), `x` (the x position), and `y` (the y position).


```
let result = new AccurateBeeswarm(data, radius, fn)
        .calculateYPositions();
```

## Additional Options

One-sided y values:

```
let result = new AccurateBeeswarm(data, radius, fn)
        .oneSided()
        .calculateYPositions();
```

An alternative arrangement with ties broken randomly rather than preferring
points with low values (this sometimes reduces the "honeycomb" appearance):

```
let result = new AccurateBeeswarm(data, radius, fn)
        .withTiesBrokenRandomly()
        .calculateYPositions();
```

