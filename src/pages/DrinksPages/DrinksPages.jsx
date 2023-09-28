import { useEffect, useState } from 'react';
import { CocktailCard } from '../../components/CocktailCard/CocktailCard';
import { DrinksSearch } from '../../components/DrinksSearch/DrinksSearch';
import { CommonContainer } from '../../components/GlobalStyles/CommonContainer.styled';
import { PageTitle } from '../../components/PageTitle/PageTitle';
import { Paginator } from '../../components/Paginator/Paginator';
import { CocktailsList, DrinksSection, Wrapper } from './DrinksPages.styled';
import { useSearchParams } from 'react-router-dom';
import { Loader } from '../../components/Loader/Loader';
import { useSelector } from 'react-redux';
import { selectCocktails, selectIsLoading, selectTotalCocktails } from '../../redux/drinks/selectors';
import { InfoComponent } from '../../components/InfoComponent/InfoComponent';


const DrinksPages = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = searchParams.get('page') ? Number(searchParams.get('page')) - 1 : 0;
  
  const cocktails = useSelector(selectCocktails);
  const totalCocktails = useSelector(selectTotalCocktails);
  const isLoading = useSelector(selectIsLoading);
  
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [limit, setLimit] = useState(9);
  const [pageRangeDisplayed, setPageRangeDisplayed] = useState(3);

  const [shouldRenderButtonSearch, setShouldRenderButtonSearch] = useState(false);
  const errorReason = (currentPage + 1 > Math.ceil(totalCocktails / limit));

  const updLimit = () => {
    if (window.innerWidth >= 1440) {
      setLimit(9);
      setShouldRenderButtonSearch(true)
      setPageRangeDisplayed(6);
    } else if (window.innerWidth >= 768) {
      setLimit(10);
      setShouldRenderButtonSearch(true)
    } else {
      setLimit(10);
      setPageRangeDisplayed(3);
      setShouldRenderButtonSearch(false)
    }
  };

  useEffect(() => {
    updLimit();

    window.addEventListener('resize', updLimit);
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    return () => {
      window.removeEventListener('resize', updLimit);
    };
  }, []);

  const displayCocktails = cocktails
    .slice(0, limit)
    .map((cocktail) => (
      <li key={cocktail.id}>
        <CocktailCard data={cocktail} />
      </li>
    ));
  
  const handlePageChange = (page) => {
    setSearchParams({ page: page + 1 });
    setCurrentPage(page);
  };
  
  return (
    <DrinksSection>
      <CommonContainer>
        <PageTitle>Drinks</PageTitle>
        <DrinksSearch
          page={currentPage + 1}
          limit={limit}
          shouldRenderBtn={shouldRenderButtonSearch} />
        
        {isLoading ? <Loader /> : cocktails.length && !errorReason &&
          (
            <Wrapper>
              <CocktailsList>
                {displayCocktails}
              </CocktailsList>
              <Paginator
                limit={limit}
                currentPage={currentPage}
                itemsLength={totalCocktails}
                handlePageChange={handlePageChange}
                pageRangeDisplayed={pageRangeDisplayed}
              />
            </Wrapper>
          )}
        {
          !isLoading && (errorReason || !cocktails.length) &&
          <Wrapper>
            <InfoComponent>We didn`t find anything by your request or some error occured.</InfoComponent>
          </Wrapper>
        }
      </CommonContainer>
    </DrinksSection>
  );
};

export default DrinksPages;
