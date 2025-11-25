class index
{
    static counter: number = 0;
    static pendingIDs: Array<number> = [];

    public id!: number;
    
    public mIndex!: SVGGElement;
    public line!: SVGLineElement;
    public circle!: SVGCircleElement;
    public text!: SVGTextElement;

    constructor(public X1: number, public X2: number, public Y1: number, public Y2: number)
    {
        this.createShapetext();
        return this;
    }

    private createShapetext()
    {
        this.id = index.pendingIDs.pop() ?? ++index.counter;
  
        let mIndex: SVGGElement = document.createElementNS("http://www.w3.org/2000/svg","g");
        let line: SVGLineElement = document.createElementNS("http://www.w3.org/2000/svg","line");
        let circle: SVGCircleElement = document.createElementNS("http://www.w3.org/2000/svg","circle");
        let text: SVGTextElement = document.createElementNS("http://www.w3.org/2000/svg","text");

        line.setAttribute("class","index");
        line.setAttribute("x1",String(this.X1));
        line.setAttribute("x2",String(this.X2));
        line.setAttribute("y1",String(this.Y1));
        line.setAttribute("y2",String(this.Y2));
        line.setAttribute("stroke","black");
        line.setAttribute("stroke-width","1");

        let Xm = Math.floor(this.X1+this.X2)/2;
        let Ym = Math.floor(this.Y1+this.Y2)/2;
        
        circle.setAttribute("r",String("10"));
        circle.setAttribute("cx",String(Xm));
        circle.setAttribute("cy",String(Ym));
        circle.setAttribute("fill","rgb(255,255,255)");
        circle.setAttribute("opacity","0%");

        text.setAttribute("pointer-events","none");
        text.setAttribute("dominant-baseline","middle");
        text.setAttribute("text-anchor","middle");
        text.setAttribute("x",String(Xm));
        text.setAttribute("y",String(Ym));
        //text.setAttribute("stroke","rgb(0,0,0)");
        //text.setAttribute("fill","rgb(0,0,0)");
        text.textContent = String(this.id);
        text.setAttribute("opacity","0%");

        mIndex.appendChild(line);
        mIndex.appendChild(circle);
        mIndex.appendChild(text);

        this.mIndex = mIndex;
        this.line = line;
        this.circle = circle;
        this.text = text;
    }

    // note that these functions are not modifing the members X1 and X2!!!!!!!!!!!!
    public moveP1(newX: number, newY: number)
    {
        this.line.setAttribute("x1",String(newX));
        this.line.setAttribute("y1",String(newY));
        
        this.X1 = newX;
        this.Y1 = newY;
        let Xm = Math.floor(newX+this.X2)/2;
        let Ym = Math.floor(newY+this.Y2)/2;
        this.circle.setAttribute("cx",String(Xm));
        this.circle.setAttribute("cy",String(Ym));
        this.text.setAttribute("x",String(Xm));
        this.text.setAttribute("y",String(Ym));

    }

    public moveP2(newX: number, newY: number)
    {
        this.line.setAttribute("x2",String(newX));
        this.line.setAttribute("y2",String(newY));

        this.X2 = newX;
        this.Y2 = newY;
        let Xm = Math.floor(this.X1+newX)/2;
        let Ym = Math.floor(this.Y1+newY)/2;
        this.circle.setAttribute("cx",String(Xm));
        this.circle.setAttribute("cy",String(Ym));
        this.text.setAttribute("x",String(Xm));
        this.text.setAttribute("y",String(Ym));
    }
}

class tensor
{
    static counter: number = 0;
    static pendingIDs: Array<number> = [];

    public id!: number;

    public mTensor!: SVGGElement;
    public shape!: SVGCircleElement;
    public text!: SVGTextElement;

    public legsRefs: Array<index> = [];
    public whichPoint: Array<boolean> = [];
    public isPoint: boolean = false;

    constructor(public posX: number, public posY: number, public radius: number = 20)
    {
        this.createShapetext();
        return this;
    }

