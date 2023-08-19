import { Stack, Image, View, HStack, Heading } from "native-base";
import { IProductImage } from "../dtos/ProductsDTO";
import { Dimensions, FlatList, ViewToken } from "react-native";
import { IMAGE_API } from "../services/http/api";
import { useRef, useState } from "react";

interface ChangeImageProps {
  viewableItems: Array<ViewToken>;
  changed: Array<ViewToken>;
}

interface Props {
  images: IProductImage[];
  isActive?: boolean;
}

const IMAGE_SIZE = Dimensions.get("window").width;

export function ProductImageSlider({ images, isActive }: Props) {
  const [indexImage, setIndexImage] = useState(0)

  const indexChange = useRef((info: ChangeImageProps) => {
    const index = info.viewableItems[0].index!;
    setIndexImage(index);
  })

  return (
    <Stack position="relative">
      {!isActive &&
        <Stack
          w={IMAGE_SIZE}
          h={280}
          zIndex={99}
          position="absolute"
          alignItems="center"
          justifyContent="center"
        >
          <Stack
            w={IMAGE_SIZE}
            h={280}
            bg={"black"}
            position="absolute"
            top={0}
            left={0}
            opacity={.6}
          />
          <Heading color="white" textTransform="uppercase">Anúncio desativado</Heading>
        </Stack>
      }

      <FlatList
        horizontal
        data={images}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <Image
            key={item.id}
            w={IMAGE_SIZE}
            h={280}
            alt={item.id}
            source={{ uri: `${IMAGE_API}/${item.path}`}}
          />
        )}
        showsHorizontalScrollIndicator={false}
        snapToInterval={IMAGE_SIZE}
        scrollEventThrottle={16}
        onViewableItemsChanged={indexChange.current}
      />

      {/* Image target */}
      <HStack space={1} px={1} position="absolute" bottom={1}>
        {images.map((image, index) => (
          <View
            key={index}
            w={(IMAGE_SIZE - 12) / images.length}
            h={1.5}
            bg={"base.gray-7"}
            opacity={indexImage === index ? 1 : .5}
            rounded="lg"
          />
        ))}
      </HStack>

    </Stack>
  )
}
