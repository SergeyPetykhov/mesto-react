import React from 'react';
import Header from './Header/Header.js';
import Main from './Main/Main.js';
import Footer from './Footer/Footer.js';
import ImagePopup from './ImagePopup/ImagePopup.js';
import EditProfilePopup from './EditProfilePopup/EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup/EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup/AddPlacePopup.js';
import DeletePlacePopup from './DeletePlacePopup/DeletePlacePopup.js';
import api from '../utils/Api'
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';

function App() {
  const [userData, setUserData] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [cardToBeDeleted, setCardToBeDeleted] = React.useState({});
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isEditAvatarPopupLoading, setIsEditAvatarPopupLoading] = React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isEditProfilePopupLoading, setIsEditProfilePopupLoading] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isAddPlacePopupLoading, setIsAddPlacePopupLoading] = React.useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = React.useState(false);
  const [isDeletePopupLoading, setIsDeletePopupLoading] = React.useState(false);

  React.useEffect(() => {
    Promise.all([api.getUserData(), api.getInitialCards()])
      .then(([userData, cards]) => {
        setUserData(userData);
        setCards(cards);
      })
      .catch((err) => {
        console.log(err);
      })
  }, []);

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupLoading(false);
    setIsEditAvatarPopupOpen(true);
  }

  const handleEditProfileClick = () => {
    setIsEditProfilePopupLoading(false);
    setIsEditProfilePopupOpen(true);
  }

  const handleAddCardClick = () => {
    setIsAddPlacePopupLoading(false);
    setIsAddPlacePopupOpen(true);
  }

  const handleDeleteCardClick = (card) => {
    setIsDeletePopupLoading(false);
    setIsDeletePopupOpen(true);
    setCardToBeDeleted(card);
  }

  const handleCardClick = (card) => {
    setSelectedCard(card);
  }

  const handleCardLikeClick = (card) => {
    const isLiked = card.likes.some(i => i._id === userData._id);

    if (!isLiked) {
      api.likeCard(card._id)
        .then((newCard) => {
          setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        })
        .catch((err) => {
          console.log(err);
        });
    }
    else {
      api.dislikeCard(card._id)
        .then((newCard) => {
          setCards((cards) => cards.map((c) => c._id === card._id ? newCard : c));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  const handleCardDeleteSubmitButtonClick = () => {
    setIsDeletePopupLoading(true);
    api.deleteCard(cardToBeDeleted._id)
      .then(() => {
        setCards((cards) => cards.filter(c => c._id !== cardToBeDeleted._id));
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleUpdateUser = (newUserData) => {
    setIsEditProfilePopupLoading(true);
    api.updateUserData(newUserData)
      .then((res) => {
        setUserData(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleUpdateAvatar = (newLink) => {
    setIsEditAvatarPopupLoading(true);
    api.updateUserAvatar(newLink)
      .then((res) => {
        setUserData(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleAddCard = (newImageData) => {
    setIsAddPlacePopupLoading(true);
    api.postNewCard(newImageData)
      .then((res) => {
        setCards([res, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsDeletePopupOpen(false);
    setSelectedCard(null);
  }

  return (
    <CurrentUserContext.Provider value={userData}>
        <Header />

        <Main
          onEditAvatar={handleEditAvatarClick}
          onEditProfile={handleEditProfileClick}
          onAddPlace={handleAddCardClick}
          onCardClick={handleCardClick}
          onCardLikeClick={handleCardLikeClick}
          onCardDeleteButtonClick={handleDeleteCardClick}
          cards={cards}
        />

        <Footer />

        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          isLoading={isEditAvatarPopupLoading}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          isLoading={isEditProfilePopupLoading}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          isLoading={isAddPlacePopupLoading}
          onClose={closeAllPopups}
          onAddPlace={handleAddCard}
        />

        <DeletePlacePopup
          isOpen={isDeletePopupOpen}
          isLoading={isDeletePopupLoading}
          onClose={closeAllPopups}
          onCardDeleteSubmitButtonClick={handleCardDeleteSubmitButtonClick}
        />
    </CurrentUserContext.Provider>
  );
}

export default App;
