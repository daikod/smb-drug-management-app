'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function LearnMore() {
  const router = useRouter();
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }
      });
    });

    cardsRef.current.forEach(card => {
      if (card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
      }
    });

    return () => observer.disconnect();
  }, []);

  const handleReturnToSignIn = () => {
    router.push('/sign-in');
  };

  const features = [
    {
      icon: '🏥',
      title: 'Broad Institutional Use',
      description: 'Designed for hospitals, clinics, pharmacies, and distribution centers. Our scalable architecture adapts to organizations of all sizes, from single-location pharmacies to multi-facility healthcare networks, ensuring seamless integration across your entire operation.'
    },
    {
      icon: '🤖',
      title: 'Enhanced AI Analytics',
      description: 'Leverage artificial intelligence to predict demand patterns, optimize stock levels, and prevent shortages. Our advanced analytics engine provides actionable insights, identifying trends and anomalies to help you make data-driven decisions that reduce waste and improve patient care.'
    },
    {
      icon: '💳',
      title: 'Transaction Processing',
      description: 'Process orders, sales, and transfers with lightning speed. Our robust transaction system handles complex workflows including prescription processing, insurance claims, batch tracking, and automated billing with complete accuracy and compliance.'
    },
    {
      icon: '🚚',
      title: 'Supply Chain Management',
      description: 'Track drug supplies from manufacturer to patient. Monitor shipments in real-time, manage vendor relationships, automate reordering, and maintain optimal inventory levels across multiple locations with intelligent distribution algorithms.'
    },
    {
      icon: '🏢',
      title: 'Institutional Remittance',
      description: 'Streamline drug distribution to partner institutions with automated remittance tracking, delivery confirmation, and reconciliation. Generate detailed reports for auditing and compliance while maintaining complete traceability of every transaction.'
    },
    {
      icon: '📊',
      title: 'Comprehensive Reporting',
      description: 'Access detailed reports on inventory levels, expiration dates, sales trends, and financial metrics. Export data in multiple formats, schedule automated reports, and visualize key performance indicators through intuitive dashboards.'
    },
    {
      icon: '🔒',
      title: 'Security & Compliance',
      description: 'Meet regulatory requirements with built-in compliance features. Our system ensures data security through encryption, role-based access control, audit trails, and adherence to pharmaceutical industry standards and healthcare regulations.'
    },
    {
      icon: '📱',
      title: 'Mobile Accessibility',
      description: 'Manage your inventory on the go with our responsive design. Access critical information, approve transactions, and receive alerts from any device, ensuring you stay connected to your operations 24/7.'
    },
    {
      icon: '⚡',
      title: 'Real-Time Synchronization',
      description: 'All your locations stay synchronized in real-time. Updates are instant across the entire network, preventing stock discrepancies and ensuring accurate inventory counts at every facility.'
    }
  ];

  return (
    <div className="min-h-screen p-5" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="relative text-white px-10 py-16 text-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 animate-float" style={{ 
              background: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '50px 50px'
                }} />
                </div>
          <h1 className="relative z-10 text-5xl font-bold mb-3">SM Balgwe Drug Inventory</h1>
          <p className="relative z-10 text-xl opacity-90">Next-Generation Pharmaceutical Management System</p>
            </div>

        <div className="px-10 py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-5" style={{ color: '#667eea' }}>
              Revolutionizing Drug Inventory Management
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto">
              SM Balgwe Drug Inventory Management Application is a comprehensive pharmaceutical management solution designed to streamline operations across healthcare institutions, pharmacies, and distribution networks. Our platform combines cutting-edge technology with intuitive design to deliver unparalleled efficiency in drug inventory control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                ref={el => { cardsRef.current[index] = el; }}
                className="rounded-2xl p-8 relative overflow-hidden transition-all duration-300 hover:-translate-y-3 hover:shadow-xl"
                style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}
              >
                <div className="absolute top-0 left-0 w-full h-1.5" style={{ background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)' }} />
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-gray-800 text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center p-10 rounded-2xl mt-10" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <h2 className="text-white text-4xl font-bold mb-5">Ready to Transform Your Operations?</h2>
            <p className="text-white text-lg mb-8 opacity-90">
              Join leading healthcare institutions that trust SM Balgwe for their drug inventory management needs.
            </p>
            <button
              onClick={handleReturnToSignIn}
              className="inline-block px-10 py-4 bg-white rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:-translate-y-1 hover:shadow-2xl hover:bg-gray-50"
              style={{ color: '#667eea' }}
            >
                Return to Sign In
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        .animate-float {
          animation: float 20s linear infinite;
        }
      `}</style>
    </div>
  );
}