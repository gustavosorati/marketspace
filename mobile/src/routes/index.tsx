import { NavigationContainer } from '@react-navigation/native';
import { PublicRoutes } from './public.routes';
import { useAuthentication } from '../contexts/AuthContext';
import { PrivateRoutes } from './private.routes';

export default function Routes() {
  const { user } = useAuthentication();

  return (
    <NavigationContainer>
      {user && user.id ? <PrivateRoutes /> : <PublicRoutes />}
    </NavigationContainer>
  );
}
