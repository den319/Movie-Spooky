
// ----------------------------- VARIABLES -------------------------------------
     
let flag1= true;

let prevBtn;
let currBtn;

let currentPage= 1;
let totalPages;

let movie_list= [];

let sorted_button= false;
let watchlist_button= false;


// elements

const menu_logo= document.getElementById('menu-logo');
const menu_dropedown= document.getElementById('menu-dropedown');
const dropedown_closeBtn= document.getElementById('close-dropedown-a');

const sortBtn= document.getElementById('sorting-container');
const sort_dropedown_content= document.getElementById('sort-dropedown-content');


const search_movie_input= document.getElementById('search-input');

const search_request= document.getElementById('search-request');

const movie_sorting_btn= document.getElementById('sort-dropedown-content');
const sort_by_popularity_highest= document.getElementById('movie-popularity-highest');
const sort_by_popularity_lowest= document.getElementById('movie-popularity-lowest');
const sort_by_newest= document.getElementById('movie-newest');
const sort_by_oldest= document.getElementById('movie-oldest');
const sort_by_ratings_highest= document.getElementById('movie-ratings-highest');
const sort_by_ratings_lowest= document.getElementById('movie-ratings-lowest');

const movie_section= document.getElementById('movies-cards-container');

const page_section= document.getElementById('pagination-section');

const previous_page_btn= document.getElementById('previous-button');
const next_page_btn= document.getElementById('next-button');
const curr_page= document.getElementById('current-page-num');

const watchlist_section_button= document.getElementById('favourite-section');



// URLs

const options = {
    method: 'GET',
    headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNmY4ODg2ZGIxZDAxY2FlODRjNTg5Nzk1NDAzNWU3MSIsInN1YiI6IjY0OTZmMGI3OTU1YzY1MDEwNTlkMDYzMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.PepSwH4ClEWr3eFqOp_d9NKA4fRxjRSxwyWCX9JQ2ao'
    }
}; 

const apiKey= `&api_key=36f8886db1d01cae84c5897954035e71`;
const search_movie_url= `https://api.themoviedb.org/3/search/movie?query=`;

const all_movies_url= `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=`;
const base_url= `https://api.themoviedb.org/3/discover/movie?language=en-US&page=`;
const sortByPopularityHigh_url= `&sort_by=popularity.desc` + apiKey;
const sortByPopularityLow_url= `&sort_by=popularity.asc` + apiKey;
const sortByNewest_url= `&sort_by=primary_release_date.desc` + apiKey;
const sortByOldest_url= `&sort_by=primary_release_date.asc` + apiKey;
const sortByRatingsHigh_url= `&sort_by=vote_average.desc` + apiKey;
const sortByRatingsLow_url= `&sort_by=vote_average.asc` + apiKey;

let global_movie_id;
const trailer_url1= `https://api.themoviedb.org/3/movie/`;
const trailer_url2= `/videos?language=en-US`+ apiKey;
let curr_url= all_movies_url + currentPage;
let prev_url;

let curr_sorted_url;
let prev_sorted_url;



// local storage operations

function get_movies_from_local() {
    const list_of_fav_movies_string= JSON.parse(localStorage.getItem('my_watchlist'));

    if(list_of_fav_movies_string === null || list_of_fav_movies_string === undefined) {
        return [];
    } else {
        return list_of_fav_movies_string;
    }
}

function set_movie_to_local(movie_id) {
    const list_of_fav_movies= get_movies_from_local();

    let is_id_exists= false;

    for(let i=0; i<list_of_fav_movies.length; i++) {
        if(list_of_fav_movies[i] == movie_id) {
            is_id_exists= true;
            break;
        }
    }

    let arr_list_of_fav_movies= list_of_fav_movies;
    if(!is_id_exists) {
         arr_list_of_fav_movies= [...list_of_fav_movies, movie_id];
    } 

    

    localStorage.setItem('my_watchlist', JSON.stringify(arr_list_of_fav_movies));
}

function remove_movie_from_local(movie_id) {
    const list_of_fav_movies= get_movies_from_local();
    const filtered_movie_list= list_of_fav_movies.filter((id) => id != movie_id);
    localStorage.setItem('my_watchlist', JSON.stringify(filtered_movie_list));
}

// UI

function resetAllBtns() {
    menu_dropedown.style.display= 'none';
    search_movie_input.value= '';
    sort_dropedown_content.style.display= 'none';
    
}

menu_logo.addEventListener("click", () => {
    
    if(menu_dropedown.style.display == 'block') {
        menu_dropedown.style.display= 'none';
    } else {
        menu_dropedown.style.display= 'block';
    }
});

