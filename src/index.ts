interface IVector3{
    X:number;
    Y:number;
    Z:number;
    Length:()=>number
    Abs: ()=> IVector3
    Add: (other: IVector3)=> IVector3
    Max: (other: IVector3)=> IVector3
    Mult: (factor: number)=> IVector3
    Subtract: (other: IVector3)=> IVector3
    ZeroMax: ()=> IVector3
    MaxCoord: ()=> number
    Normalize: ()=>IVector3
    Dot: (other: IVector3)=> number
    
}
//: ()=>IVector3 
const vectorC= function(x,y,z){
        this.X= x;
        this.Y=y;
        this.Z=z;
        this.Length= ()=>Math.sqrt(this.X*this.X+this.Y*this.Y+this.Z*this.Z);
        this.Normalize=()=>{
            let length= this.Length();
            return vector(this.X/length,this.Y/length, this.Z/length);
        }
        this.Abs= ()=> vector(Math.abs(this.X),Math.abs(this.Y),Math.abs(this.Z));
        this.Add= (other:IVector3)=> vector(this.X+ other.X, this.Y+other.Y, this.Z + other.Z);
        this.Max= (other:IVector3)=> vector(Math.max(this.X,other.X),Math.max(this.Y,other.Y),Math.max(this.Z,other.Z));
        this.Mult= (factor:number)=> vector(this.X* factor, this.Y* factor, this.Z* factor);
        this.Subtract= (other:IVector3)=> vector(this.X- other.X, this.Y-other.Y, this.Z- other.Z);
        this.ZeroMax= ()=> vector(Math.max(this.X,0),Math.max(this.Y,0),Math.max(this.Z,0));
        this.MaxCoord= ()=> Math.max(this.X,this.Y,this.Z);
        this.Dot= (other: IVector3)=> this.X*other.X + this.Y*other.Y + this.Z*other.Z; 
    };

const vector= (x:number,y:number,z:number):IVector3=>{
  let v=  new vectorC(x,y,z);
  return v;
}
debugger;
let bigVector= vector(1,2,3);
bigVector.Mult(4);


const SphereForm= (position: IVector3, size:number)=> position.Length() - size;
const UsdBoxForm  = (position: IVector3, size:IVector3)=> position.Abs().Subtract(size).ZeroMax().Length();
const RoundBoxForm=  (position: IVector3, size:IVector3, radius:number)=> UsdBoxForm(position,size)-radius;
const SdBoxForm = (position: IVector3, size: IVector3) => { const d = position.Abs().Subtract(size); return Math.min(d.MaxCoord(),0)+ d.ZeroMax().Length()}


const Sphere=  (size:number)=> (position:IVector3) => SphereForm(position,size);
const UsdBox= (size:IVector3) => (position:IVector3) => UsdBoxForm(position,size);
const RoundBox = (size:IVector3, radius:number) => (position:IVector3) => RoundBoxForm(position,size,radius);
const SdBox= (size:IVector3)=>(position:IVector3) => SdBoxForm(position,size);
const Union = (first:(position:IVector3)=>number,second:(position:IVector3)=>number)=>(position:IVector3)=>Math.min(first(position),second(position));
const Intersection = (first:(position:IVector3)=>number,second:(position:IVector3)=>number)=>(position:IVector3)=>Math.max(first(position),second(position));


const marcheRay=(position: IVector3, direction: IVector3, distanceFuntion: (p:IVector3)=> number, nbSteps:number,backgroundColor: IVector3) =>
{
   for(var i=0;i < nbSteps;i++){
     const distance =  distanceFuntion(position);
     if(distance > 10)
       return undefined;
     if(distance < 0.0001)
       break;
     position = position.Add(direction.Mult(distance));
   }
   return {position: position, nbSteps: i};
}

const calculateNormal=(position:IVector3, distanceFunction: (p: IVector3)=> number)=>{
    let delta = 0.001;
    let twoDelta = delta*2;
    return vector(
        (distanceFunction(position.Add(vector(-delta,0,0)))-distanceFunction(position.Add(vector(delta,0,0)))),
        (distanceFunction(position.Add(vector(0,-delta,0)))-distanceFunction(position.Add(vector(0,delta,0)))),
        (distanceFunction(position.Add(vector(0,0,-delta)))-distanceFunction(position.Add(vector(0,0,delta))))
    ).Normalize();
}

const shade = (position:IVector3, distanceFunction: (p:IVector3)=>number,lightPosition: IVector3)=>{
    let lightDir = lightPosition.Subtract(position).Normalize();
    
    let dot = calculateNormal(position,distanceFunction).Dot(lightDir);
    let diffuse= vector(1,1,1);
    let light = Math.max(dot,0.2);
    return diffuse.Mult(light);
    //return lightDir;
}

const getColor= (position,rayDirection,distanceFunction,nbSteps,backgroundColor):IVector3=>{
    const marcheResult= marcheRay(position,rayDirection,distanceFunction,nbSteps,backgroundColor);
    if(!marcheResult)
      return backgroundColor;
    return shade(marcheResult.position,distanceFunction,vector(0,-15,0));
    //return marcheResult.position.Mult(1/8);
    //return calculateNormal(marcheResult.position,distanceFunction).Add(vector(1,1,1)).Mult(.5);    
}

const marcheScreenOrthographic=(distanceFunction: (p:IVector3)=> number,corner:IVector3, xStep:IVector3, yStep:IVector3, nbX:number, nbY:number, rayDirection:IVector3, nbSteps: number)=>{
    let result:IVector3[][]=[];
    for(let x = 0; x < nbX; x++){
        let xArr:IVector3[]= [];
        for(let y = 0; y < nbY; y++){
          const position =  corner.Add(xStep.Mult(x)).Add(yStep.Mult(y));
          xArr.push(getColor(position,rayDirection,distanceFunction,nbSteps,vector(0,0,0)));
        }   
        result.push(xArr);
    }
    return result;      
}



const drawOnScreen= (data: IVector3[][])=>{
    let canvas = document.createElement('canvas');
    document.body.appendChild(canvas); // adds the canvas to the body element
    canvas.width= data.length;
    let width = canvas.width;
    canvas.height = width == 0? 0 : data[0].length; 
    let height = canvas.height;
    let context = canvas.getContext("2d");
    let imagedata = context.createImageData(width, height);
    for(let x = 0; x < width; x++){
        for(let y = 0; y < height; y++){
            let pixelindex = (y * width + (width - 1 - x)) * 4;
            let color = data[x][y];
            imagedata.data[pixelindex] = color.X*255;     // Red
            imagedata.data[pixelindex+1] =color.Y*255; // Green
            imagedata.data[pixelindex+2] = color.Z*255;  // Blue
            imagedata.data[pixelindex+3] = 255;   // Alpha
            if(y == height - 1 ||x == width - 1)
            {imagedata.data[pixelindex] = 255;     // Red
            imagedata.data[pixelindex+1] = 0;//color.Y*255; // Green
            imagedata.data[pixelindex+2] = 255;//color.Z*255;  // Blue
            }
        }
    }



    context.putImageData(imagedata,0,0);
}
const scene = 
    //Intersection(
        Union(
            Sphere(6)
            ,UsdBox(vector(5,5,5)))
        //UsdBox(vector(6,4.5,5)));
const ballScreen = marcheScreenOrthographic(scene,vector(-10,-10,-10),vector(.04,0,0),vector(0,.04,0),600,600,vector(0.01,0.01,1).Normalize(),100);

drawOnScreen(ballScreen);