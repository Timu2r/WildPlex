import React from 'react';
import './styles/App.css';
import Header from './components/Header';
import ShopContent from './components/ShopContent';
import PrivilegePurchaseModal from './components/PrivilegePurchaseModal';
import CasePurchaseModal from './components/CasePurchaseModal';
import { useShop } from './hooks/useShop';
import { privileges, cases, durations } from './data';
import { Crown, Gem, Star, Shield } from 'lucide-react';

const App = () => {
  const {
    selectedItem,
    setSelectedItem,
    itemType,
    setItemType,
    selectedDuration,
    setSelectedDuration,
    selectedQuantity,
    setSelectedQuantity,
    nickname,
    setNickname,
    showModal,
    setShowModal,
    activeCategory,
    setActiveCategory,
    calculatePrice,
    handlePurchase,
    email,
    setEmail,
  } = useShop();

  const categories = [
    { id: 'privileges', name: 'Привилегии', icon: <Crown className="w-5 h-5" /> },
    { id: 'cases', name: 'Кейсы', icon: <Shield className="w-5 h-5" /> },
    { id: 'currency', name: 'Валюты', icon: <Gem className="w-5 h-5" /> },
    { id: 'other', name: 'Другое', icon: <Star className="w-5 h-5" /> }
  ];

  return (
    <div className="minecraft-donation-site">
      <Header />
      <div className="container main-layout">
        <div className="category-navigation">
          {categories.map((category) => (
            <button key={category.id} onClick={() => setActiveCategory(category.id)} className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}>
              {category.icon}<span>{category.name}</span>
            </button>
          ))}
        </div>
        <ShopContent
          activeCategory={activeCategory}
          privileges={privileges}
          cases={cases}
          durations={durations}
          selectedDuration={selectedDuration}
          setSelectedDuration={setSelectedDuration}
          setSelectedItem={setSelectedItem}
          setItemType={setItemType}
          setShowModal={setShowModal}
          calculatePrice={calculatePrice}
          nickname={nickname}
          setSelectedQuantity={setSelectedQuantity}
        />
      </div>
      {showModal && itemType === 'privilege' && (
        <PrivilegePurchaseModal
          selectedItem={selectedItem}
          selectedDuration={selectedDuration}
          setSelectedDuration={setSelectedDuration}
          nickname={nickname}
          setNickname={setNickname}
          handlePurchase={handlePurchase}
          setShowModal={setShowModal}
          privileges={privileges}
          durations={durations}
          calculatePrice={calculatePrice}
          email={email}
          setEmail={setEmail}
        />
      )}
      {showModal && itemType === 'case' && (
        <CasePurchaseModal
          selectedItem={selectedItem}
          selectedQuantity={selectedQuantity}
          setSelectedQuantity={setSelectedQuantity}
          nickname={nickname}
          setNickname={setNickname}
          handlePurchase={handlePurchase}
          setShowModal={setShowModal}
          cases={cases}
          calculatePrice={calculatePrice}
          email={email}
          setEmail={setEmail}
        />
      )}
    </div>
  );
};

export default App;