if(dropedown_closeBtn) {
    dropedown_closeBtn.addEventListener("click", () => {
        menu_dropedown.style.display= 'none';
    });
}


menu_dropedown.addEventListener("click", (event) => {
    if(event.target.id === 'home') {
        menu_dropedown.style.display= 'none';
    } else if(event.target.id === 'about-us') {
        menu_dropedown.style.display= 'none';
    } else if(event.target.id === 'sign-in') {
        menu_dropedown.style.display= 'none';
    }
});




sortBtn.addEventListener('click', (event) => {
        
        if(flag1) {
            sort_dropedown_content.style.display= 'block';
            flag1= false;
        } else {
            sort_dropedown_content.style.display= 'none';
            flag1= true;
        }
});


            
// search- bar
    async function searchMovie(url) {

        try {
            const response= await fetch(url);  // in form of promise

            const data= await response.json(); // to convert promise into json form

            const changed_data= remapData(data);

            render_movies(changed_data);

            console.log(changed_data);
            return changed_data;

        } catch(error) {
            alert("Error: Not found");
        }
    }


    search_request.addEventListener('click', (event) => {
        event.preventDefault();
        const movieName= search_movie_input.value;
        sorted_button= false;

        try {
            if(movieName === '') {
               
                fetchMovies(all_movies_url + currentPage);
                prev_url= curr_url;
                curr_url= all_movies_url;

            } else {
                currentPage= 1;
                searchMovie(search_movie_url + movieName + apiKey);
                resetAllBtns();
                prev_url= curr_url;
                curr_url= search_movie_url + movieName + apiKey;
            }
        } catch(error) {
            alert('Error: Not found');
        }
        
    });
    

// sort movies

    movie_sorting_btn.addEventListener('click', async(event) => {
        currentPage= 1;
        event.preventDefault();
        sorted_button= true;
        watchlist_section_button.innerHTML= 'Watchlist';
        watchlist_section_button.style.backgroundColor= '#112D32';
        watchlist_section_button.style.color= '#88BDBC';

        curr_page.innerHTML= `${currentPage}`;

        // 1.
        if(event.target.id === 'movie-popularity-highest') {

            sort_by_popularity_highest.style.backgroundColor= '#88bdbc36';
            sort_by_popularity_highest.style.color= '#b5b5b5fa';
            sort_by_popularity_highest.style.borderRadius= '6px';
            
            try {
                fetch_sorted_movies(base_url, sortByPopularityHigh_url, currentPage);

            } catch(error) {
                alert("Error: Not found");
            }  
            prevBtn= currBtn;
            currBtn= sort_by_popularity_highest;
            
            prevBtn.style.backgroundColor= '#112D32';
            prevBtn.style.color= '#88BDBC';
            prevBtn.style.borderRadius= '6px';
            
            resetAllBtns();
            // 2.
        } else if(event.target.id === 'movie-popularity-lowest') {
            
            sort_by_popularity_lowest.style.backgroundColor= '#88bdbc36';
            sort_by_popularity_lowest.style.color= '#b5b5b5fa';
            sort_by_popularity_lowest.style.borderRadius= '6px';

            try {
                fetchMovies(base_url, sortByPopularityLow_url, currentPage);

            } catch(error) {
                alert("Error: Not found");
            } 
            prevBtn= currBtn;
            currBtn= sort_by_popularity_lowest;
            
            prevBtn.style.backgroundColor= '#112D32';
            prevBtn.style.color= '#88BDBC';
            prevBtn.style.borderRadius= '6px';

            resetAllBtns();
            // 3.
        } else if(event.target.id === 'movie-newest') {
            
            sort_by_newest.style.backgroundColor= '#88bdbc36';
            sort_by_newest.style.color= '#b5b5b5fa';
            sort_by_newest.style.borderRadius= '6px';

            try {
                // currentPage= 1;
                fetchMovies(base_url, sortByNewest_url, currentPage);

            } catch(error) {
                alert("Error: Not found");
            } 
            prevBtn= currBtn;
            currBtn= sort_by_newest;
            
            prevBtn.style.backgroundColor= '#112D32';
            prevBtn.style.color= '#88BDBC';
            prevBtn.style.borderRadius= '6px';

            resetAllBtns();
            // 4.
        } else if(event.target.id === 'movie-oldest') {
            
            sort_by_oldest.style.backgroundColor= '#88bdbc36';
            sort_by_oldest.style.color= '#b5b5b5fa';
            sort_by_oldest.style.borderRadius= '6px';
            
            try {
                // currentPage= 1;
                fetchMovies(base_url, sortByOldest_url, currentPage);

            } catch(error) {
                alert("Error: Not found");
            } 
            prevBtn= currBtn;
            currBtn= sort_by_oldest;
            
            prevBtn.style.backgroundColor= '#112D32';
            prevBtn.style.color= '#88BDBC';
            prevBtn.style.borderRadius= '6px';

            resetAllBtns();
            // 5.
        } else if(event.target.id === 'movie-ratings-highest') {
            
            sort_by_ratings_highest.style.backgroundColor= '#88bdbc36';
            sort_by_ratings_highest.style.color= '#b5b5b5fa';
            sort_by_ratings_highest.style.borderRadius= '6px';
            
            try {
                // currentPage= 1;
                fetchMovies(base_url, sortByRatingsHigh_url, currentPage);

            } catch(error) {
                alert("Error: Not found");
            } 
            prevBtn= currBtn;
            currBtn= sort_by_ratings_highest;
            
            prevBtn.style.backgroundColor= '#112D32';
            prevBtn.style.color= '#88BDBC';
            prevBtn.style.borderRadius= '6px';

            resetAllBtns();
            // 6.
        } else if(event.target.id === 'movie-ratings-lowest') {
            
            sort_by_ratings_lowest.style.backgroundColor= '#88bdbc36';
            sort_by_ratings_lowest.style.color= '#b5b5b5fa';
            sort_by_ratings_lowest.style.borderRadius= '6px';

            try {
                // currentPage= 1;
                fetchMovies(base_url, sortByRatingsLow_url, currentPage);

            } catch(error) {
                alert("Error: Not found");
            } 
            prevBtn= currBtn;
            currBtn= sort_by_ratings_lowest;
            
            prevBtn.style.backgroundColor= '#112D32';
            prevBtn.style.color= '#88BDBC';
            prevBtn.style.borderRadius= '6px';

            resetAllBtns();
        }
    });



