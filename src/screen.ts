import { vector, IVector3, vectorC } from "./vector"
export const drawOnScreen = (data: IVector3[][]) => {
    let canvas = document.createElement('canvas');
    document.body.appendChild(canvas); // adds the canvas to the body element
    canvas.width = data.length;
    let width = canvas.width;
    canvas.height = width == 0 ? 0 : data[0].length;
    let height = canvas.height;
    let context = canvas.getContext("2d");
    let imagedata = context.createImageData(width, height);
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let pixelindex = ((height - 1 - y) * width + (x)) * 4;
            let color = data[x][y];
            imagedata.data[pixelindex] = color.X * 255;     // Red
            imagedata.data[pixelindex + 1] = color.Y * 255; // Green
            imagedata.data[pixelindex + 2] = color.Z * 255;  // Blue
            imagedata.data[pixelindex + 3] = 255;   // Alpha
            if (y == height - 1 || x == width - 1) {
                imagedata.data[pixelindex] = 255;     // Red
                imagedata.data[pixelindex + 1] = 0;//color.Y*255; // Green
                imagedata.data[pixelindex + 2] = 255;//color.Z*255;  // Blue
            }
        }
    }
    context.putImageData(imagedata, 0, 0);
}
