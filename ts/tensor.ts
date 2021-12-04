class index
{
    static counter: number = 0;
    static pendingIDs: Array<number> = [];

    public id: number;
    
    public mIndex: SVGGElement;
    public line: SVGLineElement;
    public circle: SVGCircleElement;
    public text: SVGTextElement;

    constructor(public X1: number, public X2: number, public Y1: number, public Y2: number)
    {
        this.createShapetext();
        return this;
    }

    private createShapetext()
    {
        this.id = index.pendingIDs.length>0 ? index.pendingIDs.pop() : this.id = index.counter+1;
  
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

        // temporary solution to highlight the text above the line
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

    public id: number;

    public mTensor: SVGGElement;
    public shape: SVGCircleElement;
    public text: SVGTextElement;

    public legsRefs: Array<index> = [];
    public whichPoint: Array<boolean> = [];

    constructor(public posX: number, public posY: number, public radius: number = 20)
    {
        this.createShapetext();
        return this;
    }

    private createShapetext()
    {
        this.id = tensor.pendingIDs.length>0 ? tensor.pendingIDs.pop() : this.id = tensor.counter+1;
  
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
    private svgElement: HTMLElement;
    private divWrapper: HTMLElement;

    private width: number;
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

    private mode: mode = mode.draw;

    private selectedTensor: select<tensor> = {isSelected: false};
    private selectedIndex: select<index> = {isSelected: false};

    private placeholderIndex: index;

    private paint: boolean;
    private clickX: number[] = [];
    private clickY: number[] = [];
    private clickDrag: boolean[] = [];

    constructor()
    {
        let svgElement = document.getElementById('svg-board') as HTMLElement;
        let divWrapper = document.getElementById('wrapper') as HTMLElement;

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
        
        this.gridGroup.setAttribute("id","grid");
        this.indexesGroup.setAttribute("id","indexes");
        this.tensorsGroup.setAttribute("id","tensors");

        this.createUserEvents();
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
        line.setAttribute("style","stroke:rgb(192,192,192);stroke-width:1;stroke-dasharray:6 4");

        gridGroup.appendChild(line);
    }

    private createUserEvents()
    {

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
    }

    private createTensorEvents(t: tensor)
    {
        t.shape.addEventListener("mousedown", (e) => this.pressTensorEventHandler(e,t));   
        t.shape.addEventListener("touchstart", (e) => this.pressTensorEventHandler(e,t));
    }

    private removeTensorEvents(t: tensor)
    {
        t.shape.removeEventListener("mousedown", (e) => this.pressTensorEventHandler(e,t));
        t.shape.addEventListener("touchstart", (e) => this.pressTensorEventHandler(e,t));
    }

    private pressTensorEventHandler = (e: MouseEvent | TouchEvent, t: tensor) =>
    {
        e.stopPropagation();
        this.addTensorClick(t);
    }

    private addTensorClick(t: tensor)
    {
        switch (this.mode)
        {
            case (mode.draw):
            {
                if(!this.selectedTensor.isSelected)
                {
                    this.selectedTensor.isSelected = true;
                    this.selectedTensor.obj = t;
                    t.shape.setAttribute("stroke-width","2");

                    this.placeholderIndex = this.createIndex(this.selectedTensor.obj.posX,this.selectedTensor.obj.posX,this.selectedTensor.obj.posY,this.selectedTensor.obj.posY);
                    this.placeholderIndex.text.textContent = "";
                    this.placeholderIndex.line.setAttribute("style","stroke:rgb(20,20,140)");
                    //this.indexesGroup.appendChild(this.placeholderIndex.mIndex);
                }
                else
                {
                    this.selectedTensor.isSelected = false;
                    if (t.id === this.selectedTensor.obj.id)
                    {
                        this.deleteIndex(this.placeholderIndex,false);
                        this.deleteTensor(t);
                    }
                    else
                    {
                        this.deleteIndex(this.placeholderIndex,false);
                        this.selectedTensor.obj.shape.setAttribute("stroke-width","1");

                        let newIndex = this.createIndex(this.selectedTensor.obj.posX,t.posX,this.selectedTensor.obj.posY,t.posY);

                        // pass references to which index is connected to each tensor - maybe abstract this a little more
                        this.selectedTensor.obj.insertLegRef(newIndex,true);
                        t.insertLegRef(newIndex,false);

                    }
                }

                break;
            }
            case (mode.move):
            {
                if(!this.selectedTensor.isSelected)
                {
                    this.selectedTensor.isSelected = true;
                    this.selectedTensor.obj = t;
                    t.shape.setAttribute("stroke-width","2");
                }
                else
                {
                    this.selectedTensor.isSelected = false;
                    //this.selectedTensor.obj = null;
                    t.shape.setAttribute("stroke-width","1");
                }

                break;
            }
        }
    }

    private createIndexEvents(i: index)
    {
        i.circle.addEventListener("mousedown", (e) => this.pressIndexEventHandler(e,i));   
        i.circle.addEventListener("touchstart", (e) => this.pressIndexEventHandler(e,i));
    }

    private removeIndexEvents(i: index)
    {
        i.circle.removeEventListener("mousedown", (e) => this.pressIndexEventHandler(e,i));
        i.circle.addEventListener("touchstart", (e) => this.pressIndexEventHandler(e,i));
    }

    private pressIndexEventHandler = (e: MouseEvent | TouchEvent, i: index) =>
    {
        e.stopPropagation();
        this.addIndexClick(i);
    }

    private addIndexClick(i: index)
    {
        switch (this.mode)
        {
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
                        this.deleteIndex(i,true);
                    //}
                    //else
                    //{
                    //    i.line.setAttribute("style","stroke:black;stroke-width:1");
                    //}
                //}
                break;
            }
        }
    }

    private createTensor(x: number, y: number): tensor
    {
        let newTensor = new tensor(x, y);
        tensor.counter++;
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
        tensor.counter--;

        if(memory)
        {
            // here we have to delete not only the indexes, but all the references of all tensors!
            t.legsRefs.forEach( (leg) => 
            {
                this.tensorsArray.forEach( (ten) =>
                {
                    if (ten !== t)
                    {
                        let ind = ten.legsRefs.indexOf(leg,0);
                        if(ind > -1) ten.legsRefs.splice(ind,1);
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
        index.counter++;
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
        index.counter--;
        
        if(memory)
        {
            // make all tensors forget about me
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

    private snap(x: number, y: number)
    {
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

    private addClick(x: number, y: number, dragging: boolean)
    {
        if (this.snapToGrid) [x,y] = this.snap(x,y);

        switch(this.mode)
        {
            case mode.draw:
            {
                if (!dragging && !this.selectedTensor.isSelected)
                {
                    this.createTensor(x,y);
                }
                else
                {
                    let t = this.createTensor(x,y);
                    t.shape.setAttribute("class","point");
                    t.shape.setAttribute("id","point");
                    t.shape.setAttribute("r","4");
                    t.shape.setAttribute("stroke","rgb(255,255,255)");
                    t.shape.setAttribute("fill","rgb(230,230,230)");
                    t.text.setAttribute("dx","10");
                    //t.text.textContent = String("");
                    this.addTensorClick(t);
                }
                break;
            }
        }

        this.clickX.push(x);
        this.clickY.push(y);
        this.clickDrag.push(dragging);
    }

    private addMove(x: number, y: number)
    {
        if (this.snapToGrid) [x,y] = this.snap(x,y);

        switch(this.mode)
        {
            case mode.draw:
            {
                this.placeholderIndex.line.setAttribute("x2",String(x));
                this.placeholderIndex.line.setAttribute("y2",String(y));
                break;
            }
            case mode.move:
            {
                this.selectedTensor.obj.setPosition(x,y);
                break;
            }
        }
    }

    private clearCanvas()
    {
        while (this.tensorsGroup.firstChild) this.tensorsGroup.removeChild(this.tensorsGroup.firstChild);
        while (this.indexesGroup.firstChild) this.indexesGroup.removeChild(this.indexesGroup.firstChild);
    
        tensor.counter = 0;
        tensor.pendingIDs = [];
        this.tensorsArray = [];

        index.counter = 0;
        index.pendingIDs = [];
        this.indexesArray = [];

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
                //this.gridGroup.setAttribute("opacity","1");
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
                //this.gridGroup.setAttribute("opacity","0")
                while (this.gridGroup.firstChild) this.gridGroup.removeChild(this.gridGroup.firstChild);
                this.gridMode = grid.none;
                this.snapToGrid = false;
                this.drawGrid();
                break;
            }
        }
        console.log("toggle the grid to " + grid[this.gridMode]);
    }

    private drawEventHandler = () =>
    {
        console.log("draw mode selected");
        this.selectedTensor.isSelected = false;
        this.selectedIndex.isSelected = false;
        this.tensorsArray.forEach( (t) => t.text.setAttribute("opacity","0%") )
        this.indexesArray.forEach( (i) => {i.circle.setAttribute("opacity","0%");
                                           i.text.setAttribute("opacity","0%")})
        this.mode = mode.draw;
        // probably have to add cleaning of variables etc
    }

    private moveEventHandler = () =>
    {
        console.log("move mode selected");
        this.selectedTensor.isSelected = false;
        this.selectedIndex.isSelected = false;
        this.tensorsArray.forEach( (t) => t.text.setAttribute("opacity","100%") )
        this.indexesArray.forEach( (i) => {i.circle.setAttribute("opacity","100%");
                                           i.text.setAttribute("opacity","100%")})
        this.mode = mode.move;
        // probably have to add cleaning of variables etc
    }

    private releaseEventHandler = () =>
    {
        this.paint = false;
    }

    private cancelEventHandler = () =>
    {
        this.paint = false;
    }

    private pressEventHandler = (e: MouseEvent | TouchEvent) =>
    {
        let mouseX = (e as TouchEvent).changedTouches ?
                     (e as TouchEvent).changedTouches[0].clientX :
                     (e as MouseEvent).clientX;
        let mouseY = (e as TouchEvent).changedTouches ?
                     (e as TouchEvent).changedTouches[0].clientY :
                     (e as MouseEvent).clientY;

        mouseX -= this.offsetX;
        mouseY -= this.offsetY;

        //console.log("mouse press event offseted in : " + mouseX + " " + mouseY);

        this.paint = true;
        this.addClick(mouseX, mouseY, false);
    }

    private dragEventHandler = (e: MouseEvent | TouchEvent) =>
    {
        let mouseX = (e as TouchEvent).changedTouches ?
                     (e as TouchEvent).changedTouches[0].pageX :
                     (e as MouseEvent).pageX;
        let mouseY = (e as TouchEvent).changedTouches ?
                     (e as TouchEvent).changedTouches[0].pageY :
                     (e as MouseEvent).pageY;

        mouseX -= this.offsetX;
        mouseY -= this.offsetY;

        if (this.selectedTensor.isSelected) {
            this.addMove(mouseX,mouseY);
            //console.log("mouse dragging: " + mouseX + " " + mouseY);
        }

        e.preventDefault();
    }

}

new visualTensor();
