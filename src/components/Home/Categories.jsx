import { useSelector } from 'react-redux';


const Categories = () => {
  const categories = useSelector((state) => state.category.list);

  const images = {
    'Entertainment': 'https://picsum.photos/seed/event8/400/250',
    'Educational & Business': 'https://picsum.photos/seed/event9/400/250',
    'Cultural & Arts': 'https://images.unsplash.com/photo-1533236897111-3e94666b2edf?auto=format&fit=crop&w=400&q=80',
    'Sports & Fitness': 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=400&q=80',
    'Technology & Innovation': 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=400&q=80',
    'Travel & Adventure': 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80',
  };
  
  return (
    <section className="categories">
      <h2>Explore Categories</h2>
      <div className="category-list">
        {categories.map((cat) => (
          <div key={cat}>
            <img src={images[cat]} alt={cat} />
            {cat}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
