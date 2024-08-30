import { observer } from "mobx-react-lite";
import { Modal, ModalOverlay } from "@chakra-ui/react";
import { useStore } from "@/src/types/StoreContext";
import { action } from "mobx";
import { lazy, Suspense } from "react";

const UploadAudioModalContent = lazy(
  () => import("@/src/components/UploadAudioModalContent")
);

export const UploadAudioModal = observer(function UploadAudioModal() {
  const store = useStore();
  const { uiStore } = store;

  const onClose = action(() => (uiStore.showingUploadAudioModal = false));

  return (
    <Modal
      onClose={onClose}
      isOpen={uiStore.showingUploadAudioModal}
      isCentered
    >
      <ModalOverlay />
      <Suspense fallback={null}>
        <UploadAudioModalContent />
      </Suspense>
    </Modal>
  );
});
