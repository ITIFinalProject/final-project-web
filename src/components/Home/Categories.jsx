import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const categories = useSelector((state) => state.category.list);
  const navigate = useNavigate();

  const images = {
    'Entertainment': 'https://media.istockphoto.com/id/1478375497/photo/friends-dancing-at-the-festival.webp?a=1&b=1&s=612x612&w=0&k=20&c=vY3hkL6OT0dEb_2g4I1s9hjnO9UwHsp4b_Pu6QcTXbs=',
    'Educational & Business': 'https://media.istockphoto.com/id/469711926/photo/audience-in-the-lecture-hall.webp?a=1&b=1&s=612x612&w=0&k=20&c=XCapmKxy1lChEylepT3ag8bx4fKSLK4qNyApz0bfeKw=',
    'Cultural & Arts': 'https://media.istockphoto.com/id/1399195000/photo/mother-and-daughter-in-art-gallery.webp?a=1&b=1&s=612x612&w=0&k=20&c=iJHjsZgKKxxecSe_fyjOdw6ML3DZB2FEZHUStIXLpBk=',
    'Sports & Fitness': 'https://media.istockphoto.com/id/2148699579/photo/high-angle-shot-behind-galkeeper-gates-stadium-with-soccer-championship-match-teams-play.webp?a=1&b=1&s=612x612&w=0&k=20&c=qkieOQ2cIiqFViWGv68dNXM7NdyYQrf1FPqAg4UDnwQ=',
    'Technology & Innovation': 'https://images.unsplash.com/photo-1573757056004-065ad36e2cf4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8VGVjaG5vbG9neSUyMCUyNiUyMElubm92YXRpb258ZW58MHx8MHx8fDA%3D',
    'Travel & Adventure': 'https://media.istockphoto.com/id/904172104/photo/weve-made-it-all-this-way-i-am-proud.webp?a=1&b=1&s=612x612&w=0&k=20&c=XfRJBUkSatKmlfmpJo5di5ToQ9-cvnlRypQ03CHiylg=',
  };
  //   const images = {
  //   'Entertainment': 'https://picsum.photos/seed/event8/400/250',
  //   'Educational & Business': 'https://picsum.photos/seed/event9/400/250',
  //   'Cultural & Arts': 'https://images.unsplash.com/photo-1533236897111-3e94666b2edf?auto=format&fit=crop&w=400&q=80',
  //   'Sports & Fitness': 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=400&q=80',
  //   'Technology & Innovation': 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=400&q=80',
  //   'Travel & Adventure': 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80',
  // };

  const handleClick = (category) => {
    navigate(`/events?category=${encodeURIComponent(category)}`);
  };

  return (
    <section className="categories">
      <h2>Explore Categories</h2>
      <div className="category-list">
        {categories.map((cat) => (
          <div key={cat} onClick={() => handleClick(cat)} style={{ cursor: 'pointer' }}>
            <img src={images[cat]} alt={cat} />
            {cat}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;

