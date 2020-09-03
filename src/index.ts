import {
  Engine,
  Scene,
  FreeCamera,
  HemisphericLight,
  Vector3,
  MeshBuilder,
  StandardMaterial,
  Color3
} from '@babylonjs/core';
import PlayerController from './player/player.controller';

class Game {
  private canvas: HTMLCanvasElement;
  private engine: Engine;
  private scene: Scene;
  private camera: FreeCamera;
  private light: HemisphericLight;
  private player: PlayerController;
  public unregisterEventListeners: Function;

  constructor(canvasElement: string) {
    this.canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
    this.engine = new Engine(this.canvas, true);
  }

  static async init(): Promise<Game> {
    const game = new Game('renderCanvas');
    window.addEventListener('DOMContentLoaded', async () => {

      await game.createScene();
      
      game.unregisterEventListeners = await game.registerEventListeners();

      game.doRender();

    });
    return game;
  }

  async createScene(): Promise<void> {

    this.scene = new Scene(this.engine);

    const myMaterial = new StandardMaterial("myMaterial", this.scene);

    myMaterial.diffuseColor = new Color3(1, 0, 1);
    myMaterial.specularColor = new Color3(0.5, 0.6, 0.87);
    myMaterial.ambientColor = new Color3(0, 2, 1);
    myMaterial.emissiveColor = new Color3(0, 2, 1);

    this.camera = new FreeCamera('camera1', new Vector3(0, 5,-10), this.scene);

    this.camera.setTarget(Vector3.Zero());

    this.camera.attachControl(this.canvas, false);

    this.light = new HemisphericLight('light1', new Vector3(0,1,0), this.scene);
    this.light.intensity = 0.6;

    const sphere = MeshBuilder.CreateSphere('sphere', { segments: 16, diameter: 1 }, this.scene);

    sphere.position.y = 1;
    
    sphere.material = myMaterial;

    this.player = new PlayerController(sphere);

    const ground = MeshBuilder.CreateGround('ground',
                                { width: 10, height: 6, subdivisions: 2 }, this.scene);

                                console.log(this.scene.meshes.map(({ id }) => id))
  }

  doRender(): void { this.engine.runRenderLoop(() => this.scene.render()); }

  async registerEventListeners(): Promise<Function> {
    const eventMethodPairs = Object.entries({
      'keydown': [this.player.inputListener],
      'resize': [
        (e) => this.engine.resize()
      ],
      'mousewheel': [
        (e) => { } 
      ]
    });

    for(const [event, methods] of eventMethodPairs) {
      methods.forEach(method => {
        window.addEventListener(event, method);
      });
    }

    return () => {
      for(const [event, methods] of eventMethodPairs) {
        methods.forEach(method => {
          window.removeEventListener(event, method);
        });
      }
    };
  }
}

let game: Game;

Game.init().then(g => game = g);
