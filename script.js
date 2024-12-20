const noteBoard = document.querySelector('#notes-board');
const addTextBtn = document.querySelector('#add-note-btn');
const clearBtn = document.querySelector('#clear-all-btn');
//removed list button

let noteId=1;

const clear_all_btn = document.getElementById('clear-all-btn');

//start
let newX = 0, newY = 0;
let startX = 0;
let startY = 0;

//set the current note to null
let currentNote = null;

clear_all_btn.addEventListener('click' , function (){
    localStorage.removeItem('notes');
    window.location.reload();
})
//added code to remove notes from local storage so page is cleared when reloaded

function createNote(){
    const notePad = document.getElementById('notes-board');
    //create a note 
    const note = document.createElement('div');
    note.className='note';
    note.id='note'+noteId;


    //Testing for the abilty to move notes
    note.style.position = 'absolute';//can be deleted after setting poistion in styles to aboulte
    note.style.display = 'block';//can be deleted

    //clear button
    const clearButton = document.createElement('span');
    clearButton.className = 'clear-button';
    clearButton.innerHTML = '&times;';
    clearButton.onclick = function(){
        notePad.removeChild(note);
        saveNotes();
    }

    //moveable button
    const MoveableButton = document.createElement('span');
    MoveableButton.className = 'moveable-button';
    MoveableButton.innerHTML = '+';
    MoveableButton.onclick = function(){
        if(note.classList.contains('moveable')){
            note.classList.remove('moveable');
        }
        else{
            note.classList.add('moveable');
        }
    }
    
    //set the note content
    const noteContent = document.createElement('div');
    noteContent.contentEditable = true;
    noteContent.className = 'note-content';
    noteContent.innerHTML = 'Click to Edit';

    //edit content on the note
    noteContent.addEventListener('click',function(){
        noteContent.innerHTML='';
    });

    //Add clear, moveable, content to the note
    note.appendChild(clearButton);
    note.appendChild(MoveableButton);
    note.appendChild(noteContent);
    //add note to notePad
    notePad.appendChild(note);
    noteBoard.appendChild(note);

    //[WIP] to set the color of the note
    applyColor(note);

    //add event lisiner to note
    note.addEventListener('mousedown',mouseDown);

    //every time a new note is added increase id by 1
    noteId += 1;
    saveNotes();
}

//saves the notes to local storage
function saveNotes(){
    const notes=noteBoard.querySelectorAll('.note');
    const savedNotes=[];

    notes.forEach((note)=>{
        savedNotes.push({
            id:note.id,
            content:note.querySelector('.note-content').innerHTML,
            color: note.style.backgroundColor
        });
    });
    localStorage.setItem('notes',JSON.stringify(savedNotes));
}

//load notes from local storage
function loadNotes(){
    const savedNotes=JSON.parse(localStorage.getItem('notes'))||[];

    savedNotes.forEach((note) => {
        const existingNote=document.getElementById(note.id);

        if (existingNote) {
            existingNote.querySelector('.note-content').innerHTML=note.content;
            existingNote.style.backgroundColor=note.color;
        } else{
            const notePad=document.getElementById('notes-board');
            const newNote=document.createElement('div');
            newNote.className='note';
            newNote.id=note.id;
            newNote.style.backgroundColor=note.color;

            const clearButton=document.createElement('span');
            clearButton.className='clear-button';
            clearButton.innerHTML='&times;';
            clearButton.onclick=function() {
                notePad.removeChild(newNote);
                saveNotes();
            };

            const noteContent=document.createElement('div');
            noteContent.contentEditable=true;
            noteContent.className='note-content';
            noteContent.innerHTML=note.content;

            newNote.appendChild(clearButton);
            newNote.appendChild(noteContent);
            notePad.appendChild(newNote);
        }
    });
}

//calls loadNotes to load notes from local storage
document.addEventListener('DOMContentLoaded', loadNotes);

function mouseDown(event){
    //set the staring x and y to the cursor x and y
    startX = event.clientX;
    startY = event.clientY;

    //set what is being clicked to clickedElement
    let clickedElement = event.target;

    //Check if the element that is being clicked on is has the class note
    if(clickedElement.className == 'note'){
        currentNote = clickedElement;
    }

    // For Debugging
    //console.log('Mouse is down', startX, startY,clickedElement, currentNote)
    document.addEventListener('mousemove', mouseMove)
    document.addEventListener('mouseup',mouseUp);
}

function mouseMove(event) {
    newX = startX - event.clientX;
    newY = startY - event.clientY;

    startX = event.clientX;
    startY = event.clientY;

    if(currentNote != null){
        currentNote.style.top = (currentNote.offsetTop - newY) + 'px';
        currentNote.style.left = (currentNote.offsetLeft - newX) + 'px';

    console.log('Mouse is down', currentNote.style.top, currentNote.style.left)
    }

}

function mouseUp(){
    currentNote = null;
    document.removeEventListener('mousemove',mouseMove);
}

function applyColor(note){
    const color = '#FFCC00';
    note.style.backgroundColor = color;
}