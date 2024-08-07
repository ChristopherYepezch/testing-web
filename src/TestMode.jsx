import React, { useState, useEffect } from 'react';
import { shuffle } from 'lodash';

const TestMode = ({ questions }) => {
  const [testQuestions, setTestQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(2 * 60 * 60); // 2 hours in seconds
  const [testEnded, setTestEnded] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
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
    calculateScore();
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    testQuestions.forEach((question, index) => {
      if (answers[index] === question.answer[0]) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getAnswerStatus = (index) => {
    if (!testEnded) return 'unanswered';
    if (!answers[index]) return 'incorrect';
    return answers[index] === testQuestions[index].answer[0] ? 'correct' : 'incorrect';
  };

  if (testQuestions.length === 0) {
    return <div>Cargando preguntas...</div>;
  }

  const currentQuestion = testQuestions[currentQuestionIndex];

  return (
    <div className="flex h-screen">
      <div className="w-3/4 p-4 overflow-y-auto">
        {!testEnded ? (
          <>
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
          </>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4">Resultados del Test</h2>
            <p className="text-lg mb-4">Tu puntuación: {score} de {testQuestions.length}</p>
            <p className="mb-4">Haz clic en los números para revisar las preguntas.</p>
            <div className="mt-4 p-4 bg-white rounded shadow">
              <h3 className="font-bold mb-2">{currentQuestion.question}</h3>
              <div className="space-y-2">
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded ${
                      option[0] === currentQuestion.answer[0]
                        ? 'bg-green-100 border-green-500 border'
                        : option[0] === answers[currentQuestionIndex]
                        ? 'bg-yellow-100 border-yellow-500 border'
                        : 'bg-gray-100'
                    }`}
                  >
                    {option}
                    {option[0] === currentQuestion.answer[0] && (
                      <span className="ml-2 text-green-600 font-bold">(Respuesta correcta)</span>
                    )}
                    {option[0] === answers[currentQuestionIndex] && (
                      <span className={`ml-2 font-bold ${
                        option[0] === currentQuestion.answer[0] ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        (Tu respuesta)
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="w-1/4 bg-gray-200 p-4 flex flex-col">
        <div className="text-xl font-bold mb-4">
          {!testEnded ? `Tiempo restante: ${formatTime(timeLeft)}` : 'Test Finalizado'}
        </div>
        <div className="flex flex-wrap justify-center mb-4">
          {testQuestions.map((_, index) => (
            <button
              key={index}
              onClick={() => navigateToQuestion(index)}
              className={`w-8 h-8 m-1 ${
                testEnded
                  ? getAnswerStatus(index) === 'correct'
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  : answers[index]
                  ? 'bg-blue-500 text-white'
                  : 'bg-white'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        {!testEnded && (
          <button
            onClick={endTest}
            className="mt-auto bg-red-500 text-white p-2 rounded"
          >
            Finalizar prueba
          </button>
        )}
      </div>
    </div>
  );
};

export default TestMode;