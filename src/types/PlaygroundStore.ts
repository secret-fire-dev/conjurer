import { playgroundEffects } from "@/src/effects/effects";
import { playgroundPatterns } from "@/src/patterns/patterns";
import { Block, RootStore } from "@/src/types/Block";
import { Palette, SerializedPalette } from "@/src/types/Palette";
import {
  ExtraParams,
  ParamType,
  isPaletteParam,
} from "@/src/types/PatternParams";
import { TransferBlock } from "@/src/types/TransferBlock";
import { makeAutoObservable } from "mobx";

export class PlaygroundStore {
  patternBlocks: Block[];
  effectBlocks: Block[];

  selectedPatternIndex = 0;
  selectedEffectIndices: number[] = [];

  constructor(readonly store: RootStore) {
    this.patternBlocks = playgroundPatterns.map(
      (pattern) => new Block(this.store, pattern),
      []
    );
    this.effectBlocks = playgroundEffects.map(
      (effect) => new Block(this.store, effect)
    );

    makeAutoObservable(this);
  }

  initialize = () => {
    this.loadFromLocalStorage();

    this.selectedPatternIndex = this.lastPatternIndexSelected;
    this.selectedEffectIndices = this.lastEffectIndices;
  };

  get selectedPatternBlock() {
    return (
      this.patternBlocks[this.selectedPatternIndex] ?? this.patternBlocks[0]
    );
  }

  private _lastPatternIndexSelected = 0;
  get lastPatternIndexSelected() {
    return this._lastPatternIndexSelected;
  }
  set lastPatternIndexSelected(index: number) {
    this._lastPatternIndexSelected = index;
    this.saveToLocalStorage();
  }

  private _lastEffectIndices: number[] = [];
  get lastEffectIndices() {
    return this._lastEffectIndices;
  }
  set lastEffectIndices(indices: number[]) {
    this._lastEffectIndices = indices;
    this.saveToLocalStorage();
  }

  loadFromLocalStorage = () => {
    if (typeof window === "undefined") return;
    const data = localStorage.getItem("playgroundStore");
    if (data) {
      const localStorageUiSettings = JSON.parse(data);
      this.lastPatternIndexSelected =
        localStorageUiSettings.lastPatternIndexSelected ?? 0;
      this.lastEffectIndices = localStorageUiSettings.lastEffectIndices ?? [];
    }
  };

  saveToLocalStorage = () => {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      "playgroundStore",
      JSON.stringify({
        lastPatternIndexSelected: this.lastPatternIndexSelected,
        lastEffectIndices: this.lastEffectIndices,
      })
    );
  };

  // TODO: refactor, make performant
  onUpdate = (transferBlock: TransferBlock) => {
    const { pattern: transferPattern, effectBlocks: transferEffectBlocks } =
      transferBlock;
    this.patternBlocks.forEach((patternBlock, patternIndex) => {
      if (patternBlock.pattern.name === transferPattern.name) {
        const { params } = transferPattern;
        for (const [uniformName, param] of Object.entries(params)) {
          const playgroundParams = patternBlock.pattern.params as ExtraParams;
          // TODO: fix duplicated code here
          if (playgroundParams[uniformName]) {
            if (isPaletteParam(playgroundParams[uniformName])) {
              (
                playgroundParams[uniformName].value as Palette
              ).setFromSerialized(param.value as SerializedPalette);
            } else
              playgroundParams[uniformName].value = param.value as ParamType;
          }
        }

        // set this pattern as selected
        this.selectedPatternIndex = patternIndex;

        const effectIndices: number[] = [];
        for (const transferEffectBlock of transferEffectBlocks) {
          this.effectBlocks.forEach((effectBlock, effectIndex) => {
            if (effectBlock.pattern.name === transferEffectBlock.pattern.name) {
              const { params } = transferEffectBlock.pattern;
              for (const [uniformName, param] of Object.entries(params)) {
                const playgroundParams = effectBlock.pattern
                  .params as ExtraParams;
                if (playgroundParams[uniformName]) {
                  if (isPaletteParam(playgroundParams[uniformName])) {
                    (
                      playgroundParams[uniformName].value as Palette
                    ).setFromSerialized(param.value as SerializedPalette);
                  } else
                    playgroundParams[uniformName].value =
                      param.value as ParamType;
                }
              }

              // set this effect as selected
              effectIndices.push(effectIndex);
            }
          });
        }
        this.selectedEffectIndices = effectIndices;
      }
    });
  };
}