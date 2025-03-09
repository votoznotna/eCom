import React from 'react';
import ProductList from '@/components/shared/product/product-list';
// import sampleData from '@/db/sample-data';
import { getLatestProducts } from '@/lib/actions/product.actions';

// interface DelayFunction {
//   (ms: number): Promise<void>;
// }

// const delay: DelayFunction = (ms) =>
//   new Promise((resolve) => setTimeout(resolve, ms));

export const metadata = {
  title: 'Home',
};

const Homepage = async () => {
  // await delay(2000);
  const latestProducts = await getLatestProducts();

  return (
    <>
      <ProductList data={latestProducts} title="Newest arrivals" />
    </>
  );
};

export default Homepage;
