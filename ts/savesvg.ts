class SaveSVG
{
    constructor()
    {
        const saveBtn = document.getElementById("saveBtn");
        if (saveBtn) {
            saveBtn.addEventListener("click", this.download);
        }
    }

    private download = () =>
    {
        const svgref = document.getElementById("svg-board") as SVGSVGElement | null;
        if (!svgref) {
            return;
        }

        // Get the content group that is being transformed
        const contentGroup = svgref.querySelector('#content-group') as SVGGElement | null;
        if (!contentGroup) {
            console.error("Content group not found for saving.");
            return;
        }

        // Get the bounding box of the content itself, ignoring the transform
        const bbox = contentGroup.getBBox();

        // Clone the main SVG to keep its structure and definitions (<defs>)
        let svgClone = svgref.cloneNode(true) as SVGSVGElement;

        // Find the cloned content group
        const clonedContentGroup = svgClone.querySelector('#content-group') as SVGGElement | null;
        if (clonedContentGroup) {
            // Remove the transform attribute from the clone, as we'll use viewBox to frame it.
            clonedContentGroup.removeAttribute('transform');
        }

        // Add a small padding to the bounding box
        const padding = 10;
        svgClone.setAttribute("viewBox", `${bbox.x - padding} ${bbox.y - padding} ${bbox.width + padding * 2} ${bbox.height + padding * 2}`);
        svgClone.setAttribute("width", String(bbox.width + padding * 2));
        svgClone.setAttribute("height", String(bbox.height + padding * 2));

        let serializer = new XMLSerializer();
        let source = serializer.serializeToString(svgClone);
        console.log(source);

        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

        let url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);

        const savedLink = document.getElementById("savedlink");
        if (savedLink) {
            savedLink.setAttribute("href", url);
        }
    }
}

new SaveSVG();