import { vector, IVector3, vectorC } from "./vector"
import {Form} from "./forms"
const calculateNormal = (position: IVector3, distanceFunction: (p: IVector3) => number) => {
    let delta = 0.001;
    let twoDelta = delta * 2;
    return vector(
        (distanceFunction(position.Add(vector(-delta, 0, 0))) - distanceFunction(position.Add(vector(delta, 0, 0)))),
        (distanceFunction(position.Add(vector(0, -delta, 0))) - distanceFunction(position.Add(vector(0, delta, 0)))),
        (distanceFunction(position.Add(vector(0, 0, -delta))) - distanceFunction(position.Add(vector(0, 0, delta))))
    ).Normalize();
}

export const shade = (position: IVector3,form:Form, lightPosition: IVector3) => {
    let lightDir = lightPosition.Subtract(position).Normalize();
    let dot = calculateNormal(position, form.dist).Dot(lightDir);
    let diffuse = form.color(position);
    let light = Math.max(dot, .2);
    return diffuse.Mult(light);
    //return lightDir;
}


