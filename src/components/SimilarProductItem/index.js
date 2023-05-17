import './index.css'

const SimilarProductItem = props => {
  const {similarProductDetails} = props
  const {title, rating, price, imageUrl, brand} = similarProductDetails
  return (
    <li className="similar-product">
      <img
        src={imageUrl}
        alt="similar product"
        className="similar-product-image"
      />
      <h1 className="title">{title}</h1>
      <p className="similar-product-brand">by {brand}</p>
      <div className="rating-price-similar-products-container">
        <p className="similar-product-price">Rs {price}/- </p>
        <div className="similar-product-rating-container">
          <p className="similar-product-rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="similar-star-image"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
