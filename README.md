# pixi-engine

Provides a minimal engine-like structure for developing games with
[PixiJS](https://github.com/pixijs/pixi.js/).

## Classes

- [Application](#Application)
- [Mediator](#Mediator)
- [SceneManager](#SceneManager)
- [PlayerPrefs](#PlayerPrefs)

## `Application`

A singleton that extends from `PIXI.Application`. You might not need to use it directly. When switching scenes using [SceneManager](#SceneManager), the `Application` is used under the hood.

## `Mediator`

Mediators are meant for handling business logic in your game.

```typescript
class MenuMediator extends Mediator<MenuView> {

    initialize () {
        console.log(this.view, "has been added.");
    }

    destroy () {
        console.log(this.view, "has been removed.");
    }

    onButtonClick () {
        console.log("Let's handle the click action here!");
    }

}
```

```typescript
import { mediate, action } from "pixi-engine";

@mediate(MenuMediator)
class MenuView extends PIXI.Container {
    button: PIXI.Sprite = PIXI.Sprite.fromFrame("my-button.png");

    @action("onButtonClick")
    handleClick () {
        // handles the animation of this.button
    }

    // pixi-engine will call `update` method at every frame
    update () {
    }

    // pixi-engine will call `resize` automatically when the window is resized
    resize () {
    }
}
```

## `SceneManager`

Inspired by Unity, `SceneManager` handles switching the current active scene. Scenes are instances of `PIXI.Container`.


```typescript
class MyScene extends PIXI.Container {
    // definition of your scene
}

// Go-to target scene.
SceneManager.goTo(MyScene);
```

## `PlayerPrefs`

Inspired by Unity, `PlayerPrefs` are meant for storing and retrieving data locally. Currently, it's just a wrapper for `localStorage`. In the future more adapters might be implemented to handle another storage option.

```typescript
// Key-value usage
PlayerPrefs.set("name", "Player Name");
PlayerPrefs.set("accessToken", "1f92h3f928h39f8h2");

// Object usage
PlayerPrefs.set({
    name: "Player Name",
    accessToken: "1f92h3f928h39f8h2"
});

// Retrieving data
console.log(PlayerPrefs.get("name"));
```


## License

MIT