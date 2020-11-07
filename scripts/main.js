window.addEventListener('DOMContentLoaded', (event) => {
  let isModalActive = false;
  const notesList = [];

  const mainModal = document.getElementById('modal');
  const addNoteBtn = document.getElementById('addButton');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const createNoteBtn = document.getElementById('addNoteBtn');


  const createNote = () => {
    const noteTitle = document.getElementById('noteTitle');
    const noteContent = document.getElementById('noteContent');

    // Single Note Model
    const newNote = {
      title: noteTitle.value,
      content: noteContent.value,
      date: Date.now()
    }

    notesList.push(newNote);
    console.log(notesList);
  }


  const toggleModal = () => {
    isModalActive = !isModalActive;
    mainModal.classList.toggle('hidden');

    if (isModalActive) {
      createNoteBtn.addEventListener('click', createNote);
    } else {
      createNoteBtn.removeEventListener('click', createNote)
    }
  }
  
  addNoteBtn.addEventListener('click', toggleModal);
  closeModalBtn.addEventListener('click', toggleModal);
});