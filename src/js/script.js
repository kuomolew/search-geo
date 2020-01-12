$( () => {
    
    const SET = ["UKR", "PRK", "RUS", "FRA", "ESP", "SWE", "NOR", "DEU", "FIN", "POL", "ITA", "GBR", "ROU", "BLR", "KAZ", "GRC",
                 "BGR", "ISL", "HUN", "PRT", "AUT", "CZE", "SRB", "IRL", "LTU", "LVA", "HRV", "BIH", "SVK", "EST", "DNK", "CHE",
                 "NLD", "MDA", "BEL", "ARM", "ALB", "MKD", "TUR", "SVN", "MNE", "CYP", "AZE", "LUX", "SGS", "AND", "MLT", "LIE",
                 "SMR", "MCO", "VAT", "GIB", "NGA", "ETH", "EGY", "COD", "ZAF", "TZA", "KEN", "SDN", "DZA", "UGA", "MAR", "MOZ",
                 "GHA", "AGO", "CIV", "MDG", "CMR", "NER", "BFA", "MLI", "MWI", "ZMB", "SOM", "SEN", "TCD", "ZWE", "RWA", "TUN",
                 "GIN", "BEN", "BDI", "SSD", "TGO", "ERI", "SLE", "LBY", "COG", "CAF", "LBR", "MRT", "NAM", "BWA", "LSO", "GMB",
                 "GAB", "GNB", "GNQ", "SWZ", "DJI", "ESH", "USA", "MEX", "CAN", "GTM", "CUB", "HTI", "DOM", "HND", "SLV", "NIC",
                 "CRI", "PAN", "PRI", "JAM", "TCA", "BLZ", "BRA", "COL", "ARG", "PER", "VEN", "CHL", "ECU", "BOL", "PRY", "URY",
                 "GUY", "SUR", "GUF", "CHN", "IND", "SAU", "IRN", "MNG", "IDN", "PAK", "MMR", "AFG", "YEM", "THA", "TKM", "UZB",
                 "IRQ", "JPN", "VNM", "MYS", "OMN", "PHL", "LAO", "KGZ", "SYR", "KHM", "BGD", "NPL", "TJK", "KOR", "JOR", "ARE",
                 "LKA", "BTN", "TWN", "KWT", "TLS", "QAT", "LBN", "ISR", "BRN", "BHR", "SGP", "HKG", "MAC", "AUS", "PNG", "NZL",
                 "FJI", "NCL", "SLB"];
    const DEFAULT_COLOR = "rgb(185, 185, 185)";
    const HOVER_COLOR = "rgb(0, 255, 0)";
    const NOT_IN_DB_HOVER_COLOR = "rgb(0, 0, 0)";
    const CLICK_COLOR = "rgb(255, 0, 0)";
    const HIGHLIGHT_COLOR = "rgb(0, 0, 255)";

    console.log(SET.length);
    
    mapHover();
    mapCountryChoose();

    // $('#search').on('keyup', (e) => {
    //     e.preventDefault();
    //     removeHighLight();
    //     if ( $('#search').val() ) {
    //         let search = $('#search').val();
    //         let type = $('#select').val();
    //         request(search, type);
    //     }
    // });

    $('#button').on('click', (e) => {
        e.preventDefault();
        removeHighLight();
        if ( $('#search').val() ) {
            let search = $('#search').val();
            let type = $('#select').val();
            request(search, type);
        }
    });

    
    function request(search, type) {
        let  api = `https://restcountries.eu/rest/v2/`;
        if (type == 'name') {
            api = `${api}name/${search}`;
        } else if (type == 'capital') {
            api = `${api}capital/${search}`;
        } else {
            console.log('Request type error!');
        }
        console.log(api);

        fetch(api)
            .then(response => {
                return response.json();
            })
            .then(data => {
                //console.log(data);
                if (data.status != 404) {
                    searchHighlight(data);
                } else {
                    console.log('a4ibka');
                }
                
            })
            .catch(err => {
                console.log("ERROR:", err.toString())
            });
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
            console.log(item);
            let code = item.alpha3Code;
            setCountryColor(code, HIGHLIGHT_COLOR);
        }
    }

    /**
     * Choosing country by click on map with highlighting
     */
    function mapCountryChoose() {
        $('svg').on('click', (e) => {
            removeHighLight();
            //check whether chosen path has class (is this region in SET)
            if ( $(e.target).attr('class') ) {
                //taking alpha3Code from class value
                let code = $(e.target).attr('class');
                console.log(code);
                //setting color for each path with code equal to chosen one to CLICK_COLOR
                setCountryColor(code, CLICK_COLOR);
            }
            console.log(`${e.target.id}"`);
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
    
});

