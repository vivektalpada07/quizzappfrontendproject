import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const QuizList = () => {
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [quizzes, setQuizzes] = useState([]); // State for quizzes

  useEffect(() => {
    setLoading(true);
    API.get('/all') // Endpoint to fetch quizzes
      .then((response) => {
        setQuizzes(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching quizzes:', error);
        setError('Failed to load quizzes. Please try again later.');
        setLoading(false);
      });
  }, []);

  const currentDate = new Date();

  // Categorize quizzes
  const ongoingQuizzes = quizzes.filter(
    (quiz) =>
      new Date(quiz.startDate) <= currentDate && new Date(quiz.endDate) >= currentDate
  );

  const upcomingQuizzes = quizzes.filter(
    (quiz) => new Date(quiz.startDate) > currentDate
  );

  const pastQuizzes = quizzes.filter(
    (quiz) => new Date(quiz.endDate) < currentDate
  );

  if (loading) {
    return <p>Loading quizzes...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  const renderTable = (quizList, title, showPlayButton = false, showEditButton = false) => (
    <section className="quiz-section">
      <h3>{title}</h3>
      {quizList.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Difficulty</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>View Questions</th> {/* Added a column for viewing questions */}
              {showPlayButton && <th>Play</th>}
              {showEditButton && <th>Edit</th>}
            </tr>
          </thead>
          <tbody>
            {quizList.map((quiz) => (
              <tr key={quiz.id}>
                <td>{quiz.id}</td>
                <td>
                  <Link to={`/dashboard/quizzes/${quiz.id}`}>{quiz.name}</Link> {/* Make the quiz name clickable */}
                </td>
                <td>{quiz.category || 'N/A'}</td>
                <td>{quiz.difficulty || 'N/A'}</td>
                <td>{quiz.startDate ? new Date(quiz.startDate).toLocaleString() : 'N/A'}</td>
                <td>{quiz.endDate ? new Date(quiz.endDate).toLocaleString() : 'N/A'}</td>
                <td>
                  <Link to={`/dashboard/quizzes/${quiz.id}/questions`} className="view-questions-button">
                    View Questions
                  </Link>
                </td>
                {showPlayButton && (
                  <td>
                    <Link to={`/play/${quiz.id}`} className="play-button">
                      Play
                    </Link>
                  </td>
                )}
                {showEditButton && (
                  <td>
                    <Link to={`/dashboard/edit-quiz/${quiz.id}`} className="edit-button">
                      Edit
                    </Link>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No {title.toLowerCase()} available.</p>
      )}
    </section>
  );

  return (
    <div className="quiz-list-container">
      <h2>Quiz List</h2>
      {/* Render categorized quizzes */}
      {renderTable(ongoingQuizzes, 'Ongoing Quizzes', true, true)}
      {renderTable(upcomingQuizzes, 'Upcoming Quizzes', false, true)}
      {renderTable(pastQuizzes, 'Past Quizzes', false, false)}
    </div>
  );
};

export default QuizList;
