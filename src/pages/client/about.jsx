// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { 
  Leaf, 
  Gem, 
  Heart, 
  ShieldCheck,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-white text-slate-800 overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sky-50 to-rose-50 py-20 px-4">
        <div className="max-w-screen-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-sky-700 mb-6">
              About <span className="text-indigo-600">Crystal Beauty</span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto"
            >
              At <span className="font-semibold text-sky-600">Crystal Beauty</span>, we believe beauty begins with self-love, confidence, and premium care.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-4">
        <div className="max-w-screen-xl mx-auto">
          <motion.div 
            className="grid md:grid-cols-2 gap-10 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ x: -50 }}
              whileInView={{ x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-xl overflow-hidden shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1887&auto=format&fit=crop"
                alt="Crystal Beauty Story"
                className="w-full h-80 md:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </motion.div>

            <motion.div
              initial={{ x: 50 }}
              whileInView={{ x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-slate-800">Our Story</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Crystal Beauty started with a single mission — to empower individuals through clean, luxurious beauty products that enhance natural beauty without compromise.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6">
                Founded in 2018 by cosmetic chemist Elena Rodriguez, our brand combines cutting-edge science with nature's finest ingredients to deliver transformative results.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-sky-600 font-semibold hover:text-sky-700 transition-colors"
              >
                Discover Our Products
                <ChevronRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-slate-50 px-4">
        <div className="max-w-screen-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Our Core Values</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              These principles guide every product we create and every decision we make.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100"
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-50 text-green-600 mx-auto mb-5">
                <Leaf size={24} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3 text-center">Clean Beauty</h3>
              <p className="text-slate-500 text-center">
                We formulate without parabens, sulfates, phthalates, and other questionable ingredients.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100"
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 text-blue-600 mx-auto mb-5">
                <Gem size={24} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3 text-center">Luxury Quality</h3>
              <p className="text-slate-500 text-center">
                Premium ingredients sourced ethically from around the world for exceptional results.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100"
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-rose-50 text-rose-600 mx-auto mb-5">
                <Heart size={24} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3 text-center">Cruelty Free</h3>
              <p className="text-slate-500 text-center">
                Never tested on animals. PETA certified and 100% vegan formulations.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-screen-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Meet Our Founders</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              The passionate team behind Crystal Beauty's innovation and vision.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Elena Rodriguez",
                role: "Founder & CEO",
                bio: "Cosmetic chemist with 15+ years in luxury beauty",
                img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1588&auto=format&fit=crop"
              },
              {
                name: "Marcus Chen",
                role: "Head of Product",
                bio: "Specialist in sustainable ingredient sourcing",
                img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1587&auto=format&fit=crop"
              },
              {
                name: "Sophie Laurent",
                role: "Creative Director",
                bio: "Award-winning beauty industry designer",
                img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1661&auto=format&fit=crop"
              },
              {
                name: "David Park",
                role: "Head of Research",
                bio: "PhD in Dermatological Science",
                img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1587&auto=format&fit=crop"
              }
            ].map((person, index) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <div className="relative rounded-full overflow-hidden w-48 h-48 mx-auto mb-4 shadow-md">
                  <img 
                    src={person.img} 
                    alt={person.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-slate-800">{person.name}</h3>
                <p className="text-sky-600 font-medium mb-2">{person.role}</p>
                <p className="text-slate-500 text-sm">{person.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-sky-600 to-indigo-600 text-white px-4">
        <div className="max-w-screen-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience Crystal Beauty?</h2>
            <p className="text-lg text-sky-100 max-w-2xl mx-auto mb-8">
              Join thousands of satisfied customers who trust our products for their beauty routine.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-3 bg-white hover:bg-gray-100 text-sky-600 font-bold py-4 px-10 rounded-full shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
            >
              <Sparkles size={20} />
              Shop Now
              <ChevronRight size={18} className="ml-1" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}