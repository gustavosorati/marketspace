import { Image as NativeBaseImage, IImageProps } from "native-base";
import { IMAGE_API } from "../../services/http/api";

type Props = IImageProps & {
  user: {
    avatar: string
    name: string
  }
};

export function ProfilePhoto({ user, ...rest }: Props) {
  return (
    <NativeBaseImage
      source={{ uri: `${IMAGE_API}/${user.avatar}` }}
      alt={user.name}
      w={5}
      h={5}
      rounded="full"
      borderWidth="1"
      borderColor="product.blue"
      {...rest}
    />
  )
}