// fetch trailer
    async function fetch_trailer(movie_id) {
        try {
            const url= trailer_url1 + movie_id + trailer_url2;

            const response= await fetch(url, options);

            const data= await response.json();
            return data;
        } catch(error) {
            alert(`Error: Not found`);
        }
    }



// fetching movies
    async function fetch_sorted_movies(url1, url2, currentPage) {
        try {
            const response= await fetch(url1 + currentPage + url2, options);
            const data= await response.json();

            const {total_pages}= data;
            totalPages= total_pages;
            
            const changed_data= remapData(data);
            movie_list= changed_data;
            
            render_movies(changed_data);

            prev_sorted_url= curr_sorted_url;
            curr_sorted_url= url2;

            
            return changed_data;            
        } catch(error) {
            alert("Error: Not found");
        }
    }

    async function fetch_movies_with_id(id) {
        try {
            const url= `https://api.themoviedb.org/3/movie/${id}?api_key=c13145a90d2d1748b8e9ec01e895106e`;

            const response= await fetch(url, options);

            const data= await response.json();

            const changed_date= data.release_date.slice(0, 7);

            return {
                movie_id: data.id,
                genreId: data.genre_ids,
                title: data.title,
                date: changed_date,
                rate: data.vote_average,
                posterPath: data.poster_path,
                popularity: data.popularity,
            }
        } catch(error) {
            alert(`Error: Not found`);
        }
        

    }

    async function fetchMovies(url, currentPage) {

        try {
            const response= await fetch(url+currentPage, options);  

            const data= await response.json();

            const {total_pages}= data;
            totalPages= total_pages;
            
            const changed_data= remapData(data);
            movie_list= changed_data;
            
            render_movies(changed_data);

            prev_url= curr_url;
            curr_url= url;

            
            return changed_data;

        } catch(error) {
            alert("Error: Not found");
        }
    }

    function remapData(data) {
        const movieList= data.results;

        const modifiedMovieList= movieList.map(movie => {
            const changed_date= movie.release_date.slice(0, 7);
            return {
                movie_id: movie.id,
                genreId: movie.genre_ids,
                title: movie.title,
                date: changed_date,
                rate: movie.vote_average,
                posterPath: movie.poster_path,
                popularity: movie.popularity,
            }
        });

        return modifiedMovieList;
    } 

    

    fetchMovies(all_movies_url, currentPage);

    function render_movies(movieList) {
        
        totalPages= movieList.length;
        

        const fav_movie_list= get_movies_from_local();

        movie_section.innerHTML= '';
        movieList.forEach(movie => {
            
            let {title, date, rate, posterPath, popularity, movie_id}= movie;

            const isFavourite= fav_movie_list.indexOf(movie_id) > -1;

            const cardDiv_1= document.createElement('div'); 
            cardDiv_1.setAttribute('class', 'movie');
            cardDiv_1.setAttribute('id', `movie-${movie_id}`);

            const movie_card= document.createElement('div');
            movie_card.setAttribute('class', 'movie-card');

            movie_section.appendChild(cardDiv_1);
            cardDiv_1.appendChild(movie_card);

                const movie_img= document.createElement('img');
                movie_img.setAttribute('class', 'movie-image');
                movie_img.setAttribute('id', `movie-image-${movie_id}`);
                const image_url= 'https://image.tmdb.org/t/p/original';
                movie_img.src = image_url + posterPath;
                movie_card.appendChild(movie_img);


                const card_details= document.createElement('div');
                card_details.setAttribute('class','card-details')
                movie_card.appendChild(card_details);

                    const card_title= document.createElement('h3');
                    card_title.setAttribute('class', 'card-title');
                    card_title.setAttribute('id', `movie-title-${movie_id}`);
                    card_title.innerHTML=`${title}`;
                    card_details.appendChild(card_title);

                    const meta_info= document.createElement('div');
                    meta_info.setAttribute('class','meta-info');
                    meta_info.setAttribute('id',`for-movie-card-${movie_id}`);
                    card_details.appendChild(meta_info);

                        const movie_date= document.createElement('p');
                        movie_date.setAttribute('id','movie-date');
                        movie_date.innerHTML= `Released: ${date}`;
                        meta_info.appendChild(movie_date);

                        const movie_ratings= document.createElement('p');
                        movie_ratings.setAttribute('id','movie-ratings');
                        movie_ratings.innerHTML= `Ratings: ${rate}`
                        meta_info.appendChild(movie_ratings);

                        const movie_popularity= document.createElement('p');
                        movie_popularity.setAttribute('id','movie-popularity');
                        movie_popularity.innerHTML= `Popularity: ${popularity}`
                        meta_info.appendChild(movie_popularity);

                    const movie_watchlist_div= document.createElement('div');
                    movie_watchlist_div.setAttribute('class','movie-watchlist-div');
                    movie_watchlist_div.setAttribute('id', `movie-watchlist-div-${movie_id}`);
                    card_details.appendChild(movie_watchlist_div);

                        if(isFavourite) {
                            const movie_button= document.createElement('button');
                            movie_button.setAttribute('class', 'movie-remove-button-1');
                            movie_button.setAttribute('id', `${movie_id}`);
                            movie_button.innerHTML= 'Remove';
                            movie_watchlist_div.appendChild(movie_button);
                        } else {
                            const movie_button= document.createElement('button');
                            movie_button.setAttribute('class', 'movie-watchlist-button-1');
                            movie_button.setAttribute('id', `${movie_id}`);
                            movie_button.innerHTML= 'Watchlist';
                            movie_watchlist_div.appendChild(movie_button);

                                const fa_plus= document.createElement('i');
                                fa_plus.classList='fa-solid fa-plus';
                                fa_plus.setAttribute('id', `item-${movie_id}`);
                                movie_button.appendChild(fa_plus);
                        }

                        const movie_trailer= document.createElement('button');
                        movie_trailer.setAttribute('class','movie-button-2');
                        movie_trailer.setAttribute('id', `trailer-${movie_id}`);
                        movie_trailer.innerHTML= 'Trailer';
                        movie_watchlist_div.appendChild(movie_trailer);


        // for watchlist-tab:
                        
            const watchlist_tab_button= document.getElementById(`${movie_id}`);
            
            watchlist_tab_button.addEventListener('click', (event) => {

                const plus_button= document.getElementById(`item-${movie_id}`);
                const parent= document.getElementById(`movie-watchlist-div-${movie_id}`);

                resetAllBtns();
                
                if(event.target.classList.contains('movie-watchlist-button-1') || event.target.classList.contains('fa-solid')) {

                    set_movie_to_local(movie_id);

                    plus_button.classList.remove('fa-plus', 'fa-solid');
                    watchlist_tab_button.setAttribute('class', 'movie-remove-button-1');
                    watchlist_tab_button.innerHTML= 'Remove';

                } else {
                    // add 'watchlist' tag
                    watchlist_tab_button.setAttribute('class', 'movie-watchlist-button-1');
                    watchlist_tab_button.innerHTML= 'Watchlist';

                    const fa_plus= document.createElement('i');
                    fa_plus.classList.add('fa-plus','fa-solid');
                    fa_plus.setAttribute('id', `item-${movie_id}`);
                    watchlist_tab_button.appendChild(fa_plus);
                    fa_plus.style.display= 'inline-block';

                    remove_movie_from_local(movie_id);        
                }
            });


        // for trailer-tab:
            
            const movie_trailer_btn= document.getElementById(`trailer-${movie_id}`);
            
            movie_trailer_btn.addEventListener('click', (event) => {

                global_movie_id= movie_id;
                
                show_trailer(global_movie_id);
            })

        });

        
    }

