import { ExtraParams, PatternParam } from "@/src/types/PatternParams";
import { Box, Button, HStack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { BsCaretDown, BsCaretUp } from "react-icons/bs";
import { Block } from "@/src/types/Block";
import { NewVariationButtons } from "@/src/components/ParameterVariations/NewVariationButtons";
import { observer } from "mobx-react-lite";
import { ParameterValue } from "@/src/components/TimelineBlockStack/ParameterValue";
import { useStore } from "@/src/types/StoreContext";
import { HeaderRepeat } from "@/src/components/TimelineBlockStack/HeaderRepeat";
import { ParameterVariations } from "@/src/components/ParameterVariations/ParameterVariations";

type ParameterProps = {
  uniformName: string;
  patternParam: PatternParam;
  block: Block<ExtraParams>;
  expandMode?: "expanded" | "collapsed";
};

export const ParameterView = observer(function ParameterView({
  uniformName,
  patternParam,
  block,
  expandMode = "collapsed",
}: ParameterProps) {
  const { uiStore } = useStore();
  const variations = block.parameterVariations[uniformName] ?? [];
  const [isExpanded, setExpanded] = useState(expandMode === "expanded");

  const isCurrentBlock =
    block.layer?.currentBlock &&
    [block, block.parentBlock].includes(block.layer.currentBlock);

  // TODO: re-implement
  // const headerColor = variations.length ? "orange.400" : "gray.300";
  const headerColor = "orange.400";
  return (
    <Box
      width="100%"
      pb={isExpanded ? 2 : 0}
      borderStyle="dashed"
      borderBottomWidth={1}
      borderColor="gray.500"
      onDoubleClick={(e) => {
        const boundingBox = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - boundingBox.left;
        const time = uiStore.xToTime(x);
        block.addFlatVariationUpToTime(uniformName, time);
      }}
    >
      <Button
        variant="ghost"
        width="100%"
        height={7}
        p={0}
        onClick={() => setExpanded(!isExpanded)}
      >
        <HStack width="100%" justify="space-evenly">
          <HeaderRepeat times={block.headerRepetitions}>
            <Text
              lineHeight={1}
              userSelect="none"
              fontSize={14}
              color={headerColor}
            >
              {patternParam.name}
              {isCurrentBlock && isExpanded && (
                <ParameterValue parameter={block.pattern.params[uniformName]} />
              )}
            </Text>
            {isExpanded ? (
              <BsCaretUp key={headerColor} size={10} color={headerColor} />
            ) : (
              <BsCaretDown key={headerColor} size={10} color={headerColor} />
            )}
          </HeaderRepeat>
        </HStack>
      </Button>

      {isExpanded &&
        (variations.length === 0 ? (
          <HStack ml={2} width="100%">
            <Text userSelect="none" py={2} fontSize={10}>
              Click to add a variation:
            </Text>
            <NewVariationButtons uniformName={uniformName} block={block} />
          </HStack>
        ) : (
          <ParameterVariations uniformName={uniformName} block={block} />
        ))}
    </Box>
  );
});
