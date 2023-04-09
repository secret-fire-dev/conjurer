import { Block } from "@/modules/common/types/Block";
import { Pattern } from "@/modules/common/types/Pattern";
import { StandardParams } from "@/modules/common/types/PatternParams";
import Timer from "@/modules/common/types/Timer";
import Rainbow from "@/modules/patterns/Rainbow";
import SunCycle from "@/modules/patterns/SunCycle";
import { patterns } from "@/modules/patterns/patterns";
import { makeAutoObservable, configure, runInAction } from "mobx";

// Enforce MobX strict mode, which can make many noisy console warnings, but can help use learn MobX better.
// Feel free to comment out the following if you want to silence the console messages.

configure({
  enforceActions: "always",
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: false, // This will trigger false positives sometimes, so turning off
});

export default class Store {
  initialized = false;
  timer = new Timer();

  blocks: Block<StandardParams>[] = [];
  selectedBlocks: Block<StandardParams>[] = []; // TODO: make this a set

  patterns: Pattern[] = patterns;
  selectedPattern: Pattern = patterns[0];
  draggingPattern: boolean = false;

  // TODO: make this more efficient, do binary search
  get currentBlock() {
    return this.blocks.find(
      (b) =>
        b.startTime <= this.timer.globalTime &&
        this.timer.globalTime < b.startTime + b.duration,
    );
  }

  get endTime() {
    if (this.blocks.length === 0) return 0;

    const lastBlock = this.blocks[this.blocks.length - 1];
    return lastBlock.startTime + lastBlock.duration;
  }

  constructor() {
    makeAutoObservable(this);

    runInAction(() => this.initialize());
  }

  initialize = () => {
    // Temporary hard-coded blocks
    this.blocks.push(new Block(SunCycle()), new Block(Rainbow()));
    this.blocks[0].setTiming(0, 7);
    this.blocks[1].setTiming(7, 3);

    this.initialized = true;
  };

  insertCloneOfPattern = (pattern: Pattern) => {
    const clonedPattern = clone(pattern);
    const newBlock = new Block(clonedPattern);
    newBlock.setTiming(this.endTime, 3);
    this.blocks.push(newBlock);
  };

  selectBlock = (block: Block<StandardParams>) => {
    this.selectedBlocks = [block];
  };

  addBlockToSelection = (block: Block<StandardParams>) => {
    this.selectedBlocks.push(block);
  };

  deselectBlock = (block: Block<StandardParams>) => {
    this.selectedBlocks = this.selectedBlocks.filter((b) => b !== block);
  };

  selectAllBlocks = () => {
    this.selectedBlocks = this.blocks;
  };

  deselectAllBlocks = () => {
    this.selectedBlocks = [];
  };

  deleteSelectedBlocks = () => {
    this.blocks = this.blocks.filter((b) => !this.selectedBlocks.includes(b));
    this.selectedBlocks = [];
  };

  copyBlocks = (clipboardData: DataTransfer) => {
    clipboardData.setData(
      "text/plain",
      this.selectedBlocks.map((b) => b.id).join(","),
    );
  };

  pasteBlocks = (clipboardData: DataTransfer) => {
    const ids = clipboardData.getData("text/plain").split(",");
    const blocks = this.blocks.filter((b) => ids.includes(b.id));
    const newBlocks = blocks.map((b) => {
      const newBlock = new Block(clone(b.pattern));
      // TODO: paste blocks at specific locations
      newBlock.setTiming(this.endTime, b.duration);
      return newBlock;
    });
    this.blocks.push(...newBlocks);
  };

  duplicateBlocks = () => {
    const newBlocks = this.selectedBlocks.map((b) => {
      const newBlock = new Block(clone(b.pattern));
      newBlock.setTiming(this.endTime, b.duration);
      return newBlock;
    });
    this.blocks.push(...newBlocks);
  };
}

const clone = (orig: Object) =>
  Object.assign(Object.create(Object.getPrototypeOf(orig)), orig);