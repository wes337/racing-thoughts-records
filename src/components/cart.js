"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Shopify from "@/shopify";
import Cache from "@/cache";
import { useShallow } from "zustand/react/shallow";
import { useCart } from "@/state";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [currencyCode, setCurrencyCode] = useState("USD");
  const [cart, setCart, show, open, toggleOpen] = useCart(
    useShallow((state) => [
      state.cart,
      state.setCart,
      state.show,
      state.open,
      state.toggleOpen,
    ])
  );

  useEffect(() => {
    if (!cart) {
      return;
    }

    const currencyCode =
      cart.estimatedCost?.subtotalAmount?.currencyCode ||
      cart.estimatedCost?.totalAmount?.currencyCode ||
      "USD";
    setCurrencyCode(currencyCode);
  }, [cart]);

  const createCart = async () => {
    const cachedCartId = await Cache.getItem("cartId");
    const validCart = cachedCartId
      ? await Shopify.isCartValid(cachedCartId)
      : false;

    if (validCart) {
      const existingCart = await Shopify.getCart(cachedCartId);
      setCart(existingCart);
    } else {
      const cart = await Shopify.createCart();
      Cache.setItem("cartId", cart.id, 180);
      setCart(cart);
    }
  };

  const getCartItems = async () => {
    if (!cart) {
      return;
    }

    const cartItems = await Shopify.getCartItems(cart.id);

    setCartItems(cartItems || []);
  };

  const onRemoveCartItem = async (cartItem) => {
    if (!cart) {
      return;
    }

    await Shopify.removeFromCart(cart.id, [cartItem.id]);
    await getCartItems();
  };

  const onClickCheckout = () => {
    if (!cart) {
      return;
    }

    Cache.removeItem("cartId");

    window.location.href = cart.checkoutUrl;
  };

  useEffect(() => {
    createCart();

    document.addEventListener("updatecart", getCartItems);

    return () => {
      document.removeEventListener("updatecart", getCartItems);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    getCartItems();
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [open]);

  if (!show) {
    return null;
  }

  const getSubtotal = () => {
    if (!cartItems || cartItems.length === 0) {
      return 0;
    }

    let amount = 0;

    cartItems.forEach(({ price, quantity }) => {
      amount += Number(price) * Number(quantity);
    });

    return amount;
  };

  return (
    <>
      <button
        className="absolute right-[16px] md:right-[32px] h-[32px] xl:h-[40px] w-auto cursor-pointer opacity-90 hover:scale-[1.1] hover:opacity-100 active:scale-[1.2]"
        onClick={toggleOpen}
      >
        <Image
          className="hidden xl:block w-auto h-full object-contain"
          src={`/images/cart-white.png`}
          alt="Cart"
          width={603}
          height={173}
        />
        <Image
          className="xl:hidden w-auto h-full object-contain ml-auto"
          src={`/images/cart-icon.png`}
          alt="Cart"
          width={603}
          height={173}
        />
      </button>
      {open &&
        createPortal(
          <div className="fixed top-0 right-0 flex w-full h-screen z-5">
            <div
              className="hidden lg:block w-full h-screen bg-black/75"
              onClick={toggleOpen}
            />
            <div
              id="cart"
              className="bg-white w-full h-screen lg:w-[33vw] lg:border-l-6 border-black/85"
            >
              <button
                className="absolute top-[12px] left-[16px] h-[32px] lg:left-[auto] lg:right-[16px] z-1 opacity-85 cursor-pointer hover:scale-[1.1] hover:opacity-100 active:scale-[1.2]"
                onClick={toggleOpen}
              >
                <Image
                  className="w-auto h-full object-contain"
                  src={"/images/close.png"}
                  alt="Close"
                  width={138}
                  height={112}
                />
              </button>
              <div className="w-full h-[32px] mt-2.5">
                <Image
                  className="w-auto h-full object-contain m-auto"
                  src={"/images/cart.png"}
                  alt="Cart"
                  width={603}
                  height={173}
                />
              </div>
              {cartItems.length > 0 ? (
                <div className="flex flex-col h-[calc(100vh-112px)] md:h-[calc(100vh-40px)]">
                  <div className="flex flex-col p-2 mt-2">
                    {cartItems.map((cartItem) => {
                      return (
                        <div
                          key={cartItem.id}
                          className="relative flex w-full p-2 gap-2"
                        >
                          <div className="flex bg-gray-300/50 rounded-sm w-[64px] h-[64px] md:w-[80px] md:h-[80px]">
                            <Image
                              className="w-auto h-full object-contain mix-blend-multiply rounded-sm"
                              src={cartItem.image}
                              alt=""
                              width={80}
                              height={80}
                            />
                          </div>
                          <div className="flex flex-col justify-center">
                            <div className="font-display font-bold flex items-center gap-2 tracking-tight text-xl md:text-3xl whitespace-nowrap overflow-hidden text-ellipsis">
                              <span className="text-xl">
                                {cartItem.quantity}x
                              </span>
                              {cartItem.productTitle}
                            </div>
                            <div className="text-xl font-medium">
                              ${cartItem.price * cartItem.quantity}
                            </div>
                          </div>
                          <div className="absolute top-0 right-0 m-4">
                            <button
                              className="cursor-pointer w-[32px] h-[32px] opacity-80 hover:opacity-100 hover:scale-[1.1]"
                              onClick={() => onRemoveCartItem(cartItem)}
                            >
                              <Image
                                src={`/images/close-box.png`}
                                width={152}
                                height={136}
                                alt=""
                              />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="p-4">
                    <div className="font-display font-bold text-2xl tracking-wide">
                      Subtotal
                    </div>
                    <div className="font-sans font-bold text-3xl">
                      ${getSubtotal().toFixed(2)} {currencyCode}
                    </div>
                  </div>
                  <div className="mt-auto font-display font-bold tracking-tight text-2xl md:tracking-normal flex items-center justify-center text-center opacity-80  p-2">
                    Shipping & taxes calculated at checkout
                  </div>
                  <div className="flex items-center justify-center bg-gray-300/50">
                    <button
                      className="flex items-center justify-center gap-4 h-[112px] w-full cursor-pointer font-display font-bold text-6xl tracking-wide hover:brightness-50 hover:scale-[1.1] active:scale-[1.2]"
                      onClick={onClickCheckout}
                    >
                      Check Out
                      <Image
                        className="w-[48px] h-full object-contain"
                        src={`/images/arrow-right.png`}
                        width={300}
                        height={122}
                        alt=""
                      />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="display flex items-center justify-center w-full h-full m-auto">
                  <span className="font-display font-bold text-4xl opacity-80 tracking-tight">
                    Your cart is currently empty.
                  </span>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
