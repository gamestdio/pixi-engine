import * as PIXI from "pixi.js";

import { Application } from './Application';

export class SceneManager {
    protected static instance: SceneManager;

    protected app: Application = Application.getInstance();
    protected currentScene: PIXI.Container;

    // Public methods
    static goTo (sceneClass) {
        this.getInstance().goTo(sceneClass);
    }

    protected goTo (sceneClassOrInstance: any) {
        if (this.currentScene) {
            this.app.stage.removeChild(this.currentScene);
        }

        this.currentScene = (sceneClassOrInstance instanceof PIXI.DisplayObject)
            ? sceneClassOrInstance
            : new sceneClassOrInstance();

        this.app.stage.addChild(this.currentScene);
    }

    static getInstance () { 
        if (!this.instance) {
            this.instance = new SceneManager();
        }
        return this.instance;
    }

}