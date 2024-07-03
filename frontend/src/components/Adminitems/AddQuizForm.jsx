import React, { useState } from 'react';
import axios from 'axios';
import { addQuizQuestions } from '../../Redux/AdminReducer/action';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AddQuizForm = () => {
    const [questions, setQuestions] = useState([
        { question: '', options: ['', '', '', ''], correctAnswerIndex: 0 }
    ]);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleQuestionChange = (index, key, value) => {
        const newQuestions = [...questions];
        newQuestions[index][key] = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].options[optionIndex] = value;
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswerIndex: "0" }]);
    };

    const handleSave = async () => {
        try {
            dispatch(addQuizQuestions({ questions: questions }));
            setQuestions([{ question: '', options: ['', '', '', ''], correctAnswerIndex: "0" }]);
        } catch (error) {
            console.error('Error saving quiz:', error);
            alert('Failed to save quiz. Please try again.');
        }
    };

    const handleCancel = () => {
        // Optionally implement cancel functionality, e.g., clear form or navigate away
        setQuestions([{ question: '', options: ['', '', '', ''], correctAnswerIndex: 0 }]);
    };

    return (
        <div className='' style={{ paddingTop: '100px' }}>
            <h2>Add Quiz</h2>
            <form>
                {questions.map((question, questionIndex) => (
                    <div key={questionIndex} className="question-container">
                        <div className="question-row">
                            <label>Question {questionIndex + 1}:</label>
                            <input
                                type="text"
                                value={question.question}
                                onChange={(e) => handleQuestionChange(questionIndex, 'question', e.target.value)}
                            />
                        </div>
                        <div className="option-row">
                            {question.options.map((option, optionIndex) => (
                                <input
                                    key={optionIndex}
                                    type="text"
                                    value={option}
                                    onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                                    placeholder={`Option ${optionIndex + 1}`}
                                />
                            ))}
                            <input
                                type="number"
                                value={question.correctAnswerIndex}
                                onChange={(e) => handleQuestionChange(questionIndex, 'correctAnswerIndex', parseInt(e.target.value, 10))}
                                placeholder="Correct Answer Index"
                            />
                        </div>
                    </div>
                ))}
                <button type="button" onClick={addQuestion} style={{ marginRight: '10px', border: '1px solid black' }}>Add Question</button>
                <button type="button" onClick={handleSave} style={{ marginRight: '10px', border: '1px solid black' }}>Save</button>
                <button type="button" onClick={handleCancel} style={{ border: '1px solid black' }}>Cancel</button>


            </form>
        </div>
    );
};

export default AddQuizForm;
