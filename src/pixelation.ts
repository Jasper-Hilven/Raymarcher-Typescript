import { vector, IVector3, vectorC } from "./vector"
function nearestColor(pixel: IVector3, colorPalette: IVector3[]) {
    let nearest = colorPalette[0];
    let distToNearest = pixel.DistSQ(nearest);
    colorPalette.map((v, i) => {
        const dist = v.DistSQ(pixel);
        if (dist < distToNearest) {
            distToNearest = dist;
            nearest = v;
        }
    });
    return nearest;
}
const pixelColorOptions =
    [
        new vectorC(0, 0, 0),
        new vectorC(.1, .1, .1),
        new vectorC(.2, .2, .2),
        new vectorC(.3, .3, .3),
        new vectorC(.5, .5, .5),
        new vectorC(.6, .6, .6),
        new vectorC(.7, .7, .7),
        new vectorC(.8, .8, .8),
        new vectorC(.9, .9, .9),
        new vectorC(1, 1, 1),
        new vectorC(1, 0, 0),
        new vectorC(0, 1, 0),
        new vectorC(.3, 0, 0),
        new vectorC(0, .3, 0),
        new vectorC(.5, 0, 0),
        new vectorC(.5, .5, 0),
        new vectorC(0, .5, 0),
        new vectorC(0, 0, 1),
    ];
export function PixelateDrawing(pixels: IVector3[][]) {
    let colorPalette = pixelColorOptions;
    let ret = [];
    let rem = new vectorC(0, 0, 0);
    for (let i = 0; i < pixels.length; i++) {
        ret.push([]);
        let pixAr = pixels[i];
        for (let j = 0; j < pixAr.length; j++) {
            let pixel = pixAr[j];
            let toMatch = pixel.Add(rem);
            let nearest = nearestColor(toMatch, colorPalette);
            rem = toMatch.Subtract(nearest);
            ret[i].push(nearest);
        }
    }
    return ret;
}
console.log("Calculated ballscreen")
