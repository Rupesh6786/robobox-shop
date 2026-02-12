import React, { useState, useEffect, useCallback } from 'react';

import { toast } from 'react-toastify';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import debounce from 'lodash/debounce';

const url = import.meta.env.VITE_BACKEND_URL;

const AddCouponModal = ({ isOpen, onClose, onAddCoupon }) => {
  const [coupon, setCoupon] = useState({
    code: '',
    discount: '',
    min_purchase: '',
    product_id: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = sessionStorage.getItem('token');

  const fetchProducts = useCallback(debounce(async (search) => {
    if (!search) return;
    setLoading(true);
    try {
      const response = await fetch(`${url}api/products/search?q=${search}`, {
        headers: { Authorization: token }
      });
      const data = await response.json();
      if (response.ok) {
        setProducts(data);
      } else {
        toast.error(data.message || 'Failed to fetch products');
      }
    } catch (error) {
      toast.error('An error occurred while fetching products');
      console.error('Fetch products error:', error);
    }
    setLoading(false);
  }, 300), [token]);

  useEffect(() => {
    if (searchTerm) {
      fetchProducts(searchTerm);
    }
  }, [searchTerm, fetchProducts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCoupon({ ...coupon, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${url}api/coupons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify(coupon)
      });
      const data = await response.json();
      if (response.ok) {
        onAddCoupon(data.coupon);
        toast.success('Coupon added successfully');
        onClose();
      } else {
        toast.error(data.message || 'Failed to add coupon');
      }
    } catch (error) {
      toast.error('An error occurred while adding the coupon');
      console.error('Add coupon error:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Coupon</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="code">Coupon Code</Label>
              <Input
                id="code"
                name="code"
                value={coupon.code}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="discount">Discount</Label>
              <Input
                id="discount"
                name="discount"
                type="number"
                value={coupon.discount}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="min_purchase">Minimum Purchase</Label>
              <Input
                id="min_purchase"
                name="min_purchase"
                type="number"
                value={coupon.min_purchase}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="product_search">Search Product</Label>
              <Input
                id="product_search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for a product..."
              />
            </div>
            <div>
              <Label htmlFor="product_id">Select Product</Label>
              <Select
                id="product_id"
                name="product_id"
                value={coupon.product_id}
                onValueChange={(value) => setCoupon({ ...coupon, product_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Products</SelectItem>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="submit">Add Coupon</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCouponModal;