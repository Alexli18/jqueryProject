let chartData = [];
// array of toggle id`s for charts 
let toggleData = [];
// all data from api
let coinsData = [];
// charts interval
let interval;
// time line for charts
let timeLine = [0];
let counter = 1;




////////////////////////////////////////
////// DRAW COMPONENT OF CRYPTO ITEM
///////////////////////////////////////
function drawItem(arr) {
    for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        // console.log(element);
        //create col
        let col = `<div class="col-xl-4 col-12 col-md-4 col-lg-4" id="card_${element.id}">`;
        col += "</div>";
        //create item card
        let cryptoItem = '<div class="crypto-item">';

        // item header
        cryptoItem += `<div class="crypto-item-header d-flex justify-content-between">`;
        cryptoItem += `<div class="h3">${element.symbol}</div>`;
        cryptoItem += `<input type="checkbox" id="toogle_${element.id}" data-toggle="toggle" data-size="sm" class="crypto-item-toogle onchange="toggleLocal(${element.id})">`;
        cryptoItem += `</div>`;

        // item body
        cryptoItem += `<div class="crypto-item-body">`;
        cryptoItem += ` <p>${element.name}</p>`;
        cryptoItem += `<button class="crypto-item-btn btn btn-primary" type="button" data-toggle="collapse" data-target="#collapseMoreInfo_${index}" aria-expanded="false" id="btn_${element.id}">More Info</button>`;
        cryptoItem += `<div class="collapse" id="collapseMoreInfo_${index}">`;
        cryptoItem += `<div class="card card-body" id='${element.id}'>`;
        cryptoItem += `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
        cryptoItem += `</div>`;
        cryptoItem += `</div>`;
        cryptoItem += `</div>`;

        cryptoItem += "</div>";
        $("#homeContainer").append(col);
        $(`#card_${element.id}`).append(cryptoItem);

        $(`#toogle_${element.id}`).change((e) => {
            let toggleState = e.currentTarget.checked;
            /////////////////
            // TOGGLE HANDLER
            /////////////////
            ////////////////            
            toggleHandler(toggleState, element);


        })

    }
}
/////////////////
// TOGGLE HANDLER
/////////////////
function toggleHandler(state, element) {
    console.log('state: ' + state);
    console.log('element: ' + element);
    //  toggle  ON
    if (state) {
        // if toggle data > 5 items
        if (toggleData.length > 4) {
            toggleData.push({
                id: element.id,
                symbol: element.symbol
            });
            //////////////
            /// draw modal
            /////////////
            console.log(toggleData);
            drawModal(toggleData);
            $('#staticBackdrop').modal('show')
        } else {
            // push to array
            // alert('works');
            toggleData.push({
                id: element.id,
                symbol: element.symbol
            });
            console.log(toggleData);

        }
    }
    // toggle OFF
    else {
        //change toggle by id
        toggleData = removeByValue(toggleData, element.id, "id");
    }
}

// start load
if (getDataFromLocal('cardsData')) {
    drawItem(getDataFromLocal('cardsData'));
    coinsData = getDataFromLocal('cardsData');
} else {
    $.get('https://api.coingecko.com/api/v3/coins/').then((res) => {
        coinsData = res.map(function (item) {
            return {
                name: item.name,
                id: item.id,
                symbol: item.symbol
            }
        })
        setDataToLocalByName(coinsData, 'cardsData');
        drawItem(coinsData);
        console.log("COINS DATA" + coinsData)
    })
}

//////////////////////////
///// DRAW MODAL
/////////////////////////
function drawModal(array) {
    $("#modalBody").empty();

    for (let i = 0; i < array.length; i++) {
        const coinName = array[i].id;
        // MODAL BODY model
        let modalBody = '<div class="form-check form-check-inline">';
        modalBody += `<input class="form-check-input" type="checkbox" id="inlineCheckbox${i}" value="option${i}">`;
        modalBody += `<label class="form-check-label" for="inlineCheckbox1">${coinName}</label>`;
        modalBody += '</div>';

        // DRAW
        $("#modalBody").append(modalBody);

        $(`#inlineCheckbox${i}`).click((e) => {
            let modalItemState = e.target.checked;
            let modalItemID = array[i].id;
            ///////////////////
            //// MODAL HANDLER
            //////////////////

            modalHandler(modalItemID, modalItemState, i, array[i].symbol);
        })
    }
}
// MODAL BUTTON
$("#modalBtn").click(() => {
    //CLOSE MODAL
    $('#staticBackdrop').modal('hide');
    // TURN OFF ALL TOGGLES
    $(".crypto-item-toogle").bootstrapToggle('off');
    // reset toggle data with modal selected items
    let selectedData = selectedItems;
    // ADD TOGGLE ON TO RELEVANT ITEMS
    for (let index = 0; index < selectedData.length; index++) {
        const element = selectedData[index];
        debugger;
        // toogle_${element.id}  TOOGLE ID
        $(`#toogle_${element.id}`).bootstrapToggle('on');
    }
    toggleData = selectedData;
    selectedItems = [];
    return;

})

