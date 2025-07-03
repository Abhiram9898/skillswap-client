import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const FeaturedSkills = () => {
  const { skills, loading, error } = useSelector((state) => state.skills);

  // Sort top 6 by average rating with safe fallback
  const featured = skills
    ? [...skills]
        .sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0))
        .slice(0, 6)
    : [];

  if (loading) return <p className="text-center text-gray-500">Loading featured skills...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!skills || featured.length === 0)
    return <p className="text-center text-gray-500">No featured skills found.</p>;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {featured.map((skill) => (
        <Link
          to={`/skills/${skill._id}`}
          key={skill._id}
          className="bg-white p-5 rounded-xl shadow border hover:shadow-md transition block"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{skill.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{skill.description}</p>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-green-600 font-semibold">₹{skill.pricePerHour}/hr</span>
            <span className="text-yellow-500">⭐ {skill.avgRating?.toFixed(1) || 'N/A'}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default FeaturedSkills;
