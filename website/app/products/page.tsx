"use client";

import ProductList from "../../components/layout/productlist";
import { useCategories } from "../../hooks/useCategories";

const page = () => {
  const { data: categories } = useCategories();

  return (
    <>
      {categories?.map((category) => (
        <ProductList
          key={category.id}
          title={category.name}
          categoryId={category.id}
        />
      ))}
    </>
  );
};

export default page;