///////////////////
//// MODAL HANDLER
//////////////////
let selectedItems = [];

function modalHandler(itemID, state, index, sym) {
    debugger;
    if (state) {
        if (selectedItems.length > 4) {
            $(`#inlineCheckbox${index}`).prop('checked', false);
            // $().prop('checked', false);
            return;
        } else {
            selectedItems.push({
                id: itemID,
                symbol: sym
            });
            console.log(selectedItems)
        }
    } else {
        selectedItems = removeByValue(selectedItems, itemID, "id");
        console.log(selectedItems);
    }

}


////////////////
// MORE INFO
///////////////
$(".crypto-item-btn").click((event) => {
    // more info button ID
    let moreInfoID = event.target.id;
    // collapse id
    moreInfoID = moreInfoID.slice(4);
    let time = new Date();
    console.log("time from jquery***:" + time);
    getMoreInfo(moreInfoID, time)
})
///////////////////////////////
//// get more info with request
///////////////////////////////
function getMoreInfo(id, timeStamp) {
    if (getDataFromLocal(id)) {
        let item = getDataFromLocal(id);
        // TIMER
        // if > 120 sec  
        debugger
        let itemTime = new Date(item.time);
        if (timeStamp - itemTime >= 2 * 60 * 1000) {
            debugger
            let moreInfoData = {
                time: timeStamp,
                imgSrc: '',
                usd: '',
                eur: '',
                ils: ''
            }
            $.get(`https://api.coingecko.com/api/v3/coins/${id}`).then((res) => {
                console.log(res);
                moreInfoData.imgSrc = res.image.thumb;
                moreInfoData.usd = res.market_data.current_price.usd;
                moreInfoData.eur = res.market_data.current_price.eur;
                moreInfoData.ils = res.market_data.current_price.ils;
                console.log(moreInfoData);
                setDataToLocalByName(moreInfoData, id);
                //////////////
                /// draw more info
                drawMoreInfo(id, moreInfoData);
            })
        }
        // get data from local and draw more info
        else {
            console.log(`timeFromEvent: ${timeStamp}`);
            console.log(`timeFromLocal: ${item.time}`);
            drawMoreInfo(id, item);
        }
    } else {
        // create more info obj
        let moreInfoData = {
            time: timeStamp,
            imgSrc: '',
            usd: '',
            eur: '',
            ils: ''
        }
        $.get(`https://api.coingecko.com/api/v3/coins/${id}`).then((res) => {
            console.log(res);
            moreInfoData.imgSrc = res.image.thumb;
            moreInfoData.usd = res.market_data.current_price.usd;
            moreInfoData.eur = res.market_data.current_price.eur;
            moreInfoData.ils = res.market_data.current_price.ils;
            console.log(moreInfoData);
            setDataToLocalByName(moreInfoData, id);
            drawMoreInfo(id, moreInfoData);
        })
    }
}

