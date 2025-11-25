"use strict";
class SaveSVG {
    constructor() {
        this.download = () => {
            const svgref = document.getElementById("svg-board");
            if (!svgref) {
                return;
            }
            let bbox = svgref.getBBox();
            console.log("bouding box: ", bbox.x, bbox.y, bbox.width, bbox.height);
            let svg = svgref.cloneNode(true);
            svg.setAttribute("viewBox", String(bbox.x - 1) + " " + String(bbox.y - 1) + " " + String(bbox.width + 2) + " " + String(bbox.height + 2));
            svg.setAttribute("width", String(bbox.width + 2));
            svg.setAttribute("height", String(bbox.height + 2));
            let serializer = new XMLSerializer();
            let source = serializer.serializeToString(svg);
            console.log(source);
            //add name spaces.
            //if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
            //    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
            //}
            //if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
            //    source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
            //}
            //document.getElementById("svgcode").innerText = source;
            source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
            let url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
            const savedLink = document.getElementById("savedlink");
            if (savedLink) {
                savedLink.setAttribute("href", url);
            }
        };
        const saveBtn = document.getElementById("saveBtn");
        if (saveBtn) {
            saveBtn.addEventListener("click", this.download);
        }
    }
}
new SaveSVG();
