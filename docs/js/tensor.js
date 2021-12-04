var index = /** @class */ (function () {
    function index(X1, X2, Y1, Y2) {
        this.X1 = X1;
        this.X2 = X2;
        this.Y1 = Y1;
        this.Y2 = Y2;
        this.createShapetext();
        return this;
    }
    index.prototype.createShapetext = function () {
        this.id = index.pendingIDs.length > 0 ? index.pendingIDs.pop() : this.id = index.counter + 1;
        var mIndex = document.createElementNS("http://www.w3.org/2000/svg", "g");
        var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        line.setAttribute("class", "index");
        line.setAttribute("x1", String(this.X1));
        line.setAttribute("x2", String(this.X2));
        line.setAttribute("y1", String(this.Y1));
        line.setAttribute("y2", String(this.Y2));
        line.setAttribute("stroke", "black");
        line.setAttribute("stroke-width", "1");
        // temporary solution to highlight the text above the line
        var Xm = Math.floor(this.X1 + this.X2) / 2;
        var Ym = Math.floor(this.Y1 + this.Y2) / 2;
        circle.setAttribute("r", String("10"));
        circle.setAttribute("cx", String(Xm));
        circle.setAttribute("cy", String(Ym));
        circle.setAttribute("fill", "rgb(255,255,255)");
        circle.setAttribute("opacity", "0%");
        text.setAttribute("pointer-events", "none");
        text.setAttribute("dominant-baseline", "middle");
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("x", String(Xm));
        text.setAttribute("y", String(Ym));
        //text.setAttribute("stroke","rgb(0,0,0)");
        //text.setAttribute("fill","rgb(0,0,0)");
        text.textContent = String(this.id);
        text.setAttribute("opacity", "0%");
        mIndex.appendChild(line);
        mIndex.appendChild(circle);
        mIndex.appendChild(text);
        this.mIndex = mIndex;
        this.line = line;
        this.circle = circle;
        this.text = text;
    };
    // note that these functions are not modifing the members X1 and X2!!!!!!!!!!!!
    index.prototype.moveP1 = function (newX, newY) {
        this.line.setAttribute("x1", String(newX));
        this.line.setAttribute("y1", String(newY));
        this.X1 = newX;
        this.Y1 = newY;
        var Xm = Math.floor(newX + this.X2) / 2;
        var Ym = Math.floor(newY + this.Y2) / 2;
        this.circle.setAttribute("cx", String(Xm));
        this.circle.setAttribute("cy", String(Ym));
        this.text.setAttribute("x", String(Xm));
        this.text.setAttribute("y", String(Ym));
    };
    index.prototype.moveP2 = function (newX, newY) {
        this.line.setAttribute("x2", String(newX));
        this.line.setAttribute("y2", String(newY));
        this.X2 = newX;
        this.Y2 = newY;
        var Xm = Math.floor(this.X1 + newX) / 2;
        var Ym = Math.floor(this.Y1 + newY) / 2;
        this.circle.setAttribute("cx", String(Xm));
        this.circle.setAttribute("cy", String(Ym));
        this.text.setAttribute("x", String(Xm));
        this.text.setAttribute("y", String(Ym));
    };
    index.counter = 0;
    index.pendingIDs = [];
    return index;
}());
var tensor = /** @class */ (function () {
    function tensor(posX, posY, radius) {
        if (radius === void 0) { radius = 20; }
        this.posX = posX;
        this.posY = posY;
        this.radius = radius;
        this.legsRefs = [];
        this.whichPoint = [];
        this.createShapetext();
        return this;
    }
    tensor.prototype.createShapetext = function () {
        this.id = tensor.pendingIDs.length > 0 ? tensor.pendingIDs.pop() : this.id = tensor.counter + 1;
        console.log("create tensor with: cx = " + this.posX + " cy = " + this.posY + " and ID: " + this.id);
        var mTensor = document.createElementNS("http://www.w3.org/2000/svg", "g");
        var shape = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        // TODO: set the id accordingly to its id number
        shape.setAttribute("class", "tensor");
        shape.setAttribute("id", "tensor");
        shape.setAttribute("r", String(this.radius));
        shape.setAttribute("cx", String(this.posX));
        shape.setAttribute("cy", String(this.posY));
        shape.setAttribute("stroke", "black");
        shape.setAttribute("stroke-width", "1");
        //shape.setAttribute("opacity","1") change opacity maybe?
        shape.setAttribute("fill", "rgb(255,255,255)");
        text.setAttribute("pointer-events", "none");
        text.setAttribute("dominant-baseline", "middle");
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("x", String(this.posX));
        text.setAttribute("y", String(this.posY));
        //text.setAttribute("stroke","rgb(0,0,0)");
        //text.setAttribute("fill","rgb(0,0,0)");
        text.textContent = String(this.id);
        text.setAttribute("opacity", "0%");
        mTensor.appendChild(shape);
        mTensor.appendChild(text);
        this.mTensor = mTensor;
        this.shape = shape;
        this.text = text;
    };
    tensor.prototype.insertLegRef = function (leg, p1) {
        p1 ? console.log("leg (id: " + leg.id + ") comming OUT tensor " + this.id) : console.log("leg (id: " + leg.id + ") comming IN tensor " + this.id);
        this.legsRefs.push(leg);
        this.whichPoint.push(p1);
    };
    tensor.prototype.setPosition = function (newPosX, newPosY) {
        var _this = this;
        this.posX = newPosX;
        this.posY = newPosY;
        this.shape.setAttribute("cx", String(newPosX));
        this.shape.setAttribute("cy", String(newPosY));
        this.text.setAttribute("x", String(newPosX));
        this.text.setAttribute("y", String(newPosY));
        this.legsRefs.forEach(function (leg, i) { _this.whichPoint[i] ? leg.moveP1(newPosX, newPosY) : leg.moveP2(newPosX, newPosY); });
    };
    tensor.counter = 0;
    tensor.pendingIDs = [];
    return tensor;
}());
// enumerate the modes the app can have
// draw -> draw tensors and links with mouse clicks
// move -> move tensors and legs atached to it at the same time
var mode;
(function (mode) {
    mode[mode["draw"] = 0] = "draw";
    mode[mode["move"] = 1] = "move";
})(mode || (mode = {}));
;
// all types of grids
// superposed grid in future:
// https://stackoverflow.com/questions/39359740/what-are-enum-flags-in-typescript
var grid;
(function (grid) {
    grid[grid["none"] = 0] = "none";
    grid[grid["square"] = 1] = "square";
    grid[grid["diamond"] = 2] = "diamond";
    grid[grid["isometric"] = 3] = "isometric";
})(grid || (grid = {}));
var DrawingDiagrams = /** @class */ (function () {
    function DrawingDiagrams() {
        var _this = this;
        this.gridSize = 50;
        this.snapToGrid = false;
        this.gridMode = grid.none;
        this.gridGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.indexesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.tensorsGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.indexesArray = [];
        this.tensorsArray = [];
        this.mode = mode.draw;
        this.selectedTensor = { isSelected: false };
        this.selectedIndex = { isSelected: false };
        this.clickX = [];
        this.clickY = [];
        this.clickDrag = [];
        this.pressTensorEventHandler = function (e, t) {
            e.stopPropagation();
            _this.addTensorClick(t);
        };
        this.pressIndexEventHandler = function (e, i) {
            e.stopPropagation();
            _this.addIndexClick(i);
        };
        this.clearEventHandler = function () {
            console.log("clear event");
            _this.clearCanvas();
        };
        this.toggleGridHandler = function () {
            // three way toggle at the moment
            switch (_this.gridMode) {
                case (grid.none):
                    {
                        //this.gridGroup.setAttribute("opacity","1");
                        while (_this.gridGroup.firstChild)
                            _this.gridGroup.removeChild(_this.gridGroup.firstChild);
                        _this.gridMode = grid.square;
                        _this.snapToGrid = true;
                        _this.drawGrid();
                        break;
                    }
                case (grid.square):
                    {
                        while (_this.gridGroup.firstChild)
                            _this.gridGroup.removeChild(_this.gridGroup.firstChild);
                        _this.gridMode = grid.diamond;
                        _this.snapToGrid = true;
                        _this.drawGrid();
                        break;
                    }
                case (grid.diamond):
                    {
                        while (_this.gridGroup.firstChild)
                            _this.gridGroup.removeChild(_this.gridGroup.firstChild);
                        _this.gridMode = grid.isometric;
                        _this.snapToGrid = true;
                        _this.drawGrid();
                        break;
                    }
                case (grid.isometric):
                    {
                        //this.gridGroup.setAttribute("opacity","0")
                        while (_this.gridGroup.firstChild)
                            _this.gridGroup.removeChild(_this.gridGroup.firstChild);
                        _this.gridMode = grid.none;
                        _this.snapToGrid = false;
                        _this.drawGrid();
                        break;
                    }
            }
            console.log("toggle the grid to " + grid[_this.gridMode]);
        };
        this.drawEventHandler = function () {
            console.log("draw mode selected");
            _this.selectedTensor.isSelected = false;
            _this.selectedIndex.isSelected = false;
            _this.tensorsArray.forEach(function (t) { return t.text.setAttribute("opacity", "0%"); });
            _this.indexesArray.forEach(function (i) {
                i.circle.setAttribute("opacity", "0%");
                i.text.setAttribute("opacity", "0%");
            });
            _this.mode = mode.draw;
            // probably have to add cleaning of variables etc
        };
        this.moveEventHandler = function () {
            console.log("move mode selected");
            _this.selectedTensor.isSelected = false;
            _this.selectedIndex.isSelected = false;
            _this.tensorsArray.forEach(function (t) { return t.text.setAttribute("opacity", "100%"); });
            _this.indexesArray.forEach(function (i) {
                i.circle.setAttribute("opacity", "100%");
                i.text.setAttribute("opacity", "100%");
            });
            _this.mode = mode.move;
            // probably have to add cleaning of variables etc
        };
        this.releaseEventHandler = function () {
            _this.paint = false;
        };
        this.cancelEventHandler = function () {
            _this.paint = false;
        };
        this.pressEventHandler = function (e) {
            var mouseX = e.changedTouches ?
                e.changedTouches[0].clientX :
                e.clientX;
            var mouseY = e.changedTouches ?
                e.changedTouches[0].clientY :
                e.clientY;
            mouseX -= _this.offsetX;
            mouseY -= _this.offsetY;
            //console.log("mouse press event offseted in : " + mouseX + " " + mouseY);
            _this.paint = true;
            _this.addClick(mouseX, mouseY, false);
        };
        this.dragEventHandler = function (e) {
            var mouseX = e.changedTouches ?
                e.changedTouches[0].pageX :
                e.pageX;
            var mouseY = e.changedTouches ?
                e.changedTouches[0].pageY :
                e.pageY;
            mouseX -= _this.offsetX;
            mouseY -= _this.offsetY;
            if (_this.selectedTensor.isSelected) {
                _this.addMove(mouseX, mouseY);
                //console.log("mouse dragging: " + mouseX + " " + mouseY);
            }
            e.preventDefault();
        };
        var svgElement = document.getElementById('svg-board');
        var divWrapper = document.getElementById('wrapper');
        //display: block;?
        //svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        //svgElement.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
        this.svgElement = svgElement;
        this.divWrapper = divWrapper;
        this.width = svgElement.clientWidth;
        this.height = svgElement.clientHeight;
        this.offsetX = this.divWrapper.offsetLeft + this.svgElement.clientLeft;
        this.offsetY = this.divWrapper.offsetTop + this.svgElement.clientTop;
        console.log("svg element wth: " + this.width + " and " + this.height);
        console.log("div offset : " + this.divWrapper.offsetLeft + " " + this.divWrapper.offsetTop);
        console.log("border offset : " + this.svgElement.clientLeft + " " + this.svgElement.clientTop);
        //if (!this.snapToGrid) this.gridGroup.setAttribute("opacity","0");
        this.drawGrid();
        this.svgElement.appendChild(this.gridGroup);
        this.svgElement.appendChild(this.indexesGroup);
        this.svgElement.appendChild(this.tensorsGroup);
        this.gridGroup.setAttribute("id", "grid");
        this.indexesGroup.setAttribute("id", "indexes");
        this.tensorsGroup.setAttribute("id", "tensors");
        this.createUserEvents();
    }
    DrawingDiagrams.prototype.drawGrid = function () {
        switch (this.gridMode) {
            case (grid.none):
                {
                    break;
                }
            case (grid.square):
                {
                    for (var i = this.gridSize; i < this.height; i += this.gridSize)
                        this.drawGridLine(this.gridGroup, 0, this.width, i, i);
                    for (var i = this.gridSize; i < this.width; i += this.gridSize)
                        this.drawGridLine(this.gridGroup, i, i, 0, this.height);
                    break;
                }
            case (grid.diamond):
            case (grid.isometric):
                {
                    var point = /** @class */ (function () {
                        function point(x, y) {
                            this.x = x;
                            this.y = y;
                        }
                        return point;
                    }());
                    var upperFence = [];
                    var rightFence = [];
                    var bottomFence = [];
                    var leftFence = [];
                    var ori = new point(0, 0);
                    var tor = new point(this.width, 0);
                    var bol = new point(0, this.height);
                    var end = new point(this.width, this.height);
                    var persp = (this.gridMode == grid.diamond) ? 1 : 2;
                    for (var i = this.gridSize * persp; i < this.width; i += this.gridSize * persp)
                        upperFence.push(new point(i, 0));
                    for (var i = this.gridSize; i < this.height; i += this.gridSize)
                        rightFence.push(new point(this.width, i));
                    for (var i = this.gridSize; i < this.height; i += this.gridSize)
                        leftFence.push(new point(0, i));
                    for (var i = this.gridSize * persp; i < this.width; i += this.gridSize * persp)
                        bottomFence.push(new point(i, this.height));
                    var ur = upperFence.concat([tor].concat(rightFence));
                    var lb = leftFence.concat([bol].concat(bottomFence));
                    var lu = leftFence.reverse().concat([ori].concat(upperFence));
                    var br = bottomFence.concat([end].concat(rightFence.reverse()));
                    for (var i = 0; i < upperFence.length + rightFence.length + 1; i++) {
                        this.drawGridLine(this.gridGroup, ur[i].x, lb[i].x, ur[i].y, lb[i].y);
                        this.drawGridLine(this.gridGroup, lu[i].x, br[i].x, lu[i].y, br[i].y);
                    }
                    break;
                }
        }
    };
    DrawingDiagrams.prototype.drawGridLine = function (gridGroup, x1, x2, y1, y2) {
        var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("id", "dashed-line");
        line.setAttribute("x1", String(x1));
        line.setAttribute("x2", String(x2));
        line.setAttribute("y1", String(y1));
        line.setAttribute("y2", String(y2));
        line.setAttribute("style", "stroke:rgb(192,192,192);stroke-width:1;stroke-dasharray:6 4");
        gridGroup.appendChild(line);
    };
    DrawingDiagrams.prototype.createUserEvents = function () {
        this.svgElement.addEventListener("mousedown", this.pressEventHandler);
        this.svgElement.addEventListener("mousemove", this.dragEventHandler);
        this.svgElement.addEventListener("mouseup", this.releaseEventHandler);
        this.svgElement.addEventListener("mouseout", this.cancelEventHandler);
        this.svgElement.addEventListener("touchstart", this.pressEventHandler);
        this.svgElement.addEventListener("touchmove", this.dragEventHandler);
        this.svgElement.addEventListener("touchend", this.releaseEventHandler);
        this.svgElement.addEventListener("touchcancel", this.cancelEventHandler);
        document.getElementById('clearBtn').addEventListener("click", this.clearEventHandler);
        document.getElementById('gridBtn').addEventListener("click", this.toggleGridHandler);
        document.getElementById('drawBtn').addEventListener("click", this.drawEventHandler);
        document.getElementById('moveBtn').addEventListener("click", this.moveEventHandler);
    };
    DrawingDiagrams.prototype.createTensorEvents = function (t) {
        var _this = this;
        t.shape.addEventListener("mousedown", function (e) { return _this.pressTensorEventHandler(e, t); });
        t.shape.addEventListener("touchstart", function (e) { return _this.pressTensorEventHandler(e, t); });
    };
    DrawingDiagrams.prototype.removeTensorEvents = function (t) {
        var _this = this;
        t.shape.removeEventListener("mousedown", function (e) { return _this.pressTensorEventHandler(e, t); });
        t.shape.addEventListener("touchstart", function (e) { return _this.pressTensorEventHandler(e, t); });
    };
    DrawingDiagrams.prototype.addTensorClick = function (t) {
        switch (this.mode) {
            case (mode.draw):
                {
                    if (!this.selectedTensor.isSelected) {
                        this.selectedTensor.isSelected = true;
                        this.selectedTensor.obj = t;
                        t.shape.setAttribute("stroke-width", "2");
                        this.placeholderIndex = this.createIndex(this.selectedTensor.obj.posX, this.selectedTensor.obj.posX, this.selectedTensor.obj.posY, this.selectedTensor.obj.posY);
                        this.placeholderIndex.text.textContent = "";
                        this.placeholderIndex.line.setAttribute("style", "stroke:rgb(20,20,140)");
                        //this.indexesGroup.appendChild(this.placeholderIndex.mIndex);
                    }
                    else {
                        this.selectedTensor.isSelected = false;
                        if (t.id === this.selectedTensor.obj.id) {
                            this.deleteIndex(this.placeholderIndex, false);
                            this.deleteTensor(t);
                        }
                        else {
                            this.deleteIndex(this.placeholderIndex, false);
                            this.selectedTensor.obj.shape.setAttribute("stroke-width", "1");
                            var newIndex = this.createIndex(this.selectedTensor.obj.posX, t.posX, this.selectedTensor.obj.posY, t.posY);
                            // pass references to which index is connected to each tensor - maybe abstract this a little more
                            this.selectedTensor.obj.insertLegRef(newIndex, true);
                            t.insertLegRef(newIndex, false);
                        }
                    }
                    break;
                }
            case (mode.move):
                {
                    if (!this.selectedTensor.isSelected) {
                        this.selectedTensor.isSelected = true;
                        this.selectedTensor.obj = t;
                        t.shape.setAttribute("stroke-width", "2");
                    }
                    else {
                        this.selectedTensor.isSelected = false;
                        //this.selectedTensor.obj = null;
                        t.shape.setAttribute("stroke-width", "1");
                    }
                    break;
                }
        }
    };
    DrawingDiagrams.prototype.createIndexEvents = function (i) {
        var _this = this;
        i.circle.addEventListener("mousedown", function (e) { return _this.pressIndexEventHandler(e, i); });
        i.circle.addEventListener("touchstart", function (e) { return _this.pressIndexEventHandler(e, i); });
    };
    DrawingDiagrams.prototype.removeIndexEvents = function (i) {
        var _this = this;
        i.circle.removeEventListener("mousedown", function (e) { return _this.pressIndexEventHandler(e, i); });
        i.circle.addEventListener("touchstart", function (e) { return _this.pressIndexEventHandler(e, i); });
    };
    DrawingDiagrams.prototype.addIndexClick = function (i) {
        switch (this.mode) {
            case (mode.draw):
                {
                    //if(!this.selectedIndex.isSelected)
                    //{
                    //this.selectedIndex.isSelected = true;
                    //this.selectedIndex.obj = i;
                    //i.line.setAttribute("style","stroke:black;stroke-width:2");
                    //}
                    //else
                    //{
                    //this.selectedIndex.isSelected = false;
                    //if (i === this.selectedIndex.obj)
                    //{
                    this.deleteIndex(i, true);
                    //}
                    //else
                    //{
                    //    i.line.setAttribute("style","stroke:black;stroke-width:1");
                    //}
                    //}
                    break;
                }
        }
    };
    DrawingDiagrams.prototype.createTensor = function (x, y) {
        var newTensor = new tensor(x, y);
        tensor.counter++;
        this.createTensorEvents(newTensor);
        this.tensorsArray.push(newTensor);
        this.tensorsGroup.appendChild(newTensor.mTensor);
        return newTensor;
    };
    DrawingDiagrams.prototype.deleteTensor = function (t, memory) {
        var _this = this;
        if (memory === void 0) { memory = true; }
        this.removeTensorEvents(t);
        tensor.pendingIDs.push(t.id);
        tensor.pendingIDs.sort(function (v1, v2) { return (v2 - v1); });
        tensor.counter--;
        if (memory) {
            // here we have to delete not only the indexes, but all the references of all tensors!
            t.legsRefs.forEach(function (leg) {
                _this.tensorsArray.forEach(function (ten) {
                    if (ten !== t) {
                        var ind_1 = ten.legsRefs.indexOf(leg, 0);
                        if (ind_1 > -1)
                            ten.legsRefs.splice(ind_1, 1);
                    }
                });
                _this.deleteIndex(leg, false);
            });
        }
        this.tensorsGroup.removeChild(t.mTensor);
        var ind = this.tensorsArray.indexOf(t, 0);
        if (ind > -1)
            this.tensorsArray.splice(ind, 1);
    };
    DrawingDiagrams.prototype.createIndex = function (x1, x2, y1, y2) {
        var newIndex = new index(x1, x2, y1, y2);
        index.counter++;
        this.createIndexEvents(newIndex);
        this.indexesArray.push(newIndex);
        this.indexesGroup.appendChild(newIndex.mIndex);
        return newIndex;
    };
    DrawingDiagrams.prototype.deleteIndex = function (i, memory) {
        this.removeIndexEvents(i);
        index.pendingIDs.push(i.id);
        index.pendingIDs.sort(function (v1, v2) { return (v2 - v1); });
        index.counter--;
        if (memory) {
            // make all tensors forget about me
            this.tensorsArray.forEach(function (ten) {
                var ind = ten.legsRefs.indexOf(i, 0);
                if (ind > -1)
                    ten.legsRefs.splice(ind, 1);
            });
        }
        this.indexesGroup.removeChild(i.mIndex);
        var ind = this.indexesArray.indexOf(i, 0);
        if (ind > -1)
            this.indexesArray.splice(ind, 1);
    };
    DrawingDiagrams.prototype.snap = function (x, y) {
        switch (this.gridMode) {
            case (grid.square):
                {
                    x = Math.round(x / this.gridSize) * this.gridSize;
                    y = Math.round(y / this.gridSize) * this.gridSize;
                    break;
                }
            case (grid.diamond):
                {
                    // this is not strictly right...
                    x = Math.round(2 * x / (this.gridSize)) * (this.gridSize / 2); ///2 //+ Math.round(x/(this.gridSize/2));
                    y = Math.round(2 * y / (this.gridSize)) * (this.gridSize / 2); ///2 //+ Math.round(y/(this.gridSize/2));    
                    break;
                }
            case (grid.isometric):
                {
                    // this is not strictly right...
                    x = Math.round(x / (this.gridSize)) * (this.gridSize); ///2 //+ Math.round(x/(this.gridSize/2));
                    y = Math.round(2 * y / (this.gridSize)) * (this.gridSize / 2); ///2 //+ Math.round(y/(this.gridSize/2));    
                    break;
                }
        }
        return [x, y];
    };
    DrawingDiagrams.prototype.addClick = function (x, y, dragging) {
        var _a;
        if (this.snapToGrid)
            _a = this.snap(x, y), x = _a[0], y = _a[1];
        switch (this.mode) {
            case mode.draw:
                {
                    if (!dragging && !this.selectedTensor.isSelected) {
                        this.createTensor(x, y);
                    }
                    else {
                        var t = this.createTensor(x, y);
                        t.shape.setAttribute("class", "point");
                        t.shape.setAttribute("id", "point");
                        t.shape.setAttribute("r", "4");
                        t.shape.setAttribute("stroke", "rgb(255,255,255)");
                        t.shape.setAttribute("fill", "rgb(230,230,230)");
                        t.text.setAttribute("dx", "10");
                        //t.text.textContent = String("");
                        this.addTensorClick(t);
                    }
                    break;
                }
        }
        this.clickX.push(x);
        this.clickY.push(y);
        this.clickDrag.push(dragging);
    };
    DrawingDiagrams.prototype.addMove = function (x, y) {
        var _a;
        if (this.snapToGrid)
            _a = this.snap(x, y), x = _a[0], y = _a[1];
        switch (this.mode) {
            case mode.draw:
                {
                    this.placeholderIndex.line.setAttribute("x2", String(x));
                    this.placeholderIndex.line.setAttribute("y2", String(y));
                    break;
                }
            case mode.move:
                {
                    this.selectedTensor.obj.setPosition(x, y);
                    break;
                }
        }
    };
    DrawingDiagrams.prototype.clearCanvas = function () {
        while (this.tensorsGroup.firstChild)
            this.tensorsGroup.removeChild(this.tensorsGroup.firstChild);
        while (this.indexesGroup.firstChild)
            this.indexesGroup.removeChild(this.indexesGroup.firstChild);
        tensor.counter = 0;
        tensor.pendingIDs = [];
        this.tensorsArray = [];
        index.counter = 0;
        index.pendingIDs = [];
        this.indexesArray = [];
    };
    return DrawingDiagrams;
}());
new DrawingDiagrams();
