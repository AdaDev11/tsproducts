import React, { useEffect, useState, useRef } from "react";
import { observer } from "mobx-react-lite";
import { Card, Text, Image, Button, Group, 
  Modal, Pagination, Loader, Alert, Input, Stack, Divider, 
  Select, Transition, Paper, Box, HoverCard,
  Checkbox, TextInput } from "@mantine/core";
import storeLimit from "./MOBXProductsStore";
import './products.css';
import { useClickOutside } from '@mantine/hooks';
import { useForm } from '@mantine/form';

const scaleY = {
  in: { opacity: 1, transform: 'scaleY(1)' },
  out: { opacity: 0, transform: 'scaleY(9)' },
  common: { transformOrigin: 'top', transition: `all 0.2s ease-in-out` },
  transitionProperty: 'transform, opacity',
};

const Products: React.FC = observer(() => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [cartOpened, setCartOpened] = useState(false);

  useEffect(() => {
    storeLimit.fetchProducts();
  }, []);

  const handleOpenCart = () => setCartOpened(true);
  const handleCloseCart = () => setCartOpened(false);
  
  const [opened, setOpened] = useState(false);
  const clickOutsideRef = useClickOutside(() => setOpened(false));
  const [orderModalOpened, setOrderModalOpened] = useState(false);

  
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      termsOfService: false,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  const handleOrder = () => {
    setOrderModalOpened(true);
  };

  const handlePageChange = (page: number) => {
    storeLimit.updatePagination(page);
    setCurrentPage(page);
  };

  return (
    <div className="products-container">
      <Group position="apart" mb="md">
      
        <Input
          placeholder="Search products"
          onChange={(e) => storeLimit.setSearchQuery(e.target.value)}
        />
        <Select
          placeholder="Select Category"
          data={[...new Set(storeLimit.products.map((p) => p.category))]}
          onChange={(value) => storeLimit.setCategory(value)}
        />

        <Modal opened={cartOpened} onClose={handleCloseCart} title="Shopping Cart" size="lg">
          {storeLimit.cart.length === 0 ? (
            <Text>No items in the cart</Text>
          ) : (
            <Stack spacing="lg">
              {storeLimit.cart.map(({ product, quantity }) => (
                <Card key={product.id} shadow="sm" padding="lg" radius="md" withBorder>
                  <Group position="apart">
                    <Image src={product.images[0]} alt={product.title} width={50} height={50} />
                    <Stack style={{ flex: 1 }}>
                      <Text>{product.title}</Text>
                    </Stack>
                  </Group>
                </Card>
              ))}
              <Divider />
              <Text weight={700} size="xl">Total: ${storeLimit.totalPrice.toFixed(2)}</Text>
            </Stack>
          )}
        </Modal>
        
        
        <Modal
          opened={orderModalOpened}
          onClose={() => setOrderModalOpened(false)}
          title="Confirm Your Order"
          size="lg"
        >
          <Stack spacing="lg">
            <Text weight={700} size="xl">Order Summary</Text>
            {storeLimit.cart.map(({ product, quantity }) => (
              <Group key={product.id} position="apart">
                <Text>{product.title}</Text>
                <Text>x{quantity}</Text>
                <Text>${(product.price * quantity).toFixed(2)}</Text>
              </Group>
            ))}
            <Divider />
            <Text weight={700} size="xl">Total: ${storeLimit.totalPrice.toFixed(2)}</Text>
            
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
            <Stack>
                  <TextInput
        withAsterisk
                  label="Name"
                  placeholder="Name"
                  key={form.key('name')}
                  {...form.getInputProps('name')}
                  />
                  
                  <TextInput
        withAsterisk
                  label="Name"
                  placeholder="Addres"
                  key={form.key('addres')}
                  {...form.getInputProps('addres')}
                  />
                  
                  <TextInput
        withAsterisk
                  label="Name"
                  placeholder="Phone number"
                  key={form.key('phone number')}
                  {...form.getInputProps('phone number')}
                  />
            </Stack>
            
            </form>
            
      <Checkbox
        mt="md"
        label="I agree to sell my privacy"
        key={form.key('termsOfService')}
        {...form.getInputProps('termsOfService', { type: 'checkbox' })}
      />

            <Button
              variant="filled"
              color="green"
              onClick={() => {
                alert('Order placed successfully!');
                setOrderModalOpened(false);
                storeLimit.clearCart();
              }}
            >
              Confirm Order
            </Button>
          </Stack>
        </Modal>


        {selectedProduct && (
          <Modal opened={!!selectedProduct} onClose={() => setSelectedProduct(null)} title={selectedProduct.title}>
            <Image src={selectedProduct.images[0]} alt={selectedProduct.title} height={200} fit="cover" />
            <Text>{selectedProduct.description}</Text>
            <Text weight={700} color="blue">${selectedProduct.price}</Text>
            <Button variant="light" color="blue" fullWidth mt="md" onClick={() => storeLimit.addToCart(selectedProduct)}>
              Add to Cart
            </Button>
          </Modal>
        )}
        <Modal opened={cartOpened} onClose={handleCloseCart} title="Shopping Cart" size="lg">
          {storeLimit.cart.length === 0 ? (
            <Text>No items in the cart</Text>
          ) : (
            <Stack spacing="lg">
              {storeLimit.cart.map(({ product, quantity }) => (
                <Card key={product.id} shadow="sm" padding="lg" radius="md" withBorder>
                  <Group position="apart">
                    <Image src={product.images[0]} alt={product.title} width={50} height={50} />
                    <Stack style={{ flex: 1 }}>
                      <Text>{product.title}</Text>
                      <Group position="center">
                        <Button onClick={() => storeLimit.changeQuantity(product.id, quantity - 1)}>-</Button>
                        <Text>{quantity}</Text>
                        <Button onClick={() => storeLimit.changeQuantity(product.id, quantity + 1)}>+</Button>
                      </Group>
                      <Text size="sm">${(product.price * quantity).toFixed(2)}</Text>
                    </Stack>
                    <Button color="red" onClick={() => storeLimit.removeFromCart(product.id)}>Remove</Button>
                  </Group>
                </Card>
              ))}
              <Divider />
              <Text weight={700} size="xl">Total: ${storeLimit.totalPrice.toFixed(2)}</Text>
              <Button  onClick={() => setOrderModalOpened(true) & handleCloseCart()}>Order</Button>

            </Stack>
          )}
        </Modal>
        <Button variant="light" color="green" onClick={handleOpenCart} style = {{margin: '10px'}}>
          View Cart ({storeLimit.cart.length})
        </Button>
        <Transition
        mounted={opened}
        transition={scaleY}
        duration={200}
        timingFunction="ease"
        keepMounted
      >
        {(transitionStyle) => (
          <Paper className = 'hidden'
            shadow="md"
            p="xl"
            h={20}
            w={200}
            pos="absolute"
            bottom={20}
            right={0}
            ref={clickOutsideRef}
            style={{ ...transitionStyle, zIndex: 1 }}
          >
            successfully added to cart
          </Paper>
        )}
 </Transition>

      </Group>
      {storeLimit.error ? (
        <Alert title="Error" color="red">{storeLimit.error}</Alert>
      ) : storeLimit.productsForSet.length === 0 ? (
        <Loader />
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", margin: '40px', padding: '40px'}}>
            {storeLimit.productsForSet.map((product) => (
              <Card key={product.id} shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section>
                  <Image src={product.images[0]} alt={product.title} height={160} fit="cover" />
                </Card.Section>
                <Text weight={500} size="lg" mt="md">{product.title}</Text>
                <Text size="xl" weight={700} color="blue" mt="md">${product.price}</Text>
                <Group position="apart" mt="md">
                  <Button variant="light" color="blue" onClick={() => setSelectedProduct(product)}>View Details</Button>
                  <Button variant="light" color="blue" onClick={() => storeLimit.addToCart(product) &  setOpened(true)}>Add to Cart</Button>
                </Group>
              </Card>
            ))}
          </div>
          <Pagination className = 'center ' style = {{alignItems: 'center', margin: '10px', padding: '10px'}} page={currentPage} onChange={handlePageChange} total={storeLimit.totalPages}
          />
         
        </>
      )}
    </div>
  );
});

export default Products;