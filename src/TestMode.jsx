import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const TestMode = ({ questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [quizEnded, setQuizEnded] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !quizEnded) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !quizEnded) {
      endQuiz();
    }
  }, [timeLeft, quizEnded]);

  const handleAnswer = (selectedAnswer) => {
    const correct = selectedAnswer === questions[currentQuestion].answer;
    setIsCorrect(correct);
    setShowFeedback(true);
    if (correct) setScore(score + 1);
    
    setTimeout(() => {
      setShowFeedback(false);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(Math.floor(Math.random() * questions.length));
      } else {
        endQuiz();
      }
    }, 1000);
  };

  const endQuiz = () => {
    setQuizEnded(true);
  };

  if (quizEnded) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">¡Cuestionario terminado!</h2>
        <p className="text-lg">Tiempo restante: {timeLeft} segundos</p>
        <p className="text-lg">Puntuación: {score} de {questions.length}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Pregunta {currentQuestion + 1}</h2>
          <div className="text-lg font-semibold">Tiempo: {timeLeft}s</div>
        </div>
        <p className="text-lg mb-4">{questions[currentQuestion].question}</p>
        <div className="space-y-2">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option[0])}
              className="w-full text-left p-2 rounded bg-blue-100 hover:bg-blue-200 transition-colors"
            >
              {option}
            </button>
          ))}
        </div>
        {showFeedback && (
          <Alert className={`mt-4 ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
            {isCorrect ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertTitle>{isCorrect ? '¡Correcto!' : 'Incorrecto'}</AlertTitle>
            <AlertDescription>
              {isCorrect ? '¡Bien hecho!' : `La respuesta correcta era: ${questions[currentQuestion].answer}`}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default TestMode;