    private createShapetext()
    {
        this.id = tensor.pendingIDs.pop() ?? ++tensor.counter;
  
        console.log("create tensor with: cx = " + this.posX + " cy = " + this.posY + " and ID: " + this.id);

        let mTensor: SVGGElement = document.createElementNS("http://www.w3.org/2000/svg","g");
        let shape: SVGCircleElement = document.createElementNS("http://www.w3.org/2000/svg","circle");
        let text: SVGTextElement = document.createElementNS("http://www.w3.org/2000/svg","text");

        // TODO: set the id accordingly to its id number
        shape.setAttribute("class","tensor");
        shape.setAttribute("id","tensor");
        shape.setAttribute("r",String(this.radius));
        shape.setAttribute("cx",String(this.posX));
        shape.setAttribute("cy",String(this.posY));
        shape.setAttribute("stroke","black");
        shape.setAttribute("stroke-width","1");
        //shape.setAttribute("opacity","1") change opacity maybe?
        shape.setAttribute("fill","rgb(255,255,255)");

        text.setAttribute("pointer-events","none");
        text.setAttribute("dominant-baseline","middle");
        text.setAttribute("text-anchor","middle");
        text.setAttribute("x",String(this.posX));
        text.setAttribute("y",String(this.posY));
        //text.setAttribute("stroke","rgb(0,0,0)");
        //text.setAttribute("fill","rgb(0,0,0)");
        text.textContent = String(this.id);
        text.setAttribute("opacity","0%");

        mTensor.appendChild(shape);
        mTensor.appendChild(text);
        
        this.mTensor = mTensor;
        this.shape = shape;
        this.text = text;
    }

    public insertLegRef(leg: index, p1: boolean)
    {
        p1 ? console.log("leg (id: " + leg.id + ") comming OUT tensor " + this.id) : console.log("leg (id: " + leg.id + ") comming IN tensor " + this.id);
        this.legsRefs.push(leg);
        this.whichPoint.push(p1);
    }

    public setPosition(newPosX: number, newPosY: number)
    {
        this.posX = newPosX;
        this.posY = newPosY;
        this.shape.setAttribute("cx",String(newPosX));
        this.shape.setAttribute("cy",String(newPosY));
        this.text.setAttribute("x",String(newPosX));
        this.text.setAttribute("y",String(newPosY));

        this.legsRefs.forEach( (leg,i) => { this.whichPoint[i] ? leg.moveP1(newPosX, newPosY) : leg.moveP2(newPosX, newPosY) } );
    }
}

// enumerate the modes the app can have
// draw -> draw tensors and links with mouse clicks
// move -> move tensors and legs atached to it at the same time
enum mode
{
    draw,
    move
};

// A strict state machine to manage the application's behavior.
enum AppState {
    // Move Mode States
    MOVE_IDLE,          // Default state in move mode.
    MOVE_TENSOR_DRAGGING, // A tensor is being actively dragged.

    // Draw Mode States
    DRAW_IDLE,          // Default state in draw mode.
    DRAW_PREVIEWING,    // A tensor is selected, and the blue line is following the mouse.
}


// all types of grids
// superposed grid in future:
// https://stackoverflow.com/questions/39359740/what-are-enum-flags-in-typescript
enum grid
{
    none,
    square,
    diamond,
    isometric
}

interface select<T>
{
    isSelected: boolean;
    obj?: T;
}

class visualTensor
{
    private svgElement: SVGSVGElement;
    private divWrapper: HTMLElement | null;

    private width: number = 0;
    private height: number;
    private offsetX: number;
    private offsetY: number;
    
    private gridSize: number = 50;
    private snapToGrid: boolean = false;
    private gridMode: grid = grid.none;
    
    private gridGroup: SVGGElement = document.createElementNS("http://www.w3.org/2000/svg","g");
    private indexesGroup: SVGGElement = document.createElementNS("http://www.w3.org/2000/svg","g");
    private tensorsGroup: SVGGElement = document.createElementNS("http://www.w3.org/2000/svg","g");

    private indexesArray: Array<index> = [];
    private tensorsArray: Array<tensor> = [];

