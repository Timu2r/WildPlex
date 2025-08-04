import { useState } from 'react';

export const useShop = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemType, setItemType] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState('1');
  const [selectedDuration, setSelectedDuration] = useState('3m');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState('privileges');

  const calculatePrice = (item, id, currentItemType) => {
    const type = currentItemType || itemType;
    if (type === 'privilege') {
      if (!item || !item.prices || !id) return 0;
      return item.prices[id] || 0;
    } else if (type === 'case') {
      if (!item || !item.quantities || !id) return 0;
      const selectedQuantityData = item.quantities.find(q => q.id === id);
      return selectedQuantityData ? selectedQuantityData.price : 0;
    }
    return 0;
  };

  const handlePurchase = () => {
    if (!nickname.trim()) {
      alert('Пожалуйста, введите никнейм');
      return;
    }
    if (!email.trim()) {
      alert('Пожалуйста, введите электронную почту');
      return;
    }

    alert(`Покупка совершена для игрока ${nickname} (${email})!`);
    setShowModal(false);
    setSelectedItem(null);
    setItemType(null);
    setSelectedDuration('forever');
    setSelectedQuantity(null);
  };

  return {
    selectedItem,
    setSelectedItem,
    itemType,
    setItemType,
    selectedQuantity,
    setSelectedQuantity,
    selectedDuration,
    setSelectedDuration,
    nickname,
    setNickname,
    email,
    setEmail,
    showModal,
    setShowModal,
    activeCategory,
    setActiveCategory,
    calculatePrice,
    handlePurchase,
  };
};