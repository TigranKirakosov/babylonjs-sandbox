import { Vector3, Mesh } from "@babylonjs/core";

class PlayerController {
    private moveStep: number = 0.5;
    private playerObj: Mesh;

    constructor(obj: Mesh) {
        this.playerObj = obj;
    }

    private moveTo(direction: Vector3): void {
        this.playerObj.setDirection(direction);
        this.playerObj.translate(new Vector3(0,0,1), this.moveStep);
    }

    public inputListener = ({ which, keyCode}: KeyboardEvent): void => {
        const key = which || keyCode;

        switch(key) {
            case 87: // W
                this.moveTo(Vector3.Forward());
                break;
            case 65: // A
                this.moveTo(Vector3.Left());
                break;
            case 83: // S
                this.moveTo(Vector3.Backward());
                break;
            case 68: // D
                this.moveTo(Vector3.Right());
                break;
            default:
                break;
        }
    }
}

export default PlayerController;
