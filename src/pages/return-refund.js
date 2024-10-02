import {
  CheckCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/20/solid";

function ReturnRfund() {
  return (
    <div className="bg-white px-6 py-32 lg:px-8">
      <div className="mx-auto max-w-4xl text-base leading-7 text-gray-700">
        <p className="text-base font-semibold leading-7 text-themeColor-600">
          October 1st, 2024
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          RETURN POLICY
        </h1>
        <div className="mt-10 w-full">
          <p>
            Our refund policy is 15 Days. Unfortunately we can’t offer you a
            refund or exchange after this period. To be eligible for a return,
            your item must be unused and in the same condition that you received
            it. It must also be in the original packaging. Several types of
            goods are exempt from being returned. Perishable goods such as food,
            flowers, newspapers or magazines cannot be returned. We also do not
            accept products that are intimate or sanitary goods, hazardous
            materials, or flammable liquids or gases.
          </p>
          <p>
            To complete your return, we require a receipt or proof of purchase.
            Please do not send your purchase back to the manufacturer.
          </p>
          <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
            REFUNDS (if applicable)
          </h2>
          <p>
            Once your return is received and inspected, we will send you an
            email to notify you that we have received your returned item. We
            will also notify you of the approval or rejection of your refund.
          </p>
          <p>
            If you are approved, then your refund will be processed after
            deducting a 20% restocking fee. A credit will automatically be
            applied to your credit card or original method of payment, within a
            certain amount of days.
          </p>
          <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
            EXCHANGES (if applicable)
          </h2>
          <p>
            We only replace items if they are defective or damaged. If you need
            to exchange it for the same item, send us an email at
            onlinesalesusa@eurotex.com and send your item to: 122 Middleton
            Street, Brantford ON Canada N3S 7V7
          </p>
        </div>
      </div>
    </div>
  );
}

export default ReturnRfund;
