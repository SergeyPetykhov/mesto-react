import React from 'react';
import Card from '../Card/Card';
import avatarEdit from '../../images/avatar_edit.png'
import { CurrentUserContext } from '../../contexts/CurrentUserContext.js';

function Main({ onEditAvatar, onEditProfile, onAddPlace, onCardClick, onCardLikeClick, onCardDeleteButtonClick, cards }) {
  const currentUser = React.useContext(CurrentUserContext);
  const cardsElements = cards.map((card) => (
    <Card
      card={card}
      key={card._id}
      onCardClick={onCardClick}
      onCardLikeClick={onCardLikeClick}
      onCardDeleteButtonClick={onCardDeleteButtonClick}
    />
  ))


  return (
    <main className="content">
      <section className="profile root__profile">
        <div className="profile__avatar-section" onClick={onEditAvatar}>
          <img
            className="profile__avatar"
            alt="Аватар"
            src={`${currentUser.avatar}`}
          />
          <img
            className="profile__edit-icon"
            src={`${avatarEdit}`}
            alt="Изменить"
          />
        </div>
        <div className="profile__info">
          <h1 className="profile__name">{currentUser.name}</h1>
          <button type="button"
            className="profile__edit-button"
            aria-label="Редактировать"
            onClick={onEditProfile}>
          </button>
          <p className="profile__activity">{currentUser.about}</p>
        </div>
        <button type="button"
          className="profile__add-button"
          aria-label="Добавить"
          onClick={onAddPlace}>
        </button>
      </section>

      <section className="elements root__elements" aria-label="Интересные места">
        <ul className="elements__list">
          {cardsElements};
        </ul>
      </section>
    </main>
  )
}

export default Main;