import { useState, useEffect } from "react";
import { db, auth } from "./firebaseConnection";
import "./app.css";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'

function App() {
  const [titulo, setitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [idPost, setIdPost] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [user, setUser] = useState(false)
  const [userDetail, setUserDetail] = useState({})


  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function loadPosts() {
      const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
        let listaPosts = [];

        snapshot.forEach((doc) => {
          listaPosts.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          });
        });

        setPosts(listaPosts);
      });
    }
    loadPosts();
  }, []);

  useEffect(() => {
    async function checkLogin(){
      onAuthStateChanged(auth, (user) => {
        if(user){
          setUser(true)
          setUserDetail({
            uid: user.uid,
            email: user.email
          })
          
        } else {
          setUser(false)
          setUserDetail({})
        }
      })
    }
  }, [])

  async function handleAdd() {
    // await setDoc(doc(db, "posts", "12345"), {
    //   titulo: titulo,
    //   autor: autor
    // })
    // .then(() => {
    //   console.log("DADOS REGISTRADOS")
    // })
    // .catch((error) => {
    //   console.log("ERRO" + error)
    // })

    await addDoc(collection(db, "posts"), {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        console.log("DADOS REGISTRADOS");
        setitulo("");
        setAutor("");
      })
      .catch((error) => {
        console.log("Erro: " + error);
      });
  }

  async function buscarPost() {
    // const postRef = doc(db, "posts", "ekIBp8TPnwkYOULtC59m");
    // await getDoc(postRef)
    //   .then((snapshot) => {
    //     setitulo(snapshot.data().titulo);
    //     setAutor(snapshot.data().autor);
    //   })
    //   .catch((error) => {
    //     console.log("ERRO: " + error);
    //   });

    const postRef = collection(db, "posts");
    await getDocs(postRef)
      .then((snapshot) => {
        let lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          });
        });

        setPosts(lista);
      })
      .catch((error) => {
        console.log("ERRO: " + error);
      });
  }

  async function editarPost() {
    const docRef = doc(db, "posts", idPost);

    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        console.log("POST ATUALIZADO");
        setIdPost("");
        setAutor("");
        setitulo("");
      })
      .catch((error) => {
        console.log("ERRO: " + error);
      });
  }

  async function excluirPost(id) {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef)
      .then(() => {
        alert("POST DELETADO COM SUCESSO");
      })
      .catch((error) => {
        alert("Erro: " + error);
      });
  }

  async function novoUsuario(){
    await createUserWithEmailAndPassword(auth, email, senha)
    .then(() => {
      console.log("Cadastrado com sucesso")
      setEmail('')
      setSenha('')
    })
    .catch((error) => {
      if(error.code === 'auth/weak-password'){
        alert('Senha muito fraca.')
      } else if(error.code === 'auth/email-already-in-use'){
        alert("Email já existe")
      } else if(error.code === 'auth/invalid-email'){
        alert("Email inválido")
      }
    })
  }

  async function fazerLogout(id){
    await signOut(auth)
    setUser(false)
    setUserDetail({})
  }

  async function logarUsuario(){
    await signInWithEmailAndPassword(auth, email, senha)
    .then((value) => {
      console.log("User logado com sucesso")
      console.log(value.user)

      setUserDetail({
        uid: value.user.uid,
        email: value.user.email
      })
      setUser(true)

      setEmail('')
      setSenha('')
    })
    .catch(() => {
      console.log("Erro ao fazer login")
    })
  }

  return (
    <div>
      <h1>ReactJS + Firebase</h1>

      { user && (
        <div>
          <strong>Seja bemvindo(a)! Você está logado!</strong> <br/>
          <span>ID: {userDetail.uid} - EMAIL: {userDetail.email}</span><br/>
          <button onClick={fazerLogout}>Sair da conta</button><br/>
        </div>
      )}


      <div className="container">
        <h2>USUÁRIOS</h2>

        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite um email"
        />
        <label>Senha</label>
        <input
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Digite uma senha"
        />
        <button onClick={novoUsuario}>Cadastrar</button> <br/>
        <button onClick={logarUsuario}>Login</button>
      </div>
      <br/><br/>
      <hr />
      <div className="container">
      <h2>POSTS</h2>
        <label>Id do post</label>
        <input
          placeholder="Digite o ID do post"
          value={idPost}
          onChange={(e) => setIdPost(e.target.value)}
        />
        <br />

        <label>Título:</label>
        <textarea
          type="text"
          placeholder="Digite o texto"
          value={titulo}
          onChange={(e) => setitulo(e.target.value)}
        />
        <label>Autor:</label>
        <input
          type="text"
          placeholder="Autor do post"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
        />

        <button onClick={handleAdd}>Cadastrar</button>
        <button onClick={buscarPost}>Buscar post</button>
        <br />
        <button onClick={editarPost}>Editar post</button>

        <ul>
          {posts.map((post) => {
            return (
              <li key={post.id}>
                <strong>Id: {post.id}</strong> <br />
                <span>Titulo: {post.titulo}</span> <br />
                <span>Autor: {post.autor}</span> <br />
                <button onClick={() => excluirPost(post.id)}>Excluir</button>
                
                <br />
                <br />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
