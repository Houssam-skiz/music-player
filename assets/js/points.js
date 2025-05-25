// Points management module
const points = (function() {
    const API_BASE = 'http://localhost:3000/api';
    const authToken = localStorage.getItem('authToken');

    // Get all quizzes
    async function getQuizzes() {
        try {
            const response = await fetch(`${API_BASE}/quizzes`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch quizzes');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching quizzes:', error);
            return [];
        }
    }

    // Create new quiz
    async function createQuiz(title) {
        try {
            const response = await fetch(`${API_BASE}/quizzes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ title })
            });

            if (!response.ok) {
                throw new Error('Failed to create quiz');
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating quiz:', error);
            return null;
        }
    }

    // Add points to student
    async function addPoints(quizId, studentUsername, points) {
        try {
            const response = await fetch(`${API_BASE}/points`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ quizId, studentUsername, points })
            });

            if (!response.ok) {
                throw new Error('Failed to add points');
            }

            return await response.json();
        } catch (error) {
            console.error('Error adding points:', error);
            return null;
        }
    }

    // Get student points
    async function getStudentPoints(studentId) {
        try {
            const response = await fetch(`${API_BASE}/students/${studentId}/points`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch student points');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching student points:', error);
            return [];
        }
    }

    // Initialize points module
    function init() {
        // Teacher dashboard initialization
        if (document.getElementById('quiz-form')) {
            const quizForm = document.getElementById('quiz-form');
            quizForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const title = document.getElementById('quiz-title').value;
                const quiz = await createQuiz(title);
                if (quiz) {
                    alert('Quiz created successfully!');
                    quizForm.reset();
                }
            });
        }

        // Student dashboard initialization
        if (document.querySelector('.points-container')) {
            const studentId = localStorage.getItem('userId');
            getStudentPoints(studentId).then(points => {
                const pointsContainer = document.querySelector('.points-container');
                pointsContainer.innerHTML = `
                    <div class="total-points">
                        <h3>Total Points: ${points.total}</h3>
                    </div>
                    <div class="points-breakdown">
                        ${points.details.map(detail => `
                            <div class="point-item">
                                <span>${detail.quizTitle}</span>
                                <span>${detail.points}</span>
                            </div>
                        `).join('')}
                    </div>
                `;
            });
        }
    }

    return {
        getQuizzes,
        createQuiz,
        addPoints,
        getStudentPoints,
        init
    };
})();

// Initialize points module on page load
document.addEventListener('DOMContentLoaded', points.init);
