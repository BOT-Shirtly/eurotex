import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function Summary() {
  const location = useLocation();
  const orderSubmissionData = location.state || {};
  const [products, setProducts] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({});

  const [subTotal, setSubTotal] = useState(0.0);
  const [shippingCost, setShippingCost] = useState(0.0);
  const [shippingService, setShippingService] = useState("");
  const [taxEstimate, setTaxEstimate] = useState(0.0);
  const [orderTotal, setOrderTotal] = useState(0.0);
  const [totalWeight, setTotalWeight] = useState(0.0);

  useEffect(() => {
    console.log(orderSubmissionData);
    setProducts(orderSubmissionData?.orderedItems);
    setShippingAddress(orderSubmissionData?.shippingAddress);
    setSubTotal(orderSubmissionData?.paymentDetails?.subTotal);
    setShippingCost(orderSubmissionData?.paymentDetails?.shippingCost);
    setShippingService(orderSubmissionData?.shippingService);
    setTaxEstimate(orderSubmissionData?.paymentDetails?.taxEstimate);
    setOrderTotal(orderSubmissionData?.paymentDetails?.orderTotal);
    setTotalWeight(orderSubmissionData?.paymentDetails?.totalWeight);
  });
  return (
    <>
      <main className="relative lg:min-h-full lg:flex-row-reverse lg:overflow-hidden mx-auto max-w-2xl lg:max-w-7xl">
        <div className="h-80 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
          <img
            alt="KingJetPrinters Order Successfully placed"
            src="https://images.shirtly.com/image/upload/v1725041894/KingJetPrinters/Logos/Website_Payment-Successful-screen_e3lu5n.jpg"
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div>
          <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-24 xl:gap-x-24">
            <div className="lg:col-start-2">
              <h1 className="text-sm font-medium text-themeColor-600">
                Payment successful
              </h1>
              <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Thanks for ordering
              </p>
              <p className="mt-2 text-base text-gray-500">
                We appreciate your order, we’re currently processing it.
              </p>

              <ul
                role="list"
                className="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-gray-500"
              >
                {products?.map((product, index) => (
                  <li key={index} className="flex space-x-6 py-6">
                    <img
                      alt={product.imageAlt}
                      src={product.imageSrc}
                      className="h-24 w-24 flex-none rounded-md bg-gray-100 object-cover object-center"
                    />
                    <div className="flex-auto space-y-1">
                      <h3 className="text-gray-900">
                        <a href={product.href}>{product.name}</a>
                      </h3>
                      <p>{product.orderedCombination.name}</p>
                      <p>QTY: {product.orderedCombination.qty}</p>
                    </div>
                    <p className="flex-none font-medium text-gray-900">
                      ${product.price}
                    </p>
                  </li>
                ))}
              </ul>

              <dl className="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-gray-500">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd className="text-gray-900">${subTotal}</dd>
                </div>

                <div className="flex justify-between">
                  <dt>Shipping ({shippingService})</dt>
                  <dd className="text-gray-900">${shippingCost}</dd>
                </div>

                <div className="flex justify-between">
                  <dt>Total Weight (pounds)</dt>
                  <dd className="text-gray-900">{totalWeight}</dd>
                </div>

                <div className="flex justify-between">
                  <dt>Taxes</dt>
                  <dd className="text-gray-900">${taxEstimate}</dd>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
                  <dt className="text-base">Total</dt>
                  <dd className="text-base">${orderTotal}</dd>
                </div>
              </dl>

              <dl className="mt-16 grid grid-cols-2 gap-x-4 text-sm text-gray-600">
                <div>
                  <dt className="font-medium text-gray-900">
                    Shipping Address
                  </dt>
                  <dd className="mt-2">
                    <address className="not-italic">
                      <span className="block">{shippingAddress?.name}</span>
                      <span className="block">{shippingAddress?.address}</span>
                      <span className="block">
                        {shippingAddress?.city} &nbsp;{shippingAddress?.postal}
                      </span>
                      <span className="block">
                        {shippingAddress?.state},&nbsp;
                        {shippingAddress?.country}
                      </span>
                    </address>
                  </dd>
                </div>
              </dl>

              <div className="mt-16 border-t border-gray-200 py-6 text-right">
                <a
                  href="/products"
                  className="text-sm font-medium text-themeColor-600 hover:text-themeColor-500"
                >
                  Continue Shopping
                  <span aria-hidden="true"> &rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Summary;
