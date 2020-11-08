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

    if (typeof validateNoteTitle(noteTitle.value) === 'string') {
      generateError({
        titleError: validateNoteTitle(noteTitle.value)
      }, [noteTitle])
      return;
    } else {
      resetFields(
        ['titleError'],
        [noteTitle]
      )
    }
    
    if (typeof validateNoteContent(noteContent.value) === 'string') {
      generateError({
        contentError: validateNoteContent(noteContent.value)
      }, [noteContent])
      return;
    } else {
      resetFields(
        ['contentError'],
        [noteContent]
      )
    }

    // Single Note Model
    const newNote = {
      title: noteTitle.value,
      content: noteContent.value,
      date: Date.now()
    }

    notesList.push(newNote);

    noteTitle.value = '';
    noteContent.value = '';

    toggleModal();
  }

  const resetFields = (fields, inputs) => {
    fields.forEach((fieldId) => {
      document.getElementById(fieldId).innerText = ''
    })

    inputs.forEach((inputId) => {
      inputId.style.borderColor = '#14274e'
    })
  }

  const validateNoteTitle = (title) => {
    if (title) {
      if (title.length <= 20) {
        return true;
      } else {
        return 'Field should have max 20 chars.'
      }
    } else {
      return 'Field is required';
    }
  }

  const validateNoteContent = (content) => {
    return !!content.trim() || 'Field is requierd'
  }

  const generateError = (fields, inputs) => {
    Object.keys(fields).forEach((key) => {
      const errorField = document.getElementById(key);
      errorField.innerText = fields[key];
    })

    inputs.forEach((input) => {
      input.style.borderColor = 'red'
    })
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