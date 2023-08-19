import { Toast } from "native-base";

interface Props {
  type: "success" | "error" | "alert";
  message: string;
  description?: string;
  onClose?: () => void;
}

export function ToastNotification({ type, message, description, onClose }: Props) {
  if(type === "success") {
		return Toast.show({
			title: message,
      description: description,
      duration: 3000,
      placement: "top",
      bg: "base.green-4",
      _title: {
        fontFamily: "Karla_700Bold"
      },
      _description: {
        fontFamily: "Karla_400Regular",
      },
      onCloseComplete: onClose ?? undefined
		});
	}

  if(type === "alert") {
		return Toast.show({
			title: message,
      duration: 5000,
      placement: "top",
      bg: "orange.600",
      _title: {
        fontFamily: "Karla_700Bold"
      },
      _description: {
        fontFamily: "Karla_400Regular"
      },
      onCloseComplete: onClose ?? undefined
		});
	}

	return Toast.show({
    title: message,
    description: description,
    duration: 5000,
    placement: "top",
    bg: "red.600",
    _title: {
      fontFamily: "Karla_700Bold"
    },
    _description: {
      fontFamily: "Karla_400Regular"
    },
    onCloseComplete: onClose ?? undefined
  });
}
