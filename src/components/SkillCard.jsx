import React from 'react';
import { Link } from 'react-router-dom';

// Added showActions prop
const SkillCard = ({ skill, showActions = false }) => { // Default to false for broader reusability
  if (!skill) return null;

  const {
    _id,
    title,
    category,
    description,
    createdAt,
  } = skill;

  return (
    <div className="border rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-all duration-200">
      <h3 className="text-lg font-semibold text-indigo-700 mb-1 truncate">{title}</h3>
      <p className="text-sm text-gray-600 mb-1">Category: <span className="font-medium">{category}</span></p>
      <p className="text-sm text-gray-700 line-clamp-2">{description}</p>

      <div className="text-xs text-gray-400 mt-2">
        Created on: {new Date(createdAt).toLocaleDateString()}
      </div>

      <div className="mt-3 flex gap-2">
        <Link
          to={`/skills/${_id}`}
          className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
        >
          View
        </Link>
        {/* Conditionally render Edit link based on showActions prop */}
        {showActions && (
          <Link
            to={`/instructor/edit-skill/${_id}`}
            className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-sm"
          >
            Edit
          </Link>
        )}
      </div>
    </div>
  );
};

export default SkillCard;
