import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "react-use-cart";
import { formatCurrency } from "../lib/format";

const Cart = () => {
  const {
    isEmpty,
    items,
    cartTotal,
    updateItemQuantity,
    removeItem,
    emptyCart,
  } = useCart();

  if (isEmpty) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-neutral-100 grid place-items-center">
            <span className="material-symbols-outlined text-2xl text-neutral-500">
              shopping_bag
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-ink">Your cart is empty</h1>
          <p className="mt-1 text-neutral-600">
            Looks like you haven’t added anything yet.
          </p>
          <Link
            to="/product"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-ink px-5 py-3 text-white hover:bg-neutral-900"
          >
            Start shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="mb-6 text-2xl font-semibold text-ink">Your Cart</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Line items */}
        <section className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-2xl border border-neutral-200 bg-white p-4"
            >
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="line-clamp-2 font-medium text-ink">{item.title}</h2>
                <p className="mt-1 text-sm text-neutral-500">{item.category}</p>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center rounded-xl border border-neutral-300">
                    <button
                      onClick={() =>
                        updateItemQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                      className="h-9 w-9 text-lg"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                      className="h-9 w-9 text-lg"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-sm text-danger hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="ml-auto text-right">
                <p className="font-semibold">
                  {formatCurrency(item.price * item.quantity)}
                </p>
                <p className="mt-1 text-sm text-neutral-500">
                  {formatCurrency(item.price)} each
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* Summary */}
        <aside className="lg:col-span-1">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-ink">Order Summary</h2>

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-neutral-600">Subtotal</dt>
                <dd className="font-medium">{formatCurrency(cartTotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-600">Shipping</dt>
                <dd className="text-neutral-500">Calculated at checkout</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-600">Taxes</dt>
                <dd className="text-neutral-500">Calculated at checkout</dd>
              </div>
              <div className="mt-3 h-px w-full bg-neutral-200" />
              <div className="flex justify-between text-base">
                <dt className="font-semibold text-ink">Total</dt>
                <dd className="font-semibold">{formatCurrency(cartTotal)}</dd>
              </div>
            </dl>

            <Link
              to="/checkout"
              className="mt-6 block w-full rounded-xl bg-ink py-3 text-center font-medium text-white hover:bg-neutral-900"
            >
              Proceed to checkout
            </Link>

            <button
              onClick={emptyCart}
              className="mt-3 w-full text-sm text-neutral-600 hover:text-ink"
            >
              Empty cart
            </button>

            <Link
              to="/product"
              className="mt-1 block w-full text-sm text-neutral-600 hover:text-ink"
            >
              Continue shopping
            </Link>
          </div>

          <p className="mt-3 text-xs text-neutral-500">
            Prices and availability are subject to change. Your cart is saved on
            this device.
          </p>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