    // --- State Machine Properties ---
    private state: AppState = AppState.DRAW_IDLE;
    private activeTensor?: tensor; // The tensor being dragged or the source of a connection.
    private placeholderIndex?: index;
    private lastEvent: MouseEvent | TouchEvent = new MouseEvent('mousedown');
    private currentMode: mode = mode.draw;
    private boundDragHandler?: (e: MouseEvent | TouchEvent) => void;
    private boundReleaseHandler?: () => void;

    constructor()
    {
        this.svgElement = document.getElementById('svg-board') as unknown as SVGSVGElement;
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

        //if (!this.snapToGrid) this.gridGroup.setAttribute("opacity","0");
        this.drawGrid();

        this.svgElement.appendChild(this.gridGroup);
        this.svgElement.appendChild(this.indexesGroup);
        this.svgElement.appendChild(this.tensorsGroup);
        
        this.gridGroup.setAttribute("id","grid");
        this.indexesGroup.setAttribute("id","indexes");
        this.tensorsGroup.setAttribute("id","tensors");

        this.createUserEvents();
    }

    private getPointerPosition(e: MouseEvent | TouchEvent): { x: number, y: number } {
        const svgRect = this.svgElement.getBoundingClientRect();
        let pointerX = 0;
        let pointerY = 0;

        if (window.TouchEvent && e instanceof TouchEvent && e.touches.length > 0) {
            pointerX = e.touches[0].clientX;
            pointerY = e.touches[0].clientY;
        } else {
            pointerX = (e as MouseEvent).clientX;
            pointerY = (e as MouseEvent).clientY;
        }

        return {
            x: pointerX - svgRect.left,
            y: pointerY - svgRect.top
        };
    }

    private drawGrid()
    {
        switch(this.gridMode)
        {
            case(grid.none):
            {
                break;
            }

            case(grid.square):
            {
                for (let i = this.gridSize; i < this.height; i += this.gridSize)
                    this.drawGridLine(this.gridGroup,0,this.width,i,i);
        
                for (let i = this.gridSize; i < this.width; i += this.gridSize)
                    this.drawGridLine(this.gridGroup,i,i,0,this.height);
                break;
            }

            case(grid.diamond):
            case(grid.isometric):
            {
                class point
                {
                    constructor(public x: number, public y: number){}
                }
                let upperFence: Array<point> = [];
                let rightFence: Array<point> = [];
                let bottomFence: Array<point> = [];
                let leftFence: Array<point> = [];
                let ori = new point(0,0);
                let tor = new point(this.width,0);
                let bol = new point(0,this.height);
                let end = new point(this.width,this.height);
        
                let persp = (this.gridMode == grid.diamond) ? 1 : 2;
        
                for (let i = this.gridSize*persp;   i < this.width;  i += this.gridSize*persp)  upperFence.push(new point(i,0));
                for (let i = this.gridSize;         i < this.height; i += this.gridSize)        rightFence.push(new point(this.width,i));
                for (let i = this.gridSize;         i < this.height; i += this.gridSize)        leftFence.push(new point(0,i));
                for (let i = this.gridSize*persp;   i < this.width;  i += this.gridSize*persp)  bottomFence.push(new point(i,this.height));
        
                let ur = upperFence.concat([tor].concat(rightFence));
                let lb = leftFence.concat([bol].concat(bottomFence));
                let lu = leftFence.reverse().concat([ori].concat(upperFence));
                let br = bottomFence.concat([end].concat(rightFence.reverse()));
                        
                for (let i = 0; i < upperFence.length+rightFence.length+1; i++)
                {
                    this.drawGridLine(this.gridGroup, ur[i].x, lb[i].x, ur[i].y, lb[i].y);
                    this.drawGridLine(this.gridGroup, lu[i].x, br[i].x, lu[i].y, br[i].y);
                }
                break;
            }
        }
    }

