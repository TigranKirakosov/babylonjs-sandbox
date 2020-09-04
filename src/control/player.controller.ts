import { Vector3, AbstractMesh } from "@babylonjs/core";

class PlayerController {
  private moveStep: number = 1;
  private moveDirection: Vector3 = Vector3.Left();
  private moveIntervalStep: number = 0.5 * 1000;
  private moveInterval: any;
  private player: AbstractMesh;
  private playerTail: AbstractMesh[];
  private state: { [key: string]: any };

  constructor(mesh: AbstractMesh, state = {}, playerTail: AbstractMesh[] = []) {
    this.player = mesh;
    this.state = state;
    this.playerTail = playerTail;

    this.moveInterval = setInterval(() => {
      this.move();
    }, this.moveIntervalStep);

  }

  private switchDirection(direction: Vector3): void {
    this.moveDirection = direction;
  }

  private move(): void {
    this.setLastPosition(this.player.position);

    this.player.setDirection(this.moveDirection);
    const p1 = this.player.position;
    this.player.translate(new Vector3(0,0,1), this.moveStep);

    const p2 = this.playerTail[0].position;
    this.playerTail[0].position = p1;

    const p3 = this.playerTail[1].position;
    this.playerTail[1].position = p2;
  }

  private setLastPosition(position: Vector3): void {
    this.state.lastPosition = position;
  }

  public getLatestPosition(): Vector3 {
    return this.player.position;
  }

  public getState(): { [key: string]: any } {
    return { ...this.state };
  }

  public getTail(): AbstractMesh[] {
    return this.playerTail;
  }

  public clearMoveInterval(): void {
    clearInterval(this.moveInterval);
  }

  public inputListener = ({ which, keyCode}: KeyboardEvent): void => {
    const key = which || keyCode;

    switch(key) {
      case 87: // W
        this.switchDirection(Vector3.Forward());
        break;
      case 65: // A
        this.switchDirection(Vector3.Left());
        break;
      case 83: // S
        this.switchDirection(Vector3.Backward());
        break;
      case 68: // D
        this.switchDirection(Vector3.Right());
        break;
      default:
        break;
    }
  }
}

export default PlayerController;