async function show_trailer(movie_id) {
    const data= await fetch_trailer(global_movie_id);

    // console.log("trailer data: ", data);
}
    

// pagination functionality

    if(currentPage === 1) {
        previous_page_btn.disabled= true;
        previous_page_btn.style.visibility= 'hidden';
    }
    if(totalPages === 1) {
        next_page_btn.disabled= true;
        next_page_btn.style.visibility= 'hidden';
    }

    page_section.addEventListener('click', (event) => {

        resetAllBtns();
        if(event.target.id === 'previous-button') {

            currentPage--;

            if(currentPage <= 1) {
                previous_page_btn.disabled= true;
                previous_page_btn.style.visibility= 'hidden';
            } else {
                previous_page_btn.style.visibility= 'visible';
                previous_page_btn.disabled= false;
            }

            if(currentPage < totalPages) {
                next_page_btn.style.visibility= 'visible';
                next_page_btn.disabled= false;
            }

            if(sorted_button) {
                fetch_sorted_movies(base_url, curr_sorted_url, currentPage);
            } else {
                fetchMovies(curr_url, currentPage);
            }
            
            curr_page.innerHTML= `${currentPage}`;

        } else if(event.target.id === 'next-button') {

            currentPage++;

            if(currentPage >= totalPages) {
                next_page_btn.disabled= true;
                next_page_btn.style.visibility= 'hidden';
            } else {
                next_page_btn.style.visibility= 'visible';
                next_page_btn.disabled= false;
            }

            if(currentPage > 1) {
                previous_page_btn.style.visibility= 'visible';
                previous_page_btn.disabled= false;
            }

            if(sorted_button) {
                fetch_sorted_movies(base_url, curr_sorted_url, currentPage);
            } else {
                fetchMovies(curr_url, currentPage);
            }
            curr_page.innerHTML= `${currentPage}`;

        }
    });



