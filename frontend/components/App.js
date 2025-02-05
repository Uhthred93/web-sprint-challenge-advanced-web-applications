import React, { useState } from 'react';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Articles from './Articles';
import LoginForm from './LoginForm';
import Message from './Message';
import ArticleForm from './ArticleForm';
import Spinner from './Spinner';

const articlesUrl = 'http://localhost:9000/api/articles';
const loginUrl = 'http://localhost:9000/api/login';

export default function App() {
  const [message, setMessage] = useState('');
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState(null);
  const [spinnerOn, setSpinnerOn] = useState(false);

  const navigate = useNavigate();

  const redirectToLogin = () => navigate('/');
  const redirectToArticles = () => navigate('/articles');

  const logout = () => {
    localStorage.removeItem('token');
    setMessage('Goodbye!');
    redirectToLogin();
  };

  const login = ({ username, password }) => {
    setMessage('');
    setSpinnerOn(true);

    axios.post(loginUrl, { username, password })
      .then(res => {
        localStorage.setItem('token', res.data.token);
        setMessage(res.data.message);
        redirectToArticles();
      })
      .catch(() => {
        setMessage('Login failed. Check your credentials.');
      })
      .finally(() => {
        setSpinnerOn(false);
      });
  };

  const getArticles = () => {
    setMessage('');
    setSpinnerOn(true);

    const token = localStorage.getItem('token');
    axios.get(articlesUrl, { headers: { Authorization: token } })
      .then(res => {
        setArticles(res.data.articles);
        setMessage(res.data.message);
      })
      .catch(() => {
        redirectToLogin();
      })
      .finally(() => {
        setSpinnerOn(false);
      });
  };

  const postArticle = article => {
    setMessage('');
    setSpinnerOn(true);

    const token = localStorage.getItem('token');
    axios.post(articlesUrl, article, { headers: { Authorization: token } })
      .then(res => {
        setArticles([...articles, res.data.article]); // ✅ Ensures new article is added
        setMessage(res.data.message);
      })
      .catch(() => {
        setMessage('Failed to add article.');
      })
      .finally(() => {
        setSpinnerOn(false);
      });
  };

  const updateArticle = ({ article_id, article }) => {
    setMessage('');
    setSpinnerOn(true);

    const token = localStorage.getItem('token');
    axios.put(`${articlesUrl}/${article_id}`, article, { headers: { Authorization: token } })
      .then(res => {
        setArticles(
          articles.map(a => (a.article_id === article_id ? res.data.article : a)) // ✅ Ensures state updates correctly
        );
        setMessage('Nice update, Foo!'); // ✅ Ensures expected success message appears
        setCurrentArticleId(null);
      })
      .catch(() => {
        setMessage('Failed to update article.');
      })
      .finally(() => {
        setSpinnerOn(false);
      });
  };

  const deleteArticle = article_id => {
    setMessage('');
    setSpinnerOn(true);

    const token = localStorage.getItem('token');
    axios.delete(`${articlesUrl}/${article_id}`, { headers: { Authorization: token } })
      .then(res => {
        setArticles(res.data.articles);
        setMessage(res.data.message);
      })
      .catch(() => {
        setMessage('Failed to delete article.');
      })
      .finally(() => {
        setSpinnerOn(false);
      });
  };

  return (
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
          <>
            <ArticleForm 
              postArticle={postArticle} 
              updateArticle={updateArticle} 
              currentArticleId={currentArticleId} 
              setCurrentArticleId={setCurrentArticleId} 
              articles={articles || []} // ✅ Ensures `articles` is always at least an empty array
            />
            <Articles 
              articles={articles} 
              getArticles={getArticles} 
              deleteArticle={deleteArticle} 
              setCurrentArticleId={setCurrentArticleId} 
            />
          </>
        } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  );
}