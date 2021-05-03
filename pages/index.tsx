import React from 'react';
import { GetStaticProps } from 'next';
import { Link, Button, Grid, Stack, Text, Flex, Image } from '@chakra-ui/react';
import { motion, AnimatePresence, AnimateSharedLayout } from 'framer-motion';

import { Product } from '../product/types';
import api from '../product/api';

interface Props {
  products: Product[];
}

function parseCurrency(value: number): string {
  return value.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
  });
}

const IndexRoute: React.FC<Props> = ({ products }) => {
  const [cart, setCart] = React.useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = React.useState<string>(null);

  const text = React.useMemo(
    () =>
      cart
        .reduce(
          (message, product) =>
            message.concat(
              `* ${product.title} - ${parseCurrency(product.price)}\n`
            ),
          ``
        )
        .concat(
          `\nTotal: ${parseCurrency(
            cart.reduce((total, product) => total + product.price, 0)
          )}`
        ),
    [cart]
  );

  React.useEffect(() => {
    setTimeout(() => setCart([]), 5000);
  }, [cart]);

  return (
    <AnimateSharedLayout type="crossfade">
      <Stack spacing={6}>
        <Grid
          gridGap={6}
          templateColumns="repeat(auto-fill, minmax(240px, 1fr))"
        >
          {products.map((product) => (
            <Stack
              borderRadius="md"
              padding={4}
              fontSize="sm"
              fontWeight="500"
              color="green.500"
              backgroundColor="gray.100"
              spacing={3}
              key={product.id}
            >
              <Image
                alt={product.title}
                as={motion.img}
                cursor="pointer"
                layoutId={product.image}
                maxHeight={150}
                borderRadius={8}
                objectFit="cover"
                onClick={() => setSelectedImage(product.image)}
                src={product.image}
              />
              <Stack spacing={1}>
                <Text>{product.title}</Text>
                <Text>{parseCurrency(product.price)}</Text>
                <Text paddingBottom={5} paddingTop={5}>
                  {parseCurrency(product.description)}
                </Text>
              </Stack>
              <Button
                onClick={() => setCart((cart) => cart.concat(product))}
                colorScheme="primary"
                size="sm"
              >
                Agregar
              </Button>
            </Stack>
          ))}
        </Grid>
        <AnimatePresence>
          {Boolean(cart.length) && (
            <Flex
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              as={motion.div}
              position="sticky"
              padding={4}
              bottom={4}
              alignItems="center"
              justifyContent="center"
            >
              <Button
                width="fit-content"
                as={Link}
                href={`https://wa.me/543487229164?text=${encodeURIComponent(
                  text
                )}`}
                isExternal
                size="lg"
                colorScheme="whatsapp"
                leftIcon={
                  <Image src="https://icongr.am/fontawesome/whatsapp.svg?size=32&color=ffffff" />
                }
              >
                Completar pedido ({cart.length} productos)
              </Button>
            </Flex>
          )}
        </AnimatePresence>
      </Stack>
      <AnimatePresence>
        {selectedImage && (
          <Flex
            key="backdrop"
            alignItems="center"
            as={motion.div}
            backgroundColor="rgba(0,0,0,0.5)"
            justifyContent="center"
            layoutId={selectedImage}
            position="fixed"
            top={0}
            left={0}
            width="100%"
            height="100%"
            onClick={() => setSelectedImage(null)}
          >
            <Image key="image" src={selectedImage} />
          </Flex>
        )}
      </AnimatePresence>
    </AnimateSharedLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const products = await api.list();

  return {
    revalidate: 10,
    props: {
      products,
    },
  };
};

export default IndexRoute;
