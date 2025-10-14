import React ,{useState,useEffect}from 'react';
import { dummyProducts } from '../api/dummy.js';

function Stallpage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(dummyProducts);
  }, []);

  return(
    <div>
      <h1>CRAFT Kitchen - Material Request</h1>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image_url} alt={product.name} width="150" />
            <h3>{product.name}</h3>
            <p>₹{product.price_per_unit} / {product.unit}</p>
            <button>Add to Request</button>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Stallpage;