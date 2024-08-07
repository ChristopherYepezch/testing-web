import React, { useState, useEffect } from 'react';
import { shuffle } from 'lodash';

const TestMode = ({ questions }) => {
  const [testQuestions, setTestQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(2 * 60 * 60); // 2 hours in seconds
  const [testEnded, setTestEnded] = useState(false);

  useEffect(() => {
    // Select and shuffle 60 random questions
    const shuffledQuestions = shuffle(questions).slice(0, 60);
    setTestQuestions(shuffledQuestions);
  }, [questions]);

  useEffect(() => {
    if (timeLeft > 0 && !testEnded) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endTest();
    }
  }, [timeLeft, testEnded]);

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [currentQuestionIndex]: answer });
  };

  const navigateToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const endTest = () => {
    setTestEnded(true);
    // Here you would typically submit the answers or calculate the score
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (testQuestions.length === 0) {
    return <div>Cargando preguntas...</div>;
  }

  if (testEnded) {
    return <div>La prueba ha terminado. Tu puntuación: {/* Calculate and display score */}</div>;
  }

  const currentQuestion = testQuestions[currentQuestionIndex];

  return (
    <div className="flex h-screen">
      <div className="w-3/4 p-4">
        <h2 className="text-2xl font-bold mb-4">Pregunta {currentQuestionIndex + 1}</h2>
        <p className="mb-4">{currentQuestion.question}</p>
        <div className="space-y-2">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option[0])}
              className={`w-full text-left p-2 rounded ${
                answers[currentQuestionIndex] === option[0] ? 'bg-blue-200' : 'bg-gray-100'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="w-1/4 bg-gray-200 p-4 flex flex-col">
        <div className="text-xl font-bold mb-4">Tiempo restante: {formatTime(timeLeft)}</div>
        <div className="flex flex-wrap justify-center mb-4">
          {testQuestions.map((_, index) => (
            <button
              key={index}
              onClick={() => navigateToQuestion(index)}
              className={`w-8 h-8 m-1 ${
                answers[index] ? 'bg-blue-500 text-white' : 'bg-white'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button
          onClick={endTest}
          className="mt-auto bg-red-500 text-white p-2 rounded"
        >
          Finalizar prueba
        </button>
      </div>
    </div>
  );
};

export default TestMode;