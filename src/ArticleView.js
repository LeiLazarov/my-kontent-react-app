import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {deliveryClient } from "./config";

function ArticleView({match, history}) {
  // Uses the react state hook
  const [article, setArticle] = useState({});
  const [isLoading, setLoading] = useState(true);

  // Gets an article by its URL slug
  const getArticle = (slug) => {
    return deliveryClient 
      .items()
      .type("article")
      .equalsFilter("elements.url_pattern", slug)
      .toObservable()
      .subscribe((response) => {
        setArticle(response.items[0]);
        setLoading(false);
      });
  };

  useEffect(() => {
    const subscription = getArticle(match.params.slug);
    return () => subscription.unsubscribe();
  }, [match.params.slug]);
  
  // Shows loading until the app gets article from Kontent
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Link to='/'>Home</Link>
      <h1>{article.title.value}</h1>
      <div
        className='article_body'
        dangerouslySetInnerHTML={{__html: article.body_copy.resolveHtml()}}
      />
    </div>
  );
}

export default ArticleView;