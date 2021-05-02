import React from 'react';
import { GetStaticProps } from 'next';
import { Link, Button, Grid, Stack, Text, Flex, Image } from '@chakra-ui/react';

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

  return (
    <Stack spacing={6}>
      <Grid gridGap={6} templateColumns="repeat(auto-fill, minmax(240px, 1fr))">
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
              borderRadius={8}
              maxHeight={250}
              objectFit="cover"
              src={product.image}
            />
            <Stack spacing={1}>
              <Text>{product.title}</Text>
              <Text>{parseCurrency(product.price)}</Text>
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
      {Boolean(cart.length) && (
        <Flex
          position="sticky"
          padding={4}
          bottom={4}
          alignItems="center"
          justifyContent="center"
        >
          <Button
            width="fit-content"
            as={Link}
            href={`https://wa.me/43534534535?text=${encodeURIComponent(text)}`}
            isExternal
            colorScheme="whatsapp"
          >
            Completar pedido ({cart.length} productos)
          </Button>
        </Flex>
      )}
    </Stack>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const products = await api.list();

  return {
    props: {
      products,
    },
  };
};

export default IndexRoute;
