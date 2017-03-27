import { vector, IVector3, vectorC } from "./vector"
import {
    Union, UnionSm, SdBox, RoundBox, Form, Sphere, UsdBox,
    Intersection, translation, Subtraction, rotateY
} from "./forms"
import { PixelateDrawing } from "./pixelation"
import { marcheScreenOrthographic } from "./marche"
import { drawOnScreen } from "./screen"

function rgba(x: number, y: number, z: number, a: number) { return vector(x, y, z).Mult(1.0 / 256) };
const blue = vector(.4, .4, .7);
const red = vector(.7, .4, .4);
const grey = vector(.4, .4, .4);
const green = vector(.4, .7, .4);
const baseColor = green;
//const ligtherRed = vector(1, .2, .2);
const yellow = vector(.6, .6, .2);
const eyeColor = vector(1, 1, 1);
const chassiswheelbase = RoundBox(vector(.5, .5, 2), 1.4, baseColor);
const cutbottomwheelbase = translation(Sphere(2.9, baseColor), vector(0, -1.1, 0));
const wheelbase = Intersection(chassiswheelbase, cutbottomwheelbase);
const leftbase = translation(wheelbase, vector(-6, 0, 0));
const rightbase = translation(wheelbase, vector(6, 0, 0));
const wheelconnector = RoundBox(vector(3, 0, 0), 1, grey);
const wheels = UnionSm(wheelconnector, Union(leftbase, rightbase), 2);
const wheelbar = translation(RoundBox(vector(0, 2, 0), 1, grey), vector(0, 3, 0));
const chassis = UnionSm(wheelbar, wheels, .2);
const eyeball = Sphere(1, eyeColor);
const eyelid = Subtraction(
    Subtraction(Sphere(1.2, eyeColor), Sphere(1.1, eyeColor)),
    translation(UsdBox(vector(1, 1, 1), baseColor), vector(0, -1, 0)));
const eye = Union(eyeball, eyelid);
const eyes = Union(translation(eye, vector(-2, 0, -3)), translation(eye, vector(2, 0, -3)));
const squareface = UnionSm(RoundBox(vector(2, 3, 2), 1, baseColor), eyes, .1);
const ears = translation(RoundBox(vector(2, 0, 0), 2, baseColor), vector(0, 1.5, 0));
const ballface = true ? eyes : UnionSm(ears, UnionSm(Sphere(3.9, baseColor), eyes, .1), .1);
const face = true ? ballface : squareface;
const torso = translation(face, vector(0, 7, -.5));
const robot = true ? torso : UnionSm(chassis, torso, .7);
const scene = false ? robot : rotateY(robot, (3.1415 / 1000));
const resolution = 200;
const stepX = vector(19, 0, 0).Mult(1 / resolution);
const stepY = vector(0, 19, 0).Mult(1 / resolution);
const corner = vector(-10, -2, -10);
const center = corner.Add(stepX.Mult(resolution / 2)).Add(stepY.Mult(resolution / 2)).Mult(-1);
const ballScreen = marcheScreenOrthographic(scene, corner, stepX, stepY,
    resolution, resolution, vector(0, -.5, 1).Normalize(), 1000, center);
const pixelize = false;
const pixelatedScene = pixelize ? PixelateDrawing(ballScreen) : ballScreen;
console.log("Finished pixelling")
drawOnScreen(pixelatedScene);