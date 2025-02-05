import React, { useEffect, useState } from 'react';
import PT from 'prop-types';

const initialFormValues = { title: '', text: '', topic: '' };

export default function ArticleForm({ postArticle, updateArticle, setCurrentArticleId, currentArticleId, articles }) {
  const [values, setValues] = useState(initialFormValues);

  // ✅ Populate form when editing an article
  useEffect(() => {
    if (currentArticleId !== null && articles?.length > 0) { // ✅ Ensure articles exist before setting values
      const articleToEdit = articles.find(a => a.article_id === currentArticleId);
      if (articleToEdit) {
        setValues({
          title: articleToEdit.title,
          text: articleToEdit.text,
          topic: articleToEdit.topic,
        });
      }
    } else {
      setValues(initialFormValues);
    }
  }, [currentArticleId, articles]); // ✅ Depend on `articles` to update form when articles are loaded

  const onChange = evt => {
    const { id, value } = evt.target;
    setValues({ ...values, [id]: value });
  };

  const onSubmit = evt => {
    evt.preventDefault();
    
    if (currentArticleId) {
      updateArticle({ article_id: currentArticleId, article: values }); // ✅ Update existing article
    } else {
      postArticle(values); // ✅ Create a new article
    }

    setValues(initialFormValues); // ✅ Reset form after submission
  };

  const isDisabled = () => {
    return !values.title.trim() || !values.text.trim() || !values.topic.trim();
  };

  return (
    <form id="form" onSubmit={onSubmit}>
      <h2>{currentArticleId ? "Edit Article" : "Create Article"}</h2>
      <input
        maxLength={50}
        onChange={onChange}
        value={values.title}
        placeholder="Enter title"
        id="title"
      />
      <textarea
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        id="text"
      />
      <select onChange={onChange} id="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button disabled={isDisabled()} id="submitArticle">Submit</button>
        <button onClick={() => setCurrentArticleId(null)}>Cancel edit</button> {/* ✅ Clears edit state */}
      </div>
    </form>
  );
}

// ✅ Ensure required props are passed
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticleId: PT.number,
  articles: PT.array.isRequired,
};