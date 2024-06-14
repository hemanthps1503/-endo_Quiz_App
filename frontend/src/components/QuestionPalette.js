import React from 'react';

const QuestionPalette = ({ questions, answers, markedForReview, selectQuestion }) => {
  const getPaletteColor = (index) => {
    if (markedForReview[index]) {
      return 'bg-blue-600';
    }
    if (answers[index]) {
      return 'bg-green-600';
    }
    return 'bg-red-600';
  };

  return (
    <div className="flex space-x-2 overflow-x-auto p-2 bg-white rounded-lg shadow justify-center">
      {questions.map((_, index) => (
        <div
          key={index}
          className={`flex items-center justify-center w-8 h-8 rounded-full cursor-pointer ${getPaletteColor(index)}`}
          onClick={() => selectQuestion(index)}
        >
          {index + 1}
        </div>
      ))}
    </div>
  );
};

export default QuestionPalette;
