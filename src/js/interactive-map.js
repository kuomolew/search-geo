$( () => {
    
    const SET = ["UKR", "PRK", "RUS", "FRA", "ESP", "SWE", "NOR", "DEU", "FIN", "POL", "ITA", "GBR", "ROU", "BLR", "KAZ", "GRC",
                 "BGR", "ISL", "HUN", "PRT", "AUT", "CZE", "SRB", "IRL", "LTU", "LVA", "HRV", "BIH", "SVK", "EST", "DNK", "CHE",
                 "NLD", "MDA", "BEL", "ARM", "ALB", "MKD", "TUR", "SVN", "MNE", "CYP", "AZE", "LUX", "GEO", "AND", "MLT", "LIE",
                 "SMR", "MCO", "VAT", "GIB", "NGA", "ETH", "EGY", "COD", "ZAF", "TZA", "KEN", "SDN", "DZA", "UGA", "MAR", "MOZ",
                 "GHA", "AGO", "CIV", "MDG", "CMR", "NER", "BFA", "MLI", "MWI", "ZMB", "SOM", "SEN", "TCD", "ZWE", "RWA", "TUN",
                 "GIN", "BEN", "BDI", "SSD", "TGO", "ERI", "SLE", "LBY", "COG", "CAF", "LBR", "MRT", "NAM", "BWA", "LSO", "GMB",
                 "GAB", "GNB", "GNQ", "SWZ", "DJI", "ESH", "USA", "MEX", "CAN", "GTM", "CUB", "HTI", "DOM", "HND", "SLV", "NIC",
                 "CRI", "PAN", "PRI", "JAM", "TCA", "BLZ", "BRA", "COL", "ARG", "PER", "VEN", "CHL", "ECU", "BOL", "PRY", "URY",
                 "GUY", "SUR", "GUF", "CHN", "IND", "SAU", "IRN", "MNG", "IDN", "PAK", "MMR", "AFG", "YEM", "THA", "TKM", "UZB",
                 "IRQ", "JPN", "VNM", "MYS", "OMN", "PHL", "LAO", "KGZ", "SYR", "KHM", "BGD", "NPL", "TJK", "KOR", "JOR", "ARE",
                 "LKA", "BTN", "TWN", "KWT", "TLS", "QAT", "LBN", "ISR", "BRN", "BHR", "SGP", "HKG", "MAC", "AUS", "PNG", "NZL",
                 "FJI", "NCL", "SLB"];
    const DEFAULT_COLOR = "rgb(150, 150, 150)";     // fill color of counties on map by default
    const HOVER_COLOR = "rgb(100, 100, 100)";       // fill color of countries in DB on hover
    const NOT_IN_DB_HOVER_COLOR = "rgb(0, 0, 255)"; // fill color of countries NOT in DB on hover
    const CLICK_COLOR = "rgb(255, 0, 0)";           // fill color of country after left click on it
    const SEARCH_COLOR = "rgb(74, 128, 74)";        // fill color of countries that are matching to search results
    const ERROR_COLOR = "rgb(255, 214, 214)";       // fill color of countries in case of error

    const MAX_COUNTRIES_TO_SHOW = 10;

    
    init();

    function init() {
        
        mapHover();
        mapCountryChoose();
        resultsHover();
        resultsClick();
        
        if ( $(window).width() > 988 ) {
            showVisited();
            mapRightClick();
            pinImgRightClick();
        }
        
        new WOW().init();
    
        $('#search').on('keyup', (e) => {
            e.preventDefault();
            removeHighLight();
            if ( $('#search').val() ) {
                let search = $('#search').val();
                let type = $('#select').val();
                requestList(search, type);
            } else {
                $('#results').empty();
                $('#country-full-info').hide();
            }
        });
    
        // $('#button').on('click', (e) => {
        //     e.preventDefault();
        //     removeHighLight();
        //     if ( $('#search').val() ) {
        //         let search = $('#search').val();
        //         let type = $('#select').val();
        //         requestList(search, type);
        //     }
        // });
    }

    /**
     * requesting countries list by search info
     * @param {String} search - input value
     * @param {String} type - select value
     */
    function requestList(search, type) {
        let  api = `https://restcountries.eu/rest/v2/`;
        if (type == 'name') {
            api = `${api}name/${search}`;
        } else if (type == 'capital') {
            api = `${api}capital/${search}`;
        } else {
            console.log('Request type error!');
        }

        fetch(api)
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data.status != 404) {
                    searchHighlight(data);
                    results(data);
                } else {
                    error();
                }
                
            })
            .catch(err => {
                console.log("ERROR:", err.toString())
            });
    }

    /**
     * Request country info by alpha3Code
     * @param {String} alpha3Code - international country 3-letters alpha3Code
     */
    function requestCountry(alpha3Code) {
        let  api = `https://restcountries.eu/rest/v2/alpha/${alpha3Code}`;
        fetch(api)
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data.status != 404) {
                    showCountry(data);
                } else {
                    error();
                }
                
            })
            .catch(err => {
                console.log("ERROR:", err.toString())
            });
    }

    /**
     * Returns country name by alpha3Code
     * @param {String} item 
     */
    function getNameByCode(item) {
        let  api = `https://restcountries.eu/rest/v2/alpha/${item.innerText}`;
        fetch(api)
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data.status != 404) {
                    item.innerText = data.name;
                } else {
                    error();
                }
                
            })
            .catch(err => {
                console.log("ERROR:", err.toString())
            });
    }

    /**
     * Requesting currency rates by currency code
     * @param {String} code - international currency code
     */
    function requestCurrency(code) {
        let api = `https://free.currconv.com/api/v7/convert?q=USD_${code}&compact=ultra&apiKey=ee9093278ff1b58f19d4`;
        fetch(api)
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data) {
                    showCurrencyRates(data);
                } else {
                    console.log('error');
                }
                
            })
            .catch(err => {
                console.log("ERROR:", err.toString())
            });
    }

    /**
     * Counts currency rates to $100 and prints it to the .currency
     * @param {Object} obj - object of requestCurrency api response
     */
    function showCurrencyRates(obj) {
        for (item in obj) {
            let name = $('.currency').attr('data-code');
            $('.currency').append(`<br> $100 rate ${+(obj[item]*100).toFixed(2)} ${name}`);
        }
    }
    /**
     * Shows additional country info at the bottom
     * @param {Object} obj  - object returned by requestCountry
     */
    function showCountry(obj) {
        $('#country-full-info').show(1000);
        $('#name').text(obj.name);
        $('#flag').attr("src", `${obj.flag}`);
        $('#flag').attr("alt",`${obj.name} flag`);
        $('#nativeName').text(`${obj.nativeName}`);
        smoothScroll(1000);
        $('#search').val('');
        $('#capital').html(`<p>Capital: </p><p>${obj.capital}</p>`);
        $('#population').html(`<p>Population: </p><p>${((obj.population).toFixed(0))
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} people</p>`);
        $('#area').html(`<p>Area: </p><p>${((obj.area).toFixed(0))
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} sq km</p>`);
        $('#region').html(`<p>Region: </p><p>${obj.region}, ${obj.subregion}</p>`);
        
        showCountryArrayInfo('altSpellings', 'Alternative Spellings:', obj.altSpellings);
        showCountryArrayInfo('topLevelDomain', 'Top Level Domains:', obj.topLevelDomain);
        showCountryArrayInfo('callingCodes', 'Calling Codes:', obj.callingCodes);
        showCountryObjectInfo('languages', 'Languages:', obj.languages, false);
        showCountryObjectInfo('currencies', 'Currencies:', obj.currencies, true);

        // Show borders
        showCountryArrayInfo('borders', 'Borders:', obj.borders);
        for (item of $('#borders p') ) {
            if ( SET.includes(item.innerText)) {
                getNameByCode(item);
            }
        }
        
    }

    /**
     * Using in showCountry
     * Show additional country info for keys which contain arrays
     * @param {String} id - paragraphs id
     * @param {String} text - paragraphs inner text
     * @param {Array} arr - array of data from requestCountry objects keys
     */
    function showCountryArrayInfo(id, text, arr) {
        $(`#${id}`).empty();
        $('<p>', {
            text: text,
        }).appendTo(`#${id}`);
        $('<div>').appendTo(`#${id}`);
        for (item of arr) {
            $('<p>', {
                text: `${item}`,
            }).appendTo(`#${id} div`);
        }
    }

    /**
     * Using in showCountry
     * Show additional country info for keys which contain objects
     * @param {String} id - paragraphs id
     * @param {String} text - paragraphs inner text
     * @param {Array} arr array of data from requestCountry objects keys
     * @param {Boolean} curr - true if it is currency, false in all other cases
     */
    function showCountryObjectInfo(id, text, arr, curr) {
        let counter = 0;
        $(`#${id}`).empty();
        $('<p>', {
            text: text,
        }).appendTo(`#${id}`);
        $('<div>').appendTo(`#${id}`);
        
        for (item of arr) {
            if (curr) {
                counter++;
                $('<p>', {
                    text: `${item.symbol}, ${item.name}`,
                    addClass: (`currency`),
                    attr: {'data-code': `${item.symbol}`},
                }).appendTo(`#${id} div`);
                requestCurrency(item.code) ;
                //showCurrencyRates({test: 2}); // requestCurrency free API has just 100 requests per hour. 
                                                // For developers purpose better to use this manuall settings of currency rates

                // Some countries have a lot of official currencies. For example, Zimbabwe. I decided 2 are enough
                if (counter == 1 ) {
                    break;
                }
            } else {
                $('<p>', {
                    text: `${item.name}`,
                }).appendTo(`#${id} div`);
            }
            
        }
    }

    /**
     * Forms the list of countries according to search
     * @param {Array} arr - array of countries list
     */
    async function results(arr) {
        $('#results').empty();
        $('#country-full-info').hide();
        let counter = 0;
        for (item of arr) {
            
            if ( ((item.name).toLowerCase()).indexOf($('#search').val()) >=0 ) {
                counter++;
                $('<li>', {
                    text: item.name,
                    addClass: 'slideInLeft wow',
                }).attr(`data-code`, `${item.alpha3Code}`)
                    .appendTo(`#results`);
                await sleep(15);
                if (counter == MAX_COUNTRIES_TO_SHOW ) {
                    break;
                }
            } else if ($('#select').val() != 'name' ) {
                counter++;
                $('<li>', {
                    text: item.name,
                    addClass: 'slideInLeft wow',
                }).attr(`data-code`, `${item.alpha3Code}`)
                    .appendTo(`#results`);
                await sleep(15);
                if (counter == MAX_COUNTRIES_TO_SHOW ) {
                    break;
                }
            }
        }
    }

    /**
     * Holds for "ms" milliseconds
     * @param {Number} ms 
     */
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

    /**
     * Set color of area on the map
     * @param {string} code - alpha3Code of country ("UKR", "SWE" or any from SET)
     * @param {string} color - rgb color ("rgb(255, 0, 0)")
     */
    function setCountryColor(code, color) {
        //taking list of all elements with class equal to current alpha3Code
        let country = $(`.${code}`);
        //changing color of each element of the list to "color"
        for (let i = 0; i < country.length; i++) {
            country[i].style.fill = color;
        }
    }

    /**
     * Removing all highlight color effects over the map
     */
    function removeHighLight() {
        //taking alpha3Code from the SET one by one
        for (code of SET) {
            //setting color for each path to default
            setCountryColor(code, DEFAULT_COLOR);
        }
    }

    /**
     * Highlighting all areas of the map with class = country alpha3Code from restcountries api
     * @param {array} arr - data array from restcountries api
     */
    function searchHighlight(arr) {
        removeHighLight();

        // taking countries from the array one by one
        for (item of arr) {
            let code = item.alpha3Code;
            setCountryColor(code, SEARCH_COLOR);
        }
    }

    /**
     * Choosing country by click on map with highlighting
     */
    function mapCountryChoose() {
        $('svg').on('click', (e) => {
            removeHighLight();
            $('#results').empty();
            //check whether chosen path has class (is this region in SET)
            if ( $(e.target).attr('class') ) {
                //taking alpha3Code from class value
                let code = $(e.target).attr('class');
                console.log(code);
                //setting color for each path with code equal to chosen one to CLICK_COLOR
                setCountryColor(code, CLICK_COLOR);
                requestCountry(code);
                
            } else {
                $('#country-full-info').hide(500);
            }
        });
    }

    /**
     * Hover effects over the map
     */
    function mapHover() {
        $('path').hover( 
            function(e) {
                //check whether chosen path has class (is this region in SET)
                if ( $(e.target).attr('class') ) {
                    let code = $(e.target).attr('class');
                    // if area is in SET and there is no other effects (area wasn't under search or click effects),
                    // set to all code areas to HOVER_COLOR
                    if (this.style.fill == DEFAULT_COLOR) {
                        setCountryColor(code, HOVER_COLOR);
                    }
                //in case area is not in database set NOT_IN_DB_HOVER_COLOR
                } else if (this.style.fill == DEFAULT_COLOR) {
                    this.style.fill = NOT_IN_DB_HOVER_COLOR;
                }
                
            },
            function(e) {
                //check whether chosen path has class (is this region in SET)
                if ( $(e.target).attr('class') ) {
                    let code = $(e.target).attr('class');
                    // if area is in SET and there is no other effects but HOVER_COLOR (area wasn't under search or click effects),
                    // set to all code areas to DEFAULT_COLOR
                    if (this.style.fill == HOVER_COLOR) {
                        setCountryColor(code, DEFAULT_COLOR);
                    }
                //in case area is not in database set DEFAULT_COLOR back
                } else if (this.style.fill == NOT_IN_DB_HOVER_COLOR) {
                    this.style.fill = DEFAULT_COLOR;
                }
                
        });
    };

    /**
     * Hover effects of the map when user hovers country name from the list
     */
    function resultsHover() {
        $('#results').on('mouseenter', 'li', (e) => {
            //check whether chosen path has class (is this region in SET)
            if ( $(e.target).attr('data-code') ) {
                let code = $(e.target).attr('data-code');
                setCountryColor(code, CLICK_COLOR);
            }
        });

        $('#results').on('mouseleave', 'li', (e) => {
            if ( $(e.target).attr('data-code') ) {
                let code = $(e.target).attr('data-code');
                setCountryColor(code, SEARCH_COLOR);
            }
        });
    }

    /**
     * Show additional country info on click on countries list
     */
    function resultsClick() {
        $('#results').on('click', 'li', (e) => {
            if ( $(e.target).attr('data-code') ) {
                $('#results').empty();
                removeHighLight();
                let code = $(e.target).attr('data-code');
                setCountryColor(code, CLICK_COLOR);
                requestCountry(code);
            }
        });
    }

    /**
     * If there is no such country it highligts the map and clear all info
     */
    function error() {
        for (code of SET) {
            setCountryColor(code, ERROR_COLOR);
        }
        $('#country-full-info').hide();
        $('#results').empty();
        let p = document.createElement('li');
        p.innerText = "Country was not found";
        $('#results').append(p);
    }

    /**
     * Makes smooth scroll to country additional info
     * @param {Number} time - in ms
     */
    function smoothScroll(time) {
        let top = $('#name').offset().top;
        $('body,html').animate({scrollTop: top}, time);
    }

    
    /**
     * Sets a pin image under the country and runs setVisited()
     */
    function mapRightClick() {
        $('svg').on('contextmenu', (e) => {
            
            e.preventDefault(); 
            
            if ( $(e.target).attr('class') ) {
                
                $(`#pin-${$(e.target).attr('class')}`).remove();
                $('<img>', {
                    width: '20px',
                    height: "20px"
                })
                .attr("src", "img/pin2.svg")
                .attr("id", `pin-${$(e.target).attr('class')}`)
                .css("position", "absolute")
                .css("top", `${e.pageY - 20}px`)
                .css("left", `${e.pageX - 20/2}px`)
                .addClass('img-pin')
                .appendTo('.map');

                setVisited( $(e.target).attr('class') );
            }
        });
    }
    
    /**
     * Deletes pin image after right click on it and rund deleteVisited()
     */
    function pinImgRightClick() {
        $('.map').on('contextmenu', (e) => {
            
            if ( $(e.target).hasClass('img-pin') ) {
                let code = $(e.target).attr('id');
                code = code.slice(4);
                e.preventDefault(); 
                $(e.target).remove();
                deleteVisited(code);
            }
        });
    }

    /**
     * Pushes code of country to local storage
     * @param {String} code - 3-letters alpha3code of country
     */
    function setVisited(code) {
        let visitedCountries = [];
        if (window.localStorage.getItem('visitedCountries')) {
            visitedCountries = JSON.parse(window.localStorage.getItem('visitedCountries'));
        }
        if (!visitedCountries.includes(code)) {
            visitedCountries.push(code);
        }
        window.localStorage.setItem('visitedCountries', JSON.stringify(visitedCountries));
    }

    /**
     * Deletes code of country from local storage
     * @param {String} code -  3-letters alpha3code of country
     */
    function deleteVisited(code) {
        let visitedCountries = [];
        if (window.localStorage.getItem('visitedCountries')) {
            visitedCountries = JSON.parse(window.localStorage.getItem('visitedCountries'));
        }
        if (visitedCountries.includes(code)) {
            visitedCountries.splice(visitedCountries.indexOf(code), 1);
        }
        window.localStorage.setItem('visitedCountries', JSON.stringify(visitedCountries));
    }

    /**
     * Sets pin images on the map over countries which were saved in local storage as visited
     */
    function showVisited() {
        let visitedCountries = [];
        if (window.localStorage.getItem('visitedCountries')) {
            visitedCountries = JSON.parse(window.localStorage.getItem('visitedCountries'));
        } 
        for (country of visitedCountries) {
            let path = $(`.${country}`);
            console.log(country);
            let biggest = 0;
            if (path.length > 1) {
                // there can be more than 1 path for one country, so we select the biggest one
                for (let i = 0; i < path.length; i++) {
                    $(path[biggest]).attr('d').length < $(path[i]).attr('d').length ? biggest = i : biggest;
                }
                // Accidentally on my map path of Alaska is bigger. I manually set biggest path
                country == "USA" ? biggest = 1: biggest;
            }

            let width = path[biggest].getBBox().width;
            let height = path[biggest].getBBox().height;
            let top = $(path[biggest]).offset().top;
            let left = $(path[biggest]).offset().left;
            var c = 2; // coefficient for better complience of pin position for country shape
            
            if ( $(window).width() < 1200 ) {
                c = 4;
            } else if ( $(window).width() < 1500) {
                c = 2.5;
            }

            $('<img>', {
                width: '20px',
                height: "20px"
            })
            .attr("src", "img/pin2.svg")
            .attr("id", `pin-${country}`)
            .addClass('img-pin')
            .css("position", "absolute")
            .css("top", `${top + height/c -20}px`)
            .css("left", `${left + width/c - 10}px`)
            .appendTo('.map');
        }
        // Shape of Norway is too hard. So there are some special pin position settings for Norway
        if ( $('#pin-NOR').length > 0) {
            let path = $(`.NOR`);
            let biggest = 0;
            let width = path[biggest].getBBox().width;
            let height = path[biggest].getBBox().height;
            let top = $(path[biggest]).offset().top;
            let left = $(path[biggest]).offset().left;
            $('#pin-NOR').css("top", `${top + height/1.4 -20}px`)
                        .css("left", `${left + width/10 - 10}px`)
        }
        
    }

    $( "#nav-trigger" ).click(function(){ 
        $( "#header-menu" ).slideToggle();
        $( "#nav-trigger" ).toggleClass('nav-trigger-active');
    });


    
});

