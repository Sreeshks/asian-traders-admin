import CategoryForm from '../components/CategoryForm';
import CategoryTable from '../components/CategoryTable';

function CategoryManagement() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Category Management</h1>
      <CategoryForm />
      <CategoryTable />
    </div>
  );
}

export default CategoryManagement;