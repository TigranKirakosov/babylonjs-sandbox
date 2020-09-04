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
import PlayerController from './control/player.controller';
import { findMesh } from './utils/misc';
import ConstructedScene, { ISceneParams } from './scene_management';
import BrowserEventsService, { IEventHandlerMap } from './utils/browser-events.service';

class Game {
  private canvas: HTMLCanvasElement;
  private engine: Engine;
  private scenes: Map<string, ConstructedScene>;
  private lastSceneName: string;
  private currentScene: ConstructedScene;
  private player: PlayerController;
  private eventHandlerPairs: IEventHandlerMap;
  public unregisterEventListeners: Function;
  private toggled: boolean = false;

  constructor(canvasElement: string) {
    this.canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
    this.engine = new Engine(this.canvas, true, {}, true);
    this.scenes = new Map<string, ConstructedScene>();

    this.createScene('default');
    const defaultScene = this.scenes.get('default');
    this.currentScene = defaultScene;
    
    const playerMesh = findMesh('player', defaultScene.sceneConfig.meshes);
    this.player = new PlayerController(playerMesh);

    this.eventHandlerPairs = Object.entries({
      'keydown': [(e: KeyboardEvent) => {
        if (e.key === '0') {
          !this.toggled ? this.switchScene('darkerScene') : this.switchScene('default');
          this.toggled = !this.toggled;
        }
      }],
      'resize': [() => this.engine.resize()],
      'mousewheel': []
    });
  }

  static init(): Game {
    const game = new Game('renderCanvas');

    game.createScene('darkerScene', {
      materialColor: [6, -5, 10],
      lightIntensity: 0.35
    });

    window.addEventListener('DOMContentLoaded', () => {
      game.unregisterEventListeners = game.registerEventListeners();
      game.doRender();
    });
    return game;
  }

  private createScene(
    name: string,
    params: ISceneParams = {
      materialColor: [0, 2, 1],
      lightIntensity: 1
    }
  ): void {
    const scene = new ConstructedScene(name, this.engine);

    scene.init((_scene) => {
      const myMaterial = new StandardMaterial("myMaterial", _scene);
      const camera = new FreeCamera('camera', new Vector3(0, 5,-10), _scene);
      const light = new HemisphericLight('light', new Vector3(0,1,0), _scene);
      const playerMesh = MeshBuilder.CreateSphere('player', { segments: 16, diameter: 1 }, _scene);
      const playerTail = [
        MeshBuilder.CreateSphere('playerTail0', { segments: 16, diameter: 1 }, _scene),
        MeshBuilder.CreateSphere('playerTail1', { segments: 16, diameter: 1 }, _scene)
      ];
      const ground = MeshBuilder.CreateGround('ground', { width: 10, height: 6, subdivisions: 2 }, _scene);

      myMaterial.emissiveColor = new Color3(...params.materialColor);
  
      camera.setTarget(Vector3.Zero());  
      camera.attachControl(this.canvas, false);
  
      light.intensity = params.lightIntensity;
  
      playerMesh.position.y = 1;
      playerTail[0].position.y = 1;
      playerTail[0].position.x = playerMesh.position.x + 1;
      playerTail[1].position.y = 1;
      playerTail[1].position.x = playerTail[0].position.x + 1;

      playerMesh.material = myMaterial;
      playerTail.forEach(mesh => mesh.material = myMaterial);

      const player = new PlayerController(playerMesh, {}, playerTail);

      return ({
        player,
        materials: [myMaterial],
        cameras: [camera],
        lights: [light],
        meshes: [ground]
      });
    })

    this.scenes.set(name, scene);
  }

  private createDefaultScene(): ConstructedScene {
    const sceneName = 'default';
    const scene = new ConstructedScene(sceneName, this.engine);

    scene.init((_scene) => {
      const myMaterial = new StandardMaterial("myMaterial", _scene);
      const camera = new FreeCamera('camera', new Vector3(0, 5,-10), _scene);
      const light = new HemisphericLight('light', new Vector3(0,1,0), _scene);
      const playerMesh = MeshBuilder.CreateSphere('player', { segments: 16, diameter: 1 }, _scene);
      const playerTail = [
        MeshBuilder.CreateSphere('playerTail0', { segments: 16, diameter: 1 }, _scene),
        MeshBuilder.CreateSphere('playerTail1', { segments: 16, diameter: 1 }, _scene)
      ];
      const ground = MeshBuilder.CreateGround('ground', { width: 10, height: 6, subdivisions: 2 }, _scene);

      myMaterial.emissiveColor = new Color3(0, 2, 1);
  
      camera.setTarget(Vector3.Zero());  
      camera.attachControl(this.canvas, false);
  
      light.intensity = 0.6;
  
      playerMesh.position.y = 1;
      playerTail[0].position.y = 1;
      playerTail[0].position.x = playerMesh.position.x + 1;
      playerTail[1].position.y = 1;
      playerTail[1].position.x = playerTail[0].position.x + 1;

      playerMesh.material = myMaterial;
      playerTail.forEach(mesh => mesh.material = myMaterial);

      const player = new PlayerController(playerMesh, {}, playerTail);

      return ({
        player,
        materials: [myMaterial],
        cameras: [camera],
        lights: [light],
        meshes: [ground]
      });
    });

    return scene;
  }

  public switchScene(name: string): void {
    const scene = this.scenes.get(name);
    
    if (scene) {
      this.currentScene.close();
      this.lastSceneName = this.currentScene.name;
      this.currentScene = scene;
    } else return alert(`Scene "${name}" is not present`);

    this.configurePlayer(scene.sceneConfig);
  }

  private configurePlayer(scene: Scene): void {
    const playerMesh = findMesh('player', scene.meshes);
    const state = {
      ...this.player.getState(),
      latestPosition: this.player.getLatestPosition()
    };
    this.player.clearMoveInterval();

    this.player = new PlayerController(playerMesh, state, this.player.getTail());
  }

  private doRender(): void { this.engine.runRenderLoop(() => this.currentScene.sceneConfig.render()); }

  private registerEventListeners(): Function {
    return BrowserEventsService.registerEventListeners(this.eventHandlerPairs);
  }
}

Game.init();
