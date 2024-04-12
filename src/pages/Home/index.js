import { useState } from "react"
import './home.css'
import { Link } from "react-router-dom";
import { auth } from '../../firebaseConnection'

export default function Home(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleLogin(e){
      e.preventDefault();

      if(email !== '' && password !== ''){
        alert('teste')
      }else{
        alert('Preencha todos os campos!')
      }

      
    }

    return(
      <div className="home-container">
        <h1>Lista de Tarefas</h1>
        <span>Gerencie sua agenda de forma fácil.</span>

        <form className="form" onSubmit={handleLogin}>
            <input 
                type="text"
                placeholder="Digite seu email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input 
                type="password"
                placeholder="*********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">Acessar</button>
        </form>

        <Link className="button-link" to="/register">
          Não possui conta? Cadastre-se.
        </Link>
      </div>
    )
  }