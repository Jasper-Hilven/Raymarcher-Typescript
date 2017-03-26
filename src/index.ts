import { vector, IVector3, vectorC } from "./vector"
import {
    Union, UnionSm, SdBox, RoundBox, Form,
    Sphere, UsdBox, Intersection, translation, Subtraction
} from "./forms"
import { PixelateDrawing } from "./pixelation"
import { marcheScreenOrthographic } from "./marche"
import { drawOnScreen } from "./screen"

function rgba(x: number, y: number, z: number, a: number) { return vector(x, y, z).Mult(1.0 / 256) };
const darkred = vector(.4, .4, .4);
//const ligtherRed = vector(1, .2, .2);
const yellow = vector(.6, .6, .2);
//const green = vector(.2, .6, .2);
const eyeColor = vector(1, 1, 1);
const chassiswheelbase = RoundBox(vector(.5, .5, 2), 1.4, darkred);
const cutbottomwheelbase = translation(Sphere(2.9, darkred), vector(0, -1.1, 0));
const wheelbase = Intersection(chassiswheelbase, cutbottomwheelbase);
const leftbase = translation(wheelbase, vector(-6, 0, 0));
const rightbase = translation(wheelbase, vector(6, 0, 0));
const wheelconnector = RoundBox(vector(3, 0, 0), 1, darkred);
const wheels = UnionSm(wheelconnector, Union(leftbase, rightbase), 2);
const wheelbar = translation(RoundBox(vector(0, 2, 0), 1, darkred), vector(0, 3, 0));
const chassis = UnionSm(wheelbar, wheels, .2);
const eye = Sphere(1, eyeColor);
const eyes = Union(translation(eye, vector(-2, 0, -2)), translation(eye, vector(2, 0, -2)));
const faceSkin = RoundBox(vector(2, 3, .1),1, darkred);
const face = UnionSm(faceSkin, eyes, .1);
const torso = translation(face, vector(0, 7, -.5));
const robot = UnionSm(chassis, torso, .7);
const scene = robot;
const resolution = 200;
const stepX = vector(30, 0, 0).Mult(1 / resolution);
const stepY = vector(0, 19, 0).Mult(1 / resolution);
const corner = vector(-19, -2, -10);
const center = corner.Add(stepX.Mult(resolution / 2)).Add(stepY.Mult(resolution / 2)).Mult(-1);
const ballScreen = marcheScreenOrthographic(scene, corner, stepX, stepY,
    resolution, resolution, vector(.5, -.5, 1).Normalize(), 1000, center);
const pixelize = false;
const pixelatedScene = pixelize ? PixelateDrawing(ballScreen) : ballScreen;
console.log("Finished pixelling")
drawOnScreen(pixelatedScene);