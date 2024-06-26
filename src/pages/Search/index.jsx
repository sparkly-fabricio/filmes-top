import { GlobalContext } from "../../contexts/AppContext";
import { useState, useContext, useEffect } from "react";
import MainLayout from "../../Layouts/MainLayout";
import Genres from "../../components/Genres";
import { useNavigate } from "react-router-dom";
import { loadFilteredMovies } from "../../utils/loadData";
import ListItems from "../../components/ListItems";
import CircleButton from "../../components/CircleButton";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function Search() {
  const theContext = useContext(GlobalContext);
  const { state, setState } = theContext;
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  function changePage(event, value) {
    setPage(value);
  }

  useEffect(() => {
    const fetchMovies = async () => {
      const movies = await loadFilteredMovies(
        page,
        state.search_text,
        state.search_genres
      );
      setState((prevState) => ({
        ...prevState,
        movies_list: [...movies],
      }));
    };
    fetchMovies();
    if(state.search_text === '' && state.search_genres.length === 0){
      navigate('/')
    }
  }, [page, state.search_genres, state.search_text, setState, navigate]);

  function addGenre(g) {
    if (state.search_genres.includes(g)) {
      setState((prevState) => ({
        ...prevState,
        search_genres: [...prevState.search_genres.filter((i) => i !== g)],
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        search_genres: [...prevState.search_genres, g],
      }));
    }
  }
  
  function selectItem(item){
    setState((prevState) => ({...prevState, selected_item: item}))
    navigate('/info')
  }

  return (
    <MainLayout>
      <CircleButton type="voltar2" icon={faArrowLeft} action={()=>{navigate('/')}} addClass="top_left"/>
      <Genres
        list={state.movie_genres}
        onHandleClick={addGenre}
        selected={state.search_genres}
      />
      {state.movies_list.length > 0 && (
        <ListItems movies={state.movies_list} onHandleClick={selectItem} onHandleChange={changePage} />
      )}
    </MainLayout>
  );
}
