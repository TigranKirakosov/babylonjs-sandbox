import { AbstractMesh } from "@babylonjs/core";

export const findMesh = (name: string, meshes: AbstractMesh[]) => meshes.find(mesh => mesh.name === name);
