# [Conjurer](https://canopyconjurer.vercel.app)

Conjurer is a web app that allows one to design audiovisual experiences for the [Canopy of Luminous Conjury](https://se.cretfi.re/canopy/), a large LED art piece by [The Servants of the Secret Fire](https://se.cretfi.re/).

![Conjurer screenshot](public/example.png)

## Overview

You can think of Conjurer as an in-browser Digital Audio Visual Workstation, similar to the concept of a [Digital Audio Workstation (DAW)](https://en.wikipedia.org/wiki/Digital_audio_workstation). Whereas a DAW is used to arrange and produce audio compositions, Conjurer aims to provide the ability to arrange audio and visuals into an "experience" which can be saved and played at a later time.

## Concepts

- Pattern
  - A fragment shader that generates a texture (an image) based purely on parameters (uniforms)
  - This texture can either be rendered directly to the canopy or passed to an effect
- Effect
  - A fragment shader that accepts a texture and applies an effect based purely on parameters, outputting a new texture
  - Just like a pattern, this texture can either be rendered directly to the canopy or passed to an effect
  - Note: Identical to patterns, except that effects accept a texture as an input
- Parameter
  - This is a value that tweaks what is being generated by a pattern/effect
  - "Color", "Fuzziness", "Radius" for example
- Parameter variations
  - Changes over time applied to a pattern/effect parameter
  - "Change the color from blue to green over 5 seconds"

## Developing

We manage dependencies with `yarn`.

```bash
# install dependencies
yarn

# run the app with hot reloading on save
yarn dev
```

### Tips

- In this repo, patterns/effects at their core are just fragment shaders. They may seem scary at first, but with a proper introduction like in [The Book of Shaders](https://thebookofshaders.com/), you too could wield their considerable power!
- We use [Chakra](https://chakra-ui.com/) for our UI in this repo. Check out the [available components here](https://chakra-ui.com/docs/components) as well as the [default theme](https://chakra-ui.com/docs/styled-system/theme)
- We use [MobX](https://github.com/mobxjs/mobx) for state management. It's not Redux!
- We use [ThreeJS](https://threejs.org/) and [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) to render the shaders/3D canopy.
- We use [`react-icons`](https://react-icons.github.io/react-icons/search). Just search for what you want and import the icon from the correct place using the 2-letter prefix.
- We use [`recharts`](https://recharts.org/en-US/api) to do some simple graphs.

### Scripts

#### `yarn generateCanopy`

Generates canopy geometry data and stores it in `src/data/canopyGeometry.json`.

#### `yarn server`

Starts a websocket server at port 8080 on localhost. For development use only. Writes `src/scripts/output.png` once per second.

#### `yarn downloadCloudAssets`

Downloads all of the experience and audio files from s3 into the folder `public/cloudAssets`. Conjurer can then read from these files when in "local asset mode", useful for situations when internet is not available.

## Todos

Must do's captured in the "Road to Minimum Viable Magical Product" [issue](https://github.com/SotSF/conjurer/issues/26).

Other to do's captured in the [wiki](https://github.com/SotSF/conjurer/wiki).
