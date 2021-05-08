//var axios = require("axios").default;
//  async function loadWeather(event) {
//     event.preventDefault();
//     let thisinp = $('input[id=inpLoc]').val();
//     const result = await axios({
//         method: 'GET',
//         url: 'http://api.weatherapi.com/v1/current.json',
//         params: { q: thisinp },
//         headers: {
//             'key': '32d54b92389b40318a7100305210805',
//         }
//     })
//     axios.request(result).then(function (response) {
//         console.log(response.data);
//         $('.location').html('Location: ' + response.data['location']['name']);
//         $('.temper').html('Current temperature: ' + response.data['current']['temp_f'] + ' F');
//         $('.desc').html('Description: ' + response.data['current']['condition']['text']);
//     }).catch(function (error) {
// 	    console.error(error);
//     });
//     $('#card1').replaceWith(load());
//     return result;
// };

//const { default: axios } = require("axios");


//  function formedit(event){
//     const $root = $('#root');
//     let thisform = `<form class="weather">
//                     <label for="location">City:</label>
//                     <br>
//                     <input id="inpLoc" type="text" name="location">
//                     <button class="submit" type="submit">Submit</button>
//                 </form>`;
//     $('#weatherCheck').replaceWith(thisform);
//     formtemp = event.target.value;
//     $root.on("submit",".weather", loadWeather);
// }

//  function load() {
//     const $root = $('#root');
//     let page = ``
//     const loadinfo = async function () {
//         page += `<div id=card1>
//                 <h2>
//                     Check current weather in...
//                 </h2>`
//         tweets += (`<div id="weatherCheck">
//                 <button class="check" type="button">Check</button>
//             </div>`);
//         $root.on("click", ".check", formedit);
//         $root.append(page);
//     }
//     loadinfo();
// }




// $('input[id=loadWeather]').on('click', async function () {
//     alert('entered butn click')
    let thisinp = $('input[id=inpLoc]').val();
    console.log(thisinp);
    let result = {
        method: 'GET',
        url: 'http://api.weatherapi.com/v1/current.json',
        params: {q: thisinp},
        headers: {
            'key': '32d54b92389b40318a7100305210805',
        }
    };

    axios.request(result).then(function (response) {
        console.log(response.data);
        $('.location').html('Location: ' + response.data['location']['name']);
        $('.temper').html('Current temperature: ' + response.data['current']['temp_f'] + ' F');
        $('.desc').html('Description: ' + response.data['current']['condition']['text']);
    }).catch(function (error) {
        console.error(error);
    });
//});


