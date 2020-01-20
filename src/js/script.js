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
    const DEFAULT_COLOR = "rgb(150, 150, 150)";
    const HOVER_COLOR = "rgb(100, 100, 100)";
    const NOT_IN_DB_HOVER_COLOR = "rgb(0, 0, 255)";
    const CLICK_COLOR = "rgb(255, 0, 0)";
    const SEARCH_COLOR = "rgb(74, 128, 74)";
    const ERROR_COLOR = "rgb(255, 214, 214)";

    const MAX_COUNTRIES_TO_SHOW = 8;

    let borderCountryName;
    
    init();

    function init() {
        mapHover();
        mapCountryChoose();
        resultsHover();
        resultsClick();
        new WOW().init();
        $('#country-full-info').hide();
    
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

    function requestCurrency(code) {
        let api = `https://free.currconv.com/api/v7/convert?q=USD_${code}&compact=ultra&apiKey=ee9093278ff1b58f19d4`;
        fetch(api)
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data) {
                    console.log(data);
                    showCurrencyRates(data);
                } else {
                    console.log('error');
                }
                
            })
            .catch(err => {
                console.log("ERROR:", err.toString())
            });
    }

    function showCurrencyRates(obj) {
        for (item in obj) {
            let name = $('.currency').attr('code');
            $('.currency').append(`<br> $100 rate ${+(obj[item]*100).toFixed(2)} ${name}`);
        }
    }

    function showCountry(obj) {
        $('#country-full-info').show(1000);
        // console.log(obj);
        $('#name').text(obj.name);
        $('#flag').attr("src", `${obj.flag}`);
        $('#flag').attr("alt",`${obj.name} flag`);
        $('#nativeName').text(`${obj.nativeName}`);
        smoothScroll(1000);
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
                    attr: {'code': `${item.symbol}`},
                }).appendTo(`#${id} div`);
                requestCurrency(item.code) ;
                //showCurrencyRates({test: 2})
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

    async function results(arr) {
        $('#results').empty();
        let counter = 0;
        for (item of arr) {
            counter++;
            let name = item.name;
            let li = document.createElement('li');
            let code = item.alpha3Code;
            li.innerText = name;
            li.classList.add('slideInLeft');
            li.classList.add('wow');
            li.setAttribute(`code`, `${code}`);
            $('#results').append(li);
            await sleep(15);
            if (counter == MAX_COUNTRIES_TO_SHOW ) {
               break;
            }
        }
    }

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
            //console.log(item);
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
                //setting color for each path with code equal to chosen one to CLICK_COLOR
                setCountryColor(code, CLICK_COLOR);
                requestCountry(code);
                
            } else {
                $('#country-full-info').hide(500);
            }
            //console.log(`${e.target.id}"`);
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

    function resultsHover() {
        $('#results').on('mouseenter', 'li', (e) => {
            //console.log('Hover results on');
            //check whether chosen path has class (is this region in SET)
            if ( $(e.target).attr('code') ) {
                let code = $(e.target).attr('code');
                setCountryColor(code, CLICK_COLOR);
            }
        });

        $('#results').on('mouseleave', 'li', (e) => {
            //console.log('Hover results off');
            if ( $(e.target).attr('code') ) {
                let code = $(e.target).attr('code');
                setCountryColor(code, SEARCH_COLOR);
            }
        });
    }

    function resultsClick() {
        $('#results').on('click', 'li', (e) => {
            if ( $(e.target).attr('code') ) {
                $('#results').empty();
                removeHighLight();
                let code = $(e.target).attr('code');
                setCountryColor(code, CLICK_COLOR);
                requestCountry(code);
            }
        });
    }

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

    function smoothScroll(time) {
        let top = $('#name').offset().top;
        $('body,html').animate({scrollTop: top}, time);
    }
    
});

