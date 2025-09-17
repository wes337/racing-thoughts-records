"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useShallow } from "zustand/react/shallow";
import { CDN_URL } from "@/utils";
import { useCart } from "@/state";
import Shopify from "@/shopify";
import Cache from "@/cache";

export default function Cart() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
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
    setMounted(true);
    getCartItems();
  }, []);

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
    if (!cart || loading) {
      return;
    }

    setLoading(true);

    await Shopify.removeFromCart(cart.id, [cartItem.id]);
    await getCartItems();

    setLoading(false);
  };

  const onReduceQuantity = async (cartItem) => {
    if (!cart || loading) {
      return;
    }

    setLoading(true);

    if (cartItem.quantity === 1) {
      await Shopify.removeFromCart(cart.id, [cartItem.id]);
    } else {
      await Shopify.updateQuantity(
        cart.id,
        cartItem.id,
        Math.max(cartItem.quantity - 1, 1)
      );
    }

    await getCartItems();

    setLoading(false);
  };

  const onIncreaseQuantity = async (cartItem) => {
    if (!cart || loading) {
      return;
    }

    setLoading(true);

    await Shopify.updateQuantity(cart.id, cartItem.id, cartItem.quantity + 1);
    await getCartItems();

    setLoading(false);
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

  if (!show || !mounted) {
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

  const getTotalItemsInCart = () => {
    let total = 0;

    if (cartItems.length === 0) {
      return total;
    }

    cartItems.forEach(({ quantity }) => {
      total += Number(quantity);
    });

    return total;
  };

  return (
    <>
      <button
        className="absolute right-[16px] md:right-[32px] h-[32px] xl:h-[40px] w-auto cursor-pointer opacity-90 hover:scale-[1.1] hover:opacity-100 active:scale-[1.2]"
        onClick={toggleOpen}
      >
        {getTotalItemsInCart() && (
          <div className="absolute bottom-[-4px] right-[-8px] z-1 font-bold tracking-tighter text-white text-md w-[24px] bg-black/75 rounded-lg text-shadow-[2px_2px_0_black]">
            {getTotalItemsInCart()}
          </div>
        )}
        <Image
          className="hidden xl:block w-auto h-full object-contain"
          src={`${CDN_URL}/images/cart-white.png`}
          alt="Cart"
          width={603}
          height={173}
        />
        <Image
          className="xl:hidden w-auto h-full object-contain ml-auto"
          src={`${CDN_URL}/images/cart-icon.png`}
          alt="Cart"
          width={603}
          height={173}
        />
      </button>
      {createPortal(
        <div
          className={`fixed top-0 flex w-full h-screen z-5 ${
            open ? "right-0" : "right-[-150%] delay-100"
          } transition-all duration-200`}
        >
          <div
            className={`hidden lg:block w-full h-screen bg-black/75 ${
              open ? "opacity-100 delay-150" : "opacity-0"
            } transition-all duration-100 `}
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
                src={`${CDN_URL}/images/close.png`}
                alt="Close"
                width={138}
                height={112}
              />
            </button>
            <div className="w-full h-[32px] mt-2.5">
              <Image
                className="w-auto h-full object-contain m-auto"
                src={`${CDN_URL}/images/cart.png`}
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
                        <div className="flex flex-col justify-center w-[calc(100%-128px)]">
                          <div className="font-sans font-medium flex items-center gap-2 tracking-[-1.5px] text-sm md:text-md xl:text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                            {cartItem.productTitle}
                          </div>
                          <div className="flex mt-2">
                            <div className="group relative flex w-[33%] h-[32px]">
                              <button
                                className="w-[50%] h-full flex items-center justify-center cursor-pointer font-bold text-lg"
                                onClick={() => onReduceQuantity(cartItem)}
                                disabled={loading}
                              >
                                -
                              </button>
                              <div className="w-full flex items-center justify-center text-center font-bold text-lg">
                                {cartItem.quantity}
                              </div>
                              <button
                                className="w-[50%] h-full flex items-center justify-center cursor-pointer font-bold text-lg"
                                onClick={() => onIncreaseQuantity(cartItem)}
                                disabled={loading}
                              >
                                +
                              </button>
                              <Image
                                className="absolute w-full h-full pointer-events-none opacity-85 group-hover:opacity-100 group-hover:brightness-50"
                                src={`/images/box.png`}
                                width={605}
                                height={214}
                                alt=""
                              />
                            </div>
                            <div className="text-xl font-light opacity-80 ml-auto">
                              ${(cartItem.price * cartItem.quantity).toFixed(2)}
                            </div>
                          </div>
                        </div>
                        <div className="absolute top-0 right-0 m-4">
                          <button
                            className="cursor-pointer w-[28px] h-[28px] opacity-80 hover:opacity-100 hover:scale-[1.1]"
                            onClick={() => onRemoveCartItem(cartItem)}
                            disabled={loading}
                          >
                            <Image
                              src={`${CDN_URL}/images/close-box.png`}
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
                  <div className="font-sans font-light text-sm opacity-80">
                    Subtotal
                  </div>
                  <div className="font-sans font-bold text-3xl opacity-90">
                    ${getSubtotal().toFixed(2)} {currencyCode}
                  </div>
                </div>
                <div className="mt-auto font-sans tracking-tighter text-xs xl:text-md flex items-center justify-center text-center opacity-80 p-2">
                  Shipping & taxes calculated at checkout
                </div>
                <div className="flex items-center justify-center bg-gray-300/50">
                  <button
                    className="group flex items-center justify-center gap-4 h-[112px] w-full cursor-pointer font-display font-bold text-6xl [text-shadow:1px_0px_0px_currentColor] tracking-wide hover:brightness-50 border-t-4 border-b-4 border-black/60 md:border-b-0"
                    onClick={onClickCheckout}
                  >
                    <span className="group-hover:scale-[1.1] group-active:scale-[1.2]">
                      Check Out
                    </span>
                    <Image
                      className="w-[48px] h-full object-contain group-hover:scale-[1.1] group-active:scale-[1.2]"
                      src={`${CDN_URL}/images/arrow-right.png`}
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
