import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us | UsedCars',
  description: 'Learn about UsedCars - Poland\'s premier marketplace for buying and selling quality used vehicles.',
};

export default function AboutPage() {
  return (
    <div className="bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden mb-16">
          <div className="relative h-[400px] w-full">
            <Image
              src="/about-hero.jpg"
              alt="Team of automotive professionals"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-900/40" />
          </div>
          
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-2xl mx-auto text-center text-white p-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">About UsedCars</h1>
              <p className="text-xl md:text-2xl">
                Poland&apos;s premier marketplace for buying and selling quality used vehicles.
              </p>
            </div>
          </div>
        </div>
        
        {/* Our Story */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="prose prose-lg max-w-none text-gray-600">
            <p>
              Founded in 2020, UsedCars was born from a simple idea: to create a transparent, user-friendly platform that makes buying and selling used cars a pleasure, not a pain.
            </p>
            <p>
              Our founder, Jan Kowalski, experienced firsthand the frustrations of the traditional used car market. After spending weeks trying to sell his beloved BMW and encountering numerous scams and lowball offers, he realized there had to be a better way.
            </p>
            <p>
              With a background in automotive engineering and a passion for technology, Jan assembled a team of like-minded professionals who shared his vision. Together, they built UsedCars from the ground up, focusing on transparency, security, and exceptional user experience.
            </p>
            <p>
              Today, UsedCars has grown to become Poland&apos;s leading online marketplace for used vehicles, connecting thousands of buyers and sellers every day. Our platform combines cutting-edge technology with automotive expertise to make car transactions safer, faster, and more enjoyable for everyone involved.
            </p>
          </div>
        </div>
        
        {/* Our Mission */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-20">
          <div className="md:flex">
            <div className="md:w-1/2 relative">
              <div className="h-64 md:h-full relative">
                <Image
                  src="/images/bmw5.jpg"
                  alt="Handshake over car keys"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            <div className="p-8 md:p-12 md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                At UsedCars, our mission is to revolutionize the way people buy and sell used vehicles in Poland. We strive to create a marketplace built on trust, transparency, and technological innovation.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We believe that buying a used car should be as exciting and rewarding as buying a new one, without the stress and uncertainty that traditionally comes with the process.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Every day, we work to empower our users with the tools, information, and support they need to make confident decisions about their automotive investments.
              </p>
            </div>
          </div>
        </div>
        
        {/* Our Values */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Values</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Trust & Transparency</h3>
              <p className="text-gray-600">
                We believe in complete honesty in every transaction. Our verification process ensures that all listings are accurate and our secure platform protects both buyers and sellers.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Innovation</h3>
              <p className="text-gray-600">
                We continuously push the boundaries of what&apos;s possible in the online automotive marketplace, implementing cutting-edge technologies to improve user experience.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Community</h3>
              <p className="text-gray-600">
                We foster a community of automotive enthusiasts and everyday drivers alike, providing resources, support, and a platform for sharing knowledge and experiences.
              </p>
            </div>
          </div>
        </div>
        
        {/* Our Team */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our diverse team of automotive experts, tech innovators, and customer service professionals work together to deliver the best possible experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden text-center">
              <div className="relative h-64 w-full">
                <Image
                  src="/team/ceo.jpg"
                  alt="Jan Kowalski - CEO & Founder"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800">Jan Kowalski</h3>
                <p className="text-blue-600 mb-2">CEO & Founder</p>
                <p className="text-gray-600 text-sm">
                  Automotive engineer with 15+ years of industry experience.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden text-center">
              <div className="relative h-64 w-full">
                <Image
                  src="/team/cto.jpg"
                  alt="Anna Nowak - CTO"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800">Anna Nowak</h3>
                <p className="text-blue-600 mb-2">CTO</p>
                <p className="text-gray-600 text-sm">
                  Tech visionary with expertise in AI and platform development.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden text-center">
              <div className="relative h-64 w-full">
                <Image
                  src="/team/marketing.jpg"
                  alt="Piotr Wiśniewski - Marketing Director"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800">Piotr Wiśniewski</h3>
                <p className="text-blue-600 mb-2">Marketing Director</p>
                <p className="text-gray-600 text-sm">
                  Digital marketing expert specializing in automotive industry.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden text-center">
              <div className="relative h-64 w-full">
                <Image
                  src="/team/customer.jpg"
                  alt="Magdalena Dąbrowska - Customer Success"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800">Magdalena Dąbrowska</h3>
                <p className="text-blue-600 mb-2">Customer Success</p>
                <p className="text-gray-600 text-sm">
                  Dedicated to ensuring exceptional experiences for all users.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="bg-blue-600 rounded-xl p-8 mb-20 text-white">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">UsedCars by the Numbers</h2>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Since our founding, we&apos;ve grown to become Poland&apos;s most trusted automotive marketplace.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">10,000+</div>
              <p className="text-blue-100">Cars Listed Monthly</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">500,000+</div>
              <p className="text-blue-100">Registered Users</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">98%</div>
              <p className="text-blue-100">Seller Satisfaction</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">15</div>
              <p className="text-blue-100">Days Average Sell Time</p>
            </div>
          </div>
        </div>
        
        {/* Contact Us */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Contact Us</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Have questions or feedback? Our team is here to help. Reach out to us using any of the methods below.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Phone</h3>
              <p className="text-gray-600 mb-2">Customer Support</p>
              <p className="text-blue-600 font-medium">+48 123 456 789</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Email</h3>
              <p className="text-gray-600 mb-2">Send us a message</p>
              <p className="text-blue-600 font-medium">contact@usedcars.com</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Office</h3>
              <p className="text-gray-600 mb-2">Visit our headquarters</p>
              <p className="text-blue-600 font-medium">123 Car Street, Warszawa</p>
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div className="bg-gray-900 rounded-xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Join the Revolution?</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Whether you&apos;re looking to buy your dream car or sell your current vehicle, UsedCars is here to make it happen.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/browse"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-md font-medium text-lg transition"
            >
              Browse Cars
            </Link>
            <Link 
              href="/sell"
              className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 rounded-md font-medium text-lg transition"
            >
              Sell Your Car
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
