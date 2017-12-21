import * as PIXI from "pixi.js";
import ClockTimer from "@gamestdio/timer";

export class Application extends PIXI.Application {
    public static clock: ClockTimer = new ClockTimer();

    constructor () {
        super();

        PIXI.ticker.shared.add(() => Application.clock.tick());

        document.body.appendChild(this.view);
        window.addEventListener("resize", this.onResize);

        this.onResize();
    }

    onResize = () => {
        this.renderer.resize(window.innerWidth, window.innerHeight);
    }

    protected static instance: Application;
    static getInstance () {
        if (!this.instance) {
            this.instance = new Application();
        }
        return this.instance;
    }

}