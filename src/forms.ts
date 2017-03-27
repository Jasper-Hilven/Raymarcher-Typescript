import { vector, IVector3, vectorC } from "./vector"

const clamp = (a: number) => a > 1 ? 1 : a < 0 ? 0 : a;
const mix = (b: number, a: number, m: number) => m * a + (1 - m) * b;
function smin(a: number, b: number, k: number) {
    const h = clamp(0.5 + 0.5 * (b - a) / k);
    return mix(b, a, h) - k * h * (1.0 - h);
}
function sminV3(a: number, b: number, k: number, vA: IVector3, vB: IVector3) {
    const h = clamp(0.5 + 0.5 * (b - a) / k);
    return vB.Mult(1 - h).Add(vA.Mult(h));
}


const SphereForm = (position: IVector3, size: number) => position.Length() - size;
const UsdBoxForm = (position: IVector3, size: IVector3) => position.Abs().Subtract(size).ZeroMax().Length();
const RoundBoxForm = (position: IVector3, size: IVector3, radius: number) => UsdBoxForm(position, size) - radius;
const SdBoxForm = (position: IVector3, size: IVector3) => { const d = position.Abs().Subtract(size); return Math.min(d.MaxCoord(), 0) + d.ZeroMax().Length() }


const SphereD = (size: number) => (position: IVector3) => SphereForm(position, size);
const UsdBoxD = (size: IVector3) => (position: IVector3) => UsdBoxForm(position, size);
const RoundBoxD = (size: IVector3, radius: number) => (position: IVector3) => RoundBoxForm(position, size, radius);
const SdBoxD = (size: IVector3) => (position: IVector3) => SdBoxForm(position, size);
const UnionD = (first: (position: IVector3) => number, second: (position: IVector3) => number) => (position: IVector3) => Math.min(first(position), second(position));
const UnionSmD = (first: (position: IVector3) => number, second: (position: IVector3) => number, smoothie: number) => (position: IVector3) => smin(first(position), second(position), smoothie);
const IntersectionD = (first: (position: IVector3) => number, second: (position: IVector3) => number) => (position: IVector3) => Math.max(first(position), second(position));
const translationD = (first: (position: IVector3) => number, translation: IVector3) => (position: IVector3) => first(position.Subtract(translation));
function displaceSD(first: (position: IVector3) => number) {
    return (position: IVector3) =>
        first(position.Add((new vectorC(Math.sin(3 * position.X), Math.sin(3 * position.Y), Math.sin(3 * position.Z))).Mult(.05)));
}
const SubtractionD = (first: (position: IVector3) => number, second: (position: IVector3) => number) => (position: IVector3) => Math.max(first(position), - second(position));
const RotateYD = (first: (position: IVector3) => number, rot: number) => (position: IVector3) => first(position.RotateY(-rot));

export type Form = { dist: (position: IVector3) => number, color: (position: IVector3) => IVector3 };
export const Sphere = (size: number, color: IVector3) => (<Form>{ dist: SphereD(size), color: (p: IVector3) => color });
export const UsdBox = (size: IVector3, color: IVector3) => (<Form>{ dist: UsdBoxD(size), color: (p: IVector3) => color });
export const RoundBox = (size: IVector3, radius: number, color: IVector3) => (<Form>{ dist: RoundBoxD(size, radius), color: (p: IVector3) => color });
export const SdBox = (size: IVector3, color: IVector3) => (<Form>{ dist: SdBoxD(size), color: (p: IVector3) => color });
export const Union = (first: Form, second: Form) => (<Form>{ dist: UnionD(first.dist, second.dist), color: (p: IVector3) => first.dist(p) > second.dist(p) ? second.color(p) : first.color(p) });
export const UnionSm = (first: Form, second: Form, smoothie: number) => (<Form>
    {
        dist: UnionSmD(first.dist, second.dist, smoothie),
        color: (p: IVector3) => sminV3(first.dist(p), second.dist(p), smoothie, first.color(p), second.color(p))
    });
export const Intersection = (first: Form, second: Form) => (<Form>{ dist: IntersectionD(first.dist, second.dist), color: (p: IVector3) => first.dist(p) > second.dist(p) ? second.color(p) : first.color(p) });
export const Subtraction = (first: Form, second: Form) => (<Form>{ dist: SubtractionD(first.dist, second.dist), color: first.color });
export const translation = (first: Form, ts: IVector3) => (<Form>{ dist: (position: IVector3) => first.dist(position.Subtract(ts)), color: first.color });
export const rotateY = (first: Form, rotation: number) => (<Form>{ dist: RotateYD(first.dist, rotation), color: first.color })