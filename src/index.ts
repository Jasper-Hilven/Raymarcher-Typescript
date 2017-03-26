import { vector, IVector3, vectorC } from "./vector"
import { Union, UnionSm, SdBox, RoundBox, Form, Sphere, UsdBox, translation, Subtraction } from "./forms"
import { PixelateDrawing } from "./pixelation"
import { marcheScreenOrthographic } from "./marche"
import { drawOnScreen } from "./screen"
const darkred = vector(.7, .4, .4); 
const lightgrey = vector(.8, .8, .8);
const sphere6 = Sphere(6, lightgrey);



const displacedSphere = translation(sphere6, vector(-4, 0, 0));
const roundbox = RoundBox(vector(4, 4, 4), .4,darkred );
const scene = Subtraction(roundbox, sphere6);
const ballScreen = marcheScreenOrthographic(scene, vector(-12, -8, -12), vector(.05, 0, 0), vector(0, .05, 0),
    300, 300, vector(0.1, -0.1, 1).Normalize(), 100);
const pixelize = true;
const pixelatedScene = pixelize? PixelateDrawing(ballScreen):ballScreen;
console.log("Finished pixelling")
drawOnScreen(pixelatedScene);