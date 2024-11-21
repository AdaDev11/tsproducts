import React from 'react';
import { MantineProvider } from '@mantine/core';
import Header from './Header';
import './styles/header.css';
import HelloWorld from './components/helloworld.js';
import HeaderSearch from './components/HeaderSearch/HeaderSearch.tsx';
import FooterSimple from './components/Footer/footer.tsx';
import Products from './components/Products/product';
import HeroContentLeft from './components/HeroContent/HeroContentLeft';
import FaqSimple from './components/FaqSimple/FaqSimple';

const App: React.FC = () => {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <HeaderSearch />
      <Products />
      <FaqSimple />
      <FooterSimple />
    </MantineProvider>
  );
};

export default App;
