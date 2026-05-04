import "./cart.scss";
const Cart = () => {
  return (
    <>
      <div className="cart">
        <h2 className="cart__title">Your Cart</h2>

        <div className="cart__container">
          {/* LEFT - CART ITEMS */}
          <div className="cart__items">
            <div className="cart-item">
              <img src="/img/product.jpg" alt="" />

              <div className="cart-item__info">
                <h4>Coffee Arabica</h4>
                <p>$12.00</p>
              </div>

              <div className="cart-item__quantity">
                <button>-</button>
                <span>2</span>
                <button>+</button>
              </div>

              <div className="cart-item__total">$24.00</div>

              <button className="cart-item__remove">✕</button>
            </div>
          </div>

          {/* RIGHT - SUMMARY */}
          <div className="cart__summary">
            <h3>Summary</h3>

            <div className="summary__row">
              <span>Subtotal</span>
              <span>$24.00</span>
            </div>

            <div className="summary__row">
              <span>Shipping</span>
              <span>$2.00</span>
            </div>

            <div className="summary__total">
              <span>Total</span>
              <span>$26.00</span>
            </div>

            <button className="summary__checkout">Checkout</button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Cart;
