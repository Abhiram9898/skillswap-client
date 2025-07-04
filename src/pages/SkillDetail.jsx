import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchSkillById, deleteSkill } from '../redux/skillSlice';
import { FaStar, FaRegStar } from 'react-icons/fa';
import ReviewForm from '../pages/ReviewForm';
import { toast } from 'react-toastify'; // Ensure toast is imported for error messages

const SkillDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

  const { skillDetail: currentSkill, loading, error } = useSelector((state) => state.skills);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchSkillById(id));
  }, [dispatch, id]);

  if (loading) return <div className="text-center py-10 text-lg">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!currentSkill?._id) return <div className="text-center text-red-500 py-10">Skill not found.</div>;

  const isOwner = userInfo && currentSkill?.createdBy && userInfo._id === currentSkill.createdBy._id;

  const handleDeleteConfirm = async () => {
    setShowConfirmDeleteModal(false);
    try {
      setDeleting(true);
      await dispatch(deleteSkill(currentSkill._id)).unwrap();
      navigate('/skills');
    } catch (err) {
      console.error('Failed to delete skill:', err);
      toast.error(err.message || 'Failed to delete skill. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const triggerDeleteConfirmation = () => {
    setShowConfirmDeleteModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 md:p-8 border-b">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 inline-block text-sm bg-gray-100 text-gray-600 px-4 py-2 rounded hover:bg-gray-200"
          >
            ← Back
          </button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex items-center gap-4">
              <img
                src={currentSkill.createdBy?.avatar || 'https://placehold.co/40x40/E0E0E0/333333?text=User'}
                alt="Instructor"
                className="w-12 h-12 rounded-full object-cover border"
              />
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {currentSkill.createdBy?.name}
                </h2>
                <span className="text-sm text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded">
                  {currentSkill.category}
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold text-green-600 mt-4 md:mt-0">
              ₹{currentSkill.pricePerHour}/hour
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">{currentSkill.title}</h1>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {currentSkill.description}
          </p>

          <div className="mt-6 flex gap-4 flex-wrap">
            {isOwner ? (
              <>
                <Link
                  to={`/instructor/edit-skill/${currentSkill._id}`}
                  className="px-5 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 shadow"
                >
                  ✏️ Edit Skill
                </Link>
                <button
                  onClick={triggerDeleteConfirmation}
                  disabled={deleting}
                  className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600 shadow"
                >
                  {deleting ? 'Deleting...' : '🗑️ Delete Skill'}
                </button>
              </>
            ) : (
              <Link
                to={`/book/${currentSkill._id}`}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg transition"
              >
                Book This Session
              </Link>
            )}
          </div>
        </div>

        {/* Instructor Bio */}
        <div className="p-6 md:p-8 border-b bg-blue-50">
          <h3 className="text-xl font-bold mb-3">🎓 About the Instructor</h3>
          <p className="text-gray-700 mb-2 whitespace-pre-line">
            {currentSkill.createdBy?.bio || 'No bio available.'}
          </p>
          <Link
            to={`/profile/${currentSkill.createdBy?._id}`}
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            View Full Profile →
          </Link>
        </div>

        {/* Reviews */}
        <div className="p-6 md:p-8">
          <h3 className="text-xl font-bold mb-4">⭐ Student Reviews</h3>

          {/* Display average rating and number of reviews */}
          {currentSkill.averageRating !== undefined && currentSkill.numReviews !== undefined && (
            <div className="mb-4 text-center text-lg font-semibold text-gray-700">
              {currentSkill.numReviews > 0 ? (
                <>
                  Average Rating: <span className="text-yellow-500">{currentSkill.averageRating?.toFixed(1)}</span> / 5
                  ({currentSkill.numReviews} review{currentSkill.numReviews > 1 ? 's' : ''})
                </>
              ) : (
                'No ratings yet.'
              )}
            </div>
          )}

          {currentSkill.reviews?.length > 0 ? (
            <div className="space-y-5">
              {[...currentSkill.reviews]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((review) => (
                  <div key={review._id} className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center mb-2">
                      <img
                        src={review.userId?.avatar || 'https://placehold.co/32x32/E0E0E0/333333?text=User'}
                        alt={review.userId?.name}
                        className="w-8 h-8 rounded-full mr-3 object-cover"
                      />
                      <span className="font-semibold">{review.userId?.name || 'Anonymous'}</span>
                    </div>
                    <div className="flex items-center mb-1 text-yellow-500 text-sm">
                      {[...Array(5)].map((_, i) =>
                        i < review.rating ? (
                          <FaStar key={i} />
                        ) : (
                          <FaRegStar key={i} className="text-gray-300" />
                        )
                      )}
                    </div>
                    <p className="text-gray-700 text-sm">{review.comment}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      Reviewed on: {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm text-center">No reviews yet. Be the first to leave one!</p>
          )}
        </div>

        {/* Write Review */}
        {!isOwner && userInfo && (
          <div className="p-6 md:p-8 border-t">
            <ReviewForm onReviewSubmitted={() => dispatch(fetchSkillById(id))} />
          </div>
        )}
      </div>

      {/* Custom Confirmation Modal (Placeholder) */}
      {showConfirmDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <p className="text-lg font-semibold mb-4">Confirm Deletion</p>
            <p className="mb-6">Are you sure you want to delete this skill? This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => setShowConfirmDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillDetail;
