import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createSkill } from '../redux/skillSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateSkillPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [pricePerHour, setPricePerHour] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !category.trim() || !pricePerHour) {
      toast.error('All fields are required');
      return;
    }

    if (pricePerHour <= 0) {
      toast.error('Price per hour must be a positive number');
      return;
    }

    try {
      await dispatch(
        createSkill({ title, description, category, pricePerHour: Number(pricePerHour) })
      ).unwrap();

      toast.success('✅ Skill created!');
      navigate('/instructor/my-skills');
    } catch (err) {
      toast.error(err?.message || '❌ Failed to create skill');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">✏️ Create Skill</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Skill Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          placeholder="Skill Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
          rows={4}
          required
        />

        <input
          type="text"
          placeholder="Category (e.g., Programming)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="number"
          placeholder="Price Per Hour"
          value={pricePerHour}
          onChange={(e) => setPricePerHour(e.target.value)}
          className="w-full border p-2 rounded"
          min="1"
          step="0.01"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateSkillPage;
