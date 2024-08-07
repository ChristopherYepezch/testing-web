import React, { useState, useEffect } from 'react';
import { shuffle } from 'lodash';

const PracticeMode = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [practiceRange, setPracticeRange] = useState({ start: 1, end: questions.length });
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [isRandom, setIsRandom] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [incorrectQuestions, setIncorrectQuestions] = useState([]);
  const [reviewingIncorrect, setReviewingIncorrect] = useState(false);

  useEffect(() => {
    updateQuestionSet();
  }, [practiceRange, isRandom, questions]);

  const updateQuestionSet = () => {
    let selectedQuestions = questions.slice(practiceRange.start - 1, practiceRange.end);
    if (isRandom) {
      selectedQuestions = shuffle(selectedQuestions);
    }
    setCurrentQuestions(selectedQuestions);
    setCurrentQuestionIndex(0);
    setShowAnswer(false);
    setIsAnswered(false);
    setUserAnswer('');
  };

  const handleShowAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowAnswer(false);
      setIsAnswered(false);
      setUserAnswer('');
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowAnswer(false);
      setIsAnswered(false);
      setUserAnswer('');
    }
  };

  const handleRangeChange = (e) => {
    const { name, value } = e.target;
    setPracticeRange(prev => ({
      ...prev,
      [name]: parseInt(value, 10)
    }));
    updateQuestionSet();
  };

  const handleRandomToggle = () => {
    setIsRandom(!isRandom);
  };

  const handleAnswerSubmit = () => {
    setIsAnswered(true);
    setShowAnswer(true);
    if (userAnswer !== currentQuestions[currentQuestionIndex].answer) {
      setIncorrectQuestions([...incorrectQuestions, currentQuestions[currentQuestionIndex]]);
    }
  };

  const handleReviewIncorrect = () => {
    setReviewingIncorrect(true);
    setCurrentQuestions(incorrectQuestions);
    setCurrentQuestionIndex(0);
    setShowAnswer(false);
    setIsAnswered(false);
    setUserAnswer('');
  };

  const handleExitReview = () => {
    setReviewingIncorrect(false);
    updateQuestionSet();
  };

  const currentQuestion = currentQuestions[currentQuestionIndex];

  if (!currentQuestion) {
    return <div>No hay preguntas disponibles.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Modo Práctica</h2>
          <div className="flex space-x-4">
            {!reviewingIncorrect && (
              <>
                <label className="flex items-center">
                  Inicio:
                  <input
                    type="number"
                    name="start"
                    min="1"
                    max={questions.length}
                    value={practiceRange.start}
                    onChange={handleRangeChange}
                    className="ml-2 w-16 p-1 border rounded"
                  />
                </label>
                <label className="flex items-center">
                  Fin:
                  <input
                    type="number"
                    name="end"
                    min="1"
                    max={questions.length}
                    value={practiceRange.end}
                    onChange={handleRangeChange}
                    className="ml-2 w-16 p-1 border rounded"
                  />
                </label>
                <button
                  onClick={handleRandomToggle}
                  className={`px-4 py-2 rounded ${isRandom ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  {isRandom ? 'Aleatorio' : 'Secuencial'}
                </button>
              </>
            )}
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Pregunta {currentQuestionIndex + 1} de {currentQuestions.length}</h3>
          <p className="text-lg mb-4">{currentQuestion.question}</p>
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setUserAnswer(option[0])}
                className={`w-full text-left p-2 rounded ${
                  userAnswer === option[0] ? 'bg-blue-200' : 'bg-blue-100'
                } hover:bg-blue-200 transition-colors`}
              >
                {option}
              </button>
            ))}
          </div>
          {!isAnswered && (
            <button
              onClick={handleAnswerSubmit}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
              disabled={!userAnswer}
            >
              Enviar Respuesta
            </button>
          )}
          {isAnswered && (
            <div className={`mt-4 p-2 rounded ${userAnswer === currentQuestion.answer ? 'bg-green-100' : 'bg-red-100'}`}>
              <p className="font-bold">
                {userAnswer === currentQuestion.answer ? '¡Correcto!' : 'Incorrecto'}
              </p>
              <p>La respuesta correcta es: {currentQuestion.answer}</p>
            </div>
          )}
        </div>
        <div className="flex justify-between">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Anterior
          </button>
          <button
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === currentQuestions.length - 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Siguiente
          </button>
        </div>
        {!reviewingIncorrect && (
          <button
            onClick={handleReviewIncorrect}
            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded"
            disabled={incorrectQuestions.length === 0}
          >
            Repasar Preguntas Incorrectas ({incorrectQuestions.length})
          </button>
        )}
        {reviewingIncorrect && (
          <button
            onClick={handleExitReview}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
          >
            Salir del Repaso
          </button>
        )}
      </div>
    </div>
  );
};

export default PracticeMode;