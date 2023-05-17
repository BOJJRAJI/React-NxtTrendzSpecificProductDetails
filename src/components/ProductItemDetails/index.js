import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'
import './index.css'

const productsItemViews = {
  initial: 'INITIAL',
  failure: 'FAILURE',
  success: 'SUCCESS',
  inProgress: 'INPROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: productsItemViews.failure,
    matchProductData: {},
    similarProductsData: [],
    count: 1,
  }

  componentDidMount() {
    this.getProductItem()
  }

  getProductItem = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiStatus: productsItemViews.inProgress})
    console.log(id)
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      const updatedMatchedProduct = {
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        id: data.id,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        title: data.title,
        totalReviews: data.total_reviews,
      }

      const fetchedSimilarProductsData = data.similar_products.map(item => ({
        availability: item.availability,
        brand: item.brand,
        description: item.description,
        id: item.id,
        imageUrl: item.image_url,
        price: item.price,
        rating: item.rating,
        title: item.title,
        totalReviews: item.total_reviews,
      }))
      this.setState({
        similarProductsData: fetchedSimilarProductsData,
        matchProductData: updatedMatchedProduct,
        apiStatus: productsItemViews.success,
      })
    } else if (response.status === 404) {
      this.setState({apiStatus: productsItemViews.failure})
    }
  }

  renderMatchedProduct = () => {
    const {matchProductData, count} = this.state
    const {
      title,
      rating,
      totalReviews,
      price,
      imageUrl,

      description,
      availability,
      brand,
    } = matchProductData
    return (
      <div className="match-product-container">
        <img src={imageUrl} alt="product" className="match-product-image" />
        <div className="match-product-details-container">
          <h1 className="match-product-heading">{title}</h1>
          <p className="match-product-price">Rs {price}/- </p>
          <div className="rating-reviews-container">
            <div className="rating-container">
              <p className="match-product-rating">{rating}</p>
              <img
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
                className="star-image"
              />
            </div>
            <p className="match-product-reviews">{totalReviews} Reviews</p>
          </div>
          <p className="match-product-description">{description}</p>
          <div className="available-container">
            <h1 className="match-product-available-heading">Availability: </h1>
            <p className="availability-para"> {availability}</p>
          </div>
          <div className="brand-container">
            <h1 className="match-product-brand-heading">Brand: </h1>
            <p className="brand-para"> {brand}</p>
          </div>
          <hr className="line" />
          <div className="match-product-count-container">
            <button
              type="button"
              data-testid="minus"
              className="plus-minus-button"
              onClick={this.decreaseCount}
            >
              <BsDashSquare className="minus-icon" />
            </button>
            <p className="quantitly-count">{count}</p>
            <button
              type="button"
              data-testid="plus"
              className="plus-minus-button"
              onClick={this.increaseCount}
            >
              <BsPlusSquare className="minus-icon" />
            </button>
          </div>
          <button type="button" className="add-to-cart-button">
            ADD TO CART
          </button>
        </div>
      </div>
    )
  }

  increaseCount = () => {
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  decreaseCount = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({count: prevState.count - 1}))
    }
  }

  renderSimilarProducts = () => {
    const {similarProductsData} = this.state
    return (
      <>
        <h1 className="similar-product-heading">Similar Products</h1>
        <ul className="similar-product-container">
          {similarProductsData.map(product => (
            <SimilarProductItem
              similarProductDetails={product}
              key={product.id}
            />
          ))}
        </ul>
      </>
    )
  }

  renderSimilarAndMatchedProductsData = () => (
    <div className="matched-similar-products-container">
      {this.renderMatchedProduct()}
      {this.renderSimilarProducts()}
    </div>
  )

  renderResults = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case productsItemViews.failure:
        return this.renderFailureToFetchProducts()
      case productsItemViews.inProgress:
        return this.renderLoaderView()
      case productsItemViews.success:
        return this.renderSimilarAndMatchedProductsData()
      default:
        return null
    }
  }

  renderFailureToFetchProducts = () => (
    <div className="product-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="product-failure-image"
      />
      <h1 className="product-failure-heading">Product Not Found</h1>
      <button
        className="product-failure-button"
        type="button"
        onClick={this.gotoProductsRoute}
      >
        Continue Shopping
      </button>
    </div>
  )

  gotoProductsRoute = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderLoaderView = () => (
    <div data-testid="loader" className="primedeals-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  render() {
    return (
      <div className="product-item-details-container">
        <Header />
        {this.renderResults()}
      </div>
    )
  }
}

export default ProductItemDetails
