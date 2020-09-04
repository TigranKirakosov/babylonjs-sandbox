import { Scene, Engine, SceneOptions, AbstractMesh, Camera, Light, Material } from "@babylonjs/core";
import PlayerController from "../control/player.controller";
import BrowserEventsService, { IEventHandlerMap } from "../utils/browser-events.service";

export interface ISceneParams {
  materialColor: number[];
  lightIntensity: number;
}

interface ISceneSettings {
  player: PlayerController;
  cameras: Camera[];
  lights: Light[];
  meshes?: AbstractMesh[];
  materials?: Material[];
}

interface ISceneInitializer {
  (sceneConfig: Scene): ISceneSettings;
}

class ConstructedScene {
  public readonly name: string;
  public sceneSettings: ISceneSettings;
  public sceneConfig: Scene;
  private didInit: boolean = false;
  private unregisterEventListeners: Function;

  constructor(name: string, engine: Engine, options: SceneOptions = {}) {
    this.name = name;
    this.sceneConfig = new Scene(engine, options);
  }

  public init(initializer: ISceneInitializer): void {
    if (!this.didInit) {
      this.didInit = true;
      this.sceneSettings = initializer(this.sceneConfig);
      const player = this.sceneSettings.player;
      this.registerEventListeners([['keydown', [player.inputListener]]])
    } else {
      console.error(`Scene "${this.name}" have already initialized`);
    }
  }

  private registerEventListeners(eventHandlerPairs: IEventHandlerMap): Function {
    return BrowserEventsService.registerEventListeners(eventHandlerPairs);
  }

  public close(): void {
  if (typeof this.unregisterEventListeners === 'function') this.unregisterEventListeners();
    // this.sceneConfig.dispose();
  }
}

export default ConstructedScene;
