import React, { useEffect, useState } from 'react';

function ManageCategory() {
  const url = import.meta.env.VITE_BACKEND_URL;
  const token = sessionStorage.getItem('token');
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editCategory, setEditCategory] = useState({ Id: '', type: '' });

  useEffect(() => {
    try {
      fetch(`${url}api/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json()
      .then(data => setCategories(data))
      )
    }
    catch (error) {
      console.log(error);
    }
  }, [url, token]);


  const handleAddCategory = () => {
    fetch(`${url}api/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      },
      body: JSON.stringify({ name: newCategory })
    })
      .then(res => res.json())
      .then(data => {
        setCategories([...categories, data]);
        setNewCategory('');
      });
  };

  const handleEditCategory = () => {
    fetch(`${url}api/categories/${editCategory.Id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      },
      body: JSON.stringify({ name: editCategory.type })
    })
      .then(res => res.json())
      .then(data => {
        setCategories(categories.map(cat => (cat.Id === data.Id ? data : cat)));
        setEditCategory({ Id: '', type: '' });
      })
      //optional refetch
      .then(() => {
        fetch(`${url}api/categories`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
          .then(res => res.json())
          .then(data => setCategories(data));
      });
  };

  const handleDeleteCategory = (Id) => {
    fetch(`${url}api/categories/${Id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `${token}`
      }
    })
      .then(() => {
        setCategories(categories.filter(cat => cat.Id !== Id));
        
      });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Manage Categories</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Add Category</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-grow px-3 py-2 border rounded-md"
            placeholder="New category name"
          />
          <button 
            onClick={handleAddCategory}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      <div className="overflow-x-auto h-[50vh] bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
  {categories.map((category) => (
    <tr key={category.Id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.Id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.type}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button 
          onClick={() => setEditCategory(category)}
          className="text-indigo-600 hover:text-indigo-900 mr-2"
        >
          Edit
        </button>
        <button 
          onClick={() => handleDeleteCategory(category.Id)}
          className="text-red-600 hover:text-red-900"
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>

    

        </table>
      </div>

      {editCategory.Id && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Edit Category</h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={editCategory.type}
              onChange={(e) => setEditCategory({ ...editCategory, type: e.target.value })}
              className="flex-grow px-3 py-2 border rounded-md"
            />
            <button 
              onClick={handleEditCategory}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageCategory;