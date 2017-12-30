//
// PIXI.js patches
// To integrate with the engine
//
import * as PIXI from "pixi.js";
import { EventEmitter } from "eventemitter3";

interface ExtendedDisplayObject {
    resize?: Function;
    update?: Function;
    Particle_update?: Function;
    hasBeenAddedOnce?: boolean;
}

const updateListeners: Map<PIXI.DisplayObject, any> = new Map();
const resizeListeners: Map<PIXI.DisplayObject, any> = new Map();

const globalEvents = new EventEmitter();
globalEvents.on("added", function(displayObject: PIXI.DisplayObject & ExtendedDisplayObject) {
    // re-trigger added for children
    if (displayObject.hasBeenAddedOnce && displayObject instanceof PIXI.Container) {
        for (let i = 0; i < displayObject.children.length; i++) {
            globalEvents.emit("added", displayObject.children[i]);
        }
    }
    displayObject.hasBeenAddedOnce = true;

    // register "update" listener
    if (
        !updateListeners.has(displayObject) &&
        typeof (displayObject.update) === "function" &&
        !displayObject.Particle_update
    ) {
        let callback = (delta) => displayObject.update(delta);
        PIXI.ticker.shared.add(callback);
        updateListeners.set(displayObject, callback);
    }

    // add "resize" listener.
    if (
        !resizeListeners.has(displayObject) &&
        typeof (displayObject.resize) === "function"
    ) {
        const callback = () => displayObject.resize();
        resizeListeners.set(displayObject, callback);

        window.addEventListener("resize", callback);
        callback();
    }
});

globalEvents.on("removed", function(displayObject: PIXI.DisplayObject & ExtendedDisplayObject) {
    const resizeCallback = resizeListeners.get(displayObject);
    if (resizeCallback) {
        window.removeEventListener("resize", resizeCallback);
        resizeListeners.delete(displayObject);
    }

    const updateCallback = updateListeners.get(displayObject);
    if (updateCallback) {
        PIXI.ticker.shared.remove(updateCallback);
        updateListeners.delete(displayObject);
    }

    // trigger "removed" for child objects
    if (displayObject instanceof PIXI.Container) {
        for (let i = 0; i < displayObject.children.length; i++) {
            globalEvents.emit("removed", displayObject.children[i]);
            displayObject.children[i].emit("removed");
        }
    }
});

const addChild = PIXI.Container.prototype.addChild;
const removeChild = PIXI.Container.prototype.removeChild;
const removeChildAt = PIXI.Container.prototype.removeChildAt;

function patchedAddChild<T extends PIXI.DisplayObject>(child: T, ...additionalChildren: PIXI.DisplayObject[]): T {
    for (let i=0; i<arguments.length; i++) {
        const child = arguments[i];
        child.on("added", () => globalEvents.emit("added", child));
    }
    return addChild.apply(this, arguments);
}

function patchedRemoveChild(...children: PIXI.DisplayObject[]) {
    for (let i=0; i<children.length; i++) {
        const child = arguments[i];
        globalEvents.emit("removed", child);
    }
    return removeChild.apply(this, arguments);
}

function patchedRemoveChildAt(index: number) {
    let child = removeChild.apply(this, arguments);
    globalEvents.emit("removed", child);
    return child;
}

PIXI.Container.prototype.addChild = patchedAddChild;
PIXI.Container.prototype.removeChild = patchedRemoveChild;
PIXI.Container.prototype.removeChildAt = patchedRemoveChildAt;
