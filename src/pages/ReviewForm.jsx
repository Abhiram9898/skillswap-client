import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addReview } from '../redux/reviewSlice';
import { useParams } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const ReviewForm = ({ onReviewSubmitted }) => {
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
  });

  const dispatch = useDispatch();
  const { id: skillId } = useParams();
  const { loading, error } = useSelector((state) => state.reviews);
  const { userInfo } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInfo) return;

    dispatch(
      addReview({
        skillId,
        rating: Number(formData.rating),
        comment: formData.comment,
      })
    )
      .unwrap()
      .then(() => {
        onReviewSubmitted?.();
        setFormData({ rating: 5, comment: '' });
      })
      .catch((err) => console.error('Review submission failed:', err));
  };

  return (
    <div className="mt-8 p-6 bg-white/70 rounded-xl shadow-lg backdrop-blur-md border border-gray-200">
      <h4 className="text-2xl font-semibold text-gray-800 mb-4">Write a Review ✍️</h4>

      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 text-sm">{error}</div>
      )}

      {!userInfo ? (
        <p className="text-gray-600 italic text-sm">
          Please log in to submit a review.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Star Rating */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
  type="button"
  disabled={loading}
  onClick={() => setFormData({ ...formData, rating: star })}
  className={`text-2xl transition-transform duration-150 ${
    formData.rating >= star ? 'text-yellow-400 scale-110' : 'text-gray-300'
  } ${loading ? 'cursor-not-allowed opacity-60' : ''}`}
>
                  <FaStar />
                </button>
              ))}
            </div>
          </div>

          {/* Comment Box */}
          <div>
            <label
              htmlFor="comment"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Your Comment
            </label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
              rows="4"
              placeholder="Share your experience..."
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-semibold rounded-md shadow-md transition duration-300 ${
              loading
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
            }`}
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ReviewForm;
