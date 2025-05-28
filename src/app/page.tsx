import { getCurrentSession } from '@/actions/auth';
import { getAllProducts } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import React from 'react';

const Home = async () => {
  const { user } = await getCurrentSession();
  const products = await getAllProducts();

  return (
    <div className="p-6">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {products?.map((product) => (
          <div
            key={product._id}
            className="border border-gray-200 rounded-lg shadow-sm p-4"
          >
            <img
              src={product.image ? urlFor(product.image).url() : ''}
              alt={product.title}
              className="w-full h-48 object-contain mb-4 mx-auto"
            />
            <h3 className="text-xl font-semibold text-gray-900 text-left mb-1">
              {product.title}
            </h3>
            <p className="text-sm text-gray-500 text-left mb-2">
              {product.description ? product.description.slice(0, 60) + '...' : ''}
            </p>
            <p className="text-left text-lg font-bold text-gray-800">
              ${product.price?.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
