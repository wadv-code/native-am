import { Modal, type TextProps } from "react-native";
import { ViewPlayer } from "./ViewPlayer";
import { ListPlayer } from "./ListPlayer";

type ModalPlayerType = "view" | "list" | "image";

type ModalPlayerProps = TextProps & {
  modalType: ModalPlayerType;
  modalVisible: boolean;
  closeModal: () => void;
};

const ModalPlayer = ({
  modalVisible,
  modalType = "view",
  closeModal,
}: ModalPlayerProps) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
      statusBarTranslucent={true}
    >
      {modalType === "view" && <ViewPlayer closeModal={closeModal} />}
      {modalType === "list" && <ListPlayer closeModal={closeModal} />}
    </Modal>
  );
};

export { ModalPlayer, ModalPlayerType, ModalPlayerProps };
