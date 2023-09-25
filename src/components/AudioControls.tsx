import { observer } from "mobx-react-lite";
import {
  IconButton,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Tooltip,
} from "@chakra-ui/react";
import { BsSoundwave } from "react-icons/bs";
import { FaVolumeMute, FaPencilAlt } from "react-icons/fa";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { ImLoop } from "react-icons/im";
import { useStore } from "@/src/types/StoreContext";
import { action } from "mobx";
import { UploadAudioModal } from "@/src/components/UploadAudioModal";
import { useEffect, useState } from "react";
import { RxColumns } from "react-icons/rx";
import { PiArrowsInLineHorizontalBold } from "react-icons/pi";

export const AudioControls = observer(function AudioControls() {
  const store = useStore();
  const { uiStore, audioStore, initializedClientSide } = store;
  const { wavesurfer } = audioStore;
  const [showTooltip, setShowTooltip] = useState(false);
  const [audioVol, setAudioVol] = useState(1);

  const changeVolume = (value: number) => {
    wavesurfer?.setVolume(value);
    setAudioVol(value);
  };

  useEffect(() => {
    if (!initializedClientSide) return;
    void audioStore.fetchAvailableAudioFiles();
  }, [audioStore, initializedClientSide]);

  return (
    <>
      <Select
        size="xs"
        width={40}
        value={audioStore.selectedAudioFile}
        onChange={action((e) => {
          audioStore.selectedAudioFile = e.target.value;
        })}
      >
        {audioStore.availableAudioFiles.map((audioFile) => (
          <option key={audioFile} value={audioFile}>
            {audioFile}
          </option>
        ))}
      </Select>
      <UploadAudioModal />
      <IconButton
        aria-label="Upload audio"
        title="Upload audio"
        height={6}
        icon={<AiOutlineCloudUpload size={17} />}
        isDisabled={store.usingLocalAssets}
        onClick={action(() => (uiStore.showingUploadAudioModal = true))}
      />
      <Slider
        aria-label="Audio volume"
        title="Audio volume"
        mx={2}
        min={0}
        max={1}
        step={0.01}
        value={audioVol}
        onChange={action((value) => changeVolume(value))}
        width="120px"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
        <Tooltip
          hasArrow
          bg="teal.500"
          color="white"
          placement="top"
          isOpen={showTooltip}
          label={`Audio volume: ${(audioVol * 100).toFixed(0)}%`}
        >
          <SliderThumb />
        </Tooltip>
      </Slider>

      <IconButton
        aria-label="Mute/unmute audio"
        title="Mute/unmute audio"
        height={6}
        icon={<FaVolumeMute size={17} />}
        bgColor={audioStore.audioMuted ? "orange.700" : undefined}
        _hover={
          audioStore.audioMuted
            ? {
                bgColor: "orange.600",
              }
            : undefined
        }
        onClick={action(() => audioStore.toggleAudioMuted())}
      />
      <IconButton
        aria-label="Loop time range"
        title="Loop time range"
        height={6}
        icon={<ImLoop size={17} />}
        bgColor={audioStore.loopingAudio ? "orange.700" : undefined}
        _hover={
          audioStore.loopingAudio
            ? {
                bgColor: "orange.600",
              }
            : undefined
        }
        onClick={action(() => audioStore.toggleLoopingAudio())}
      />
      <IconButton
        aria-label="Show waveform overlay"
        title="Show waveform overlay"
        height={6}
        icon={<BsSoundwave size={17} />}
        bgColor={uiStore.showingWaveformOverlay ? "orange.700" : undefined}
        _hover={
          uiStore.showingWaveformOverlay
            ? {
                bgColor: "orange.600",
              }
            : undefined
        }
        onClick={action(() => uiStore.toggleWaveformOverlay())}
      />
      <IconButton
        aria-label="Show beat grid overlay"
        title="Show beat grid overlay"
        height={6}
        icon={<RxColumns size={17} />}
        bgColor={uiStore.showingBeatGridOverlay ? "orange.700" : undefined}
        _hover={
          uiStore.showingBeatGridOverlay
            ? {
                bgColor: "orange.600",
              }
            : undefined
        }
        onClick={action(() => uiStore.toggleBeatGridOverlay())}
      />
      <IconButton
        aria-label="Snap to grid"
        title="Snap to grid"
        height={6}
        icon={<PiArrowsInLineHorizontalBold size={17} />}
        bgColor={uiStore.snappingToBeatGrid ? "orange.700" : undefined}
        _hover={
          uiStore.snappingToBeatGrid
            ? {
                bgColor: "orange.600",
              }
            : undefined
        }
        onClick={action(() => uiStore.toggleSnappingToBeatGrid())}
      />
      <IconButton
        aria-label="Mark audio"
        title="Mark audio"
        height={6}
        icon={<FaPencilAlt size={17} />}
        bgColor={audioStore.markingAudio ? "orange.700" : undefined}
        _hover={
          audioStore.markingAudio
            ? {
                bgColor: "orange.600",
              }
            : undefined
        }
        onClick={action(() => audioStore.toggleMarkingAudio())}
      />
    </>
  );
});
