export type ProductSpecification = {
  label: string;
  value: string;
};

export type Product = {
  id: number;
  sku: string;
  name: string;
  slug: string;
  manufacturer: string;
  category: string;
  unit: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  featured: boolean;
  specifications: ProductSpecification[];
  applications: string[];
};
