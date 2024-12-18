import { observer } from "mobx-react-lite";
import {
  Button,
  Checkbox,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useStore } from "@/src/types/StoreContext";
import { action } from "mobx";
import { FaTrashAlt } from "react-icons/fa";
import { Experience } from "@/src/types/Experience";

type ExperiencesTableProps = {
  experiences: Experience[];
  omitIds?: number[];
  onClickExperience?: (experience: Experience) => void;
  selectable?: boolean;
  selectedExperienceIds?: number[];
  setSelectedExperienceIds?: (experiences: number[]) => void;
};

export const ExperiencesTable = observer(function ExperiencesTable({
  experiences,
  onClickExperience,
  omitIds,
  selectable,
  selectedExperienceIds,
  setSelectedExperienceIds,
}: ExperiencesTableProps) {
  const store = useStore();
  const { userStore } = store;
  const { username } = userStore;

  const toggleExperienceIdSelection = (id: number) => {
    setSelectedExperienceIds?.(
      selectedExperienceIds?.includes(id)
        ? selectedExperienceIds.filter((selectedId) => selectedId !== id)
        : [...(selectedExperienceIds ?? []), id],
    );
  };

  return (
    <TableContainer>
      <Table size="sm" colorScheme="blue">
        <Thead>
          <Tr>
            {selectable && <Th />}
            <Th>Name</Th>
            <Th>Author</Th>
            <Th>Song</Th>
            <Th />
          </Tr>
        </Thead>
        <Tbody>
          {experiences
            .filter((experience) => !omitIds?.includes(experience.id!))
            .map((experience) => (
              <Tr key={experience.id}>
                {selectable && (
                  <Td>
                    <Checkbox
                      isChecked={selectedExperienceIds?.includes(
                        experience.id!,
                      )}
                      onChange={() =>
                        toggleExperienceIdSelection(experience.id!)
                      }
                    />
                  </Td>
                )}
                <Td>
                  <Button
                    ml={-3}
                    size="md"
                    height={8}
                    variant="solid"
                    onClick={() =>
                      onClickExperience?.(experience) ??
                      toggleExperienceIdSelection(experience.id!)
                    }
                  >
                    {experience.name}
                  </Button>
                </Td>
                <Td>{experience.user.username}</Td>
                <Td>
                  {experience.song?.artist} - {experience.song?.name}
                </Td>
                <Td>
                  {experience.user.username === username && (
                    <IconButton
                      variant="ghost"
                      size="sm"
                      aria-label="Delete experience"
                      title="Delete experience"
                      icon={<FaTrashAlt size={14} />}
                      disabled={true}
                      onClick={action(() => {
                        if (
                          !confirm(
                            "Are you sure you want to delete this experience? This will permanently cast the experience into the fires of Mount Doom. (jk doesn't work yet)",
                          )
                        )
                          return;

                        // TODO:
                        // trpc.experience.deleteExperience.mutate({
                        //   name: experience.name,
                        //   usingLocalData,
                        // });
                      })}
                    />
                  )}
                </Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
});
