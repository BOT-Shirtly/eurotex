import {
  CheckCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/20/solid";

function PrivacyPolicy() {
  return (
    <div className="bg-white px-6 py-32 lg:px-8">
      <div className="mx-auto max-w-4xl text-base leading-7 text-gray-700">
        <p className="text-base font-semibold leading-7 text-themeColor-600">
          October 1st, 2024
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          PRIVACY POLICY
        </h1>
        <div className="mt-10 w-full">
          <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
            COLLECTION OF PERSONAL INFORMATION
          </h2>
          <p>
            When you use our Products or Website, you may be asked for
            personally identifiable information such as your name, address,
            email address, and telephone number.
          </p>
          <p>
            By giving us such information, you will need to consent by using it
            in the manner described in this policy.
          </p>
          <p>
            You may withdraw your consent at any time by emailing us at
            onlinesalesusa@eurotex.com. We will return or destroy your personal
            information within five days of receipt of your withdrawal of
            consent.
          </p>
          <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
            COOKIES
          </h2>
          <p>
            Cookies are small data files that a website you visit may save on
            your computer or handheld device that usually includes an anonymous
            unique identifier. Our Websites and those of our Products may use
            cookies for user authentication, keeping track of your preferences,
            promotional campaigns, tracking our audience size and traffic
            patterns, and in certain other cases. We may include small graphic
            images in our email messages and newsletters to determine whether
            the messages were opened and the links were viewed.
          </p>
          <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
            SECURITY
          </h2>
          <p>
            All security on our Website is treated seriously. Where applicable,
            we undertake security steps, including use of SSL technology, on our
            back-end systems that store customer account information and to
            protect data transmissions. However, this is not a guarantee that
            such data transmissions cannot be accessed, altered or deleted due
            to firewall or other security software failures. If you have any
            further concerns about security, please email our Customer Service
            team at onlinesalesusa@eurotex.com.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
