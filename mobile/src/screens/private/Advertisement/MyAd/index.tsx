import { ScrollView, useTheme, VStack } from 'native-base'
import { ArrowLeft, Power, Tag, Trash } from 'phosphor-react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


import { Header } from './components/Header';
import { Button } from '../../../../components/Button';
import { AdDetailsContent } from '../../../../components/AdDetailsContent';
import { ProductImageSlider } from '../../../../components/ProductImageSlider';



export function MyAd() {
  const { colors } = useTheme();

  return(
    <SafeAreaView style={{ flex: 1}}>
        <VStack flex={1} bg="base.gray-6">
          <ScrollView>

            {/* <ProductImageSlider  /> */}

            {/* <AdDetailsContent /> */}
          </ScrollView>
        </VStack>

        <VStack bg="base.gray-6"  p={4} space={4}>
          <Button
            text='Voltar e editar'
            variant="terciary"
            leftIcon={<Power size={16} color={colors.base['gray-7']} />}
          />

          <Button
            text='Publicar'
            variant="secondary"
            leftIcon={<Trash size={16} color={colors.base['gray-2']} />}
          />
        </VStack>
    </SafeAreaView>
  )
}
