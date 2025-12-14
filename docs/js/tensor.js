"use strict";
class index {
    constructor(X1, X2, Y1, Y2) {
        this.X1 = X1;
        this.X2 = X2;
        this.Y1 = Y1;
        this.Y2 = Y2;
        this.createShapetext();
        return this;
    }
    createShapetext() {
        this.id = index.pendingIDs.pop() ?? ++index.counter;
        let mIndex = document.createElementNS("http://www.w3.org/2000/svg", "g");
        let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        line.setAttribute("class", "index");
        line.setAttribute("x1", String(this.X1));
        line.setAttribute("x2", String(this.X2));
        line.setAttribute("y1", String(this.Y1));
        line.setAttribute("y2", String(this.Y2));
        line.setAttribute("stroke", "black");
        line.setAttribute("stroke-width", "1");
        let Xm = Math.floor(this.X1 + this.X2) / 2;
        let Ym = Math.floor(this.Y1 + this.Y2) / 2;
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
    }
    // note that these functions are not modifing the members X1 and X2!!!!!!!!!!!!
    moveP1(newX, newY) {
        this.line.setAttribute("x1", String(newX));
        this.line.setAttribute("y1", String(newY));
        this.X1 = newX;
        this.Y1 = newY;
        let Xm = Math.floor(newX + this.X2) / 2;
        let Ym = Math.floor(newY + this.Y2) / 2;
        this.circle.setAttribute("cx", String(Xm));
        this.circle.setAttribute("cy", String(Ym));
        this.text.setAttribute("x", String(Xm));
        this.text.setAttribute("y", String(Ym));
    }
    moveP2(newX, newY) {
        this.line.setAttribute("x2", String(newX));
        this.line.setAttribute("y2", String(newY));
        this.X2 = newX;
        this.Y2 = newY;
        let Xm = Math.floor(this.X1 + newX) / 2;
        let Ym = Math.floor(this.Y1 + newY) / 2;
        this.circle.setAttribute("cx", String(Xm));
        this.circle.setAttribute("cy", String(Ym));
        this.text.setAttribute("x", String(Xm));
        this.text.setAttribute("y", String(Ym));
    }
}
index.counter = 0;
index.pendingIDs = [];
class tensor {
    constructor(posX, posY, radius = 20) {
        this.posX = posX;
        this.posY = posY;
        this.radius = radius;
        this.legsRefs = [];
        this.whichPoint = [];
        this.isPoint = false;
        this.justCreated = false;
        this.createShapetext();
        return this;
    }
    createShapetext() {
        this.id = tensor.pendingIDs.pop() ?? ++tensor.counter;
        console.log("create tensor with: cx = " + this.posX + " cy = " + this.posY + " and ID: " + this.id);
        let mTensor = document.createElementNS("http://www.w3.org/2000/svg", "g");
        let shape = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
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
    }
    insertLegRef(leg, p1) {
        p1 ? console.log("leg (id: " + leg.id + ") comming OUT tensor " + this.id) : console.log("leg (id: " + leg.id + ") comming IN tensor " + this.id);
        this.legsRefs.push(leg);
        this.whichPoint.push(p1);
    }
    setPosition(newPosX, newPosY) {
        this.posX = newPosX;
        this.posY = newPosY;
        this.shape.setAttribute("cx", String(newPosX));
        this.shape.setAttribute("cy", String(newPosY));
        this.text.setAttribute("x", String(newPosX));
        this.text.setAttribute("y", String(newPosY));
        this.legsRefs.forEach((leg, i) => { this.whichPoint[i] ? leg.moveP1(newPosX, newPosY) : leg.moveP2(newPosX, newPosY); });
    }
}
tensor.counter = 0;
tensor.pendingIDs = [];
// enumerate the modes the app can have
// draw -> draw tensors and links with mouse clicks
// move -> move tensors and legs atached to it at the same time
var mode;
(function (mode) {
    mode[mode["draw"] = 0] = "draw";
    mode[mode["move"] = 1] = "move";
})(mode || (mode = {}));
;
// A strict state machine to manage the application's behavior.
var AppState;
(function (AppState) {
    // Move Mode States
    AppState[AppState["MOVE_IDLE"] = 0] = "MOVE_IDLE";
    AppState[AppState["MOVE_TENSOR_DRAGGING"] = 1] = "MOVE_TENSOR_DRAGGING";
    // Draw Mode States
    AppState[AppState["DRAW_IDLE"] = 2] = "DRAW_IDLE";
    AppState[AppState["DRAW_PREVIEWING"] = 3] = "DRAW_PREVIEWING";
    // Canvas Interaction States
    AppState[AppState["CANVAS_PANNING"] = 4] = "CANVAS_PANNING";
    AppState[AppState["CANVAS_PINCH_ZOOMING"] = 5] = "CANVAS_PINCH_ZOOMING";
})(AppState || (AppState = {}));
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
class visualTensor {
    constructor() {
        this.width = 0;
        this.gridSize = 50;
        this.snapToGrid = false;
        this.gridMode = grid.none;
        this.defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        this.contentGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.gridGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.indexesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.tensorsGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.indexesArray = [];
        this.tensorsArray = [];
        // --- State Machine Properties ---
        this.state = AppState.DRAW_IDLE;
        this.lastEvent = new MouseEvent('mousedown');
        this.currentMode = mode.draw;
        // --- Pan & Zoom Properties ---
        this.currentScale = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.pressTensorEventHandlerMap = new Map();
        // --- State-based Event Handlers ---
        this.pressTensorEventHandler = (e, t) => {
            e.stopPropagation();
            this.lastEvent = e;
            // For touch events, prevent the browser from firing a subsequent 'mousedown' event.
            if (window.TouchEvent && e instanceof TouchEvent) {
                e.preventDefault();
            }
            // Grace period for new tensors on touch devices to prevent instant selection.
            if (t.justCreated) {
                t.justCreated = false;
                return;
            }
            switch (this.state) {
                case AppState.MOVE_IDLE:
                    // Start dragging a tensor
                    if (t.isPoint)
                        return; // Cannot move points directly
                    this.state = AppState.MOVE_TENSOR_DRAGGING;
                    this.activeTensor = t;
                    t.shape.setAttribute("stroke-width", "2");
                    this.attachDragListeners();
                    break;
                case AppState.DRAW_IDLE:
                    // Start previewing a new connection
                    if (t.isPoint)
                        return; // Cannot draw from a point
                    this.state = AppState.DRAW_PREVIEWING;
                    this.activeTensor = t;
                    t.shape.setAttribute("stroke-width", "2");
                    this.placeholderIndex = this.createIndex(t.posX, t.posX, t.posY, t.posY);
                    this.placeholderIndex.line.setAttribute("style", "stroke:rgb(20,20,140); stroke-dasharray: 6 4;");
                    this.placeholderIndex.line.setAttribute("pointer-events", "none"); // Allow clicks to pass through the preview line
                    break;
                case AppState.DRAW_PREVIEWING:
                    // Complete the connection
                    if (this.activeTensor && this.activeTensor.id === t.id) {
                        // Clicked the same tensor again: delete it.
                        this.deleteTensor(t);
                    }
                    else if (this.activeTensor) {
                        // Clicked a different tensor: connect them.
                        const newIndex = this.createIndex(this.activeTensor.posX, t.posX, this.activeTensor.posY, t.posY);
                        this.activeTensor.insertLegRef(newIndex, true);
                        t.insertLegRef(newIndex, false);
                    }
                    this.resetToIdleState();
                    break;
            }
        };
        this.previewMoveHandler = (e) => {
            if (this.state !== AppState.DRAW_PREVIEWING)
                return;
            const { x, y } = this.getPointerPosition(e);
            if (this.placeholderIndex) {
                let snapped = this.snap(x, y);
                this.placeholderIndex.moveP2(snapped[0], snapped[1]);
            }
        };
        // --- Pan & Zoom Handlers ---
        this.wheelEventHandler = (e) => {
            e.preventDefault(); // Prevent page scrolling
            e.stopPropagation();
            const zoomPoint = {
                x: e.clientX - this.svgElement.getBoundingClientRect().left,
                y: e.clientY - this.svgElement.getBoundingClientRect().top
            }; // Screen coords relative to SVG
            const zoomFactor = e.deltaY < 0 ? 1.1 : 1 / 1.1; // Zoom in or out
            this.applyZoom(zoomFactor, zoomPoint);
        };
        this.canvasPanMoveHandler = (e) => {
            if (this.state === AppState.CANVAS_PINCH_ZOOMING && window.TouchEvent && e instanceof TouchEvent && e.touches.length === 2) {
                e.preventDefault();
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const currentPinchDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
                if (this.initialPinchDistance && this.initialPinchCenter) {
                    const zoomFactor = currentPinchDistance / this.initialPinchDistance;
                    this.applyZoom(zoomFactor, this.initialPinchCenter);
                    this.initialPinchDistance = currentPinchDistance;
                }
                return;
            }
            // If we are in an idle state, check if we should start panning
            if ((this.state === AppState.DRAW_IDLE || this.state === AppState.MOVE_IDLE) && this.panStartPoint) {
                const { clientX, clientY } = (e instanceof MouseEvent) ? e : e.touches[0];
                const dx = clientX - this.panStartPoint.x;
                const dy = clientY - this.panStartPoint.y;
                if (dx * dx + dy * dy > 25) { // Drag threshold
                    this.state = AppState.CANVAS_PANNING;
                    this.svgElement.style.cursor = 'grabbing'; // Add cursor feedback
                }
            }
            // If we are panning, update the translation
            if (this.state === AppState.CANVAS_PANNING) {
                e.preventDefault();
                const { clientX, clientY } = (e instanceof MouseEvent) ? e : e.touches[0];
                if (this.panStartPoint) {
                    const dx = clientX - this.panStartPoint.x;
                    const dy = clientY - this.panStartPoint.y;
                    this.translateX += dx;
                    this.translateY += dy;
                    this.applyTransform();
                    this.panStartPoint = { x: clientX, y: clientY };
                }
            }
        };
        this.canvasPanReleaseHandler = (e) => {
            this.detachPanListeners(); // Always detach
            this.svgElement.style.cursor = 'default';
            if (this.state === AppState.CANVAS_PANNING || this.state === AppState.CANVAS_PINCH_ZOOMING) {
                this.resetToIdleState();
            }
            else if (this.state === AppState.DRAW_IDLE) {
                // If we are here, the state was never changed to PANNING, so it was a click.
                this.pressBackgroundHandler();
            }
            // If state was MOVE_IDLE, a click does nothing.
            this.panStartPoint = undefined; // Always clear
        };
        // --- Original Methods (Refactored or Kept) ---
        this.pressIndexEventHandlerMap = new Map();
        this.clearEventHandler = () => {
            console.log("clear event");
            this.clearCanvas();
        };
        this.toggleGridHandler = () => {
            // three way toggle at the moment
            switch (this.gridMode) {
                case (grid.none):
                    {
                        this.gridMode = grid.square;
                        this.snapToGrid = true;
                        break;
                    }
                case (grid.square):
                    {
                        this.gridMode = grid.diamond;
                        this.snapToGrid = true;
                        break;
                    }
                case (grid.diamond):
                    {
                        this.gridMode = grid.isometric;
                        this.snapToGrid = true;
                        break;
                    }
                case (grid.isometric):
                    {
                        this.gridMode = grid.none;
                        this.snapToGrid = false;
                        break;
                    }
            }
            this.drawGrid();
            console.log("toggle the grid to " + grid[this.gridMode]);
        };
        this.drawEventHandler = () => {
            this.setMode(mode.draw);
        };
        this.pressEventHandler = (e) => {
            this.lastEvent = e;
            if (window.TouchEvent && e instanceof TouchEvent) {
                e.preventDefault();
            }
            // Check for multi-touch (pinch-to-zoom) first
            if (window.TouchEvent && e instanceof TouchEvent && e.touches.length === 2) {
                this.startPinchZoom(e);
                return;
            }
            // If we are here, it's a single-point press.
            // Since interactive elements stop propagation, any event here is a background interaction.
            if (this.state === AppState.DRAW_PREVIEWING) {
                // This is a definite click to create a dangling leg. No drag/pan involved.
                this.pressBackgroundHandler();
                return;
            }
            if (this.state === AppState.DRAW_IDLE || this.state === AppState.MOVE_IDLE) {
                // This could be a click (to create in draw mode) or a drag (to pan).
                // Set up listeners to determine which it is.
                const { clientX, clientY } = (e instanceof MouseEvent) ? e : e.touches[0];
                this.panStartPoint = { x: clientX, y: clientY };
                this.svgElement.style.cursor = 'grab';
                this.attachPanListeners();
            }
        };
        this.moveEventHandler = () => {
            this.setMode(mode.move);
        };
        this.svgElement = document.getElementById('svg-board');
        this.divWrapper = document.getElementById('wrapper');
        if (!this.svgElement || !this.divWrapper) {
            console.error("Required elements not found in the DOM.");
            this.height = 0;
            this.offsetX = 0;
            this.offsetY = 0;
            return;
        }
        this.width = this.svgElement.clientWidth;
        this.height = this.svgElement.clientHeight;
        // These will be updated on pointer events to account for scroll
        this.offsetX = 0;
        this.offsetY = 0;
        this.svgElement.appendChild(this.defs);
        //if (!this.snapToGrid) this.gridGroup.setAttribute("opacity","0");
        this.drawGrid();
        this.svgElement.appendChild(this.contentGroup); // Append the new content group
        this.contentGroup.appendChild(this.gridGroup); // Grid also goes into the content group
        this.contentGroup.appendChild(this.indexesGroup);
        this.contentGroup.appendChild(this.tensorsGroup);
        this.contentGroup.setAttribute("id", "content-group");
        this.gridGroup.setAttribute("id", "grid");
        this.indexesGroup.setAttribute("id", "indexes");
        this.tensorsGroup.setAttribute("id", "tensors");
        this.createUserEvents();
    }
    getPointerPosition(e) {
        const svgRect = this.svgElement.getBoundingClientRect();
        let clientX = 0;
        let clientY = 0;
        if (window.TouchEvent && e instanceof TouchEvent) {
            if (e.touches.length > 0) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            }
            else {
                // No touches, return last known position or handle error
                return { x: 0, y: 0 }; // Or throw an error, depending on desired strictness
            }
        }
        else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        // Convert screen coordinates to SVG element coordinates
        const svgX = clientX - svgRect.left;
        const svgY = clientY - svgRect.top;
        // Apply inverse of current pan and zoom to get untransformed content coordinates
        const untransformedX = (svgX - this.translateX) / this.currentScale;
        const untransformedY = (svgY - this.translateY) / this.currentScale;
        return {
            x: untransformedX,
            y: untransformedY
        };
    }
    drawGrid() {
        // Clear existing grid and defs
        while (this.gridGroup.firstChild)
            this.gridGroup.removeChild(this.gridGroup.firstChild);
        while (this.defs.firstChild)
            this.defs.removeChild(this.defs.firstChild);
        if (this.gridMode === grid.none)
            return;
        // Create Pattern
        let pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
        pattern.setAttribute("id", "gridPattern");
        pattern.setAttribute("width", String(this.gridSize));
        pattern.setAttribute("height", String(this.gridSize));
        pattern.setAttribute("patternUnits", "userSpaceOnUse");
        // Determine transform based on mode
        let transform = "";
        switch (this.gridMode) {
            case grid.diamond:
                transform = "rotate(45)";
                break;
            case grid.isometric:
                transform = "scale(2 1) rotate(45)";
                break;
            case grid.square:
            default:
                transform = "";
                break;
        }
        if (transform) {
            pattern.setAttribute("patternTransform", transform);
        }
        let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("id", "gridPath");
        path.setAttribute("d", `M ${this.gridSize} 0 L 0 0 0 ${this.gridSize}`);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "rgb(150,150,150)");
        path.setAttribute("stroke-width", String(2 / this.currentScale));
        path.setAttribute("stroke-dasharray", "6 4");
        pattern.appendChild(path);
        this.defs.appendChild(pattern);
        // Create Large Rect
        let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("width", "200000");
        rect.setAttribute("height", "200000");
        rect.setAttribute("x", "-100000");
        rect.setAttribute("y", "-100000");
        rect.setAttribute("fill", "url(#gridPattern)");
        rect.setAttribute("pointer-events", "none");
        this.gridGroup.appendChild(rect);
    }
    createUserEvents() {
        this.svgElement.addEventListener("mousedown", this.pressEventHandler);
        // The new listener for the connection preview, which does not require holding the mouse button.
        this.svgElement.addEventListener("mousemove", this.previewMoveHandler);
        this.svgElement.addEventListener("touchstart", this.pressEventHandler);
        this.svgElement.addEventListener("wheel", this.wheelEventHandler, { passive: false });
        const clearBtn = document.getElementById('clearBtn');
        if (clearBtn)
            clearBtn.addEventListener("click", this.clearEventHandler);
        const gridBtn = document.getElementById('gridBtn');
        if (gridBtn)
            gridBtn.addEventListener("click", this.toggleGridHandler);
        const drawBtn = document.getElementById('drawBtn');
        if (drawBtn)
            drawBtn.addEventListener("click", this.drawEventHandler);
        const moveBtn = document.getElementById('moveBtn');
        if (moveBtn)
            moveBtn.addEventListener("click", this.moveEventHandler);
    }
    createTensorEvents(t) {
        const handler = (e) => this.pressTensorEventHandler(e, t);
        this.pressTensorEventHandlerMap.set(t.id, handler);
        t.shape.addEventListener("mousedown", handler);
        t.shape.addEventListener("touchstart", handler);
    }
    removeTensorEvents(t) {
        const handler = this.pressTensorEventHandlerMap.get(t.id);
        if (handler) {
            t.shape.removeEventListener("mousedown", handler);
            t.shape.removeEventListener("touchstart", handler);
            this.pressTensorEventHandlerMap.delete(t.id);
        }
    }
    pressBackgroundHandler() {
        switch (this.state) {
            case AppState.DRAW_IDLE:
                this.lastEvent.stopPropagation(); // Prevent event from bubbling to the new tensor
                // Create a new tensor on the canvas
                const { x, y } = this.getPointerPosition(this.lastEvent);
                this.createTensor(x, y);
                break;
            case AppState.DRAW_PREVIEWING:
                // Create a dangling leg
                if (this.activeTensor) {
                    const { x, y } = this.getPointerPosition(this.lastEvent);
                    const endPoint = this.createTensor(x, y, true);
                    const newIndex = this.createIndex(this.activeTensor.posX, x, this.activeTensor.posY, y);
                    this.activeTensor.insertLegRef(newIndex, true);
                    endPoint.insertLegRef(newIndex, false);
                }
                this.resetToIdleState();
                break;
            case AppState.MOVE_IDLE:
                // Future: could initiate canvas panning here. For now, does nothing.
                // This is now handled by the main pressEventHandler, which checks for background clicks.
                break;
        }
    }
    dragHandler(e) {
        if (this.state !== AppState.MOVE_TENSOR_DRAGGING)
            return;
        const { x, y } = this.getPointerPosition(e);
        if (this.activeTensor) {
            let snapped = this.snap(x, y);
            this.activeTensor.setPosition(snapped[0], snapped[1]);
        }
        e.preventDefault();
    }
    releaseHandler() {
        if (this.state === AppState.MOVE_TENSOR_DRAGGING) {
            this.detachDragListeners();
            this.resetToIdleState();
        }
    }
    // --- Utility and Helper Functions ---
    resetToIdleState() {
        this.svgElement.style.cursor = 'default';
        if (this.activeTensor) {
            this.activeTensor.shape.setAttribute("stroke-width", "1");
        }
        if (this.placeholderIndex) {
            this.deleteIndex(this.placeholderIndex, false);
        }
        this.activeTensor = undefined;
        this.placeholderIndex = undefined;
        // Clear pan/zoom specific temporary states
        this.panStartPoint = undefined;
        this.initialPinchDistance = undefined;
        this.initialPinchCenter = undefined;
        // Determine the correct idle state based on the current mode
        this.state = this.currentMode === mode.move ? AppState.MOVE_IDLE : AppState.DRAW_IDLE;
    }
    attachDragListeners() {
        const dragFunc = (e) => this.dragHandler(e);
        const releaseFunc = () => this.releaseHandler();
        window.addEventListener("mousemove", dragFunc);
        window.addEventListener("mouseup", releaseFunc);
        window.addEventListener("touchmove", dragFunc, { passive: false });
        window.addEventListener("touchend", releaseFunc);
        // Store references to remove them later
        this.boundDragHandler = dragFunc;
        this.boundReleaseHandler = releaseFunc;
    }
    detachDragListeners() {
        if (this.boundDragHandler)
            window.removeEventListener("mousemove", this.boundDragHandler);
        if (this.boundReleaseHandler)
            window.removeEventListener("mouseup", this.boundReleaseHandler);
        if (this.boundDragHandler)
            window.removeEventListener("touchmove", this.boundDragHandler);
        if (this.boundReleaseHandler)
            window.removeEventListener("touchend", this.boundReleaseHandler);
        this.boundDragHandler = undefined;
        this.boundReleaseHandler = undefined;
    }
    startPinchZoom(e) {
        this.state = AppState.CANVAS_PINCH_ZOOMING;
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        this.initialPinchDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
        this.initialPinchCenter = {
            x: (touch1.clientX + touch2.clientX) / 2 - this.svgElement.getBoundingClientRect().left,
            y: (touch1.clientY + touch2.clientY) / 2 - this.svgElement.getBoundingClientRect().top
        };
        this.attachPanListeners(); // Use the same listeners, but they'll call pinchZoomMoveHandler
    }
    attachPanListeners() {
        if (this.boundCanvasPanMoveHandler)
            return;
        this.boundCanvasPanMoveHandler = (e) => this.canvasPanMoveHandler(e);
        this.boundCanvasPanReleaseHandler = (e) => this.canvasPanReleaseHandler(e);
        window.addEventListener("mousemove", this.boundCanvasPanMoveHandler);
        window.addEventListener("mouseup", this.boundCanvasPanReleaseHandler);
        window.addEventListener("touchmove", this.boundCanvasPanMoveHandler, { passive: false });
        window.addEventListener("touchend", this.boundCanvasPanReleaseHandler);
    }
    detachPanListeners() {
        if (this.boundCanvasPanMoveHandler) {
            window.removeEventListener("mousemove", this.boundCanvasPanMoveHandler);
            window.removeEventListener("touchmove", this.boundCanvasPanMoveHandler);
        }
        if (this.boundCanvasPanReleaseHandler) {
            window.removeEventListener("mouseup", this.boundCanvasPanReleaseHandler);
            window.removeEventListener("touchend", this.boundCanvasPanReleaseHandler);
        }
        this.boundCanvasPanMoveHandler = undefined;
        this.boundCanvasPanReleaseHandler = undefined;
    }
    applyZoom(zoomFactor, zoomPoint) {
        const newScale = this.currentScale * zoomFactor;
        // Limit zoom to reasonable bounds (e.g., 0.1x to 10x)
        if (newScale < 0.1 || newScale > 10) {
            return;
        }
        // Adjust translation to keep the zoomPoint fixed relative to the content
        this.translateX = zoomPoint.x - (zoomPoint.x - this.translateX) * (newScale / this.currentScale);
        this.translateY = zoomPoint.y - (zoomPoint.y - this.translateY) * (newScale / this.currentScale);
        this.currentScale = newScale;
        this.applyTransform();
    }
    applyTransform() {
        this.contentGroup.setAttribute("transform", `translate(${this.translateX} ${this.translateY}) scale(${this.currentScale})`);
        const gridPath = this.defs.querySelector("#gridPath");
        if (gridPath) {
            gridPath.setAttribute("stroke-width", String(2 / this.currentScale));
        }
    }
    createIndexEvents(i) {
        // In draw mode, clicking an index deletes it.
        const clickHandler = (e) => {
            e.stopPropagation(); // Prevent the event from bubbling up to the SVG background
            if (this.currentMode === mode.draw) { // Only allow deletion in draw mode
                this.deleteIndex(i, true);
                this.resetToIdleState(); // Reset state after deletion
            }
        };
        this.pressIndexEventHandlerMap.set(i.id, clickHandler);
        i.circle.addEventListener("mousedown", clickHandler);
        i.circle.addEventListener("touchstart", clickHandler);
    }
    removeIndexEvents(i) {
        const handler = this.pressIndexEventHandlerMap.get(i.id);
        if (handler) {
            i.circle.removeEventListener("mousedown", handler);
            i.circle.removeEventListener("touchstart", handler);
            this.pressIndexEventHandlerMap.delete(i.id);
        }
    }
    createTensor(x, y, isPoint = false) {
        let [snappedX, snappedY] = this.snap(x, y);
        let newTensor = new tensor(snappedX, snappedY);
        newTensor.justCreated = true; // Set the flag on creation
        if (isPoint) {
            newTensor.isPoint = true;
            newTensor.shape.setAttribute("r", "4");
            // Points should always be visible, overriding the mode's opacity setting.
            newTensor.shape.setAttribute("opacity", "100%");
        }
        this.createTensorEvents(newTensor);
        this.tensorsArray.push(newTensor);
        this.tensorsGroup.appendChild(newTensor.mTensor);
        return newTensor;
    }
    deleteTensor(t, memory = true) {
        this.removeTensorEvents(t);
        tensor.pendingIDs.push(t.id);
        tensor.pendingIDs.sort((v1, v2) => (v2 - v1));
        if (memory) {
            const legsToDelete = [...t.legsRefs];
            legsToDelete.forEach((leg) => {
                this.tensorsArray.forEach((ten) => {
                    if (ten !== t) {
                        let ind = ten.legsRefs.indexOf(leg, 0);
                        if (ind > -1) {
                            ten.legsRefs.splice(ind, 1);
                            if (ten.isPoint && ten.legsRefs.length === 0) {
                                this.deleteTensor(ten, false);
                            }
                        }
                    }
                });
                this.deleteIndex(leg, false);
            });
        }
        this.tensorsGroup.removeChild(t.mTensor);
        let ind = this.tensorsArray.indexOf(t, 0);
        if (ind > -1)
            this.tensorsArray.splice(ind, 1);
    }
    createIndex(x1, x2, y1, y2) {
        let newIndex = new index(x1, x2, y1, y2);
        this.createIndexEvents(newIndex);
        this.indexesArray.push(newIndex);
        this.indexesGroup.appendChild(newIndex.mIndex);
        return newIndex;
    }
    deleteIndex(i, memory) {
        this.removeIndexEvents(i);
        index.pendingIDs.push(i.id);
        index.pendingIDs.sort((v1, v2) => (v2 - v1));
        if (memory) {
            this.tensorsArray.forEach((ten) => {
                let ind = ten.legsRefs.indexOf(i, 0);
                if (ind > -1)
                    ten.legsRefs.splice(ind, 1);
            });
        }
        this.indexesGroup.removeChild(i.mIndex);
        let ind = this.indexesArray.indexOf(i, 0);
        if (ind > -1)
            this.indexesArray.splice(ind, 1);
    }
    snap(x, y) {
        if (!this.snapToGrid)
            return [x, y];
        switch (this.gridMode) {
            case (grid.square):
                {
                    x = Math.round(x / this.gridSize) * this.gridSize;
                    y = Math.round(y / this.gridSize) * this.gridSize;
                    break;
                }
            case (grid.diamond):
                {
                    // Transform to grid space (Rotate -45)
                    const invSqrt2 = Math.SQRT1_2;
                    let u = (x + y) * invSqrt2;
                    let v = (y - x) * invSqrt2;
                    // Snap
                    u = Math.round(u / this.gridSize) * this.gridSize;
                    v = Math.round(v / this.gridSize) * this.gridSize;
                    // Transform back (Rotate 45)
                    x = (u - v) * invSqrt2;
                    y = (u + v) * invSqrt2;
                    break;
                }
            case (grid.isometric):
                {
                    const invSqrt2 = Math.SQRT1_2;
                    // Inverse: Scale(0.5, 1) then Rotate(-45)
                    let sx = x * 0.5;
                    let sy = y;
                    let u = (sx + sy) * invSqrt2;
                    let v = (sy - sx) * invSqrt2;
                    // Snap
                    u = Math.round(u / this.gridSize) * this.gridSize;
                    v = Math.round(v / this.gridSize) * this.gridSize;
                    // Forward: Rotate(45) then Scale(2, 1)
                    let rx = (u - v) * invSqrt2;
                    let ry = (u + v) * invSqrt2;
                    x = rx * 2;
                    y = ry;
                    break;
                }
        }
        return [x, y];
    }
    clearCanvas() {
        // Iterate backwards to safely remove items from the arrays
        while (this.tensorsArray.length > 0) {
            this.deleteTensor(this.tensorsArray[this.tensorsArray.length - 1], true);
        }
        tensor.counter = 0;
        tensor.pendingIDs = [];
        index.counter = 0;
        index.pendingIDs = [];
        this.resetToIdleState();
    }
    setMode(newMode) {
        console.log(`${mode[newMode]} mode selected`);
        this.currentMode = newMode;
        this.resetToIdleState(); // Ensure a clean state before changing modes
        if (newMode === mode.move) {
            this.state = AppState.MOVE_IDLE;
            this.tensorsArray.forEach((t) => t.text.setAttribute("opacity", "100%"));
            this.indexesArray.forEach((i) => {
                i.circle.setAttribute("opacity", "100%");
                i.text.setAttribute("opacity", "100%");
            });
        }
        else { // mode.draw
            this.state = AppState.DRAW_IDLE;
            this.tensorsArray.forEach((t) => t.text.setAttribute("opacity", "0%"));
            this.indexesArray.forEach((i) => {
                i.circle.setAttribute("opacity", "0%");
                i.text.setAttribute("opacity", "0%");
            });
        }
    }
}
new visualTensor();
