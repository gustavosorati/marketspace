import React, { useMemo } from "react";
import { BottomSheetBackgroundProps } from "@gorhom/bottom-sheet";
import Animated, {
  useAnimatedStyle,
  interpolateColor,
} from "react-native-reanimated";
import { useTheme } from "native-base";

const CustomModalBackground: React.FC<BottomSheetBackgroundProps> = ({
  style,
  animatedIndex,
}) => {
  const theme = useTheme();

  //#region styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      animatedIndex.value,
      [0, 1],
      [theme.colors.base["gray-6"], theme.colors.base["gray-6"]]
    ),
    borderRadius: 22
  }));
  const containerStyle = useMemo(
    () => [style, containerAnimatedStyle],
    [style, containerAnimatedStyle]
  );

  // render
  return <Animated.View pointerEvents="none" style={containerStyle} />;
};

export default CustomModalBackground;