// watchlist- section:

   
    watchlist_section_button.addEventListener('click', (event) => {

        resetAllBtns();
        sorted_button= false;
        currentPage= 1;

        const sorting_container= document.getElementById('sorting');
        const search_bar= document.getElementById('search-bar');

        if(watchlist_section_button.innerHTML == 'Watchlist') {
            previous_page_btn.disabled= true;
            previous_page_btn.style.visibility= 'hidden';
            next_page_btn.disabled= true;
            next_page_btn.style.visibility= 'hidden';


            watchlist_section_button.innerHTML= 'All'
            watchlist_section_button.style.backgroundColor= '#DEF2F1';
            watchlist_section_button.style.color= '#112D32';

            if((sorting_container.style.display === '' || sorting_container.style.display === 'block') &&
                search_bar.style.display === '' || search_bar.style.display === 'flex') {
                sorting_container.style.display='none';
                search_bar.style.display= 'none';
            }
            render_watchlist();

        } else {
            if(currentPage === 1) {
                previous_page_btn.disabled= true;
                previous_page_btn.style.visibility= 'hidden';
            } else {
                previous_page_btn.disabled = false;
                previous_page_btn.style.visibility= 'visible';
            }
            if(totalPages === 1) {
                next_page_btn.disabled= false;
                next_page_btn.style.visibility= 'visible';
            }

            watchlist_section_button.innerHTML= 'Watchlist'
            watchlist_section_button.style.backgroundColor= '#112D32';
            watchlist_section_button.style.color= '#88BDBC';
            sorting_container.style.display= 'block';
            search_bar.style.display= 'flex';
            fetchMovies(curr_url, currentPage);
        }
    });


    async function render_watchlist() {
        
        movie_section.innerHTML= '';
        const list_of_favs= get_movies_from_local();
        totalPages= list_of_favs.length / 20;
        const fav_movie_data= [];

        for(let i=0; i<list_of_favs.length; i++) {
            const id= list_of_favs[i];

            const response= await fetch_movies_with_id(id);

            fav_movie_data.push(response);
        }
        curr_page.innerHTML= `${currentPage}`;

        render_movies(fav_movie_data);
    };








    








        

        