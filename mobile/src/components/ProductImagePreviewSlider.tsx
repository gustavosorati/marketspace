import { Stack, Image, View, HStack } from "native-base";
import { Dimensions, FlatList, ViewToken } from "react-native";
import { IMAGE_API } from "../services/http/api";
import { useRef, useState } from "react";

interface ChangeImageProps {
  viewableItems: Array<ViewToken>;
  changed: Array<ViewToken>;
}

interface Props {
  images: {
    path: string,
    type: string | undefined
  }[];
}

const IMAGE_SIZE = Dimensions.get("window").width;


export function ProductImagePreviewSlider({ images }: Props) {
  const [indexImage, setIndexImage] = useState(0)

  const indexChange = useRef((info: ChangeImageProps) => {
    const index = info.viewableItems[0].index!;
    setIndexImage(index);
  })

  return (
    <Stack position="relative">
      <FlatList
        horizontal
        data={images}
        keyExtractor={(item) => item.path}
        renderItem={({item, index}) => {
          const imageIsInternal = item.path.startsWith("file://");

          return (
            <Image
              key={index}
              w={IMAGE_SIZE}
              h={280}
              alt={item.path}
              source={{ uri: imageIsInternal
                ? item.path
                : `${IMAGE_API}${item.path}`
              }}
            />
          )
        }}
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
            h={1}
            bg={"base.gray-7"}
            opacity={indexImage === index ? 1 : .5}
            rounded="md"
          />
        ))}
      </HStack>

    </Stack>
  )
}
