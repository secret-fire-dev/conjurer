import { observer } from "mobx-react-lite";
import {
  Box,
  Grid,
  GridItem,
  HStack,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { useStore } from "@/src/types/StoreContext";
import { Fragment, useEffect, useRef, useState } from "react";
import { LazyWavesurferWaveform } from "@/src/components/Wavesurfer/LazyWavesurferWaveform";
import { MAX_TIME } from "@/src/utils/time";
import { TimerReadout } from "@/src/components/Timeline/TimerReadout";
import { TimerControls } from "@/src/components/Timeline/TimerControls";
import { useWheelZooming } from "@/src/hooks/wheelZooming";
import {
  countIntervalsBetweenNearbyPeaks,
  getPeaksAtThreshold,
  groupNeighborsByTempo,
} from "@/src/utils/audio";
import { action, runInAction } from "mobx";
import { ScalarInput } from "@/src/components/ScalarInput";
import { BeatGrid } from "@/src/components/BeatGrid";
import { cloneAudioBuffer } from "@/src/utils/audioBuffer";
import { AudioSelector } from "@/src/components/AudioSelector";
import { ComputedBeatsPanel } from "@/src/components/ComputedBeatsPanel";

type TempoCount = {
  tempo: number;
  count: number;
};

export const BeatMapperView = observer(function BeatMapperView() {
  const store = useStore();
  const { audioStore, beatMapStore, uiStore } = store;
  const { beatMap } = beatMapStore;

  const timelineRef = useRef<HTMLDivElement>(null);

  useWheelZooming(timelineRef.current);

  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [songDuration, setSongDuration] = useState(0);
  const [beats, setBeats] = useState<number[]>([]);
  const [tempoCounts, setTempoCounts] = useState<TempoCount[]>([]);

  const [threshold, setThreshold] = useState(beatMap.threshold.toFixed(2));
  const [frequency, setFrequency] = useState(beatMap.frequency.toString());

  const [tempoString, setTempoString] = useState(beatMap.tempo.toFixed(10));
  const setTempo = action((valueString: string) => {
    setTempoString(valueString);
    if (!isNaN(Number(valueString))) beatMap.tempo = Number(valueString);
  });

  const [tempoOffsetString, setTempoOffsetString] = useState(
    beatMap.tempoOffset.toFixed(6),
  );
  const setTempoOffset = action((valueString: string) => {
    setTempoOffsetString(valueString);
    if (!isNaN(Number(valueString))) beatMap.tempoOffset = Number(valueString);
  });

  const [selectedBeatIndex, setSelectedBeatIndex] = useState<number | null>(
    null,
  );

  useEffect(() => {
    audioStore.wavesurfer?.on("ready", () => {
      runInAction(() => (uiStore.pixelsPerSecond = 4));
      const buffer = audioStore.wavesurfer!.getDecodedData()!;
      setAudioBuffer(cloneAudioBuffer(buffer));
      setSongDuration(buffer.duration);
    });
  }, [audioStore.wavesurfer, audioStore.peaks, uiStore]);

  useEffect(() => {
    if (
      Number.isNaN(Number(threshold)) ||
      Number.isNaN(Number(frequency)) ||
      !audioBuffer
    )
      return;

    // Create offline context
    var offlineContext = new OfflineAudioContext(
      1,
      audioBuffer.length,
      audioBuffer.sampleRate,
    );

    // Create buffer source
    var source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;

    // Create filter
    var filter = offlineContext.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = Number(frequency);

    // Pipe the song into the filter, and the filter into the offline context
    source.connect(filter);
    filter.connect(offlineContext.destination);

    // Schedule the song to start playing at time:0
    source.start(0);

    // Render the song
    offlineContext.startRendering();

    // Act on the result
    offlineContext.oncomplete = function (e) {
      // Filtered buffer!
      var filteredBuffer = e.renderedBuffer;
      const filteredPeaks = getPeaksAtThreshold(
        filteredBuffer.getChannelData(0),
        Number(threshold),
        filteredBuffer.sampleRate,
      );

      const newBeats = filteredPeaks.map(
        (peakIndex) => peakIndex / filteredBuffer.sampleRate,
      );
      setBeats(newBeats);

      const histogram = countIntervalsBetweenNearbyPeaks(filteredPeaks, 200);
      const newTempoCounts = groupNeighborsByTempo(
        histogram,
        filteredBuffer.sampleRate,
      );

      // sort data by highest count
      const sortedTempoCounts = newTempoCounts.sort(
        (a, b) => b.count - a.count,
      );
      setTempoCounts(sortedTempoCounts);
    };
  }, [threshold, frequency, audioBuffer]);

  const onBeatSelect = action((index: number) => {
    setSelectedBeatIndex(index);
    if (!audioBuffer || selectedBeatIndex == null) return;

    let timeOffset = beats[selectedBeatIndex];
    const beatInterval = 60 / beatMap.tempo;
    while (timeOffset > 0) timeOffset -= beatInterval;
    timeOffset += beatInterval;

    setTempoOffset(timeOffset.toString());
  });

  const displayTempoCounts = [...tempoCounts].slice(0, 20);

  return (
    <>
      <Box
        ref={timelineRef}
        position="relative"
        overflow="scroll"
        overscrollBehavior="none"
        bgColor="gray.500"
      >
        <HStack width={uiStore.timeToXPixels(MAX_TIME)} spacing={0} zIndex={12}>
          <VStack
            position="sticky"
            left={0}
            borderRightWidth={1}
            borderBottomWidth={1}
            borderColor="black"
            spacing={0}
            width="150px"
            flexShrink={0}
            bgColor="gray.500"
            zIndex={18}
          >
            <TimerControls />
            <TimerReadout />
          </VStack>
          {/* <LazyWavesurferWaveform /> */}
        </HStack>

        <HStack
          width={uiStore.timeToXPixels(MAX_TIME)}
          height="50px"
          spacing={0}
          zIndex={12}
        >
          <VStack
            position="sticky"
            left={0}
            borderRightWidth={1}
            borderBottomWidth={1}
            borderColor="black"
            spacing={0}
            width="150px"
            height="100%"
            zIndex={18}
            bgColor="gray.500"
          >
            <Heading
              textAlign="center"
              color="cyan.500"
              userSelect="none"
              size="sm"
            >
              Detected beats (click to align)
            </Heading>
          </VStack>
          <Box position="relative" height="50px">
            {beats.map((beat, index) => (
              <Box
                key={index}
                position="absolute"
                top={0}
                left={uiStore.timeToXPixels(beat)}
                width="1px"
                height="100%"
                bgColor="white"
                cursor="pointer"
                onClick={() => onBeatSelect(index)}
              />
            ))}
          </Box>
        </HStack>

        <HStack
          width={uiStore.timeToXPixels(MAX_TIME)}
          height="50px"
          spacing={0}
          zIndex={12}
        >
          <VStack
            position="sticky"
            left={0}
            borderRightWidth={1}
            borderBottomWidth={1}
            borderColor="black"
            spacing={0}
            width="150px"
            height="100%"
            zIndex={18}
            bgColor="gray.500"
          >
            <Heading
              textAlign="center"
              color="pink.500"
              userSelect="none"
              size="sm"
            >
              Computed beats
            </Heading>
          </VStack>
          <BeatGrid
            songTempo={beatMap.tempo}
            songTempoOffset={beatMap.tempoOffset}
            songDuration={songDuration}
            borderColor="red"
          />
        </HStack>
      </Box>
      <Grid gridTemplateColumns="50vw 50vw">
        <GridItem colSpan={2}>
          <VStack m={2} p={2} width="100%">
            <Heading size="sm">Select song</Heading>
            <HStack>
              <AudioSelector />
            </HStack>
          </VStack>
        </GridItem>
        <GridItem>
          <VStack
            borderWidth={1}
            borderColor="cyan.500"
            m={2}
            p={2}
            width="350px"
          >
            <Heading color="cyan.500" size="sm">
              Detect beats
            </Heading>
            <ScalarInput
              name="Lowpass cutoff frequency (Hz)"
              value={frequency}
              onChange={(valueString) => setFrequency(valueString)}
              step={50}
            />
            <ScalarInput
              name="Beat detection threshold"
              value={threshold}
              onChange={(valueString) => setThreshold(valueString)}
              step={0.01}
            />
            <Heading size="sm">Total beats detected: {beats.length}</Heading>
            <TableContainer>
              <Table size="sm" variant="simple">
                <Thead>
                  <Tr>
                    <Th isNumeric>Tempo (BPM)</Th>
                    <Th isNumeric>Count</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {displayTempoCounts.map(({ tempo, count }, index) => (
                    <Fragment key={index}>
                      <Tr>
                        <Td>
                          <Text
                            cursor="pointer"
                            _hover={{ textDecoration: "underline" }}
                            onClick={() => setTempoString(tempo.toString())}
                            color="blue.500"
                          >
                            {tempo.toFixed(2)}
                          </Text>
                        </Td>
                        <Td>
                          <span>{count}</span>
                        </Td>
                      </Tr>
                    </Fragment>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </VStack>
        </GridItem>
        <GridItem>
          <ComputedBeatsPanel
            tempoString={tempoString}
            setTempoString={setTempo}
            tempoOffsetString={tempoOffsetString}
            setTempoOffsetString={setTempoOffset}
          />
        </GridItem>
      </Grid>
    </>
  );
});
