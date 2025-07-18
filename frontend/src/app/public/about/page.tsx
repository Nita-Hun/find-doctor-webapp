'use client';

import Image from 'next/image';
import { FaUserMd, FaCalendarCheck, FaHeadset, FaStar } from 'react-icons/fa';

export default function AboutPage() {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero */}
      <section className="bg-blue-600 text-white py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">About FindDoctor</h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto">
          Empowering patients with seamless access to trusted doctors and modern healthcare.
        </p>
      </section>

      {/* Intro */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Who We Are</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            FindDoctor is a smart healthcare platform designed to simplify how patients discover, schedule, and manage doctor appointments — all in one place.
          </p>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-3 gap-8">
          <div className="text-center p-6 border rounded-xl hover:shadow-lg transition">
            <FaUserMd className="mx-auto text-blue-600 text-4xl mb-4" />
            <h3 className="text-xl font-semibold">Verified Doctors</h3>
            <p className="text-gray-600 mt-2">Only qualified and approved doctors are listed on our platform.</p>
          </div>
          <div className="text-center p-6 border rounded-xl hover:shadow-lg transition">
            <FaCalendarCheck className="mx-auto text-blue-600 text-4xl mb-4" />
            <h3 className="text-xl font-semibold">Smart Booking</h3>
            <p className="text-gray-600 mt-2">Book appointments in seconds, anytime, anywhere.</p>
          </div>
          <div className="text-center p-6 border rounded-xl hover:shadow-lg transition">
            <FaHeadset className="mx-auto text-blue-600 text-4xl mb-4" />
            <h3 className="text-xl font-semibold">24/7 Support</h3>
            <p className="text-gray-600 mt-2">Our support team is here to assist you anytime you need help.</p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <Image
            src="/assets/images/image1.jpg"
            alt="Team Working"
            width={600}
            height={400}
            className="rounded-lg shadow"
          />
          <div>
            <h3 className="text-2xl font-bold mb-4">Our Mission & Vision</h3>
            <p className="text-gray-700 mb-4">
              Our mission is to democratize access to healthcare by connecting patients with trusted doctors using modern technology. We envision a world where healthcare is timely, transparent, and accessible to all.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Improve patient-doctor relationships</li>
              <li>Provide real-time appointment availability</li>
              <li>Ensure secure and easy communication</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Patient Ratings */}
      <section className="py-16 bg-white text-center">
        <h2 className="text-3xl font-bold mb-4">What Our Patients Say</h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-10">
          Our users consistently rate our platform highly for convenience, doctor quality, and ease of use.
        </p>
        <div className="flex justify-center gap-12">
          <div className="text-center">
            <h3 className="text-5xl font-bold text-yellow-400 flex items-center justify-center">
              4.8 <FaStar className="ml-2 text-yellow-400" />
            </h3>
            <p className="text-gray-600 mt-2">Average Rating</p>
          </div>
          <div className="text-center">
            <h3 className="text-5xl font-bold text-blue-600">12k+</h3>
            <p className="text-gray-600 mt-2">Total Reviews</p>
          </div>
        </div>
      </section>

      {/* Doctor List Preview */}
      <section className="bg-gray-100 py-16 text-center">
        <h2 className="text-3xl font-bold mb-10">Top Rated Doctors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-4">
          {[
            {
              name: 'Dr. Sopheak Seng',
              specialty: 'Cardiologist',
              rating: 4.9,
              img: '/assets/images/doctor1.png',
            },
            {
              name: 'Dr. Lina Chenda',
              specialty: 'Dermatologist',
              rating: 4.8,
              img: '/assets/images/2.png',
            },
            {
              name: 'Dr. Vuth Dara',
              specialty: 'Pediatrician',
              rating: 4.7,
              img: '/assets/images/3.png',
            },
            {
              name: 'Dr. Sok Roth',
              specialty: 'Orthopedic Surgeon',
              rating: 4.9,
              img: '/assets/images/1.png',
            },
          ].map((doc, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow">
              <Image
                src={doc.img}
                alt={doc.name}
                width={160}
                height={160}
                className="rounded-full mx-auto mb-4 object-cover"
              />
              <h4 className="text-lg font-semibold">{doc.name}</h4>
              <p className="text-sm text-gray-500">{doc.specialty}</p>
              <div className="flex justify-center mt-2 text-yellow-400">
                {[...Array(Math.floor(doc.rating))].map((_, i) => (
                  <FaStar key={i} />
                ))}
                {doc.rating % 1 > 0 && <FaStar className="opacity-50" />}
              </div>
              <p className="text-sm text-gray-600 mt-1">{doc.rating.toFixed(1)} rating</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
<section className="py-16 bg-white text-center">
  <h2 className="text-3xl font-bold mb-10">How It Works</h2>
  <div className="grid sm:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
    {/* Step 1 */}
    <div className="p-6 border rounded-lg hover:shadow-md transition">
      <div className="text-blue-600 text-4xl mb-4">🩺</div>
      <h3 className="text-xl font-semibold mb-2">Find Your Doctor</h3>
      <p className="text-gray-600">
        Search by specialization, location, or hospital to discover verified and trusted doctors.
      </p>
    </div>

    {/* Step 2 */}
    <div className="p-6 border rounded-lg hover:shadow-md transition">
      <div className="text-blue-600 text-4xl mb-4">📅</div>
      <h3 className="text-xl font-semibold mb-2">Book Appointment</h3>
      <p className="text-gray-600">
        Select your preferred time slot and confirm your booking in just a few clicks.
      </p>
    </div>

    {/* Step 3 */}
    <div className="p-6 border rounded-lg hover:shadow-md transition">
      <div className="text-blue-600 text-4xl mb-4">💬</div>
      <h3 className="text-xl font-semibold mb-2">Get Treated</h3>
      <p className="text-gray-600">
        Visit the doctor in person or join an online consultation — it’s your choice.
      </p>
    </div>
  </div>
</section>


      {/* CTA SECTION */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to take control of your health?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Schedule an appointment today and experience compassionate, personalized care.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg">
              Book Online Now
            </button>
            <button className="border-2 border-white text-white hover:bg-blue-700 px-8 py-4 rounded-lg font-bold transition-all duration-300">
              Call (023) 456-7890
            </button>
          </div>
        </div>
      </section>

      {/* SOCIAL MEDIA SECTION */}
      <section className="bg-blue-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h3 className="text-white text-lg font-medium mb-4 md:mb-0">
              Connect with us on social media
            </h3>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-blue-200 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
              <a href="#" className="text-white hover:text-blue-200 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 3.807.058h.468c2.456 0 2.784-.011 3.807-.058.975-.045 1.504-.207 1.857-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-3.807v-.468c0-2.456-.011-2.784-.058-3.807-.045-.975-.207-1.504-.344-1.857a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
                </svg>
              </a>
              <a href="#" className="text-white hover:text-blue-200 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </a>
              <a href="#" className="text-white hover:text-blue-200 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a href="#" className="text-white hover:text-blue-200 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Find Doctor. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
