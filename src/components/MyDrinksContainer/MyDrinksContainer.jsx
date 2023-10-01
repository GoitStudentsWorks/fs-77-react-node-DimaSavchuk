import { CommonContainer } from '../GlobalStyles/CommonContainer.styled';
import {
  Section,
  Title,
} from '../FavoritesContainer/FavoritesContainer.styled';
import { useEffect, useState } from 'react';
import { CardsContainer } from '../DrinkCard/DrinkCard.styled';
import { useSearchParams } from 'react-router-dom';
import { Loader } from '../Loader/Loader';
import { Paginator } from '../Paginator/Paginator';
import { InfoComponent } from '../InfoComponent/InfoComponent';
import { checkAndSetPage, countElements, displayedFavoriteCards, fetchOwn, handlePageChange, updLimit } from '../../helpers';

const MyDrinksContainer = () => {
  const [cards, setCards] = useState([]);
  const [isloading, setIsloading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get('page')
    ? Number(searchParams.get('page')) - 1
    : 0;
  const [currentPage, setCurrentPage] = useState(page);
  const [limit, setLimit] = useState(null);
  const [pageRangeDisplayed, setPageRangeDisplayed] = useState(3);
  const [showPagination, setShowPagination] = useState(false);

  
  useEffect(() => {
    fetchOwn(setIsloading, setCards);
  }, []);

  const pagesVisited = currentPage * limit;
  updLimit(setLimit, setPageRangeDisplayed);

  useEffect(() => {
      const { newLimit, newPageRangeDisplayed } = updLimit();
      setLimit(newLimit);
    setPageRangeDisplayed(newPageRangeDisplayed);
    
      window.addEventListener('resize', updLimit);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    return () => {
      window.removeEventListener('resize', updLimit);
    };
  }, []);

  useEffect(() => {
    if (cards.length > limit) {
      setShowPagination(true);
    } else {
      setShowPagination(false);
    }
  }, [cards.length, limit]);

  const { numberOfElementsOnPage } = countElements(cards, currentPage, limit);

  useEffect(() => {
    checkAndSetPage(
      numberOfElementsOnPage,
      currentPage,
      setSearchParams,
      setCurrentPage,)
  }, [numberOfElementsOnPage, currentPage, setSearchParams]);

    const displayedCards = displayedFavoriteCards(
      cards,
      pagesVisited,
      limit,
      setCards,
    );

  return (
    <Section>
      <CommonContainer>
        <div>
          <Title>My drinks</Title>
          {isloading ? (
            <Loader />
          ) : cards.length > 0 ? (
            <>
              <CardsContainer>{displayedCards}</CardsContainer>
              {showPagination && (
                <Paginator
                  limit={limit}
                  currentPage={currentPage}
                  itemsLength={cards.length}
                  handlePageChange={(page) =>
                    handlePageChange(page, setSearchParams, setCurrentPage)
                  }
                  pageRangeDisplayed={pageRangeDisplayed}
                />
              )}
            </>
          ) : (
            <InfoComponent>
              You haven't added any own cocktails yet
            </InfoComponent>
          )}
        </div>
      </CommonContainer>
    </Section>
  );
};

export default MyDrinksContainer;
