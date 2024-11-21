import { useDisclosure } from '@mantine/hooks';
import { Burger } from '@mantine/core';

function BurgerMenu() {
  const [opened, { toggle }] = useDisclosure();
  return <Burger opened={opened} onClick={toggle} aria-label="Toggle navigation" />;
};

export default BurgerMenu;