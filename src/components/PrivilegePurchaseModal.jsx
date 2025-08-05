import React, { useEffect, useState, useCallback } from 'react'
import '../styles/PurchaseModal.css'

const privilegeImages = import.meta.glob('../assets/*.{png,jpg,jpeg}', {
  eager: true,
})

const PrivilegePurchaseModal = ({
  selectedItem,
  selectedDuration,
  setSelectedDuration,
  nickname,
  setNickname,
  email,
  setEmail,
  handlePurchase,
  setShowModal,
  privileges,
  durations,
  calculatePrice,
}) => {
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > 1024)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  const handleResize = useCallback(() => {
    setIsLandscape(window.innerWidth > 1024)
    setIsMobile(window.innerWidth <= 768)
  }, [])

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setShowModal(false)
      }
    }

    document.addEventListener('keydown', handleEscKey)
    return () => document.removeEventListener('keydown', handleEscKey)
  }, [setShowModal])

  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      setShowModal(false)
    }
  }, [setShowModal])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleDurationKeyDown = useCallback((e, durationId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setSelectedDuration(durationId)
    }
  }, [setSelectedDuration])

  const handleFormKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && nickname && email) {
      e.preventDefault()
      handlePurchase()
    }
  }, [nickname, email, handlePurchase])
  
  const item = privileges.find(p => p.id === selectedItem)

  if (!item) return null

  const selectedDurationData = durations.find(d => d.id === selectedDuration)

  const finalPrice = selectedDurationData ? calculatePrice(item, selectedDurationData.id, 'privilege') : 0;

  return (
    <div 
      className='modal-overlay' 
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className={`modal-content ${isLandscape ? 'landscape' : ''}`}
        onKeyDown={handleFormKeyDown}
      >
        <div className='modal-header'>
          <h2 id="modal-title" className='modal-title'>
            Подтверждение покупки
          </h2>
          <button
            onClick={() => setShowModal(false)}
            className='modal-close-button'
            aria-label='Закрыть модальное окно'
            type="button"
          >
            ✕
          </button>
        </div>

        <div className={`${isLandscape ? 'modal-body-landscape' : ''}`}>
          <div className={`${isLandscape ? 'modal-left-section-landscape' : ''}`}>
            <div className='modal-privilege-info'>
              <img
                src={privilegeImages[`../assets/${item.image}`]?.default}
                alt={item.name}
                className='modal-privilege-image'
                loading="lazy"
              />
              <div>
                <h3 className='modal-privilege-name'>{item.name}</h3>
                <p className='modal-privilege-duration'>
                  {selectedDurationData?.label || 'Выберите длительность'}
                </p>
              </div>
            </div>

            <div className='modal-nickname-input-container'>
              <label htmlFor='nickname-input' className='modal-nickname-label'>
                Никнейм:
              </label>
              <input
                id='nickname-input'
                type='text'
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                placeholder='Введите никнейм игрока'
                className='modal-nickname-input'
                required
                autoComplete="username"
                maxLength="32"
              />

              <label htmlFor='email-input' className='modal-nickname-label'>
                Электронная почта:
              </label>
              <input
                id='email-input'
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder='Введите электронную почту'
                className='modal-nickname-input'
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className={`${isLandscape ? 'modal-right-section-landscape' : ''}`}>
            <div className='modal-duration-options' role="radiogroup" aria-label="Выберите длительность">
              {durations.map(duration => {
                const price = calculatePrice(item, duration.id, 'privilege')
                const isSelected = selectedDuration === duration.id
                
                return (
                  <div
                    key={duration.id}
                    onClick={() => setSelectedDuration(duration.id)}
                    onKeyDown={(e) => handleDurationKeyDown(e, duration.id)}
                    className={`modal-duration-option ${isSelected ? 'selected' : ''}`}
                    role="radio"
                    aria-checked={isSelected}
                    tabIndex={0}
                    aria-label={`${duration.label}, ${duration.sapphires}, ${price} рублей`}
                  >
                    <div className='modal-duration-details'>
                      <div>
                        <p className='modal-duration-label'>{duration.label}</p>
                        <p className='modal-duration-sapphires'>
                          {duration.sapphires}
                        </p>
                      </div>
                      <div className='text-right'>
                        <p className='modal-duration-price'>{price} ₽</p>
                        {duration.id === '3m' && (
                          <p className='modal-duration-recommend'>
                            Рекомендуем
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {item.commands && (
          <div className='modal-commands-container'>
            <div className='modal-commands-title'>Команды:</div>
            <div className='modal-commands-list' role="list">
              {item.commands.map((command, index) => (
                <p key={index} role="listitem">{command}</p>
              ))}
            </div>
            <div className='modal-commands-title'>Дополнительные функции:</div>
            <div className='modal-commands-list' role="list">
              {item.additionalFeatures.map((additionalFeatures, index) => (
                <p key={index} role="listitem">{additionalFeatures}</p>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handlePurchase}
          className='modal-purchase-button'
          disabled={!nickname?.trim() || !email?.trim() || !selectedDuration}
          type="button"
          aria-label={`Продолжить покупку ${item.name} за ${finalPrice} рублей`}
        >
          {!nickname?.trim() || !email?.trim() 
            ? 'Заполните все поля' 
            : !selectedDuration
            ? 'Выберите длительность'
            : `Купить (${finalPrice} ₽)`
          }
        </button>
      </div>
    </div>
  )
}

export default PrivilegePurchaseModal