// DOM queries
const note = document.querySelector('.note');
const noteContent = note.querySelector('.note-content');
const noteClosing = note.querySelector('.note-closing');
const loading = document.querySelector('.loading');

// Event listener for closing the note
noteClosing.addEventListener('click', function() {
    note.classList.add('pre');
});

// Function to get a random action
function getRandomAction() {
    const actions = [
        'what is the one thing you cannot live without',
        'give fashion advice based on your taste',
        'describe your dream vacation destination',
        'what is the best piece of advice you have ever received',
        'who is your best friend',
        'what is your favourite way to relax'
    ];

    const randIdx = Math.floor(Math.random() * actions.length);
    return actions[randIdx];
}

// Function to get character description from the data attribute
function getCharacterDescription(character) {
    const characterElement = document.querySelector(`[data-character="${character}"]`);
    if (characterElement) {
        return characterElement.dataset.description;
    }
    return '';
}

// Function to fetch data from AI
async function fetchDataFromAI(character, action) {
    try {
        const response = await fetch(_CONFIG_.API_BASE_URL + '/chat/completions', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${_CONFIG_.API_KEY}`,
            },
            method: 'POST',
            body: JSON.stringify({
                model: _CONFIG_.GPT_MODEL,
                messages: [
                    {
                        role: 'user',
                        content: `You are ${character} and should ${action} in a maximum of 100 characters without breaking character`
                    },
                ]
            })
        });

        const jsonData = await response.json();
        return jsonData.choices[0].message.content;
    } catch (error) {
        console.error('Error occurred:', error);
        throw error;
    }
}

// Function to play character
async function playCharacter(character) {
    loading.classList.remove('pre');
    const action = getRandomAction();

    try {
        const content = await fetchDataFromAI(character, action);

        noteContent.innerHTML = `
            <h2>${character}</h2>
            <p>${content}</p>
            <code>Character: ${character}, Action: ${action}</code>
        `;
    } catch (error) {
        noteContent.innerHTML = '<h2>Error</h2><p>An error occurred while fetching data from the AI model.</p>';
    } finally {
        note.classList.remove('pre');
        loading.classList.add('pre');
    }
}

// Function to show character description on hover
function showCharacterDescription(description) {
    const descriptionBox = document.createElement('div');
    descriptionBox.className = 'description-box';
    descriptionBox.textContent = description;

    const characterDescriptions = document.querySelectorAll('.character-descriptions');
    characterDescriptions.forEach((desc) => {
        if (desc.contains(descriptionBox)) {
            desc.removeChild(descriptionBox);
        } else {
            desc.appendChild(descriptionBox);
        }
    });
}

// Function to initialize the event listeners
function init() {
    const charactersContainer = document.querySelector('.characters');
    
    // Click event on characters to play character
    charactersContainer.addEventListener('click', (event) => {
        const characterElement = event.target.closest('.character');
        if (characterElement) {
            const character = characterElement.dataset.character;
            playCharacter(character);
        }
    });

    // Mouseover event on characters to show character description
    charactersContainer.addEventListener('mouseover', (event) => {
        const characterElement = event.target.closest('.character');
        if (characterElement) {
            const character = characterElement.dataset.character;
            const characterDescription = getCharacterDescription(character);
            showCharacterDescription(characterDescription);
        }
    });

    // Mouseout event to hide character description
    charactersContainer.addEventListener('mouseout', () => {
        showCharacterDescription('');
    });
}

// Initialize the app
init();