    private drawGridLine(gridGroup: SVGGElement, x1: number, x2: number, y1: number, y2: number)
    {
        let line: SVGLineElement = document.createElementNS("http://www.w3.org/2000/svg","line");

        line.setAttribute("id","dashed-line");
        line.setAttribute("x1",String(x1));
        line.setAttribute("x2",String(x2));
        line.setAttribute("y1",String(y1));
        line.setAttribute("y2",String(y2));
        line.setAttribute("pointer-events", "none"); // Allow clicks to pass through the grid
        line.setAttribute("style","stroke:rgb(192,192,192);stroke-width:1;stroke-dasharray:6 4");

        gridGroup.appendChild(line);
    }

    private createUserEvents()
    {
        this.svgElement.addEventListener("mousedown", this.pressEventHandler);
        // The new listener for the connection preview, which does not require holding the mouse button.
        this.svgElement.addEventListener("mousemove", this.previewMoveHandler);
        this.svgElement.addEventListener("touchstart", this.pressEventHandler);

        const clearBtn = document.getElementById('clearBtn');
        if (clearBtn) clearBtn.addEventListener("click", this.clearEventHandler);
        const gridBtn = document.getElementById('gridBtn');
        if (gridBtn) gridBtn.addEventListener("click", this.toggleGridHandler);
        const drawBtn = document.getElementById('drawBtn');
        if (drawBtn) drawBtn.addEventListener("click", this.drawEventHandler);
        const moveBtn = document.getElementById('moveBtn');
        if (moveBtn) moveBtn.addEventListener("click", this.moveEventHandler);
    }

    private pressTensorEventHandlerMap: Map<number, (e: MouseEvent | TouchEvent) => void> = new Map();

    private createTensorEvents(t: tensor)
    {
        const handler = (e: MouseEvent | TouchEvent) => this.pressTensorEventHandler(e, t);
        this.pressTensorEventHandlerMap.set(t.id, handler);
        t.shape.addEventListener("mousedown", handler);
        t.shape.addEventListener("touchstart", handler);
    }

    private removeTensorEvents(t: tensor)
    {
        const handler = this.pressTensorEventHandlerMap.get(t.id);
        if (handler) {
            t.shape.removeEventListener("mousedown", handler);
            t.shape.removeEventListener("touchstart", handler);
            this.pressTensorEventHandlerMap.delete(t.id);
        }
    }

    // --- State-based Event Handlers ---

