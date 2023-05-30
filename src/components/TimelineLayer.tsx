import { observer } from "mobx-react-lite";
import { TimelineBlockStack } from "@/src/components/TimelineBlockStack";
import { useStore } from "@/src/types/StoreContext";
import { Box, HStack } from "@chakra-ui/react";
import { MAX_TIME } from "@/src/utils/time";
import { Layer } from "@/src/types/Layer";
import { action } from "mobx";
import { useRef } from "react";
import { TimelineLayerHeader } from "@/src/components/TimelineLayerHeader";
import { LayerOpacityVariations } from "@/src/components/LayerOpacityVariations";

type TimelineLayerProps = {
  index: number;
  layer: Layer;
};

export const TimelineLayer = observer(function TimelineLayer({
  index,
  layer,
}: TimelineLayerProps) {
  const store = useStore();
  const { uiStore, timer, selectedLayer } = store;

  const boxRef = useRef<HTMLDivElement>(null);

  const bgColor = selectedLayer === layer ? "gray.300" : "gray.400";

  return (
    <HStack
      position="relative"
      height={`${layer.height}px`}
      alignItems="flex-start"
      spacing={0}
      onClick={action(() => {
        store.selectedLayer = layer;
      })}
    >
      <TimelineLayerHeader index={index} layer={layer} />
      <Box
        ref={boxRef}
        id={`timeline-layer-${layer.id}`}
        position="relative"
        width={uiStore.timeToXPixels(MAX_TIME)}
        height="100%"
        boxSizing="border-box"
        bgColor={bgColor}
        borderBottomWidth={1}
        borderColor="black"
        borderStyle="dotted"
        onClick={action((e) =>
          timer.setTime(
            Math.max(
              0,
              uiStore.xToTime(
                e.clientX - boxRef.current!.getBoundingClientRect().x
              )
            )
          )
        )}
      >
        {layer.patternBlocks.map((block) => (
          <TimelineBlockStack key={block.id} patternBlock={block} />
        ))}
      </Box>
      <LayerOpacityVariations layer={layer} />
    </HStack>
  );
});
