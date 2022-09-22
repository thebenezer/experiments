
import { Group, Line3 } from "three";

declare module "*.jpg";
declare module "*.png";
declare module "*.mp3";
declare module "*.gltf";
declare module "*.glb";
declare module "*.glsl";
declare module "*.scss";
declare module "*.css";

declare global {
  declare module "*.vert" {
    const content: string;
    export default content;
  }

  declare module "*.frag" {
    const content: string;
    export default content;
  }
  declare module "*.glsl" {
    const content: string;
    export default content;
  }
}