import React, { useEffect, useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../services/AuthContext";
import { QuizContext } from "../services/QuizContext";

const PlayQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { questions, fetchQuizQuestions } = useContext(QuizContext);
  const {submit, submitQuizAnswers} = useContext(QuizContext);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState(null);
  const { user } = useContext(AuthContext); // Extract user from context
  const userId = user?.userId || localStorage.getItem("userId");

  useEffect(() => {
    fetchQuizQuestions(quizId);
  }, [fetchQuizQuestions, quizId]);

  const handleSubmit = async () => {
    try {
      const response = await submitQuizAnswers(quizId, userId, answers);
      console.log("Quiz submitted successfully:", response);
      setFeedback(response.data.feedback);

      navigate(`/quizDetails/${quizId}`);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      setFeedback("An error occurred while submitting the quiz.");
    }
  };

  return (
    <div>
      <h2>Play Quiz</h2>
      {questions.map((q) => (
        <div key={q.id}>
          <h4>{q.questionText}</h4>
          {q.options.map((option) => (
            <div key={option}>
              <label>
                <input
                  type="radio"
                  name={q.id}
                  value={option}
                  onChange={(e) =>
                    setAnswers({ ...answers, [q.id]: e.target.value })
                  }
                />
                {option}
              </label>
            </div>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit}>Submit</button>
      {feedback && <p>{feedback}</p>}
    </div>
  );
};

export default PlayQuiz;
