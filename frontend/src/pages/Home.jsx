import {useState, useEffect} from "react"
import api from "../api"

function Home() {
    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState("")
    const [title, setTitle] = useState("")

    useEffect(() => {
        getNotes();
    }, [])

    const getNotes = () => {
        api.get("/api/notes/")
        .then((res) => res.data)
        .then((data) => {setNotes(data); console.log(data) })
        .catch((err) => alert(err));
    }
    
    const deleteNote = () => {
        api.delete(`/api/notes/delete/${id}/`)
        .then((res) => {
            if (res.status === 204) alert("Note deleted!");
            else alert("Failed to delete note.");
            getNotes(); // 노트 목록을 한 번 더 불러서 노트 목록이 표시된 화면을 업데이트함
        })
        .catch((error) => alert(error));
        
    }

    const createNote = (e) => {
        e.preventDefault()
        api.post("/api/notes/", {content , title})
        .then((res) => {
            if (res.status === 201) alert("Note created!");
            else alert("Failed to create note");
            getNotes(); // 마찬가지로 노트 생성 이후 노트 목록을 업데이트해서 반영
        })
        .catch((error) => alert(error))
        
    }

    return <div>
        <div>
            <h2>Notes</h2>
        </div>
        <h2>Create a Note</h2>
        <form onSubmit={createNote}>
            <label htmlFor="title">Title:</label>
            <br/>
            <input 
                type="text" 
                id="title" 
                name="title" 
                required onChange={(e) => setTitle(e.target.value)}
                value={title}
            />
            <label htmlFor="content">Content:</label>
            <br/>
            <textarea 
                id="content" 
                name="content" 
                required value={content} 
                onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <br/>
            <input type="submit" value="Submit"></input>
        </form>
    </div>
}

export default Home