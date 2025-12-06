import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Search, Package, CreditCard, Truck, RotateCcw, HelpCircle, MessageCircle } from 'lucide-react';
import './FAQ.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Questions', icon: HelpCircle },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'returns', label: 'Returns', icon: RotateCcw },
  ];

  const faqs = [
    {
      category: 'orders',
      question: 'How do I place an order?',
      answer: 'It\'s super easy! Just browse our products, add items to your cart, and proceed to checkout. You\'ll need to create an account or log in, enter your shipping details, and choose your payment method. Once confirmed, you\'ll receive an order confirmation email! 📧'
    },
    {
      category: 'orders',
      question: 'Can I modify or cancel my order?',
      answer: 'You can modify or cancel your order within 1 hour of placing it. After that, our team starts processing orders pretty quickly! If you need help, contact us ASAP at hello@paperly.com and we\'ll do our best to help. 🏃‍♀️'
    },
    {
      category: 'orders',
      question: 'How can I track my order?',
      answer: 'Once your order ships, you\'ll receive an email with a tracking number and link. You can also log into your account and check the "My Orders" section to see real-time updates! 📦'
    },
    {
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit/debit cards (Visa, Mastercard, American Express), GCash, Maya, bank transfers, and Cash on Delivery (COD) for Metro Manila orders. We\'ve got you covered! 💳'
    },
    {
      category: 'payment',
      question: 'Is my payment information secure?',
      answer: 'Absolutely! We use industry-standard SSL encryption and never store your full card details. Your security is our top priority. Shop with confidence! 🔒'
    },
    {
      category: 'payment',
      question: 'Do you offer installment payments?',
      answer: 'Yes! For orders over ₱1,000, you can use credit card installments through participating banks. Just select the installment option at checkout! 📅'
    },
    {
      category: 'shipping',
      question: 'How much is shipping?',
      answer: 'Metro Manila: ₱99 (FREE for orders over ₱1,500!)\nProvincial: ₱149-199 depending on location\nIsland regions: ₱249-299\n\nWe always aim to get you the best rates! 🚚'
    },
    {
      category: 'shipping',
      question: 'How long does delivery take?',
      answer: 'Metro Manila: 2-3 business days\nLuzon (Provincial): 3-5 business days\nVisayas: 5-7 business days\nMindanao: 7-10 business days\n\nWe ship orders Monday-Friday. Orders placed on weekends are processed the next business day! 📬'
    },
    {
      category: 'shipping',
      question: 'Do you ship internationally?',
      answer: 'Not yet, but we\'re working on it! For now, we only ship within the Philippines. Follow us on social media to be the first to know when we go international! 🌏'
    },
    {
      category: 'returns',
      question: 'What is your return policy?',
      answer: 'We offer a 7-day return policy for unused items in original packaging. If you received a damaged or wrong item, we\'ll gladly replace it for free! Just email us with photos within 48 hours of receiving your order. 📸'
    },
    {
      category: 'returns',
      question: 'How do I return an item?',
      answer: '1. Email us at hello@paperly.com with your order number\n2. We\'ll send you a return form\n3. Pack the item securely with the form\n4. Ship it back to us\n5. Refund processed within 5-7 business days after we receive it!\n\nEasy peasy! 🍋'
    },
    {
      category: 'returns',
      question: 'Can I exchange for a different product?',
      answer: 'Yes! If you\'d prefer an exchange instead of a refund, just let us know in your return request. We\'ll process the exchange once we receive your return. If there\'s a price difference, we\'ll sort that out with you! 🔄'
    },
    {
      category: 'orders',
      question: 'Do you offer gift wrapping?',
      answer: 'Yes, we do! 🎁 Add our special gift wrapping service at checkout for just ₱50. Your item will be beautifully wrapped with a ribbon and you can include a personalized message card!'
    },
    {
      category: 'orders',
      question: 'Can I order in bulk for events or corporate gifts?',
      answer: 'Absolutely! We love bulk orders! 🏢 For orders of 20+ items, we offer special discounts and can even do custom branding. Email us at wholesale@paperly.com and let\'s chat!'
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="faq-page">
      {/* Hero */}
      <section className="faq-hero">
        <div className="container">
          <span className="faq-hero__emoji">🤔</span>
          <h1>Frequently Asked Questions</h1>
          <p>Got questions? We've got answers! Can't find what you're looking for? Just ask us!</p>
          
          {/* Search */}
          <div className="faq-search">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="faq-categories">
        <div className="container">
          <div className="faq-categories__list">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`faq-category ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <cat.icon size={18} />
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="faq-content">
        <div className="container">
          <div className="faq-list">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, index) => (
                <div 
                  key={index} 
                  className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                >
                  <button 
                    className="faq-item__question"
                    onClick={() => toggleFAQ(index)}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown size={20} className="faq-item__icon" />
                  </button>
                  <div className="faq-item__answer">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="faq-empty">
                <span>🔍</span>
                <h3>No results found</h3>
                <p>Try different keywords or browse all categories</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Still Need Help */}
      <section className="faq-help">
        <div className="container">
          <div className="faq-help__content">
            <span className="faq-help__emoji">💬</span>
            <h2>Still Have Questions?</h2>
            <p>Our friendly support team is here to help! We typically respond within a few hours.</p>
            <Link to="/contact" className="faq-help__btn">
              <MessageCircle size={18} />
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;