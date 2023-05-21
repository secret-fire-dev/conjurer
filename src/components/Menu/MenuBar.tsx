import { observer } from "mobx-react-lite";
import {
  Button,
  HStack,
  Heading,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  VStack,
} from "@chakra-ui/react";
import { BiTimer } from "react-icons/bi";
import { FaFolderOpen, FaRegClipboard } from "react-icons/fa";
import { FiSave } from "react-icons/fi";
import { useStore } from "@/src/types/StoreContext";
import { OpenExperienceModal } from "@/src/components/Menu/OpenExperienceModal";
import { SaveExperienceModal } from "@/src/components/Menu/SaveExperienceModal";
import { action } from "mobx";

export const MenuBar = observer(function MenuBar() {
  const store = useStore();
  const { experienceStore, uiStore } = store;

  return (
    <VStack
      p={2}
      position="absolute"
      top={0}
      left={0}
      alignItems="flex-start"
      zIndex={1}
      spacing={1}
      mx={2}
    >
      <HStack>
        <Heading
          size="md"
          onClick={action(() => {
            uiStore.showingSaveExperienceModal = true;
          })}
          cursor="pointer"
        >
          {store.experienceName || "Untitled"}
        </Heading>
        <Text fontSize="sm" color="gray.500" userSelect="none">
          {store.experienceLastSavedAt
            ? `last saved at ${Intl.DateTimeFormat("en", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              }).format(store.experienceLastSavedAt)}`
            : "not yet saved"}
        </Text>
      </HStack>
      <HStack>
        <OpenExperienceModal />
        <SaveExperienceModal />
        <Menu>
          <MenuButton
            as={Button}
            px={1}
            py={0}
            variant="ghost"
            size="sm"
            transition="all 0.2s"
            borderRadius="md"
            _hover={{ bg: "gray.500" }}
            _focus={{ boxShadow: "outline" }}
          >
            File
          </MenuButton>
          <MenuList zIndex={12}>
            {/* <MenuItem
            command="⌘N"
            onClick={() => {
              // TODO:
            }}
          >
            New experience
          </MenuItem>
          <MenuDivider /> */}
            <MenuItem
              icon={<FaFolderOpen size={17} />}
              command="⌘O"
              onClick={action(() => {
                uiStore.showingOpenExperienceModal = true;
              })}
            >
              Open...
            </MenuItem>
            <MenuItem
              icon={<FaFolderOpen size={17} />}
              onClick={() => experienceStore.loadFromLocalStorage("experience")}
            >
              Open last locally saved
            </MenuItem>
            <MenuItem
              icon={<BiTimer size={18} />}
              onClick={() => experienceStore.loadFromLocalStorage("autosave")}
            >
              Open last autosaved
            </MenuItem>
            <MenuDivider />
            <MenuItem
              icon={<FiSave size={17} />}
              command="⌘S"
              onClick={experienceStore.saveToS3}
            >
              Save
            </MenuItem>
            <MenuItem
              icon={<FiSave size={17} />}
              command="⌘⇧S"
              onClick={action(() => {
                uiStore.showingSaveExperienceModal = true;
              })}
            >
              Save as...
            </MenuItem>
            <MenuItem
              icon={<FiSave size={17} />}
              onClick={() => experienceStore.saveToLocalStorage("experience")}
            >
              Save locally
            </MenuItem>
            <MenuItem
              icon={<FaRegClipboard size={17} />}
              onClick={experienceStore.copyToClipboard}
            >
              Save to clipboard
            </MenuItem>
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton
            as={Button}
            px={1}
            py={0}
            variant="ghost"
            size="sm"
            transition="all 0.2s"
            borderRadius="md"
            _hover={{ bg: "gray.500" }}
            _focus={{ boxShadow: "outline" }}
          >
            Help
          </MenuButton>
          <MenuList zIndex={12}>
            {/* TODO */}
            <MenuItem>About Conjurer</MenuItem>
            <MenuItem>Keyboard shortcuts</MenuItem>
            <MenuItem>Report an issue</MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </VStack>
  );
});
