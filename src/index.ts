import { Engine, Scene, FreeCamera, HemisphericLight, Vector3, MeshBuilder } from '@babylonjs/core';

class Game {
  private _canvas: HTMLCanvasElement;
  private _engine: Engine;
  private _scene: Scene;
  private _camera: FreeCamera;
  private _light: HemisphericLight;
  private readonly _methodToEventMap: { [key: string]: EventListenerOrEventListenerObject[] };

  constructor(canvasElement: string) {
    this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
    this._engine = new Engine(this._canvas, true);
    let x = 0;
    this._methodToEventMap = {
      'keydown': [
        (e) => { console.log(x--) } 
      ],
      'resize': [
        (e) => this._engine.resize()
      ],
      'mousewheel': [
        (e) => { console.log(x++)} 
      ]
    };
  }

  static init(): Game {
    const game = new Game('renderCanvas');
    window.addEventListener('DOMContentLoaded', () => {

      const unregisterEventListeners = game.registerEventListeners();

      game.createScene();

      game.doRender();

    });
    return game;
  }

  createScene(): void {
    this._scene = new Scene(this._engine);

    this._camera = new FreeCamera('camera1', new Vector3(0, 5,-10), this._scene);

    this._camera.setTarget(Vector3.Zero());

    this._camera.attachControl(this._canvas, false);

    this._light = new HemisphericLight('light1', new Vector3(0,1,0), this._scene);

    const sphere = MeshBuilder.CreateSphere('sphere',
                                { segments: 16, diameter: 4 }, this._scene);

    sphere.position.y = 1;

    const ground = MeshBuilder.CreateGround('ground',
                                { width: 10, height: 6, subdivisions: 2 }, this._scene);
  }

  doRender(): void {
    this._engine.runRenderLoop(() => {
      this._scene.render();
    });
  }

  registerEventListeners(): Function {
    const pairs = Object.entries(this._methodToEventMap);
    for(const [event, methods] of pairs) {
      methods.forEach(method => {
        window.addEventListener(event, method);
      });
    }

    return () => {
      for(const [event, methods] of pairs) {
        methods.forEach(method => {
          window.removeEventListener(event, method);
        });
      }
    };
  }
}

const game = Game.init();
