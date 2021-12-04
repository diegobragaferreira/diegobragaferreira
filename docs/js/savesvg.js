var SaveSVG = /** @class */ (function () {
    function SaveSVG() {
        this.download = function () {
            var svgref = document.getElementById("svg-board");
            var bbox = svgref.getBBox();
            console.log("bouding box: ", bbox.x, bbox.y, bbox.width, bbox.height);
            var svg = svgref.cloneNode(true);
            svg.setAttribute("viewBox", String(bbox.x - 1) + " " + String(bbox.y - 1) + " " + String(bbox.width + 2) + " " + String(bbox.height + 2));
            svg.setAttribute("width", String(bbox.width + 2));
            svg.setAttribute("height", String(bbox.height + 2));
            var serializer = new XMLSerializer();
            var source = serializer.serializeToString(svg);
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
            var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
            document.getElementById("savedlink").setAttribute("href", url);
        };
        document.getElementById("saveBtn").addEventListener("click", this.download);
    }
    return SaveSVG;
}());
new SaveSVG();
