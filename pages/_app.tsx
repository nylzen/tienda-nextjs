import React from 'react';
import {
  ChakraProvider,
  Heading,
  Text,
  Image,
  Container,
  VStack,
  Box,
  Divider,
} from '@chakra-ui/react';
import { AppProps } from 'next/app';
import theme from '../theme';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      <Box padding={5}>
        <Container
          backgroundColor="white"
          boxShadow="md"
          maxWidth="çontainer.xl"
          padding={4}
          borderRadius="sm"
        >
          <VStack marginBottom={6}>
            <Image borderRadius={9999} src="//placehold.it/128x128"></Image>
            <Heading>Almacen</Heading>
            <Text>El almacen del barrio</Text>
          </VStack>
          <Divider marginY={6} />
          <Component {...pageProps} />
        </Container>
      </Box>
    </ChakraProvider>
  );
};
export default App;
