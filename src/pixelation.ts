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
    ];
function rgba(x: number, y: number, z: number, a: number) { return vector(x, y, z).Mult(1 / 256) };
const palette = [
    rgba(88, 105, 148, 1),
    rgba(125, 134, 156, 1),
    rgba(162, 171, 171, 1),
    rgba(180, 196, 174, 1),
    rgba(229, 232, 182, 1),

    rgba(6, 81, 67, 1),
    rgba(125, 134, 156, 1),
    rgba(18, 148, 144, 1),
    rgba(224, 168, 144, 1),
    rgba(206, 20, 131, 1),
    
    rgba(128, 0, 0, 1),
    rgba(0, 128, 0, 1),
    rgba(0, 0, 128, 1),
    
    rgba(128, 64, 64, 1),
    rgba(64, 128, 64, 1),
    rgba(64, 64, 128, 1),

    rgba(96, 64, 64, 1),
    rgba(64, 96, 64, 1),
    rgba(64, 64, 96, 1),
    
    
    ]

export function PixelateDrawing(pixels: IVector3[][]) {
    let colorPalette = pixelColorOptions.concat(palette);
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
