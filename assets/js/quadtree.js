width = 800;
height = 800;
class Point{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

class Rectangule{
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.left = x - w / 2;
        this.right = x + w / 2;
        this.top = y - h / 2;
        this.bottom = y + h / 2;
    }
    contains(point) {
        return (
          this.left <= point.x && point.x <= this.right &&
          this.top <= point.y && point.y <= this.bottom
        );
      }
    
    intersects(range) {
        return !(
          this.right < range.left || range.right < this.left ||
          this.bottom < range.top || range.bottom < this.top
        );
      }
    
    subdivide(quadrant) {
        switch (quadrant) {
          case 'ne':
            return new Rectangule(this.x + this.w / 4, this.y - this.h / 4, this.w / 2, this.h / 2);
          case 'nw':
            return new Rectangule(this.x - this.w / 4, this.y - this.h / 4, this.w / 2, this.h / 2);
          case 'se':
            return new Rectangule(this.x + this.w / 4, this.y + this.h / 4, this.w / 2, this.h / 2);
          case 'sw':
            return new Rectangule(this.x - this.w / 4, this.y + this.h / 4, this.w / 2, this.h / 2);
        }
    }
}

class Queadtree{
    constructor(boundary, capacity) {
        if (!boundary) {
          throw TypeError('boundary is null or undefined');
        }
        if (!(boundary instanceof Rectangule)) {
          throw TypeError('boundary should be a Rectangle');
        }
        if (typeof capacity !== 'number') {
          throw TypeError(`capacity should be a number but is a ${typeof capacity}`);
        }
        if (capacity < 1) {
          throw RangeError('capacity must be greater than 0');
        }
        this.boundary = boundary;
        this.capacity = capacity;
        this.points = [];
        this.divided = false;
      }
    bounder(i){
        if(i==0)
            return this.boundary.x;
        else if(i==1)
            return this.boundary.y;
        else if(i==2)
            return this.boundary.w;
        else if(i==3)
            return this.boundary.h;
    }
    get children() {
        if (this.divided) {
            return [
                this.northeast,
                this.northwest,
                this.southeast,
                this.southwest
            ];
        } else {
            return [];
        }
    }
    
    subdivide() {
        this.northeast = new Queadtree(this.boundary.subdivide('ne'), this.capacity);
        this.northwest = new Queadtree(this.boundary.subdivide('nw'), this.capacity);
        this.southeast = new Queadtree(this.boundary.subdivide('se'), this.capacity);
        this.southwest = new Queadtree(this.boundary.subdivide('sw'), this.capacity);
    
        this.divided = true;
    }
    
    insert(point) {
        if (!this.boundary.contains(point)) {
          return false;
        }
    
        if (this.points.length < this.capacity) {
          this.points.push(point);
          return true;
        }
    
        if (!this.divided) {
          this.subdivide();
        }
    
        return (
          this.northeast.insert(point) ||
          this.northwest.insert(point) ||
          this.southeast.insert(point) ||
          this.southwest.insert(point)
        );
    }

    static create() {
        let DEFAULT_CAPACITY = 4;
        if (arguments.length === 0) {
            if (typeof width === "undefined") {
                throw new TypeError("No global width defined");
            }
            if (typeof height === "undefined") {
                throw new TypeError("No global height defined");
            }
            let bounds = new Rectangule(width / 2, height / 2, width, height);
            return new Queadtree(bounds, DEFAULT_CAPACITY);
        }
        if (arguments[0] instanceof Rectangule) {
            let capacity = arguments[1] || DEFAULT_CAPACITY;
            return new Queadtree(arguments[0], capacity);
        }
        if (typeof arguments[0] === "number" &&
            typeof arguments[1] === "number" &&
            typeof arguments[2] === "number" &&
            typeof arguments[3] === "number") {
            let capacity = arguments[4] || DEFAULT_CAPACITY;
            return new Queadtree(new Rectangule(arguments[0], arguments[1], arguments[2], arguments[3]), capacity);
        }
        throw new TypeError('Invalid parameters');
    }
}

function setup(){
    var heightWindow = window.innerHeight-20;
    var width = window.innerWidth-20;
    position_x = width/2 -400;
    position_y = Math.floor(heightWindow/2)-400;  
    let boundary = new Rectangule(width / 2, height / 2, width / 2, height / 2);
    qtree = Queadtree.create(boundary, 4);

    for (let i = 0; i < 1000; i++) {
        let p = new Point(
            Math.floor(Math.random() * (801 - 2) + 2),
            Math.floor(Math.random() * (801 - 2) + 2),
            {
                searched: false,
                closest: false,
            }
        );
        qtree.insert(p);
    }
    
    console.log(qtree);
    init(qtree);
}

setup();