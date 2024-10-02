import {
  CheckCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/20/solid";

function Terms() {
  return (
    <div className="bg-white px-6 py-32 lg:px-8">
      <div className="mx-auto max-w-4xl text-base leading-7 text-gray-700">
        <p className="text-base font-semibold leading-7 text-themeColor-600">
          October 1st, 2024
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          TERMS OF USE
        </h1>
        <div className="mt-10 w-full">
          <p>
            Welcome to our website. If you continue to browse and use this
            website, you are agreeing to comply with and be bound by the
            following terms and conditions of use, which together with our
            privacy policy govern Eurotex North America Inc.'s relationship with
            you in relation to this website. If you disagree with any part of
            these terms and conditions, please do not use our website.
          </p>
          <p>
            The term 'Eurotex North America Inc.' or 'us' or 'we' refers to the
            owner of the website whose registered office is 8742 Buffalo Ave
            Niagara Falls, NY USA 14304. The term 'you' refers to the user or
            viewer of our website.
          </p>
          <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
            The use of this website is subject to the following terms of use:
          </h2>

          <ul role="list" className="mt-8 w-full space-y-8 text-gray-600">
            <li className="flex gap-x-3">
              <CheckCircleIcon
                aria-hidden="true"
                className="mt-1 h-5 w-5 flex-none text-themeColor-600"
              />
              The content of the pages of this website is for your general
              information and use only. It is subject to change without notice.
            </li>
            <li className="flex gap-x-3">
              <CheckCircleIcon
                aria-hidden="true"
                className="mt-1 h-5 w-5 flex-none text-themeColor-600"
              />
              This website uses cookies to monitor browsing preferences. If you
              do allow cookies to be used, the following personal information
              may be stored by us for use by third parties.
            </li>
            <li className="flex gap-x-3">
              <CheckCircleIcon
                aria-hidden="true"
                className="mt-1 h-5 w-5 flex-none text-themeColor-600"
              />
              Neither we nor any third parties provide any warranty or guarantee
              as to the accuracy, timeliness, performance, completeness or
              suitability of the information and materials found or offered on
              this website for any particular purpose. You acknowledge that such
              information and materials may contain inaccuracies or errors and
              we expressly exclude liability for any such inaccuracies or errors
              to the fullest extent permitted by law.
            </li>
            <li className="flex gap-x-3">
              <CheckCircleIcon
                aria-hidden="true"
                className="mt-1 h-5 w-5 flex-none text-themeColor-600"
              />
              Your use of any information or materials on this website is
              entirely at your own risk, for which we shall not be liable. It
              shall be your own responsibility to ensure that any products,
              services or information available through this website meet your
              specific requirements.
            </li>
            <li className="flex gap-x-3">
              <CheckCircleIcon
                aria-hidden="true"
                className="mt-1 h-5 w-5 flex-none text-themeColor-600"
              />
              This website contains material which is owned by or licensed to
              us. This material includes, but is not limited to, the design,
              layout, look, appearance and graphics. Reproduction is prohibited
              other than in accordance with the copyright notice, which forms
              part of these terms and conditions.
            </li>
            <li className="flex gap-x-3">
              <CheckCircleIcon
                aria-hidden="true"
                className="mt-1 h-5 w-5 flex-none text-themeColor-600"
              />
              All trade marks reproduced in this website which are not the
              property of, or licensed to, the operator are acknowledged on the
              website.
            </li>
          </ul>
          <br />
          <p>
            Unauthorized use of this website may give rise to a claim for
            damages and/or be a criminal offence.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Terms;
