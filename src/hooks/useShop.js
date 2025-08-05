import { useState } from 'react';
import { players } from '../serverDatabase';

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
    } else if (type === 'currency') {
      if (!item || !item.quantities || !id) return 0;
      const selectedQuantityData = item.quantities.find(q => q.id === id);
      return selectedQuantityData ? selectedQuantityData.price : 0;
    }
    return 0;
  };

  const handlePurchase = async () => {
    if (!nickname.trim()) {
      alert('Пожалуйста, введите никнейм');
      return;
    }
    if (!email.trim()) {
      alert('Пожалуйста, введите электронную почту');
      return;
    }

    const player = players.find(p => p.nickname.toLowerCase() === nickname.toLowerCase());
    if (!player) {
      alert('Игрок не найден');
      return;
    }

    const purchasePayload = {};

    if (itemType === 'privilege') {
      purchasePayload.privilege = selectedItem.toUpperCase();
      purchasePayload.privilegeDuration = selectedDuration;
    } else if (itemType === 'case') {
      const quantity = parseInt(selectedQuantity, 10);
      switch (selectedItem) {
        case 'donation-case':
          purchasePayload.donationCases = quantity;
          break;
        case 'plexiki-case':
          purchasePayload.plexikiCases = quantity;
          break;
        case 'coin-case':
          purchasePayload.coinCases = quantity;
          break;
        case 'title-case':
          purchasePayload.titleCases = quantity;
          break;
        default:
          break;
      }
    } else if (itemType === 'currency') {
      const quantity = parseInt(selectedQuantity, 10);
      switch (selectedItem) {
        case 'plexiki':
          purchasePayload.plexiki = quantity;
          break;
        case 'coins':
          purchasePayload.coins = quantity;
          break;
        default:
          break;
      }
    }

    // Send update to server
    try {
      const response = await fetch(`http://localhost:3001/api/players/${nickname}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchasePayload),
      });

      if (!response.ok) {
        throw new Error('Failed to update player data');
      }

      alert(`Покупка совершена для игрока ${nickname} (${email})!`);
    } catch (error) {
      console.error('Error purchasing item:', error);
      alert('Произошла ошибка при покупке. Пожалуйста, попробуйте еще раз.');
    } finally {
      setShowModal(false);
      setSelectedItem(null);
      setItemType(null);
      setSelectedDuration('3m'); // Reset to default duration
      setSelectedQuantity('1'); // Reset to default quantity
      setNickname(''); // Clear nickname
      setEmail(''); // Clear email
    }
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