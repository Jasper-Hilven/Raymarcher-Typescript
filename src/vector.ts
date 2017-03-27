export interface IVector3 {
    X: number;
    Y: number;
    Z: number;
    Length: () => number
    DistSQ: (other: IVector3) => number
    Abs: () => IVector3
    Add: (other: IVector3) => IVector3
    Max: (other: IVector3) => IVector3
    Mult: (factor: number) => IVector3
    Subtract: (other: IVector3) => IVector3
    ZeroMax: () => IVector3
    MaxCoord: () => number
    Normalize: () => IVector3
    Dot: (other: IVector3) => number
    ToString: () => string
    RotateY: (ang: number) => IVector3
}
//: ()=>IVector3 
export const vectorC = function (x, y, z) {
    this.X = x;
    this.Y = y;
    this.Z = z;
    this.Length = () => Math.sqrt(this.X * this.X + this.Y * this.Y + this.Z * this.Z);
    this.LengthSQ = () => this.X * this.X + this.Y * this.Y + this.Z * this.Z;
    this.DistSQ = (other) => this.Subtract(other).LengthSQ();
    this.Normalize = () => {
        let length = this.Length();
        return vector(this.X / length, this.Y / length, this.Z / length);
    }
    this.Abs = () => vector(Math.abs(this.X), Math.abs(this.Y), Math.abs(this.Z));
    this.Add = (other: IVector3) => vector(this.X + other.X, this.Y + other.Y, this.Z + other.Z);
    this.Max = (other: IVector3) => vector(Math.max(this.X, other.X), Math.max(this.Y, other.Y), Math.max(this.Z, other.Z));
    this.Mult = (factor: number) => vector(this.X * factor, this.Y * factor, this.Z * factor);
    this.Subtract = (other: IVector3) => vector(this.X - other.X, this.Y - other.Y, this.Z - other.Z);
    this.ZeroMax = () => vector(Math.max(this.X, 0), Math.max(this.Y, 0), Math.max(this.Z, 0));
    this.MaxCoord = () => Math.max(this.X, this.Y, this.Z);
    this.Dot = (other: IVector3) => this.X * other.X + this.Y * other.Y + this.Z * other.Z;
    this.ToString = () => "(" + x + ", " + y + ", " + z + ")";
    this.RotateY = (ang: number) => {
        let cos = Math.cos(ang);
        let sin = Math.sin(ang);
        return vector(cos * this.X + sin * this.Z, this.Y, cos * this.Z - sin * this.X)
    }
};
export const vector = (x: number, y: number, z: number): IVector3 => new vectorC(x, y, z);
