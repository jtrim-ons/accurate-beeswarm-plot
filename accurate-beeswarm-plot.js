class AccurateBeeswarm {
    constructor(items, radius, xFun, randomTieBreak) {
        this.items = [...items].sort((a,b) => xFun(a) - xFun(b));
        this.diameter = radius * 2;
        this.diameterSq = this.diameter * this.diameter;
        this.xFun = xFun;
        this.tieBreakFn = randomTieBreak ?
                this.sfc32(0x9E3779B9, 0x243F6A88, 0xB7E15162, 1) :
                x => x;
    }

    // Random number generator
    // https://stackoverflow.com/a/47593316
    sfc32(a, b, c, d) {
        let rng = function() {
            a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
            var t = (a + b) | 0;
            a = b ^ b >>> 9;
            b = c + (c << 3) | 0;
            c = (c << 21 | c >>> 11);
            d = d + 1 | 0;
            t = t + d | 0;
            c = c + t | 0;
            return (t >>> 0) / 4294967296;
        }
        for (let i=0; i<10; i++) {
            rng();
        }
        return rng;
    }

    updateYBounds(item, all, pq) {
        for (let step of [-1, 1]) {
            for (let i = item.index + step;
                    i >= 0 && i < all.length && Math.abs(item.x - all[i].x) < this.diameter;
                    i += step) {
                let other = all[i];
                if (other.placed) continue;
                let xDiff = item.x - other.x;
                let yDiff = Math.sqrt(this.diameterSq - xDiff * xDiff);
                let highY = item.y + yDiff;
                let lowY = item.y - yDiff;
                other.minPositiveY = Math.max(other.minPositiveY, highY);
                other.maxNegativeY = Math.min(other.maxNegativeY, lowY);
                other.score = Math.min(other.minPositiveY, -other.maxNegativeY);
                other.bestPosition = other.score == other.minPositiveY ?
                        other.minPositiveY : other.maxNegativeY;
                pq.reprioritise(other);
            }
        }
    }

    calculateYPositions() {
        let all = this.items.map((d,i) => ({
            datum: d,
            index: i,
            x: this.xFun(d),
            y: null,
            placed: false,
            minPositiveY: 0,
            maxNegativeY: 0,
            score: 0,
            bestPosition: 0,
            heapPos: -1
        }));
    let tieBreakFn = this.tieBreakFn;
    all.forEach(function(d) {d.tieBreaker = tieBreakFn(d.x)});
        let pq = new AccurateBeeswarmPriorityQueue(function(a, b) {
            if (a.score < b.score) return true;
            if (a.score > b.score) return false;
            return a.tieBreaker < b.tieBreaker;
        });
        pq.push(...all);
        while (!pq.isEmpty()) {
            let item = pq.pop();
            item.placed = true;
            item.y = item.bestPosition;
            this.updateYBounds(item, all, pq);
        }
        return all.map(d => ({datum: d.datum, x: d.x, y: d.y}));
    }
}

class AccurateBeeswarmPriorityQueue {
    // Based on https://stackoverflow.com/a/42919752
    TOP = 0;
    parent = i => ((i + 1) >>> 1) - 1;
    left = i => (i << 1) + 1;
    right = i => (i + 1) << 1;

    constructor(comparator = (a, b) => a > b) {
        this._heap = [];
        this._comparator = comparator;
    }
    size() {
        return this._heap.length;
    }
    isEmpty() {
        return this.size() == 0;
    }
    peek() {
        return this._heap[this.TOP];
    }
    push(...values) {
        values.forEach(value => {
            value.heapPos = this.size();
            this._heap.push(value);
            this._siftUp();
        });
        return this.size();
    }
    pop() {
        const poppedValue = this.peek();
        const bottom = this.size() - 1;
        if (bottom > this.TOP) {
            this._swap(this.TOP, bottom);
        }
        this._heap.pop();
        this._siftDown();
        return poppedValue;
    }
    reprioritise(item) {
        this._siftDown(item.heapPos);
    }
    _greater(i, j) {
        return this._comparator(this._heap[i], this._heap[j]);
    }
    _swap(i, j) {
        [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
        this._heap[i].heapPos = i;
        this._heap[j].heapPos = j;
    }
    _siftUp() {
        let node = this.size() - 1;
        while (node > this.TOP && this._greater(node, this.parent(node))) {
            this._swap(node, this.parent(node));
            node = this.parent(node);
        }
    }
    _siftDown(node = this.TOP) {
        while (
            (this.left(node) < this.size() && this._greater(this.left(node), node)) ||
            (this.right(node) < this.size() && this._greater(this.right(node), node))
        ) {
            let maxChild = (this.right(node) < this.size() && this._greater(this.right(node), this.left(node))) ? this.right(node) : this.left(node);
            this._swap(node, maxChild);
            node = maxChild;
        }
    }
}