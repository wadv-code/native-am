import { Modal, type TextProps } from "react-native";
import { ViewPlayer } from "./ViewPlayer";

type ModalPlayerProps = TextProps & {
  modalVisible: boolean;
  closeModal: () => void;
};

const ModalPlayer = ({ modalVisible, closeModal }: ModalPlayerProps) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
      statusBarTranslucent={true}
    >
      <ViewPlayer closeModal={closeModal} />
    </Modal>
  );
};

export { ModalPlayer, ModalPlayerProps };
