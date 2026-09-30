import {useEffect, useState} from 'react';
import { API_URL } from './config';

function Test() {
    const [people, setPeople] = useState([]);
    const [personForm, setPersonForm] = useState({
        name: '',
        age: '',
        favoriteThing: ''
    });
    const [findIdInput, setFindIdInput] = useState('');
    const [addErrors, setAddErrors] = useState({});
    const [findError, setFindError] = useState('');
    const [addStatusMessage, setAddStatusMessage] = useState('');
    const [foundPerson, setFoundPerson] = useState(null);

    useEffect(() => {
        fetchPeople();
    }, []);

    const fetchPeople = async () => {
        try {
            const response = await fetch(`${API_URL}/person`);
            if (!response.ok) {
                setAddStatusMessage('Unable to load names right now. Please try again.');
                return;
            }

            const data = await response.json();
            setPeople(data);
        } catch {
            setAddStatusMessage('Unable to load names right now. Please check your connection and try again.');
        }
    };

    const validatePersonForm = () => {
        const nextErrors = {};
        const trimmedName = personForm.name.trim();
        const trimmedFavoriteThing = personForm.favoriteThing.trim();
        const parsedAge = Number.parseInt(personForm.age, 10);

        if (!trimmedName) {
            nextErrors.name = 'Name is required.';
        } else if (trimmedName.length < 2 || trimmedName.length > 40) {
            nextErrors.name = 'Name must be between 2 and 40 characters.';
        } else if (!/^[A-Za-z\-' ]+$/.test(trimmedName)) {
            nextErrors.name = 'Name can only include letters, spaces, hyphens, and apostrophes.';
        }

        if (!personForm.age.trim()) {
            nextErrors.age = 'Age is required.';
        } else if (Number.isNaN(parsedAge)) {
            nextErrors.age = 'Age must be a number.';
        } else if (parsedAge < 1 || parsedAge > 130) {
            nextErrors.age = 'Age must be between 1 and 130.';
        }

        if (!trimmedFavoriteThing) {
            nextErrors.favoriteThing = 'Favorite thing is required.';
        } else if (trimmedFavoriteThing.length < 2 || trimmedFavoriteThing.length > 80) {
            nextErrors.favoriteThing = 'Favorite thing must be between 2 and 80 characters.';
        }

        return nextErrors;
    };

    const parseErrorMessage = async (response, fallbackMessage) => {
        try {
            const data = await response.json();
            if (data?.message) {
                return data.message;
            }
        } catch {
            // Ignore parse errors and fall back to a safe, user-friendly message.
        }
        return fallbackMessage;
    };

    const handlePersonFormChange = (field, value) => {
        setPersonForm((prev) => ({
            ...prev,
            [field]: value
        }));
        setAddErrors((prev) => ({
            ...prev,
            [field]: ''
        }));
        setAddStatusMessage('');
    };

    const handleSubmitPerson = async (e) => {
        e.preventDefault();

        const validationErrors = validatePersonForm();
        if (Object.keys(validationErrors).length > 0) {
            setAddErrors(validationErrors);
            setAddStatusMessage('Please correct the form before submitting.');
            return;
        }

        setAddErrors({});
        setAddStatusMessage('');

        try {
            const response = await fetch(`${API_URL}/person`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: personForm.name.trim(),
                    age: Number.parseInt(personForm.age, 10),
                    favoriteThing: personForm.favoriteThing.trim()
                })
            });

            if (!response.ok) {
                let message = 'Unable to add person. Please try again.';
                try {
                    const errorPayload = await response.json();
                    if (errorPayload?.errors && typeof errorPayload.errors === 'object') {
                        setAddErrors(errorPayload.errors);
                    }
                    if (errorPayload?.message) {
                        message = errorPayload.message;
                    }
                } catch {
                    // Ignore parse errors and keep fallback message.
                }

                setAddStatusMessage(message);
                return;
            }

            const successPayload = await response.json();
            setAddStatusMessage(successPayload?.message || 'Person added successfully.');
            setPersonForm({
                name: '',
                age: '',
                favoriteThing: ''
            });
            await fetchPeople();
        } catch {
            setAddStatusMessage('Unable to add person right now. Please check your connection and try again.');
        }
    };

    const handleFindById = async (e) => {
        e.preventDefault();
        setFoundPerson(null);
        setFindError('');

        const parsedId = Number.parseInt(findIdInput, 10);
        if (!findIdInput.trim()) {
            setFindError('Please enter an ID.');
            return;
        }

        if (Number.isNaN(parsedId) || parsedId < 1) {
            setFindError('ID must be a positive number.');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/person/${parsedId}`);
            if (!response.ok) {
                const message = await parseErrorMessage(response, 'Unable to find a person with that ID.');
                setFindError(message);
                return;
            }

            const person = await response.json();
            setFoundPerson(person);
        } catch {
            setFindError('Unable to search right now. Please check your connection and try again.');
        }
    };

    return (
        <div className="App">
            <h1>Name Database</h1>

            <h2>Add a person:</h2>
            <form onSubmit={handleSubmitPerson} className="submission">
                <label>
                    Name
                    <input
                        type="text"
                        value={personForm.name}
                        placeholder="add a name..."
                        onChange={(e) => handlePersonFormChange('name', e.target.value)}
                    />
                </label>
                {addErrors.name && <p role="alert">{addErrors.name}</p>}

                <label>
                    Age
                    <input
                        type="number"
                        min="1"
                        max="130"
                        value={personForm.age}
                        placeholder="age"
                        onChange={(e) => handlePersonFormChange('age', e.target.value)}
                    />
                </label>
                {addErrors.age && <p role="alert">{addErrors.age}</p>}

                <label>
                    Favorite thing
                    <input
                        type="text"
                        value={personForm.favoriteThing}
                        placeholder="favorite thing"
                        onChange={(e) => handlePersonFormChange('favoriteThing', e.target.value)}
                    />
                </label>
                {addErrors.favoriteThing && <p role="alert">{addErrors.favoriteThing}</p>}

                <button type="submit">Add Person</button>
            </form>

            {addStatusMessage && <p role="status">{addStatusMessage}</p>}

            <h2>Find person by ID:</h2>
            <form onSubmit={handleFindById} className="submission">
                <label>
                    Person ID
                    <input
                        type="number"
                        min="1"
                        value={findIdInput}
                        placeholder="enter an ID"
                        onChange={(e) => {
                            setFindIdInput(e.target.value);
                            setFindError('');
                        }}
                    />
                </label>
                <button type="submit">Find Person</button>
            </form>

            {findError && <p role="alert">{findError}</p>}
            {foundPerson && (
                <div>
                    <h3>Person found:</h3>
                    <p>Name: {foundPerson.name}</p>
                    <p>Age: {foundPerson.age}</p>
                    <p>Favorite thing: {foundPerson.favoriteThing}</p>
                </div>
            )}

            <h2>Names:</h2>
            {people.length > 0 ? (
                people.map((person) => (
                    <ul key={person.id}>
                        <li>{person.name} (Age {person.age}) - Favorite thing: {person.favoriteThing}</li>
                    </ul>
                ))
            ) : (
                <p>No names found.</p>
            )}
        </div>
    );
}

export default Test;