    private pressTensorEventHandler = (e: MouseEvent | TouchEvent, t: tensor) =>
    {
        e.stopPropagation();
        this.lastEvent = e;

        switch (this.state) {
            case AppState.MOVE_IDLE:
                // Start dragging a tensor
                if (t.isPoint) return; // Cannot move points directly
                this.state = AppState.MOVE_TENSOR_DRAGGING;
                this.activeTensor = t;
                t.shape.setAttribute("stroke-width", "2");
                this.attachDragListeners();
                break;

            case AppState.DRAW_IDLE:
                // Start previewing a new connection
                if (t.isPoint) return; // Cannot draw from a point
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
                } else if (this.activeTensor) {
                    // Clicked a different tensor: connect them.
                    const newIndex = this.createIndex(this.activeTensor.posX, t.posX, this.activeTensor.posY, t.posY);
                    this.activeTensor.insertLegRef(newIndex, true);
                    t.insertLegRef(newIndex, false);
                }
                this.resetToIdleState();
                break;
        }
    }

    private pressBackgroundHandler() {
        switch (this.state) {
            case AppState.DRAW_IDLE:
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
                break;
        }
    }

    private dragHandler(e: MouseEvent | TouchEvent) {
        if (this.state !== AppState.MOVE_TENSOR_DRAGGING) return;

        const { x, y } = this.getPointerPosition(e);
        if (this.activeTensor) {
            let snapped = this.snap(x, y);
            this.activeTensor.setPosition(snapped[0], snapped[1]);
        }
        e.preventDefault();
    }

    private previewMoveHandler = (e: MouseEvent | TouchEvent) => {
        if (this.state !== AppState.DRAW_PREVIEWING) return;

        const { x, y } = this.getPointerPosition(e);
        if (this.placeholderIndex) {
            let snapped = this.snap(x, y);
            this.placeholderIndex.moveP2(snapped[0], snapped[1]);
        }
    }

    private releaseHandler() {
        if (this.state === AppState.MOVE_TENSOR_DRAGGING) {
            this.detachDragListeners();
            this.resetToIdleState();
        }
    }

    // --- Utility and Helper Functions ---

    private resetToIdleState() {
        if (this.activeTensor) {
            this.activeTensor.shape.setAttribute("stroke-width", "1");
        }
        if (this.placeholderIndex) {
            this.deleteIndex(this.placeholderIndex, false);
        }
        this.activeTensor = undefined;
        this.placeholderIndex = undefined;

        // Determine the correct idle state based on the current mode
        this.state = this.currentMode === mode.move ? AppState.MOVE_IDLE : AppState.DRAW_IDLE;
    }

    private attachDragListeners() {
        const dragFunc = (e: MouseEvent | TouchEvent) => this.dragHandler(e);
        const releaseFunc = () => this.releaseHandler();
        window.addEventListener("mousemove", dragFunc);
        window.addEventListener("mouseup", releaseFunc);
        window.addEventListener("touchmove", dragFunc, { passive: false });
        window.addEventListener("touchend", releaseFunc);

        // Store references to remove them later
        this.boundDragHandler = dragFunc;
        this.boundReleaseHandler = releaseFunc;
    }

    private detachDragListeners() {
        if (this.boundDragHandler) window.removeEventListener("mousemove", this.boundDragHandler);
        if (this.boundReleaseHandler) window.removeEventListener("mouseup", this.boundReleaseHandler);
        if (this.boundDragHandler) window.removeEventListener("touchmove", this.boundDragHandler);
        if (this.boundReleaseHandler) window.removeEventListener("touchend", this.boundReleaseHandler);
        this.boundDragHandler = undefined;
        this.boundReleaseHandler = undefined;
    }

    // --- Original Methods (Refactored or Kept) ---

    private pressIndexEventHandlerMap: Map<number, () => void> = new Map();

    private createIndexEvents(i: index)
    {
        // In draw mode, clicking an index deletes it.
        const clickHandler = () => {
            if (this.currentMode === mode.draw) {
                this.deleteIndex(i, true);
                this.resetToIdleState(); // Reset state after deletion
            }
        };
        this.pressIndexEventHandlerMap.set(i.id, clickHandler);
        i.circle.addEventListener("mousedown", clickHandler);
        i.circle.addEventListener("touchstart", clickHandler);
    }

    private removeIndexEvents(i: index)
    {
        const handler = this.pressIndexEventHandlerMap.get(i.id);
        if (handler) {
            i.circle.removeEventListener("mousedown", handler);
            i.circle.removeEventListener("touchstart", handler);
            this.pressIndexEventHandlerMap.delete(i.id);
        }
    }

    private createTensor(x: number, y: number, isPoint: boolean = false): tensor
    {
        let [snappedX, snappedY] = this.snap(x, y);
        let newTensor = new tensor(snappedX, snappedY);
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

    private deleteTensor(t: tensor, memory: boolean = true)
    {
        this.removeTensorEvents(t);
        tensor.pendingIDs.push(t.id);
        tensor.pendingIDs.sort((v1,v2) => (v2-v1));

        if(memory)
        {
            const legsToDelete = [...t.legsRefs];
            legsToDelete.forEach( (leg) =>
            {
                this.tensorsArray.forEach( (ten) =>
                {
                    if (ten !== t)
                    {
                        let ind = ten.legsRefs.indexOf(leg,0);
                        if(ind > -1) {
                            ten.legsRefs.splice(ind,1);
                            if (ten.isPoint && ten.legsRefs.length === 0) {
                                this.deleteTensor(ten, false);
                            }
                        }
                    }
                });
                this.deleteIndex(leg,false);
            });
        }
        
        this.tensorsGroup.removeChild(t.mTensor);
        let ind = this.tensorsArray.indexOf(t,0);
        if(ind > -1) this.tensorsArray.splice(ind,1);
    }

    private createIndex(x1: number, x2: number, y1: number, y2: number): index
    {
        let newIndex = new index(x1,x2,y1,y2);
        this.createIndexEvents(newIndex);
        this.indexesArray.push(newIndex);
        this.indexesGroup.appendChild(newIndex.mIndex);
        return newIndex;
    }
    private deleteIndex(i: index, memory: boolean)
    {
        this.removeIndexEvents(i);
        index.pendingIDs.push(i.id); 
        index.pendingIDs.sort((v1,v2) => (v2-v1));
        
        if(memory)
        {
            this.tensorsArray.forEach( (ten) =>
            {
                let ind = ten.legsRefs.indexOf(i,0);
                if(ind > -1) ten.legsRefs.splice(ind,1);
            });
        }
        
        this.indexesGroup.removeChild(i.mIndex);
        let ind = this.indexesArray.indexOf(i,0);
        if(ind > -1) this.indexesArray.splice(ind,1);
    }

    private snap(x: number, y: number): [number, number]
    {
        if (!this.snapToGrid) return [x, y];

        switch(this.gridMode)
        {
            case(grid.square):
            {
                x = Math.round(x/this.gridSize)*this.gridSize;
                y = Math.round(y/this.gridSize)*this.gridSize;
                break;
            }
            case(grid.diamond):
            {
                // this is not strictly right...
                x = Math.round(2*x/(this.gridSize))*(this.gridSize/2) ///2 //+ Math.round(x/(this.gridSize/2));
                y = Math.round(2*y/(this.gridSize))*(this.gridSize/2) ///2 //+ Math.round(y/(this.gridSize/2));    
                break;
            }
            case(grid.isometric):
            {
                // this is not strictly right...
                x = Math.round(x/(this.gridSize))*(this.gridSize) ///2 //+ Math.round(x/(this.gridSize/2));
                y = Math.round(2*y/(this.gridSize))*(this.gridSize/2) ///2 //+ Math.round(y/(this.gridSize/2));    
                break;
            }
        }
        return [x,y];
    }

    private clearCanvas()
    {
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

    private clearEventHandler = () =>
    {
        console.log("clear event");
        this.clearCanvas();
    }

    private toggleGridHandler = () =>
    {
        // three way toggle at the moment
        switch(this.gridMode)
        {
            case(grid.none):
            {
                while (this.gridGroup.firstChild) this.gridGroup.removeChild(this.gridGroup.firstChild);
                this.gridMode = grid.square;
                this.snapToGrid = true;
                this.drawGrid();
                break;
            }
            case(grid.square):
            {
                while (this.gridGroup.firstChild) this.gridGroup.removeChild(this.gridGroup.firstChild);
                this.gridMode = grid.diamond;
                this.snapToGrid = true;
                this.drawGrid();
                break;
            }
            case(grid.diamond):
            {
                while (this.gridGroup.firstChild) this.gridGroup.removeChild(this.gridGroup.firstChild);
                this.gridMode = grid.isometric;
                this.snapToGrid = true;
                this.drawGrid();
                break;
            }
            case(grid.isometric):
            {
                while (this.gridGroup.firstChild) this.gridGroup.removeChild(this.gridGroup.firstChild);
                this.gridMode = grid.none;
                this.snapToGrid = false;
                this.drawGrid();
                break;
            }
        }
        console.log("toggle the grid to " + grid[this.gridMode]);
    }

    private setMode(newMode: mode) {
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
        } else { // mode.draw
            this.state = AppState.DRAW_IDLE;
            this.tensorsArray.forEach((t) => t.text.setAttribute("opacity", "0%"));
            this.indexesArray.forEach((i) => {
                i.circle.setAttribute("opacity", "0%");
                i.text.setAttribute("opacity", "0%");
            });
        }
    }

    private drawEventHandler = () =>
    {
        this.setMode(mode.draw);
    }

    private pressEventHandler = (e: MouseEvent | TouchEvent) =>
    {
        this.lastEvent = e; // Store the event for getting coordinates later
        if (e.target === this.svgElement) {
            this.pressBackgroundHandler();
        }
    }

    private moveEventHandler = () =>
    {
        this.setMode(mode.move);
    }
}

new visualTensor();
