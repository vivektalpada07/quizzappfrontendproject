import React, { createContext, useState } from "react";
import API from "../services/api"; // Corrected path for API service

const QuizContext = createContext(); // Removed redundant `export` as it's handled at the end

const QuizProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);

  const fetchQuizzes = async () => {
    try {
      const { data } = await API.get("/quizzes/all");
      setQuizzes(data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  const fetchQuizQuestions = async (quizId) => {
    try {
      const { data } = await API.get(`/questions/quiz/${quizId}`);
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching quiz questions:", error);
    }
  };

  const submitQuizAnswers = async (quizId, userId, answers) => {
    try {
      const response = await API.post(`/quizzes/${quizId}/user/${userId}/submit`, answers);
      return response.data; // Return the relevant response
    } catch (error) {
      console.error("Error submitting quiz answers:", error);
      throw error; // Re-throw error for further handling
    }
  };

  return (
    <QuizContext.Provider
      value={{ quizzes, fetchQuizzes, questions, fetchQuizQuestions, submitQuizAnswers }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export { QuizContext }; // Named export for QuizContext
export default QuizProvider; // Default export for QuizProvider