//////////////////////////////
//// DRAW MORE INFO DATA
/////////////////////////////
function drawMoreInfo(id, data) {
    let moreInfoContainer = '<div>';
    moreInfoContainer += `<img src="${data.imgSrc}" alt="#" >`;
    moreInfoContainer += `<p>USD : ${data.usd}</p>`
    moreInfoContainer += `<p>EUR : ${data.eur}</p>`
    moreInfoContainer += `<p>ILS : ${data.ils}</p>`
    moreInfoContainer += '</div>';
    $(`#${id}`).empty();
    $(`#${id}`).html(moreInfoContainer);
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////
///         LOCAL STORAGE
////////////////////////////////////////////////////////////////////////////////////////////////////////
function getDataFromLocal(name) {
    let localData = window.localStorage.getItem(name);
    if (localData) {
        return JSON.parse(localData);
    } else {
        return false;
    }
}


function setDataToLocalByName(arr, name) {
    debugger;
    let strData = JSON.stringify(arr);
    window.localStorage.setItem(name, strData);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////
/// DRAW EMPTY RESPONSE
//////////////////////
function drawEmptyRes() {
    let message = 'SORRY WE DONT HAVE ANY DATA TO SHOW';
    let messContainer = '<div class="col-9 col-sm-12 ml-auto mr-auto">';
    messContainer += '<div class="mess">';
    messContainer += '<div class="mess_header">';
    messContainer += `<h1> ${message}  </h1>`;
    messContainer += '</div>';
    messContainer += '<div class="mess_body">';
    messContainer += '<img src="./img/emptyResponse.png" alt="empty-response" id="empty">';
    messContainer += '</div>';
    messContainer += '</div>';
    messContainer += '</div>';

    $("#homeContainer").append(messContainer);
}

/////////////////////
///SEARCH BY NAME
////////////////////
function searchByName() {
    let inputData = $('#searchInput').val();
    let newData = coinsData.filter((item) => {
        return item.id.startsWith(inputData)
    })
    // clean cryptoItems zone
    $('#homeContainer').empty();
    // draw new elements
    if (newData.length <= 0) {
        drawEmptyRes();
    } else {
        drawItem(newData);
    }
}


function removeByValue(myArray, value, field) {
    myArray = myArray.filter(function (obj) {
        return obj[field] !== value;
    });
    return myArray;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////     CHARTS                  ////////////////////////////////////////////////
/////////////////////////////////////////     SECOND SCREEN          /////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getDataForCharts() {
    let coinsArr = toggleData;
    let coinsNames = '';
    for (let index = 0; index < coinsArr.length; index++) {
        const element = coinsArr[index].symbol;
        if (index > 0) {
            coinsNames += `,${element}`
        } else {
            coinsNames += element;
        }
    }
    chartData = toggleData.map((item) => {
        return {
            label: item.symbol,
            borderColor: random_rgba(), //// random color TBD
            data: []
        }
    })
    return coinsNames

}
//////////////////////////////////////////////////////////////
/////// SET INTERVAL WHEN NAVIGATE TO CHARTS TAB
/////////////////////////////////////////////////////////////
$("#chart-tab").click(() => {
    let data = getDataForCharts()
    interval = setInterval(() => getCoinsData(data), 2000);
})

$("#home-tab").click(() => {
    clearInterval(interval);
    timeLine = [0];
    counter = 1;
    chartData = [];
})

$("#contact-tab").click(() => {
    clearInterval(interval);
    timeLine = [0];
    counter = 1;
    chartData = [];
})



function drawChart(chartData, timeLine) {
    let ctx = document.getElementById('myChart').getContext('2d');
    let chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: timeLine, /// sec
            datasets: chartData
        },

        // Configuration options go here
        options: {
            animation: {
                duration: 0
            }
        }
        
    })
};

function createDataForCharts(response) {
    console.log(response);
    console.log(counter)
    let time = counter*2
    timeLine.push(time);
    counter++;

    for (let i = 0; i < chartData.length; i++) {
        const element = chartData[i];
        element.data.push(response[element.label.toUpperCase()].USD);
        console.log(element)
        // data structure
        // data: {
        //     labels: ['time'],/// sec
        //     datasets: [{
        //         label: 'BTC',
        //         borderColor: 'rgb(255, 99, 132)',
        //         data: [0, 10, 5, 2, 20, 30, 45]
        //     },
        //     {
        //         label: 'qwer',
        //         borderColor: 'rgb(255, 99, 132)',
        //         data: [0, 170, 65, 266, 620, 730, 45]
        //     }]
    }
}


function getCoinsData(coinsNames) {
    let url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coinsNames}&tsyms=USD`;
    $.get(url).then((res) => {
        if (res) {
            createDataForCharts(res)
            drawChart(chartData, timeLine);
        }

    });
}


// https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD
// $('#chart-tab').click((e) => {}



function random_rgba() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgb(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
}

// var color = random_rgba();

// g.fillStyle   = color;
// g.strokeStyle = color;