import "./news.css"

function SeeNew({ news }) {

  return (
    <div className="container-seeNew page-container">
      <div className="container-photo">
        <img src={news.image} alt="" width={"80%"} objectFit={"cover"}/>
      </div>
      <div className="container-allNew">
        <h2 className="title-new">{news.title}</h2>
        <p className="text-new" dangerouslySetInnerHTML={{ __html: news.description }} />
      </div>
    </div>
  )
}

export default SeeNew;

