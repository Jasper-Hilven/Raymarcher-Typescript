import { vector, IVector3, vectorC } from "./vector"
import {shade} from "./shade"
import {Form} from './forms'
export const marcheScreenOrthographic = (form: Form, corner: IVector3, xStep: IVector3, yStep: IVector3, nbX: number, nbY: number, rayDirection: IVector3, nbSteps: number) => {
    let result: IVector3[][] = [];
    for (let x = 0; x < nbX; x++) {
        let xArr: IVector3[] = [];
        for (let y = 0; y < nbY; y++) {
            const position = corner.Add(xStep.Mult(x)).Add(yStep.Mult(y));
            xArr.push(getColor(position, rayDirection, form, nbSteps, vector(0.5, 0.5, 0.5)));
        }
        result.push(xArr);
    }
    return result;
}


const marcheRay = (position: IVector3, direction: IVector3, distanceFuntion: (p: IVector3) => number, nbSteps: number, backgroundColor: IVector3) => {
    for (var i = 0; i < nbSteps; i++) {
        const distance = distanceFuntion(position);
        if (distance > 20)
            return undefined;
        if (distance < 0.001)
            return { position: position, nbSteps: i };
        position = position.Add(direction.Mult(distance));
    }
    return { position: position, nbSteps: i };
}

export const getColor = (position, rayDirection, form: Form, nbSteps, backgroundColor): IVector3 => {
    const marcheResult = marcheRay(position, rayDirection, form.dist, nbSteps, backgroundColor);
    if (!marcheResult)
        return backgroundColor;
    return shade(marcheResult.position, form, vector(4, -15, 0));
    //return marcheResult.position.Mult(1/8);
    //return calculateNormal(marcheResult.position,distanceFunction).Add(vector(1,1,1)).Mult(.5);    
}