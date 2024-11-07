import { useState } from "react";
import {
  Button,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaUser } from "react-icons/fa";
import { useStore } from "@/src/types/StoreContext";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { trpc } from "@/src/utils/trpc";

export const LoginButton = observer(function LoginButton() {
  const store = useStore();
  const { experienceStore, uiStore, usingLocalData } = store;

  const [newUser, setNewUser] = useState("");

  const {
    isPending,
    isError,
    data: users,
  } = trpc.user.listUsers.useQuery(
    { usingLocalData },
    { enabled: uiStore.showingUserPickerModal }
  );

  const createUser = trpc.user.createUser.useMutation();

  const onClose = action(() => {
    uiStore.showingUserPickerModal = false;
    setNewUser("");
  });

  if (isError) return null;

  return (
    <>
      <Button
        variant="ghost"
        onClick={action(() => (uiStore.showingUserPickerModal = true))}
        leftIcon={<FaUser />}
        size="xs"
      >
        {store.username || "Log in"}
      </Button>

      <Modal
        isOpen={uiStore.showingUserPickerModal}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Time to &quot;log in&quot; {isPending && <Spinner />}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack alignItems="center">
              {!isPending &&
                users
                  .filter((user) => user.username !== store.username)
                  .map((user) => (
                    <Button
                      key={user.id}
                      leftIcon={<FaUser />}
                      width="100%"
                      onClick={action(() => {
                        store.username = user.username;
                        if (store.context === "experienceEditor") {
                          experienceStore.loadEmptyExperience();
                          uiStore.showingOpenExperienceModal = true;
                        }
                        onClose();
                      })}
                    >
                      {user.username}
                    </Button>
                  ))}
            </VStack>

            <Text my={4}>Click a name above or type a new name:</Text>
            <HStack>
              <Input
                value={newUser}
                onChange={(e) => setNewUser(e.target.value)}
              />
              <Button
                isDisabled={
                  !newUser ||
                  users?.some((u) => u.username === newUser) ||
                  newUser === "conjurer" // reserved username
                }
                onClick={action(async () => {
                  await createUser.mutateAsync({
                    usingLocalData,
                    username: newUser,
                  });
                  store.username = newUser;
                  experienceStore.loadEmptyExperience();
                  onClose();
                })}
              >
                {createUser.isPending ? <Spinner /> : "Create"}
              </Button>
            </HStack>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </>
  );
});
