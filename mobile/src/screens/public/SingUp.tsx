import { Center, Heading, ScrollView, Text, VStack, View } from 'native-base';
import React, { useState } from 'react';
import { Button } from '../../components/Button';
import { AvatarPicker } from '../../components/AvatarPicker';
import { Input } from '../../components/Input';
import LogoSvg from '../../assets/logo.svg';
import { useNavigation } from '@react-navigation/native';

import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { PublicParamsTypes } from '../../routes/public.routes';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ToastNotification } from '../../helpers/ToastNotification';
import { USER_SERVICES } from '../../services/users/users.services';

const registerUserSchema = z.object({
  name: z.string({ required_error: "O nome é obrigatório" }),
  email: z.string({ required_error: "O email é obrigatório" }).email({ message: "Informe um email válido" }),
  image: z.string({ required_error: "Selecione uma imagem" }),
  tel: z.string({ required_error: "O telefone é obrigatório" }),
  password: z.string({ required_error: "A senha é obrigatória" }),
  confirmPassword: z.string()
}).superRefine(({ confirmPassword, password }, ctx) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      code: "custom",
      message: "As senhas não batem"
    });
  }
});

type RegisterUserSchemaType = z.infer<typeof registerUserSchema>;

interface AvatarProps {
  name: string;
  uri: string;
  type: string;
}

export function SignUp() {
  const navigation = useNavigation<PublicParamsTypes>();
  const { control, handleSubmit } = useForm<RegisterUserSchemaType>({
    resolver: zodResolver(registerUserSchema)
  });

  const [avatarForm, setAvatarFormData] = useState<AvatarProps>({} as AvatarProps);

  // functions

  const handleCreateUser = async (data: RegisterUserSchemaType) => {
    const userUploadForm = new FormData();

    userUploadForm.append("avatar", avatarForm as any);
    userUploadForm.append("name", data.name);
    userUploadForm.append("email", data.email);
    userUploadForm.append("tel", data.tel);
    userUploadForm.append("password", data.password);

    await USER_SERVICES.create(userUploadForm);

    navigation.navigate("SignIn");
  }

  const pickImage = async (onChange: (...event: any[]) => void) => {

    let photoSelected = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if(photoSelected.canceled) return;

    if(photoSelected.assets[0].uri) {
      const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets
        [0].uri, { size: true });

      if(photoInfo.exists && photoInfo.size && (photoInfo.size / 1024 / 1024) > 8){
        ToastNotification({
          type: "error",
          message: "Erro",
          description: "A imagem deve ter no máximo 8mb"
        });
        return;
      }
    }

    const fileExtension = photoSelected.assets[0].uri.split(".").pop();

    const photoFile = {
      name: "teste",
      uri: photoSelected.assets[0].uri,
      type: `${photoSelected.assets[0].type}/${fileExtension}`
    } as any;

    onChange(photoSelected.assets[0].uri);
    setAvatarFormData(photoFile);
  };

  return (
    <SafeAreaView style={{ flex: 1  }}>
    <ScrollView flex={1} showsVerticalScrollIndicator={false}>
      <VStack flex={1} w="full" bg="base.gray-6" px={12}>

        <Center w="full" alignItems="center" justifyContent="center" mb={4} pt={4}>
          <LogoSvg width={80} height={60} />

          <Heading fontFamily="Karla_700Bold" mb={1}>Boas vindas!</Heading>

          <Text fontSize={'xs'} fontFamily={"body"} color="base.gray-2" textAlign="center">
            Crie sua conta e use o espaço para comprar itens variados e vender seus produtos
          </Text>

          <View mt={8}>
            <Controller
              control={control}
              name="image"
              render={({
                field: { value, onChange },
                fieldState: { error }
              }) => (
                <AvatarPicker
                  onPress={(event) => pickImage(onChange)}
                  image={value}
                  error={error?.message}
                />
              )}
            />
          </View>
        </Center>

        <VStack space={4} mb={10}>
          <Controller
            control={control}
            name="name"
            render={({
              field: { value, onChange },
              fieldState: { error }
            }) => (
              <Input
                type="text"
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                error={error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({
              field: { value, onChange },
              fieldState: { error }
            }) => (
              <Input
                type="text"
                placeholder="E-mail"
                onChangeText={onChange}
                value={value}
                error={error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="tel"
            render={({
              field: { value, onChange },
              fieldState: { error }
            }) => (
              <Input
                type="text"
                placeholder="Telefone"
                onChangeText={onChange}
                value={value}
                error={error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({
              field: { value, onChange },
              fieldState: { error }
            }) => (
              <Input
                type="password"
                placeholder="Senha"
                onChangeText={onChange}
                value={value}
                error={error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({
              field: { value, onChange },
              fieldState: { error }
            }) => (
              <Input
                type="password"
                placeholder="Confirme a senha"
                onChangeText={onChange}
                value={value}
                error={error?.message}
              />
            )}
          />

          <Button text='Criar' variant="terciary" onPress={handleSubmit(handleCreateUser)} />
        </VStack>

        <VStack w="full" alignItems="center" justifyContent="center" pb={12} space={4}>
          <Text>Já tem uma conta?</Text>
          <Button text='Ir para o login' variant="secondary" onPress={() => navigation.navigate("SignIn") }/>
        </VStack>
      </VStack>
    </ScrollView>
    </SafeAreaView>
  );
}
