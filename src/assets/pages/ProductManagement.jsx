import ProductForm from '../components/ProductForm';
import ProductTable from '../components/ProductTable';

function ProductManagement() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Product Management</h1>
      <ProductForm />
      <ProductTable />
    </div>
  );
}

export default ProductManagement;