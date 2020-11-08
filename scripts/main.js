window.addEventListener('DOMContentLoaded', () => {
  const savedNotes = localStorage.getItem('notesList');
  let notesList = savedNotes ? JSON.parse(savedNotes) : [];
  let isModalActive = false;

  const mainModal = document.getElementById('modal');
  const addNoteBtn = document.getElementById('addButton');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const createNoteBtn = document.getElementById('addNoteBtn');
  const searchInput = document.getElementById('searchInput');
  
  searchInput.addEventListener('keyup', ($event) => {
    const query = $event.target.value.toLocaleLowerCase();

    if (query.length > 3) {
      const filteredNotes = notesList.filter((note) => {
        return note.title.toLocaleLowerCase().includes(query) || note.content.toLocaleLowerCase().includes(query);
      })

      renderNotes(filteredNotes);
    } else {
      renderNotes()
    }
  });

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

    saveNotesToStorage();

    renderNotes();
    toggleModal();
  }

  
  const renderNotes = (allNotes = notesList) => {
    const notesContainer = document.querySelector('.notes-box__container');
  
    if (notesList.length === 0) {
      notesContainer.innerHTML = ` 
        <p class="font-size--xl">You have no notes</p>
      `
    } else {
      let notesTemplate = '';
  
      allNotes.forEach((note) => {
         const noteTemplate = `
          <div
            data-id="${note.date}"
            class="notes-box__note"
          >
            <h3 class="font-size--md font-weight--light">${note.title}</h3>
            <p class="notes-box__content font-weight--light font-size--xs">${note.content}</p>
            <button
              class="notes-box__remove-btn"
            >
              <i class="far fa-trash-alt"></i>
            </button>
          </div>
        `
        notesTemplate = notesTemplate + noteTemplate;
      });
      notesContainer.innerHTML = notesTemplate;
  
      // Html template was rendered
      const allRemoveBtns = document.querySelectorAll('.notes-box__remove-btn');
      allRemoveBtns.forEach((nodeBtn) => {
        nodeBtn.addEventListener('click', removeNote)
      })

      document.querySelectorAll('.notes-box__note').forEach((noteItem) => {
        noteItem.addEventListener('dblclick', ($event) => {
          const noteId = $event.target.getAttribute('data-id');

          const editedNote = notesList.find((note) => note.date.toString() === noteId);

          const mainApp = document.querySelector('body');

          const modalTemplate = `
            <div
              id="edit-modal" 
              class="modal__overlay d-flex justify-center align-center"
            >
              <div class="modal__container">
                <button
                  id="closeEditModal" 
                  class="modal__close-btn d-flex align-center justify-center"
                >
                  <i class="fas fa-times"></i>
                </button>
          
                <h2 class="modal__header font-size--md font-weight--light">Edit your note</h2>
          
                <form class="modal__form">
                  <div class="modal__form-control"> 
                    <label 
                      for="noteTitle"
                      class="font-size--xs"
                    >
                      Note Title
                    </label>
                    <input
                      class="width-100" 
                      type="text"
                      name="title" 
                      id="noteTitleEdit"
                      placeholder="max 20 chars..."
                    >
                    <p
                      id="titleError"
                      class="error font-size--xxs font-weight--light"
                    >
                    </p>
                  </div>
          
                  <div class="modal__form-control"> 
                    <label 
                      for="noteContent"
                      class="font-size--xs"
                    >
                      Note Content
                    </label>
                    <textarea
                      class="modal__note width-100" 
                      type="text"
                      name="title" 
                      id="noteContentEdit"
                    ></textarea>
                    <p
                      id="contentError"
                      class="error font-size--xxs font-weight--light"
                    >
                    </p>
                  </div>
                </form>
          
                <button
                  id="editBtn"
                  class="notes-box__add-btn color--primary d-flex align-center justify-center"
                >
                  <i class="fas fa-plus color--secondary"></i>
                </button>
              </div>
            </div>
          `
          const modalBoxContainer = document.createElement('div');

          modalBoxContainer.classList.add('edit-modal-container');
          modalBoxContainer.innerHTML = modalTemplate;

          mainApp.appendChild(modalBoxContainer);

          const newTitle = document.getElementById('noteTitleEdit');
          newTitle.value = editedNote.title

          const newContent = document.getElementById('noteContentEdit');
          newContent.value = editedNote.content;

          document.getElementById('editBtn').addEventListener('click', () => {
            editNote(noteId, newTitle.value, newContent.value)

            console.log(notesList)
            renderNotes();
          });
        })
      })
    }
  }

  const editNote = (id, title, content) => {
    notesList = notesList.map((note) => {
      if (note.date.toString() === id) {
        return {
          ...note,
          title: title,
          content: content,
        }
      }
      return note;
    })
  }

  const saveNotesToStorage = (allNotes = notesList) => {
    localStorage.setItem('notesList', JSON.stringify(allNotes));
  }

  const removeNote = ($event) => {
    const removeBtn = $event.target;
    const singleNote = removeBtn.parentNode.parentNode;
    const noteId = singleNote.getAttribute('data-id');
   
    notesList = notesList.filter((note) => note.date.toString() !== noteId);
  
    renderNotes();
    saveNotesToStorage();
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

  renderNotes();
});